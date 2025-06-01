'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Download,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpDown,
  BarChart
} from 'lucide-react';
import { EnhancedAccessibilityWrapper } from '@/components/accessibility/enhanced-accessibility-components';

/**
 * Mobile App Offline Learning Component
 * 
 * Provides a comprehensive interface for managing offline learning content,
 * progress tracking, and synchronization in the mobile application.
 */
const MobileOfflineLearning: React.FC = () => {
  const [downloadedContent, setDownloadedContent] = useState([
    { id: 1, title: 'Mathematics: Fractions', size: '15 MB', lastAccessed: '2 hours ago', progress: 65 },
    { id: 2, title: 'English: Reading Comprehension', size: '22 MB', lastAccessed: '1 day ago', progress: 80 },
    { id: 3, title: 'Science: States of Matter', size: '18 MB', lastAccessed: '3 days ago', progress: 40 }
  ]);
  
  const [pendingSync, setPendingSync] = useState([
    { id: 1, type: 'Assessment', title: 'Weekly Math Quiz', status: 'Completed offline', timestamp: '2025-05-30T14:30:00Z' },
    { id: 2, type: 'Progress', title: 'Reading Module 3', status: 'Progress updated offline', timestamp: '2025-05-30T15:45:00Z' }
  ]);
  
  const [syncStatus, setSyncStatus] = useState({
    lastSync: '2025-05-30T12:00:00Z',
    status: 'success',
    message: 'All content synchronized successfully'
  });
  
  const [activeTab, setActiveTab] = useState('downloaded');
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Calculate time since last sync
  const getTimeSinceLastSync = () => {
    const lastSync = new Date(syncStatus.lastSync);
    const now = new Date();
    const diffMs = now.getTime() - lastSync.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)} hours ago`;
    } else {
      return `${Math.floor(diffMins / 1440)} days ago`;
    }
  };
  
  // Simulate sync process
  const syncContent = () => {
    setSyncStatus({
      ...syncStatus,
      status: 'syncing',
      message: 'Synchronizing content...'
    });
    
    // Simulate sync delay
    setTimeout(() => {
      setPendingSync([]);
      setSyncStatus({
        lastSync: new Date().toISOString(),
        status: 'success',
        message: 'All content synchronized successfully'
      });
    }, 2000);
  };
  
  return (
    <EnhancedAccessibilityWrapper>
      <main id="main-content" className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Offline Learning</h1>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Sync Status</h2>
                <p className="text-sm text-muted-foreground mb-1">
                  Last synchronized: {getTimeSinceLastSync()}
                </p>
                <p className={`text-sm ${
                  syncStatus.status === 'success' ? 'text-green-600' : 
                  syncStatus.status === 'error' ? 'text-red-600' : 
                  'text-amber-600'
                }`}>
                  {syncStatus.message}
                </p>
              </div>
              
              <Button 
                onClick={syncContent}
                disabled={syncStatus.status === 'syncing' || pendingSync.length === 0}
                className="flex items-center space-x-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                <span>{syncStatus.status === 'syncing' ? 'Syncing...' : 'Sync Now'}</span>
              </Button>
            </div>
            
            {pendingSync.length > 0 && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <p className="text-sm font-medium text-amber-800">
                    {pendingSync.length} items pending synchronization
                  </p>
                </div>
                <ul className="text-xs text-amber-700 space-y-1">
                  {pendingSync.map(item => (
                    <li key={item.id}>
                      {item.type}: {item.title} - {item.status}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="downloaded" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Downloaded</span>
            </TabsTrigger>
            <TabsTrigger value="available" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Available</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center space-x-2">
              <BarChart className="h-4 w-4" />
              <span>Progress</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="downloaded" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Downloaded Content</h2>
              <Button variant="outline" size="sm">Manage Storage</Button>
            </div>
            
            {downloadedContent.length > 0 ? (
              <div className="space-y-4">
                {downloadedContent.map(content => (
                  <Card key={content.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{content.title}</h3>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                            <span>{content.size}</span>
                            <span>Last accessed: {content.lastAccessed}</span>
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{content.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${content.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Continue</Button>
                          <Button variant="ghost" size="sm">Remove</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Downloaded Content</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download content to access it offline.
                </p>
                <Button>Browse Available Content</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="available" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Available for Download</h2>
              <div className="flex items-center space-x-2">
                <Label htmlFor="subject-filter" className="text-sm">Filter:</Label>
                <select id="subject-filter" className="text-sm p-1 border rounded">
                  <option>All Subjects</option>
                  <option>Mathematics</option>
                  <option>English</option>
                  <option>Science</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">Mathematics: Geometry Basics</h3>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <span>25 MB</span>
                        <span>Key Stage 2</span>
                      </div>
                    </div>
                    
                    <Button size="sm" className="flex items-center space-x-1">
                      <Download className="h-3 w-3" />
                      <span>Download</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">English: Grammar and Punctuation</h3>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <span>18 MB</span>
                        <span>Key Stage 2</span>
                      </div>
                    </div>
                    
                    <Button size="sm" className="flex items-center space-x-1">
                      <Download className="h-3 w-3" />
                      <span>Download</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">Science: The Solar System</h3>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <span>32 MB</span>
                        <span>Key Stage 2</span>
                      </div>
                    </div>
                    
                    <Button size="sm" className="flex items-center space-x-1">
                      <Download className="h-3 w-3" />
                      <span>Download</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              Load More
            </Button>
          </TabsContent>
          
          <TabsContent value="progress" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Offline Progress</h2>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Last updated: {getTimeSinceLastSync()}</span>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Completed Activities</h3>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded-md">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Mathematics Quiz: Fractions</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Score: 85%</span>
                  </li>
                  
                  <li className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded-md">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>English: Reading Comprehension Exercise</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Score: 92%</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Learning Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Mathematics: Fractions</span>
                      <span>65% Complete</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: '65%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>English: Reading Comprehension</span>
                      <span>80% Complete</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: '80%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Science: States of Matter</span>
                      <span>40% Complete</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: '40%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center mt-4">
              <Button onClick={syncContent} disabled={syncStatus.status === 'syncing'}>
                {syncStatus.status === 'syncing' ? 'Syncing...' : 'Sync Progress Now'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </EnhancedAccessibilityWrapper>
  );
};

export default MobileOfflineLearning;
