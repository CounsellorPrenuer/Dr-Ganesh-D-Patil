import Header from '@/components/Header'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import HomePricing from '@/components/HomePricing'
import Testimonials from '@/components/Testimonials'
import Blog from '@/components/Blog'
import Contact from '@/components/Contact'
import MentoriaPartnership from '@/components/MentoriaPartnership'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <HomePricing />
        <Testimonials />
        <Blog />
        <Contact />
      </main>
      <MentoriaPartnership />
      <Footer />
    </div>
  )
}