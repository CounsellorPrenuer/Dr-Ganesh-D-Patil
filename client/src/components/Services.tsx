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

  // Fallback services in case backend is empty
  const fallbackServices = [
    {
      id: "fallback-1",
      title: "Educational Leadership",
      description: "Strategic guidance for educational institutions to implement innovative and learner-centered academic processes.",
      price: "Contact for pricing",
      features: ["Pedagogical leadership", "Academic innovation", "Value-based systems", "Staff development"],
      icon: Target
    },
    {
      id: "fallback-2", 
      title: "Training R&D",
      description: "Comprehensive training programs designed to enhance teaching methodologies and educational effectiveness.",
      price: "Contact for pricing",
      features: ["Process monitoring", "Skill development", "Faculty training", "Performance evaluation"],
      icon: Users
    },
    {
      id: "fallback-3",
      title: "Student Development",
      description: "Holistic approach to student growth focusing on academic excellence and character building.",
      price: "Contact for pricing", 
      features: ["Career counseling", "Moral values", "Leadership skills", "Future readiness"],
      icon: GraduationCap
    }
  ];

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
                      {features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          <span className="text-sm text-foreground" data-testid={`text-feature-${index}-${featureIndex}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <div className="flex flex-col space-y-2">
                    <Link href="/services">
                      <Button 
                        variant="default" 
                        className="w-full rounded-full group"
                        data-testid={`button-book-${index}`}
                      >
                        Book Service
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </Link>
                  </div>
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

        {/* Payment Section */}
        <div className="mt-16">
          <Card className="max-w-4xl mx-auto p-8 bg-secondary/5 border-secondary/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-4" data-testid="text-payment-title">
                Secure Payment Options
              </h3>
              <p className="text-muted-foreground" data-testid="text-payment-description">
                Choose your preferred payment method for booking our services
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 hover-elevate">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center">
                    <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2" data-testid="text-online-payment-title">
                    Online Payment
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4" data-testid="text-online-payment-description">
                    Secure payment through UPI, Credit/Debit Cards, Net Banking
                  </p>
                  <Button 
                    variant="default" 
                    className="w-full rounded-full"
                    data-testid="button-online-payment"
                  >
                    Pay Online
                  </Button>
                </div>
              </Card>
              
              <Card className="p-6 hover-elevate">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center">
                    <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2" data-testid="text-contact-payment-title">
                    Contact for Payment
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4" data-testid="text-contact-payment-description">
                    Call or message us for personalized payment assistance and custom pricing
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-full"
                    onClick={() => {
                      const contactSection = document.getElementById('contact');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    data-testid="button-contact-payment"
                  >
                    Contact Us
                  </Button>
                </div>
              </Card>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-xs text-muted-foreground" data-testid="text-payment-security">
                🔒 All payments are secure and encrypted. We accept major payment methods.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}