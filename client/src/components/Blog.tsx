import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Link } from 'wouter'
import { format } from 'date-fns'
import { imageUrl } from '@/lib/sanity'
import { useCms } from '@/hooks/useCms'

const externalLinks = [
  {
    id: "blog-link",
    title: "External Blog",
    excerpt: "englishguruganesh.blogspot.com",
    category: "Blog",
    externalLink: "https://englishguruganesh.blogspot.com"
  },
  {
    id: "youtube-channel",
    title: "YouTube Channel",
    excerpt: "English Guru Ganesh D Patil",
    category: "Video Content",
    externalLink: "https://www.youtube.com/@EnglishGuruGaneshDPatil"
  }
]

export default function Blog() {
  const { data } = useCms()
  const posts = data?.blogPosts?.slice(0, 3) ?? []

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {posts.map((post, index) => (
            <Card key={post._id} className="hover-elevate transition-all duration-300 overflow-hidden">
              {post.image && (
                <img
                  src={imageUrl(post.image, 700)}
                  alt={post.image.alt || post.title}
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              )}
              <CardHeader>
                {post.featured && <Badge variant="secondary" className="w-fit mb-2">Featured</Badge>}
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                <p className="text-sm text-muted-foreground">{format(new Date(post.publishedAt), "MMM dd, yyyy")}</p>
              </CardHeader>
              <CardContent>
                <Link href={`/blog/${post.slug}`}>
                  <Button variant="ghost" className="p-0 h-auto font-medium text-secondary">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {externalLinks.map((post, index) => (
            <Card key={post.id} className="hover-elevate transition-all duration-300">
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">{post.category}</Badge>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <a href={post.externalLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" className="p-0 h-auto font-medium text-secondary">
                    Visit {post.category === 'Blog' ? 'Blog' : 'Channel'}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/blog">
            <Button variant="outline" className="rounded-full">View All Articles</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
