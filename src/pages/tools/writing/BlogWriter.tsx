
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PenTool, Copy, Download, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/layout/ToolLayout";
import { generateContent, GeminiRequest } from "@/services/geminiService";
import { useApiKey } from "@/hooks/useApiKey";

const BlogWriter = () => {
  const [topic, setTopic] = useState("");
  const [wordCount, setWordCount] = useState("800");
  const [tone, setTone] = useState("informative");
  const [targetAudience, setTargetAudience] = useState("");
  const [keywords, setKeywords] = useState("");
  const [generatedBlog, setGeneratedBlog] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useApiKey();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a blog topic",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "Error",
        description: "API key not available",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    let prompt = `Write a comprehensive ${wordCount}-word blog post about: ${topic}. Use a ${tone} tone.`;
    
    if (targetAudience) {
      prompt += ` Target audience: ${targetAudience}.`;
    }
    
    if (keywords) {
      prompt += ` Include these keywords naturally: ${keywords}.`;
    }
    
    prompt += ` Structure the blog with:
    - A compelling title
    - An engaging introduction
    - Well-organized main content with subheadings
    - A strong conclusion
    - Call to action
    
    Format with proper markdown headings and make it SEO-friendly.`;

    const request: GeminiRequest = {
      prompt,
      contentType: `${wordCount}-word blog post`,
      platform: "Blog",
      apiKey,
    };

    try {
      const response = await generateContent(request);
      
      if (response.success) {
        // Clean up the response by removing asterisks and formatting
        let cleanedContent = response.content
          .replace(/\*\*/g, '') // Remove bold asterisks
          .replace(/\*/g, '-') // Replace single asterisks with dashes
          .replace(/#{1,6}\s*/g, (match) => match) // Keep headings as is
          .trim();
        
        setGeneratedBlog(cleanedContent);
        toast({
          title: "Success!",
          description: "Your blog post has been generated successfully",
        });
      } else {
        throw new Error(response.error || "Failed to generate content");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedBlog);
    toast({
      title: "Copied!",
      description: "Blog post copied to clipboard",
    });
  };

  const downloadContent = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedBlog], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "blog-post.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout
      title="Blog Writer"
      description="Create engaging, SEO-friendly blog posts with AI assistance"
      icon={<PenTool className="w-8 h-8 text-white" />}
      badge="Popular"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PenTool className="w-5 h-5 text-blue-600" />
              <span>Blog Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure your blog post settings for optimal results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">Blog Topic</Label>
              <Textarea
                id="topic"
                placeholder="What's your blog about? E.g., 'The Future of Artificial Intelligence in Healthcare'"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wordCount">Word Count</Label>
                <Select value={wordCount} onValueChange={setWordCount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select word count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="400">400 words</SelectItem>
                    <SelectItem value="600">600 words</SelectItem>
                    <SelectItem value="800">800 words</SelectItem>
                    <SelectItem value="1000">1000 words</SelectItem>
                    <SelectItem value="1500">1500 words</SelectItem>
                    <SelectItem value="2000">2000 words</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Writing Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="informative">Informative</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                placeholder="e.g., Beginner developers, Marketing professionals"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (SEO)</Label>
              <Input
                id="keywords"
                placeholder="e.g., AI, machine learning, automation (comma-separated)"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Writing Blog Post...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Blog Post
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Generated Blog Post</CardTitle>
            <CardDescription>
              Your AI-generated blog post is ready for publication
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedBlog ? (
              <div className="space-y-4">
                <div className="bg-white border rounded-lg p-6 min-h-[400px] max-h-[600px] overflow-y-auto">
                  <div className="prose prose-sm max-w-none text-gray-800">
                    <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                      {generatedBlog}
                    </pre>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Ready to Publish
                  </Badge>
                  <Badge variant="outline">
                    ~{wordCount} words
                  </Badge>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Post
                  </Button>
                  <Button onClick={downloadContent} variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <PenTool className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No blog post generated yet
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Fill out the form and click "Generate Blog Post" to create your content
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default BlogWriter;
