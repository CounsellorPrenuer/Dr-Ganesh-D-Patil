import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ExternalLink } from 'lucide-react'

export default function Blog() {
  // Static content - Blog and YouTube links
  const displayPosts = [
    {
      id: "blog-link",
      title: "Blog",
      excerpt: "englishguruganesh.blogspot.com",
      author: "Dr. Ganesh D. Patil",
      category: "Blog",
      externalLink: "https://englishguruganesh.blogspot.com"
    },
    {
      id: "youtube-channel",
      title: "YouTube Channel",
      excerpt: "English Guru Ganesh D Patil",
      author: "Dr. Ganesh D. Patil",
      category: "Video Content",
      externalLink: "https://www.youtube.com/@EnglishGuruGaneshDPatil"
    }
  ];

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

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {displayPosts.map((post, index) => (
            <Card 
              key={post.id} 
              className="hover-elevate active-elevate-2 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              data-testid={`card-blog-post-${index}`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                </div>
                
                <CardTitle className="text-xl font-semibold leading-tight group-hover:text-secondary transition-colors duration-200" data-testid={`text-blog-title-${index}`}>
                  {post.title}
                </CardTitle>
                
                <CardDescription className="text-muted-foreground leading-relaxed" data-testid={`text-blog-excerpt-${index}`}>
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <a 
                  href={post.externalLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group p-0 h-auto font-medium text-secondary hover:text-secondary"
                    data-testid={`button-visit-${index}`}
                  >
                    Visit {post.category === 'Blog' ? 'Blog' : 'Channel'}
                    <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}