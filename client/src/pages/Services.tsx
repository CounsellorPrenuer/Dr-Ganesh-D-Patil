import { Navigation } from "@/components/navigation";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { imageUrl } from "@/lib/sanity";
import { useCms } from "@/hooks/useCms";

export default function ServicesPage() {
  const { data } = useCms();
  const services = data?.services ?? [];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <section className="py-16 bg-gradient-to-br from-primary/10 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 text-center">
              Our <span className="text-primary">Services</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-center">
              Comprehensive career guidance, counselling, and educational consulting services
              tailored to students, parents, and professionals.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service) => (
                <Card
                  key={service._id}
                  className="hover-elevate active-elevate-2 transition-all overflow-hidden"
                  data-testid={`card-service-${service._id}`}
                >
                  {service.image && (
                    <img
                      src={imageUrl(service.image, 800)}
                      alt={service.image.alt || service.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-bold text-3xl mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Choose a Mentoria plan that fits your needs or contact us for personalized guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/plans">
                <Button size="lg" data-testid="button-view-plans">View Plans</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" data-testid="button-contact-us">Contact Us</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
