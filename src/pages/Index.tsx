
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Sparkles, 
  PenTool, 
  Code, 
  Eye, 
  GraduationCap, 
  Briefcase, 
  Mic, 
  MoreHorizontal,
  TrendingUp,
  Users,
  Zap,
  Search,
  ArrowRight
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

const allTools = [
  // Writing Tools
  { title: "Blog Writer", description: "Create engaging blog posts with AI assistance", icon: PenTool, url: "/tools/writing/blog-writer", category: "Writing", trending: true },
  { title: "Resume Generator", description: "Generate professional resumes with AI", icon: PenTool, url: "/tools/writing/resume-generator", category: "Writing" },
  { title: "Grammar Fixer", description: "Fix grammar and improve writing quality", icon: PenTool, url: "/tools/writing/grammar-fixer", category: "Writing" },
  
  // Coding Tools
  { title: "Code Explainer", description: "Understand complex code with detailed explanations", icon: Code, url: "/tools/coding/code-explainer", category: "Coding" },
  { title: "Regex Generator", description: "Generate and test regular expressions", icon: Code, url: "/tools/coding/regex-generator", category: "Coding" },
  { title: "Error Fixer", description: "Fix coding errors and bugs automatically", icon: Code, url: "/tools/coding/error-fixer", category: "Coding" },
  
  // Vision & Image Tools
  { title: "Image Generator", description: "Create stunning images from text descriptions", icon: Eye, url: "/tools/vision/image-generator", category: "Vision", trending: true },
  { title: "OCR Reader", description: "Extract text from images", icon: Eye, url: "/tools/vision/ocr-reader", category: "Vision" },
  { title: "Object Describer", description: "Describe objects in images", icon: Eye, url: "/tools/vision/object-describer", category: "Vision" },
  
  // Education Tools
  { title: "Math Solver", description: "Solve complex mathematical problems step by step", icon: GraduationCap, url: "/tools/education/math-solver", category: "Education" },
  { title: "Homework Assistant", description: "Get help with homework and assignments", icon: GraduationCap, url: "/tools/education/homework-assistant", category: "Education" },
  { title: "Notes to Mind Map", description: "Convert notes to visual mind maps", icon: GraduationCap, url: "/tools/education/notes-to-mindmap", category: "Education" },
  
  // Business Tools
  { title: "Invoice Creator", description: "Create professional invoices", icon: Briefcase, url: "/tools/business/invoice-creator", category: "Business" },
  { title: "Social Post Generator", description: "Generate engaging social media posts", icon: Briefcase, url: "/tools/business/social-post-generator", category: "Business" },
  { title: "Idea Validator", description: "Validate business ideas with AI", icon: Briefcase, url: "/tools/business/idea-validator", category: "Business" },
  
  // Voice & Audio Tools
  { title: "Text to Speech", description: "Convert text to natural speech", icon: Mic, url: "/tools/voice/text-to-speech", category: "Voice" },
  { title: "Story Narrator", description: "Create narrated stories", icon: Mic, url: "/tools/voice/story-narrator", category: "Voice" },
  
  // Other Tools
  { title: "Chat with PDF", description: "Chat with your PDF documents", icon: MoreHorizontal, url: "/tools/other/chat-with-pdf", category: "Other" },
  { title: "YouTube Summarizer", description: "Summarize YouTube videos", icon: MoreHorizontal, url: "/tools/other/youtube-summarizer", category: "Other" },
];

const featuredTools = allTools.filter(tool => tool.trending || ["Blog Writer", "Code Explainer", "Image Generator", "Math Solver"].includes(tool.title)).slice(0, 4);

const categories = [
  { 
    title: "Writing", 
    icon: PenTool, 
    count: 3, 
    color: "from-blue-500 to-cyan-500",
    description: "Content creation tools",
    path: "/tools/writing/blog-writer"
  },
  { 
    title: "Coding", 
    icon: Code, 
    count: 3, 
    color: "from-green-500 to-emerald-500",
    description: "Development assistance",
    path: "/tools/coding/code-explainer"
  },
  { 
    title: "Vision & Image", 
    icon: Eye, 
    count: 3, 
    color: "from-purple-500 to-pink-500",
    description: "Visual AI tools",
    path: "/tools/vision/ocr-reader"
  },
  { 
    title: "Education", 
    icon: GraduationCap, 
    count: 3, 
    color: "from-orange-500 to-red-500",
    description: "Learning assistance",
    path: "/tools/education/math-solver"
  },
  { 
    title: "Business", 
    icon: Briefcase, 
    count: 3, 
    color: "from-indigo-500 to-blue-500",
    description: "Business solutions",
    path: "/tools/business/invoice-creator"
  },
  { 
    title: "Voice & Audio", 
    icon: Mic, 
    count: 2, 
    color: "from-teal-500 to-cyan-500",
    description: "Audio processing",
    path: "/tools/voice/text-to-speech"
  },
];

