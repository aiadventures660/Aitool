
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Volume2, Play, Pause, Download, Loader2, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/layout/ToolLayout";
import { generateSpeech } from "@/services/textToSpeechService";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en");
  const [speed, setSpeed] = useState("normal");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to convert to speech",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await generateSpeech({
        text: text,
        lang: language,
        speed: speed
      });
      
      if (response.success && response.audioUrl) {
        setAudioUrl(response.audioUrl);
        toast({
          title: "Success!",
          description: "Audio generated successfully",
        });
      } else {
        throw new Error(response.error || "Failed to generate audio");
      }
    } catch (error) {
      console.error("Audio generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate audio. Please try again.",
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
    element.download = "generated-speech.wav";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <ToolLayout
      title="Text to Speech"
      description="Convert your text into natural-sounding speech with AI"
      icon={<Volume2 className="w-8 h-8 text-white" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Text Input</CardTitle>
            <CardDescription>
              Enter the text you want to convert to speech
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              className="resize-none"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Speed</label>
                <Select value={speed} onValueChange={setSpeed}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select speed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Audio...
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Generate Speech
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Generated Audio</CardTitle>
            <CardDescription>
              Your text converted to speech
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
                
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 text-center">
                  <Volume2 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-4">Audio ready to play</p>
                  
                  <div className="flex justify-center space-x-2 mb-4">
                    <Button onClick={togglePlayback} variant="outline">
                      {isPlaying ? (
                        <Pause className="w-4 h-4 mr-2" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      {isPlaying ? "Pause" : "Play"}
                    </Button>
                    <Button onClick={stopPlayback} variant="outline">
                      <Square className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Audio Generated
                  </Badge>
                  <Badge variant="outline">{language}</Badge>
                  <Badge variant="outline">{speed}</Badge>
                </div>

                <Button onClick={downloadAudio} variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Audio
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Volume2 className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No audio generated yet
                </h3>
                <p className="text-gray-500">
                  Enter text and click "Generate Speech" to create audio
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default TextToSpeech;
