import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

export default function Blog() {
  const blogPosts = [
    {
      title: "5 Essential Steps to Career Transition Success",
      excerpt: "Discover the proven strategies that help professionals successfully navigate major career changes and find fulfillment in their new roles.",
      date: "2024-03-15",
      readTime: "5 min read",
      category: "Career Guidance"
    },
    {
      title: "The Future of Education: Adapting to Modern Challenges",
      excerpt: "Explore how educational institutions can evolve to meet the demands of the 21st century and prepare students for tomorrow's workforce.",
      date: "2024-03-10",
      readTime: "8 min read",
      category: "Education"
    },
    {
      title: "Building Essential Skills for Professional Growth",
      excerpt: "Learn about the key competencies that drive career advancement and how to develop them effectively through targeted training programs.",
      date: "2024-03-05",
      readTime: "6 min read",
      category: "Skill Development"
    }
  ]

  const handleReadMore = (title: string) => {
    console.log(`Reading article: ${title}`)
    alert(`Full article for "${title}" coming soon!`)
  }

  const handleViewAllPosts = () => {
    console.log('View all blog posts clicked')
    alert('Complete blog section with more articles coming soon!')
  }

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card 
              key={index} 
              className="hover-elevate active-elevate-2 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              onClick={() => handleReadMore(post.title)}
              data-testid={`card-blog-post-${index}`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <span className="bg-gradient-to-r from-secondary/20 to-accent/30 text-secondary px-3 py-1 rounded-full font-medium" data-testid={`text-blog-category-${index}`}>
                    {post.category}
                  </span>
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
                      <Calendar className="h-4 w-4" />
                      <span data-testid={`text-blog-date-${index}`}>
                        {new Date(post.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span data-testid={`text-blog-readtime-${index}`}>{post.readTime}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-between group p-0 h-auto font-medium text-secondary hover:text-secondary"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleReadMore(post.title)
                  }}
                  data-testid={`button-read-more-${index}`}
                >
                  Read More
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Posts CTA */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="rounded-full px-8"
            onClick={handleViewAllPosts}
            data-testid="button-view-all-posts"
          >
            View All Posts
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}