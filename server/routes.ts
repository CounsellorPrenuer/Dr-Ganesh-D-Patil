import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { emailService } from "./emailService";
import { insertContactInquirySchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
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

      // Send email notification to Dr. Patil
      const emailHtml = emailService.generateContactEmailHtml(
        inquiryData.name,
        inquiryData.email,
        inquiryData.subject || '',
        inquiryData.message
      );

      await emailService.sendEmail({
        to: 'skillpluska@rediffmail.com', // Dr. Patil's email
        subject: `New Contact Inquiry: ${inquiryData.subject || 'Website Contact'}`,
        html: emailHtml,
        replyTo: inquiryData.email
      });

      res.json({ 
        success: true, 
        message: "Your message has been sent successfully! Dr. Patil will get back to you soon.",
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
