
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, Pause, Download, Loader2, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/layout/ToolLayout";
import { generateSpeech } from "@/services/textToSpeechService";
import { generateContent, GeminiRequest } from "@/services/geminiService";
import { useApiKey } from "@/hooks/useApiKey";

const StoryNarrator = () => {
  const [story, setStory] = useState("");
  const [voice, setVoice] = useState("en");
  const [narrativeStyle, setNarrativeStyle] = useState("dramatic");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [processedStory, setProcessedStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { apiKey } = useApiKey();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!story.trim()) {
      toast({
        title: "Error",
        description: "Please enter a story to narrate",
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
    
    try {
      // First, enhance the story with narrative style using Gemini
      const narrativePrompt = `Transform this story into a ${narrativeStyle} narrative style for audio narration. Add appropriate pacing, emotional cues, and storytelling elements that would work well when spoken aloud. Make it engaging for listeners while maintaining the core story:

"${story}"

Guidelines for ${narrativeStyle} style:
${narrativeStyle === 'dramatic' ? '- Add tension and emotional depth\n- Use varied pacing\n- Include dramatic pauses and emphasis' : 
  narrativeStyle === 'calm' ? '- Use soothing, gentle language\n- Create a peaceful, relaxing tone\n- Include meditative pacing' :
  narrativeStyle === 'exciting' ? '- Build energy and enthusiasm\n- Use dynamic language\n- Create momentum and adventure' :
  narrativeStyle === 'mysterious' ? '- Add intrigue and suspense\n- Use atmospheric descriptions\n- Build curiosity and wonder' :
  '- Use upbeat, positive language\n- Include joyful expressions\n- Create a happy, uplifting mood'}

Format for audio narration with natural speech patterns.`;

      const request: GeminiRequest = {
        prompt: narrativePrompt,
        contentType: "story narration enhancement",
        platform: "Story Narrator",
        apiKey,
      };

      const narrativeResponse = await generateContent(request);
      
      if (!narrativeResponse.success) {
        throw new Error(narrativeResponse.error || "Failed to enhance story");
      }

      const enhancedStory = narrativeResponse.content
        .replace(/\*\*/g, '') // Remove bold asterisks
        .replace(/\*/g, '') // Remove single asterisks
        .trim();

      setProcessedStory(enhancedStory);

      // Then convert the enhanced story to speech
      const response = await generateSpeech({
        text: enhancedStory,
        lang: voice,
        speed: "normal"
      });
      
      if (response.success && response.audioUrl) {
        setAudioUrl(response.audioUrl);
        toast({
          title: "Success!",
          description: "Story narration generated successfully",
        });
      } else {
        throw new Error(response.error || "Failed to generate narration");
      }
    } catch (error) {
      console.error("Narration generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate narration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopPlayback = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    const element = document.createElement("a");
    element.href = audioUrl;
    element.download = "story-narration.wav";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <ToolLayout
      title="Story Narrator"
      description="Transform your stories into captivating audio narrations"
      icon={<BookOpen className="w-8 h-8 text-white" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Story Input</CardTitle>
            <CardDescription>
              Enter your story and customize the narration style
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Once upon a time..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={10}
              className="resize-none text-sm"
            />

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Select value={voice} onValueChange={setVoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Narrative Style</label>
                <Select value={narrativeStyle} onValueChange={setNarrativeStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dramatic">Dramatic</SelectItem>
                    <SelectItem value="calm">Calm & Soothing</SelectItem>
                    <SelectItem value="exciting">Exciting</SelectItem>
                    <SelectItem value="mysterious">Mysterious</SelectItem>
                    <SelectItem value="cheerful">Cheerful</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              className="w-full bg-gradient-to-r from-orange-500 to-red-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Narration...
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Generate Narration
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Story Narration</CardTitle>
            <CardDescription>
              Your story brought to life with AI narration
            </CardDescription>
          </CardHeader>
          <CardContent>
            {audioUrl ? (
              <div className="space-y-4">
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={handleAudioEnded}
                  className="hidden"
                />
                
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 text-center">
                  <BookOpen className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-4">Story narration ready</p>
                  
                  <div className="flex justify-center gap-2">
                    <Button onClick={togglePlayback} variant="outline" size="sm">
                      {isPlaying ? (
                        <Pause className="w-4 h-4 mr-2" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      {isPlaying ? "Pause" : "Play"}
                    </Button>
                    <Button onClick={stopPlayback} variant="outline" size="sm">
                      <Square className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                  </div>
                </div>

                {processedStory && (
                  <div className="bg-white border rounded-lg p-4 max-h-48 overflow-y-auto">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Enhanced Story Preview:</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{processedStory}</p>
                  </div>
                )}
                
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    Narration Ready
                  </Badge>
                  <Badge variant="outline">{voice}</Badge>
                  <Badge variant="outline">{narrativeStyle}</Badge>
                </div>

                <Button onClick={downloadAudio} variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Narration
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No narration generated yet
                </h3>
                <p className="text-gray-500 px-4">
                  Enter your story and click "Generate Narration" to create audio
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default StoryNarrator;
