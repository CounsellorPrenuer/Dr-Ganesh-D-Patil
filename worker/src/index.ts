export interface Env {
  DB: D1Database;
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  RAZORPAY_WEBHOOK_SECRET: string;
  SANITY_READ_TOKEN?: string;
  ALLOWED_ORIGINS: string;
  VALID_PROJECT_IDS: string;
}

type Body = Record<string, unknown>;
const encoder = new TextEncoder();

const PLAN_PRICES: Record<string, number> = {
  "pkg-1": 5500,
  "pkg-2": 15000,
  "pkg-3": 5999,
  "pkg-4": 10599,
  "pkg-5": 6499,
  "pkg-6": 10599,
  "mp-3": 6499,
  "mp-2": 10599,
  "career-report": 1500,
  "career-report-counselling": 3000,
  "knowledge-gateway": 100,
  "one-to-one-session": 3500,
  "college-admission-planning": 3000,
  "exam-stress-management": 1000,
  "cap-100": 199,
};

const CMS_PROJECTS: Record<string, string> = {
  mariapawar: "zd6zrruu",
  rajivbanerjee: "8j37l731",
  thinknextcareers: "dxeej4rn",
  careercounselor: "qc7z49n6",
  iqeducenter: "unau8qvi",
  "pichika-mallikarjuna-rao": "9sag37n0",
  eagleeyefocus: "dizffr9l",
  growthplatteracademy: "d6qzpqiq",
  drganeshdpatil: "xi1ios8w",
};

const CMS_CONFIGURED = new Set(Object.keys(CMS_PROJECTS));

function response(data: unknown, status = 200, origin = "") {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...(origin ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}),
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    },
  });
}

function allowedOrigin(request: Request, env: Env) {
  const origin = request.headers.get("Origin") || "";
  return env.ALLOWED_ORIGINS.split(",").map((item) => item.trim()).includes(origin) ? origin : "";
}

function validProject(projectId: string, env: Env) {
  return env.VALID_PROJECT_IDS.split(",").map((item) => item.trim()).includes(projectId);
}

function canonicalPlanId(projectId: string, rawPlanId: string) {
  let planId = rawPlanId.trim();
  const projectPrefix = `${projectId}-`;
  if (planId.startsWith(projectPrefix)) planId = planId.slice(projectPrefix.length);
  if (planId.startsWith("custom-")) planId = planId.slice("custom-".length);
  return planId;
}

function planAmount(projectId: string, rawPlanId: string, requestedAmount: unknown) {
  const canonical = canonicalPlanId(projectId, rawPlanId);
  const amount = PLAN_PRICES[canonical];
  if (amount) return { canonical, amount };

  const fallback = Number(requestedAmount);
  if (Number.isFinite(fallback) && fallback > 0) {
    return { canonical, amount: Math.round(fallback) };
  }

  throw new Error("Invalid plan_id");
}

async function couponFor(env: Env, projectId: string, code: string) {
  return env.DB.prepare(
    "SELECT code, discount_type, COALESCE(discount_value, value) AS discount_value, min_amount, max_discount, active, expires_at FROM coupons WHERE project_id = ? AND code = ? LIMIT 1",
  ).bind(projectId, code).first<{
    code: string;
    discount_type: string;
    discount_value: number;
    min_amount: number;
    max_discount: number | null;
    active: number;
    expires_at: string | null;
  }>();
}

function discounted(amount: number, coupon: Awaited<ReturnType<typeof couponFor>>) {
  if (!coupon || coupon.active !== 1 || amount < Number(coupon.min_amount || 0)) {
    return { valid: false, discountAmount: 0, finalAmount: amount };
  }
  if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
    return { valid: false, discountAmount: 0, finalAmount: amount };
  }
  const raw = coupon.discount_type === "fixed" || coupon.discount_type === "flat"
    ? Number(coupon.discount_value)
    : Math.round(amount * Number(coupon.discount_value) / 100);
  const capped = coupon.max_discount ? Math.min(raw, Number(coupon.max_discount)) : raw;
  const discountAmount = Math.max(0, Math.min(amount, Math.round(capped)));
  return { valid: true, discountAmount, finalAmount: amount - discountAmount };
}

