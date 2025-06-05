import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Writing Tools
import BlogWriter from "./pages/tools/writing/BlogWriter";
import ResumeGenerator from "./pages/tools/writing/ResumeGenerator";
import GrammarFixer from "./pages/tools/writing/GrammarFixer";

// Coding Tools
import CodeExplainer from "./pages/tools/coding/CodeExplainer";
import RegexGenerator from "./pages/tools/coding/RegexGenerator";
import ErrorFixer from "./pages/tools/coding/ErrorFixer";

// Vision & Image Tools
import OCRReader from "./pages/tools/vision/OCRReader";
import ObjectDescriber from "./pages/tools/vision/ObjectDescriber";
import ImageGenerator from "./pages/tools/vision/ImageGenerator";

// Education Tools
import MathSolver from "./pages/tools/education/MathSolver";
import HomeworkAssistant from "./pages/tools/education/HomeworkAssistant";
import NotesToMindMap from "./pages/tools/education/NotesToMindMap";

// Business Tools
import InvoiceCreator from "./pages/tools/business/InvoiceCreator";
import SocialPostGenerator from "./pages/tools/business/SocialPostGenerator";
import IdeaValidator from "./pages/tools/business/IdeaValidator";

// Voice/Audio Tools
import TextToSpeech from "./pages/tools/voice/TextToSpeech";
import StoryNarrator from "./pages/tools/voice/StoryNarrator";

// Other Tools
import ChatWithPDF from "./pages/tools/other/ChatWithPDF";
import YouTubeSummarizer from "./pages/tools/other/YouTubeSummarizer";

// Additional pages
import MyWorkspace from "./pages/MyWorkspace";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  
                  {/* Writing Tools */}
                  <Route path="/tools/writing/blog-writer" element={<BlogWriter />} />
                  <Route path="/tools/writing/resume-generator" element={<ResumeGenerator />} />
                  <Route path="/tools/writing/grammar-fixer" element={<GrammarFixer />} />
                  
                  {/* Coding Tools */}
                  <Route path="/tools/coding/code-explainer" element={<CodeExplainer />} />
                  <Route path="/tools/coding/regex-generator" element={<RegexGenerator />} />
                  <Route path="/tools/coding/error-fixer" element={<ErrorFixer />} />
                  
                  {/* Vision & Image Tools */}
                  <Route path="/tools/vision/ocr-reader" element={<OCRReader />} />
                  <Route path="/tools/vision/object-describer" element={<ObjectDescriber />} />
                  <Route path="/tools/vision/image-generator" element={<ImageGenerator />} />
                  
                  {/* Education Tools */}
                  <Route path="/tools/education/math-solver" element={<MathSolver />} />
                  <Route path="/tools/education/homework-assistant" element={<HomeworkAssistant />} />
                  <Route path="/tools/education/notes-to-mindmap" element={<NotesToMindMap />} />
                  
                  {/* Business Tools */}
                  <Route path="/tools/business/invoice-creator" element={<InvoiceCreator />} />
                  <Route path="/tools/business/social-post-generator" element={<SocialPostGenerator />} />
                  <Route path="/tools/business/idea-validator" element={<IdeaValidator />} />
                  
                  {/* Voice/Audio Tools */}
                  <Route path="/tools/voice/text-to-speech" element={<TextToSpeech />} />
                  <Route path="/tools/voice/story-narrator" element={<StoryNarrator />} />
                  
                  {/* Other Tools */}
                  <Route path="/tools/other/chat-with-pdf" element={<ChatWithPDF />} />
                  <Route path="/tools/other/youtube-summarizer" element={<YouTubeSummarizer />} />
                  
                  {/* Additional pages */}
                  <Route path="/my-workspace" element={<MyWorkspace />} />
                  <Route path="/overview" element={<Pricing />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-conditions" element={<TermsConditions />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
