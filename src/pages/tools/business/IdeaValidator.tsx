
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Copy, Download, Sparkles, Loader2, TrendingUp, Users, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/layout/ToolLayout";
import { generateContent, GeminiRequest } from "@/services/geminiService";
import { useApiKey } from "@/hooks/useApiKey";

const IdeaValidator = () => {
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaDescription, setIdeaDescription] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [industry, setIndustry] = useState("");
  const [validation, setValidation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useApiKey();
  const { toast } = useToast();

  const industries = [
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "education", label: "Education" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "entertainment", label: "Entertainment" },
    { value: "food", label: "Food & Beverage" },
    { value: "travel", label: "Travel & Tourism" },
    { value: "real-estate", label: "Real Estate" },
    { value: "other", label: "Other" },
  ];

  const handleValidate = async () => {
    if (!ideaTitle.trim() || !ideaDescription.trim()) {
      toast({
        title: "Error",
        description: "Please provide both idea title and description",
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
      prompt: `Validate this business idea:

Title: ${ideaTitle}
Description: ${ideaDescription}
${industry ? `Industry: ${industry}` : ''}
${targetMarket ? `Target Market: ${targetMarket}` : ''}

Please provide a comprehensive analysis including:

1. MARKET OPPORTUNITY
   - Market size and potential
   - Current trends and demand
   - Growth potential

2. COMPETITIVE ANALYSIS
   - Existing competitors
   - Market gaps
   - Competitive advantages needed

3. FEASIBILITY ASSESSMENT
   - Technical requirements
   - Resource needs
   - Implementation challenges

4. RISKS AND CHALLENGES
   - Potential obstacles
   - Market risks
   - Mitigation strategies

5. RECOMMENDATIONS
   - Next steps for validation
   - Key metrics to track
   - Success indicators

Format the response clearly without using asterisks for emphasis.`,
      contentType: "business idea validation",
      platform: "Business",
      apiKey,
    };

    try {
      const response = await generateContent(request);
      
      if (response.success) {
        const cleanedContent = response.content.replace(/\*/g, '-');
        setValidation(cleanedContent);
        toast({
          title: "Success!",
          description: "Idea validation completed successfully",
        });
      } else {
        throw new Error(response.error || "Failed to generate content");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: "Failed to validate idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(validation);
    toast({
      title: "Copied!",
      description: "Validation report copied to clipboard",
    });
  };

  const downloadContent = () => {
    const element = document.createElement("a");
    const file = new Blob([validation], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `idea-validation-${ideaTitle.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout
      title="Idea Validator"
      description="Get comprehensive analysis and validation for your business ideas"
      icon={<Lightbulb className="w-8 h-8 text-white" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Business Idea Details</CardTitle>
            <CardDescription>
              Provide details about your business idea for validation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ideaTitle">Idea Title</Label>
              <Input
                id="ideaTitle"
                placeholder="Enter your business idea title"
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ideaDescription">Idea Description</Label>
              <Textarea
                id="ideaDescription"
                placeholder="Describe your business idea in detail. What problem does it solve? How does it work?"
                value={ideaDescription}
                onChange={(e) => setIdeaDescription(e.target.value)}
                rows={5}
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind.value} value={ind.value}>
                        {ind.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetMarket">Target Market (Optional)</Label>
                <Input
                  id="targetMarket"
                  placeholder="e.g., small businesses, millennials, healthcare professionals"
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>

            <Button 
              onClick={handleValidate} 
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Validating Idea...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Validate Idea
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Validation Report</CardTitle>
            <CardDescription>
              Comprehensive analysis of your business idea
            </CardDescription>
          </CardHeader>
          <CardContent>
            {validation ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-sans text-gray-800">
                    {validation}
                  </pre>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                    Validation Complete
                  </Badge>
                  {industry && <Badge variant="outline">{industry}</Badge>}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Report
                  </Button>
                  <Button onClick={downloadContent} variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Lightbulb className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No validation yet
                </h3>
                <p className="text-gray-500 px-4">
                  Enter your business idea details to get a validation report
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Validation Framework */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>💡 What We Analyze</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-2">Market Opportunity</h4>
              <p className="text-sm text-gray-600">Size, trends, and growth potential of your target market</p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-2">Competition</h4>
              <p className="text-sm text-gray-600">Analysis of existing players and market gaps</p>
            </div>
            <div className="text-center">
              <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-2">Feasibility</h4>
              <p className="text-sm text-gray-600">Resource requirements and implementation challenges</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
};

export default IdeaValidator;
