import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PortableText } from "@portabletext/react";
import { imageUrl } from "@/lib/sanity";
import { useCms } from "@/hooks/useCms";

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  const { data } = useCms();
  const blog = data?.blogPosts.find((post) => post.slug === slug);

  if (!blog) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-32 text-center text-muted-foreground">Blog post not found.</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Link href="/blog">
              <Button variant="ghost" className="mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
            <Card className="overflow-hidden">
              {blog.image && (
                <img
                  src={imageUrl(blog.image, 1200)}
                  alt={blog.image.alt || blog.title}
                  className="w-full max-h-[460px] object-cover"
                  loading="lazy"
                />
              )}
              <CardContent className="p-7 md:p-12">
                <h1 className="text-4xl font-bold mb-6 font-display">{blog.title}</h1>
                <div className="flex flex-wrap gap-6 text-muted-foreground mb-8 pb-6 border-b">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {format(new Date(blog.publishedAt), "MMMM dd, yyyy")}
                  </span>
                  <span className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {blog.author}
                  </span>
                </div>
                <div className="prose prose-lg max-w-none">
                  {blog.body ? <PortableText value={blog.body as never} /> : <p>{blog.excerpt}</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
