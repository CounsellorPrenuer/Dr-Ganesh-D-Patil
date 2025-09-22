import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { Search, Filter, Download, Eye, RefreshCw, DollarSign } from 'lucide-react'
import { queryClient, apiRequest } from '@/lib/queryClient'

interface Payment {
  id: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  amount: string;
  currency: string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

interface Service {
  id: string;
  title: string;
  price: string;
}

export default function AdminPayments() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const { data: payments = [], isLoading, error } = useQuery<Payment[]>({
    queryKey: ["/api/admin/payments"],
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/admin/services"],
  });

  // Create a map for quick service lookup
  const serviceMap = services.reduce((acc, service) => {
    acc[service.id] = service;
    return acc;
  }, {} as Record<string, Service>);

  // Filter payments based on search and status
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: string, currency: string = 'INR') => {
    return `${currency === 'INR' ? '₹' : currency} ${parseFloat(amount).toLocaleString()}`;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      paid: 'default',
      failed: 'destructive',
      refunded: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/admin/payments"] });
    toast({
      title: "Refreshed",
      description: "Payment data has been refreshed",
    });
  };

  const handleExportPayments = () => {
    const csvContent = [
      ['ID', 'Customer Name', 'Email', 'Phone', 'Service', 'Amount', 'Status', 'Created At'],
      ...filteredPayments.map(payment => [
        payment.id,
        payment.customerName,
        payment.customerEmail,
        payment.customerPhone || '',
        serviceMap[payment.serviceId]?.title || 'Unknown Service',
        `${payment.amount} ${payment.currency}`,
        payment.status,
        formatDate(payment.createdAt)
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Payment data has been exported to CSV",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading payments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-destructive">Failed to load payments. Please try again.</p>
            <Button onClick={handleRefresh} variant="outline" className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    total: payments.length,
    paid: payments.filter(p => p.status === 'paid').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
    totalRevenue: payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0)
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
            Payment Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage all payment transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" data-testid="button-refresh">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportPayments} variant="outline" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Payments</CardTitle>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Successful</CardTitle>
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="text-2xl font-bold text-green-600">
              ₹{stats.totalRevenue.toLocaleString()}
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer name, email, or payment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  data-testid="input-search"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger data-testid="select-status-filter">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>
            {filteredPayments.length} of {payments.length} payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {payments.length === 0 ? 'No payments yet' : 'No payments match your search'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id} data-testid={`row-payment-${payment.id}`}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.customerName}</div>
                          <div className="text-sm text-muted-foreground">{payment.customerEmail}</div>
                          {payment.customerPhone && (
                            <div className="text-sm text-muted-foreground">{payment.customerPhone}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {serviceMap[payment.serviceId]?.title || 'Unknown Service'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {payment.serviceId}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatAmount(payment.amount, payment.currency)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(payment.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPayment(payment)}
                          data-testid={`button-view-${payment.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Details Dialog */}
      {selectedPayment && (
        <AlertDialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Payment Details</AlertDialogTitle>
              <AlertDialogDescription>
                Complete information for payment {selectedPayment.id}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {selectedPayment.customerName}</p>
                    <p><strong>Email:</strong> {selectedPayment.customerEmail}</p>
                    {selectedPayment.customerPhone && (
                      <p><strong>Phone:</strong> {selectedPayment.customerPhone}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Payment Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Amount:</strong> {formatAmount(selectedPayment.amount, selectedPayment.currency)}</p>
                    <p><strong>Status:</strong> {getStatusBadge(selectedPayment.status)}</p>
                    <p><strong>Service:</strong> {serviceMap[selectedPayment.serviceId]?.title || 'Unknown'}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Transaction Details</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Payment ID:</strong> {selectedPayment.id}</p>
                  {selectedPayment.razorpayOrderId && (
                    <p><strong>Razorpay Order ID:</strong> {selectedPayment.razorpayOrderId}</p>
                  )}
                  {selectedPayment.razorpayPaymentId && (
                    <p><strong>Razorpay Payment ID:</strong> {selectedPayment.razorpayPaymentId}</p>
                  )}
                  <p><strong>Created:</strong> {formatDate(selectedPayment.createdAt)}</p>
                  <p><strong>Updated:</strong> {formatDate(selectedPayment.updatedAt)}</p>
                </div>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}