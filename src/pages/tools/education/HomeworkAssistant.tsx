import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Copy, Download, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/layout/ToolLayout";
import { generateContent, GeminiRequest } from "@/services/geminiService";
import { useApiKey } from "@/hooks/useApiKey";

const HomeworkAssistant = () => {
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [assistance, setAssistance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useApiKey();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!question.trim()) {
      toast({
        title: "Error",
        description: "Please enter your homework question",
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
      prompt: `Help with this ${subject || 'academic'} homework question for ${gradeLevel || 'student'}: "${question}". Provide a clear explanation, step-by-step solution if applicable, and educational guidance to help understand the concept better. Focus on teaching rather than just giving answers. Do not use asterisks (*) for formatting.`,
      contentType: "homework assistance",
      platform: "Education",
      apiKey,
    };

    try {
      const response = await generateContent(request);
      
      if (response.success) {
        const cleanedContent = response.content.replace(/\*/g, '-');
        setAssistance(cleanedContent);
        toast({
          title: "Success!",
          description: "Homework assistance generated successfully",
        });
      } else {
        throw new Error(response.error || "Failed to generate content");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate assistance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(assistance);
    toast({
      title: "Copied!",
      description: "Assistance copied to clipboard",
    });
  };

  const downloadContent = () => {
    const element = document.createElement("a");
    const file = new Blob([assistance], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "homework-assistance.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout
      title="Homework Assistant"
      description="Get educational guidance and help with your homework questions"
      icon={<BookOpen className="w-8 h-8 text-white" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Homework Question</CardTitle>
            <CardDescription>
              Enter your homework question for educational assistance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Mathematics, Science, History"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gradeLevel">Grade Level</Label>
                <Select value={gradeLevel} onValueChange={setGradeLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elementary">Elementary (K-5)</SelectItem>
                    <SelectItem value="middle">Middle School (6-8)</SelectItem>
                    <SelectItem value="high">High School (9-12)</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">Homework Question</Label>
              <Textarea
                id="question"
                placeholder="Enter your homework question or problem here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={6}
                className="text-sm"
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              className="w-full bg-gradient-to-r from-green-500 to-blue-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Getting Help...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Homework Help
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Educational Assistance</CardTitle>
            <CardDescription>
              Step-by-step guidance for your homework
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assistance ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-sans text-gray-800">
                    {assistance}
                  </pre>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Educational Guide
                  </Badge>
                  {subject && <Badge variant="outline">{subject}</Badge>}
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
                <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No assistance yet
                </h3>
                <p className="text-gray-500 px-4">
                  Enter your homework question to get educational help
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>📚 Study Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Break It Down</h4>
              <p className="text-sm text-gray-600">Divide complex problems into smaller, manageable steps</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Understand First</h4>
              <p className="text-sm text-gray-600">Focus on understanding concepts rather than memorizing answers</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Practice Regularly</h4>
              <p className="text-sm text-gray-600">Regular practice helps reinforce learning and build confidence</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
};

export default HomeworkAssistant;
