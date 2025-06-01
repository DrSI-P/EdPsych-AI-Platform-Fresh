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
 * LMS Analytics Integration Component
 * 
 * This component provides functionality for bi-directional analytics data
 * exchange between the EdPsych platform and integrated LMS platforms.
 */
export function LMSAnalyticsIntegration() {
  const { t, currentLanguage } = useI18n();
  const { highContrast, fontSize } = useAccessibility();
  
  const [activeTab, setActiveTab] = useState('progress');
  const [selectedPlatform, setSelectedPlatform] = useState<LMSPlatformType | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSyncDate, setLastSyncDate] = useState<Date | null>(null);
  
  // Sample analytics data
  const [analyticsData, setAnalyticsData] = useState({
    progressData: {
      syncEnabled: true,
      lastSyncDate: new Date(Date.now() - 86400000), // 1 day ago
      dataPoints: 1245,
      syncDirection: 'bidirectional'
    },
    learningAnalytics: {
      syncEnabled: true,
      lastSyncDate: new Date(Date.now() - 172800000), // 2 days ago
      dataPoints: 876,
      syncDirection: 'export'
    },
    curriculumCoverage: {
      syncEnabled: true,
      lastSyncDate: new Date(Date.now() - 259200000), // 3 days ago
      dataPoints: 342,
      syncDirection: 'export'
    },
    assessmentData: {
      syncEnabled: true,
      lastSyncDate: new Date(Date.now() - 345600000), // 4 days ago
      dataPoints: 567,
      syncDirection: 'bidirectional'
    },
    engagementMetrics: {
      syncEnabled: false,
      lastSyncDate: null,
      dataPoints: 0,
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
      
      // Update analytics data
      setAnalyticsData(prev => ({
        ...prev,
        [dataType]: {
          ...prev[dataType as keyof typeof prev],
          lastSyncDate: new Date(),
          dataPoints: prev[dataType as keyof typeof prev].dataPoints + Math.floor(Math.random() * 50)
        }
      }));
      
      setSyncStatus('success');
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };
  
  // Toggle sync enabled status
  const toggleSyncEnabled = (dataType: string) => {
    setAnalyticsData(prev => ({
      ...prev,
      [dataType]: {
        ...prev[dataType as keyof typeof prev],
        syncEnabled: !prev[dataType as keyof typeof prev].syncEnabled
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
          <CardTitle>{t('analytics_integration', TranslationNamespace.INTEGRATION, { default: 'Analytics Integration' })}</CardTitle>
          <CardDescription>
            {t('analytics_integration_description', TranslationNamespace.INTEGRATION, { default: 'Manage analytics data exchange between EdPsych Connect and your LMS' })}
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
              <TabsTrigger value="progress">{t('progress_data', TranslationNamespace.INTEGRATION, { default: 'Progress' })}</TabsTrigger>
              <TabsTrigger value="learning">{t('learning_analytics', TranslationNamespace.INTEGRATION, { default: 'Learning' })}</TabsTrigger>
              <TabsTrigger value="curriculum">{t('curriculum', TranslationNamespace.INTEGRATION, { default: 'Curriculum' })}</TabsTrigger>
              <TabsTrigger value="assessment">{t('assessment', TranslationNamespace.INTEGRATION, { default: 'Assessment' })}</TabsTrigger>
              <TabsTrigger value="engagement">{t('engagement', TranslationNamespace.INTEGRATION, { default: 'Engagement' })}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="progress" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('student_progress_data', TranslationNamespace.INTEGRATION, { default: 'Student Progress Data' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('progress_data_description', TranslationNamespace.INTEGRATION, { default: 'Synchronize student progress data between systems' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer mr-4">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={analyticsData.progressData.syncEnabled}
                      onChange={() => toggleSyncEnabled('progressData')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">
                      {analyticsData.progressData.syncEnabled ? 
                        t('enabled', TranslationNamespace.INTEGRATION, { default: 'Enabled' }) : 
                        t('disabled', TranslationNamespace.INTEGRATION, { default: 'Disabled' })}
                    </span>
                  </label>
                  <Button 
                    onClick={() => handleSync('progressData')}
                    disabled={!analyticsData.progressData.syncEnabled || !selectedPlatform || syncStatus === 'syncing'}
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
                    <p className="mt-1">{formatDate(analyticsData.progressData.lastSyncDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('data_points', TranslationNamespace.INTEGRATION, { default: 'Data Points' })}
                    </h4>
                    <p className="mt-1">{analyticsData.progressData.dataPoints.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('sync_direction', TranslationNamespace.INTEGRATION, { default: 'Sync Direction' })}
                    </h4>
                    <p className="mt-1">
                      {analyticsData.progressData.syncDirection === 'bidirectional' ? 
                        t('bidirectional', TranslationNamespace.INTEGRATION, { default: 'Bidirectional' }) : 
                        t('export_only', TranslationNamespace.INTEGRATION, { default: 'Export Only' })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">
                  {t('progress_data_mapping', TranslationNamespace.INTEGRATION, { default: 'Progress Data Mapping' })}
                </h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">{t('edpsych_field', TranslationNamespace.INTEGRATION, { default: 'EdPsych Field' })}</th>
                      <th className="text-left py-2">{t('lms_field', TranslationNamespace.INTEGRATION, { default: 'LMS Field' })}</th>
                      <th className="text-left py-2">{t('sync_status', TranslationNamespace.INTEGRATION, { default: 'Status' })}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Completion Status</td>
                      <td className="py-2">completion_status</td>
                      <td className="py-2">
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                          {t('active', TranslationNamespace.INTEGRATION, { default: 'Active' })}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Progress Percentage</td>
                      <td className="py-2">progress</td>
                      <td className="py-2">
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                          {t('active', TranslationNamespace.INTEGRATION, { default: 'Active' })}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Last Activity Date</td>
                      <td className="py-2">last_accessed</td>
                      <td className="py-2">
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                          {t('active', TranslationNamespace.INTEGRATION, { default: 'Active' })}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Time Spent</td>
                      <td className="py-2">total_time</td>
                      <td className="py-2">
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                          {t('active', TranslationNamespace.INTEGRATION, { default: 'Active' })}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            {/* Similar content structure for other tabs */}
            <TabsContent value="learning" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('learning_analytics', TranslationNamespace.INTEGRATION, { default: 'Learning Analytics' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('learning_analytics_description', TranslationNamespace.INTEGRATION, { default: 'Export detailed learning analytics to LMS dashboards' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer mr-4">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={analyticsData.learningAnalytics.syncEnabled}
                      onChange={() => toggleSyncEnabled('learningAnalytics')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">
                      {analyticsData.learningAnalytics.syncEnabled ? 
                        t('enabled', TranslationNamespace.INTEGRATION, { default: 'Enabled' }) : 
                        t('disabled', TranslationNamespace.INTEGRATION, { default: 'Disabled' })}
                    </span>
                  </label>
                  <Button 
                    onClick={() => handleSync('learningAnalytics')}
                    disabled={!analyticsData.learningAnalytics.syncEnabled || !selectedPlatform || syncStatus === 'syncing'}
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
                    <p className="mt-1">{formatDate(analyticsData.learningAnalytics.lastSyncDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('data_points', TranslationNamespace.INTEGRATION, { default: 'Data Points' })}
                    </h4>
                    <p className="mt-1">{analyticsData.learningAnalytics.dataPoints.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('sync_direction', TranslationNamespace.INTEGRATION, { default: 'Sync Direction' })}
                    </h4>
                    <p className="mt-1">
                      {analyticsData.learningAnalytics.syncDirection === 'bidirectional' ? 
                        t('bidirectional', TranslationNamespace.INTEGRATION, { default: 'Bidirectional' }) : 
                        t('export_only', TranslationNamespace.INTEGRATION, { default: 'Export Only' })}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="curriculum" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('curriculum_coverage', TranslationNamespace.INTEGRATION, { default: 'Curriculum Coverage' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('curriculum_coverage_description', TranslationNamespace.INTEGRATION, { default: 'Map UK curriculum coverage data to LMS course structures' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer mr-4">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={analyticsData.curriculumCoverage.syncEnabled}
                      onChange={() => toggleSyncEnabled('curriculumCoverage')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">
                      {analyticsData.curriculumCoverage.syncEnabled ? 
                        t('enabled', TranslationNamespace.INTEGRATION, { default: 'Enabled' }) : 
                        t('disabled', TranslationNamespace.INTEGRATION, { default: 'Disabled' })}
                    </span>
                  </label>
                  <Button 
                    onClick={() => handleSync('curriculumCoverage')}
                    disabled={!analyticsData.curriculumCoverage.syncEnabled || !selectedPlatform || syncStatus === 'syncing'}
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
                    <p className="mt-1">{formatDate(analyticsData.curriculumCoverage.lastSyncDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('data_points', TranslationNamespace.INTEGRATION, { default: 'Data Points' })}
                    </h4>
                    <p className="mt-1">{analyticsData.curriculumCoverage.dataPoints.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('sync_direction', TranslationNamespace.INTEGRATION, { default: 'Sync Direction' })}
                    </h4>
                    <p className="mt-1">
                      {analyticsData.curriculumCoverage.syncDirection === 'bidirectional' ? 
                        t('bidirectional', TranslationNamespace.INTEGRATION, { default: 'Bidirectional' }) : 
                        t('export_only', TranslationNamespace.INTEGRATION, { default: 'Export Only' })}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="assessment" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('assessment_data', TranslationNamespace.INTEGRATION, { default: 'Assessment Data' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('assessment_data_description', TranslationNamespace.INTEGRATION, { default: 'Seamless transfer of assessment results between systems' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer mr-4">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={analyticsData.assessmentData.syncEnabled}
                      onChange={() => toggleSyncEnabled('assessmentData')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">
                      {analyticsData.assessmentData.syncEnabled ? 
                        t('enabled', TranslationNamespace.INTEGRATION, { default: 'Enabled' }) : 
                        t('disabled', TranslationNamespace.INTEGRATION, { default: 'Disabled' })}
                    </span>
                  </label>
                  <Button 
                    onClick={() => handleSync('assessmentData')}
                    disabled={!analyticsData.assessmentData.syncEnabled || !selectedPlatform || syncStatus === 'syncing'}
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
                    <p className="mt-1">{formatDate(analyticsData.assessmentData.lastSyncDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('data_points', TranslationNamespace.INTEGRATION, { default: 'Data Points' })}
                    </h4>
                    <p className="mt-1">{analyticsData.assessmentData.dataPoints.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('sync_direction', TranslationNamespace.INTEGRATION, { default: 'Sync Direction' })}
                    </h4>
                    <p className="mt-1">
                      {analyticsData.assessmentData.syncDirection === 'bidirectional' ? 
                        t('bidirectional', TranslationNamespace.INTEGRATION, { default: 'Bidirectional' }) : 
                        t('export_only', TranslationNamespace.INTEGRATION, { default: 'Export Only' })}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="engagement" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('engagement_metrics', TranslationNamespace.INTEGRATION, { default: 'Engagement Metrics' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('engagement_metrics_description', TranslationNamespace.INTEGRATION, { default: 'Share student engagement metrics with LMS reporting tools' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer mr-4">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={analyticsData.engagementMetrics.syncEnabled}
                      onChange={() => toggleSyncEnabled('engagementMetrics')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">
                      {analyticsData.engagementMetrics.syncEnabled ? 
                        t('enabled', TranslationNamespace.INTEGRATION, { default: 'Enabled' }) : 
                        t('disabled', TranslationNamespace.INTEGRATION, { default: 'Disabled' })}
                    </span>
                  </label>
                  <Button 
                    onClick={() => handleSync('engagementMetrics')}
                    disabled={!analyticsData.engagementMetrics.syncEnabled || !selectedPlatform || syncStatus === 'syncing'}
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
                    <p className="mt-1">{formatDate(analyticsData.engagementMetrics.lastSyncDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('data_points', TranslationNamespace.INTEGRATION, { default: 'Data Points' })}
                    </h4>
                    <p className="mt-1">{analyticsData.engagementMetrics.dataPoints.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('sync_direction', TranslationNamespace.INTEGRATION, { default: 'Sync Direction' })}
                    </h4>
                    <p className="mt-1">
                      {analyticsData.engagementMetrics.syncDirection === 'bidirectional' ? 
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
