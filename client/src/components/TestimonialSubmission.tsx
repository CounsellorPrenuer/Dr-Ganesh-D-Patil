import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Star, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";

const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email address").max(255, "Email too long"),
  position: z.string().max(100, "Position too long").optional(),
  organization: z.string().max(100, "Organization too long").optional(),
  message: z.string().min(1, "Message is required").max(1000, "Message too long"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
});

type TestimonialForm = z.infer<typeof testimonialSchema>;

export default function TestimonialSubmission() {
  const [rating, setRating] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<TestimonialForm>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      email: "",
      position: "",
      organization: "",
      message: "",
      rating: 5,
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: TestimonialForm) => {
      const response = await apiRequest("POST", "/api/testimonials", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      setRating(5);
    },
  });

  const onSubmit = (data: TestimonialForm) => {
    submitMutation.mutate({
      ...data,
      rating,
    });
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-6 w-6 cursor-pointer transition-colors ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-200"
        }`}
        onClick={() => setRating(i + 1)}
        data-testid={`star-${i + 1}`}
      />
    ));
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <MessageSquare className="h-16 w-16 text-green-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-green-700">Thank You!</h3>
              <p className="text-lg">Your testimonial has been submitted successfully.</p>
              <p className="text-muted-foreground">
                It will be reviewed and published soon. We appreciate your feedback!
              </p>
            </div>
            <Button 
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              data-testid="button-submit-another"
            >
              Submit Another Testimonial
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Share Your Experience</CardTitle>
        <CardDescription className="text-center">
          Help others by sharing your experience with SKILL+ services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                data-testid="input-name"
                {...form.register("name")}
                placeholder="Your full name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                data-testid="input-email"
                {...form.register("email")}
                placeholder="your.email@example.com"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                data-testid="input-position"
                {...form.register("position")}
                placeholder="Your job title (optional)"
              />
              {form.formState.errors.position && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.position.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                data-testid="input-organization"
                {...form.register("organization")}
                placeholder="Your company/school (optional)"
              />
              {form.formState.errors.organization && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.organization.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex items-center space-x-1" data-testid="rating-stars">
              {renderStars()}
              <span className="ml-2 text-sm text-muted-foreground">
                ({rating}/5 stars)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Your Experience *</Label>
            <Textarea
              id="message"
              data-testid="textarea-message"
              {...form.register("message")}
              placeholder="Share your experience with SKILL+ services. What did you like most? How did it help you?"
              rows={6}
            />
            {form.formState.errors.message && (
              <p className="text-sm text-destructive">
                {form.formState.errors.message.message}
              </p>
            )}
          </div>

          {submitMutation.error && (
            <Alert>
              <AlertDescription data-testid="text-error">
                {(submitMutation.error as any)?.error || "Failed to submit testimonial. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            data-testid="button-submit-testimonial"
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? "Submitting..." : "Submit Testimonial"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}