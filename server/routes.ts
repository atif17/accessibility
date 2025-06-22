import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPublicScanSchema, insertReportRequestSchema } from "@shared/schema";
import { z } from "zod";

function getClientIP(req: Request): string {
  return req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Public scan endpoint
  app.post("/api/scan", async (req, res) => {
    try {
      const { url, scanType } = req.body;
      
      if (!url || !scanType) {
        return res.status(400).json({ message: "URL and scan type are required" });
      }

      const ipAddress = getClientIP(req);
      
      // Perform accessibility scan
      const scanData = await performAccessibilityScan(url, scanType);
      const scanResult = await storage.createPublicScan({
        ...scanData,
        ipAddress
      });
      
      res.json(scanResult);
    } catch (error) {
      res.status(500).json({ message: "Failed to perform accessibility scan" });
    }
  });

  app.get("/api/scan-results", async (req, res) => {
    try {
      const results = await storage.getPublicScans();
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scan results" });
    }
  });

  app.get("/api/scan-results/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.getPublicScanById(id);
      
      if (!result) {
        return res.status(404).json({ message: "Scan result not found" });
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scan result" });
    }
  });

  // Checklist endpoints
  app.get("/api/checklist", async (req, res) => {
    try {
      const category = req.query.category as string;
      const items = await storage.getChecklistItems(category);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch checklist items" });
    }
  });

  app.patch("/api/checklist/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { isCompleted } = req.body;
      
      if (typeof isCompleted !== 'boolean') {
        return res.status(400).json({ message: "isCompleted must be a boolean" });
      }
      
      const updatedItem = await storage.updateChecklistItem(id, isCompleted);
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update checklist item" });
    }
  });

  // Knowledge base endpoints
  app.get("/api/knowledge", async (req, res) => {
    try {
      const category = req.query.category as string;
      const query = req.query.q as string;
      
      let articles;
      if (query) {
        articles = await storage.searchKnowledgeArticles(query);
      } else {
        articles = await storage.getKnowledgeArticles(category);
      }
      
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch knowledge articles" });
    }
  });

  // Report request endpoint
  app.post("/api/request-report", async (req, res) => {
    try {
      const { scanId, name, email, company, message, requestedFormat } = req.body;
      
      if (!scanId || !name || !email || !requestedFormat) {
        return res.status(400).json({ 
          message: "Scan ID, name, email, and requested format are required" 
        });
      }
      
      const scanResult = await storage.getPublicScanById(scanId);
      if (!scanResult) {
        return res.status(404).json({ message: "Scan result not found" });
      }
      
      const reportRequest = await storage.createReportRequest({
        scanId,
        name,
        email,
        company: company || null,
        message: message || null,
        requestedFormat
      });
      
      res.json({
        message: "Report request submitted successfully. We will contact you within 24 hours.",
        requestId: reportRequest.id
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit report request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to perform accessibility scan
async function performAccessibilityScan(url: string, scanType: string) {
  // This would integrate with real accessibility testing APIs
  // For now, we'll return realistic sample data
  
  const issues = [
    {
      type: "missing-alt-text",
      severity: "error",
      element: "img",
      message: "Image missing alternative text",
      wcagReference: "1.1.1"
    },
    {
      type: "low-contrast",
      severity: "warning", 
      element: "text",
      message: "Text has insufficient color contrast ratio (3.2:1)",
      wcagReference: "1.4.3"
    }
  ];

  const recommendations = [
    {
      category: "Images",
      action: "Add descriptive alt text to all meaningful images",
      priority: "high"
    },
    {
      category: "Color",
      action: "Increase contrast ratio to meet WCAG AA standards",
      priority: "medium"
    }
  ];

  const score = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
  const wcagLevel = score >= 90 ? "AA Compliant" : score >= 70 ? "AA Partial" : "A Partial";

  return {
    url,
    scanType,
    score,
    issues,
    recommendations,
    wcagLevel
  };
}

// Helper function to generate reports
async function generateReport(scanResult: any, format: string) {
  // This would generate actual PDF/CSV reports
  // For now, return a mock response
  return {
    id: `report_${Date.now()}`,
    format,
    scanResult
  };
}
