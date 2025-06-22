import { 
  publicScans,
  reportRequests,
  checklistItems, 
  knowledgeArticles,
  type PublicScan,
  type InsertPublicScan,
  type ReportRequest,
  type InsertReportRequest,
  type ChecklistItem,
  type InsertChecklistItem,
  type KnowledgeArticle,
  type InsertKnowledgeArticle
} from "@shared/schema";

export interface IStorage {
  createPublicScan(scan: InsertPublicScan): Promise<PublicScan>;
  getPublicScans(): Promise<PublicScan[]>;
  getPublicScanById(id: number): Promise<PublicScan | undefined>;
  
  createReportRequest(request: InsertReportRequest): Promise<ReportRequest>;
  getReportRequests(): Promise<ReportRequest[]>;
  
  getChecklistItems(category?: string): Promise<ChecklistItem[]>;
  updateChecklistItem(id: number, isCompleted: boolean): Promise<ChecklistItem>;
  
  getKnowledgeArticles(category?: string): Promise<KnowledgeArticle[]>;
  searchKnowledgeArticles(query: string): Promise<KnowledgeArticle[]>;
}

import { db } from "./db";
import { eq } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async createPublicScan(insertScan: InsertPublicScan): Promise<PublicScan> {
    const [scan] = await db
      .insert(publicScans)
      .values(insertScan)
      .returning();
    return scan;
  }

  async getPublicScans(): Promise<PublicScan[]> {
    return await db.select().from(publicScans).orderBy(publicScans.createdAt);
  }

  async getPublicScanById(id: number): Promise<PublicScan | undefined> {
    const [scan] = await db.select().from(publicScans).where(eq(publicScans.id, id));
    return scan || undefined;
  }

  async createReportRequest(insertRequest: InsertReportRequest): Promise<ReportRequest> {
    const [request] = await db
      .insert(reportRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async getReportRequests(): Promise<ReportRequest[]> {
    return await db.select().from(reportRequests).orderBy(reportRequests.createdAt);
  }

  async getChecklistItems(category?: string): Promise<ChecklistItem[]> {
    if (category) {
      return await db.select().from(checklistItems).where(eq(checklistItems.category, category));
    }
    return await db.select().from(checklistItems);
  }

  async updateChecklistItem(id: number, isCompleted: boolean): Promise<ChecklistItem> {
    const [item] = await db
      .update(checklistItems)
      .set({ isCompleted })
      .where(eq(checklistItems.id, id))
      .returning();
    return item;
  }

  async getKnowledgeArticles(category?: string): Promise<KnowledgeArticle[]> {
    if (category) {
      return await db.select().from(knowledgeArticles).where(eq(knowledgeArticles.category, category));
    }
    return await db.select().from(knowledgeArticles).orderBy(knowledgeArticles.createdAt);
  }

  async searchKnowledgeArticles(query: string): Promise<KnowledgeArticle[]> {
    // Simple text search - in production you'd use full-text search
    const lowerQuery = query.toLowerCase();
    const articles = await db.select().from(knowledgeArticles);
    return articles.filter(article =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery) ||
      article.category.toLowerCase().includes(lowerQuery)
    );
  }
}

export class MemStorage implements IStorage {
  private publicScans: Map<number, PublicScan>;
  private reportRequests: Map<number, ReportRequest>;
  private checklistItems: Map<number, ChecklistItem>;
  private knowledgeArticles: Map<number, KnowledgeArticle>;
  private currentId: number;

