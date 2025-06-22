import { Button } from "@/components/ui/button";
import { Accessibility } from "lucide-react";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import zafLogo from "@/assets/zaf-logo.svg";

export default function Footer() {
  const footerSections = [
    {
      title: "Tools",
      links: [
        "Accessibility Scanner",
        "Color Contrast Checker", 
        "Screen Reader Test",
        "Audit Checklist"
      ]
    },
    {
      title: "Resources",
      links: [
        "WCAG Guidelines",
        "Knowledge Base",
        "Best Practices",
        "Case Studies"
      ]
    },
    {
      title: "Support", 
      links: [
        "Contact Us",
        "Documentation",
        "API Reference",
        "Status Page"
      ]
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={zafLogo} 
                alt="Zaf Technology" 
                className="h-8 w-auto"
              />
              <div>
                <h3 className="text-lg font-semibold flex items-center">
                  <Accessibility className="mr-2 h-5 w-5" />
                  AccessibilityPro
                </h3>
                <span className="text-xs text-gray-400">by Zaf Technology</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Making the web accessible for everyone through education, testing, and compliance tools.
            </p>
            <div className="flex space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-300 hover:text-white p-0"
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-300 hover:text-white p-0"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-300 hover:text-white p-0"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link}>
                    <button 
                      onClick={() => {
                        // Map link names to section IDs
                        if (link === "Accessibility Scanner") scrollToSection("testing");
                        else if (link === "Audit Checklist") scrollToSection("checklist");
                        else if (link === "WCAG Guidelines") scrollToSection("education");
                        else if (link === "Knowledge Base") scrollToSection("knowledge");
                      }}
                      className="text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2025 Zaf Technology. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button className="text-gray-300 hover:text-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900">
              Privacy Policy
            </button>
            <button className="text-gray-300 hover:text-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900">
              Terms of Service
            </button>
            <button className="text-gray-300 hover:text-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900">
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
