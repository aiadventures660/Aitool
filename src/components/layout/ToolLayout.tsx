
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  badge?: string;
}

const ToolLayout = ({ title, description, icon, children, badge }: ToolLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="border-none shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              {icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-2xl">{title}</CardTitle>
                {badge && <Badge variant="secondary">{badge}</Badge>}
              </div>
              <CardDescription className="text-gray-600 mt-1">
                {description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tool Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default ToolLayout;
