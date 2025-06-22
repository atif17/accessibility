import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Zap, Settings, Play, ExternalLink, PlayCircle, AlertTriangle, CheckCircle, Info, X, Mail } from "lucide-react";
import { performAccessibilityScan, getScanResults } from "@/lib/accessibility-scanner";
import ReportRequestForm from "./report-request-form";

export default function TestingTools() {
  const [quickUrl, setQuickUrl] = useState("");
  const [scanType, setScanType] = useState("Full Page Scan");
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [showReportRequest, setShowReportRequest] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: scanResults = [] } = useQuery<any[]>({
    queryKey: ['/api/scan-results'],
    staleTime: 30000,
  });

  const latestScan = scanResults.length > 0 ? scanResults[scanResults.length - 1] : null;

  const quickScanMutation = useMutation({
    mutationFn: performAccessibilityScan,
    onSuccess: (data) => {
      toast({
        title: "Quick Scan Complete",
        description: `Scan completed with a score of ${data.score}/100`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/scan-results'] });
    },
    onError: () => {
      toast({
        title: "Scan Failed",
        description: "Unable to complete the accessibility scan.",
        variant: "destructive",
      });
    },
  });

  const handleQuickScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL to scan.",
        variant: "destructive",
      });
      return;
    }

    quickScanMutation.mutate({
      url: quickUrl,
      scanType
    });
  };

  const runSpecificTest = (testType: string) => {
    toast({
      title: "Test Started",
      description: `Running ${testType} test...`,
    });
    // Implement specific test logic
  };

  return (
    <section id="testing" className="mb-16" role="region" aria-labelledby="testing-title">
      <div className="text-center mb-12">
        <h2 id="testing-title" className="text-3xl font-bold text-gray-900 mb-4">
          Accessibility Testing Tools
        </h2>
        <p className="text-xl text-gray-600">
          Run automated accessibility tests and get detailed reports with actionable recommendations.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Quick Scan Tool */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="text-secondary mr-3 h-6 w-6" />
              Quick Accessibility Scan
            </CardTitle>
            <CardDescription>
              Perform a comprehensive accessibility analysis of any webpage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleQuickScan} className="space-y-4">
              <div>
                <Label htmlFor="quick-url">Website URL</Label>
                <Input
                  id="quick-url"
                  type="url"
                  placeholder="https://example.com"
                  value={quickUrl}
                  onChange={(e) => setQuickUrl(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="scan-type">Scan Type</Label>
                <Select value={scanType} onValueChange={setScanType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Page Scan">Full Page Scan</SelectItem>
                    <SelectItem value="Images & Alt Text">Images & Alt Text</SelectItem>
                    <SelectItem value="Color Contrast">Color Contrast</SelectItem>
                    <SelectItem value="Keyboard Navigation">Keyboard Navigation</SelectItem>
                    <SelectItem value="Screen Reader Compatibility">Screen Reader Compatibility</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-secondary text-white hover:bg-green-700"
                disabled={quickScanMutation.isPending}
              >
                <Play className="mr-2 h-4 w-4" />
                {quickScanMutation.isPending ? "Scanning..." : "Run Accessibility Scan"}
              </Button>
            </form>

            {/* Latest Scan Results */}
            {latestScan && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Latest Scan Results</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Overall Score</span>
                    <Badge variant={latestScan.score >= 80 ? "default" : "secondary"}>
                      {latestScan.score}/100
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Issues Found</span>
                    <Badge variant="destructive">
                      {latestScan.issues?.length || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">WCAG Level</span>
                    <span className="font-medium text-gray-900">{latestScan.wcagLevel}</span>
                  </div>
                  <Progress value={latestScan.score} className="mt-2" />
                </div>
                <Button 
                  variant="link" 
                  className="mt-3 p-0 text-primary"
                  onClick={() => setShowDetailedReport(true)}
                >
                  View Detailed Report <ExternalLink className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Report Modal */}
        <Dialog open={showDetailedReport} onOpenChange={setShowDetailedReport}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <ExternalLink className="mr-3 h-5 w-5" />
                Detailed Accessibility Report
              </DialogTitle>
              <DialogDescription>
                {latestScan && `Scan results for ${latestScan.url} - ${latestScan.scanType}`}
              </DialogDescription>
            </DialogHeader>
            
            {latestScan && (
              <div className="space-y-6">
                {/* Summary Section */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{latestScan.score}/100</div>
                      <div className="text-sm text-gray-600">Overall Score</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">{latestScan.issues?.length || 0}</div>
                      <div className="text-sm text-gray-600">Issues Found</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-lg font-medium text-gray-900">{latestScan.wcagLevel}</div>
                      <div className="text-sm text-gray-600">WCAG Level</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Issues Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                    Accessibility Issues
                  </h3>
                  <div className="space-y-3">
                    {latestScan.issues?.map((issue: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{issue.message}</h4>
                          <Badge variant={issue.severity === 'error' ? 'destructive' : 'secondary'}>
                            {issue.severity}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Element:</strong> {issue.element}</p>
                          <p><strong>WCAG Reference:</strong> {issue.wcagReference}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    Recommendations
                  </h3>
                  <div className="space-y-3">
                    {latestScan.recommendations?.map((rec: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{rec.action}</h4>
                          <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'secondary' : 'outline'}>
                            {rec.priority} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">Category: {rec.category}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowDetailedReport(false)}>
                    Close
                  </Button>
                  <Button onClick={() => setShowReportRequest(true)}>
                    <Mail className="mr-2 h-4 w-4" />
                    Request Full Report
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Report Request Form */}
        {latestScan && (
          <ReportRequestForm
            open={showReportRequest}
            onOpenChange={setShowReportRequest}
            scanId={latestScan.id}
            scanUrl={latestScan.url}
          />
        )}

        {/* Advanced Testing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="text-primary mr-3 h-6 w-6" />
              Advanced Testing Suite
            </CardTitle>
            <CardDescription>
              Specialized tests for specific accessibility requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Screen Reader Test",
                  description: "Simulate screen reader navigation and identify issues.",
                  testType: "screen-reader"
                },
                {
                  title: "Color Contrast Analyzer",
                  description: "Check all color combinations for WCAG compliance.",
                  testType: "color-contrast"
                },
                {
                  title: "Keyboard Navigation",
                  description: "Test complete keyboard accessibility without mouse.",
                  testType: "keyboard-navigation"
                },
                {
                  title: "Focus Management",
                  description: "Verify proper focus indicators and tab order.",
                  testType: "focus-management"
                }
              ].map((test) => (
                <div key={test.testType} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{test.title}</h4>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => runSpecificTest(test.title)}
                    >
                      Run Test
                    </Button>
                  </div>
                  <p className="text-gray-600 text-sm">{test.description}</p>
                </div>
              ))}
            </div>

            <Button className="w-full mt-6 bg-primary text-white hover:bg-blue-700">
              <PlayCircle className="mr-2 h-4 w-4" />
              Run Full Test Suite
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
