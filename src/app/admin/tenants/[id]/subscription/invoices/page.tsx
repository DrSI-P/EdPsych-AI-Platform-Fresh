'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  Download, 
  FileText, 
  Printer, 
  Search 
} from 'lucide-react';
import { 
  useTenantInvoices, 
  SubscriptionInvoice 
} from '@/lib/multi-tenant/subscription-management';
import { useTenant } from '@/lib/multi-tenant';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

/**
 * Subscription invoices page component
 * Displays all invoices for a tenant's subscription
 */
export default function SubscriptionInvoicesPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const tenantId = params.id;
  const { currentTenant } = useTenant();
  const { 
    invoices, 
    isLoading, 
    error, 
    getInvoiceDetails 
  } = useTenantInvoices(tenantId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState<SubscriptionInvoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<SubscriptionInvoice | null>(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  
  // Filter invoices based on search term
  useEffect(() => {
    if (!invoices) {
      setFilteredInvoices([]);
      return;
    }
    
    if (!searchTerm) {
      setFilteredInvoices(invoices);
      return;
    }
    
    const filtered = invoices.filter(invoice => 
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDate(invoice.createdAt).toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredInvoices(filtered);
  }, [invoices, searchTerm]);
  
  // Handle invoice selection for details view
  const handleViewInvoice = async (invoice: SubscriptionInvoice) => {
    setSelectedInvoice(invoice);
    setIsViewingDetails(true);
    
    // In a real implementation, you might want to fetch additional details
    // const details = await getInvoiceDetails(invoice.id);
    // setSelectedInvoice(details);
  };
  
  // Format currency for display
  const formatCurrency = (amount: number, currency: string = 'GBP') => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };
  
  // Get status badge for invoice
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'open':
        return <Badge className="bg-blue-500">Open</Badge>;
      case 'draft':
        return <Badge className="bg-gray-500">Draft</Badge>;
      case 'uncollectible':
        return <Badge className="bg-red-500">Uncollectible</Badge>;
      case 'void':
        return <Badge className="bg-gray-500">Void</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Invoices</h1>
          <p>Loading invoices...</p>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Invoices</h1>
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load invoices. Please try again later.
            </AlertDescription>
          </Alert>
          <Button 
            className="mt-4" 
            onClick={() => router.refresh()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  // Render no invoices state
  if (!invoices || invoices.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Invoices</h1>
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>No Invoices</CardTitle>
              <CardDescription>
                You don't have any invoices yet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Invoices will appear here once you have an active subscription.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => router.push(`/admin/tenants/${tenantId}/subscription`)}
              >
                Back to Subscription
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  // Render invoice details view
  if (isViewingDetails && selectedInvoice) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Invoice Details</h1>
            <p className="text-muted-foreground">
              Invoice #{selectedInvoice.number}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsViewingDetails(false)}
            >
              Back to Invoices
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open(selectedInvoice.pdfUrl, '_blank')}
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.print()}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Invoice #{selectedInvoice.number}</CardTitle>
                <CardDescription>
                  {formatDate(selectedInvoice.createdAt)}
                </CardDescription>
              </div>
              <div>
                {getStatusBadge(selectedInvoice.status)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">From</h3>
                  <p className="font-medium">EdPsych Connect</p>
                  <p>123 Education Street</p>
                  <p>London, UK</p>
                  <p>VAT: GB123456789</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">To</h3>
                  <p className="font-medium">{currentTenant?.name || 'Your Organization'}</p>
                  <p>Billing Address Line 1</p>
                  <p>Billing Address Line 2</p>
                  <p>VAT: {/* Tenant VAT number would go here */}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Invoice Details</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        Subscription - {currentTenant?.subscriptionTier || 'Standard Plan'}
                        <br />
                        <span className="text-sm text-muted-foreground">
                          Period: {formatDate(selectedInvoice.createdAt)} - {selectedInvoice.dueDate ? formatDate(selectedInvoice.dueDate) : 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(selectedInvoice.amount, selectedInvoice.currency)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-between items-center border-t pt-4">
                <div className="font-medium">Total</div>
                <div className="font-bold text-xl">
                  {formatCurrency(selectedInvoice.amount, selectedInvoice.currency)}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment Information</h3>
                <p>
                  Status: <span className="font-medium">{selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}</span>
                </p>
                {selectedInvoice.paidAt && (
                  <p>
                    Paid on: <span className="font-medium">{formatDate(selectedInvoice.paidAt)}</span>
                  </p>
                )}
                {selectedInvoice.dueDate && selectedInvoice.status === 'open' && (
                  <p>
                    Due date: <span className="font-medium">{formatDate(selectedInvoice.dueDate)}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Thank you for your business!
            </p>
            <div className="text-sm text-muted-foreground">
              Invoice ID: {selectedInvoice.id}
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Render invoices list
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">
            View and download your subscription invoices
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push(`/admin/tenants/${tenantId}/subscription`)}
        >
          Back to Subscription
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search invoices..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.number}</TableCell>
                  <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                  <TableCell>{formatCurrency(invoice.amount, invoice.currency)}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(invoice.pdfUrl, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredInvoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No invoices found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
