import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/AdminLogin";
import AdminLayout from "@/pages/AdminLayout";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminTestimonials from "@/pages/AdminTestimonials";
import AdminContact from "@/pages/AdminContact";
import AdminServices from "@/pages/AdminServices";
import AdminArticles from "@/pages/AdminArticles";
import AdminExport from "@/pages/AdminExport";
import Services from "@/pages/Services";
import Articles from "@/pages/Articles";
import ArticleDetail from "@/pages/ArticleDetail";
import SubmitTestimonial from "@/pages/SubmitTestimonial";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/articles" component={Articles} />
      <Route path="/articles/:id" component={ArticleDetail} />
      <Route path="/testimonial" component={SubmitTestimonial} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard">
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </Route>
      <Route path="/admin/testimonials">
        <AdminLayout>
          <AdminTestimonials />
        </AdminLayout>
      </Route>
      <Route path="/admin/services">
        <AdminLayout>
          <AdminServices />
        </AdminLayout>
      </Route>
      <Route path="/admin/articles">
        <AdminLayout>
          <AdminArticles />
        </AdminLayout>
      </Route>
      <Route path="/admin/export">
        <AdminLayout>
          <AdminExport />
        </AdminLayout>
      </Route>
      <Route path="/admin/payments">
        <AdminLayout>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Payments Management</h1>
            <p className="text-muted-foreground">Payments management coming soon...</p>
          </div>
        </AdminLayout>
      </Route>
      <Route path="/admin/contact">
        <AdminLayout>
          <AdminContact />
        </AdminLayout>
      </Route>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
