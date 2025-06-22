import { apiRequest } from "./queryClient";

export interface ScanOptions {
  url: string;
  scanType: string;
}

export interface ScanResponse {
  id: number;
  url: string;
  scanType: string;
  score: number;
  issues: any[];
  recommendations: any[];
  wcagLevel: string;
  createdAt: string;
}

export async function performAccessibilityScan(options: ScanOptions): Promise<ScanResponse> {
  const response = await apiRequest('POST', '/api/scan', options);
  return response.json();
}

export async function getScanResults(): Promise<ScanResponse[]> {
  const response = await apiRequest('GET', '/api/scan-results');
  return response.json();
}

export async function generateReport(scanId: number, format: 'pdf' | 'csv' | 'json') {
  const response = await apiRequest('POST', '/api/generate-report', { scanId, format });
  return response.json();
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
