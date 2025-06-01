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
 * Parent Portal LMS Integration Component
 * 
 * This component provides functionality for integrating the Parent Portal
 * with LMS platforms, enabling seamless parent access across systems.
 */
export function ParentPortalLMSIntegration() {
  const { t, currentLanguage } = useI18n();
  const { highContrast, fontSize } = useAccessibility();
  
  const [activeTab, setActiveTab] = useState('accounts');
  const [selectedPlatform, setSelectedPlatform] = useState<LMSPlatformType | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSyncDate, setLastSyncDate] = useState<Date | null>(null);
  
  // Sample integration data
  const [integrationData, setIntegrationData] = useState({
    accountLinking: {
      enabled: true,
      lastSyncDate: new Date(Date.now() - 86400000), // 1 day ago
      linkedAccounts: 128,
      syncDirection: 'bidirectional'
    },
    progressReports: {
      enabled: true,
      lastSyncDate: new Date(Date.now() - 172800000), // 2 days ago
      sharedReports: 56,
      syncDirection: 'export'
    },
    communication: {
      enabled: true,
      lastSyncDate: new Date(Date.now() - 259200000), // 3 days ago
      channels: 3,
      syncDirection: 'bidirectional'
    },
    calendar: {
      enabled: false,
      lastSyncDate: null,
      events: 0,
      syncDirection: 'bidirectional'
    },
    resources: {
      enabled: true,
      lastSyncDate: new Date(Date.now() - 345600000), // 4 days ago
      sharedResources: 42,
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
          lastSyncDate: new Date(),
          linkedAccounts: dataType === 'accountLinking' ? prev.accountLinking.linkedAccounts + Math.floor(Math.random() * 10) : prev.accountLinking.linkedAccounts,
          sharedReports: dataType === 'progressReports' ? prev.progressReports.sharedReports + Math.floor(Math.random() * 5) : prev.progressReports.sharedReports,
          sharedResources: dataType === 'resources' ? prev.resources.sharedResources + Math.floor(Math.random() * 8) : prev.resources.sharedResources,
          events: dataType === 'calendar' ? prev.calendar.events + Math.floor(Math.random() * 15) : prev.calendar.events
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
          <CardTitle>{t('parent_portal_integration', TranslationNamespace.INTEGRATION, { default: 'Parent Portal Integration' })}</CardTitle>
          <CardDescription>
            {t('parent_portal_integration_description', TranslationNamespace.INTEGRATION, { default: 'Connect parent portal with LMS parent/guardian accounts' })}
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
              <TabsTrigger value="accounts">{t('account_linking', TranslationNamespace.INTEGRATION, { default: 'Accounts' })}</TabsTrigger>
              <TabsTrigger value="reports">{t('progress_reports', TranslationNamespace.INTEGRATION, { default: 'Reports' })}</TabsTrigger>
              <TabsTrigger value="communication">{t('communication', TranslationNamespace.INTEGRATION, { default: 'Communication' })}</TabsTrigger>
              <TabsTrigger value="calendar">{t('calendar', TranslationNamespace.INTEGRATION, { default: 'Calendar' })}</TabsTrigger>
              <TabsTrigger value="resources">{t('resources', TranslationNamespace.INTEGRATION, { default: 'Resources' })}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="accounts" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('parent_account_linking', TranslationNamespace.INTEGRATION, { default: 'Parent Account Linking' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('account_linking_description', TranslationNamespace.INTEGRATION, { default: 'Connect EdPsych parent portal accounts with LMS parent/guardian accounts' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer mr-4">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={integrationData.accountLinking.enabled}
                      onChange={() => toggleEnabled('accountLinking')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">
                      {integrationData.accountLinking.enabled ? 
                        t('enabled', TranslationNamespace.INTEGRATION, { default: 'Enabled' }) : 
                        t('disabled', TranslationNamespace.INTEGRATION, { default: 'Disabled' })}
                    </span>
                  </label>
                  <Button 
                    onClick={() => handleSync('accountLinking')}
                    disabled={!integrationData.accountLinking.enabled || !selectedPlatform || syncStatus === 'syncing'}
                  >
                    {syncStatus === 'syncing' ? 
                      t('syncing', TranslationNamespace.INTEGRATION, { default: 'Syncing...' }) : 
                      t('sync_now', TranslationNamespace.INTEGRATION, { default: 'Sync Now' })}
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('last_sync', TranslationNamespace.INTEGRATION, { default: 'Last Synchronized' })}
                    </h4>
                    <p className="mt-1">{formatDate(integrationData.accountLinking.lastSyncDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('linked_accounts', TranslationNamespace.INTEGRATION, { default: 'Linked Accounts' })}
                    </h4>
                    <p className="mt-1">{integrationData.accountLinking.linkedAccounts.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('sync_direction', TranslationNamespace.INTEGRATION, { default: 'Sync Direction' })}
                    </h4>
                    <p className="mt-1">
                      {integrationData.accountLinking.syncDirection === 'bidirectional' ? 
                        t('bidirectional', TranslationNamespace.INTEGRATION, { default: 'Bidirectional' }) : 
                        t('export_only', TranslationNamespace.INTEGRATION, { default: 'Export Only' })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">
                  {t('account_linking_options', TranslationNamespace.INTEGRATION, { default: 'Account Linking Options' })}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="autoLinking" 
                      className="mr-2" 
                      defaultChecked 
                    />
                    <label htmlFor="autoLinking">
                      {t('auto_linking', TranslationNamespace.INTEGRATION, { default: 'Automatic account linking based on email address' })}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="singleSignOn" 
                      className="mr-2" 
                      defaultChecked 
                    />
                    <label htmlFor="singleSignOn">
                      {t('single_sign_on', TranslationNamespace.INTEGRATION, { default: 'Enable single sign-on between systems' })}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="profileSync" 
                      className="mr-2" 
                      defaultChecked 
                    />
                    <label htmlFor="profileSync">
                      {t('profile_sync', TranslationNamespace.INTEGRATION, { default: 'Synchronize profile information' })}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="gdprCompliance" 
                      className="mr-2" 
                      defaultChecked 
                    />
                    <label htmlFor="gdprCompliance">
                      {t('gdpr_compliance', TranslationNamespace.INTEGRATION, { default: 'GDPR-compliant data sharing' })}
                    </label>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('progress_reports', TranslationNamespace.INTEGRATION, { default: 'Progress Reports' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('progress_reports_description', TranslationNamespace.INTEGRATION, { default: 'Share comprehensive progress reports with parents via LMS' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer mr-4">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={integrationData.progressReports.enabled}
                      onChange={() => toggleEnabled('progressReports')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">
                      {integrationData.progressReports.enabled ? 
                        t('enabled', TranslationNamespace.INTEGRATION, { default: 'Enabled' }) : 
                        t('disabled', TranslationNamespace.INTEGRATION, { default: 'Disabled' })}
                    </span>
                  </label>
                  <Button 
                    onClick={() => handleSync('progressReports')}
                    disabled={!integrationData.progressReports.enabled || !selectedPlatform || syncStatus === 'syncing'}
                  >
                    {syncStatus === 'syncing' ? 
                      t('syncing', TranslationNamespace.INTEGRATION, { default: 'Syncing...' }) : 
                      t('sync_now', TranslationNamespace.INTEGRATION, { default: 'Sync Now' })}
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('last_sync', TranslationNamespace.INTEGRATION, { default: 'Last Synchronized' })}
                    </h4>
                    <p className="mt-1">{formatDate(integrationData.progressReports.lastSyncDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('shared_reports', TranslationNamespace.INTEGRATION, { default: 'Shared Reports' })}
                    </h4>
                    <p className="mt-1">{integrationData.progressReports.sharedReports.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('sync_direction', TranslationNamespace.INTEGRATION, { default: 'Sync Direction' })}
                    </h4>
                    <p className="mt-1">
                      {integrationData.progressReports.syncDirection === 'bidirectional' ? 
                        t('bidirectional', TranslationNamespace.INTEGRATION, { default: 'Bidirectional' }) : 
                        t('export_only', TranslationNamespace.INTEGRATION, { default: 'Export Only' })}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="communication" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('communication_channels', TranslationNamespace.INTEGRATION, { default: 'Communication Channels' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('communication_description', TranslationNamespace.INTEGRATION, { default: 'Integrate parent-teacher communication channels' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer mr-4">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={integrationData.communication.enabled}
                      onChange={() => toggleEnabled('communication')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">
                      {integrationData.communication.enabled ? 
                        t('enabled', TranslationNamespace.INTEGRATION, { default: 'Enabled' }) : 
                        t('disabled', TranslationNamespace.INTEGRATION, { default: 'Disabled' })}
                    </span>
                  </label>
                  <Button 
                    onClick={() => handleSync('communication')}
                    disabled={!integrationData.communication.enabled || !selectedPlatform || syncStatus === 'syncing'}
                  >
                    {syncStatus === 'syncing' ? 
                      t('syncing', TranslationNamespace.INTEGRATION, { default: 'Syncing...' }) : 
                      t('sync_now', TranslationNamespace.INTEGRATION, { default: 'Sync Now' })}
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('last_sync', TranslationNamespace.INTEGRATION, { default: 'Last Synchronized' })}
                    </h4>
                    <p className="mt-1">{formatDate(integrationData.communication.lastSyncDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('integrated_channels', TranslationNamespace.INTEGRATION, { default: 'Integrated Channels' })}
                    </h4>
                    <p className="mt-1">{integrationData.communication.channels.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('sync_direction', TranslationNamespace.INTEGRATION, { default: 'Sync Direction' })}
                    </h4>
                    <p className="mt-1">
                      {integrationData.communication.syncDirection === 'bidirectional' ? 
                        t('bidirectional', TranslationNamespace.INTEGRATION, { default: 'Bidirectional' }) : 
                        t('export_only', TranslationNamespace.INTEGRATION, { default: 'Export Only' })}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="calendar" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('event_calendar', TranslationNamespace.INTEGRATION, { default: 'Event Calendar' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('calendar_description', TranslationNamespace.INTEGRATION, { default: 'Sync school events and deadlines between systems' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer mr-4">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={integrationData.calendar.enabled}
                      onChange={() => toggleEnabled('calendar')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">
                      {integrationData.calendar.enabled ? 
                        t('enabled', TranslationNamespace.INTEGRATION, { default: 'Enabled' }) : 
                        t('disabled', TranslationNamespace.INTEGRATION, { default: 'Disabled' })}
                    </span>
                  </label>
                  <Button 
                    onClick={() => handleSync('calendar')}
                    disabled={!integrationData.calendar.enabled || !selectedPlatform || syncStatus === 'syncing'}
                  >
                    {syncStatus === 'syncing' ? 
                      t('syncing', TranslationNamespace.INTEGRATION, { default: 'Syncing...' }) : 
                      t('sync_now', TranslationNamespace.INTEGRATION, { default: 'Sync Now' })}
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('last_sync', TranslationNamespace.INTEGRATION, { default: 'Last Synchronized' })}
                    </h4>
                    <p className="mt-1">{formatDate(integrationData.calendar.lastSyncDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('synced_events', TranslationNamespace.INTEGRATION, { default: 'Synced Events' })}
                    </h4>
                    <p className="mt-1">{integrationData.calendar.events.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('sync_direction', TranslationNamespace.INTEGRATION, { default: 'Sync Direction' })}
                    </h4>
                    <p className="mt-1">
                      {integrationData.calendar.syncDirection === 'bidirectional' ? 
                        t('bidirectional', TranslationNamespace.INTEGRATION, { default: 'Bidirectional' }) : 
                        t('export_only', TranslationNamespace.INTEGRATION, { default: 'Export Only' })}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="resources" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('resource_access', TranslationNamespace.INTEGRATION, { default: 'Resource Access' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('resources_description', TranslationNamespace.INTEGRATION, { default: 'Manage parent access to educational resources across platforms' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer mr-4">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={integrationData.resources.enabled}
                      onChange={() => toggleEnabled('resources')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">
                      {integrationData.resources.enabled ? 
                        t('enabled', TranslationNamespace.INTEGRATION, { default: 'Enabled' }) : 
                        t('disabled', TranslationNamespace.INTEGRATION, { default: 'Disabled' })}
                    </span>
                  </label>
                  <Button 
                    onClick={() => handleSync('resources')}
                    disabled={!integrationData.resources.enabled || !selectedPlatform || syncStatus === 'syncing'}
                  >
                    {syncStatus === 'syncing' ? 
                      t('syncing', TranslationNamespace.INTEGRATION, { default: 'Syncing...' }) : 
                      t('sync_now', TranslationNamespace.INTEGRATION, { default: 'Sync Now' })}
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('last_sync', TranslationNamespace.INTEGRATION, { default: 'Last Synchronized' })}
                    </h4>
                    <p className="mt-1">{formatDate(integrationData.resources.lastSyncDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('shared_resources', TranslationNamespace.INTEGRATION, { default: 'Shared Resources' })}
                    </h4>
                    <p className="mt-1">{integrationData.resources.sharedResources.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('sync_direction', TranslationNamespace.INTEGRATION, { default: 'Sync Direction' })}
                    </h4>
                    <p className="mt-1">
                      {integrationData.resources.syncDirection === 'bidirectional' ? 
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
                {t('sync_successful_description', TranslationNamespace.INTEGRATION, { default: 'Data has been successfully synchronized with the LMS.' })}
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
