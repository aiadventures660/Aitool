
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Key } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  currentApiKey?: string;
}

const ApiKeyInput = ({ onApiKeySet, currentApiKey }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState(currentApiKey || "");
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      onApiKeySet(apiKey.trim());
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          Gemini API Key
        </CardTitle>
        <CardDescription>
          Enter your Gemini API key to use AI-powered content generation. Your key is stored locally and never sent to our servers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="api-key" className="sr-only">
              API Key
            </Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                placeholder="Enter your Gemini API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <Button onClick={handleSave} disabled={!apiKey.trim()}>
            Save Key
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Get your free API key from{" "}
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline"
          >
            Google AI Studio
          </a>
        </p>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
