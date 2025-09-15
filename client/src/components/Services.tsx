import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Heart, 
  Building, 
  Target,
  ArrowRight 
} from 'lucide-react'

export default function Services() {
  const services = [
    {
      icon: Target,
      title: "Educational Leadership",
      description: "Strategic guidance for educational institutions to implement innovative and learner-centered academic processes.",
      features: ["Pedagogical leadership", "Academic innovation", "Value-based systems", "Staff development"]
    },
    {
      icon: Users,
      title: "Training R&D",
      description: "Comprehensive training programs designed to enhance teaching methodologies and educational effectiveness.",
      features: ["Process monitoring", "Skill development", "Faculty training", "Performance evaluation"]
    },
    {
      icon: GraduationCap,
      title: "Student Development",
      description: "Holistic approach to student growth focusing on academic excellence and character building.",
      features: ["Career counseling", "Moral values", "Leadership skills", "Future readiness"]
    },
    {
      icon: Heart,
      title: "Integrated Learning",
      description: "Innovative educational approaches that combine academics with sports, arts, and life skills.",
      features: ["Holistic curriculum", "Creative learning", "Physical education", "Arts integration"]
    },
    {
      icon: Building,
      title: "School Management",
      description: "Expert consulting for educational institutions to optimize operations and achieve excellence.",
      features: ["Strategic planning", "Quality assurance", "System optimization", "Performance enhancement"]
    }
  ]

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <Card 
                key={index} 
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
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        <span className="text-sm text-foreground" data-testid={`text-feature-${index}-${featureIndex}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-full group"
                    onClick={() => handleServiceInquiry(service.title)}
                    data-testid={`button-inquire-${index}`}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
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