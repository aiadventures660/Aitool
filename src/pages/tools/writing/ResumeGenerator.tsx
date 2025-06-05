
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Copy, Download, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/layout/ToolLayout";
import { generateContent, GeminiRequest } from "@/services/geminiService";
import { useApiKey } from "@/hooks/useApiKey";

const ResumeGenerator = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [resumeType, setResumeType] = useState("professional");
  const [generatedResume, setGeneratedResume] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useApiKey();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!jobTitle.trim() || !experience.trim()) {
      toast({
        title: "Error",
        description: "Please fill in job title and experience",
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
      prompt: `Create a professional resume for the position: ${jobTitle}. Experience: ${experience}. Skills: ${skills}. Format it as a complete resume with sections for contact, summary, experience, skills, and education.`,
      contentType: `${resumeType} resume`,
      platform: "Resume",
      apiKey,
    };

    try {
      const response = await generateContent(request);
      
      if (response.success) {
        setGeneratedResume(response.content);
        toast({
          title: "Success!",
          description: "Your resume has been generated successfully",
        });
      } else {
        throw new Error(response.error || "Failed to generate content");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedResume);
    toast({
      title: "Copied!",
      description: "Resume copied to clipboard",
    });
  };

  const downloadContent = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedResume], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "resume.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout
      title="Resume Generator"
      description="Create professional resumes tailored to your target job position"
      icon={<FileText className="w-8 h-8 text-white" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Resume Details</CardTitle>
            <CardDescription>
              Enter your information to generate a professional resume
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Target Job Title</Label>
              <Input
                id="jobTitle"
                placeholder="e.g., Software Engineer, Marketing Manager"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Work Experience</Label>
              <Textarea
                id="experience"
                placeholder="Describe your work experience, achievements, and responsibilities..."
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Textarea
                id="skills"
                placeholder="List your technical and soft skills..."
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resumeType">Resume Style</Label>
              <Select value={resumeType} onValueChange={setResumeType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerate} 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Resume...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Resume
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Generated Resume</CardTitle>
            <CardDescription>
              Your professional resume is ready
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedResume ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-sans text-gray-800">
                    {generatedResume}
                  </pre>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Ready to Use</Badge>
                  <Badge variant="outline">{resumeType}</Badge>
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
                <FileText className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No resume generated yet
                </h3>
                <p className="text-gray-500">
                  Fill out the form to create your professional resume
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default ResumeGenerator;
