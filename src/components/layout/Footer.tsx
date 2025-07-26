
import { Link } from "react-router-dom";
import { Sparkles, Facebook, Twitter, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">AI ToolBay</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your complete AI toolbox for writing, coding, design, and more. Boost your productivity with powerful AI tools.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold mb-4">AI Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tools/writing/blog-writer" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-white">Blog Writer</Link></li>
              <li><Link to="/tools/coding/code-explainer" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-white">Code Explainer</Link></li>
              <li><Link to="/tools/vision/image-generator" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-white">Image Generator</Link></li>
              <li><Link to="/tools/voice/text-to-speech" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-white">Text to Speech</Link></li>
              {/* <li><Link to="/tools/other/chat-with-pdf" className="text-gray-400 hover:text-white">Chat with PDF</Link></li> */}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link to="/overview" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-white">Overview</Link></li>
              {/* <li><Link to="/my-workspace" className="text-gray-400 hover:text-white">My Workspace</Link></li> */}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-white">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Other AI Website</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.socialmint.online/"  target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Social Media AI Content Generator</a></li>
              <li><a href="https://report-ai.toolbay.online/"  target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">ReportAI Buddy
for College Students</a></li>


<li><a href="https://daily-use-tool.online/"  target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Daily Used Tool</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 AI ToolBay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;