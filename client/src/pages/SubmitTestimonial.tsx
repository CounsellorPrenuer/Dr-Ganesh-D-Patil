import TestimonialSubmission from "@/components/TestimonialSubmission";

export default function SubmitTestimonial() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Share Your Experience
          </h1>
          <p className="text-xl text-muted-foreground">
            Help others discover the value of SKILL+ services by sharing your testimonial
          </p>
        </div>
        <TestimonialSubmission />
      </div>
    </div>
  );
}