async function razorpayOrder(env: Env, amountInPaise: number, receipt: string) {
  const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
  const result = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: amountInPaise, currency: "INR", receipt, payment_capture: 1 }),
  });
  const text = await result.text();
  if (!result.ok) throw new Error("Razorpay order creation failed");
  try {
    return JSON.parse(text) as { id: string; amount: number; currency: string };
  } catch {
    throw new Error("Razorpay returned an invalid response");
  }
}

async function hmac(secret: string, value: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(signature)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

const CMS_QUERY = `{
  "standardPlans": *[_type == "standardPlan"] | order(order asc){_id,planId,title,subgroup,price,features,image,order},
  "customPlans": *[_type == "customPlan"] | order(order asc){_id,planId,title,price,description,image,order},
  "blogPosts": *[_type == "blogPost"] | order(publishedAt desc){_id,title,"slug":slug.current,excerpt,author,publishedAt,featured,image,body},
  "services": *[_type == "services"] | order(order asc){_id,title,description,link,image,order},
  "testimonials": *[_type == "testimonials"] | order(order asc){_id,name,role,quote,rating,image}
}`;

async function fetchSanityCms(sanityProjectId: string) {
  const encoded = encodeURIComponent(CMS_QUERY);
  const endpoints = [
    `https://${sanityProjectId}.apicdn.sanity.io/v2026-06-01/data/query/production?query=${encoded}`,
    `https://${sanityProjectId}.api.sanity.io/v2026-06-01/data/query/production?query=${encoded}`,
  ];
  for (const endpoint of endpoints) {
    const sanityResponse = await fetch(endpoint, { headers: { Accept: "application/json" } });
    if (!sanityResponse.ok) continue;
    const sanityData = await sanityResponse.json<{ result?: unknown }>();
    if (sanityData.result) return sanityData.result;
  }
  throw new Error("Sanity content is unavailable");
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = allowedOrigin(request, env);
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return origin ? new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          Vary: "Origin",
        },
      }) : response({ error: "Origin not allowed" }, 403);
    }

    if (url.pathname === "/health" && request.method === "GET") {
      return response({ ok: true, worker: "multi-tenant-platform" }, 200, origin);
    }
    if (request.method !== "POST") return response({ error: "Method not allowed" }, 405, origin);
    if (!origin) return response({ error: "Origin not allowed" }, 403);

    let body: Body;
    try {
      body = await request.json<Body>();
    } catch {
      return response({ error: "Invalid JSON" }, 400, origin);
    }

    const projectId = String(body.project_id || "").trim();
    if (!validProject(projectId, env)) return response({ error: "Invalid project_id" }, 400, origin);

    try {
      if (url.pathname === "/api/cms/bootstrap") {
        const sanityProjectId = CMS_PROJECTS[projectId];
        if (!sanityProjectId || !CMS_CONFIGURED.has(projectId)) {
          return response({ error: "CMS is not configured for this project" }, 404, origin);
        }
        return response(await fetchSanityCms(sanityProjectId), 200, origin);
      }

      if (url.pathname === "/api/forms/submit") {
        const name = String(body.name || "").trim();
        const email = String(body.email || "").trim();
        const phone = String(body.phone || "").trim();
        const planId = String(body.plan_id || "").trim();
        if (!name || !email) {
          return response({ error: "name and email are required" }, 400, origin);
        }
        const leadId = crypto.randomUUID();
        await env.DB.prepare(
          "INSERT INTO leads (id, form_type, name, email, phone, message, metadata, source, submitted_at, project_id, plan_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        ).bind(
          leadId, "contact", name, email, phone, String(body.message || ""), JSON.stringify({ serviceType: body.serviceType || null }),
          "website", new Date().toISOString(), projectId, planId || "contact",
        ).run();
        return response({ ok: true, lead_id: leadId }, 200, origin);
      }

      if (url.pathname === "/api/coupons/preview") {
        const rawPlanId = String(body.plan_id || "").trim();
        if (!rawPlanId) return response({ error: "plan_id is required" }, 400, origin);
        const { amount } = planAmount(projectId, rawPlanId, body.amount);
        const code = String(body.code || body.coupon_code || "").trim().toUpperCase();
        const coupon = code ? await couponFor(env, projectId, code) : null;
        const result = discounted(amount, coupon);
        return response({
          code,
          valid: result.valid,
          discountAmount: result.discountAmount,
          discount_amount: result.discountAmount,
          finalAmount: result.finalAmount,
          final_amount: result.finalAmount,
          message: result.valid ? `Coupon applied. You saved Rs. ${result.discountAmount}.` : "Coupon is invalid or inactive.",
        }, 200, origin);
      }

      if (url.pathname === "/api/payments/create-order") {
        const rawPlanId = String(body.plan_id || "").trim();
        const name = String(body.name || "").trim();
        const email = String(body.email || "").trim();
        const phone = String(body.phone || "").trim();
        if (!rawPlanId || !name || !email || !phone) {
          return response({ error: "name, email, phone and plan_id are required" }, 400, origin);
        }
        const { canonical, amount } = planAmount(projectId, rawPlanId, body.amount);
        const couponCode = String(body.coupon_code || "").trim().toUpperCase();
        const coupon = couponCode ? await couponFor(env, projectId, couponCode) : null;
        const discount = discounted(amount, coupon);
        const leadId = crypto.randomUUID();
        await env.DB.prepare(
          "INSERT INTO leads (id, form_type, name, email, phone, message, metadata, source, submitted_at, project_id, plan_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        ).bind(leadId, "checkout", name, email, phone, "", JSON.stringify({ coupon: couponCode || null }), "website", new Date().toISOString(), projectId, canonical).run();

        const order = await razorpayOrder(env, discount.finalAmount * 100, `${projectId.slice(0, 12)}_${Date.now().toString(36)}`);
        const paymentId = crypto.randomUUID();
        await env.DB.prepare(
          "INSERT INTO payments (id, order_id, plan_id, customer_name, customer_email, customer_phone, coupon_code, base_amount, discount_amount, final_amount, status, razorpay_payment_id, created_at, updated_at, project_id, razorpay_order_id, amount, currency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        ).bind(
          paymentId, order.id, canonical, name, email, phone, couponCode || null, amount, discount.discountAmount,
          discount.finalAmount, "created", "", new Date().toISOString(), new Date().toISOString(), projectId, order.id, discount.finalAmount, "INR",
        ).run();

        return response({
          key_id: env.RAZORPAY_KEY_ID,
          order_id: order.id,
          amount: order.amount,
          currency: order.currency || "INR",
          lead_id: leadId,
          final_amount: discount.finalAmount,
        }, 200, origin);
      }

      if (url.pathname === "/api/payments/verify") {
        const orderId = String(body.razorpay_order_id || "");
        const paymentId = String(body.razorpay_payment_id || "");
        const signature = String(body.razorpay_signature || "");
        if (!orderId || !paymentId || !signature) return response({ error: "verification payload is incomplete" }, 400, origin);
        const expected = await hmac(env.RAZORPAY_KEY_SECRET, `${orderId}|${paymentId}`);
        if (signature !== expected) {
          await env.DB.prepare("UPDATE payments SET status = ?, updated_at = ? WHERE project_id = ? AND razorpay_order_id = ?")
            .bind("failed", new Date().toISOString(), projectId, orderId).run();
          return response({ error: "Invalid payment signature" }, 400, origin);
        }
        const updated = await env.DB.prepare(
          "UPDATE payments SET razorpay_payment_id = ?, status = ?, updated_at = ? WHERE project_id = ? AND razorpay_order_id = ?",
        ).bind(paymentId, "verified", new Date().toISOString(), projectId, orderId).run();
        if (!updated.meta.changes) return response({ error: "Payment order not found" }, 404, origin);
        return response({ ok: true }, 200, origin);
      }

      return response({ error: "Route not found" }, 404, origin);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Internal server error";
      const status = message === "Invalid plan_id" ? 400 : 500;
      return response({ error: message }, status, origin);
    }
  },
} satisfies ExportedHandler<Env>;
