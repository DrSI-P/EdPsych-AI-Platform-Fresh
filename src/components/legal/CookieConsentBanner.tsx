import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface CookieConsentBannerProps {
  onAccept: (preferences: CookiePreferences) => void;
  onReject: () => void;
  showBanner: boolean;
  initialPreferences?: CookiePreferences;
  isChild?: boolean;
}

export interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  educational: boolean;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onAccept,
  onReject,
  showBanner,
  initialPreferences,
  isChild = false,
}) => {
  const [preferences, setPreferences] = useState<CookiePreferences>(
    initialPreferences || {
      essential: true, // Essential cookies are always required
      functional: false,
      analytics: false,
      educational: false,
    }
  );

  const [activeTab, setActiveTab] = useState<string>('simple');

  if (!showBanner) {
    return null;
  }

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true,
      educational: true,
    };
    setPreferences(allAccepted);
    onAccept(allAccepted);
  };

  const handleAcceptSelected = () => {
    onAccept(preferences);
  };

  const handleReject = () => {
    const essentialOnly = {
      essential: true,
      functional: false,
      analytics: false,
      educational: false,
    };
    setPreferences(essentialOnly);
    onReject();
  };

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Essential cookies cannot be toggled
    
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg">
      <div className="max-w-7xl mx-auto">
        {isChild ? (
          // Child-friendly version with simpler language and visual cues
          <div className="bg-primary/10 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Cookies on EdPsych Connect</h2>
                <p className="mb-4">
                  We use cookies (small files stored on your device) to make our website work better for you. 
                  Some cookies are necessary for the website to work properly.
                </p>
                <p className="mb-4">
                  We'd also like to use cookies to:
                </p>
                <ul className="list-disc pl-5 mb-4 space-y-1">
                  <li>Remember your settings (like light or dark mode)</li>
                  <li>See how people use our website so we can make it better</li>
                  <li>Keep track of your learning progress</li>
                </ul>
                <p className="mb-4">
                  You can choose which cookies you're happy for us to use, or just use the necessary ones.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <Button 
                onClick={handleAcceptAll}
                variant="default"
                className="flex-1"
              >
                Allow all cookies
              </Button>
              <Button 
                onClick={handleReject}
                variant="outline"
                className="flex-1"
              >
                Only use necessary cookies
              </Button>
              <Button 
                onClick={() => setActiveTab('advanced')}
                variant="ghost"
                className="flex-1"
              >
                Let me choose
              </Button>
            </div>
          </div>
        ) : (
          // Standard version for adults
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Cookie Consent</h2>
                <p className="mb-4">
                  EdPsych Connect uses cookies to enhance your experience, analyze site usage, and assist in our educational services. 
                  We require your consent to use optional cookies.
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleReject}
                className="mt-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="simple">Simple View</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="simple">
                <p className="mb-4">
                  We use cookies for the following purposes:
                </p>
                <ul className="list-disc pl-5 mb-4 space-y-1">
                  <li><strong>Essential:</strong> Required for the website to function properly</li>
                  <li><strong>Functional:</strong> Enhance your experience by remembering your preferences</li>
                  <li><strong>Analytics:</strong> Help us understand how visitors use our site</li>
                  <li><strong>Educational:</strong> Track learning progress and personalize educational content</li>
                </ul>
                
                <div className="flex flex-wrap gap-2 mt-6">
                  <Button 
                    onClick={handleAcceptAll}
                    variant="default"
                    className="flex-1"
                  >
                    Accept All
                  </Button>
                  <Button 
                    onClick={handleReject}
                    variant="outline"
                    className="flex-1"
                  >
                    Reject Optional
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="advanced">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="font-medium">Essential Cookies</h3>
                      <p className="text-sm text-muted-foreground">Required for the website to function properly</p>
                    </div>
                    <Switch 
                      id="essential" 
                      checked={preferences.essential} 
                      disabled={true}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="font-medium">Functional Cookies</h3>
                      <p className="text-sm text-muted-foreground">Remember your preferences and settings</p>
                    </div>
                    <Switch 
                      id="functional" 
                      checked={preferences.functional} 
                      onCheckedChange={() => handleTogglePreference('functional')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="font-medium">Analytics Cookies</h3>
                      <p className="text-sm text-muted-foreground">Help us understand how visitors use our site</p>
                    </div>
                    <Switch 
                      id="analytics" 
                      checked={preferences.analytics} 
                      onCheckedChange={() => handleTogglePreference('analytics')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="font-medium">Educational Cookies</h3>
                      <p className="text-sm text-muted-foreground">Track learning progress and personalize educational content</p>
                    </div>
                    <Switch 
                      id="educational" 
                      checked={preferences.educational} 
                      onCheckedChange={() => handleTogglePreference('educational')}
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-6">
                  <Button 
                    onClick={handleAcceptSelected}
                    variant="default"
                    className="flex-1"
                  >
                    Save Preferences
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                For more information, please read our{' '}
                <a href="/legal/cookie-policy" className="text-primary hover:underline">
                  Cookie Policy
                </a>
                .
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
