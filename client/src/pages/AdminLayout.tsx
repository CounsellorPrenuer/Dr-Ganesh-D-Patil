import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();

  // Check if user is authenticated by trying to fetch admin data
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["/api/admin/stats"],
    retry: false,
  });

  useEffect(() => {
    // If we get a 401 error, redirect to login
    if (error && (error as any).message?.includes('401')) {
      setLocation("/admin/login");
    }
  }, [error, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error && (error as any).message?.includes('401')) {
    return null; // Will redirect via useEffect
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert className="max-w-md">
          <AlertDescription>
            Failed to load admin data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}