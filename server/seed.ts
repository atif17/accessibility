import { db } from "./db";
import { checklistItems, knowledgeArticles } from "@shared/schema";

async function seedDatabase() {
  console.log("Seeding database...");

  // Check if data already exists
  const existingItems = await db.select().from(checklistItems).limit(1);
  if (existingItems.length > 0) {
    console.log("Database already seeded");
    return;
  }

  // Seed checklist items
  const defaultChecklistItems = [
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

  await db.insert(checklistItems).values(defaultChecklistItems);

  // Seed knowledge articles
  const defaultArticles = [
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

  await db.insert(knowledgeArticles).values(defaultArticles);

  console.log("Database seeded successfully");
}

export { seedDatabase };