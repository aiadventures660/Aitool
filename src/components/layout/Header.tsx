
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Update search query from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to home page with search query as URL parameter
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e as any);
    }
  };

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="flex h-16 items-center gap-2 md:gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg md:text-xl hidden sm:block">AI ToolBay</span>
        </Link>

        {/* Search Bar - Hidden on small screens */}
        <div className="flex-1 max-w-md mx-auto hidden md:block">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-4"
            />
          </form>
        </div>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden lg:flex items-center space-x-4">
          <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Contact
          </Link>
          <Link to="/overview" className="text-sm font-medium text-gray-600 hover:text-gray-900">
         Overview
          </Link>
        </nav>

        {/* Get Started Button */}
        {/* <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-xs md:text-sm px-3 md:px-4">
          <span className="hidden sm:inline">Get Started</span>
          <span className="sm:hidden">Start</span>
        </Button> */}

        {/* Mobile Sidebar Trigger - Positioned on the far right with margin */}
        <div className="md:hidden ml-auto">
          <SidebarTrigger />
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search AI tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 pr-4"
          />
        </form>
      </div>
    </header>
  );
};

export default Header;