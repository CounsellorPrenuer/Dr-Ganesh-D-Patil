import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import mentoriaLogo from '@assets/image_1758015336109.png'

export default function MentoriaPartnership() {
  const benefits = [
    { text: "Scientifically validated", bold: "career assessments", suffix: "from Mentoria" },
    { text: "", bold: "Lifelong access", suffix: "to Mentoria's mentorship platform" },
    { text: "Access to Mentoria's comprehensive", bold: "Knowledge Gateway", suffix: "" },
    { text: "Opportunities to connect with", bold: "industry experts", suffix: "and mentors" },
    { text: "Invitations to exclusive", bold: "webinars and workshops", suffix: "" },
    { text: "Personalized career roadmap with", bold: "step-by-step guidance", suffix: "" }
  ]

  const handleVisitMentoria = () => {
    window.open('https://www.mentoria.com/', '_blank')
    console.log('Visit Mentoria button clicked')
  }

  return (
    <section className="py-20 bg-background">
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

        {/* Main Card Container */}
        <Card className="p-8 mb-12 bg-card border border-border">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Mentoria Logo */}
            <div className="flex justify-center lg:justify-start">
              <img 
                src={mentoriaLogo} 
                alt="Mentoria - Clutter to Clarity" 
                className="h-16 w-auto"
                data-testid="mentoria-logo"
              />
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
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground leading-relaxed">
                      {benefit.text} <strong className="text-foreground">{benefit.bold}</strong> {benefit.suffix}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Bottom Section - Partner Description */}
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
              variant="outline"
              className="mt-6"
              data-testid="button-visit-mentoria"
            >
              Visit Mentoria →
            </Button>
          </div>

          {/* Right Column - Empty for spacing */}
          <div></div>
        </div>
      </div>
    </section>
  )
}