import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  MessageCircle, 
  Briefcase, 
  FileText, 
  CreditCard, 
  Mail, 
  Download,
  LogOut,
  Settings
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Contact Inquiries",
    url: "/admin/contact",
    icon: Mail,
  },
  {
    title: "Testimonials",
    url: "/admin/testimonials",
    icon: MessageCircle,
  },
  {
    title: "Services",
    url: "/admin/services",
    icon: Briefcase,
  },
  {
    title: "Articles",
    url: "/admin/articles",
    icon: FileText,
  },
  {
    title: "Export Data",
    url: "/admin/export",
    icon: Download,
  },
  {
    title: "Payments",
    url: "/admin/payments",
    icon: CreditCard,
  },
];

export function AdminSidebar() {
  const [location, setLocation] = useLocation();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      setLocation("/admin/login");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Force redirect even if logout fails
      setLocation("/admin/login");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S+</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg">SKILL+</h2>
            <p className="text-sm text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <a 
                      href={item.url} 
                      onClick={(e) => {
                        e.preventDefault();
                        setLocation(item.url);
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <Button 
          variant="outline" 
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="w-full"
          data-testid="button-logout"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}