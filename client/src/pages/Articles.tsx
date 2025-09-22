import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, User, Tag, Search, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category?: string | null;
  tags?: string[] | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Articles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: articles, isLoading, error } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center p-8">
            <div className="text-lg">Loading articles...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertDescription>
              Failed to load articles. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Filter articles based on search and category
  const filteredArticles = articles?.filter(article => {
    const matchesSearch = searchTerm === "" || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];

  // Get unique categories for filtering
  const categories = Array.from(new Set(
    articles?.map(article => article.category).filter(Boolean) || []
  )) as string[];

  return (
    <div className="min-h-screen bg-background mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight" data-testid="text-articles-title">
            Knowledge Articles
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights, tips, and guidance for your career journey
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-articles"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              data-testid="button-filter-all"
            >
              All Categories
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                data-testid={`button-filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              {searchTerm || selectedCategory ? (
                <div className="space-y-2">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p>No articles found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => { setSearchTerm(""); setSelectedCategory(null); }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p>No articles published yet. Check back soon!</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover-elevate group" data-testid={`card-article-${article.id}`}>
                <CardHeader className="pb-3">
                  <div className="space-y-2">
                    <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors" data-testid={`text-article-title-${article.id}`}>
                      {article.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(article.updatedAt), "MMM dd, yyyy")}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {article.category && (
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                    )}
                    {article.tags && article.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {article.tags && article.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{article.tags.length - 2} more
                      </Badge>
                    )}
                  </div>
                  
                  <Link href={`/articles/${article.id}`}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors mt-4"
                      data-testid={`button-read-${article.id}`}
                    >
                      Read Article
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Results Summary */}
        {articles && articles.length > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Showing {filteredArticles.length} of {articles.length} articles
          </div>
        )}
      </div>
    </div>
  );
}