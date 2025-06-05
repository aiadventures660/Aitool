
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Youtube, Copy, Download, Sparkles, Loader2, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/layout/ToolLayout";
import { generateContent, GeminiRequest } from "@/services/geminiService";
import { useApiKey } from "@/hooks/useApiKey";

const YouTubeSummarizer = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [summaryLength, setSummaryLength] = useState("medium");
  const [summaryType, setSummaryType] = useState("bullet");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useApiKey();
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!videoUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a YouTube video URL",
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

    // Basic YouTube URL validation
    if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
      toast({
        title: "Error",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const request: GeminiRequest = {
      prompt: `Summarize this YouTube video: ${videoUrl}. Create a ${summaryLength} summary in ${summaryType} format. Include key points, main topics discussed, and important takeaways.`,
      contentType: `${summaryLength} YouTube video summary`,
      platform: "YouTube",
      apiKey,
    };

    try {
      const response = await generateContent(request);
      
      if (response.success) {
        const cleanedContent = response.content.replace(/\*/g, '-');
        setSummary(cleanedContent);
        toast({
          title: "Success!",
          description: "Video summary generated successfully",
        });
      } else {
        throw new Error(response.error || "Failed to generate content");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: "Failed to summarize video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    toast({
      title: "Copied!",
      description: "Summary copied to clipboard",
    });
  };

  const downloadContent = () => {
    const element = document.createElement("a");
    const file = new Blob([summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "youtube-summary.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = extractVideoId(videoUrl);

  return (
    <ToolLayout
      title="YouTube Summarizer"
      description="Get concise summaries of YouTube videos to save time and extract key insights"
      icon={<Youtube className="w-8 h-8 text-white" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Video Details</CardTitle>
            <CardDescription>
              Enter YouTube video URL and customize summary preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="videoUrl">YouTube Video URL</Label>
              <Input
                id="videoUrl"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="text-sm"
              />
            </div>

            {videoId && (
              <div className="bg-gray-50 rounded-lg p-4">
                <img 
                  src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                  alt="Video thumbnail"
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <p className="text-sm text-gray-600">Video preview loaded</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="summaryLength">Summary Length</Label>
                <Select value={summaryLength} onValueChange={setSummaryLength}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (2-3 sentences)</SelectItem>
                    <SelectItem value="medium">Medium (1 paragraph)</SelectItem>
                    <SelectItem value="long">Long (detailed summary)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summaryType">Summary Format</Label>
                <Select value={summaryType} onValueChange={setSummaryType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bullet">Bullet Points</SelectItem>
                    <SelectItem value="paragraph">Paragraph</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="timeline">Timeline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleSummarize} 
              className="w-full bg-gradient-to-r from-red-500 to-pink-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Summarizing Video...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Summarize Video
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Video Summary</CardTitle>
            <CardDescription>
              Key insights and takeaways from the video
            </CardDescription>
          </CardHeader>
          <CardContent>
            {summary ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-sans text-gray-800">
                    {summary}
                  </pre>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-red-100 text-red-700">
                    Summary Ready
                  </Badge>
                  <Badge variant="outline">{summaryLength}</Badge>
                  <Badge variant="outline">{summaryType}</Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button onClick={downloadContent} variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Youtube className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No summary generated yet
                </h3>
                <p className="text-gray-500 px-4">
                  Enter a YouTube video URL to generate a summary
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Benefits Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>📺 Why Summarize Videos?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-2">Save Time</h4>
              <p className="text-sm text-gray-600">Get key insights without watching entire videos</p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-2">Better Retention</h4>
              <p className="text-sm text-gray-600">Written summaries help you remember important points</p>
            </div>
            <div className="text-center">
              <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-2">Quick Reference</h4>
              <p className="text-sm text-gray-600">Create searchable notes from video content</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
};

export default YouTubeSummarizer;
