
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Camera, Copy, Download, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/layout/ToolLayout";
import { analyzeImageWithVision, GeminiVisionRequest } from "@/services/geminiService";
import { useApiKey } from "@/hooks/useApiKey";

const ObjectDescriber = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useApiKey();
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please select an image first",
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
    
    const request: GeminiVisionRequest = {
      prompt: "Analyze this image and provide a detailed description of all objects, people, scenes, activities, colors, textures, and spatial relationships you can observe. Be specific and comprehensive in your analysis.",
      imageFile: selectedImage,
      apiKey,
    };

    try {
      const response = await analyzeImageWithVision(request);
      
      if (response.success) {
        setDescription(response.content);
        toast({
          title: "Success!",
          description: "Image analyzed successfully",
        });
      } else {
        throw new Error(response.error || "Failed to analyze image");
      }
    } catch (error) {
      console.error("Image analysis error:", error);
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(description);
    toast({
      title: "Copied!",
      description: "Description copied to clipboard",
    });
  };

  const downloadContent = () => {
    const element = document.createElement("a");
    const file = new Blob([description], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "image-description.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout
      title="Object Describer"
      description="Get detailed descriptions of objects and scenes in your images"
      icon={<Camera className="w-8 h-8 text-white" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>
              Select an image to analyze and describe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center relative">
              {imagePreview ? (
                <div className="space-y-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-w-full h-48 object-contain mx-auto rounded-lg"
                  />
                  <p className="text-sm text-gray-600">{selectedImage?.name}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <p className="text-gray-600">Click to upload an image</p>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            <Button 
              onClick={analyzeImage} 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
              disabled={isLoading || !selectedImage}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Image...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Describe Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Image Description</CardTitle>
            <CardDescription>
              AI-generated description of your image
            </CardDescription>
          </CardHeader>
          <CardContent>
            {description ? (
              <div className="space-y-4">
                <Textarea 
                  value={description}
                  readOnly
                  rows={10}
                  className="resize-none bg-gray-50"
                />
                
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    Analysis Complete
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
                <Camera className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No description yet
                </h3>
                <p className="text-gray-500">
                  Upload an image to get AI-powered description
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default ObjectDescriber;
