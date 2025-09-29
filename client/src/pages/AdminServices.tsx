import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Eye, DollarSign, Clock, Users, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";

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

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(1, "Description is required").max(2000, "Description too long"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number"),
  duration: z.string().max(100, "Duration too long").optional(),
  features: z.string().optional(),
  active: z.boolean().default(true),
});

type ServiceForm = z.infer<typeof serviceSchema>;

export default function AdminServices() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ["/api/admin/services"],
  });

  const createForm = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "0",
      duration: "",
      features: "",
      active: true,
    },
  });

  const editForm = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
  });

  const createMutation = useMutation({
    mutationFn: async (data: ServiceForm) => {
      const serviceData = {
        ...data,
        features: data.features ? data.features.split('\n').filter(f => f.trim()) : null,
      };
      const response = await apiRequest("POST", "/api/admin/services", serviceData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setIsCreateDialogOpen(false);
      createForm.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ServiceForm }) => {
      const serviceData = {
        ...data,
        features: data.features ? data.features.split('\n').filter(f => f.trim()) : null,
      };
      const response = await apiRequest("PUT", `/api/admin/services/${id}`, serviceData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setEditingService(null);
      editForm.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/services/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const response = await apiRequest("PATCH", `/api/admin/services/${id}/toggle`, { active });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
  });

  const handleCreate = (data: ServiceForm) => {
    createMutation.mutate(data);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    editForm.reset({
      title: service.title,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration || "",
      features: service.features?.join('\n') || "",
      active: service.active,
    });
  };

  const handleUpdate = (data: ServiceForm) => {
    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (id: string, active: boolean) => {
    toggleActiveMutation.mutate({ id, active });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading services...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>
            Failed to load services. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const activeServices = services?.filter(s => s.active) || [];
  const inactiveServices = services?.filter(s => !s.active) || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-services-title">
            Services Management
          </h1>
          <p className="text-muted-foreground">
            Manage your consulting services and pricing
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" data-testid="text-total-services">
            {services?.length || 0} Total
          </Badge>
          <Badge variant="secondary" data-testid="text-active-services">
            {activeServices.length} Active
          </Badge>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-service">
                <Plus className="h-4 w-4 mr-1" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Service</DialogTitle>
                <DialogDescription>
                  Add a new consulting service with pricing and details
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-title">Service Title *</Label>
                    <Input
                      id="create-title"
                      data-testid="input-create-title"
                      {...createForm.register("title")}
                      placeholder="e.g., Career Strategy Consultation"
                    />
                    {createForm.formState.errors.title && (
                      <p className="text-sm text-destructive">
                        {createForm.formState.errors.title.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="create-duration">Duration</Label>
                    <Input
                      id="create-duration"
                      data-testid="input-create-duration"
                      {...createForm.register("duration")}
                      placeholder="e.g., 60 minutes"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-description">Description *</Label>
                  <Textarea
                    id="create-description"
                    data-testid="textarea-create-description"
                    {...createForm.register("description")}
                    placeholder="Detailed description of the service..."
                    rows={4}
                  />
                  {createForm.formState.errors.description && (
                    <p className="text-sm text-destructive">
                      {createForm.formState.errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-price">Price (₹) *</Label>
                    <Input
                      id="create-price"
                      type="number"
                      min="0"
                      step="1"
                      data-testid="input-create-price"
                      {...createForm.register("price")}
                      placeholder="2500"
                    />
                    {createForm.formState.errors.price && (
                      <p className="text-sm text-destructive">
                        {createForm.formState.errors.price.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="create-duration">Duration</Label>
                    <Input
                      id="create-duration"
                      data-testid="input-create-duration"
                      {...createForm.register("duration")}
                      placeholder="e.g., 60 minutes"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-features">Features (one per line)</Label>
                  <Textarea
                    id="create-features"
                    data-testid="textarea-create-features"
                    {...createForm.register("features")}
                    placeholder="Personalized assessment&#10;Career roadmap&#10;Industry insights"
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="create-active"
                    data-testid="switch-create-active"
                    checked={createForm.watch("active")}
                    onCheckedChange={(checked) => createForm.setValue("active", checked)}
                  />
                  <Label htmlFor="create-active">Active (visible to clients)</Label>
                </div>

                {createMutation.error && (
                  <Alert>
                    <AlertDescription data-testid="text-create-error">
                      {(createMutation.error as any)?.error || "Failed to create service. Please check your input and try again."}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center space-x-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending}
                    data-testid="button-submit-create"
                  >
                    {createMutation.isPending ? "Creating..." : "Create Service"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Active Services */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Services</h2>
        {activeServices.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeServices.map((service) => (
              <Card key={service.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg" data-testid={`text-title-${service.id}`}>
                        {service.title}
                      </CardTitle>
                      {service.category && (
                        <CardDescription>{service.category}</CardDescription>
                      )}
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <span>₹{service.price}</span>
                    </div>
                    {service.duration && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm line-clamp-3">{service.description}</p>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedService(service)}
                          data-testid={`button-view-${service.id}`}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Service Details</DialogTitle>
                        </DialogHeader>
                        {selectedService && (
                          <div className="space-y-6">
                            <div>
                              <h4 className="font-medium mb-2">{selectedService.title}</h4>
                              {selectedService.category && (
                                <p className="text-sm text-muted-foreground mb-2">{selectedService.category}</p>
                              )}
                              <p className="text-sm">{selectedService.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium">Price</p>
                                <p className="text-lg">₹{selectedService.price}</p>
                              </div>
                              {selectedService.duration && (
                                <div>
                                  <p className="text-sm font-medium">Duration</p>
                                  <p className="text-lg">{selectedService.duration}</p>
                                </div>
                              )}
                            </div>
                            {selectedService.features && selectedService.features.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Features</h4>
                                <ul className="text-sm space-y-1">
                                  {selectedService.features.map((feature, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      <span>{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(service)}
                      data-testid={`button-edit-${service.id}`}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(service.id, false)}
                      disabled={toggleActiveMutation.isPending}
                      data-testid={`button-deactivate-${service.id}`}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Deactivate
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${service.id}`}
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
                <Users className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-lg font-medium">No active services</p>
                <p className="text-muted-foreground">
                  Create your first service to get started
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Inactive Services */}
      {inactiveServices.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Inactive Services</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inactiveServices.map((service) => (
              <Card key={service.id} className="opacity-60">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      {service.category && (
                        <CardDescription>{service.category}</CardDescription>
                      )}
                    </div>
                    <Badge variant="outline" className="bg-gray-100 text-gray-600">
                      <XCircle className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <span>₹{service.price}</span>
                    </div>
                    {service.duration && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm line-clamp-3">{service.description}</p>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleToggleActive(service.id, true)}
                      disabled={toggleActiveMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Activate
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(service)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                      disabled={deleteMutation.isPending}
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

      {/* Edit Dialog */}
      <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update service details and pricing
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Service Title *</Label>
                <Input
                  id="edit-title"
                  {...editForm.register("title")}
                  placeholder="e.g., Career Strategy Consultation"
                />
                {editForm.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {editForm.formState.errors.title.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration</Label>
                <Input
                  id="edit-duration"
                  {...editForm.register("duration")}
                  placeholder="e.g., 60 minutes"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                {...editForm.register("description")}
                placeholder="Detailed description of the service..."
                rows={4}
              />
              {editForm.formState.errors.description && (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (₹) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="1"
                  {...editForm.register("price")}
                  placeholder="2500"
                />
                {editForm.formState.errors.price && (
                  <p className="text-sm text-destructive">
                    {editForm.formState.errors.price.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration</Label>
                <Input
                  id="edit-duration"
                  {...editForm.register("duration")}
                  placeholder="e.g., 60 minutes"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-features">Features (one per line)</Label>
              <Textarea
                id="edit-features"
                {...editForm.register("features")}
                placeholder="Personalized assessment&#10;Career roadmap&#10;Industry insights"
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-active"
                checked={editForm.watch("active")}
                onCheckedChange={(checked) => editForm.setValue("active", checked)}
              />
              <Label htmlFor="edit-active">Active (visible to clients)</Label>
            </div>

            {updateMutation.error && (
              <Alert>
                <AlertDescription>
                  {(updateMutation.error as any)?.error || "Failed to update service. Please check your input and try again."}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center space-x-2 pt-4">
              <Button 
                type="submit" 
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Updating..." : "Update Service"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setEditingService(null)}
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