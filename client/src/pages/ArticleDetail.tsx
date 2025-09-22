import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar, User, Tag, ArrowLeft, Share2, Copy, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Link, useRoute } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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

export default function ArticleDetail() {
  const [, params] = useRoute("/articles/:id");
  const { toast } = useToast();
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false);
  
  const articleId = params?.id;

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: [`/api/articles/${articleId}`],
    enabled: !!articleId,
  });

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Article link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleShareTwitter = () => {
    const text = `Check out this article: "${article?.title}" by ${article?.author}`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = window.location.href;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = `Check out this article: "${article?.title}" by ${article?.author} ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center p-8">
            <div className="text-lg">Loading article...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 space-y-4">
          <Link href="/articles">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Articles
            </Button>
          </Link>
          <Alert>
            <AlertDescription>
              Article not found or failed to load. Please check the URL and try again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        
        {/* Navigation */}
        <Link href="/articles">
          <Button variant="outline" size="sm" data-testid="button-back-articles">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Articles
          </Button>
        </Link>

        {/* Article Content */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="space-y-4">
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight" data-testid="text-article-title">
              {article.title}
            </h1>
            
            {/* Excerpt */}
            <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-article-excerpt">
              {article.excerpt}
            </p>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span data-testid="text-article-author">{article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span data-testid="text-article-date">
                  {format(new Date(article.updatedAt), "MMMM dd, yyyy")}
                </span>
              </div>
            </div>
            
            {/* Category and Tags */}
            <div className="flex flex-wrap gap-2">
              {article.category && (
                <Badge variant="outline" data-testid="badge-article-category">
                  {article.category}
                </Badge>
              )}
              {article.tags && article.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" data-testid={`badge-article-tag-${index}`}>
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Share Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t">
              <span className="text-sm font-medium">Share this article:</span>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCopyLink}
                data-testid="button-copy-link"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy Link
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleShareTwitter}
                data-testid="button-share-twitter"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Twitter
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleShareLinkedIn}
                data-testid="button-share-linkedin"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                LinkedIn
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleShareWhatsApp}
                data-testid="button-share-whatsapp"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                WhatsApp
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:scroll-m-20 prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-p:leading-7 prose-blockquote:border-l-4 prose-blockquote:border-border prose-blockquote:pl-6 prose-blockquote:italic prose-code:relative prose-code:rounded prose-code:bg-muted prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:font-mono prose-code:text-sm"
              data-testid="content-article-body"
            >
              <div className="whitespace-pre-wrap">
                {article.content}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles Section (Placeholder for future enhancement) */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <h2 className="text-xl font-semibold">Related Articles</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              Related articles feature coming soon...
            </p>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="max-w-4xl mx-auto bg-muted/50">
          <CardContent className="p-8 text-center space-y-4">
            <h3 className="text-xl font-semibold">Need Personalized Career Guidance?</h3>
            <p className="text-muted-foreground">
              Book a consultation session with Dr. Ganesh D. Patil for tailored career advice.
            </p>
            <Link href="/services">
              <Button data-testid="button-cta-services">
                Explore Our Services
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}