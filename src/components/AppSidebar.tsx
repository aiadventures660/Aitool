
import { 
  Home, 
  PenTool, 
  Code, 
  Eye, 
  GraduationCap, 
  Briefcase, 
  Mic, 
  MoreHorizontal,
  Settings,
  User,
  Crown,
  Search,
  CircleCheck
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const toolCategories = [
  {
    title: "Writing",
    icon: PenTool,
    tools: [
      { title: "Blog Writer", url: "/tools/writing/blog-writer" },
      { title: "Resume Generator", url: "/tools/writing/resume-generator" },
      { title: "Grammar Fixer", url: "/tools/writing/grammar-fixer" },
    ],
  },
  {
    title: "Coding",
    icon: Code,
    tools: [
      { title: "Code Explainer", url: "/tools/coding/code-explainer" },
      { title: "Regex Generator", url: "/tools/coding/regex-generator" },
      { title: "Error Fixer", url: "/tools/coding/error-fixer" },
    ],
  },
  {
    title: "Vision & Image",
    icon: Eye,
    tools: [
      { title: "OCR Reader", url: "/tools/vision/ocr-reader" },
      { title: "Object Describer", url: "/tools/vision/object-describer" },
      { title: "Image Generator", url: "/tools/vision/image-generator" },
    ],
  },
  {
    title: "Education",
    icon: GraduationCap,
    tools: [
      { title: "Math Solver", url: "/tools/education/math-solver" },
      { title: "Homework Assistant", url: "/tools/education/homework-assistant" },
      { title: "Notes to Mind Map", url: "/tools/education/notes-to-mindmap" },
    ],
  },
  {
    title: "Business",
    icon: Briefcase,
    tools: [
      { title: "Invoice Creator", url: "/tools/business/invoice-creator" },
      { title: "Social Post Generator", url: "/tools/business/social-post-generator" },
      { title: "Idea Validator", url: "/tools/business/idea-validator" },
    ],
  },
  {
    title: "Voice & Audio",
    icon: Mic,
    tools: [
      { title: "Text to Speech", url: "/tools/voice/text-to-speech" },
      // { title: "Story Narrator", url: "/tools/voice/story-narrator" },
    ],
  },
  {
    title: "Other Tools",
    icon: MoreHorizontal,
    tools: [
      // { title: "Chat with PDF", url: "/tools/other/chat-with-pdf" },
      { title: "YouTube Summarizer", url: "/tools/other/youtube-summarizer" },
    ],
  },
];

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  // {
  //   title: "My Workspace",
  //   url: "/workspace",
  //   icon: User,
  // },
  {
    title: "Overview",
    url: "/overview",
    icon: Crown,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <div>
            <Link to="/">
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI ToolBay
            </h2>
            </Link>
            <p className="text-xs text-gray-500">Smart AI Toolbox</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* AI Tools Categories */}
        <SidebarGroup>
          <SidebarGroupLabel>AI Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolCategories.map((category) => (
                <Collapsible key={category.title} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <category.icon className="w-4 h-4" />
                        <span>{category.title}</span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {category.tools.length}
                        </Badge>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {category.tools.map((tool) => (
                          <SidebarMenuSubItem key={tool.title}>
                            <SidebarMenuSubButton asChild isActive={location.pathname === tool.url}>
                              <Link to={tool.url}>
                                <span>{tool.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center justify-center">
  <CircleCheck/>
            <a href="https://socialmint.online/">
            Social AI Generator
            </a>
        
          </Button>
          <div className="text-xs text-gray-500 text-center">
            © 2025 AI ToolBay
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
