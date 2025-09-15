import { Card } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import profileImage from '@assets/image_1757930432279.png'

export default function About() {
  const achievements = [
    "Principal & Pedagogical Leader",
    "Head of Training R&D",
    "Process Monitoring Expert",
    "Educational Innovation Specialist",
    "Value-Based Education Advocate",
    "187+ Professional Connections"
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
              Currently serving as Principal, Pedagogical Leader, and Resource Person at Sekaria Sushila Devi Public School, 
              Jalgaon, I bring extensive experience in educational leadership and innovative academic processes.
            </p>
            
            <p className="text-lg text-foreground leading-relaxed">
              As Head of Training R&D and Process Monitoring, I specialize in creating practical, innovative, 
              and learner-centered academic systems. My mission is to establish value-based education that 
              brings out the best in both staff and students.
            </p>

            <p className="text-lg text-foreground leading-relaxed">
              I focus on holistic development through integrated learning approaches, making sports and arts 
              part of everyday education while imbuing ethics and moral values to build future leaders.
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