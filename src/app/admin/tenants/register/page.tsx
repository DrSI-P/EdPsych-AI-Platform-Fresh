'use client';

import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  TenantType, 
  SubscriptionTier,
  useTenantRegistration
} from '@/lib/multi-tenant';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define form schema
const tenantRegistrationSchema = z.object({
  name: z.string().min(3, {
    message: "Organization name must be at least 3 characters.",
  }).max(100, {
    message: "Organization name must be less than 100 characters.",
  }),
  type: z.nativeEnum(TenantType, {
    errorMap: () => ({ message: "Please select an organization type." }),
  }),
  adminEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  adminName: z.string().min(2, {
    message: "Admin name must be at least 2 characters.",
  }).max(100, {
    message: "Admin name must be less than 100 characters.",
  }),
  subscriptionTier: z.nativeEnum(SubscriptionTier, {
    errorMap: () => ({ message: "Please select a subscription tier." }),
  }),
  initialDomain: z.string().optional(),
});

/**
 * Tenant registration page component
 * Allows users to register a new tenant organization
 */
export default function TenantRegistrationPage() {
  const router = useRouter();
  const { registerTenant, isLoading, error } = useTenantRegistration();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  // Initialize form
  const form = useForm<z.infer<typeof tenantRegistrationSchema>>({
    resolver: zodResolver(tenantRegistrationSchema),
    defaultValues: {
      name: "",
      type: undefined,
      adminEmail: "",
      adminName: "",
      subscriptionTier: undefined,
      initialDomain: "",
    },
  });
  
  // Handle form submission
  const onSubmit = async (values: z.infer<typeof tenantRegistrationSchema>) => {
    try {
      const tenant = await registerTenant(values);
      setRegistrationSuccess(true);
      
      // Redirect to tenant setup page after a short delay
      setTimeout(() => {
        router.push(`/admin/tenants/${tenant.id}/setup`);
      }, 2000);
    } catch (error) {
      console.error('Error registering tenant:', error);
      // Error is handled by the useTenantRegistration hook
    }
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Register Your Organization</h1>
          <p className="text-muted-foreground mt-2">
            Create a new tenant organization to get started with EdPsych Connect
          </p>
        </div>
        
        {/* Success message */}
        {registrationSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700">Success</AlertTitle>
            <AlertDescription className="text-green-700">
              Your organization has been registered successfully! Redirecting to setup page...
            </AlertDescription>
          </Alert>
        )}
        
        {/* Error message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error.message || 'An error occurred during registration. Please try again.'}
            </AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
            <CardDescription>
              Provide information about your organization to create a new tenant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Organization Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter organization name" {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of your school, district, or organization
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Organization Type */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select organization type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={TenantType.SCHOOL}>School</SelectItem>
                            <SelectItem value={TenantType.DISTRICT}>District</SelectItem>
                            <SelectItem value={TenantType.ORGANIZATION}>Organization</SelectItem>
                            <SelectItem value={TenantType.INDEPENDENT}>Independent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The type of organization you are registering
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Admin Name */}
                  <FormField
                    control={form.control}
                    name="adminName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter admin name" {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of the primary administrator
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Admin Email */}
                  <FormField
                    control={form.control}
                    name="adminEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter admin email" type="email" {...field} />
                        </FormControl>
                        <FormDescription>
                          The email address of the primary administrator
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Subscription Tier */}
                  <FormField
                    control={form.control}
                    name="subscriptionTier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subscription Tier</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subscription tier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={SubscriptionTier.FREE}>Free</SelectItem>
                            <SelectItem value={SubscriptionTier.BASIC}>Basic</SelectItem>
                            <SelectItem value={SubscriptionTier.STANDARD}>Standard</SelectItem>
                            <SelectItem value={SubscriptionTier.PREMIUM}>Premium</SelectItem>
                            <SelectItem value={SubscriptionTier.ENTERPRISE}>Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The subscription tier for your organization
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Initial Domain (Optional) */}
                  <FormField
                    control={form.control}
                    name="initialDomain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domain (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="example.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your organization's domain for user authentication
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isLoading || registrationSuccess}
                  >
                    {isLoading ? 'Registering...' : 'Register Organization'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
