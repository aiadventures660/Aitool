
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Share2, Copy, Download, Sparkles, Loader2, Hash, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/layout/ToolLayout";
import { generateContent, GeminiRequest } from "@/services/geminiService";
import { useApiKey } from "@/hooks/useApiKey";

const SocialPostGenerator = () => {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("professional");
  const [audience, setAudience] = useState("");
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useApiKey();
  const { toast } = useToast();

  const platforms = [
    { value: "instagram", label: "Instagram", limit: "2,200 characters" },
    { value: "twitter", label: "Twitter/X", limit: "280 characters" },
    { value: "facebook", label: "Facebook", limit: "63,206 characters" },
    { value: "linkedin", label: "LinkedIn", limit: "3,000 characters" },
    { value: "tiktok", label: "TikTok", limit: "2,200 characters" },
  ];

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "humorous", label: "Humorous" },
    { value: "inspirational", label: "Inspirational" },
    { value: "educational", label: "Educational" },
    { value: "promotional", label: "Promotional" },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic for your social media post",
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
    
    const selectedPlatform = platforms.find(p => p.value === platform);
    const audienceText = audience ? ` for ${audience}` : "";
    
    const request: GeminiRequest = {
      prompt: `Create an engaging ${tone} social media post for ${platform}${audienceText} about: "${topic}". 
      
      Requirements:
      - Platform: ${platform} (${selectedPlatform?.limit})
      - Tone: ${tone}
      - Include relevant hashtags
      - Make it engaging and shareable
      - Follow ${platform} best practices
      ${audience ? `- Target audience: ${audience}` : ""}
      
      Return only the post content without quotes or additional formatting.`,
      contentType: "social media post",
      platform: platform,
      apiKey,
    };

    try {
      const response = await generateContent(request);
      
      if (response.success) {
        const cleanedContent = response.content.replace(/\*/g, '');
        setPost(cleanedContent);
        toast({
          title: "Success!",
          description: "Social media post generated successfully",
        });
      } else {
        throw new Error(response.error || "Failed to generate content");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(post);
    toast({
      title: "Copied!",
      description: "Post copied to clipboard",
    });
  };

  const downloadContent = () => {
    const element = document.createElement("a");
    const file = new Blob([post], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${platform}-post.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout
      title="Social Post Generator"
      description="Create engaging social media posts for any platform with AI assistance"
      icon={<Share2 className="w-8 h-8 text-white" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Post Settings</CardTitle>
            <CardDescription>
              Configure your social media post preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic or Message</Label>
              <Textarea
                id="topic"
                placeholder="What would you like to post about? (e.g., product launch, industry insights, personal update)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  {platforms.find(p => p.value === platform)?.limit}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience (Optional)</Label>
                <Input
                  id="audience"
                  placeholder="e.g., entrepreneurs, millennials, tech enthusiasts"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Post...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Post
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Generated Post</CardTitle>
            <CardDescription>
              Your AI-generated social media post
            </CardDescription>
          </CardHeader>
          <CardContent>
            {post ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto border-l-4 border-l-pink-500">
                  <div className="text-sm font-sans text-gray-800 whitespace-pre-wrap">
                    {post}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Character count: {post.length}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                    Post Ready
                  </Badge>
                  <Badge variant="outline">{platform}</Badge>
                  <Badge variant="outline">{tone}</Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
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
                <Share2 className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No post generated yet
                </h3>
                <p className="text-gray-500 px-4">
                  Enter your topic and preferences to generate a social media post
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>📱 Social Media Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Hash className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-2">Use Hashtags</h4>
              <p className="text-sm text-gray-600">Include relevant hashtags to increase discoverability</p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-2">Know Your Audience</h4>
              <p className="text-sm text-gray-600">Tailor your content to your target audience</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-2">Stay Consistent</h4>
              <p className="text-sm text-gray-600">Post regularly to maintain engagement</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
};

export default SocialPostGenerator;
