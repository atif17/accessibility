import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import WcagEducation from "@/components/wcag-education";
import TestingTools from "@/components/testing-tools";
import AuditChecklist from "@/components/audit-checklist";
import KnowledgeBase from "@/components/knowledge-base";
import ReportGeneration from "@/components/report-generation";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary text-white p-2 z-50 rounded"
      >
        Skip to main content
      </a>
      
      <Header />
      
      <main id="main-content" className="focus:outline-none">
        <HeroSection />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WcagEducation />
          <TestingTools />
          <AuditChecklist />
          <KnowledgeBase />
          <ReportGeneration />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
