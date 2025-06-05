
export interface GeminiRequest {
  prompt: string;
  contentType?: string;
  platform?: string;
  tone?: string;
  targetAudience?: string;
  apiKey: string;
  systemInstruction?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface GeminiResponse {
  success: boolean;
  content: string;
  error?: string;
}

export interface GeminiImageRequest {
  prompt: string;
  apiKey: string;
}

export interface GeminiImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export interface GeminiVisionRequest {
  prompt: string;
  imageFile: File;
  apiKey: string;
}

export interface GeminiAudioRequest {
  text: string;
  voiceName?: string;
  apiKey: string;
}

export interface GeminiAudioResponse {
  success: boolean;
  audioUrl?: string;
  error?: string;
}

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export const generateContent = async (request: GeminiRequest): Promise<GeminiResponse> => {
  try {
    const response = await fetch(`${GEMINI_API_BASE}/models/gemini-1.5-flash-latest:generateContent?key=${request.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: request.prompt
          }]
        }],
        generationConfig: {
          temperature: request.temperature || 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: request.maxTokens || 8192,
        },
        systemInstruction: request.systemInstruction ? {
          parts: [{ text: request.systemInstruction }]
        } : undefined
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate content');
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('No content generated');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    return {
      success: true,
      content: generatedText
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      success: false,
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const generateImage = async (request: GeminiImageRequest): Promise<GeminiImageResponse> => {
  try {
    const response = await fetch(`${GEMINI_API_BASE}/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${request.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: request.prompt
          }]
        }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate image');
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('No image generated');
    }

    // Find the image part in the response
    const parts = data.candidates[0].content.parts;
    const imagePart = parts.find((part: any) => part.inlineData);
    
    if (imagePart && imagePart.inlineData) {
      const imageData = imagePart.inlineData.data;
      const imageUrl = `data:image/png;base64,${imageData}`;
      
      return {
        success: true,
        imageUrl
      };
    }

    throw new Error('No image data found in response');
  } catch (error) {
    console.error('Gemini Image API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const analyzeImageWithVision = async (request: GeminiVisionRequest): Promise<GeminiResponse> => {
  try {
    // Convert file to base64
    const base64Data = await fileToBase64(request.imageFile);
    const base64WithoutPrefix = base64Data.split(',')[1];

    const response = await fetch(`${GEMINI_API_BASE}/models/gemini-1.5-flash-latest:generateContent?key=${request.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: request.prompt
            },
            {
              inlineData: {
                mimeType: request.imageFile.type,
                data: base64WithoutPrefix
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to analyze image');
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('No analysis generated');
    }

    const analysisText = data.candidates[0].content.parts[0].text;
    
    return {
      success: true,
      content: analysisText
    };
  } catch (error) {
    console.error('Gemini Vision API Error:', error);
    return {
      success: false,
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const generateAudio = async (request: GeminiAudioRequest): Promise<GeminiAudioResponse> => {
  try {
    const response = await fetch(`${GEMINI_API_BASE}/models/gemini-2.5-flash-preview-tts:generateContent?key=${request.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: request.text
          }]
        }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { 
                voiceName: request.voiceName || 'Aoede' 
              }
            }
          }
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate audio');
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('No audio generated');
    }

    // Find the audio part in the response
    const parts = data.candidates[0].content.parts;
    const audioPart = parts.find((part: any) => part.inlineData);
    
    if (audioPart && audioPart.inlineData) {
      const audioData = audioPart.inlineData.data;
      const audioBuffer = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
      const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      return {
        success: true,
        audioUrl
      };
    }

    throw new Error('No audio data found in response');
  } catch (error) {
    console.error('Gemini Audio API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Utility function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
