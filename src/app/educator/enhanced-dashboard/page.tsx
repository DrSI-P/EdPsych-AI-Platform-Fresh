'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccessibilityEnhancements } from '@/components/educator/accessibility-enhancements';
import { EnhancedAnalytics } from '@/components/educator/enhanced-analytics';
import { VoiceInputIntegration } from '@/components/educator/voice-input-integration';
import { UKCurriculumIntegration } from '@/components/educator/uk-curriculum-integration';
import { AvatarVideo } from '@/components/special-needs/executive-dysfunction/working-memory/AvatarVideo';

/**
 * Enhanced Educator Dashboard Page Component
 * 
 * This component integrates all the enhanced features for the Educator Dashboard,
 * including accessibility controls, advanced analytics, voice input integration,
 * and UK curriculum alignment.
 */
export default function EnhancedEducatorDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Educator Dashboard</h1>
          <p className="text-muted-foreground">
            Enhanced with accessibility features, advanced analytics, voice input, and UK curriculum alignment
          </p>
        </div>
        
        <Button variant="outline" className="md:self-end">
          Customize Dashboard
        </Button>
      </div>
      
      <AvatarVideo 
        title="Enhanced Educator Dashboard"
        description="This dashboard provides comprehensive tools for educators, including accessibility features, advanced analytics, voice input capabilities, and UK curriculum alignment. Use the tabs below to access different features."
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="voice">Voice Input</TabsTrigger>
          <TabsTrigger value="curriculum">UK Curriculum</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Your Enhanced Dashboard</CardTitle>
              <CardDescription>
                Select a feature tab above to access enhanced capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Accessibility</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Customize your dashboard experience with high contrast mode, font size adjustments, and more.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setActiveTab('accessibility')}
                    >
                      Configure
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Enhanced Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Access comprehensive data visualizations and insights aligned with UK curriculum standards.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setActiveTab('analytics')}
                    >
                      Explore
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Voice Input</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Control your dashboard using voice commands, perfect for educators who struggle with typing.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setActiveTab('voice')}
                    >
                      Activate
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">UK Curriculum</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Access resources and tools aligned with UK educational standards and curriculum requirements.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setActiveTab('curriculum')}
                    >
                      Explore
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Recent Updates</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></span>
                    <span>Enhanced analytics now include UK curriculum-aligned performance metrics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></span>
                    <span>Voice input system now supports comprehensive dashboard navigation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></span>
                    <span>Accessibility features expanded with color blind modes and text-to-speech</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></span>
                    <span>UK curriculum integration added with resources aligned to all key stages</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="accessibility" className="mt-6">
          <AccessibilityEnhancements />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <EnhancedAnalytics />
        </TabsContent>
        
        <TabsContent value="voice" className="mt-6">
          <VoiceInputIntegration />
        </TabsContent>
        
        <TabsContent value="curriculum" className="mt-6">
          <UKCurriculumIntegration />
        </TabsContent>
      </Tabs>
    </div>
  );
}
