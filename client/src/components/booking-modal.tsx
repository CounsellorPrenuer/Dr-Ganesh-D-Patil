import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CONTACT_EMAIL } from "@/lib/config";
import { formatCurrency } from "@/lib/currency";
import { workerPost } from "@/lib/workerApi";
import { CheckCircle2, Loader2, Mail } from "lucide-react";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: string;
  title: string;
  category: string;
  price: number;
};

type CouponResult = {
  valid: boolean;
  discount_amount?: number;
  discountAmount?: number;
  final_amount?: number;
  finalAmount?: number;
  message?: string;
};

type OrderResult = {
  key_id: string;
  order_id: string;
  amount: number;
  currency: string;
  lead_id: string;
  final_amount: number;
};

function loadRazorpay() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector<HTMLScriptElement>('script[src*="checkout.razorpay.com"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BookingModal({ open, onOpenChange, planId, title, category, price }: Props) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [finalAmount, setFinalAmount] = useState(price);
  const [isApplying, setIsApplying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const openMailDraft = () => {
    const subject = encodeURIComponent(`SKILL+ booking enquiry: ${title}`);
    const body = encodeURIComponent(
      `Hello Dr. Patil,\n\nI would like to book ${title} (${category}) for ${formatCurrency(finalAmount)}.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nPlan ID: ${planId}\nCoupon: ${coupon || "None"}\n`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const applyCoupon = async () => {
    if (!coupon.trim()) {
      setCouponMessage("Enter a coupon code.");
      return;
    }
    setIsApplying(true);
    try {
      const result = await workerPost<CouponResult>("/api/coupons/preview", {
        code: coupon.trim().toUpperCase(),
        plan_id: planId,
      });
      const discount = Number(result.discountAmount ?? result.discount_amount ?? 0);
      const total = Number(result.finalAmount ?? result.final_amount ?? Math.max(0, price - discount));
      setFinalAmount(result.valid ? total : price);
      setCouponMessage(result.message || (result.valid ? `Coupon applied. You save ${formatCurrency(discount)}.` : "Coupon is invalid or inactive."));
    } catch (error) {
      setFinalAmount(price);
      setCouponMessage(error instanceof Error ? error.message : "Could not validate coupon.");
    } finally {
      setIsApplying(false);
    }
  };

  const pay = async () => {
    if (name.trim().length < 2 || !email.includes("@") || !/^\+?[0-9\s-]{10,15}$/.test(phone)) {
      toast({ title: "Check your details", description: "Enter a valid name, email, and phone number.", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    try {
      if (!(await loadRazorpay()) || !window.Razorpay) {
        throw new Error("Razorpay could not load on this browser.");
      }
      const order = await workerPost<OrderResult>("/api/payments/create-order", {
        plan_id: planId,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        coupon_code: coupon.trim().toUpperCase() || undefined,
      });
      setFinalAmount(order.final_amount);

      const checkout = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "SKILL+ | Dr. Ganesh D. Patil",
        description: title,
        order_id: order.order_id,
        prefill: { name, email, contact: phone },
        theme: { color: "#22c55e" },
        handler: async (response: Record<string, string>) => {
          try {
            await workerPost("/api/payments/verify", {
              plan_id: planId,
              lead_id: order.lead_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast({ title: "Payment verified", description: "Thank you. We'll contact you shortly." });
            onOpenChange(false);
          } catch (error) {
            toast({ title: "Verification failed", description: error instanceof Error ? error.message : "Please contact us.", variant: "destructive" });
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      });
      checkout.open();
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Checkout unavailable",
        description: error instanceof Error ? `${error.message} You can send us a pre-filled email instead.` : "Please use the email fallback.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Complete Your Booking</DialogTitle>
          <DialogDescription>Enter your details, apply a coupon, then continue to secure Razorpay checkout.</DialogDescription>
        </DialogHeader>
        <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 space-y-2">
          <div className="flex justify-between gap-4"><span className="text-muted-foreground">Plan</span><strong className="text-right">{title}</strong></div>
          <div className="flex justify-between gap-4"><span className="text-muted-foreground">Category</span><span className="text-right">{category}</span></div>
          <div className="flex justify-between gap-4 pt-2 border-t"><span>Amount</span><strong className="text-xl text-primary">{formatCurrency(finalAmount)}</strong></div>
        </div>
        <div className="grid gap-4">
          <div><Label htmlFor="checkout-name">Full name</Label><Input id="checkout-name" value={name} onChange={(event) => setName(event.target.value)} /></div>
          <div><Label htmlFor="checkout-email">Email</Label><Input id="checkout-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
          <div><Label htmlFor="checkout-phone">Phone</Label><Input id="checkout-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} /></div>
          <div>
            <Label htmlFor="checkout-coupon">Coupon code</Label>
            <div className="flex gap-2">
              <Input id="checkout-coupon" value={coupon} onChange={(event) => setCoupon(event.target.value.toUpperCase())} placeholder="Optional" />
              <Button type="button" variant="outline" onClick={applyCoupon} disabled={isApplying}>
                {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
              </Button>
            </div>
            {couponMessage && <p className="text-sm mt-2 flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />{couponMessage}</p>}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          <Button variant="outline" onClick={openMailDraft}><Mail className="w-4 h-4 mr-2" />Email Instead</Button>
          <Button onClick={pay} disabled={isProcessing}>
            {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Pay {formatCurrency(finalAmount)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
