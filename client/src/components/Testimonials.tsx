import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Link } from 'wouter'
import { imageUrl } from '@/lib/sanity'
import { useCms } from '@/hooks/useCms'

export default function Testimonials() {
  const { data } = useCms()
  const displayTestimonials = (data?.testimonials ?? []).map((t) => ({
    id: t._id,
    name: t.name,
    position: t.role,
    message: t.quote,
    rating: t.rating,
    image: t.image,
  }))

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const { elementRef: testimonialsRef, isVisible: testimonialsVisible } = useScrollAnimation()

  useEffect(() => {
    if (!isAutoPlaying || isPaused || displayTestimonials.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, isPaused, displayTestimonials.length])

  useEffect(() => {
    setIsPaused(!testimonialsVisible)
  }, [testimonialsVisible])

  if (displayTestimonials.length === 0) return null

  const current = displayTestimonials[currentIndex]

  return (
    <section id="testimonials" ref={testimonialsRef} className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">What People Say</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real stories from students, parents, and professionals who have benefited from our guidance
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Card className="border-l-4 border-l-primary shadow-lg">
            <CardContent className="p-8 md:p-12">
              <Quote className="h-10 w-10 text-primary/30 mb-6" />
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 italic">
                "{current.message}"
              </p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  {current.image && (
                    <img
                      src={imageUrl(current.image, 120)}
                      alt={current.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-lg">{current.name}</p>
                    <p className="text-muted-foreground">{current.position}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={() => setCurrentIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {displayTestimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-primary w-6' : 'bg-primary/30'}`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={() => setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/testimonials">
            <Button variant="outline" className="rounded-full">View All Testimonials</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
