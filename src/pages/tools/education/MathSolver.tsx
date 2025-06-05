import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Copy, Download, Sparkles, Loader2, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/layout/ToolLayout";
import { generateContent, GeminiRequest } from "@/services/geminiService";
import { useApiKey } from "@/hooks/useApiKey";

const MathSolver = () => {
  const [problem, setProblem] = useState("");
  const [mathType, setMathType] = useState("algebra");
  const [showSteps, setShowSteps] = useState("detailed");
  const [solution, setSolution] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useApiKey();
  const { toast } = useToast();

  const mathTypes = [
    { value: "algebra", label: "Algebra" },
    { value: "calculus", label: "Calculus" },
    { value: "geometry", label: "Geometry" },
    { value: "trigonometry", label: "Trigonometry" },
    { value: "statistics", label: "Statistics" },
    { value: "arithmetic", label: "Arithmetic" },
    { value: "linear-algebra", label: "Linear Algebra" },
    { value: "differential-equations", label: "Differential Equations" },
  ];

  const handleSolve = async () => {
    if (!problem.trim()) {
      toast({
        title: "Error",
        description: "Please enter a math problem to solve",
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
    
    const systemInstruction = `You are an expert mathematics tutor. Solve mathematical problems step by step, showing clear working and explanations. Use proper mathematical notation and formatting.`;
    
    let prompt = `Solve this ${mathType} problem with ${showSteps} steps:

${problem}

Please provide:
1. Problem understanding and what we're looking for
2. Step-by-step solution with clear explanations
3. Final answer clearly highlighted
4. Method/formula explanation where applicable
5. Alternative approaches if relevant

Format your response clearly with proper mathematical notation and make it educational. Do not use asterisks (*) for formatting.`;

    const request: GeminiRequest = {
      prompt,
      systemInstruction,
      apiKey,
    };

    try {
      const response = await generateContent(request);
      
      if (response.success) {
        const cleanedContent = response.content.replace(/\*/g, '');
        setSolution(cleanedContent);
        toast({
          title: "Success!",
          description: "Math problem solved successfully",
        });
      } else {
        throw new Error(response.error || "Failed to solve problem");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: "Failed to solve math problem. Please try again.",
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
    element.download = "math-solution.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout
      title="Math Solver"
      description="Solve complex mathematical problems with step-by-step explanations"
      icon={<GraduationCap className="w-8 h-8 text-white" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        {/* Input Section */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-orange-600" />
              <span>Math Problem</span>
            </CardTitle>
            <CardDescription>
              Enter your mathematical problem and configure solution settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="problem">Math Problem</Label>
              <Textarea
                id="problem"
                placeholder="Enter your math problem here. E.g., 'Solve for x: 2x² + 5x - 3 = 0' or 'Find the derivative of f(x) = x³ - 2x² + 5x - 1'"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                rows={6}
                className="resize-none font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mathType">Math Category</Label>
                <Select value={mathType} onValueChange={setMathType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mathTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="steps">Solution Detail</Label>
                <Select value={showSteps} onValueChange={setShowSteps}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select detail level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic Steps</SelectItem>
                    <SelectItem value="detailed">Detailed Steps</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleSolve} 
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Solving Problem...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Solve Problem
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Solution</CardTitle>
            <CardDescription>
              Step-by-step solution to your math problem
            </CardDescription>
          </CardHeader>
          <CardContent>
            {solution ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6 min-h-[400px] max-h-[600px] overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm font-sans text-gray-800 leading-relaxed">
                      {solution}
                    </pre>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Solution Complete
                  </Badge>
                  <Badge variant="outline">
                    {mathType}
                  </Badge>
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
                <Calculator className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No solution generated yet
                </h3>
                <p className="text-gray-500 max-w-sm px-4">
                  Enter your math problem and click "Solve Problem" to get a step-by-step solution
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>🧮 Math Solver Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Clear Formulation</h4>
              <p className="text-sm text-gray-600">Make sure your problem statement is clearly written with all relevant information</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Correct Category</h4>
              <p className="text-sm text-gray-600">Choose the right mathematical category for more accurate solutions</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Detail Level</h4>
              <p className="text-sm text-gray-600">Select comprehensive steps if you're learning, basic if you just need the answer</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Problems Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Example Problems</CardTitle>
          <CardDescription>
            Try these examples to see how the Math Solver works
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="justify-start h-auto py-3 text-left"
              onClick={() => setProblem("Solve for x: 3x² - 12x + 9 = 0")}
            >
              <div>
                <p className="font-medium">Quadratic Equation</p>
                <p className="text-sm text-gray-600">Solve for x: 3x² - 12x + 9 = 0</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start h-auto py-3 text-left"
              onClick={() => setProblem("Find the derivative of f(x) = 2x³ - 5x² + 7x - 4")}
            >
              <div>
                <p className="font-medium">Calculus</p>
                <p className="text-sm text-gray-600">Find the derivative of f(x) = 2x³ - 5x² + 7x - 4</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start h-auto py-3 text-left"
              onClick={() => setProblem("Solve the system of equations: 2x + y = 8, 5x - 3y = 1")}
            >
              <div>
                <p className="font-medium">System of Equations</p>
                <p className="text-sm text-gray-600">Solve the system: 2x + y = 8, 5x - 3y = 1</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start h-auto py-3 text-left"
              onClick={() => setProblem("Find the area of a circle with radius 5 cm")}
            >
              <div>
                <p className="font-medium">Geometry</p>
                <p className="text-sm text-gray-600">Find the area of a circle with radius 5 cm</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
};

export default MathSolver;
