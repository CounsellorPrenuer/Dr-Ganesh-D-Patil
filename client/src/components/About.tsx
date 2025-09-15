import { Card } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import profileImage from '@assets/generated_images/Dr._Ganesh_Patil_headshot_8cee7046.png'

export default function About() {
  // todo: replace with actual achievements and credentials
  const achievements = [
    "15+ years in career counseling",
    "500+ successful career transitions",
    "Expert in educational leadership",
    "Certified skill development trainer",
    "Published researcher in career psychology"
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

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <p className="text-lg text-foreground leading-relaxed" data-testid="text-about-description">
              With over 15 years of experience in career counseling and educational leadership, 
              I have dedicated my career to helping individuals discover their true potential and 
              navigate their professional journey with confidence.
            </p>
            
            <p className="text-lg text-foreground leading-relaxed">
              My expertise spans across career guidance, institutional management, and comprehensive 
              skill development. I believe that every individual has unique strengths that, when properly 
              identified and nurtured, can lead to extraordinary achievements.
            </p>

            <p className="text-lg text-foreground leading-relaxed">
              Through SKILL+, I offer personalized counseling sessions, strategic consulting for 
              educational institutions, and practical skill training programs designed to bridge 
              the gap between potential and performance.
            </p>

            {/* Achievements */}
            <div className="space-y-3 pt-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground" data-testid={`text-achievement-${index}`}>
                    {achievement}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <Card className="p-6 hover-elevate">
              <img
                src={profileImage}
                alt="Dr. Ganesh D. Patil Professional Photo"
                className="w-full max-w-md rounded-lg object-cover"
                data-testid="img-about-profile"
              />
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}