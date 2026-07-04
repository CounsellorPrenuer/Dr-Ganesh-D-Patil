import { Quote, Star } from "lucide-react";
import { Navigation } from "@/components/navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { imageUrl } from "@/lib/sanity";
import { useCms } from "@/hooks/useCms";

export default function TestimonialsPage() {
  const { data } = useCms();
  const testimonials = data?.testimonials ?? [];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <section className="py-16 bg-gradient-to-br from-primary/10 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 text-center">
              Success <span className="text-primary">Stories</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-center">
              Read testimonials from students, parents, and professionals who have
              experienced transformative growth with Growth Platter Academy.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial._id}
                  className="hover-elevate active-elevate-2 transition-all border-l-4 border-l-primary"
                  data-testid={`card-testimonial-${testimonial._id}`}
                >
                  <CardContent className="p-6">
                    <Quote className="h-10 w-10 text-primary/30 mb-4" />
                    <p className="text-muted-foreground mb-6 leading-relaxed">{testimonial.quote}</p>
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        {testimonial.image && (
                          <AvatarImage src={imageUrl(testimonial.image, 200)} alt={testimonial.name} />
                        )}
                        <AvatarFallback className="bg-primary/10 text-primary text-lg">
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-lg">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
