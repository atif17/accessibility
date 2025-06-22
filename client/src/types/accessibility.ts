export interface ScanResult {
  id: number;
  url: string;
  scanType: string;
  score: number;
  issues: AccessibilityIssue[];
  recommendations: Recommendation[];
  wcagLevel: string;
  createdAt: Date;
}

export interface AccessibilityIssue {
  type: string;
  severity: 'error' | 'warning' | 'info';
  element: string;
  message: string;
  wcagReference: string;
}

export interface Recommendation {
  category: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ChecklistItem {
  id: number;
  category: 'vision' | 'hearing' | 'motor' | 'cognitive';
  title: string;
  description: string;
  wcagReference?: string;
  isCompleted: boolean;
  userId?: number;
}

export interface KnowledgeArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  readTime: number;
  createdAt: Date;
}

export interface WcagGuideline {
  id: string;
  title: string;
  description: string;
  level: 'A' | 'AA' | 'AAA';
  icon: string;
  examples?: string[];
}
