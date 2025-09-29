import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Heart, 
  Building, 
  Target,
  ArrowRight 
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'wouter'

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  duration?: string | null;
  features?: string[] | null;
  active: boolean;
  createdAt: string;
}

export default function Services() {
  const { data: services = [], isLoading, error } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  // No fallback services - only show database services
  const fallbackServices: any[] = [];

  // Filter for active services only
  const activeServices = services.filter(s => s.active);
  
  // Use active backend services if available, otherwise fallback
  const displayServices = activeServices.length > 0 ? activeServices : fallbackServices;
  
  // Map icons to services (for backend services that don't have icons)
  const getServiceIcon = (title: string, index: number) => {
    const iconMap: { [key: string]: any } = {
      "Educational Leadership": Target,
      "Training R&D": Users,
      "Student Development": GraduationCap,
      "Integrated Learning": Heart,
      "School Management": Building,
    };
    
    return iconMap[title] || [Target, Users, GraduationCap, Heart, Building][index % 5];
  };

  const handleServiceInquiry = (serviceName: string) => {
    console.log(`Inquiry for ${serviceName} service`)
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="services" className="py-20 bg-accent/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-services-title">
            Services Offered
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-services-subtitle">
            Comprehensive solutions designed to unlock your potential and accelerate your success
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">Loading services...</div>
        ) : error ? (
          <Alert className="mb-8">
            <AlertDescription>
              Unable to load services. Showing sample services.
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service, index) => {
            const IconComponent = getServiceIcon(service.title, index);
            const features = service.features || [];
            
            return (
              <Card 
                key={service.id || index} 
                className="hover-elevate active-elevate-2 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                data-testid={`card-service-${index}`}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/30 transition-all duration-300">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold" data-testid={`text-service-title-${index}`}>
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground" data-testid={`text-service-description-${index}`}>
                    {service.description}
                  </CardDescription>
                  {service.price && (
                    <div className="text-lg font-semibold text-primary mt-2">
                      ₹{service.price}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {features.length > 0 && (
                    <ul className="space-y-2">
                      {features.map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          <span className="text-sm text-foreground" data-testid={`text-feature-${index}-${featureIndex}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto p-8 bg-primary/5 border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4" data-testid="text-cta-title">
              Ready to Transform Your Career?
            </h3>
            <p className="text-muted-foreground mb-6" data-testid="text-cta-description">
              Take the first step towards your professional success with a personalized consultation
            </p>
            <Button 
              size="lg" 
              className="rounded-full px-8"
              data-testid="button-get-started"
            >
              Get Started Today
            </Button>
          </Card>
        </div>

      </div>
    </section>
  )
}