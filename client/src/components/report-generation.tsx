import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Download, Settings, FileText, Table, Code } from "lucide-react";
import { generateReport } from "@/lib/accessibility-scanner";

export default function ReportGeneration() {
  const [reportFormat, setReportFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const { toast } = useToast();

  const generateReportMutation = useMutation({
    mutationFn: ({ scanId, format }: { scanId: number; format: 'pdf' | 'csv' | 'json' }) =>
      generateReport(scanId, format),
    onSuccess: (data) => {
      toast({
        title: "Report Generated",
        description: `Your ${data.format.toUpperCase()} report has been generated successfully.`,
      });
      // In a real app, this would trigger a download
      console.log('Download URL:', data.downloadUrl);
    },
    onError: () => {
      toast({
        title: "Report Generation Failed",
        description: "Unable to generate the report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDownloadSample = () => {
    // Generate a sample report
    generateReportMutation.mutate({ scanId: 1, format: reportFormat });
  };

  const reportTypes = [
    {
      icon: <FileText className="h-8 w-8 text-red-400" />,
      title: "PDF Reports",
      description: "Professional formatted reports for stakeholders",
      format: 'pdf' as const,
    },
    {
      icon: <Table className="h-8 w-8 text-green-400" />,
      title: "CSV Exports",
      description: "Detailed issue lists for development teams",
      format: 'csv' as const,
    },
    {
      icon: <Code className="h-8 w-8 text-blue-400" />,
      title: "JSON Data",
      description: "Machine-readable results for integration",
      format: 'json' as const,
    },
  ];

  return (
    <section className="mb-16" role="region" aria-labelledby="report-title">
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <CardContent className="p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="report-title" className="text-3xl font-bold mb-4">
              Generate Professional Audit Reports
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Create comprehensive accessibility audit reports with detailed findings, recommendations, and remediation steps.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {reportTypes.map((type) => (
                <div key={type.format} className="text-center">
                  <div className="flex justify-center mb-3">
                    {type.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{type.title}</h3>
                  <p className="text-gray-300 text-sm">{type.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleDownloadSample}
                disabled={generateReportMutation.isPending}
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                <Download className="mr-2 h-4 w-4" />
                {generateReportMutation.isPending ? "Generating..." : "Download Sample Report"}
              </Button>
              
              <Dialog open={isCustomizeOpen} onOpenChange={setIsCustomizeOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                    <Settings className="mr-2 h-4 w-4" />
                    Customize Report
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Customize Your Report</DialogTitle>
                    <DialogDescription>
                      Choose the format and options for your accessibility report.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="report-format">Report Format</Label>
                      <Select value={reportFormat} onValueChange={(value: 'pdf' | 'csv' | 'json') => setReportFormat(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF Report</SelectItem>
                          <SelectItem value="csv">CSV Export</SelectItem>
                          <SelectItem value="json">JSON Data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Include Sections</Label>
                      <div className="space-y-2">
                        {[
                          'Executive Summary',
                          'Detailed Findings',
                          'Recommendations',
                          'WCAG Compliance Matrix',
                          'Technical Implementation Guide'
                        ].map((section) => (
                          <div key={section} className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              id={section.replace(/\s+/g, '-').toLowerCase()}
                              defaultChecked
                              className="rounded border-gray-300"
                            />
                            <label 
                              htmlFor={section.replace(/\s+/g, '-').toLowerCase()}
                              className="text-sm"
                            >
                              {section}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsCustomizeOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={() => {
                          handleDownloadSample();
                          setIsCustomizeOpen(false);
                        }}
                        disabled={generateReportMutation.isPending}
                      >
                        Generate Report
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
