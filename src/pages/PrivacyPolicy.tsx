
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="text-gray-600">Last updated: January 2024</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Information We Collect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            We collect information you provide directly to us, such as when you create an account, 
            use our AI tools, or contact us for support.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Account information (name, email address)</li>
            <li>Content you create using our AI tools</li>
            <li>Usage data and analytics</li>
            <li>Device and browser information</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. How We Use Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            We use the information we collect to provide, maintain, and improve our services:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>To provide and operate our AI tools</li>
            <li>To process your requests and transactions</li>
            <li>To send you technical notices and support messages</li>
            <li>To improve our services and develop new features</li>
            <li>To comply with legal obligations</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Information Sharing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            We do not sell, trade, or otherwise transfer your personal information to third parties, except:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>With your consent</li>
            <li>To comply with legal requirements</li>
            <li>To protect our rights and safety</li>
            <li>With service providers who assist in our operations</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Data Security</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            We implement appropriate security measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction. However, no method of 
            transmission over the Internet is 100% secure.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Your Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">You have the right to:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete your account and data</li>
            <li>Object to processing of your information</li>
            <li>Data portability</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="mt-4 space-y-1 text-gray-600">
            <p>Email: privacy@aiworx.com</p>
            <p>Address: 123 AI Street, Tech City, TC 12345</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
