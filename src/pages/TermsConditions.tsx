
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsConditions = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900">Terms & Conditions</h1>
        <p className="text-gray-600">Last updated: January 2024</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Acceptance of Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            By accessing and using AIWorx, you accept and agree to be bound by the terms 
            and provision of this agreement. If you do not agree to abide by the above, 
            please do not use this service.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Use License</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Permission is granted to temporarily use AIWorx for personal, non-commercial 
            transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            The materials on AIWorx are provided on an 'as is' basis. AIWorx makes no warranties, 
            expressed or implied, and hereby disclaims and negates all other warranties including 
            without limitation, implied warranties or conditions of merchantability, fitness for 
            a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Limitations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            In no event shall AIWorx or its suppliers be liable for any damages (including, 
            without limitation, damages for loss of data or profit, or due to business interruption) 
            arising out of the use or inability to use the materials on AIWorx, even if AIWorx 
            or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. User Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            You retain ownership of any content you create using our AI tools. However, you grant us:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>A license to process your content to provide our services</li>
            <li>The right to use anonymized data for service improvement</li>
            <li>The right to remove content that violates our policies</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Prohibited Uses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">You may not use our service:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>For any unlawful purpose or to solicit others to unlawful acts</li>
            <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            <li>To submit false or misleading information</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. Governing Law</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            These terms and conditions are governed by and construed in accordance with the laws 
            of the United States and you irrevocably submit to the exclusive jurisdiction of the 
            courts in that State or location.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>8. Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            If you have any questions about these Terms & Conditions, please contact us at:
          </p>
          <div className="mt-4 space-y-1 text-gray-600">
            <p>Email: legal@aiworx.com</p>
            <p>Address: 123 AI Street, Tech City, TC 12345</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsConditions;
