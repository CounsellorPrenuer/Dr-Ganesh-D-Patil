import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import profileImage from '@assets/profile.jpg'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function Hero() {
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation()
  const { elementRef: profileRef, isVisible: profileVisible } = useScrollAnimation()
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      ref={heroRef}
      id="hero" 
      className="min-h-screen flex items-center justify-center gradient-bg-section pt-20 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center">
          {/* Profile Picture */}
          <div 
            ref={profileRef}
            className={`mb-8 ${profileVisible ? 'animate-slide-in-scale' : 'scroll-hidden'}`}
          >
            <img
              src={profileImage}
              alt="Dr. Ganesh D. Patil"
              className="w-48 h-48 rounded-2xl mx-auto object-cover shadow-lg border-4 border-secondary/40 hover-lift animate-float smooth-all"
              data-testid="img-profile"
            />
          </div>

          {/* Name and Title */}
          <div 
            ref={titleRef}
            className={`${titleVisible ? 'animate-fade-in-up stagger-1' : 'scroll-hidden'}`}
          >
            <h1 className="text-5xl md:text-6xl font-bold gradient-text-primary mb-4" data-testid="text-name">
              Dr. Ganesh D. Patil
            </h1>
          </div>
          
          <div className={`flex flex-wrap justify-center gap-3 mb-8 ${titleVisible ? 'animate-fade-in-up stagger-2' : 'scroll-hidden'}`}>
            <span className="text-xl text-muted-foreground bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-1 rounded-full hover-scale-sm smooth-all" data-testid="text-role-career">Career Counsellor</span>
            <span className="text-xl text-muted-foreground bg-gradient-to-r from-secondary/10 to-primary/10 px-4 py-1 rounded-full hover-scale-sm smooth-all" data-testid="text-role-consultant">School Management Consultant</span>
            <span className="text-xl text-muted-foreground bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-1 rounded-full hover-scale-sm smooth-all" data-testid="text-role-trainer">Skill Trainer</span>
          </div>

          <p className={`text-lg text-muted-foreground max-w-2xl mx-auto mb-12 ${titleVisible ? 'animate-fade-in-up stagger-3' : 'scroll-hidden'}`} data-testid="text-description">
            Principal & Pedagogical Leader dedicated to practical, innovative, and learner-centered education. 
            Specialized in value-based systems, staff development, and holistic student growth.
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 ${titleVisible ? 'animate-fade-in-up stagger-4' : 'scroll-hidden'}`}>
            <Button 
              size="lg"
              className="rounded-full px-8 py-3 text-lg hover-scale hover-glow smooth-all"
              onClick={() => scrollToSection('contact')}
              data-testid="button-book-consultation"
            >
              Book Consultation
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-3 text-lg hover-scale hover-lift smooth-all"
              onClick={() => scrollToSection('services')}
              data-testid="button-explore-services"
            >
              Explore Services
            </Button>
          </div>

          {/* Scroll Indicator */}
          <button
            onClick={() => scrollToSection('about')}
            className={`animate-bounce text-muted-foreground hover:text-primary smooth-all ${titleVisible ? 'animate-fade-in-up stagger-5' : 'scroll-hidden'}`}
            data-testid="button-scroll-down"
          >
            <ChevronDown className="h-8 w-8 mx-auto hover-scale-sm" />
          </button>
        </div>
      </div>
    </section>
  )
}