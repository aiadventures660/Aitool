
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Code, Copy, Download, Sparkles, Loader2, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/layout/ToolLayout";
import { generateContent, GeminiRequest } from "@/services/geminiService";
import { useApiKey } from "@/hooks/useApiKey";

const RegexGenerator = () => {
  const [description, setDescription] = useState("");
  const [testString, setTestString] = useState("");
  const [regex, setRegex] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useApiKey();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Please describe what you want to match with regex",
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
      prompt: `Generate a regular expression (regex) for: "${description}"

Please provide:
1. The regex pattern
2. A clear explanation of how the regex works
3. Examples of what it will match
4. Common use cases

Format the response without asterisks or special formatting characters.`,
      contentType: "regex pattern and explanation",
      platform: "Programming",
      apiKey,
    };

    try {
      const response = await generateContent(request);
      
      if (response.success) {
        const cleanedContent = response.content.replace(/\*/g, '');
        const lines = cleanedContent.split('\n');
        const regexLine = lines.find(line => line.includes('/') || line.includes('^') || line.includes('\\'));
        
        if (regexLine) {
          setRegex(regexLine.trim());
        }
        setExplanation(cleanedContent);
        toast({
          title: "Success!",
          description: "Regex pattern generated successfully",
        });
      } else {
        throw new Error(response.error || "Failed to generate content");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate regex. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyRegex = () => {
    navigator.clipboard.writeText(regex);
    toast({
      title: "Copied!",
      description: "Regex pattern copied to clipboard",
    });
  };

  const downloadContent = () => {
    const content = `Regex Pattern: ${regex}\n\nExplanation:\n${explanation}`;
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "regex-pattern.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const testRegex = () => {
    if (!regex || !testString) {
      toast({
        title: "Info",
        description: "Please provide both regex pattern and test string",
      });
      return;
    }

    try {
      const regexPattern = new RegExp(regex);
      const matches = regexPattern.test(testString);
      toast({
        title: matches ? "Match Found!" : "No Match",
        description: matches ? "The pattern matches your test string" : "The pattern doesn't match your test string",
        variant: matches ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Invalid Regex",
        description: "The regex pattern is not valid",
        variant: "destructive",
      });
    }
  };

  return (
    <ToolLayout
      title="Regex Generator"
      description="Generate and test regular expressions with AI assistance"
      icon={<Code className="w-8 h-8 text-white" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Regex Requirements</CardTitle>
            <CardDescription>
              Describe what you want to match
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Pattern Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what you want to match. E.g., 'Email addresses', 'Phone numbers in US format', 'URLs starting with https'"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="testString">Test String (Optional)</Label>
              <Input
                id="testString"
                placeholder="Enter a string to test the generated regex"
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                className="text-sm font-mono"
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              className="w-full bg-gradient-to-r from-green-500 to-teal-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Regex...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Regex
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Generated Regex</CardTitle>
            <CardDescription>
              Your regular expression pattern and explanation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {regex ? (
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
                  {regex}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-sans text-gray-800">
                    {explanation}
                  </pre>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Pattern Ready
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={copyRegex} variant="outline" className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Regex
                  </Button>
                  <Button onClick={testRegex} variant="outline" className="flex-1">
                    <TestTube className="w-4 h-4 mr-2" />
                    Test
                  </Button>
                  <Button onClick={downloadContent} variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Code className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No regex generated yet
                </h3>
                <p className="text-gray-500 px-4">
                  Describe what you want to match to generate a regex pattern
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default RegexGenerator;
