import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Keyboard, Video, List, ArrowRight } from "lucide-react";

interface WcagGuideline {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  examples: string[];
  wcagReference: string;
}

const wcagLevels = {
  'level-a': [
    {
      id: 'alt-text',
      title: 'Images have alt text',
      description: 'All meaningful images must have descriptive alternative text for screen readers.',
      icon: <Eye className="h-5 w-5" />,
      examples: [
        'Use descriptive alt text for informative images',
        'Use empty alt="" for decorative images',
        'Provide long descriptions for complex images like charts'
      ],
      wcagReference: 'WCAG 1.1.1'
    },
    {
      id: 'keyboard-nav',
      title: 'Keyboard Navigation',
      description: 'All interactive elements must be accessible via keyboard navigation.',
      icon: <Keyboard className="h-5 w-5" />,
      examples: [
        'All buttons and links work with Tab and Enter keys',
        'Custom interactive elements handle keyboard events',
        'Focus indicators are clearly visible'
      ],
      wcagReference: 'WCAG 2.1.1'
    },
    {
      id: 'video-captions',
      title: 'Video Captions',
      description: 'Pre-recorded videos must have synchronized captions available.',
      icon: <Video className="h-5 w-5" />,
      examples: [
        'All spoken content has synchronized captions',
        'Important sound effects are described',
        'Captions are accurate and well-timed'
      ],
      wcagReference: 'WCAG 1.2.2'
    },
    {
      id: 'page-structure',
      title: 'Page Structure',
      description: 'Content must be structured with proper headings and landmarks.',
      icon: <List className="h-5 w-5" />,
      examples: [
        'Use proper heading hierarchy (h1, h2, h3, etc.)',
        'Include ARIA landmarks (main, nav, aside)',
        'Logical reading order for screen readers'
      ],
      wcagReference: 'WCAG 1.3.1'
    }
  ],
  'level-aa': [
    {
      id: 'color-contrast',
      title: 'Color Contrast',
      description: 'Text must have sufficient contrast ratio against backgrounds (4.5:1 for normal text).',
      icon: <Eye className="h-5 w-5" />,
      examples: [
        'Normal text needs 4.5:1 contrast ratio',
        'Large text (18pt+) needs 3:1 contrast ratio',
        'Use tools to verify contrast ratios'
      ],
      wcagReference: 'WCAG 1.4.3'
    },
    {
      id: 'resize-text',
      title: 'Text Resize',
      description: 'Text can be resized up to 200% without loss of content or functionality.',
      icon: <List className="h-5 w-5" />,
      examples: [
        'Content remains readable at 200% zoom',
        'No horizontal scrolling required',
        'All functionality remains available'
      ],
      wcagReference: 'WCAG 1.4.4'
    }
  ],
  'level-aaa': [
    {
      id: 'enhanced-contrast',
      title: 'Enhanced Contrast',
      description: 'Text has enhanced contrast ratio (7:1 for normal text, 4.5:1 for large text).',
      icon: <Eye className="h-5 w-5" />,
      examples: [
        'Normal text needs 7:1 contrast ratio',
        'Large text needs 4.5:1 contrast ratio',
        'Higher standards for better accessibility'
      ],
      wcagReference: 'WCAG 1.4.6'
    }
  ]
};

export default function WcagEducation() {
  const [activeTab, setActiveTab] = useState('level-a');

  return (
    <section id="education" className="mb-16" role="region" aria-labelledby="education-title">
      <div className="text-center mb-12">
        <h2 id="education-title" className="text-3xl font-bold text-gray-900 mb-4">
          Interactive WCAG Guidelines
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Learn the Web Content Accessibility Guidelines through interactive examples and practical applications.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="level-a">Level A - Minimum</TabsTrigger>
          <TabsTrigger value="level-aa">Level AA - Standard</TabsTrigger>
          <TabsTrigger value="level-aaa">Level AAA - Enhanced</TabsTrigger>
        </TabsList>

        {Object.entries(wcagLevels).map(([level, guidelines]) => (
          <TabsContent key={level} value={level} className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {guidelines.map((guideline) => (
                <Card key={guideline.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center mb-3">
                      <div className="text-primary mr-3">
                        {guideline.icon}
                      </div>
                      <CardTitle className="text-base">{guideline.title}</CardTitle>
                    </div>
                    <CardDescription>{guideline.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="text-primary p-0 h-auto font-medium">
                          Learn More <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center">
                            <div className="text-primary mr-3">
                              {guideline.icon}
                            </div>
                            {guideline.title}
                          </DialogTitle>
                          <DialogDescription>
                            {guideline.wcagReference}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                          <p className="text-gray-700 mb-4">{guideline.description}</p>
                          <h4 className="font-semibold mb-2">Implementation Examples:</h4>
                          <ul className="space-y-2">
                            {guideline.examples.map((example, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span className="text-sm text-gray-600">{example}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
