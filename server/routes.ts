import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { emailService } from "./emailService";
import { paymentService } from "./paymentService";
import { insertContactInquirySchema, insertTestimonialSchema, insertServiceSchema, insertArticleSchema, insertPaymentSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

// Helper function to send data to Google Sheets
async function sendToGoogleSheets(inquiryData: any, inquiryId: string): Promise<string | null> {
  const sheetsWebhookUrl = process.env.SHEETS_WEBHOOK_URL;
  if (!sheetsWebhookUrl) {
    console.log('Google Sheets webhook URL not configured - skipping sheets integration');
    return null;
  }

  try {
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const response = await fetch(sheetsWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp,
        name: inquiryData.name,
        email: inquiryData.email,
        subject: inquiryData.subject || 'No subject',
        message: inquiryData.message,
        source: 'Website Contact Form',
        status: 'New',
        inquiryId
      }),
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });

    if (response.ok) {
      console.log('Successfully sent to Google Sheets');
      return sheetsWebhookUrl; // Return for email link
    } else {
      console.error('Failed to send to Google Sheets:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error sending to Google Sheets:', error);
    return null; // Don't fail the entire request if Sheets fails
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin login endpoint (simple hardcoded credentials)
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    
    // Hardcoded admin credentials as requested
    if (username === "admin" && password === "skillplus2024") {
      // Set session
      req.session.isAdmin = true;
      req.session.adminId = "admin";
      
      res.json({ 
        success: true, 
        message: "Login successful",
        admin: { username: "admin", id: "admin" }
      });
    } else {
      res.status(401).json({ 
        error: "Invalid credentials" 
      });
    }
  });

  // Admin logout endpoint
  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true, message: "Logged out successfully" });
    });
  });

  // Middleware to check admin authentication
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ error: "Admin authentication required" });
    }
    next();
  };

  // Payment routes
  app.post("/api/payments/create-order", async (req, res) => {
    try {
      const validationResult = insertPaymentSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.toString() 
        });
      }

      const paymentData = validationResult.data;
      
      // Get service details
      const service = await storage.getService(paymentData.serviceId);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      // Create payment record
      const payment = await storage.createPayment({
        ...paymentData,
        amount: service.price,
        status: "pending"
      });

      // Create Razorpay order
      const razorpayOrder = await paymentService.createOrder(
        parseFloat(service.price),
        paymentData.currency,
        payment.id
      );

      // Update payment with Razorpay order ID
      await storage.updatePayment(payment.id, {
        razorpayOrderId: razorpayOrder.id
      });

      res.json({
        success: true,
        payment: payment,
        razorpayOrder: razorpayOrder,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID
      });

    } catch (error) {
      console.error("Payment order creation error:", error);
      res.status(500).json({ 
        error: "Failed to create payment order" 
      });
    }
  });

  app.post("/api/payments/verify", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, payment_id } = req.body;

      const result = await paymentService.processPaymentSuccess(
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        payment_id
      );

      res.json(result);

    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(400).json({ 
        error: "Payment verification failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/admin/payments", requireAdmin, async (req, res) => {
    try {
      const payments = await storage.getPayments();
      res.json(payments);
    } catch (error) {
      console.error("Get payments error:", error);
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  // Testimonials routes
  app.post("/api/testimonials", async (req, res) => {
    try {
      const validationResult = insertTestimonialSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.toString() 
        });
      }

      const testimonial = await storage.createTestimonial(validationResult.data);

      res.json({ 
        success: true, 
        message: "Thank you for your testimonial! It will be reviewed and published soon.",
        testimonial: testimonial
      });

    } catch (error) {
      console.error("Testimonial creation error:", error);
      res.status(500).json({ 
        error: "Failed to submit testimonial" 
      });
    }
  });

  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getApprovedTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Get testimonials error:", error);
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  app.get("/api/admin/testimonials", requireAdmin, async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Get admin testimonials error:", error);
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  app.patch("/api/admin/testimonials/:id/approve", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.approveTestimonial(id);
      
      if (success) {
        res.json({ success: true, message: "Testimonial approved" });
      } else {
        res.status(404).json({ error: "Testimonial not found" });
      }
    } catch (error) {
      console.error("Approve testimonial error:", error);
      res.status(500).json({ error: "Failed to approve testimonial" });
    }
  });

  app.delete("/api/admin/testimonials/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteTestimonial(id);
      
      if (success) {
        res.json({ success: true, message: "Testimonial deleted" });
      } else {
        res.status(404).json({ error: "Testimonial not found" });
      }
    } catch (error) {
      console.error("Delete testimonial error:", error);
      res.status(500).json({ error: "Failed to delete testimonial" });
    }
  });

  // Services routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getActiveServices();
      res.json(services);
    } catch (error) {
      console.error("Get services error:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/admin/services", requireAdmin, async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Get admin services error:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.post("/api/admin/services", requireAdmin, async (req, res) => {
    try {
      const validationResult = insertServiceSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.toString() 
        });
      }

      const service = await storage.createService(validationResult.data);
      res.json(service);

    } catch (error) {
      console.error("Create service error:", error);
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  app.put("/api/admin/services/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const validationResult = insertServiceSchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.toString() 
        });
      }

      const service = await storage.updateService(id, validationResult.data);
      
      if (service) {
        res.json(service);
      } else {
        res.status(404).json({ error: "Service not found" });
      }
    } catch (error) {
      console.error("Update service error:", error);
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  app.delete("/api/admin/services/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteService(id);
      
      if (success) {
        res.json({ success: true, message: "Service deleted" });
      } else {
        res.status(404).json({ error: "Service not found" });
      }
    } catch (error) {
      console.error("Delete service error:", error);
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  app.patch("/api/admin/services/:id/toggle", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { active } = req.body;
      
      if (typeof active !== 'boolean') {
        return res.status(400).json({ error: "Active field must be a boolean" });
      }
      
      const service = await storage.updateService(id, { active });
      
      if (service) {
        res.json(service);
      } else {
        res.status(404).json({ error: "Service not found" });
      }
    } catch (error) {
      console.error("Toggle service error:", error);
      res.status(500).json({ error: "Failed to toggle service status" });
    }
  });

  // Articles routes
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getPublishedArticles();
      res.json(articles);
    } catch (error) {
      console.error("Get articles error:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.getArticle(id);
      
      if (article && article.published) {
        res.json(article);
      } else {
        res.status(404).json({ error: "Article not found" });
      }
    } catch (error) {
      console.error("Get article error:", error);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.get("/api/admin/articles", requireAdmin, async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      console.error("Get admin articles error:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.post("/api/admin/articles", requireAdmin, async (req, res) => {
    try {
      const validationResult = insertArticleSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.toString() 
        });
      }

      const article = await storage.createArticle(validationResult.data);
      res.json(article);

    } catch (error) {
      console.error("Create article error:", error);
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  app.put("/api/admin/articles/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const validationResult = insertArticleSchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.toString() 
        });
      }

      const article = await storage.updateArticle(id, validationResult.data);
      
      if (article) {
        res.json(article);
      } else {
        res.status(404).json({ error: "Article not found" });
      }
    } catch (error) {
      console.error("Update article error:", error);
      res.status(500).json({ error: "Failed to update article" });
    }
  });

  app.delete("/api/admin/articles/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteArticle(id);
      
      if (success) {
        res.json({ success: true, message: "Article deleted" });
      } else {
        res.status(404).json({ error: "Article not found" });
      }
    } catch (error) {
      console.error("Delete article error:", error);
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // Admin contact inquiries
  app.get("/api/admin/contact-inquiries", requireAdmin, async (req, res) => {
    try {
      const inquiries = await storage.getContactInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("Get contact inquiries error:", error);
      res.status(500).json({ error: "Failed to fetch contact inquiries" });
    }
  });

  app.delete("/api/admin/contact-inquiries/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteContactInquiry(id);
      
      if (success) {
        res.json({ success: true, message: "Contact inquiry deleted" });
      } else {
        res.status(404).json({ error: "Contact inquiry not found" });
      }
    } catch (error) {
      console.error("Delete contact inquiry error:", error);
      res.status(500).json({ error: "Failed to delete contact inquiry" });
    }
  });

  // Admin dashboard stats
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const [testimonials, services, articles, payments, contactInquiries] = await Promise.all([
        storage.getTestimonials(),
        storage.getServices(),
        storage.getArticles(),
        storage.getPayments(),
        storage.getContactInquiries()
      ]);

      const stats = {
        totalTestimonials: testimonials.length,
        pendingTestimonials: testimonials.filter(t => !t.approved).length,
        totalServices: services.length,
        activeServices: services.filter(s => s.active).length,
        totalArticles: articles.length,
        publishedArticles: articles.filter(a => a.published).length,
        totalPayments: payments.length,
        successfulPayments: payments.filter(p => p.status === 'paid').length,
        pendingPayments: payments.filter(p => p.status === 'pending').length,
        totalRevenue: payments
          .filter(p => p.status === 'paid')
          .reduce((sum, p) => sum + parseFloat(p.amount), 0),
        contactInquiries: contactInquiries.length,
        recentInquiries: contactInquiries.slice(0, 5)
      };

      res.json(stats);
    } catch (error) {
      console.error("Get admin stats error:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Data export endpoint
  app.get("/api/admin/export", requireAdmin, async (req, res) => {
    try {
      const [testimonials, services, articles, payments, contactInquiries] = await Promise.all([
        storage.getTestimonials(),
        storage.getServices(),
        storage.getArticles(),
        storage.getPayments(),
        storage.getContactInquiries()
      ]);

      const exportData = {
        testimonials,
        services,
        articles,
        payments,
        contactInquiries,
        exportedAt: new Date().toISOString(),
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=skillplus-data-export.json');
      res.json(exportData);
    } catch (error) {
      console.error("Data export error:", error);
      res.status(500).json({ error: "Failed to export data" });
    }
  });

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate the request body
      const validationResult = insertContactInquirySchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.toString() 
        });
      }

      const inquiryData = validationResult.data;

      // Store the inquiry
      const inquiry = await storage.createContactInquiry(inquiryData);

      // Send to Google Sheets (non-blocking)
      const sheetsUrl = await sendToGoogleSheets(inquiryData, inquiry.id);

      // Send email notification to Dr. Patil
      const emailHtml = emailService.generateContactEmailHtml(
        inquiryData.name,
        inquiryData.email,
        inquiryData.subject || '',
        inquiryData.message,
        sheetsUrl
      );

      // Send confirmation email to client
      const clientConfirmationHtml = emailService.generateClientConfirmationHtml(
        inquiryData.name
      );

      // Send both emails
      await Promise.allSettled([
        emailService.sendEmail({
          to: 'skillpluska@rediffmail.com', // Dr. Patil's email
          subject: `[SKILL+] New Consultation Request • ${inquiryData.name} • ${inquiryData.subject || 'General Inquiry'}`,
          html: emailHtml,
          replyTo: inquiryData.email
        }),
        emailService.sendEmail({
          to: inquiryData.email, // Client's email
          subject: 'Thank you for your consultation request - SKILL+',
          html: clientConfirmationHtml,
          replyTo: 'skillpluska@rediffmail.com'
        })
      ]);

      res.json({ 
        success: true, 
        message: "Your message has been sent successfully! You'll receive a confirmation email shortly. Dr. Patil will get back to you soon.",
        inquiryId: inquiry.id
      });

    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ 
        error: "Failed to send message", 
        details: "Please try again later or contact directly via email." 
      });
    }
  });

  // Remove unsecured admin endpoint - this was exposing personal data

  const httpServer = createServer(app);

  return httpServer;
}
