import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MentoriaPartnership() {
  const benefits = [
    "Scientifically validated career assessments from Mentoria",
    "Lifelong access to Mentoria's mentorship platform", 
    "Access to Mentoria's comprehensive Knowledge Gateway",
    "Opportunities to connect with industry experts and mentors",
    "Invitations to exclusive webinars and workshops",
    "Personalized career roadmap with step-by-step guidance"
  ]

  const handleVisitMentoria = () => {
    window.open('https://www.mentoria.com/', '_blank')
    console.log('Visit Mentoria button clicked')
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-mentoria-title">
            Mentoria Partnership
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-mentoria-subtitle">
            Access world-class career guidance resources through our partnership
          </p>
        </div>

        {/* Mentoria Logo */}
        <div className="flex justify-center mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8 w-64">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">MENTORIA</div>
              <div className="text-sm text-muted-foreground">SCIENCE OF CAREERS</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Partner Description */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground" data-testid="text-mentoria-partner-title">
              Proud Partner & Counsellorpreneur with Mentoria
            </h3>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p data-testid="text-mentoria-partner-description-1">
                As an official Mentoria partner and certified Counsellorpreneur, I 
                provide clients with access to India's leading career guidance 
                platform, enhancing my counselling services with scientifically 
                validated assessments and resources.
              </p>
              
              <p data-testid="text-mentoria-partner-description-2">
                When you book a session with me, you'll receive a comprehensive Mentoria 
                assessment and <strong>lifelong access</strong> to their mentorship platform, knowledge 
                gateway, expert connects, and exclusive webinars - all designed to provide 
                you with ongoing career guidance and support.
              </p>
            </div>

            <Button 
              onClick={handleVisitMentoria}
              className="mt-6"
              data-testid="button-visit-mentoria"
            >
              Visit Mentoria →
            </Button>
          </div>

          {/* Right Column - Benefits */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground" data-testid="text-mentoria-benefits-title">
              What You Get Through This Partnership
            </h3>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-3"
                  data-testid={`item-mentoria-benefit-${index}`}
                >
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground leading-relaxed">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}