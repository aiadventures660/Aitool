
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Copy, Download, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/layout/ToolLayout";
import { generateContent, GeminiRequest } from "@/services/geminiService";
import { useApiKey } from "@/hooks/useApiKey";

const GrammarFixer = () => {
  const [inputText, setInputText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useApiKey();
  const { toast } = useToast();

  const handleFix = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to check",
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
      prompt: `Fix the grammar, spelling, and punctuation in the following text. Also improve clarity and readability while maintaining the original meaning and tone: "${inputText}"`,
      contentType: "grammar correction",
      platform: "Text Editor",
      apiKey,
    };

    try {
      const response = await generateContent(request);
      
      if (response.success) {
        setCorrectedText(response.content);
        toast({
          title: "Success!",
          description: "Text has been corrected successfully",
        });
      } else {
        throw new Error(response.error || "Failed to generate content");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: "Failed to fix grammar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(correctedText);
    toast({
      title: "Copied!",
      description: "Corrected text copied to clipboard",
    });
  };

  const downloadContent = () => {
    const element = document.createElement("a");
    const file = new Blob([correctedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "corrected-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout
      title="Grammar Fixer"
      description="Fix grammar, spelling, and improve the clarity of your text"
      icon={<CheckCircle className="w-8 h-8 text-white" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Original Text</CardTitle>
            <CardDescription>
              Paste your text here to check for grammar and spelling errors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={10}
              className="resize-none"
            />

            <Button 
              onClick={handleFix} 
              className="w-full bg-gradient-to-r from-green-500 to-blue-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fixing Grammar...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Fix Grammar & Spelling
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Corrected Text</CardTitle>
            <CardDescription>
              Grammar and spelling corrected version
            </CardDescription>
          </CardHeader>
          <CardContent>
            {correctedText ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-sans text-gray-800">
                    {correctedText}
                  </pre>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Corrected
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
                <CheckCircle className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No corrections yet
                </h3>
                <p className="text-gray-500">
                  Enter text to check for grammar and spelling errors
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default GrammarFixer;
