
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Calendar,
  FileText,
  Image,
  Mic,
  Code,
  Eye,
  MoreVertical
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WorkspaceItem {
  id: string;
  title: string;
  type: 'blog' | 'image' | 'audio' | 'code' | 'analysis';
  content: string;
  createdAt: Date;
  tool: string;
}

const MyWorkspace = () => {
  const [items, setItems] = useState<WorkspaceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    // Load saved items from localStorage
    const savedItems = localStorage.getItem('aiworx_workspace');
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems).map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt)
      }));
      setItems(parsedItems);
    }
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'blog': return <FileText className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'audio': return <Mic className="w-4 h-4" />;
      case 'code': return <Code className="w-4 h-4" />;
      case 'analysis': return <Eye className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blog': return 'bg-blue-100 text-blue-700';
      case 'image': return 'bg-purple-100 text-purple-700';
      case 'audio': return 'bg-green-100 text-green-700';
      case 'code': return 'bg-orange-100 text-orange-700';
      case 'analysis': return 'bg-cyan-100 text-cyan-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const downloadItem = (item: WorkspaceItem) => {
    const element = document.createElement("a");
    const file = new Blob([item.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${item.title.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded!",
      description: "Item has been downloaded successfully",
    });
  };

  const deleteItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    localStorage.setItem('aiworx_workspace', JSON.stringify(updatedItems));
    
    toast({
      title: "Deleted!",
      description: "Item has been removed from your workspace",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">My Workspace</CardTitle>
              <CardDescription className="text-gray-600">
                Manage and organize your AI-generated content
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search your content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="blog">Blog Posts</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="code">Code</SelectItem>
                  <SelectItem value="analysis">Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getIcon(item.type)}
                    <div>
                      <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                      <CardDescription className="text-sm">{item.tool}</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-3 max-h-24 overflow-hidden">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {item.content.substring(0, 150)}...
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className={getTypeColor(item.type)}>
                      {item.type}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {item.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => downloadItem(item)}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <User className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterType !== 'all' ? 'No results found' : 'Your workspace is empty'}
            </h3>
            <p className="text-gray-500 max-w-sm mb-6">
              {searchQuery || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start creating content with our AI tools to see it appear here'
              }
            </p>
            {!searchQuery && filterType === 'all' && (
              <Button>
                Explore AI Tools
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-center space-x-8 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{items.length}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {items.filter(item => item.type === 'blog').length}
              </div>
              <div className="text-sm text-gray-600">Blog Posts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {items.filter(item => item.type === 'image').length}
              </div>
              <div className="text-sm text-gray-600">Images</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {items.filter(item => item.type === 'audio').length}
              </div>
              <div className="text-sm text-gray-600">Audio Files</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyWorkspace;
