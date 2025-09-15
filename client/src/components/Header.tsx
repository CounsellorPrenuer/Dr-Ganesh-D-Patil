import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import logoImage from '@assets/8c7ab301d192-SKILL_PLUS_KA_BLACK_1757929948113.jpg'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'services', 'blog', 'testimonials', 'contact']
      const scrollY = window.scrollY + 150 // Offset for header height
      
      let currentSection = 'hero' // Default to hero
      
      for (const sectionId of sections) {
        const section = document.getElementById(sectionId)
        if (section) {
          const sectionTop = section.offsetTop - 200
          const sectionBottom = sectionTop + section.offsetHeight
          
          if (scrollY >= sectionTop && scrollY < sectionBottom) {
            currentSection = sectionId
            break
          }
        }
      }
      
      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { label: 'Home', id: 'hero' },
    { label: 'About', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Blog', id: 'blog' },
    { label: 'Testimonials', id: 'testimonials' },
    { label: 'Contact', id: 'contact' }
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src={logoImage} 
              alt="SKILL+ Logo" 
              className="h-10 w-auto"
              data-testid="logo-image"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`font-medium transition-all duration-300 relative ${
                  activeSection === item.id 
                    ? 'text-primary' 
                    : 'text-foreground hover:text-primary'
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                {item.label}
                {activeSection === item.id && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
                )}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              onClick={() => scrollToSection('contact')}
              className="rounded-full px-6"
              data-testid="button-book-consultation"
            >
              Book Consultation
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <div className="relative">
              {isMenuOpen ? (
                <X className="h-5 w-5 transform rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="h-5 w-5 transform rotate-0 transition-transform duration-300" />
              )}
            </div>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0'
        }`}>
          <div className="mt-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left font-medium transition-all duration-300 transform ${
                    isMenuOpen 
                      ? 'translate-x-0 opacity-100' 
                      : 'translate-x-4 opacity-0'
                  } ${
                    activeSection === item.id 
                      ? 'text-primary font-semibold' 
                      : 'text-foreground hover:text-primary'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <div className="w-2 h-2 bg-primary rounded-full inline-block ml-2"></div>
                  )}
                </button>
              ))}
              <Button 
                onClick={() => scrollToSection('contact')}
                className={`rounded-full mt-4 w-full transition-all duration-300 transform ${
                  isMenuOpen 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: `${menuItems.length * 50}ms` }}
                data-testid="button-mobile-consultation"
              >
                Book Consultation
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}