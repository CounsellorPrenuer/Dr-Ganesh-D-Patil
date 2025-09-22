import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Trash2, Eye, Calendar, User, Building, Phone, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  createdAt: string;
}

export default function AdminContact() {
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  const { data: inquiries, isLoading, error } = useQuery<ContactInquiry[]>({
    queryKey: ["/api/admin/contact-inquiries"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/contact-inquiries/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this contact inquiry?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEmailReply = (inquiry: ContactInquiry) => {
    const subject = inquiry.subject ? `Re: ${inquiry.subject}` : "Re: Your consultation request";
    const body = `Dear ${inquiry.name},\n\nThank you for reaching out to SKILL+.\n\n---\nOriginal Message:\n${inquiry.message}`;
    const mailtoUrl = `mailto:${inquiry.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading contact inquiries...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>
            Failed to load contact inquiries. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const recentInquiries = inquiries?.filter(
    inquiry => new Date(inquiry.createdAt).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000)
  ) || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-contact-title">
            Contact Management
          </h1>
          <p className="text-muted-foreground">
            Manage and respond to client inquiries
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" data-testid="text-total-inquiries">
            {inquiries?.length || 0} Total
          </Badge>
          <Badge variant="secondary" data-testid="text-recent-inquiries">
            {recentInquiries.length} This Week
          </Badge>
        </div>
      </div>

      {/* Contact Inquiries */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Inquiries</h2>
        {inquiries && inquiries.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inquiries.map((inquiry) => (
              <Card key={inquiry.id} className={recentInquiries.includes(inquiry) ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg" data-testid={`text-name-${inquiry.id}`}>
                        {inquiry.name}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{inquiry.email}</span>
                      </CardDescription>
                      {inquiry.phone && (
                        <CardDescription className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{inquiry.phone}</span>
                        </CardDescription>
                      )}
                    </div>
                    {recentInquiries.includes(inquiry) && (
                      <Badge variant="outline">New</Badge>
                    )}
                  </div>
                  {inquiry.subject && (
                    <div className="text-sm font-medium text-primary">
                      {inquiry.subject}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm line-clamp-3">{inquiry.message}</p>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Received {format(new Date(inquiry.createdAt), "MMM dd, yyyy 'at' HH:mm")}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedInquiry(inquiry)}
                          data-testid={`button-view-${inquiry.id}`}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Contact Inquiry Details</DialogTitle>
                          <DialogDescription>
                            Complete inquiry information and message
                          </DialogDescription>
                        </DialogHeader>
                        {selectedInquiry && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Contact Information</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span>{selectedInquiry.name}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{selectedInquiry.email}</span>
                                  </div>
                                  {selectedInquiry.phone && (
                                    <div className="flex items-center space-x-2">
                                      <Phone className="h-4 w-4 text-muted-foreground" />
                                      <span>{selectedInquiry.phone}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{format(new Date(selectedInquiry.createdAt), "MMMM dd, yyyy 'at' HH:mm")}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Inquiry Details</h4>
                                {selectedInquiry.subject && (
                                  <div className="mb-2">
                                    <span className="text-sm text-muted-foreground">Subject:</span>
                                    <p className="font-medium">{selectedInquiry.subject}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Message</h4>
                              <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm whitespace-pre-wrap">{selectedInquiry.message}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 pt-4 border-t">
                              <Button 
                                onClick={() => handleEmailReply(selectedInquiry)}
                                data-testid={`button-reply-${selectedInquiry.id}`}
                              >
                                <Mail className="h-4 w-4 mr-1" />
                                Reply via Email
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => window.open(`tel:${selectedInquiry.phone}`, '_self')}
                                disabled={!selectedInquiry.phone}
                              >
                                <Phone className="h-4 w-4 mr-1" />
                                Call
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      onClick={() => handleEmailReply(inquiry)}
                      data-testid={`button-reply-${inquiry.id}`}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(inquiry.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${inquiry.id}`}
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
                <Mail className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-lg font-medium">No contact inquiries yet</p>
                <p className="text-muted-foreground">
                  Contact inquiries from the website will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}