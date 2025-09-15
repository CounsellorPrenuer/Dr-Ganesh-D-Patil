import { Card } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import aboutImage from '@assets/generated_images/Dr._Patil_school_office_setting_89f1bb35.png'

export default function About() {
  const achievements = [
    "Principal & Pedagogical Leader",
    "Head of Training R&D",
    "NCC Senior Under Officer with 'C' Certificate",
    "Jalgaon to Ladakh Cycle Expedition Participant",
    "NSS Group Leader",
    "Academic Topper in English & Poetry",
    "Kabaddi & Cross Country Sports Background",
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

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Text Content */}
          <div className="space-y-6">
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

            <p className="text-lg text-foreground leading-relaxed">
              My diverse background includes being an NCC Senior Under Officer, participating in the challenging 
              Jalgaon to Ladakh Cycle Expedition, and serving as an NSS Group Leader with involvement in social 
              service activities including flood and earthquake relief efforts.
            </p>

            {/* Achievements */}
            <div className="grid md:grid-cols-2 gap-3 pt-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover-elevate">
                  <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span className="text-foreground text-sm font-medium" data-testid={`text-achievement-${index}`}>
                    {achievement}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center lg:justify-end">
            <Card className="p-6 hover-elevate max-w-md">
              <img
                src={aboutImage}
                alt="Dr. Ganesh D. Patil in Educational Leadership Role"
                className="w-full rounded-lg object-cover"
                data-testid="img-about-profile"
              />
              <div className="mt-4 text-center">
                <h3 className="font-semibold text-foreground" data-testid="text-about-image-title">
                  Educational Leadership
                </h3>
                <p className="text-sm text-muted-foreground mt-2" data-testid="text-about-image-subtitle">
                  Dedicated to innovative education and holistic student development
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}