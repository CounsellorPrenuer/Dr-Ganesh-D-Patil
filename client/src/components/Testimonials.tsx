import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const { elementRef: testimonialsRef, isVisible: testimonialsVisible } = useScrollAnimation()

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000) // Change testimonial every 4 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, isPaused, testimonials.length])

  // Pause auto-slide when section is not visible
  useEffect(() => {
    setIsPaused(!testimonialsVisible)
  }, [testimonialsVisible])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false) // Stop auto-play when user manually navigates
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume after 10 seconds
    console.log('Next testimonial clicked')
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false) // Stop auto-play when user manually navigates
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume after 10 seconds
    console.log('Previous testimonial clicked')
  }

  const goToTestimonial = (index: number) => {
    console.log(`Attempting to go to testimonial ${index}, current: ${currentIndex}`)
    setCurrentIndex(index)
    setIsAutoPlaying(false) // Stop auto-play when user manually navigates
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume after 10 seconds
    console.log(`Testimonial ${index} selected, state updated`)
  }

  return (
    <section 
      ref={testimonialsRef}
      id="testimonials" 
      className="py-20 gradient-bg-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-16 ${testimonialsVisible ? 'animate-fade-in-up' : 'scroll-hidden'}`}>
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4" data-testid="text-testimonials-title">
            Client Testimonials
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-testimonials-subtitle">
            Discover how our clients have transformed their careers and achieved their goals
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className={`relative max-w-4xl mx-auto ${testimonialsVisible ? 'animate-slide-in-scale stagger-1' : 'scroll-hidden'}`}>
          <Card className="p-8 md:p-12 text-center min-h-[300px] flex flex-col justify-center hover-lift smooth-all relative overflow-hidden">
            {/* Gradient border effect */}
            <div className="absolute inset-0 gradient-border opacity-20 rounded-lg"></div>
            
            <Quote className="h-12 w-12 text-secondary/50 mx-auto mb-6 animate-pulse-slow" />
            
            <CardContent className="space-y-6 relative z-10">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="h-5 w-5 fill-secondary text-secondary hover-scale-sm smooth-all"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>

              <blockquote className="text-lg md:text-xl text-foreground italic leading-relaxed smooth-all" data-testid="text-testimonial-content">
                "{testimonials[currentIndex].content}"
              </blockquote>

              <div className="smooth-all">
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
          <div className={`flex justify-between items-center mt-8 ${testimonialsVisible ? 'animate-fade-in-up stagger-2' : 'scroll-hidden'}`}>
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full hover-scale hover-glow smooth-all"
              data-testid="button-prev-testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Dots Indicator with Auto-play Indicator */}
            <div className="flex space-x-2 items-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log(`Dot ${index} clicked, current index: ${currentIndex}`)
                    goToTestimonial(index)
                  }}
                  className={`p-2 rounded-full smooth-all hover-scale-sm transition-all duration-200 ${
                    index === currentIndex 
                      ? 'bg-primary animate-pulse-slow' 
                      : 'bg-muted hover:bg-muted-foreground/50'
                  }`}
                  style={{
                    minWidth: '12px',
                    minHeight: '12px',
                    cursor: 'pointer'
                  }}
                  data-testid={`button-testimonial-dot-${index}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                >
                  <div className="w-3 h-3 rounded-full bg-current"></div>
                </button>
              ))}
              {/* Auto-play indicator */}
              <div className={`ml-4 w-2 h-2 rounded-full ${isAutoPlaying && !isPaused ? 'bg-secondary animate-pulse' : 'bg-muted'}`} 
                   title={isAutoPlaying && !isPaused ? 'Auto-playing' : 'Paused'}>
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full hover-scale hover-glow smooth-all"
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