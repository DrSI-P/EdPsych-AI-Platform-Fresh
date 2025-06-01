'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Download, WifiOff, CheckCircle } from 'lucide-react';
import { EnhancedAccessibilityWrapper } from '@/components/accessibility/enhanced-accessibility-components';

/**
 * Offline Page Component
 * 
 * This page is displayed when the user is offline and tries to access
 * content that isn't available in the cache. It provides information
 * about offline status and options for accessing available offline content.
 */
const OfflinePage: React.FC = () => {
  const [offlineContent, setOfflineContent] = useState<{
    title: string;
    type: string;
    lastAccessed: string;
  }[]>([]);
  
  useEffect(() => {
    // In a real implementation, this would fetch from IndexedDB
    // For now, we'll use mock data
    setOfflineContent([
      { 
        title: 'Mathematics: Fractions and Decimals', 
        type: 'lesson', 
        lastAccessed: '2025-05-30T14:30:00Z' 
      },
      { 
        title: 'English Literature: Shakespeare', 
        type: 'resource', 
        lastAccessed: '2025-05-29T10:15:00Z' 
      },
      { 
        title: 'Science: States of Matter', 
        type: 'interactive', 
        lastAccessed: '2025-05-28T16:45:00Z' 
      }
    ]);
  }, []);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <EnhancedAccessibilityWrapper>
      <main id="main-content" className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center text-center mb-8">
          <WifiOff className="h-16 w-16 text-amber-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">You're Offline</h1>
          <p className="text-lg text-muted-foreground max-w-md">
            It looks like you're not connected to the internet. Some features may be limited until you're back online.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Available Offline Content</h2>
              
              {offlineContent.length > 0 ? (
                <div className="space-y-4">
                  {offlineContent.map((content, index) => (
                    <div key={index} className="flex items-start p-3 bg-muted/30 rounded-md">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium">{content.title}</h3>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <span className="capitalize">{content.type}</span>
                          <span>Last accessed: {formatDate(content.lastAccessed)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Offline Content</h3>
                  <p className="text-sm text-muted-foreground">
                    You haven't downloaded any content for offline use yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Offline Tips</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-2 mr-3">
                    <Download className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Download Content</h3>
                    <p className="text-sm text-muted-foreground">
                      When online, download lessons and resources for offline access.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-2 mr-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Complete Offline Work</h3>
                    <p className="text-sm text-muted-foreground">
                      Your progress will be saved and synced when you're back online.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-2 mr-3">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Limited Features</h3>
                    <p className="text-sm text-muted-foreground">
                      Some features like real-time collaboration and video streaming require an internet connection.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  Check Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            When you're back online, you'll automatically be redirected to continue your learning journey.
          </p>
          <Button>
            Try Again
          </Button>
        </div>
      </main>
    </EnhancedAccessibilityWrapper>
  );
};

export default OfflinePage;
