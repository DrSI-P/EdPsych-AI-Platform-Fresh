'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  AlertCircle, 
  Check, 
  Info, 
  MessageSquare, 
  Moon, 
  Save, 
  Settings, 
  Sun, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';

// This component will be the main engine for parent-teacher communication
// It will provide the core functionality that can be used across the platform

export function ParentTeacherCommunicationEngine() {
  const { data: session, status } = useSession();
  const [communicationSettings, setCommunicationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    autoTranslate: false,
    privacyMode: true,
    reminderFrequency: 'weekly',
    messageTemplate: true,
    readReceipts: true,
    urgentFlagging: true,
  });
  const [loading, setLoading] = useState(false);

  // Form schema for communication settings
  const formSchema = z.object({
    emailNotifications: z.boolean().default(true),
    smsNotifications: z.boolean().default(false),
    autoTranslate: z.boolean().default(false),
    privacyMode: z.boolean().default(true),
    reminderFrequency: z.string().default('weekly'),
    messageTemplate: z.boolean().default(true),
    readReceipts: z.boolean().default(true),
    urgentFlagging: z.boolean().default(true),
  });

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: communicationSettings,
  });

  // Fetch settings on component mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchCommunicationSettings();
    }
  }, [status]);

  // Fetch communication settings
  const fetchCommunicationSettings = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      setTimeout(() => {
        setCommunicationSettings({
          emailNotifications: true,
          smsNotifications: false,
          autoTranslate: false,
          privacyMode: true,
          reminderFrequency: 'weekly',
          messageTemplate: true,
          readReceipts: true,
          urgentFlagging: true,
        });
        form.reset({
          emailNotifications: true,
          smsNotifications: false,
          autoTranslate: false,
          privacyMode: true,
          reminderFrequency: 'weekly',
          messageTemplate: true,
          readReceipts: true,
          urgentFlagging: true,
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching communication settings:', error);
      toast.error('Failed to load communication settings');
      setLoading(false);
    }
  };

  // Save communication settings
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate a successful save
      setTimeout(() => {
        setCommunicationSettings(data);
        toast.success('Communication settings saved successfully');
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error saving communication settings:', error);
      toast.error('Failed to save communication settings');
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-centre">
          <MessageSquare className="mr-2 h-5 w-5" />
          Communication Engine
        </CardTitle>
        <CardDescription>
          Configure your communication preferences and settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Notification Status</h3>
              <div className="flex items-centre space-x-2">
                <Badge variant="outline" className="bg-green-50">
                  <Check className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-700">Active</span>
                </Badge>
                <Badge variant="outline" className="bg-blue-50">
                  <Info className="mr-1 h-3 w-3 text-blue-500" />
                  <span className="text-blue-700">Email Enabled</span>
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Quick Actions</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Settings className="mr-1 h-3 w-3" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <MessageSquare className="mr-1 h-3 w-3" />
                  New Message
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-centre justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Email Notifications</FormLabel>
                        <FormDescription className="text-xs">
                          Receive email alerts for new messages
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smsNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-centre justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>SMS Notifications</FormLabel>
                        <FormDescription className="text-xs">
                          Receive text alerts for urgent messages
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="privacyMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-centre justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Enhanced Privacy</FormLabel>
                        <FormDescription className="text-xs">
                          Hide sensitive information in previews
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="autoTranslate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-centre justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Auto-Translate</FormLabel>
                        <FormDescription className="text-xs">
                          Automatically translate messages
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <span className="flex items-centre">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-centre">
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 text-xs text-muted-foreground">
        <div className="flex items-centre">
          <AlertCircle className="mr-1 h-3 w-3" />
          <span>Communication settings apply to all parent-teacher interactions</span>
        </div>
      </CardFooter>
    </Card>
  );
}
