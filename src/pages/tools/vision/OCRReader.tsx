
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Eye, Copy, Download, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/layout/ToolLayout";
import { analyzeImageWithVision, GeminiVisionRequest } from "@/services/geminiService";
import { useApiKey } from "@/hooks/useApiKey";

const OCRReader = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [extractedText, setExtractedText] = useState("");
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

  const extractText = async () => {
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
      prompt: "Extract all text from this image. Provide the text exactly as it appears, maintaining formatting and structure where possible.",
      imageFile: selectedImage,
      apiKey,
    };

    try {
      const response = await analyzeImageWithVision(request);
      
      if (response.success) {
        setExtractedText(response.content);
        toast({
          title: "Success!",
          description: "Text extracted successfully",
        });
      } else {
        throw new Error(response.error || "Failed to extract text");
      }
    } catch (error) {
      console.error("OCR error:", error);
      toast({
        title: "Error",
        description: "Failed to extract text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
    toast({
      title: "Copied!",
      description: "Extracted text copied to clipboard",
    });
  };

  const downloadContent = () => {
    const element = document.createElement("a");
    const file = new Blob([extractedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "extracted-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout
      title="OCR Reader"
      description="Extract text from images using advanced optical character recognition"
      icon={<Eye className="w-8 h-8 text-white" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>
              Select an image to extract text from
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
              onClick={extractText} 
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500"
              disabled={isLoading || !selectedImage}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extracting Text...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Extract Text
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Extracted Text</CardTitle>
            <CardDescription>
              Text content from your image
            </CardDescription>
          </CardHeader>
          <CardContent>
            {extractedText ? (
              <div className="space-y-4">
                <Textarea 
                  value={extractedText}
                  readOnly
                  rows={10}
                  className="resize-none bg-gray-50"
                />
                
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Text Extracted
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
                <Eye className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No text extracted yet
                </h3>
                <p className="text-gray-500">
                  Upload an image to extract text from it
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default OCRReader;
