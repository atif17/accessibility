import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const publicScans = pgTable("public_scans", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  ipAddress: text("ip_address").notNull(),
  scanType: text("scan_type").notNull(),
  score: integer("score").notNull(),
  issues: jsonb("issues").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  wcagLevel: text("wcag_level").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reportRequests = pgTable("report_requests", {
  id: serial("id").primaryKey(),
  scanId: integer("scan_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message"),
  requestedFormat: text("requested_format").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const checklistItems = pgTable("checklist_items", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  wcagReference: text("wcag_reference"),
  isCompleted: boolean("is_completed").notNull().default(false),
});

export const knowledgeArticles = pgTable("knowledge_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  readTime: integer("read_time").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPublicScanSchema = createInsertSchema(publicScans).omit({
  id: true,
  createdAt: true,
});

export const insertReportRequestSchema = createInsertSchema(reportRequests).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertChecklistItemSchema = createInsertSchema(checklistItems).omit({
  id: true,
});

export const insertKnowledgeArticleSchema = createInsertSchema(knowledgeArticles).omit({
  id: true,
  createdAt: true,
});

export type InsertPublicScan = z.infer<typeof insertPublicScanSchema>;
export type PublicScan = typeof publicScans.$inferSelect;
export type InsertReportRequest = z.infer<typeof insertReportRequestSchema>;
export type ReportRequest = typeof reportRequests.$inferSelect;
export type InsertChecklistItem = z.infer<typeof insertChecklistItemSchema>;
export type ChecklistItem = typeof checklistItems.$inferSelect;
export type InsertKnowledgeArticle = z.infer<typeof insertKnowledgeArticleSchema>;
export type KnowledgeArticle = typeof knowledgeArticles.$inferSelect;
