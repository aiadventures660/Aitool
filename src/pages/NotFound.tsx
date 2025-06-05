
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full border-none shadow-lg">
        <CardContent className="pt-12 pb-10 px-8 text-center">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-red-600 text-4xl font-bold">404</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
          
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. The URL may be misspelled or the page you're looking for is no longer available.
          </p>
          
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            
            <div className="flex gap-3">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="flex-1">
                <Link to="/">
                  <Search className="w-4 h-4 mr-2" />
                  Search Tools
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
