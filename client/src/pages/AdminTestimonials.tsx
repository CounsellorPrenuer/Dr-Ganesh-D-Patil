import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Star, Check, Trash2, Eye, User } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

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

export default function AdminTestimonials() {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ["/api/admin/testimonials"],
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("PATCH", `/api/admin/testimonials/${id}/approve`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/testimonials/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
  });

  const handleApprove = (id: string) => {
    approveMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      deleteMutation.mutate(id);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading testimonials...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>
            Failed to load testimonials. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const pendingTestimonials = testimonials?.filter(t => !t.approved) || [];
  const approvedTestimonials = testimonials?.filter(t => t.approved) || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-testimonials-title">
            Testimonials Management
          </h1>
          <p className="text-muted-foreground">
            Review and manage customer testimonials
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" data-testid="text-total-testimonials">
            {testimonials?.length || 0} Total
          </Badge>
          <Badge variant="secondary" data-testid="text-pending-testimonials">
            {pendingTestimonials.length} Pending
          </Badge>
        </div>
      </div>

      {/* Pending Testimonials */}
      {pendingTestimonials.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pending Approval</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg" data-testid={`text-name-${testimonial.id}`}>
                        {testimonial.name}
                      </CardTitle>
                      {testimonial.position && testimonial.organization && (
                        <CardDescription>
                          {testimonial.position} at {testimonial.organization}
                        </CardDescription>
                      )}
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm line-clamp-3">{testimonial.message}</p>
                  <div className="text-xs text-muted-foreground">
                    Submitted on {format(new Date(testimonial.createdAt), "MMM dd, yyyy")}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTestimonial(testimonial)}
                          data-testid={`button-view-${testimonial.id}`}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Testimonial Details</DialogTitle>
                          <DialogDescription>
                            Review the complete testimonial before approving
                          </DialogDescription>
                        </DialogHeader>
                        {selectedTestimonial && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium">From: {selectedTestimonial.name}</h4>
                              <p className="text-sm text-muted-foreground">{selectedTestimonial.email}</p>
                              {selectedTestimonial.position && selectedTestimonial.organization && (
                                <p className="text-sm text-muted-foreground">
                                  {selectedTestimonial.position} at {selectedTestimonial.organization}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              {renderStars(selectedTestimonial.rating)}
                              <span className="text-sm ml-2">({selectedTestimonial.rating}/5)</span>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Message:</h4>
                              <p className="text-sm">{selectedTestimonial.message}</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(testimonial.id)}
                      disabled={approveMutation.isPending}
                      data-testid={`button-approve-${testimonial.id}`}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(testimonial.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${testimonial.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Approved Testimonials */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Approved Testimonials</h2>
        {approvedTestimonials.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {approvedTestimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {testimonial.name}
                      </CardTitle>
                      {testimonial.position && testimonial.organization && (
                        <CardDescription>
                          {testimonial.position} at {testimonial.organization}
                        </CardDescription>
                      )}
                    </div>
                    <Badge>Approved</Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm line-clamp-3">{testimonial.message}</p>
                  <div className="text-xs text-muted-foreground">
                    Approved on {format(new Date(testimonial.createdAt), "MMM dd, yyyy")}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTestimonial(testimonial)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Testimonial Details</DialogTitle>
                          <DialogDescription>
                            Approved testimonial details
                          </DialogDescription>
                        </DialogHeader>
                        {selectedTestimonial && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium">From: {selectedTestimonial.name}</h4>
                              <p className="text-sm text-muted-foreground">{selectedTestimonial.email}</p>
                              {selectedTestimonial.position && selectedTestimonial.organization && (
                                <p className="text-sm text-muted-foreground">
                                  {selectedTestimonial.position} at {selectedTestimonial.organization}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              {renderStars(selectedTestimonial.rating)}
                              <span className="text-sm ml-2">({selectedTestimonial.rating}/5)</span>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Message:</h4>
                              <p className="text-sm">{selectedTestimonial.message}</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(testimonial.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-2">
                <User className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-lg font-medium">No approved testimonials yet</p>
                <p className="text-muted-foreground">
                  Approved testimonials will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}