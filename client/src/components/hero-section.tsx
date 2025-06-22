import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { performAccessibilityScan } from "@/lib/accessibility-scanner";

export default function HeroSection() {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const scanMutation = useMutation({
    mutationFn: performAccessibilityScan,
    onSuccess: (data) => {
      toast({
        title: "Scan Complete",
        description: `Your website scored ${data.score}/100. View detailed results below.`,
      });
      // Scroll to results or show results modal
      const testingSection = document.getElementById('testing');
      if (testingSection) {
        testingSection.scrollIntoView({ behavior: 'smooth' });
      }
    },
    onError: () => {
      toast({
        title: "Scan Failed",
        description: "Unable to scan the website. Please check the URL and try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL to scan.",
        variant: "destructive",
      });
      return;
    }

    try {
      new URL(url);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL (e.g., https://example.com).",
        variant: "destructive",
      });
      return;
    }

    scanMutation.mutate({
      url,
      scanType: "Full Page Scan"
    });
  };

  return (
    <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Make the Web Accessible for Everyone</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Learn WCAG guidelines, test your websites for accessibility compliance, and create inclusive digital experiences with our comprehensive platform.
          </p>
          
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="url-input" className="sr-only">
                  Website URL to test
                </Label>
                <Input
                  id="url-input"
                  type="url"
                  placeholder="Enter your website URL (e.g., https://example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 bg-white border-white"
                  required
                  aria-describedby="url-help"
                />
                <p id="url-help" className="text-blue-100 text-sm mt-1">
                  We'll perform a comprehensive accessibility scan of your website
                </p>
              </div>
              <Button 
                type="submit" 
                disabled={scanMutation.isPending}
                className="bg-white text-primary px-8 py-3 hover:bg-gray-100 disabled:opacity-50"
              >
                <Search className="mr-2 h-4 w-4" aria-hidden="true" />
                {scanMutation.isPending ? "Scanning..." : "Scan Website"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
