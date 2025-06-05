import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Sparkles, Loader2, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/layout/ToolLayout";
import { generateImage, GeminiImageRequest } from "@/services/geminiService";
import { useApiKey } from "@/hooks/useApiKey";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [generatedImage, setGeneratedImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useApiKey();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter an image description",
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
    
    let enhancedPrompt = prompt;
    
    // Add style modifiers
    switch (style) {
      case "realistic":
        enhancedPrompt += ", photorealistic, high quality, detailed";
        break;
      case "artistic":
        enhancedPrompt += ", artistic style, creative, expressive";
        break;
      case "cartoon":
        enhancedPrompt += ", cartoon style, animated, colorful";
        break;
      case "digital-art":
        enhancedPrompt += ", digital art, concept art, futuristic";
        break;
      case "vintage":
        enhancedPrompt += ", vintage style, retro, classic";
        break;
      case "minimalist":
        enhancedPrompt += ", minimalist, clean, simple, modern";
        break;
    }

    const request: GeminiImageRequest = {
      prompt: enhancedPrompt,
      apiKey,
    };

    try {
      const response = await generateImage(request);
      
      if (response.success && response.imageUrl) {
        setGeneratedImage(response.imageUrl);
        toast({
          title: "Success!",
          description: "Your image has been generated successfully",
        });
      } else {
        throw new Error(response.error || "Failed to generate image");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'generated-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <ToolLayout
      title="Image Generator"
      description="Create stunning images from text descriptions using AI"
      icon={<Eye className="w-8 h-8 text-white" />}
      badge="New"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        {/* Input Section */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-purple-600" />
              <span>Image Settings</span>
            </CardTitle>
            <CardDescription>
              Describe your image and choose a style
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt">Image Description</Label>
              <Textarea
                id="prompt"
                placeholder="Describe the image you want to create. E.g., 'A serene mountain landscape at sunset with a small cabin by a lake'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="resize-none text-sm"
              />
              <p className="text-xs text-gray-500">
                Be as detailed as possible for better results
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">Art Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="artistic">Artistic</SelectItem>
                  <SelectItem value="cartoon">Cartoon</SelectItem>
                  <SelectItem value="digital-art">Digital Art</SelectItem>
                  <SelectItem value="vintage">Vintage</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerate} 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Image...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Generated Image</CardTitle>
            <CardDescription>
              Your AI-generated image will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedImage ? (
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                  <img 
                    src={generatedImage} 
                    alt="Generated image" 
                    className="w-full h-auto max-h-96 object-contain bg-gray-50"
                  />
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Ready to Download
                  </Badge>
                  <Badge variant="outline">
                    {style} style
                  </Badge>
                </div>

                <Button onClick={downloadImage} className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-200 rounded-lg">
                <Eye className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No image generated yet
                </h3>
                <p className="text-gray-500 max-w-sm px-4">
                  Describe your image and click "Generate Image" to create stunning visuals
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>🎨 Image Generation Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Be Specific</h4>
              <p className="text-sm text-gray-600">Include details about colors, lighting, composition, and mood for better results</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Style Matters</h4>
              <p className="text-sm text-gray-600">Choose the right art style that matches your intended use case</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Iterate & Refine</h4>
              <p className="text-sm text-gray-600">Try different prompts and styles to get the perfect image</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
};

export default ImageGenerator;
