import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube, Send } from "lucide-react";
import { Navigation } from "@/components/navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/config";
import { workerPost } from "@/lib/workerApi";

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openMailDraft = (name: string, email: string, phone: string, message: string) => {
    const subject = encodeURIComponent("Growth Platter Academy contact enquiry");
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\n\n${message}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = (formData.get("phone") as string) || "";
    const message = formData.get("message") as string;

    setIsSubmitting(true);
    try {
      await workerPost("/api/forms/submit", { name, email, phone, message });
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: "Could not send online",
        description: error instanceof Error ? error.message : "Opening email draft instead.",
        variant: "destructive",
      });
      openMailDraft(name, email, phone, message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <section className="py-16 bg-gradient-to-br from-primary/10 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 text-center">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-center">
              Have questions or ready to start your journey? We're here to help.
              Reach out to us through any of the following channels.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl mb-6">
                  Send us a Message
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          required
                          placeholder="Enter your name"
                          data-testid="input-name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="your@email.com"
                          data-testid="input-email"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 XXX XXX XXXX"
                          data-testid="input-phone"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          placeholder="How can we help you?"
                          className="min-h-32"
                          data-testid="input-message"
                        />
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="button-send-message">
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl mb-6">
                    Contact Information
                  </h2>
                  
                  <div className="space-y-4">
                    <Card className="hover-elevate transition-all">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Mail className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Email</CardTitle>
                            <a
                              href={`mailto:${CONTACT_EMAIL}`}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              {CONTACT_EMAIL}
                            </a>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>

                    <Card className="hover-elevate transition-all">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Phone className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Phone</CardTitle>
                            <a
                              href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              {CONTACT_PHONE}
                            </a>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>

                    <Card className="hover-elevate transition-all">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <MapPin className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Office Hours</CardTitle>
                            <p className="text-muted-foreground">
                              Mon - Sat: 9:00 AM - 6:00 PM
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-semibold text-xl mb-4">
                    Connect on Social Media
                  </h3>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12"
                      asChild
                      data-testid="link-facebook"
                    >
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12"
                      asChild
                      data-testid="link-instagram"
                    >
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12"
                      asChild
                      data-testid="link-linkedin"
                    >
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12"
                      asChild
                      data-testid="link-youtube"
                    >
                      <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Youtube className="h-5 w-5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
