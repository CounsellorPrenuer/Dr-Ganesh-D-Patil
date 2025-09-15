import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Facebook, 
  Instagram, 
  Youtube,
  Send 
} from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    console.log(`${name} field updated:`, value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Contact form submitted:', formData)
    // todo: implement form submission functionality
    alert('Thank you for your message! Dr. Patil will get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "skillpluska@rediffmail.com",
      action: "mailto:skillpluska@rediffmail.com"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 9370000890",
      action: "tel:+919370000890"
    },
    {
      icon: MapPin,
      label: "Office",
      value: "Maharashtra, India",
      action: "#"
    }
  ]

  const socialLinks = [
    {
      icon: Linkedin,
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/ganesh-d-patil-b5034717"
    },
    {
      icon: Facebook,
      label: "Facebook",
      url: "https://www.facebook.com/ganeshd.patil.923"
    },
    {
      icon: Instagram,
      label: "Instagram",
      url: "#"
    },
    {
      icon: Youtube,
      label: "YouTube",
      url: "#"
    }
  ]

  const handleSocialClick = (platform: string, url: string) => {
    if (url !== "#") {
      window.open(url, '_blank')
    }
    console.log(`${platform} link clicked:`, url)
  }

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-contact-title">
            Get In Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-contact-subtitle">
            Ready to take the next step in your career journey? Reach out for personalized guidance and support
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6" data-testid="text-contact-info-title">
                Contact Information
              </h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon
                  return (
                    <a
                      key={index}
                      href={info.action}
                      className="flex items-center space-x-4 p-4 rounded-lg hover-elevate transition-all duration-200 group"
                      data-testid={`link-contact-${index}`}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-lg flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/30 transition-all duration-200">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground" data-testid={`text-contact-label-${index}`}>
                          {info.label}
                        </p>
                        <p className="text-muted-foreground" data-testid={`text-contact-value-${index}`}>
                          {info.value}
                        </p>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6" data-testid="text-social-title">
                Follow Me
              </h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="icon"
                      className="rounded-full hover:scale-110 transition-transform duration-200"
                      onClick={() => handleSocialClick(social.label, social.url)}
                      data-testid={`button-social-${social.label.toLowerCase()}`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <Card className="p-6 bg-gradient-to-br from-accent/30 to-secondary/10 border-secondary/30">
              <h4 className="font-semibold text-foreground mb-4" data-testid="text-response-title">
                Quick Response Guarantee
              </h4>
              <p className="text-muted-foreground mb-4" data-testid="text-response-description">
                I personally respond to all inquiries within 24 hours. Your career journey is important to me.
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-secondary" data-testid="text-response-time">24hrs</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-response-label">Response Time</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary" data-testid="text-consultation-time">60min</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-consultation-label">Initial Consultation</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl" data-testid="text-form-title">
                Send a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                      className="rounded-lg"
                      data-testid="input-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                      className="rounded-lg"
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief subject of your inquiry"
                    className="rounded-lg"
                    data-testid="input-subject"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please describe how I can help you with your career goals..."
                    required
                    rows={5}
                    className="rounded-lg resize-none"
                    data-testid="input-message"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full rounded-full"
                  data-testid="button-send-message"
                >
                  Send Message
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}