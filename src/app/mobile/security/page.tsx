'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Lock,
  Shield,
  Fingerprint,
  Eye,
  EyeOff,
  Key,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { EnhancedAccessibilityWrapper } from '@/components/accessibility/enhanced-accessibility-components';

/**
 * Mobile App Security Component
 * 
 * Provides a comprehensive interface for managing security settings,
 * authentication methods, and data protection in the mobile application.
 */
const MobileSecurity: React.FC = () => {
  const [authMethod, setAuthMethod] = useState('biometric');
  const [pinEnabled, setPinEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [autoLockEnabled, setAutoLockEnabled] = useState(true);
  const [autoLockTime, setAutoLockTime] = useState('5');
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [secureDataEnabled, setSecureDataEnabled] = useState(true);
  const [remoteWipeEnabled, setRemoteWipeEnabled] = useState(false);
  
  const [securityStatus, setSecurityStatus] = useState({
    lastCheck: '2025-05-30T12:00:00Z',
    status: 'secure',
    issues: 0,
    recommendations: 1
  });
  
  const [activeTab, setActiveTab] = useState('authentication');
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Run security check
  const runSecurityCheck = () => {
    // Simulate security check
    setTimeout(() => {
      setSecurityStatus({
        lastCheck: new Date().toISOString(),
        status: 'secure',
        issues: 0,
        recommendations: remoteWipeEnabled ? 0 : 1
      });
    }, 1500);
  };
  
  return (
    <EnhancedAccessibilityWrapper>
      <main id="main-content" className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Security & Privacy</h1>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Security Status</h2>
                <p className="text-sm text-muted-foreground mb-1">
                  Last check: {formatDate(securityStatus.lastCheck)}
                </p>
                <div className="flex items-center space-x-2">
                  {securityStatus.status === 'secure' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  )}
                  <p className={`text-sm ${
                    securityStatus.status === 'secure' ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {securityStatus.status === 'secure' ? 'Your device is secure' : 'Security issues detected'}
                  </p>
                </div>
              </div>
              
              <Button 
                variant="outline"
                onClick={runSecurityCheck}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Check Now</span>
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{securityStatus.issues}</div>
                  <div className="text-xs text-muted-foreground">Issues</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{securityStatus.recommendations}</div>
                  <div className="text-xs text-muted-foreground">Recommendations</div>
                </div>
              </div>
              
              {securityStatus.issues > 0 || securityStatus.recommendations > 0 ? (
                <Button size="sm">Resolve All</Button>
              ) : (
                <div className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  All Secure
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="authentication" className="flex items-center space-x-2">
              <Fingerprint className="h-4 w-4" />
              <span>Authentication</span>
            </TabsTrigger>
            <TabsTrigger value="dataprotection" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Data Protection</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Privacy</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="authentication" className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Authentication Methods</h2>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-medium mb-3">Primary Authentication Method</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={authMethod === 'biometric' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAuthMethod('biometric')}
                      className="flex flex-col items-center py-3"
                    >
                      <Fingerprint className="h-5 w-5 mb-1" />
                      <span className="text-xs">Biometric</span>
                    </Button>
                    
                    <Button
                      variant={authMethod === 'pin' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAuthMethod('pin')}
                      className="flex flex-col items-center py-3"
                    >
                      <Key className="h-5 w-5 mb-1" />
                      <span className="text-xs">PIN</span>
                    </Button>
                    
                    <Button
                      variant={authMethod === 'password' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAuthMethod('password')}
                      className="flex flex-col items-center py-3"
                    >
                      <Lock className="h-5 w-5 mb-1" />
                      <span className="text-xs">Password</span>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pin-enabled" className="text-sm">App PIN</Label>
                    <input 
                      type="checkbox" 
                      id="pin-enabled" 
                      checked={pinEnabled}
                      onChange={() => setPinEnabled(!pinEnabled)}
                      className="h-4 w-4"
                    />
                  </div>
                  
                  {pinEnabled && (
                    <Button variant="outline" size="sm" className="w-full">
                      Change PIN
                    </Button>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="biometric-enabled" className="text-sm">Biometric Authentication</Label>
                    <input 
                      type="checkbox" 
                      id="biometric-enabled" 
                      checked={biometricEnabled}
                      onChange={() => setBiometricEnabled(!biometricEnabled)}
                      className="h-4 w-4"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-lock-enabled" className="text-sm">Auto-lock</Label>
                    <input 
                      type="checkbox" 
                      id="auto-lock-enabled" 
                      checked={autoLockEnabled}
                      onChange={() => setAutoLockEnabled(!autoLockEnabled)}
                      className="h-4 w-4"
                    />
                  </div>
                  
                  {autoLockEnabled && (
                    <div className="flex items-center justify-between pl-4">
                      <Label htmlFor="auto-lock-time" className="text-sm">Lock after inactivity</Label>
                      <select 
                        id="auto-lock-time" 
                        value={autoLockTime}
                        onChange={(e) => setAutoLockTime(e.target.value)}
                        className="text-xs p-1 border rounded"
                      >
                        <option value="1">1 minute</option>
                        <option value="5">5 minutes</option>
                        <option value="10">10 minutes</option>
                        <option value="30">30 minutes</option>
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Sign Out of All Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="dataprotection" className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Data Protection</h2>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-medium mb-3">Encryption & Security</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="encryption-enabled" className="text-sm">Encrypt Stored Data</Label>
                      <input 
                        type="checkbox" 
                        id="encryption-enabled" 
                        checked={encryptionEnabled}
                        onChange={() => setEncryptionEnabled(!encryptionEnabled)}
                        className="h-4 w-4"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="secure-data-enabled" className="text-sm">Secure Data Transfer</Label>
                      <input 
                        type="checkbox" 
                        id="secure-data-enabled" 
                        checked={secureDataEnabled}
                        onChange={() => setSecureDataEnabled(!secureDataEnabled)}
                        className="h-4 w-4"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="remote-wipe-enabled" className="text-sm">Remote Wipe</Label>
                      <input 
                        type="checkbox" 
                        id="remote-wipe-enabled" 
                        checked={remoteWipeEnabled}
                        onChange={() => setRemoteWipeEnabled(!remoteWipeEnabled)}
                        className="h-4 w-4"
                      />
                    </div>
                    
                    {!remoteWipeEnabled && securityStatus.recommendations > 0 && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-amber-800">Recommendation</p>
                            <p className="text-xs text-amber-700 mt-1">
                              Enable Remote Wipe to protect your data if your device is lost or stolen.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="font-medium mb-3">Data Management</h3>
                  <div className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full">
                      Backup App Data
                    </Button>
                    
                    <Button variant="outline" size="sm" className="w-full">
                      Restore from Backup
                    </Button>
                    
                    <Button variant="outline" size="sm" className="w-full text-red-600 hover:text-red-700">
                      Clear All App Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Privacy Settings</h2>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-medium mb-3">App Permissions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Camera</Label>
                        <p className="text-xs text-muted-foreground">For scanning QR codes and taking photos</p>
                      </div>
                      <select className="text-xs p-1 border rounded">
                        <option>Allow</option>
                        <option>Ask Every Time</option>
                        <option>Deny</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Microphone</Label>
                        <p className="text-xs text-muted-foreground">For voice input and recording</p>
                      </div>
                      <select className="text-xs p-1 border rounded">
                        <option>Allow</option>
                        <option>Ask Every Time</option>
                        <option>Deny</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Location</Label>
                        <p className="text-xs text-muted-foreground">For location-based content</p>
                      </div>
                      <select className="text-xs p-1 border rounded">
                        <option>Allow</option>
                        <option>Allow While Using</option>
                        <option>Ask Every Time</option>
                        <option>Deny</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium mb-3">Data Usage</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Analytics</Label>
                        <p className="text-xs text-muted-foreground">Help improve the app by sharing usage data</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Personalization</Label>
                        <p className="text-xs text-muted-foreground">Customize content based on your activity</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Third-Party Sharing</Label>
                        <p className="text-xs text-muted-foreground">Share data with trusted partners</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    Download My Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </EnhancedAccessibilityWrapper>
  );
};

export default MobileSecurity;
