import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DollarSign, Clock, CheckCircle, CreditCard, User, Phone, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  duration?: string | null;
  features?: string[] | null;
  active: boolean;
  createdAt: string;
}

const bookingSchema = z.object({
  customerName: z.string().min(1, "Name is required").max(100, "Name too long"),
  customerEmail: z.string().email("Invalid email address").max(255, "Email too long"),
  customerPhone: z.string().min(1, "Phone number is required").max(20, "Phone number too long"),
});

type BookingForm = z.infer<typeof bookingSchema>;

// Declare global Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Services() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [bookingService, setBookingService] = useState<Service | null>(null);

  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const bookingForm = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: BookingForm & { serviceId: string; amount: string; currency: string; status: string }) => {
      const response = await apiRequest("POST", "/api/payments/create-order", data);
      return response.json();
    },
  });

  const handleBookService = (service: Service) => {
    setBookingService(service);
    setIsBookingDialogOpen(true);
  };

  const handleBookingSubmit = async (data: BookingForm) => {
    if (!bookingService) return;

    try {
      const orderData = {
        ...data,
        serviceId: bookingService.id,
        amount: bookingService.price.toString(),
        currency: "INR",
        status: "pending" as const,
      };

      const response = await createOrderMutation.mutateAsync(orderData);
      const { payment, razorpayOrder, razorpayKeyId } = response;

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => openRazorpayCheckout(razorpayOrder.id, razorpayKeyId, data, payment.id);
        document.head.appendChild(script);
      } else {
        openRazorpayCheckout(razorpayOrder.id, razorpayKeyId, data, payment.id);
      }
    } catch (error) {
      console.error('Payment order creation failed:', error);
    }
  };

  const openRazorpayCheckout = (orderId: string, keyId: string, customerData: BookingForm, paymentId: string) => {
    if (!bookingService) return;

    const options = {
      key: keyId,
      amount: Math.round(parseFloat(bookingService.price) * 100), // Amount in paise
      currency: 'INR',
      name: 'SKILL+',
      description: bookingService.title,
      order_id: orderId,
      prefill: {
        name: customerData.customerName,
        email: customerData.customerEmail,
        contact: customerData.customerPhone,
      },
      theme: {
        color: '#3B82F6',
      },
      handler: async (response: any) => {
        try {
          // Verify payment on backend
          const verifyResponse = await apiRequest("POST", "/api/payments/verify", {
            payment_id: paymentId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyResponse.ok) {
            alert('Payment successful! You will receive a confirmation email shortly.');
            setIsBookingDialogOpen(false);
            bookingForm.reset();
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        } catch (error) {
          console.error('Payment verification failed:', error);
          alert('Payment verification failed. Please contact support.');
        }
      },
      modal: {
        ondismiss: () => {
          console.log('Payment cancelled by user');
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center p-8">
            <div className="text-lg">Loading services...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Alert>
            <AlertDescription>
              Failed to load services. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-services-title">
            Our Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional career counseling and guidance services to help you achieve your goals
          </p>
        </div>

        {services && services.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id} className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl" data-testid={`text-service-title-${service.id}`}>
                        {service.title}
                      </CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-lg">
                    <div className="flex items-center space-x-1 text-primary font-semibold">
                      <DollarSign className="h-5 w-5" />
                      <span data-testid={`text-service-price-${service.id}`}>₹{service.price}</span>
                    </div>
                    {service.duration && (
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  
                  {service.features && service.features.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-3">What's Included:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-auto space-y-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setSelectedService(service)}
                          data-testid={`button-view-details-${service.id}`}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{selectedService?.title}</DialogTitle>
                          <DialogDescription>
                            Complete service information and features
                          </DialogDescription>
                        </DialogHeader>
                        {selectedService && (
                          <div className="space-y-6">
                            <div>
                              <p className="text-sm mb-4">{selectedService.description}</p>
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-sm font-medium">Price</p>
                                  <p className="text-2xl font-bold text-primary">₹{selectedService.price}</p>
                                </div>
                                {selectedService.duration && (
                                  <div>
                                    <p className="text-sm font-medium">Duration</p>
                                    <p className="text-lg">{selectedService.duration}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            {selectedService.features && selectedService.features.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-3">What's Included:</h4>
                                <ul className="space-y-2">
                                  {selectedService.features.map((feature, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      <span className="text-sm">{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <Button 
                              className="w-full" 
                              onClick={() => {
                                handleBookService(selectedService);
                                setSelectedService(null);
                              }}
                            >
                              <CreditCard className="h-4 w-4 mr-2" />
                              Book Now - ₹{selectedService.price}
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => handleBookService(service)}
                      data-testid={`button-book-${service.id}`}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Book Now - ₹{service.price}
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
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-lg font-medium">No services available</p>
                <p className="text-muted-foreground">
                  Please check back later for available services
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Service</DialogTitle>
            <DialogDescription>
              {bookingService ? `Book ${bookingService.title} for ₹${bookingService.price}` : "Complete your booking"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={bookingForm.handleSubmit(handleBookingSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="customer-name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="customer-name"
                  data-testid="input-customer-name"
                  {...bookingForm.register("customerName")}
                  placeholder="Your full name"
                  className="pl-10"
                />
              </div>
              {bookingForm.formState.errors.customerName && (
                <p className="text-sm text-destructive">
                  {bookingForm.formState.errors.customerName.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customer-email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="customer-email"
                  type="email"
                  data-testid="input-customer-email"
                  {...bookingForm.register("customerEmail")}
                  placeholder="your.email@example.com"
                  className="pl-10"
                />
              </div>
              {bookingForm.formState.errors.customerEmail && (
                <p className="text-sm text-destructive">
                  {bookingForm.formState.errors.customerEmail.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customer-phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="customer-phone"
                  type="tel"
                  data-testid="input-customer-phone"
                  {...bookingForm.register("customerPhone")}
                  placeholder="+91 9876543210"
                  className="pl-10"
                />
              </div>
              {bookingForm.formState.errors.customerPhone && (
                <p className="text-sm text-destructive">
                  {bookingForm.formState.errors.customerPhone.message}
                </p>
              )}
            </div>

            {createOrderMutation.error && (
              <Alert>
                <AlertDescription data-testid="text-booking-error">
                  {(createOrderMutation.error as any)?.error || "Failed to create booking. Please try again."}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center space-x-2 pt-4">
              <Button 
                type="submit" 
                className="flex-1" 
                data-testid="button-proceed-payment"
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? "Processing..." : 
                  bookingService ? `Pay ₹${bookingService.price}` : "Proceed to Payment"
                }
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsBookingDialogOpen(false);
                  bookingForm.reset();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}