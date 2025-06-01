'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Download,
  Bell,
  RefreshCw,
  Settings,
  HardDrive,
  Lock
} from 'lucide-react';
import { EnhancedAccessibilityWrapper } from '@/components/accessibility/enhanced-accessibility-components';

/**
 * Mobile App Settings Component
 * 
 * Provides settings for the mobile application, including offline mode,
 * synchronization, notifications, and storage management.
 */
const MobileAppSettings: React.FC = () => {
  const [offlineMode, setOfflineMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [syncOnWifiOnly, setSyncOnWifiOnly] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [storageUsage, setStorageUsage] = useState({
    total: 1024, // MB
    used: 285, // MB
    breakdown: {
      content: 180,
      assessments: 65,
      media: 40
    }
  });
  
  return (
    <EnhancedAccessibilityWrapper>
      <main id="main-content" className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Mobile App Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <section aria-labelledby="offline-settings-heading">
              <h2 id="offline-settings-heading" className="text-xl font-semibold mb-4">Offline Access</h2>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {offlineMode ? <WifiOff className="h-5 w-5 text-primary" /> : <Wifi className="h-5 w-5 text-muted-foreground" />}
                      <Label htmlFor="offline-mode" className="font-medium">Offline Mode</Label>
                    </div>
                    <Switch
                      id="offline-mode"
                      checked={offlineMode}
                      onCheckedChange={setOfflineMode}
                    />
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Offline mode allows you to access content without an internet connection.
                    Downloaded content will be available even when you're offline.
                  </p>
                  
                  <div className="pt-2 space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center space-x-2"
                      disabled={!offlineMode}
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Content for Offline Use</span>
                    </Button>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-sync" className="text-sm">Auto-sync when online</Label>
                      <Switch
                        id="auto-sync"
                        checked={autoSync}
                        onCheckedChange={setAutoSync}
                        disabled={!offlineMode}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sync-wifi-only" className="text-sm">Sync on Wi-Fi only</Label>
                      <Switch
                        id="sync-wifi-only"
                        checked={syncOnWifiOnly}
                        onCheckedChange={setSyncOnWifiOnly}
                        disabled={!offlineMode || !autoSync}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
            
            <section aria-labelledby="notifications-heading">
              <h2 id="notifications-heading" className="text-xl font-semibold mb-4">Notifications</h2>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about assignments, messages, and important updates.
                  </p>
                  
                  {pushNotifications && (
                    <div className="pt-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="assignment-notifications" className="text-sm">Assignment Reminders</Label>
                        <Switch id="assignment-notifications" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="message-notifications" className="text-sm">New Messages</Label>
                        <Switch id="message-notifications" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="progress-notifications" className="text-sm">Progress Updates</Label>
                        <Switch id="progress-notifications" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="quiet-hours" className="text-sm">Quiet Hours</Label>
                        <div className="flex items-center space-x-2">
                          <select className="text-xs p-1 border rounded">
                            <option>10:00 PM</option>
                            <option>11:00 PM</option>
                            <option>12:00 AM</option>
                          </select>
                          <span className="text-xs">to</span>
                          <select className="text-xs p-1 border rounded">
                            <option>6:00 AM</option>
                            <option>7:00 AM</option>
                            <option>8:00 AM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
          
          <div className="space-y-8">
            <section aria-labelledby="storage-heading">
              <h2 id="storage-heading" className="text-xl font-semibold mb-4">Storage Management</h2>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="h-5 w-5 text-muted-foreground" />
                    <Label className="font-medium">Storage Usage</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Used Storage</span>
                      <span className="font-medium">{storageUsage.used} MB of {storageUsage.total} MB</span>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${(storageUsage.used / storageUsage.total) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="pt-2 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Learning Content</span>
                        <span>{storageUsage.breakdown.content} MB</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Assessments & Progress</span>
                        <span>{storageUsage.breakdown.assessments} MB</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Media Files</span>
                        <span>{storageUsage.breakdown.media} MB</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Clear Cache</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Manage Downloaded Content</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
            
            <section aria-labelledby="security-heading">
              <h2 id="security-heading" className="text-xl font-semibold mb-4">Security</h2>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <Label className="font-medium">Mobile App Security</Label>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Configure security settings for the mobile application.
                  </p>
                  
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="biometric-auth" className="text-sm">Biometric Authentication</Label>
                      <Switch id="biometric-auth" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-logout" className="text-sm">Auto-logout after inactivity</Label>
                      <Switch id="auto-logout" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="secure-storage" className="text-sm">Encrypt Stored Data</Label>
                      <Switch id="secure-storage" defaultChecked />
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <Lock className="h-4 w-4" />
                      <span>Change App PIN</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
        
        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
          <Button>
            Save Changes
          </Button>
        </div>
      </main>
    </EnhancedAccessibilityWrapper>
  );
};

export default MobileAppSettings;
