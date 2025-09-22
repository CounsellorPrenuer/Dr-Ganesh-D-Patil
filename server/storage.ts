import { 
  type User, type InsertUser, type ContactInquiry, type InsertContactInquiry, 
  type Testimonial, type InsertTestimonial, type Service, type InsertService, 
  type Article, type InsertArticle, type Payment, type InsertPayment,
  users, contactInquiries, testimonials, services, articles, payments
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact Inquiries
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  getContactInquiries(): Promise<ContactInquiry[]>;
  getContactInquiry(id: string): Promise<ContactInquiry | undefined>;
  deleteContactInquiry(id: string): Promise<boolean>;
  
  // Testimonials
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  getTestimonials(): Promise<Testimonial[]>;
  getApprovedTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: string): Promise<Testimonial | undefined>;
  updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<boolean>;
  approveTestimonial(id: string): Promise<boolean>;
  
  // Services
  createService(service: InsertService): Promise<Service>;
  getServices(): Promise<Service[]>;
  getActiveServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  updateService(id: string, updates: Partial<Service>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;
  
  // Articles
  createArticle(article: InsertArticle): Promise<Article>;
  getArticles(): Promise<Article[]>;
  getPublishedArticles(): Promise<Article[]>;
  getArticle(id: string): Promise<Article | undefined>;
  updateArticle(id: string, updates: Partial<Article>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  
  // Payments
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayments(): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment | undefined>;
  updatePayment(id: string, updates: Partial<Payment>): Promise<Payment | undefined>;
  getPaymentsByService(serviceId: string): Promise<Payment[]>;
  getPaymentsByStatus(status: string): Promise<Payment[]>;
}

export class DatabaseStorage implements IStorage {

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Contact Inquiries
  async createContactInquiry(insertInquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const [inquiry] = await db
      .insert(contactInquiries)
      .values(insertInquiry)
      .returning();
    return inquiry;
  }

  async getContactInquiries(): Promise<ContactInquiry[]> {
    return await db
      .select()
      .from(contactInquiries)
      .orderBy(desc(contactInquiries.createdAt));
  }

  async getContactInquiry(id: string): Promise<ContactInquiry | undefined> {
    const [inquiry] = await db
      .select()
      .from(contactInquiries)
      .where(eq(contactInquiries.id, id));
    return inquiry || undefined;
  }

  async deleteContactInquiry(id: string): Promise<boolean> {
    const result = await db
      .delete(contactInquiries)
      .where(eq(contactInquiries.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Testimonials
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values(insertTestimonial)
      .returning();
    return testimonial;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return await db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt));
  }

  async getApprovedTestimonials(): Promise<Testimonial[]> {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.approved, true))
      .orderBy(desc(testimonials.createdAt));
  }

  async getTestimonial(id: string): Promise<Testimonial | undefined> {
    const [testimonial] = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id));
    return testimonial || undefined;
  }

  async updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | undefined> {
    const [testimonial] = await db
      .update(testimonials)
      .set(updates)
      .where(eq(testimonials.id, id))
      .returning();
    return testimonial || undefined;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const result = await db
      .delete(testimonials)
      .where(eq(testimonials.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async approveTestimonial(id: string): Promise<boolean> {
    const result = await db
      .update(testimonials)
      .set({ approved: true })
      .where(eq(testimonials.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Services
  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db
      .insert(services)
      .values(insertService)
      .returning();
    return service;
  }

  async getServices(): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .orderBy(desc(services.createdAt));
  }

  async getActiveServices(): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(eq(services.active, true))
      .orderBy(desc(services.createdAt));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, id));
    return service || undefined;
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service | undefined> {
    const [service] = await db
      .update(services)
      .set(updates)
      .where(eq(services.id, id))
      .returning();
    return service || undefined;
  }

  async deleteService(id: string): Promise<boolean> {
    const result = await db
      .delete(services)
      .where(eq(services.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Articles
  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db
      .insert(articles)
      .values(insertArticle)
      .returning();
    return article;
  }

  async getArticles(): Promise<Article[]> {
    return await db
      .select()
      .from(articles)
      .orderBy(desc(articles.updatedAt));
  }

  async getPublishedArticles(): Promise<Article[]> {
    return await db
      .select()
      .from(articles)
      .where(eq(articles.published, true))
      .orderBy(desc(articles.updatedAt));
  }

  async getArticle(id: string): Promise<Article | undefined> {
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id));
    return article || undefined;
  }

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article | undefined> {
    const [article] = await db
      .update(articles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(articles.id, id))
      .returning();
    return article || undefined;
  }

  async deleteArticle(id: string): Promise<boolean> {
    const result = await db
      .delete(articles)
      .where(eq(articles.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Payments
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db
      .insert(payments)
      .values(insertPayment)
      .returning();
    return payment;
  }

  async getPayments(): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .orderBy(desc(payments.createdAt));
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.id, id));
    return payment || undefined;
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment | undefined> {
    const [payment] = await db
      .update(payments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(payments.id, id))
      .returning();
    return payment || undefined;
  }

  async getPaymentsByService(serviceId: string): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.serviceId, serviceId))
      .orderBy(desc(payments.createdAt));
  }

  async getPaymentsByStatus(status: string): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.status, status))
      .orderBy(desc(payments.createdAt));
  }
}

export const storage = new DatabaseStorage();
