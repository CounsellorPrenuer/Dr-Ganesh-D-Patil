import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, ArrowRight, User } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'wouter'

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

export default function Blog() {
  const { data: articles = [], isLoading, error } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  // Filter for published articles and take only the first 3 for the home page
  const publishedArticles = articles.filter(article => article.published).slice(0, 3);

  // Fallback blog posts in case backend is empty
  const fallbackPosts = [
    {
      id: "fallback-1",
      title: "5 Essential Steps to Career Transition Success",
      excerpt: "Discover the proven strategies that help professionals successfully navigate major career changes and find fulfillment in their new roles.",
      content: "This comprehensive guide covers the essential strategies for successful career transitions. Learn how to identify your transferable skills, build a compelling personal brand, network effectively, and navigate the emotional challenges of changing careers. With practical tips and real-world examples, this article provides a roadmap for professionals looking to make meaningful career changes.",
      author: "Dr. Ganesh D. Patil",
      category: "Career Guidance",
      updatedAt: "2024-03-15"
    },
    {
      id: "fallback-2",
      title: "The Future of Education: Adapting to Modern Challenges",
      excerpt: "Explore how educational institutions can evolve to meet the demands of the 21st century and prepare students for tomorrow's workforce.",
      content: "Educational institutions worldwide are facing unprecedented challenges in preparing students for a rapidly evolving job market. This article examines emerging trends in education technology, pedagogical innovation, and institutional transformation. From AI-assisted learning to hybrid classroom models, discover how educational leaders can adapt their strategies to meet modern demands while maintaining academic excellence.",
      author: "Dr. Ganesh D. Patil",
      category: "Education",
      updatedAt: "2024-03-10"
    },
    {
      id: "fallback-3",
      title: "Building Essential Skills for Professional Growth",
      excerpt: "Learn about the key competencies that drive career advancement and how to develop them effectively through targeted training programs.",
      content: "Professional success in today's competitive landscape requires a strategic approach to skill development. This article explores the most in-demand competencies across industries, from technical expertise to soft skills like emotional intelligence and leadership. Learn how to assess your current skill gaps, create a development plan, and leverage various learning opportunities to accelerate your career growth.",
      author: "Dr. Ganesh D. Patil",
      category: "Skill Development",
      updatedAt: "2024-03-05"
    }
  ];

  // Use backend articles if available, otherwise fallback
  const displayPosts = publishedArticles.length > 0 ? publishedArticles : fallbackPosts;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content?: string) => {
    if (!content) return "5 min read";
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  return (
    <section id="blog" className="py-20 bg-accent/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-blog-title">
            Latest Insights
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-blog-subtitle">
            Stay updated with expert advice, industry trends, and practical tips for career success
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">Loading articles...</div>
        ) : error ? (
          <Alert className="mb-8">
            <AlertDescription>
              Unable to load articles. Showing sample articles.
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPosts.map((post, index) => (
            <Card 
              key={post.id || index} 
              className="hover-elevate active-elevate-2 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              data-testid={`card-blog-post-${index}`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  {post.category && (
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-xl font-semibold leading-tight group-hover:text-secondary transition-colors duration-200" data-testid={`text-blog-title-${index}`}>
                  {post.title}
                </CardTitle>
                
                <CardDescription className="text-muted-foreground leading-relaxed" data-testid={`text-blog-excerpt-${index}`}>
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span data-testid={`text-blog-author-${index}`}>
                        {post.author}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span data-testid={`text-blog-date-${index}`}>
                        {formatDate(post.updatedAt)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span data-testid={`text-blog-readtime-${index}`}>
                        {calculateReadTime(post.content)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Link href={`/articles/${post.id}`}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group p-0 h-auto font-medium text-secondary hover:text-secondary"
                    data-testid={`button-read-more-${index}`}
                  >
                    Read Full Article
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Posts CTA */}
        <div className="text-center mt-12">
          <Link href="/articles">
            <Button 
              variant="outline" 
              size="lg"
              className="rounded-full px-8"
              data-testid="button-view-all-posts"
            >
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}