const stats = [
  { label: "AI Tools", value: "20+", icon: Zap },
  { label: "Happy Users", value: "1K+", icon: Users },
  { label: "Success Rate", value: "99%", icon: TrendingUp },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  // Get search query from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlSearch = params.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [location.search]);

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    return allTools.filter(tool => 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSearch = () => {
    // The search is handled by filtering, no additional action needed
  };

  return (
    <div className="space-y-6 md:space-y-8  ">
      {/* Hero Section */}
      <div className="text-center space-y-4 md:space-y-6 py-6 md:py-12">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-3 md:px-4 py-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-xs md:text-sm font-medium text-blue-800">Welcome to AI ToolBay</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent px-2">
          Smart AI Toolbox Hub
        </h1>
        
        <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
          Unleash the power of AI with our comprehensive suite of tools for writing, coding, 
          image generation, education, business, and more.
        </p>

        {/* Search Bar */}
        {/* <div className="max-w-md mx-auto relative px-4">
          <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search for AI tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-3 text-base md:text-lg border-2 focus:border-blue-500 rounded-xl"
          />
        </div> */}

        {/* Stats */}
        <div className="flex items-center justify-center space-x-4 md:space-x-8 pt-6 md:pt-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full mx-auto mb-2">
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div className="text-lg md:text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.trim() && (
        <section className="px-2">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Search Results for "{searchQuery}"
            </h2>
            <Badge variant="secondary" className="text-xs">
              {filteredTools.length} found
            </Badge>
          </div>
          
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredTools.map((tool, index) => (
                <Link key={index} to={tool.url}>
                  <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white hover:scale-105">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <tool.icon className="w-5 h-5 text-white" />
                        </div>
                        {tool.trending && (
                          <Badge variant="destructive" className="text-xs">
                            🔥 Trending
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base md:text-lg">{tool.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {tool.category}
                        </Badge>
                        <Button size="sm" className="group-hover:bg-blue-600 text-xs">
                          Try Now
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 md:py-12">
              <Search className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">No tools found</h3>
              <p className="text-gray-500">Try searching with different keywords</p>
            </div>
          )}
        </section>
      )}

      {/* Featured Tools - Only show when not searching */}
      {!searchQuery.trim() && (
        <section className="">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Featured Tools</h2>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
              ⭐ Popular
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredTools.map((tool, index) => (
              <Link key={index} to={tool.url}>
                <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white hover:scale-105">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <tool.icon className="w-5 h-5 text-white" />
                      </div>
                      {tool.trending && (
                        <Badge variant="destructive" className="text-xs">
                          🔥 Trending
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base md:text-lg">{tool.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {tool.category}
                      </Badge>
                      <Button size="sm" className="group-hover:bg-blue-600 text-xs">
                        Try Now
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Categories - Only show when not searching */}
      {!searchQuery.trim() && (
        <section className="">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Explore Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link key={index} to={category.path}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${category.color}`} />
                  <CardHeader className="p-4 md:p-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center`}>
                        <category.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="group-hover:text-blue-600 transition-colors text-base md:text-lg">
                          {category.title}
                        </CardTitle>
                        <CardDescription className="text-sm">{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4  pt-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {category.count} tools
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Call to Action - Only show when not searching */}
      {!searchQuery.trim() && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 mx-2 md:mx-0">
          <CardContent className="text-center py-8 md:py-12 px-4">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              Ready to boost your productivity?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm md:text-base">
              Join thousands of users who are already using AIWorx to streamline their workflows and unleash creativity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link to="/tools/writing/blog-writer">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              {/* <Link to="/my-workspace">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Workspace
                </Button>
              </Link> */}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;