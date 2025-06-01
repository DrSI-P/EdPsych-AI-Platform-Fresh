'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { VoiceAnalyticsProvider, useVoiceAnalytics, VoiceAnalyticsEvent } from './voice-input-analytics';

/**
 * Voice Analytics Dashboard Component
 * 
 * This component provides a dashboard for viewing and analyzing voice input usage data,
 * helping administrators understand how users are interacting with voice features.
 */
export default function VoiceAnalyticsDashboard() {
  return (
    <VoiceAnalyticsProvider>
      <VoiceAnalyticsDashboardContent />
    </VoiceAnalyticsProvider>
  );
}

function VoiceAnalyticsDashboardContent() {
  // Use voice analytics
  const { 
    getAnalytics, 
    clearAnalytics, 
    isEnabled, 
    setEnabled, 
    privacyMode, 
    setPrivacyMode 
  } = useVoiceAnalytics();
  
  // State
  const [analytics, setAnalytics] = useState<VoiceAnalyticsEvent[]>([]);
  const [eventTypeData, setEventTypeData] = useState<any[]>([]);
  const [keyStageData, setKeyStageData] = useState<any[]>([]);
  const [successRateData, setSuccessRateData] = useState<any[]>([]);
  const [timeOfDayData, setTimeOfDayData] = useState<any[]>([]);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Load analytics data
  useEffect(() => {
    const data = getAnalytics();
    setAnalytics(data);
    
    // Process data for charts
    processEventTypeData(data);
    processKeyStageData(data);
    processSuccessRateData(data);
    processTimeOfDayData(data);
  }, [getAnalytics]);
  
  // Process event type data for chart
  const processEventTypeData = (data: VoiceAnalyticsEvent[]) => {
    const eventCounts: Record<string, number> = {};
    
    data.forEach(event => {
      eventCounts[event.type] = (eventCounts[event.type] || 0) + 1;
    });
    
    const chartData = Object.entries(eventCounts).map(([type, count]) => ({
      name: formatEventType(type),
      value: count,
    }));
    
    setEventTypeData(chartData);
  };
  
  // Process key stage data for chart
  const processKeyStageData = (data: VoiceAnalyticsEvent[]) => {
    const stageCounts: Record<string, number> = {};
    
    data.forEach(event => {
      if (event.keyStage) {
        stageCounts[event.keyStage] = (stageCounts[event.keyStage] || 0) + 1;
      }
    });
    
    const chartData = Object.entries(stageCounts).map(([stage, count]) => ({
      name: formatKeyStage(stage),
      value: count,
    }));
    
    setKeyStageData(chartData);
  };
  
  // Process success rate data for chart
  const processSuccessRateData = (data: VoiceAnalyticsEvent[]) => {
    const successCount = data.filter(event => event.type === 'recognition_success').length;
    const errorCount = data.filter(event => event.type === 'recognition_error').length;
    const total = successCount + errorCount;
    
    if (total === 0) {
      setSuccessRateData([]);
      return;
    }
    
    const successRate = (successCount / total) * 100;
    const errorRate = (errorCount / total) * 100;
    
    setSuccessRateData([
      { name: 'Success', value: successRate },
      { name: 'Error', value: errorRate },
    ]);
  };
  
  // Process time of day data for chart
  const processTimeOfDayData = (data: VoiceAnalyticsEvent[]) => {
    const hourCounts: Record<number, number> = {};
    
    // Initialize hours
    for (let i = 0; i < 24; i++) {
      hourCounts[i] = 0;
    }
    
    data.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const chartData = Object.entries(hourCounts).map(([hour, count]) => ({
      name: `${hour}:00`,
      value: count,
    }));
    
    setTimeOfDayData(chartData);
  };
  
  // Format event type for display
  const formatEventType = (type: string): string => {
    return type
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Format key stage for display
  const formatKeyStage = (stage: string): string => {
    switch (stage) {
      case 'early_years':
        return 'Early Years';
      case 'ks1':
        return 'Key Stage 1';
      case 'ks2':
        return 'Key Stage 2';
      case 'ks3':
        return 'Key Stage 3';
      case 'ks4':
        return 'Key Stage 4';
      case 'adult':
        return 'Adult';
      default:
        return stage;
    }
  };
  
  // Handle clear analytics
  const handleClearAnalytics = () => {
    if (confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
      clearAnalytics();
      setAnalytics([]);
      setEventTypeData([]);
      setKeyStageData([]);
      setSuccessRateData([]);
      setTimeOfDayData([]);
    }
  };
  
  // Handle toggle analytics enabled
  const handleToggleEnabled = () => {
    setEnabled(!isEnabled);
  };
  
  // Handle toggle privacy mode
  const handleTogglePrivacyMode = () => {
    setPrivacyMode(!privacyMode);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Voice Analytics Dashboard</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Analytics Settings</CardTitle>
          <CardDescription>
            Configure voice analytics collection and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analytics-enabled" className="font-medium">Analytics Enabled</Label>
                <p className="text-sm text-gray-500">
                  Collect usage data for voice input features
                </p>
              </div>
              <Switch
                id="analytics-enabled"
                checked={isEnabled}
                onCheckedChange={handleToggleEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="privacy-mode" className="font-medium">Privacy Mode</Label>
                <p className="text-sm text-gray-500">
                  Redact sensitive information from analytics data
                </p>
              </div>
              <Switch
                id="privacy-mode"
                checked={privacyMode}
                onCheckedChange={handleTogglePrivacyMode}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-gray-500">
            {analytics.length} events collected
          </p>
          <Button variant="outline" onClick={handleClearAnalytics}>
            Clear Analytics Data
          </Button>
        </CardFooter>
      </Card>
      
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage Patterns</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Types</CardTitle>
                <CardDescription>
                  Distribution of voice input events by type
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {eventTypeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={eventTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {eventTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Key Stage Distribution</CardTitle>
                <CardDescription>
                  Voice input usage by educational key stage
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {keyStageData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={keyStageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recognition Success Rate</CardTitle>
                <CardDescription>
                  Percentage of successful voice recognition attempts
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {successRateData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={successRateData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                      >
                        <Cell fill="#4CAF50" />
                        <Cell fill="#F44336" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Usage by Time of Day</CardTitle>
                <CardDescription>
                  Voice input activity throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {timeOfDayData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeOfDayData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Usage Patterns</CardTitle>
              <CardDescription>
                Detailed analysis of voice input usage patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Most Used Features</h3>
                  <div className="h-[300px]">
                    {eventTypeData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={eventTypeData.sort((a, b) => b.value - a.value)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No data available
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Session Activity</h3>
                  <p className="text-gray-500 mb-4">
                    Number of voice input events per session
                  </p>
                  
                  {analytics.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="p-2 text-left">Session ID</th>
                            <th className="p-2 text-left">Events</th>
                            <th className="p-2 text-left">First Activity</th>
                            <th className="p-2 text-left">Last Activity</th>
                            <th className="p-2 text-left">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from(new Set(analytics.map(event => event.sessionId))).map(sessionId => {
                            const sessionEvents = analytics.filter(event => event.sessionId === sessionId);
                            const firstEvent = sessionEvents.reduce((earliest, event) => 
                              event.timestamp < earliest.timestamp ? event : earliest, sessionEvents[0]);
                            const lastEvent = sessionEvents.reduce((latest, event) => 
                              event.timestamp > latest.timestamp ? event : latest, sessionEvents[0]);
                            const duration = lastEvent.timestamp - firstEvent.timestamp;
                            
                            return (
                              <tr key={sessionId} className="border-t">
                                <td className="p-2">{sessionId.substring(0, 8)}...</td>
                                <td className="p-2">{sessionEvents.length}</td>
                                <td className="p-2">{new Date(firstEvent.timestamp).toLocaleString()}</td>
                                <td className="p-2">{new Date(lastEvent.timestamp).toLocaleString()}</td>
                                <td className="p-2">{formatDuration(duration)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center p-6 text-gray-500">
                      No session data available
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Voice recognition performance and accuracy metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Recognition Success Rate</h3>
                    <p className="text-2xl font-bold mt-1">
                      {successRateData.length > 0 ? 
                        `${successRateData[0].value.toFixed(1)}%` : 
                        'N/A'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Total Recognition Attempts</h3>
                    <p className="text-2xl font-bold mt-1">
                      {analytics.filter(event => 
                        event.type === 'recognition_start').length}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Commands Executed</h3>
                    <p className="text-2xl font-bold mt-1">
                      {analytics.filter(event => 
                        event.type === 'command_executed').length}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Recognition Performance by Key Stage</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-2 text-left">Key Stage</th>
                          <th className="p-2 text-left">Attempts</th>
                          <th className="p-2 text-left">Success</th>
                          <th className="p-2 text-left">Error</th>
                          <th className="p-2 text-left">Success Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {['early_years', 'ks1', 'ks2', 'ks3', 'ks4', 'adult'].map(stage => {
                          const stageEvents = analytics.filter(event => event.keyStage === stage);
                          const attempts = stageEvents.filter(event => 
                            event.type === 'recognition_start').length;
                          const success = stageEvents.filter(event => 
                            event.type === 'recognition_success').length;
                          const error = stageEvents.filter(event => 
                            event.type === 'recognition_error').length;
                          const successRate = attempts > 0 ? (success / attempts) * 100 : 0;
                          
                          return (
                            <tr key={stage} className="border-t">
                              <td className="p-2">{formatKeyStage(stage)}</td>
                              <td className="p-2">{attempts}</td>
                              <td className="p-2">{success}</td>
                              <td className="p-2">{error}</td>
                              <td className="p-2">{successRate.toFixed(1)}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Error Analysis</h3>
                  <p className="text-gray-500 mb-4">
                    Common error types and frequencies
                  </p>
                  
                  {analytics.filter(event => event.type === 'recognition_error').length > 0 ? (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={getErrorTypeData()}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#F44336" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-center p-6 text-gray-500">
                      No error data available
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="raw">
          <Card>
            <CardHeader>
              <CardTitle>Raw Analytics Data</CardTitle>
              <CardDescription>
                View and export raw analytics events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-2 text-left">Timestamp</th>
                        <th className="p-2 text-left">Event Type</th>
                        <th className="p-2 text-left">Key Stage</th>
                        <th className="p-2 text-left">Session ID</th>
                        <th className="p-2 text-left">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.slice().reverse().slice(0, 100).map((event, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2">{new Date(event.timestamp).toLocaleString()}</td>
                          <td className="p-2">{formatEventType(event.type)}</td>
                          <td className="p-2">{event.keyStage ? formatKeyStage(event.keyStage) : '-'}</td>
                          <td className="p-2">{event.sessionId.substring(0, 8)}...</td>
                          <td className="p-2">
                            <pre className="text-xs overflow-hidden text-ellipsis max-w-[200px]">
                              {JSON.stringify(event.data)}
                            </pre>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-6 text-gray-500">
                  No analytics data available
                </div>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">
                Showing up to 100 most recent events
              </p>
              <Button variant="outline" onClick={exportAnalyticsData}>
                Export Data (JSON)
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
  
  // Helper function to get error type data
  function getErrorTypeData() {
    const errorEvents = analytics.filter(event => event.type === 'recognition_error');
    const errorTypes: Record<string, number> = {};
    
    errorEvents.forEach(event => {
      const errorType = event.data.errorType || 'unknown';
      errorTypes[errorType] = (errorTypes[errorType] || 0) + 1;
    });
    
    return Object.entries(errorTypes).map(([type, count]) => ({
      name: type,
      value: count,
    }));
  }
  
  // Helper function to format duration
  function formatDuration(ms: number): string {
    if (ms < 1000) {
      return `${ms}ms`;
    }
    
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) {
      return `${seconds}s`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }
  
  // Helper function to export analytics data
  function exportAnalyticsData() {
    const data = JSON.stringify(analytics, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice-analytics-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
