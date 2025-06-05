
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Target, Users, Zap } from "lucide-react";

const About = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900">About AIWorx</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your complete AI toolbox for writing, coding, design, and more. We're on a mission to democratize AI and make powerful tools accessible to everyone.
        </p>
      </div>

      {/* Mission */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-6 h-6 text-blue-600" />
            <span>Our Mission</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 leading-relaxed">
            At AIWorx, we believe that artificial intelligence should enhance human creativity and productivity, not replace it. 
            Our platform brings together the most powerful AI tools in one convenient location, making it easy for creators, 
            developers, writers, and professionals to leverage cutting-edge technology in their daily work.
          </p>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span>Powerful AI Tools</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Access 20+ AI-powered tools for writing, coding, image generation, voice synthesis, and more.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-500" />
              <span>User-Friendly</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              No technical expertise required. Our intuitive interface makes AI accessible to everyone.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span>Always Improving</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We continuously add new tools and features based on user feedback and the latest AI developments.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tool Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Our Tool Categories</CardTitle>
          <CardDescription>
            Explore our comprehensive suite of AI-powered tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">Writing Tools</Badge>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Blog Writer</li>
                <li>• Resume Generator</li>
                <li>• Grammar Fixer</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">Coding Tools</Badge>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Code Explainer</li>
                <li>• Regex Generator</li>
                <li>• Error Fixer</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">Vision & Image</Badge>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Image Generator</li>
                <li>• OCR Reader</li>
                <li>• Object Describer</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">Voice & Audio</Badge>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Text to Speech</li>
                <li>• Story Narrator</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact CTA */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6">
            Join thousands of users who are already boosting their productivity with AIWorx.
          </p>
          <div className="space-x-4">
            <a 
              href="/tools/writing/blog-writer" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              Try Our Tools
            </a>
            <a 
              href="/contact" 
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
