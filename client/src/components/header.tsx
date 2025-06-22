import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Download, Accessibility } from "lucide-react";
import zafLogo from "@/assets/zaf-logo.svg";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const navigation = [
    { name: 'Education', href: 'education' },
    { name: 'Testing Tools', href: 'testing' },
    { name: 'Audit Checklist', href: 'checklist' },
    { name: 'Knowledge Base', href: 'knowledge' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main navigation">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <img 
                src={zafLogo} 
                alt="Zaf Technology" 
                className="h-10 w-auto"
              />
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-primary flex items-center">
                  <Accessibility className="mr-2 h-6 w-6" aria-hidden="true" />
                  AccessibilityPro
                </h1>
                <span className="text-xs text-gray-500 -mt-1">by Zaf Technology</span>
              </div>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <Button className="bg-primary text-white hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              Generate Report
            </Button>
          </div>
          
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className="text-left text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      {item.name}
                    </button>
                  ))}
                  <Button className="mt-4">
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
