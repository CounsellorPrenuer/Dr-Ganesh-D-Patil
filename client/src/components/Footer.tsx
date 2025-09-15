import { 
  Linkedin, 
  Facebook, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import logoImage from '@assets/8c7ab301d192-SKILL_PLUS_KA_BLACK_1757929948113.jpg'

export default function Footer() {
  const handleSocialClick = (platform: string, url: string) => {
    if (url !== "#") {
      window.open(url, '_blank')
    }
    console.log(`${platform} footer link clicked`)
  }

  const handleEmailClick = () => {
    window.location.href = 'mailto:skillpluska@rediffmail.com'
    console.log('Footer email clicked')
  }

  const handlePhoneClick = () => {
    window.location.href = 'tel:+919370000890'
    console.log('Footer phone clicked')
  }

  const quickLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Blog', href: '#blog' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' }
  ]

  const services = [
    'Career Guidance',
    'Workshops',
    'Admission Guidance',
    'Counselling',
    'Consulting & Training'
  ]

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.replace('#', ''))
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src={logoImage} 
                alt="SKILL+ Logo" 
                className="h-12 w-auto"
                data-testid="footer-logo"
              />
            </div>
            
            <p className="text-muted-foreground leading-relaxed max-w-md" data-testid="text-footer-description">
              Empowering individuals and organizations to achieve their full potential through expert career guidance, 
              strategic consulting, and comprehensive skill development programs.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <button
                  onClick={handleEmailClick}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  data-testid="button-footer-email"
                >
                  dr.ganesh@skillplus.com
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <button
                  onClick={handlePhoneClick}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  data-testid="button-footer-phone"
                >
                  +91 9370000890
                </button>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-3">
              {[
                { icon: Linkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/in/ganesh-d-patil-b5034717' },
                { icon: Facebook, label: 'Facebook', url: 'https://www.facebook.com/ganeshd.patil.923' },
                { icon: Instagram, label: 'Instagram', url: '#' },
                { icon: Youtube, label: 'YouTube', url: '#' }
              ].map((social) => {
                const IconComponent = social.icon
                return (
                  <Button
                    key={social.label}
                    variant="outline"
                    size="icon"
                    className="rounded-full hover:scale-110 transition-transform duration-200"
                    onClick={() => handleSocialClick(social.label, social.url)}
                    data-testid={`button-footer-social-${social.label.toLowerCase()}`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4" data-testid="text-footer-quicklinks-title">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    data-testid={`button-footer-link-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-4" data-testid="text-footer-services-title">
              Services
            </h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <span 
                    className="text-muted-foreground"
                    data-testid={`text-footer-service-${index}`}
                  >
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground text-center md:text-left" data-testid="text-footer-copyright">
            © 2024 SKILL+ Career Counseling. All rights reserved. | Dr. Ganesh D. Patil
          </p>
          
          <div className="flex space-x-6 text-sm">
            <button 
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
              data-testid="button-footer-privacy"
            >
              Privacy Policy
            </button>
            <button 
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
              data-testid="button-footer-terms"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}