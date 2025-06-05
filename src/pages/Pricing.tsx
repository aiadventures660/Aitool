
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star, Users } from "lucide-react";

const pricingPlans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for trying out our AI tools",
    features: [
      "5 AI generations per day",
      "Access to basic tools",
      "Standard support",
      "Export in basic formats",
      "Personal use only"
    ],
    limitations: [
      "Limited daily usage",
      "Basic tool access",
      "No priority support"
    ],
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const,
    popular: false,
    icon: <Zap className="w-6 h-6" />
  },
  {
    name: "Pro",
    price: "₹149",
    period: "per month",
    description: "For professionals and content creators",
    features: [
      "Unlimited AI generations",
      "Access to all tools",
      "Priority support",
      "Export in all formats (PDF, audio, etc.)",
      "Commercial use allowed",
      "Advanced customization options",
      "Save unlimited projects",
      "Early access to new tools"
    ],
    limitations: [],
    buttonText: "Upgrade to Pro",
    buttonVariant: "default" as const,
    popular: true,
    icon: <Crown className="w-6 h-6" />
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Custom API integration",
      "White-labeled tools",
      "Team collaboration features",
      "Advanced analytics dashboard",
      "Dedicated account manager",
      "Custom training & onboarding",
      "SLA guarantee"
    ],
    limitations: [],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    popular: false,
    icon: <Users className="w-6 h-6" />
  }
];

const features = [
  {
    category: "Writing Tools",
    items: ["Blog Writer", "Resume Generator", "Grammar Fixer", "Social Media Posts"]
  },
  {
    category: "Coding Tools", 
    items: ["Code Explainer", "Regex Generator", "Error Fixer", "Documentation Generator"]
  },
  {
    category: "Vision & Image",
    items: ["Image Generator", "OCR Reader", "Object Describer", "Image Analysis"]
  },
  {
    category: "Education",
    items: ["Math Solver", "Homework Assistant", "Notes to Mind Map", "Study Guide Creator"]
  },
  {
    category: "Business",
    items: ["Invoice Creator", "Idea Validator", "Market Analysis", "Business Plan Writer"]
  },
  {
    category: "Voice & Audio",
    items: ["Text to Speech", "Story Narrator", "Audio Transcription", "Voice Analysis"]
  }
];

const Pricing = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header */}
      {/* <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 py-2">
          <Crown className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Choose Your Plan</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
          Simple, Transparent Pricing
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start for free and upgrade as you grow. No hidden fees, no surprises.
        </p>
      </div>

      {/* Pricing Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan, index) => (
          <Card 
            key={index} 
            className={`relative ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl scale-105' : 'hover:shadow-lg'} transition-all duration-300`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mx-auto mb-4">
                {plan.icon}
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-gray-600">
                {plan.description}
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                {plan.period !== "contact us" && (
                  <span className="text-gray-600 ml-1">/{plan.period}</span>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : ''}`}
                variant={plan.buttonVariant}
                size="lg"
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>  */}

      {/* Features Comparison */}
      <Card >
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Complete Feature Overview</CardTitle>
          <CardDescription>
            See all the tools and features available in AIWorx
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((category, index) => (
              <div key={index} className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-lg border-b pb-2">
                  {category.category}
                </h4>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h4>
                <p className="text-sm text-gray-600">Yes! Our free plan gives you access to basic features with daily limits so you can try before you buy.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade anytime?</h4>
                <p className="text-sm text-gray-600">Absolutely! You can change your plan anytime. Upgrades take effect immediately, and downgrades apply at the next billing cycle.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
                <p className="text-sm text-gray-600">We accept all major credit cards, debit cards, and UPI payments for Indian customers.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Is my data secure?</h4>
                <p className="text-sm text-gray-600">Yes! We use industry-standard encryption and never store your API keys on our servers. Your data remains private and secure.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h4>
                <p className="text-sm text-gray-600">We offer a 30-day money-back guarantee if you're not satisfied with our Pro plan.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Need help choosing?</h4>
                <p className="text-sm text-gray-600">Contact our support team for personalized recommendations based on your specific needs.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardContent className="text-center py-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to supercharge your productivity?
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Join thousands of creators, developers, and businesses already using AIWorx to streamline their workflows.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg">
              Schedule Demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pricing;
