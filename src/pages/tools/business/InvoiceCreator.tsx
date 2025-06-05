
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Sparkles, Loader2, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/layout/ToolLayout";
import { generateContent, GeminiRequest } from "@/services/geminiService";
import { useApiKey } from "@/hooks/useApiKey";

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

const InvoiceCreator = () => {
  const [businessName, setBusinessName] = useState("");
  const [clientName, setClientName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, rate: 0, amount: 0 }
  ]);
  const [invoice, setInvoice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useApiKey();
  const { toast } = useToast();

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'rate') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate;
    }
    
    setItems(updatedItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  const handleGenerate = async () => {
    if (!businessName.trim() || !clientName.trim()) {
      toast({
        title: "Error",
        description: "Please enter business name and client name",
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

    if (items.some(item => !item.description.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all item descriptions",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const itemsList = items.map(item => 
      `${item.description} - Qty: ${item.quantity} x $${item.rate} = $${item.amount}`
    ).join('\n');

    const request: GeminiRequest = {
      prompt: `Create a professional invoice with the following details:

Business: ${businessName}
Client: ${clientName}
Invoice Number: ${invoiceNumber || 'INV-001'}
Date: ${new Date().toLocaleDateString()}

Items:
${itemsList}

Total Amount: $${totalAmount.toFixed(2)}

Format this as a clean, professional invoice with proper structure including:
- Header with business and client information
- Invoice details (number, date, due date)
- Itemized list in table format
- Subtotal, any taxes if applicable, and total
- Payment terms
- Professional footer

Use clean formatting without stars or special characters.`,
      contentType: "professional invoice",
      platform: "Business",
      apiKey,
    };

    try {
      const response = await generateContent(request);
      
      if (response.success) {
        const cleanedContent = response.content.replace(/\*/g, '');
        setInvoice(cleanedContent);
        toast({
          title: "Success!",
          description: "Invoice generated successfully",
        });
      } else {
        throw new Error(response.error || "Failed to generate content");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInvoice = () => {
    const element = document.createElement("a");
    const file = new Blob([invoice], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `invoice-${invoiceNumber || 'INV-001'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout
      title="Invoice Creator"
      description="Generate professional invoices quickly with AI assistance"
      icon={<FileText className="w-8 h-8 text-white" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
            <CardDescription>
              Enter your business and invoice information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="Your Business Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  placeholder="Client or Company Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number (Optional)</Label>
                <Input
                  id="invoiceNumber"
                  placeholder="INV-001"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Invoice Items</Label>
                <Button onClick={addItem} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {items.map((item, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Item {index + 1}</span>
                    {items.length > 1 && (
                      <Button
                        onClick={() => removeItem(index)}
                        size="sm"
                        variant="outline"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="text-sm"
                  />
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity || ''}
                      onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Rate"
                      value={item.rate || ''}
                      onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                      className="text-sm"
                    />
                    <Input
                      placeholder="Amount"
                      value={`$${item.amount.toFixed(2)}`}
                      readOnly
                      className="text-sm bg-gray-100"
                    />
                  </div>
                </div>
              ))}

              <div className="text-right">
                <p className="text-lg font-semibold">
                  Total: ${totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              className="w-full bg-gradient-to-r from-blue-500 to-green-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Invoice...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Invoice
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Generated Invoice</CardTitle>
            <CardDescription>
              Your professional invoice
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invoice ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-6 border min-h-[400px] max-h-[600px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-sans text-gray-800">
                    {invoice}
                  </pre>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Invoice Ready
                  </Badge>
                  <Badge variant="outline">${totalAmount.toFixed(2)}</Badge>
                </div>

                <Button onClick={downloadInvoice} className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No invoice generated yet
                </h3>
                <p className="text-gray-500 px-4">
                  Fill in the details and click "Generate Invoice"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default InvoiceCreator;
