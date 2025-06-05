
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Network, Copy, Download, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/layout/ToolLayout";
import { generateContent, GeminiRequest } from "@/services/geminiService";
import { useApiKey } from "@/hooks/useApiKey";

const NotesToMindMap = () => {
  const [notes, setNotes] = useState("");
  const [mindMap, setMindMap] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useApiKey();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!notes.trim()) {
      toast({
        title: "Error",
        description: "Please enter your notes",
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
    
    const request: GeminiRequest = {
      prompt: `Convert these notes into a structured mind map format: "${notes}". Create a hierarchical structure with main topics, subtopics, and key points. Use indentation and bullet points to show relationships and organize the information visually.`,
      contentType: "mind map structure",
      platform: "Education",
      apiKey,
    };

    try {
      const response = await generateContent(request);
      
      if (response.success) {
        setMindMap(response.content);
        toast({
          title: "Success!",
          description: "Mind map generated successfully",
        });
      } else {
        throw new Error(response.error || "Failed to generate content");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate mind map. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mindMap);
    toast({
      title: "Copied!",
      description: "Mind map copied to clipboard",
    });
  };

  const downloadContent = () => {
    const element = document.createElement("a");
    const file = new Blob([mindMap], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "mind-map.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout
      title="Notes to Mind Map"
      description="Transform your notes into structured mind maps for better understanding"
      icon={<Network className="w-8 h-8 text-white" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Your Notes</CardTitle>
            <CardDescription>
              Paste your notes here to convert them into a mind map
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your notes, lecture content, or study material here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={12}
              className="resize-none"
            />

            <Button 
              onClick={handleGenerate} 
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Mind Map...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Mind Map
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Mind Map Structure</CardTitle>
            <CardDescription>
              Your notes organized as a visual mind map
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mindMap ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                    {mindMap}
                  </pre>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    Mind Map Ready
                  </Badge>
                </div>

                <div className="flex space-x-2">
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
                <Network className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No mind map yet
                </h3>
                <p className="text-gray-500">
                  Enter your notes to create a structured mind map
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>🧠 Mind Mapping Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Visual Learning</h4>
              <p className="text-sm text-gray-600">Mind maps help you see connections between concepts and ideas</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Better Retention</h4>
              <p className="text-sm text-gray-600">Structured information is easier to remember and recall</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Study Efficiency</h4>
              <p className="text-sm text-gray-600">Quickly review main points and their relationships</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
};

export default NotesToMindMap;
