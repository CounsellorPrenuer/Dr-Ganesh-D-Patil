import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download, 
  FileText, 
  Database, 
  Calendar,
  Users,
  MessageSquare,
  Briefcase,
  FileEdit,
  CreditCard,
  Mail,
  CheckCircle2,
  AlertCircle,
  Info
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
// Removed date-fns dependency - using native Date methods

interface ExportOption {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
}

interface StatsData {
  totalTestimonials: number;
  approvedTestimonials: number;
  totalServices: number;
  activeServices: number;
  totalArticles: number;
  publishedArticles: number;
  totalPayments: number;
  totalContactInquiries: number;
}

export default function AdminExport() {
  const { toast } = useToast();
  const [selectedData, setSelectedData] = useState<string[]>([
    "contactInquiries", "testimonials", "services", "articles", "payments"
  ]);
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const { data: stats } = useQuery<StatsData>({
    queryKey: ["/api/admin/stats"],
  });

  const exportOptions: ExportOption[] = [
    {
      id: "contactInquiries",
      label: "Contact Inquiries",
      description: `All contact form submissions (${stats?.totalContactInquiries || 0} total)`,
      icon: Mail,
      enabled: true,
    },
    {
      id: "testimonials",
      label: "Testimonials",
      description: `User testimonials (${stats?.totalTestimonials || 0} total, ${stats?.approvedTestimonials || 0} approved)`,
      icon: MessageSquare,
      enabled: true,
    },
    {
      id: "services",
      label: "Services",
      description: `Service offerings (${stats?.totalServices || 0} total, ${stats?.activeServices || 0} active)`,
      icon: Briefcase,
      enabled: true,
    },
    {
      id: "articles",
      label: "Articles",
      description: `Knowledge articles (${stats?.totalArticles || 0} total, ${stats?.publishedArticles || 0} published)`,
      icon: FileEdit,
      enabled: true,
    },
    {
      id: "payments",
      label: "Payments",
      description: `Payment transactions (${stats?.totalPayments || 0} total)`,
      icon: CreditCard,
      enabled: true,
    },
  ];

  const handleExportOptionChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setSelectedData([...selectedData, optionId]);
    } else {
      setSelectedData(selectedData.filter(id => id !== optionId));
    }
  };

  const downloadExport = useMutation({
    mutationFn: async () => {
      setIsExporting(true);
      
      const params = new URLSearchParams();
      if (exportFormat) params.append("format", exportFormat);
      if (dateFrom) params.append("from", dateFrom);
      if (dateTo) params.append("to", dateTo);
      
      selectedData.forEach(dataType => {
        params.append("include", dataType);
      });

      // Use raw fetch instead of apiRequest for blob downloads
      const response = await fetch(`/api/admin/export?${params.toString()}`, {
        method: "GET",
        credentials: "include", // Include session cookies
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Export failed");
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      
      // Generate timestamp using native Date methods
      const now = new Date();
      const timestamp = now.toISOString().split('T')[0] + '_' + 
                       now.toTimeString().split(' ')[0].replace(/:/g, '-');
      const extension = exportFormat === "csv" ? "csv" : "json";
      a.download = `admin-data-export_${timestamp}.${extension}`;
      
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Export completed",
        description: "Your data has been successfully exported and downloaded.",
      });
      setIsExporting(false);
    },
    onError: (error) => {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      });
      setIsExporting(false);
    },
  });

  const handleSelectAll = () => {
    setSelectedData(exportOptions.map(option => option.id));
  };

  const handleSelectNone = () => {
    setSelectedData([]);
  };

  const canExport = selectedData.length > 0;

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight" data-testid="text-export-title">
          Data Export
        </h1>
        <p className="text-muted-foreground">
          Export your admin data for backup, analysis, or reporting purposes.
        </p>
      </div>

      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Overview</span>
          </CardTitle>
          <CardDescription>
            Current data counts across all system components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats?.totalContactInquiries || 0}</div>
              <div className="text-sm text-muted-foreground">Contact Inquiries</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats?.totalTestimonials || 0}</div>
              <div className="text-sm text-muted-foreground">Testimonials</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats?.totalServices || 0}</div>
              <div className="text-sm text-muted-foreground">Services</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats?.totalArticles || 0}</div>
              <div className="text-sm text-muted-foreground">Articles</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Data Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Select Data to Export</span>
            </CardTitle>
            <CardDescription>
              Choose which data types to include in your export
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Quick Selection */}
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSelectAll}
                data-testid="button-select-all"
              >
                Select All
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSelectNone}
                data-testid="button-select-none"
              >
                Select None
              </Button>
            </div>

            {/* Data Type Options */}
            <div className="space-y-3">
              {exportOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedData.includes(option.id);
                
                return (
                  <div
                    key={option.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg hover-elevate"
                  >
                    <Checkbox
                      id={option.id}
                      checked={isSelected}
                      onCheckedChange={(checked) => 
                        handleExportOptionChange(option.id, checked as boolean)
                      }
                      data-testid={`checkbox-export-${option.id}`}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <Label 
                          htmlFor={option.id} 
                          className="text-sm font-medium cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Export Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Export Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure export format and date filters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Export Format */}
            <div className="space-y-2">
              <Label htmlFor="export-format">Export Format</Label>
              <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as "json" | "csv")}>
                <SelectTrigger data-testid="select-export-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON (Structured Data)</SelectItem>
                  <SelectItem value="csv">CSV (Spreadsheet Compatible)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {exportFormat === "json" 
                  ? "JSON format preserves all data structure and relationships"
                  : "CSV format is ideal for spreadsheet analysis but may flatten complex data"
                }
              </p>
            </div>

            {/* Date Range Filters */}
            <div className="space-y-3">
              <Label className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Date Range Filter (Optional)</span>
              </Label>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="date-from" className="text-xs">From Date</Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    data-testid="input-date-from"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="date-to" className="text-xs">To Date</Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    data-testid="input-date-to"
                  />
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Leave empty to export all data regardless of date
              </p>
            </div>

            {/* Export Button */}
            <div className="pt-4">
              <Button
                onClick={() => downloadExport.mutate()}
                disabled={!canExport || isExporting}
                className="w-full"
                data-testid="button-download-export"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exporting..." : "Download Export"}
              </Button>
              
              {!canExport && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Please select at least one data type to export
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Data Privacy:</strong> Exported data contains sensitive information. 
            Store exported files securely and delete them when no longer needed.
          </AlertDescription>
        </Alert>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>File Size:</strong> Large exports may take time to generate. 
            Consider using date filters for very large datasets.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}