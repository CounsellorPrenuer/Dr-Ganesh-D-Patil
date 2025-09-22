import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface Testimonial {
  id: string;
  name: string;
  email: string;
  position: string | null;
  organization: string | null;
  message: string;
  rating: number;
  approved: boolean;
  createdAt: string;
}

export default function Testimonials() {
  const { data: testimonials = [], isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  // Fallback testimonials in case backend is empty
  const fallbackTestimonials = [
    {
      id: "fallback-1",
      name: "Arjun Patel",
      position: "Engineering Student",
      organization: "IIT Bombay",
      message: "Dr. Patil's career counseling sessions were life-changing! His deep understanding of engineering streams and practical advice helped me choose Computer Science. Now I'm studying at my dream college. His NCC background really helped him understand discipline and goal-setting.",
      rating: 5
    },
    {
      id: "fallback-2",
      name: "Meera Joshi",
      position: "Vice Principal", 
      organization: "Modern English School, Pune",
      message: "As a fellow educator, I was impressed by Dr. Patil's pedagogical expertise. His school leadership consulting helped us implement new teaching methodologies that improved our student outcomes by 35%. His experience as Principal really shows!",
      rating: 5
    },
    {
      id: "fallback-3",
      name: "Rohit Deshmukh",
      position: "12th Grade Student",
      organization: "Jalgaon District",
      message: "I was confused about career options after 12th. Dr. Patil sir's guidance sessions helped me discover my interest in biotechnology. His personalized approach and knowledge of Maharashtra's education system made the process so much clearer. Highly recommended!",
      rating: 5
    }
  ];

  // Filter for approved testimonials only
  const approvedTestimonials = testimonials.filter(t => t.approved);
  
  // Use approved backend testimonials if available, otherwise fallback
  const displayTestimonials = approvedTestimonials.length > 0 ? approvedTestimonials : fallbackTestimonials;

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const { elementRef: testimonialsRef, isVisible: testimonialsVisible } = useScrollAnimation()

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying || isPaused || displayTestimonials.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length)
    }, 4000) // Change testimonial every 4 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, isPaused, displayTestimonials.length])

  // Pause auto-slide when section is not visible
  useEffect(() => {
    setIsPaused(!testimonialsVisible)
  }, [testimonialsVisible])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length)
    setIsAutoPlaying(false) // Stop auto-play when user manually navigates
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume after 10 seconds
    console.log('Next testimonial clicked')
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length)
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
              {isLoading ? (
                <div className="text-center text-muted-foreground">Loading testimonials...</div>
              ) : error ? (
                <Alert>
                  <AlertDescription>
                    Unable to load testimonials. Showing sample testimonials.
                  </AlertDescription>
                </Alert>
              ) : null}
              
              {displayTestimonials.length > 0 && (
                <>
                  <div className="flex justify-center mb-4">
                    {[...Array(displayTestimonials[currentIndex].rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-5 w-5 fill-secondary text-secondary hover-scale-sm smooth-all"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>

                  <p className="text-lg md:text-xl text-foreground leading-relaxed mb-6 italic relative z-10" data-testid={`text-testimonial-content-${currentIndex}`}>
                    "{displayTestimonials[currentIndex].message}"
                  </p>
                  
                  <div className="space-y-2 relative z-10">
                    <p className="font-semibold text-lg text-foreground" data-testid={`text-testimonial-name-${currentIndex}`}>
                      {displayTestimonials[currentIndex].name}
                    </p>
                    <p className="text-muted-foreground" data-testid={`text-testimonial-role-${currentIndex}`}>
                      {displayTestimonials[currentIndex].position && displayTestimonials[currentIndex].organization 
                        ? `${displayTestimonials[currentIndex].position} • ${displayTestimonials[currentIndex].organization}`
                        : displayTestimonials[currentIndex].position || displayTestimonials[currentIndex].organization || "SKILL+ Client"
                      }
                    </p>
                  </div>
                </>
              )}
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

            {/* Dots Indicator */}
            <div className="flex space-x-2 items-center">
              {displayTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentIndex 
                      ? 'bg-primary' 
                      : 'bg-muted hover:bg-muted-foreground/50'
                  }`}
                  data-testid={`button-testimonial-dot-${index}`}
                />
              ))}
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