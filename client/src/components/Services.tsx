import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, GraduationCap, BookOpen, Heart, Building, ArrowRight } from 'lucide-react'
import { Link } from 'wouter'
import { imageUrl } from '@/lib/sanity'
import { useCms } from '@/hooks/useCms'

const fallbackIcons = [Users, GraduationCap, BookOpen, Heart, Building]

export default function Services() {
  const { data } = useCms()
  const services = data?.services ?? []

  return (
    <section id="services" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-services-title">
            Our Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-services-subtitle">
            Comprehensive career guidance and educational consulting tailored to your unique journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = fallbackIcons[index % fallbackIcons.length]
            return (
              <Card key={service._id} className="hover-elevate transition-all duration-300 overflow-hidden">
                {service.image && (
                  <img
                    src={imageUrl(service.image, 700)}
                    alt={service.image.alt || service.title}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                  />
                )}
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl" data-testid={`text-service-title-${index}`}>
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/plans">
                    <Button variant="outline" className="w-full rounded-full group">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
