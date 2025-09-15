import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import profileImage from '@assets/image_1757930432279.png'

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      id="hero" 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/30 to-primary/5 pt-20"
    >
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center">
          {/* Profile Picture */}
          <div className="mb-8">
            <img
              src={profileImage}
              alt="Dr. Ganesh D. Patil"
              className="w-48 h-48 rounded-2xl mx-auto object-cover shadow-lg border-4 border-secondary/40"
              data-testid="img-profile"
            />
          </div>

          {/* Name and Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4" data-testid="text-name">
            Dr. Ganesh D. Patil
          </h1>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="text-xl text-muted-foreground bg-accent/20 px-4 py-1 rounded-full" data-testid="text-role-career">Career Counsellor</span>
            <span className="text-xl text-muted-foreground bg-accent/20 px-4 py-1 rounded-full" data-testid="text-role-consultant">School Management Consultant</span>
            <span className="text-xl text-muted-foreground bg-accent/20 px-4 py-1 rounded-full" data-testid="text-role-trainer">Skill Trainer</span>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12" data-testid="text-description">
            Serving students, parents, schools, colleges, corporates, and working professionals with expert 
            career guidance, strategic consulting, and comprehensive skill development programs.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg"
              className="rounded-full px-8 py-3 text-lg hover:scale-105 transition-transform duration-200"
              onClick={() => scrollToSection('contact')}
              data-testid="button-book-consultation"
            >
              Book Consultation
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-3 text-lg hover:scale-105 transition-transform duration-200"
              onClick={() => scrollToSection('services')}
              data-testid="button-explore-services"
            >
              Explore Services
            </Button>
          </div>

          {/* Scroll Indicator */}
          <button
            onClick={() => scrollToSection('about')}
            className="animate-bounce text-muted-foreground hover:text-primary transition-colors duration-200"
            data-testid="button-scroll-down"
          >
            <ChevronDown className="h-8 w-8 mx-auto" />
          </button>
        </div>
      </div>
    </section>
  )
}