  constructor() {
    this.publicScans = new Map();
    this.reportRequests = new Map();
    this.checklistItems = new Map();
    this.knowledgeArticles = new Map();
    this.currentId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize default checklist items
    const defaultChecklistItems: Omit<ChecklistItem, 'id'>[] = [
      {
        category: 'vision',
        title: 'All meaningful images have descriptive alt text',
        description: 'Decorative images should have empty alt="" attributes. Complex images need detailed descriptions.',
        wcagReference: 'WCAG 1.1.1',
        isCompleted: false,
      },
      {
        category: 'vision',
        title: 'Color contrast meets WCAG AA standards (4.5:1 ratio)',
        description: 'Large text (18pt+) needs 3:1 ratio. Use online contrast checkers to verify.',
        wcagReference: 'WCAG 1.4.3',
        isCompleted: false,
      },
      {
        category: 'vision',
        title: 'Content is accessible to screen readers',
        description: 'Test with actual screen reader software or browser extensions.',
        wcagReference: 'WCAG 1.3.1',
        isCompleted: false,
      },
      {
        category: 'vision',
        title: 'Text can be resized to 200% without loss of functionality',
        description: 'Test browser zoom and ensure all content remains accessible and readable.',
        wcagReference: 'WCAG 1.4.4',
        isCompleted: false,
      },
      {
        category: 'hearing',
        title: 'Videos feature captions',
        description: 'All pre-recorded videos must have synchronized captions.',
        wcagReference: 'WCAG 1.2.2',
        isCompleted: false,
      },
      {
        category: 'motor',
        title: 'All interactive elements accessible via keyboard',
        description: 'Test complete functionality using only keyboard navigation.',
        wcagReference: 'WCAG 2.1.1',
        isCompleted: false,
      },
      {
        category: 'cognitive',
        title: 'Content structured with clear headings',
        description: 'Use proper heading hierarchy and logical page structure.',
        wcagReference: 'WCAG 1.3.1',
        isCompleted: false,
      },
    ];

    defaultChecklistItems.forEach(item => {
      const id = this.currentId++;
      this.checklistItems.set(id, { ...item, id });
    });

    // Initialize knowledge articles
    const defaultArticles: Omit<KnowledgeArticle, 'id' | 'createdAt'>[] = [
      {
        title: 'Web Accessibility Fundamentals: A Complete Beginner\'s Guide',
        content: 'Learn the basics of web accessibility, why it matters, and how to get started with WCAG compliance.',
        category: 'Getting Started',
        readTime: 5,
      },
      {
        title: 'Manual vs Automated Accessibility Testing: When to Use Each',
        content: 'Understanding the strengths and limitations of different testing approaches for comprehensive accessibility evaluation.',
        category: 'Testing Methods',
        readTime: 8,
      },
      {
        title: 'WCAG 2.2 New Success Criteria: What Changed and How to Comply',
        content: 'Deep dive into the new WCAG 2.2 requirements and practical implementation strategies for compliance.',
        category: 'WCAG Guidelines',
        readTime: 12,
      },
      {
        title: 'ADA Compliance for Websites: Legal Requirements and Best Practices',
        content: 'Navigate the legal landscape of web accessibility and understand your obligations under the ADA.',
        category: 'Legal Compliance',
        readTime: 10,
      },
      {
        title: 'Essential Accessibility Testing Tools: Free and Paid Options',
        content: 'Comprehensive guide to the best accessibility testing tools available for different budgets and needs.',
        category: 'Tools & Resources',
        readTime: 6,
      },
      {
        title: 'Real-World Accessibility Fixes: E-commerce Site Makeover',
        content: 'Step-by-step case study of transforming an inaccessible e-commerce site into a WCAG AA compliant experience.',
        category: 'Case Studies',
        readTime: 15,
      },
    ];

    defaultArticles.forEach(article => {
      const id = this.currentId++;
      this.knowledgeArticles.set(id, { 
        ...article, 
        id, 
        createdAt: new Date() 
      });
    });
  }

  async createPublicScan(insertScan: InsertPublicScan): Promise<PublicScan> {
    const id = this.currentId++;
    const scan: PublicScan = { 
      ...insertScan, 
      id, 
      createdAt: new Date() 
    };
    this.publicScans.set(id, scan);
    return scan;
  }

  async getPublicScans(): Promise<PublicScan[]> {
    return Array.from(this.publicScans.values());
  }

  async getPublicScanById(id: number): Promise<PublicScan | undefined> {
    return this.publicScans.get(id);
  }

  async createReportRequest(insertRequest: InsertReportRequest): Promise<ReportRequest> {
    const id = this.currentId++;
    const request: ReportRequest = {
      ...insertRequest,
      id,
      status: 'pending',
      message: insertRequest.message || null,
      company: insertRequest.company || null,
      createdAt: new Date()
    };
    this.reportRequests.set(id, request);
    return request;
  }

  async getReportRequests(): Promise<ReportRequest[]> {
    return Array.from(this.reportRequests.values());
  }

  async getChecklistItems(category?: string): Promise<ChecklistItem[]> {
    const items = Array.from(this.checklistItems.values());
    if (category) {
      return items.filter(item => item.category === category);
    }
    return items;
  }

  async updateChecklistItem(id: number, isCompleted: boolean): Promise<ChecklistItem> {
    const item = this.checklistItems.get(id);
    if (!item) {
      throw new Error(`Checklist item with id ${id} not found`);
    }
    const updatedItem = { ...item, isCompleted };
    this.checklistItems.set(id, updatedItem);
    return updatedItem;
  }

  async getKnowledgeArticles(category?: string): Promise<KnowledgeArticle[]> {
    const articles = Array.from(this.knowledgeArticles.values());
    if (category) {
      return articles.filter(article => article.category === category);
    }
    return articles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async searchKnowledgeArticles(query: string): Promise<KnowledgeArticle[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.knowledgeArticles.values()).filter(article =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery) ||
      article.category.toLowerCase().includes(lowerQuery)
    );
  }
}

export const storage = new DatabaseStorage();
