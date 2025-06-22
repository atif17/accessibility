import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Search, Calendar, ArrowRight, Plus } from "lucide-react";

interface KnowledgeArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  readTime: number;
  createdAt: string;
}

const categoryColors: Record<string, string> = {
  'Getting Started': 'bg-blue-100 text-primary',
  'Testing Methods': 'bg-green-100 text-secondary',
  'WCAG Guidelines': 'bg-purple-100 text-purple-700',
  'Legal Compliance': 'bg-orange-100 text-orange-700',
  'Tools & Resources': 'bg-red-100 text-red-700',
  'Case Studies': 'bg-yellow-100 text-yellow-700',
};

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showMore, setShowMore] = useState(false);

  const { data: articles = [] } = useQuery<KnowledgeArticle[]>({
    queryKey: ['/api/knowledge', selectedCategory === 'All Categories' ? undefined : selectedCategory, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All Categories') {
        params.append('category', selectedCategory);
      }
      if (searchQuery.trim()) {
        params.append('q', searchQuery.trim());
      }
      
      const response = await fetch(`/api/knowledge?${params.toString()}`);
      return response.json();
    },
  });

  const displayedArticles = showMore ? articles : articles.slice(0, 6);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section id="knowledge" className="mb-16" role="region" aria-labelledby="knowledge-title">
      <div className="text-center mb-12">
        <h2 id="knowledge-title" className="text-3xl font-bold text-gray-900 mb-4">
          Accessibility Knowledge Base
        </h2>
        <p className="text-xl text-gray-600">
          Comprehensive guides, best practices, and solutions for common accessibility challenges.
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="knowledge-search" className="sr-only">
                Search knowledge base
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="knowledge-search"
                  placeholder="Search guides, tutorials, and best practices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <Label htmlFor="knowledge-category" className="sr-only">
                Filter by category
              </Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Categories">All Categories</SelectItem>
                  <SelectItem value="Getting Started">Getting Started</SelectItem>
                  <SelectItem value="WCAG Guidelines">WCAG Guidelines</SelectItem>
                  <SelectItem value="Testing Methods">Testing Methods</SelectItem>
                  <SelectItem value="Legal Compliance">Legal Compliance</SelectItem>
                  <SelectItem value="Tools & Resources">Tools & Resources</SelectItem>
                  <SelectItem value="Case Studies">Case Studies</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Base Articles */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedArticles.map((article) => {
          const colorClass = categoryColors[article.category] || 'bg-gray-100 text-gray-700';
          
          return (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center mb-3">
                  <Badge className={colorClass}>
                    {article.category}
                  </Badge>
                  <span className="ml-2 text-xs text-gray-500">
                    {article.readTime} min read
                  </span>
                </div>
                <CardTitle className="text-lg">
                  <button className="text-left hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors">
                    {article.title}
                  </button>
                </CardTitle>
                <CardDescription>
                  {article.content.length > 150 
                    ? `${article.content.substring(0, 150)}...`
                    : article.content
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="mr-1 h-3 w-3" />
                    <time dateTime={article.createdAt}>
                      {formatDate(article.createdAt)}
                    </time>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                    Read More <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Load More */}
      {!showMore && articles.length > 6 && (
        <div className="text-center mt-8">
          <Button 
            variant="outline"
            onClick={() => setShowMore(true)}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Load More Articles
          </Button>
        </div>
      )}

      {articles.length === 0 && (searchQuery || selectedCategory !== 'All Categories') && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No articles found matching your search criteria.
          </p>
        </div>
      )}
    </section>
  );
}
