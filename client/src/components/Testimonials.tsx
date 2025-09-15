import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { useState } from 'react'

export default function Testimonials() {
  const testimonials = [
    {
      name: "Arjun Patel",
      role: "Engineering Student",
      company: "IIT Bombay",
      content: "Dr. Patil's career counseling sessions were life-changing! His deep understanding of engineering streams and practical advice helped me choose Computer Science. Now I'm studying at my dream college. His NCC background really helped him understand discipline and goal-setting.",
      rating: 5
    },
    {
      name: "Meera Joshi",
      role: "Vice Principal", 
      company: "Modern English School, Pune",
      content: "As a fellow educator, I was impressed by Dr. Patil's pedagogical expertise. His school leadership consulting helped us implement new teaching methodologies that improved our student outcomes by 35%. His experience as Principal really shows!",
      rating: 5
    },
    {
      name: "Rohit Deshmukh",
      role: "12th Grade Student",
      company: "Jalgaon District",
      content: "I was confused about career options after 12th. Dr. Patil sir's guidance sessions helped me discover my interest in biotechnology. His personalized approach and knowledge of Maharashtra's education system made the process so much clearer. Highly recommended!",
      rating: 5
    },
    {
      name: "Dr. Kavita Sharma",
      role: "College Administrator",
      company: "North Maharashtra University",
      content: "Dr. Patil's institutional development strategies have been invaluable for our college. His blend of traditional educational values with modern pedagogical approaches is exactly what today's institutions need. His expertise in educational leadership is outstanding.",
      rating: 5
    },
    {
      name: "Sachin More",
      role: "Working Professional",
      company: "Banking Sector, Mumbai",
      content: "After 5 years in banking, I wanted to shift to education. Dr. Patil's career transition guidance and skill development sessions helped me successfully move into teaching. His understanding of both sectors made the transition smooth and confident.",
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
            <Quote className="h-12 w-12 text-secondary/50 mx-auto mb-6" />
            
            <CardContent className="space-y-6">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
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
              <p className="text-3xl md:text-4xl font-bold text-secondary mb-2" data-testid={`text-stat-number-${index}`}>
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