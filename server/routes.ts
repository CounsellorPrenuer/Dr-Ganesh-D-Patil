import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { emailService } from "./emailService";
import { insertContactInquirySchema } from "@shared/schema";
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
