"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useI18n } from '@/components/i18n/i18n-provider';
import { TranslationNamespace } from '@/lib/i18n/types';
import { useAccessibility } from '@/components/accessibility/accessibility-provider';
import { LMSPlatformType } from '@/lib/integration/lms/types';

/**
 * Accessibility LMS Integration Component
 * 
 * This component provides functionality for synchronizing accessibility settings
 * between the EdPsych platform and integrated LMS platforms.
 */
export function AccessibilityLMSIntegration() {
  const { t, currentLanguage } = useI18n();
  const { highContrast, fontSize, reduceMotion, colorBlindMode } = useAccessibility();
  
  const [activeTab, setActiveTab] = useState('settings');
  const [selectedPlatform, setSelectedPlatform] = useState<LMSPlatformType | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSyncDate, setLastSyncDate] = useState<Date | null>(null);
  
  // Sample integration data
  const [integrationData, setIntegrationData] = useState({
    accessibilitySettings: {
      enabled: true,
      lastSyncDate: new Date(Date.now() - 86400000), // 1 day ago
      syncDirection: 'bidirectional'
    },
    contentDelivery: {
      enabled: true,
      lastSyncDate: new Date(Date.now() - 172800000), // 2 days ago
      syncDirection: 'export'
    },
    screenReader: {
      enabled: true,
      lastSyncDate: new Date(Date.now() - 259200000), // 3 days ago
      syncDirection: 'export'
    },
    visualSettings: {
      enabled: true,
      lastSyncDate: new Date(Date.now() - 345600000), // 4 days ago
      syncDirection: 'bidirectional'
    },
    keyboardNavigation: {
      enabled: false,
      lastSyncDate: null,
      syncDirection: 'export'
    }
  });
  
  // Sample connected platforms
  const [connectedPlatforms, setConnectedPlatforms] = useState([
    {
      id: '1',
      name: 'School Moodle',
      type: LMSPlatformType.MOODLE,
      status: 'active',
      lastSync: new Date(Date.now() - 86400000)
    },
    {
      id: '2',
      name: 'District Canvas',
      type: LMSPlatformType.CANVAS,
      status: 'active',
      lastSync: new Date(Date.now() - 172800000)
    }
  ]);
  
  // Handle sync action
  const handleSync = async (dataType: string) => {
    if (!selectedPlatform) {
      setErrorMessage(t('select_platform_first', TranslationNamespace.INTEGRATION, { default: 'Please select a platform first' }));
      return;
    }
    
    setSyncStatus('syncing');
    setErrorMessage(null);
    
    try {
      // Simulate API call to sync data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update last sync date
      setLastSyncDate(new Date());
      
      // Update integration data
      setIntegrationData(prev => ({
        ...prev,
        [dataType]: {
          ...prev[dataType as keyof typeof prev],
          lastSyncDate: new Date()
        }
      }));
      
      setSyncStatus('success');
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };
  
  // Toggle enabled status
  const toggleEnabled = (dataType: string) => {
    setIntegrationData(prev => ({
      ...prev,
      [dataType]: {
        ...prev[dataType as keyof typeof prev],
        enabled: !prev[dataType as keyof typeof prev].enabled
      }
    }));
  };
  
  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return t('never', TranslationNamespace.INTEGRATION, { default: 'Never' });
    return date.toLocaleDateString(currentLanguage, { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-6" style={{ fontSize: `${fontSize}%` }}>
      <Card className={highContrast ? 'border-white bg-black text-white' : ''}>
        <CardHeader>
          <CardTitle>{t('accessibility_integration', TranslationNamespace.INTEGRATION, { default: 'Accessibility Integration' })}</CardTitle>
          <CardDescription>
            {t('accessibility_integration_description', TranslationNamespace.INTEGRATION, { default: 'Synchronize accessibility settings between EdPsych Connect and your LMS' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {t('select_platform', TranslationNamespace.INTEGRATION, { default: 'Select Platform' })}
            </label>
            <div className="flex flex-wrap gap-2">
              {connectedPlatforms.map(platform => (
                <Button
                  key={platform.id}
                  variant={selectedPlatform === platform.type ? "default" : "outline"}
                  onClick={() => setSelectedPlatform(platform.type)}
                  className="flex items-center"
                >
                  {platform.name}
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    {t('active', TranslationNamespace.INTEGRATION, { default: 'Active' })}
                  </span>
                </Button>
              ))}
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="settings">{t('settings_sync', TranslationNamespace.INTEGRATION, { default: 'Settings' })}</TabsTrigger>
              <TabsTrigger value="content">{t('content_delivery', TranslationNamespace.INTEGRATION, { default: 'Content' })}</TabsTrigger>
              <TabsTrigger value="screenreader">{t('screen_reader', TranslationNamespace.INTEGRATION, { default: 'Screen Reader' })}</TabsTrigger>
              <TabsTrigger value="visual">{t('visual_settings', TranslationNamespace.INTEGRATION, { default: 'Visual' })}</TabsTrigger>
              <TabsTrigger value="keyboard">{t('keyboard_navigation', TranslationNamespace.INTEGRATION, { default: 'Keyboard' })}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('accessibility_settings_sync', TranslationNamespace.INTEGRATION, { default: 'Accessibility Settings Synchronization' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('settings_sync_description', TranslationNamespace.INTEGRATION, { default: 'Transfer user accessibility preferences between systems' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer mr-4">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={integrationData.accessibilitySettings.enabled}
                      onChange={() => toggleEnabled('accessibilitySettings')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">
                      {integrationData.accessibilitySettings.enabled ? 
                        t('enabled', TranslationNamespace.INTEGRATION, { default: 'Enabled' }) : 
                        t('disabled', TranslationNamespace.INTEGRATION, { default: 'Disabled' })}
                    </span>
                  </label>
                  <Button 
                    onClick={() => handleSync('accessibilitySettings')}
                    disabled={!integrationData.accessibilitySettings.enabled || !selectedPlatform || syncStatus === 'syncing'}
                  >
                    {syncStatus === 'syncing' ? 
                      t('syncing', TranslationNamespace.INTEGRATION, { default: 'Syncing...' }) : 
                      t('sync_now', TranslationNamespace.INTEGRATION, { default: 'Sync Now' })}
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('last_sync', TranslationNamespace.INTEGRATION, { default: 'Last Synchronized' })}
                    </h4>
                    <p className="mt-1">{formatDate(integrationData.accessibilitySettings.lastSyncDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('sync_direction', TranslationNamespace.INTEGRATION, { default: 'Sync Direction' })}
                    </h4>
                    <p className="mt-1">
                      {integrationData.accessibilitySettings.syncDirection === 'bidirectional' ? 
                        t('bidirectional', TranslationNamespace.INTEGRATION, { default: 'Bidirectional' }) : 
                        t('export_only', TranslationNamespace.INTEGRATION, { default: 'Export Only' })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">
                  {t('synced_settings', TranslationNamespace.INTEGRATION, { default: 'Synchronized Settings' })}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="syncFontSize" 
                      className="mr-2" 
                      defaultChecked 
                    />
                    <label htmlFor="syncFontSize">
                      {t('font_size', TranslationNamespace.INTEGRATION, { default: 'Font Size' })}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="syncHighContrast" 
                      className="mr-2" 
                      defaultChecked 
                    />
                    <label htmlFor="syncHighContrast">
                      {t('high_contrast', TranslationNamespace.INTEGRATION, { default: 'High Contrast Mode' })}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="syncReduceMotion" 
                      className="mr-2" 
                      defaultChecked 
                    />
                    <label htmlFor="syncReduceMotion">
                      {t('reduce_motion', TranslationNamespace.INTEGRATION, { default: 'Reduced Motion' })}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="syncColorBlind" 
                      className="mr-2" 
                      defaultChecked 
                    />
                    <label htmlFor="syncColorBlind">
                      {t('color_blind_mode', TranslationNamespace.INTEGRATION, { default: 'Color Blind Mode' })}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="syncFontFamily" 
                      className="mr-2" 
                      defaultChecked 
                    />
                    <label htmlFor="syncFontFamily">
                      {t('font_family', TranslationNamespace.INTEGRATION, { default: 'Font Family' })}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="syncLineSpacing" 
                      className="mr-2" 
                      defaultChecked 
                    />
                    <label htmlFor="syncLineSpacing">
                      {t('line_spacing', TranslationNamespace.INTEGRATION, { default: 'Line Spacing' })}
                    </label>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('accessible_content_delivery', TranslationNamespace.INTEGRATION, { default: 'Accessible Content Delivery' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('content_delivery_description', TranslationNamespace.INTEGRATION, { default: 'Ensure LMS-delivered content respects accessibility settings' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer mr-4">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={integrationData.contentDelivery.enabled}
                      onChange={() => toggleEnabled('contentDelivery')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">
                      {integrationData.contentDelivery.enabled ? 
                        t('enabled', TranslationNamespace.INTEGRATION, { default: 'Enabled' }) : 
                        t('disabled', TranslationNamespace.INTEGRATION, { default: 'Disabled' })}
                    </span>
                  </label>
                  <Button 
                    onClick={() => handleSync('contentDelivery')}
                    disabled={!integrationData.contentDelivery.enabled || !selectedPlatform || syncStatus === 'syncing'}
                  >
                    {syncStatus === 'syncing' ? 
                      t('syncing', TranslationNamespace.INTEGRATION, { default: 'Syncing...' }) : 
                      t('sync_now', TranslationNamespace.INTEGRATION, { default: 'Sync Now' })}
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('last_sync', TranslationNamespace.INTEGRATION, { default: 'Last Synchronized' })}
                    </h4>
                    <p className="mt-1">{formatDate(integrationData.contentDelivery.lastSyncDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('sync_direction', TranslationNamespace.INTEGRATION, { default: 'Sync Direction' })}
                    </h4>
                    <p className="mt-1">
                      {integrationData.contentDelivery.syncDirection === 'bidirectional' ? 
                        t('bidirectional', TranslationNamespace.INTEGRATION, { default: 'Bidirectional' }) : 
                        t('export_only', TranslationNamespace.INTEGRATION, { default: 'Export Only' })}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="screenreader" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('screen_reader_support', TranslationNamespace.INTEGRATION, { default: 'Screen Reader Support' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('screen_reader_description', TranslationNamespace.INTEGRATION, { default: 'Maintain screen reader support across platform boundaries' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer mr-4">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={integrationData.screenReader.enabled}
                      onChange={() => toggleEnabled('screenReader')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">
                      {integrationData.screenReader.enabled ? 
                        t('enabled', TranslationNamespace.INTEGRATION, { default: 'Enabled' }) : 
                        t('disabled', TranslationNamespace.INTEGRATION, { default: 'Disabled' })}
                    </span>
                  </label>
                  <Button 
                    onClick={() => handleSync('screenReader')}
                    disabled={!integrationData.screenReader.enabled || !selectedPlatform || syncStatus === 'syncing'}
                  >
                    {syncStatus === 'syncing' ? 
                      t('syncing', TranslationNamespace.INTEGRATION, { default: 'Syncing...' }) : 
                      t('sync_now', TranslationNamespace.INTEGRATION, { default: 'Sync Now' })}
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('last_sync', TranslationNamespace.INTEGRATION, { default: 'Last Synchronized' })}
                    </h4>
                    <p className="mt-1">{formatDate(integrationData.screenReader.lastSyncDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('sync_direction', TranslationNamespace.INTEGRATION, { default: 'Sync Direction' })}
                    </h4>
                    <p className="mt-1">
                      {integrationData.screenReader.syncDirection === 'bidirectional' ? 
                        t('bidirectional', TranslationNamespace.INTEGRATION, { default: 'Bidirectional' }) : 
                        t('export_only', TranslationNamespace.INTEGRATION, { default: 'Export Only' })}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="visual" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('visual_accessibility', TranslationNamespace.INTEGRATION, { default: 'Visual Accessibility' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('visual_accessibility_description', TranslationNamespace.INTEGRATION, { default: 'Preserve visual accessibility settings in LMS-embedded content' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer mr-4">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={integrationData.visualSettings.enabled}
                      onChange={() => toggleEnabled('visualSettings')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">
                      {integrationData.visualSettings.enabled ? 
                        t('enabled', TranslationNamespace.INTEGRATION, { default: 'Enabled' }) : 
                        t('disabled', TranslationNamespace.INTEGRATION, { default: 'Disabled' })}
                    </span>
                  </label>
                  <Button 
                    onClick={() => handleSync('visualSettings')}
                    disabled={!integrationData.visualSettings.enabled || !selectedPlatform || syncStatus === 'syncing'}
                  >
                    {syncStatus === 'syncing' ? 
                      t('syncing', TranslationNamespace.INTEGRATION, { default: 'Syncing...' }) : 
                      t('sync_now', TranslationNamespace.INTEGRATION, { default: 'Sync Now' })}
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('last_sync', TranslationNamespace.INTEGRATION, { default: 'Last Synchronized' })}
                    </h4>
                    <p className="mt-1">{formatDate(integrationData.visualSettings.lastSyncDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('sync_direction', TranslationNamespace.INTEGRATION, { default: 'Sync Direction' })}
                    </h4>
                    <p className="mt-1">
                      {integrationData.visualSettings.syncDirection === 'bidirectional' ? 
                        t('bidirectional', TranslationNamespace.INTEGRATION, { default: 'Bidirectional' }) : 
                        t('export_only', TranslationNamespace.INTEGRATION, { default: 'Export Only' })}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="keyboard" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('keyboard_navigation', TranslationNamespace.INTEGRATION, { default: 'Keyboard Navigation' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('keyboard_navigation_description', TranslationNamespace.INTEGRATION, { default: 'Ensure consistent keyboard navigation in cross-platform experiences' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer mr-4">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={integrationData.keyboardNavigation.enabled}
                      onChange={() => toggleEnabled('keyboardNavigation')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">
                      {integrationData.keyboardNavigation.enabled ? 
                        t('enabled', TranslationNamespace.INTEGRATION, { default: 'Enabled' }) : 
                        t('disabled', TranslationNamespace.INTEGRATION, { default: 'Disabled' })}
                    </span>
                  </label>
                  <Button 
                    onClick={() => handleSync('keyboardNavigation')}
                    disabled={!integrationData.keyboardNavigation.enabled || !selectedPlatform || syncStatus === 'syncing'}
                  >
                    {syncStatus === 'syncing' ? 
                      t('syncing', TranslationNamespace.INTEGRATION, { default: 'Syncing...' }) : 
                      t('sync_now', TranslationNamespace.INTEGRATION, { default: 'Sync Now' })}
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('last_sync', TranslationNamespace.INTEGRATION, { default: 'Last Synchronized' })}
                    </h4>
                    <p className="mt-1">{formatDate(integrationData.keyboardNavigation.lastSyncDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('sync_direction', TranslationNamespace.INTEGRATION, { default: 'Sync Direction' })}
                    </h4>
                    <p className="mt-1">
                      {integrationData.keyboardNavigation.syncDirection === 'bidirectional' ? 
                        t('bidirectional', TranslationNamespace.INTEGRATION, { default: 'Bidirectional' }) : 
                        t('export_only', TranslationNamespace.INTEGRATION, { default: 'Export Only' })}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {syncStatus === 'success' && (
            <Alert className="mt-6 bg-green-50 border-green-500 text-green-800">
              <AlertTitle>{t('sync_successful', TranslationNamespace.INTEGRATION, { default: 'Synchronization Successful' })}</AlertTitle>
              <AlertDescription>
                {t('sync_successful_description', TranslationNamespace.INTEGRATION, { default: 'Accessibility settings have been successfully synchronized with the LMS.' })}
                {lastSyncDate && (
                  <div className="mt-1">
                    {t('last_sync_time', TranslationNamespace.INTEGRATION, { default: 'Last sync:' })} {formatDate(lastSyncDate)}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          {syncStatus === 'error' && (
            <Alert variant="destructive" className="mt-6">
              <AlertTitle>{t('sync_error', TranslationNamespace.INTEGRATION, { default: 'Synchronization Error' })}</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
