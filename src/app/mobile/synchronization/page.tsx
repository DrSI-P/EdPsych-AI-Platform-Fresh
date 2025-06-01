'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Sync,
  Cloud,
  Database,
  ArrowUpDown,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { EnhancedAccessibilityWrapper } from '@/components/accessibility/enhanced-accessibility-components';

/**
 * Mobile App Synchronization Component
 * 
 * Provides a comprehensive interface for managing data synchronization
 * between the mobile app and the cloud platform.
 */
const MobileSynchronization: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState({
    lastSync: '2025-05-30T12:00:00Z',
    status: 'success',
    message: 'All data synchronized successfully',
    progress: 100
  });
  
  const [syncQueue, setSyncQueue] = useState([
    { id: 1, type: 'Assessment', title: 'Weekly Math Quiz', status: 'Pending', size: '0.5 MB' },
    { id: 2, type: 'Progress', title: 'Reading Module 3', status: 'Pending', size: '0.2 MB' },
    { id: 3, type: 'Content', title: 'Science: States of Matter', status: 'Pending', size: '18 MB' }
  ]);
  
  const [syncHistory, setSyncHistory] = useState([
    { id: 1, timestamp: '2025-05-29T15:30:00Z', status: 'success', items: 12, dataSize: '25 MB' },
    { id: 2, timestamp: '2025-05-28T09:45:00Z', status: 'partial', items: 8, dataSize: '15 MB', error: 'Network interrupted' },
    { id: 3, timestamp: '2025-05-27T14:20:00Z', status: 'success', items: 5, dataSize: '8 MB' }
  ]);
  
  const [syncSettings, setSyncSettings] = useState({
    autoSync: true,
    syncOnWifiOnly: true,
    syncFrequency: 'hourly',
    backgroundSync: true,
    syncMedia: true,
    syncAssessments: true,
    syncProgress: true
  });
  
  const [networkStatus, setNetworkStatus] = useState({
    online: true,
    connectionType: 'wifi',
    signalStrength: 'strong'
  });
  
  const [activeTab, setActiveTab] = useState('status');
  
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
  const startSync = () => {
    setSyncStatus({
      ...syncStatus,
      status: 'syncing',
      message: 'Synchronizing data...',
      progress: 0
    });
    
    // Simulate sync progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setSyncStatus(prev => ({
        ...prev,
        progress: progress
      }));
      
      if (progress >= 100) {
        clearInterval(interval);
        setSyncQueue([]);
        setSyncStatus({
          lastSync: new Date().toISOString(),
          status: 'success',
          message: 'All data synchronized successfully',
          progress: 100
        });
        
        // Add to sync history
        setSyncHistory([
          {
            id: syncHistory.length + 1,
            timestamp: new Date().toISOString(),
            status: 'success',
            items: syncQueue.length,
            dataSize: '19 MB'
          },
          ...syncHistory
        ]);
      }
    }, 500);
  };
  
  // Toggle sync setting
  const toggleSyncSetting = (setting: string) => {
    setSyncSettings({
      ...syncSettings,
      [setting]: !syncSettings[setting as keyof typeof syncSettings]
    });
  };
  
  // Update sync frequency
  const updateSyncFrequency = (frequency: string) => {
    setSyncSettings({
      ...syncSettings,
      syncFrequency: frequency
    });
  };
  
  // Simulate network change
  const toggleNetwork = () => {
    setNetworkStatus({
      ...networkStatus,
      online: !networkStatus.online,
      connectionType: networkStatus.online ? 'none' : 'wifi'
    });
  };
  
  return (
    <EnhancedAccessibilityWrapper>
      <main id="main-content" className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Data Synchronization</h1>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            {networkStatus.online ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600" />
            )}
            <span className="text-sm font-medium">
              {networkStatus.online ? 'Online' : 'Offline'}
              {networkStatus.online && ` (${networkStatus.connectionType}, ${networkStatus.signalStrength} signal)`}
            </span>
          </div>
          
          <Button variant="outline" size="sm" onClick={toggleNetwork}>
            {networkStatus.online ? 'Simulate Offline' : 'Simulate Online'}
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="status" className="flex items-center space-x-2">
              <Sync className="h-4 w-4" />
              <span>Sync Status</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-4">
            <Card>
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
                    onClick={startSync}
                    disabled={syncStatus.status === 'syncing' || !networkStatus.online}
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>{syncStatus.status === 'syncing' ? 'Syncing...' : 'Sync Now'}</span>
                  </Button>
                </div>
                
                {syncStatus.status === 'syncing' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Sync Progress</span>
                      <span>{syncStatus.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${syncStatus.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {syncQueue.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium mb-3">Pending Sync Items ({syncQueue.length})</h3>
                  <div className="space-y-3">
                    {syncQueue.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{item.title}</span>
                            <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                              {item.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                            <span>{item.type}</span>
                            <span>{item.size}</span>
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="sm" disabled={!networkStatus.online}>
                          Sync Now
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-3">Storage Usage</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Local Storage</span>
                    <span className="font-medium">285 MB of 1024 MB</span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: '28%' }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Cloud Storage</span>
                    <span className="font-medium">1.2 GB of 5 GB</span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: '24%' }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Sync History</h2>
            
            {syncHistory.length > 0 ? (
              <div className="space-y-4">
                {syncHistory.map(entry => (
                  <Card key={entry.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            {entry.status === 'success' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : entry.status === 'partial' ? (
                              <AlertTriangle className="h-4 w-4 text-amber-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            )}
                            <h3 className="font-medium">
                              Sync {entry.status === 'success' ? 'Completed' : entry.status === 'partial' ? 'Partially Completed' : 'Failed'}
                            </h3>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                            <span>{formatDate(entry.timestamp)}</span>
                            <span>{entry.items} items</span>
                            <span>{entry.dataSize}</span>
                          </div>
                          
                          {entry.error && (
                            <p className="text-xs text-red-600 mt-1">Error: {entry.error}</p>
                          )}
                        </div>
                        
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Sync History</h3>
                <p className="text-sm text-muted-foreground">
                  Your sync history will appear here.
                </p>
              </div>
            )}
            
            {syncHistory.length > 0 && (
              <Button variant="outline" className="w-full mt-4">
                View Full History
              </Button>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Sync Settings</h2>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-medium mb-3">Sync Behavior</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-sync" className="text-sm">Auto-sync</Label>
                      <input 
                        type="checkbox" 
                        id="auto-sync" 
                        checked={syncSettings.autoSync}
                        onChange={() => toggleSyncSetting('autoSync')}
                        className="h-4 w-4"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sync-wifi-only" className="text-sm">Sync on Wi-Fi only</Label>
                      <input 
                        type="checkbox" 
                        id="sync-wifi-only" 
                        checked={syncSettings.syncOnWifiOnly}
                        onChange={() => toggleSyncSetting('syncOnWifiOnly')}
                        disabled={!syncSettings.autoSync}
                        className="h-4 w-4"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="background-sync" className="text-sm">Background sync</Label>
                      <input 
                        type="checkbox" 
                        id="background-sync" 
                        checked={syncSettings.backgroundSync}
                        onChange={() => toggleSyncSetting('backgroundSync')}
                        disabled={!syncSettings.autoSync}
                        className="h-4 w-4"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sync-frequency" className="text-sm">Sync frequency</Label>
                      <select 
                        id="sync-frequency" 
                        value={syncSettings.syncFrequency}
                        onChange={(e) => updateSyncFrequency(e.target.value)}
                        disabled={!syncSettings.autoSync}
                        className="text-xs p-1 border rounded"
                      >
                        <option value="realtime">Real-time</option>
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="font-medium mb-3">Content to Sync</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sync-media" className="text-sm">Media Files</Label>
                      <input 
                        type="checkbox" 
                        id="sync-media" 
                        checked={syncSettings.syncMedia}
                        onChange={() => toggleSyncSetting('syncMedia')}
                        className="h-4 w-4"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sync-assessments" className="text-sm">Assessments & Quizzes</Label>
                      <input 
                        type="checkbox" 
                        id="sync-assessments" 
                        checked={syncSettings.syncAssessments}
                        onChange={() => toggleSyncSetting('syncAssessments')}
                        className="h-4 w-4"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sync-progress" className="text-sm">Learning Progress</Label>
                      <input 
                        type="checkbox" 
                        id="sync-progress" 
                        checked={syncSettings.syncProgress}
                        onChange={() => toggleSyncSetting('syncProgress')}
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Reset to Default Settings
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

export default MobileSynchronization;
