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
 * Language LMS Integration Component
 * 
 * This component provides functionality for synchronizing language preferences
 * between the EdPsych platform and integrated LMS platforms.
 */
export function LanguageLMSIntegration() {
  const { t, currentLanguage, availableLanguages, setLanguage } = useI18n();
  const { highContrast, fontSize } = useAccessibility();
  
  const [activeTab, setActiveTab] = useState('preferences');
  const [selectedPlatform, setSelectedPlatform] = useState<LMSPlatformType | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSyncDate, setLastSyncDate] = useState<Date | null>(null);
  
  // Sample integration data
  const [integrationData, setIntegrationData] = useState({
    languagePreferences: {
      enabled: true,
      lastSyncDate: new Date(Date.now() - 86400000), // 1 day ago
      syncDirection: 'bidirectional'
    },
    localizedContent: {
      enabled: true,
      lastSyncDate: new Date(Date.now() - 172800000), // 2 days ago
      syncDirection: 'export'
    },
    rtlSupport: {
      enabled: true,
      lastSyncDate: new Date(Date.now() - 259200000), // 3 days ago
      syncDirection: 'export'
    },
    ukTerminology: {
      enabled: true,
      lastSyncDate: new Date(Date.now() - 345600000), // 4 days ago
      syncDirection: 'bidirectional'
    },
    translationConsistency: {
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
          <CardTitle>{t('language_integration', TranslationNamespace.INTEGRATION, { default: 'Language Integration' })}</CardTitle>
          <CardDescription>
            {t('language_integration_description', TranslationNamespace.INTEGRATION, { default: 'Synchronize language preferences between EdPsych Connect and your LMS' })}
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
              <TabsTrigger value="preferences">{t('language_preferences', TranslationNamespace.INTEGRATION, { default: 'Preferences' })}</TabsTrigger>
              <TabsTrigger value="content">{t('localized_content', TranslationNamespace.INTEGRATION, { default: 'Content' })}</TabsTrigger>
              <TabsTrigger value="rtl">{t('rtl_support', TranslationNamespace.INTEGRATION, { default: 'RTL' })}</TabsTrigger>
              <TabsTrigger value="terminology">{t('uk_terminology', TranslationNamespace.INTEGRATION, { default: 'Terminology' })}</TabsTrigger>
              <TabsTrigger value="consistency">{t('translation_consistency', TranslationNamespace.INTEGRATION, { default: 'Consistency' })}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preferences" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('language_preferences_sync', TranslationNamespace.INTEGRATION, { default: 'Language Preferences Synchronization' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('preferences_sync_description', TranslationNamespace.INTEGRATION, { default: 'Share language preferences between EdPsych platform and LMS' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer mr-4">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={integrationData.languagePreferences.enabled}
                      onChange={() => toggleEnabled('languagePreferences')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">
                      {integrationData.languagePreferences.enabled ? 
                        t('enabled', TranslationNamespace.INTEGRATION, { default: 'Enabled' }) : 
                        t('disabled', TranslationNamespace.INTEGRATION, { default: 'Disabled' })}
                    </span>
                  </label>
                  <Button 
                    onClick={() => handleSync('languagePreferences')}
                    disabled={!integrationData.languagePreferences.enabled || !selectedPlatform || syncStatus === 'syncing'}
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
                    <p className="mt-1">{formatDate(integrationData.languagePreferences.lastSyncDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('sync_direction', TranslationNamespace.INTEGRATION, { default: 'Sync Direction' })}
                    </h4>
                    <p className="mt-1">
                      {integrationData.languagePreferences.syncDirection === 'bidirectional' ? 
                        t('bidirectional', TranslationNamespace.INTEGRATION, { default: 'Bidirectional' }) : 
                        t('export_only', TranslationNamespace.INTEGRATION, { default: 'Export Only' })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">
                  {t('supported_languages', TranslationNamespace.INTEGRATION, { default: 'Supported Languages' })}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {/* Sample languages - in a real implementation, this would come from availableLanguages */}
                  {['en-GB', 'cy', 'ur', 'pa', 'bn', 'pl', 'so', 'ar', 'fr', 'de'].map(lang => (
                    <div key={lang} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={`lang-${lang}`} 
                        className="mr-2" 
                        defaultChecked={['en-GB', 'cy', 'ur', 'pa', 'bn'].includes(lang)}
                      />
                      <label htmlFor={`lang-${lang}`}>
                        {lang === 'en-GB' ? 'English (UK)' :
                         lang === 'cy' ? 'Welsh' :
                         lang === 'ur' ? 'Urdu' :
                         lang === 'pa' ? 'Punjabi' :
                         lang === 'bn' ? 'Bengali' :
                         lang === 'pl' ? 'Polish' :
                         lang === 'so' ? 'Somali' :
                         lang === 'ar' ? 'Arabic' :
                         lang === 'fr' ? 'French' :
                         lang === 'de' ? 'German' : lang}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('localized_content_delivery', TranslationNamespace.INTEGRATION, { default: 'Localized Content Delivery' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('localized_content_description', TranslationNamespace.INTEGRATION, { default: 'Deliver appropriately localized content through LMS integration' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer mr-4">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={integrationData.localizedContent.enabled}
                      onChange={() => toggleEnabled('localizedContent')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">
                      {integrationData.localizedContent.enabled ? 
                        t('enabled', TranslationNamespace.INTEGRATION, { default: 'Enabled' }) : 
                        t('disabled', TranslationNamespace.INTEGRATION, { default: 'Disabled' })}
                    </span>
                  </label>
                  <Button 
                    onClick={() => handleSync('localizedContent')}
                    disabled={!integrationData.localizedContent.enabled || !selectedPlatform || syncStatus === 'syncing'}
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
                    <p className="mt-1">{formatDate(integrationData.localizedContent.lastSyncDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('sync_direction', TranslationNamespace.INTEGRATION, { default: 'Sync Direction' })}
                    </h4>
                    <p className="mt-1">
                      {integrationData.localizedContent.syncDirection === 'bidirectional' ? 
                        t('bidirectional', TranslationNamespace.INTEGRATION, { default: 'Bidirectional' }) : 
                        t('export_only', TranslationNamespace.INTEGRATION, { default: 'Export Only' })}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="rtl" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('rtl_language_support', TranslationNamespace.INTEGRATION, { default: 'RTL Language Support' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('rtl_support_description', TranslationNamespace.INTEGRATION, { default: 'Maintain right-to-left language support in LMS-embedded content' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer mr-4">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={integrationData.rtlSupport.enabled}
                      onChange={() => toggleEnabled('rtlSupport')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">
                      {integrationData.rtlSupport.enabled ? 
                        t('enabled', TranslationNamespace.INTEGRATION, { default: 'Enabled' }) : 
                        t('disabled', TranslationNamespace.INTEGRATION, { default: 'Disabled' })}
                    </span>
                  </label>
                  <Button 
                    onClick={() => handleSync('rtlSupport')}
                    disabled={!integrationData.rtlSupport.enabled || !selectedPlatform || syncStatus === 'syncing'}
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
                    <p className="mt-1">{formatDate(integrationData.rtlSupport.lastSyncDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('sync_direction', TranslationNamespace.INTEGRATION, { default: 'Sync Direction' })}
                    </h4>
                    <p className="mt-1">
                      {integrationData.rtlSupport.syncDirection === 'bidirectional' ? 
                        t('bidirectional', TranslationNamespace.INTEGRATION, { default: 'Bidirectional' }) : 
                        t('export_only', TranslationNamespace.INTEGRATION, { default: 'Export Only' })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">
                  {t('rtl_languages', TranslationNamespace.INTEGRATION, { default: 'RTL Languages' })}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['ar', 'ur', 'fa', 'he'].map(lang => (
                    <div key={lang} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={`rtl-${lang}`} 
                        className="mr-2" 
                        defaultChecked={['ar', 'ur'].includes(lang)}
                      />
                      <label htmlFor={`rtl-${lang}`}>
                        {lang === 'ar' ? 'Arabic' :
                         lang === 'ur' ? 'Urdu' :
                         lang === 'fa' ? 'Farsi' :
                         lang === 'he' ? 'Hebrew' : lang}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="terminology" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('uk_terminology_preservation', TranslationNamespace.INTEGRATION, { default: 'UK Terminology Preservation' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('uk_terminology_description', TranslationNamespace.INTEGRATION, { default: 'Ensure UK educational terminology is preserved across languages' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer mr-4">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={integrationData.ukTerminology.enabled}
                      onChange={() => toggleEnabled('ukTerminology')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">
                      {integrationData.ukTerminology.enabled ? 
                        t('enabled', TranslationNamespace.INTEGRATION, { default: 'Enabled' }) : 
                        t('disabled', TranslationNamespace.INTEGRATION, { default: 'Disabled' })}
                    </span>
                  </label>
                  <Button 
                    onClick={() => handleSync('ukTerminology')}
                    disabled={!integrationData.ukTerminology.enabled || !selectedPlatform || syncStatus === 'syncing'}
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
                    <p className="mt-1">{formatDate(integrationData.ukTerminology.lastSyncDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('sync_direction', TranslationNamespace.INTEGRATION, { default: 'Sync Direction' })}
                    </h4>
                    <p className="mt-1">
                      {integrationData.ukTerminology.syncDirection === 'bidirectional' ? 
                        t('bidirectional', TranslationNamespace.INTEGRATION, { default: 'Bidirectional' }) : 
                        t('export_only', TranslationNamespace.INTEGRATION, { default: 'Export Only' })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">
                  {t('uk_specific_terms', TranslationNamespace.INTEGRATION, { default: 'UK-Specific Terms' })}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">{t('uk_term', TranslationNamespace.INTEGRATION, { default: 'UK Term' })}</th>
                        <th className="text-left py-2">{t('preserve_in_translation', TranslationNamespace.INTEGRATION, { default: 'Preserve in Translation' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Key Stage</td>
                        <td className="py-2">
                          <input type="checkbox" defaultChecked />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">GCSE</td>
                        <td className="py-2">
                          <input type="checkbox" defaultChecked />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">A-Level</td>
                        <td className="py-2">
                          <input type="checkbox" defaultChecked />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">National Curriculum</td>
                        <td className="py-2">
                          <input type="checkbox" defaultChecked />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Ofsted</td>
                        <td className="py-2">
                          <input type="checkbox" defaultChecked />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="consistency" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('translation_consistency', TranslationNamespace.INTEGRATION, { default: 'Translation Consistency' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('consistency_description', TranslationNamespace.INTEGRATION, { default: 'Maintain consistent translations across platform boundaries' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer mr-4">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={integrationData.translationConsistency.enabled}
                      onChange={() => toggleEnabled('translationConsistency')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">
                      {integrationData.translationConsistency.enabled ? 
                        t('enabled', TranslationNamespace.INTEGRATION, { default: 'Enabled' }) : 
                        t('disabled', TranslationNamespace.INTEGRATION, { default: 'Disabled' })}
                    </span>
                  </label>
                  <Button 
                    onClick={() => handleSync('translationConsistency')}
                    disabled={!integrationData.translationConsistency.enabled || !selectedPlatform || syncStatus === 'syncing'}
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
                    <p className="mt-1">{formatDate(integrationData.translationConsistency.lastSyncDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('sync_direction', TranslationNamespace.INTEGRATION, { default: 'Sync Direction' })}
                    </h4>
                    <p className="mt-1">
                      {integrationData.translationConsistency.syncDirection === 'bidirectional' ? 
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
                {t('sync_successful_description', TranslationNamespace.INTEGRATION, { default: 'Language settings have been successfully synchronized with the LMS.' })}
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
