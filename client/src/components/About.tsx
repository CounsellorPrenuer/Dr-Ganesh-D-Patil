import { Card } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import profileImage from '@assets/image_1757930432279.png'

export default function About() {
  const achievements = [
    "Certified Career Counsellor",
    "Sr. Academician & Principal",
    "School Management Consultant",
    "Professional Skill Trainer",
    "Content Writer & Expert"
  ]

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-about-title">
            About Me
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-about-subtitle">
            Dedicated to transforming careers and empowering individuals to reach their highest potential
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Text Content */}
          <div className="space-y-8 text-center">
            <p className="text-lg text-foreground leading-relaxed" data-testid="text-about-description">
              As a Career Counsellor, School Management Consultant, Sr. Academician, Skill Trainer, 
              and Content Writer, I bring comprehensive expertise to guide individuals and institutions 
              toward excellence.
            </p>
            
            <p className="text-lg text-foreground leading-relaxed">
              With my certification as a Career Counsellor and extensive experience in educational 
              leadership, I specialize in helping students, working professionals, and organizations 
              unlock their potential through strategic guidance and practical skill development.
            </p>

            <p className="text-lg text-foreground leading-relaxed">
              My mission is to bridge the gap between aspirations and achievements, providing 
              personalized support that transforms careers and enhances institutional effectiveness 
              across diverse sectors including schools, colleges, and corporate environments.
            </p>

            {/* Achievements */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-8">
              {achievements.map((achievement, index) => (
                <Card key={index} className="p-4 hover-elevate">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-foreground font-medium" data-testid={`text-achievement-${index}`}>
                      {achievement}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}