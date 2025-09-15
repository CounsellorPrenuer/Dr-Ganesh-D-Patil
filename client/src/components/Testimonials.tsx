import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { useState } from 'react'

export default function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      company: "Tech Solutions Inc.",
      content: "Dr. Patil's guidance was instrumental in helping me transition from teaching to tech. His strategic approach and personal attention made all the difference in my career transformation.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Principal",
      company: "Greenfield International School",
      content: "The school management consulting provided by Dr. Patil helped us improve our operational efficiency by 40%. His insights into educational leadership are truly valuable.",
      rating: 5
    },
    {
      name: "Anita Desai",
      role: "Marketing Manager",
      company: "Creative Agency",
      content: "The skill training workshops were exactly what I needed to advance in my career. Dr. Patil's teaching methodology is both practical and inspiring.",
      rating: 5
    },
    {
      name: "Vikram Singh",
      role: "MBA Graduate",
      company: "Top Business School",
      content: "Thanks to Dr. Patil's admission guidance, I got into my dream MBA program. His support throughout the application process was exceptional.",
      rating: 5
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    console.log('Next testimonial clicked')
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    console.log('Previous testimonial clicked')
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
    console.log(`Testimonial ${index} selected`)
  }

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-testimonials-title">
            Client Testimonials
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-testimonials-subtitle">
            Discover how our clients have transformed their careers and achieved their goals
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 text-center min-h-[300px] flex flex-col justify-center">
            <Quote className="h-12 w-12 text-primary/30 mx-auto mb-6" />
            
            <CardContent className="space-y-6">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>

              <blockquote className="text-lg md:text-xl text-foreground italic leading-relaxed" data-testid="text-testimonial-content">
                "{testimonials[currentIndex].content}"
              </blockquote>

              <div>
                <p className="font-semibold text-foreground text-lg" data-testid="text-testimonial-name">
                  {testimonials[currentIndex].name}
                </p>
                <p className="text-muted-foreground" data-testid="text-testimonial-role">
                  {testimonials[currentIndex].role}
                </p>
                <p className="text-sm text-muted-foreground" data-testid="text-testimonial-company">
                  {testimonials[currentIndex].company}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
              data-testid="button-prev-testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                  data-testid={`button-testimonial-dot-${index}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full"
              data-testid="button-next-testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {[
            { number: "500+", label: "Successful Clients" },
            { number: "15+", label: "Years Experience" },
            { number: "50+", label: "Institutions Served" },
            { number: "95%", label: "Success Rate" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2" data-testid={`text-stat-number-${index}`}>
                {stat.number}
              </p>
              <p className="text-muted-foreground" data-testid={`text-stat-label-${index}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}