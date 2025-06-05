
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Code, Copy, Download, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/layout/ToolLayout";
import { generateContent, GeminiRequest } from "@/services/geminiService";
import { useApiKey } from "@/hooks/useApiKey";

const CodeExplainer = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [explainLevel, setExplainLevel] = useState("intermediate");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useApiKey();
  const { toast } = useToast();

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "react", label: "React" },
    { value: "typescript", label: "TypeScript" },
    { value: "php", label: "PHP" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "swift", label: "Swift" }
  ];

  const handleExplain = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code to explain",
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
    
    let prompt = `Explain this ${language} code in detail at a ${explainLevel} level:

\`\`\`${language}
${code}
\`\`\`

Please provide:
1. Overview of what the code does
2. Line-by-line explanation of important parts
3. Key concepts and patterns used
4. Best practices or improvements if applicable
5. Common use cases or applications

Format your response clearly with proper headings and code snippets where helpful.`;

    const request: GeminiRequest = {
      prompt,
      contentType: "code explanation",
      platform: "Code Editor",
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
        
        setExplanation(cleanedContent);
        toast({
          title: "Success!",
          description: "Code explanation generated successfully",
        });
      } else {
        throw new Error(response.error || "Failed to generate explanation");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: "Failed to explain code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(explanation);
    toast({
      title: "Copied!",
      description: "Explanation copied to clipboard",
    });
  };

  const downloadContent = () => {
    const element = document.createElement("a");
    const file = new Blob([explanation], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "code-explanation.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout
      title="Code Explainer"
      description="Get detailed explanations of code in any programming language"
      icon={<Code className="w-8 h-8 text-white" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        {/* Input Section */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-green-600" />
              <span>Code Input</span>
            </CardTitle>
            <CardDescription>
              Paste your code and configure explanation settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code">Code to Explain</Label>
              <Textarea
                id="code"
                placeholder="Paste your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={12}
                className="resize-none font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                {code.length} characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="level">Explanation Level</Label>
                <Select value={explainLevel} onValueChange={setExplainLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleExplain} 
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Code...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Explain Code
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Code Explanation</CardTitle>
            <CardDescription>
              Detailed explanation of your code
            </CardDescription>
          </CardHeader>
          <CardContent>
            {explanation ? (
              <div className="space-y-4">
                <div className="bg-gray-50 border rounded-lg p-6 min-h-[400px] max-h-[600px] overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans leading-relaxed text-gray-800 bg-transparent">
                      {explanation}
                    </pre>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Explanation Complete
                  </Badge>
                  <Badge variant="outline">
                    {language}
                  </Badge>
                  <Badge variant="outline">
                    {explainLevel} level
                  </Badge>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Explanation
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
                  No explanation generated yet
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Paste your code and click "Explain Code" to get a detailed explanation
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default CodeExplainer;
