import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, MessageCircle, Briefcase, FileText, CreditCard, TrendingUp, DollarSign, CheckCircle, Clock } from "lucide-react";
import { useLocation } from "wouter";

interface DashboardStats {
  totalTestimonials: number;
  pendingTestimonials: number;
  totalServices: number;
  activeServices: number;
  totalArticles: number;
  publishedArticles: number;
  totalPayments: number;
  successfulPayments: number;
  pendingPayments: number;
  totalRevenue: number;
  contactInquiries: number;
  recentInquiries: any[];
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
  });

  const handleExportData = async () => {
    try {
      const response = await fetch("/api/admin/export", {
        method: "GET",
        credentials: "include",
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'skillplus-data-export.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>
            Failed to load dashboard data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>No dashboard data available.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-dashboard-title">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of your SKILL+ platform
          </p>
        </div>
        <Button onClick={handleExportData} data-testid="button-export-data">
          Export All Data
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-revenue">
              ₹{stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From {stats.successfulPayments} successful payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-testimonials">
              {stats.totalTestimonials}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingTestimonials} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-services">
              {stats.totalServices}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.activeServices} active services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-articles">
              {stats.totalArticles}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedArticles} published
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Contact Inquiries</CardTitle>
            <CardDescription data-testid="text-contact-count">
              {stats.contactInquiries} total inquiries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recentInquiries.length > 0 ? (
              stats.recentInquiries.map((inquiry, index) => (
                <div key={inquiry.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{inquiry.name}</p>
                    <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                    <p className="text-sm">{inquiry.subject || "No subject"}</p>
                  </div>
                  <Badge variant="outline">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No recent inquiries</p>
            )}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setLocation("/admin/contact")}
              data-testid="button-view-all-inquiries"
            >
              View All Inquiries
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>Payment status overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Successful</span>
              </div>
              <Badge variant="secondary" data-testid="text-successful-payments">
                {stats.successfulPayments}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Pending</span>
              </div>
              <Badge variant="outline" data-testid="text-pending-payments">
                {stats.pendingPayments}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Total</span>
              </div>
              <Badge data-testid="text-total-payments">
                {stats.totalPayments}
              </Badge>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setLocation("/admin/payments")}
              data-testid="button-view-payments"
            >
              View All Payments
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}