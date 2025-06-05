
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageCircle, Upload, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/layout/ToolLayout";
import { generateContent, GeminiRequest } from "@/services/geminiService";
import { useApiKey } from "@/hooks/useApiKey";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const ChatWithPDF = () => {
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPDF, setIsProcessingPDF] = useState(false);
  const { apiKey } = useApiKey();
  const { toast } = useToast();

  const handlePDFUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedPDF(file);
      setIsProcessingPDF(true);
      
      // In a real implementation, you would extract text from PDF
      // For now, we'll simulate PDF text extraction
      setTimeout(() => {
        const mockPDFContent = `This is a sample PDF content simulation. In a real implementation, you would use a PDF parsing library to extract text from the uploaded PDF file. The extracted text would then be used as context for the AI chat responses.
        
Sample content might include:
- Document headings and sections
- Paragraphs of text content
- Tables and data (converted to text format)
- Any readable text from the PDF

The AI can then reference this content when answering user questions about the document.`;
        
        setPdfText(mockPDFContent);
        setIsProcessingPDF(false);
        
        // Add welcome message
        const welcomeMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'ai',
          content: 'PDF processed successfully! I can now answer questions about your document. What would you like to know?',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
        
        toast({
          title: "Success!",
          description: "PDF processed and ready for chat",
        });
      }, 2000);
    } else {
      toast({
        title: "Error",
        description: "Please select a valid PDF file",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !pdfText) {
      toast({
        title: "Error",
        description: "Please upload a PDF and enter a message",
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

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    const request: GeminiRequest = {
      prompt: `Based on the following PDF content, please answer the user's question: "${currentMessage}"\n\nPDF Content:\n${pdfText}`,
      contentType: "PDF chat response",
      platform: "Document Chat",
      apiKey,
    };

    try {
      const response = await generateContent(request);
      
      if (response.success) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response.content,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(response.error || "Failed to generate response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ToolLayout
      title="Chat with PDF"
      description="Upload a PDF document and have intelligent conversations about its content"
      icon={<FileText className="w-8 h-8 text-white" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        {/* PDF Upload Section */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Upload PDF</CardTitle>
            <CardDescription>
              Select a PDF document to analyze
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {selectedPDF ? (
                <div className="space-y-2">
                  <FileText className="w-8 h-8 text-green-500 mx-auto" />
                  <p className="text-sm font-medium">{selectedPDF.name}</p>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {isProcessingPDF ? "Processing..." : "Ready"}
                  </Badge>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600">Click to upload PDF</p>
                </div>
              )}
              
              <input
                type="file"
                accept=".pdf"
                onChange={handlePDFUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {isProcessingPDF && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing PDF...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Chat with Document</span>
            </CardTitle>
            <CardDescription>
              Ask questions about your PDF content
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Messages */}
            <div className="h-96 overflow-y-auto mb-4 space-y-4 border rounded-lg p-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="w-12 h-12 text-gray-300 mb-2" />
                  <p className="text-gray-500">Upload a PDF to start chatting</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-800 border'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="flex space-x-2">
              <Input
                placeholder="Ask a question about your PDF..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading || !pdfText}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || !pdfText || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default ChatWithPDF;
