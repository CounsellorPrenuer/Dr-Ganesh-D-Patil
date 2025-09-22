import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactInquiries = pgTable("contact_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  position: text("position"),
  organization: text("organization"),
  message: text("message").notNull(),
  rating: integer("rating").notNull(),
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  duration: text("duration"),
  features: text("features").array(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  category: text("category"),
  tags: text("tags").array(),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceId: varchar("service_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("INR").notNull(),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  status: text("status").notNull(), // pending, paid, failed, refunded
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
}).extend({
  name: z.string().min(1, "Name is required").max(100, "Name too long").trim(),
  email: z.string().email("Invalid email address").max(255, "Email too long").trim(),
  subject: z.string().max(200, "Subject too long").trim().optional(),
  message: z.string().min(1, "Message is required").max(2000, "Message too long").trim(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  email: true,
  position: true,
  organization: true,
  message: true,
  rating: true,
}).extend({
  name: z.string().min(1, "Name is required").max(100, "Name too long").trim(),
  email: z.string().email("Invalid email address").max(255, "Email too long").trim(),
  position: z.string().max(100, "Position too long").trim().optional(),
  organization: z.string().max(100, "Organization too long").trim().optional(),
  message: z.string().min(1, "Message is required").max(1000, "Message too long").trim(),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
});

export const insertAdminTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  position: true,
  organization: true,
  message: true,
  rating: true,
}).extend({
  name: z.string().min(1, "Name is required").max(100, "Name too long").trim(),
  position: z.string().max(100, "Position too long").trim().optional(),
  organization: z.string().max(100, "Organization too long").trim().optional(),
  message: z.string().min(1, "Message is required").max(1000, "Message too long").trim(),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
});

export const insertServiceSchema = createInsertSchema(services).pick({
  title: true,
  description: true,
  price: true,
  duration: true,
  features: true,
  active: true,
}).extend({
  title: z.string().min(1, "Title is required").max(200, "Title too long").trim(),
  description: z.string().min(1, "Description is required").max(1000, "Description too long").trim(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  duration: z.string().max(100, "Duration too long").trim().optional(),
  features: z.array(z.string().max(200, "Feature too long")).optional(),
  active: z.boolean().optional(),
});

export const insertArticleSchema = createInsertSchema(articles).pick({
  title: true,
  excerpt: true,
  content: true,
  author: true,
  category: true,
  tags: true,
  published: true,
}).extend({
  title: z.string().min(1, "Title is required").max(200, "Title too long").trim(),
  excerpt: z.string().min(1, "Excerpt is required").max(500, "Excerpt too long").trim(),
  content: z.string().min(1, "Content is required").max(50000, "Content too long").trim(),
  author: z.string().min(1, "Author is required").max(100, "Author name too long").trim(),
  category: z.string().max(100, "Category too long").trim().optional(),
  tags: z.array(z.string().max(50, "Tag too long")).optional(),
  published: z.boolean().optional(),
});

export const insertPaymentSchema = createInsertSchema(payments).pick({
  serviceId: true,
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  amount: true,
  currency: true,
  status: true,
}).extend({
  serviceId: z.string().min(1, "Service ID is required"),
  customerName: z.string().min(1, "Customer name is required").max(100, "Name too long").trim(),
  customerEmail: z.string().email("Invalid email address").max(255, "Email too long").trim(),
  customerPhone: z.string().max(20, "Phone number too long").trim().optional(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  currency: z.string().default("INR"),
  status: z.enum(["pending", "paid", "failed", "refunded"]),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type InsertAdminTestimonial = z.infer<typeof insertAdminTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
