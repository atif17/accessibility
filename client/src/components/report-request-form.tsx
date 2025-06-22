import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { Mail, User, Building, MessageSquare } from "lucide-react";

const reportRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  message: z.string().optional(),
  requestedFormat: z.enum(["pdf", "csv", "json"], {
    required_error: "Please select a report format"
  })
});

type ReportRequestForm = z.infer<typeof reportRequestSchema>;

interface ReportRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scanId: number;
  scanUrl: string;
}

export default function ReportRequestForm({ 
  open, 
  onOpenChange, 
  scanId, 
  scanUrl 
}: ReportRequestFormProps) {
  const { toast } = useToast();
  
  const form = useForm<ReportRequestForm>({
    resolver: zodResolver(reportRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
      requestedFormat: "pdf"
    }
  });

  const submitRequestMutation = useMutation({
    mutationFn: async (data: ReportRequestForm) => {
      const response = await apiRequest('POST', '/api/request-report', {
        ...data,
        scanId
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Request Submitted",
        description: "We'll send your detailed accessibility report within 24 hours.",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Request Failed",
        description: "Unable to submit your report request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReportRequestForm) => {
    submitRequestMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            Request Detailed Report
          </DialogTitle>
          <DialogDescription>
            Get a comprehensive accessibility report for {scanUrl}. We'll email it to you within 24 hours.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Your full name"
                className="pl-10"
              />
            </div>
            {form.formState.errors.name && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="your.email@company.com"
                className="pl-10"
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="company">Company/Organization</Label>
            <div className="relative mt-1">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="company"
                {...form.register("company")}
                placeholder="Your company name (optional)"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="requestedFormat">Report Format *</Label>
            <Select 
              value={form.watch("requestedFormat")} 
              onValueChange={(value) => form.setValue("requestedFormat", value as "pdf" | "csv" | "json")}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Report - Comprehensive document with findings and recommendations</SelectItem>
                <SelectItem value="csv">CSV Export - Detailed issue list for development teams</SelectItem>
                <SelectItem value="json">JSON Data - Machine-readable results for integration</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.requestedFormat && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.requestedFormat.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="message">Additional Information</Label>
            <div className="relative mt-1">
              <MessageSquare className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
              <Textarea
                id="message"
                {...form.register("message")}
                placeholder="Any specific requirements or questions about the accessibility report..."
                className="pl-10 min-h-[80px]"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitRequestMutation.isPending}
              className="bg-primary text-white hover:bg-blue-700"
            >
              {submitRequestMutation.isPending ? "Submitting..." : "Request Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}