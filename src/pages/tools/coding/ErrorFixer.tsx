
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bug, Copy, Download, Sparkles, Loader2, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/layout/ToolLayout";
import { generateContent, GeminiRequest } from "@/services/geminiService";
import { useApiKey } from "@/hooks/useApiKey";

const ErrorFixer = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [solution, setSolution] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useApiKey();
  const { toast } = useToast();

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "php", label: "PHP" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "typescript", label: "TypeScript" },
  ];

  const handleFixError = async () => {
    if (!errorMessage.trim() && !codeSnippet.trim()) {
      toast({
        title: "Error",
        description: "Please provide either an error message or code snippet",
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
      prompt: `Help fix this ${language} error:

${errorMessage ? `Error Message: ${errorMessage}` : ''}

${codeSnippet ? `Code Snippet:\n${codeSnippet}` : ''}

Please provide:
1. Explanation of what's causing the error
2. Step-by-step solution to fix it
3. Corrected code (if applicable)
4. Best practices to avoid similar errors

Format the response clearly without using asterisks for formatting.`,
      contentType: "error diagnosis and solution",
      platform: "Programming",
      apiKey,
    };

    try {
      const response = await generateContent(request);
      
      if (response.success) {
        const cleanedContent = response.content.replace(/\*/g, '');
        setSolution(cleanedContent);
        toast({
          title: "Success!",
          description: "Error analysis completed successfully",
        });
      } else {
        throw new Error(response.error || "Failed to generate content");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: "Failed to analyze error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(solution);
    toast({
      title: "Copied!",
      description: "Solution copied to clipboard",
    });
  };

  const downloadContent = () => {
    const element = document.createElement("a");
    const file = new Blob([solution], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "error-solution.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout
      title="Error Fixer"
      description="Get help with debugging and fixing programming errors"
      icon={<Bug className="w-8 h-8 text-white" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Error Details</CardTitle>
            <CardDescription>
              Provide your error message and code for analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Programming Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="errorMessage">Error Message</Label>
              <Textarea
                id="errorMessage"
                placeholder="Paste your error message here..."
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                rows={3}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codeSnippet">Code Snippet (Optional)</Label>
              <Textarea
                id="codeSnippet"
                placeholder="Paste the problematic code here..."
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            <Button 
              onClick={handleFixError} 
              className="w-full bg-gradient-to-r from-red-500 to-orange-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Error...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Fix Error
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Solution</CardTitle>
            <CardDescription>
              Error analysis and fix suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {solution ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-sans text-gray-800">
                    {solution}
                  </pre>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Solution Ready
                  </Badge>
                  <Badge variant="outline">{language}</Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Solution
                  </Button>
                  <Button onClick={downloadContent} variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bug className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No analysis yet
                </h3>
                <p className="text-gray-500 px-4">
                  Provide your error details to get a solution
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default ErrorFixer;
