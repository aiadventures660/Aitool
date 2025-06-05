
interface TextToSpeechRequest {
  text: string;
  lang?: string;
  speed?: string;
}

interface TextToSpeechResponse {
  success: boolean;
  audioUrl?: string;
  error?: string;
}

export const generateSpeech = async (request: TextToSpeechRequest): Promise<TextToSpeechResponse> => {
  try {
    const response = await fetch('https://text-to-speach-api.p.rapidapi.com/text-to-speech', {
      method: 'POST',
      headers: {
        'x-rapidapi-key': '65405c5d99msh6f55f91b1f7af28p1acf63jsnbb104484281b',
        'x-rapidapi-host': 'text-to-speach-api.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: request.text,
        lang: request.lang || 'en',
        speed: request.speed || 'normal'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate speech');
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    return {
      success: true,
      audioUrl
    };
  } catch (error) {
    console.error('Text to Speech API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
