import React from 'react';
import CalendarOptimizationWrapper from '@/components/educator/calendar-optimization-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CalendarOptimizationPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Calendar Optimization</h1>
      
      <Tabs defaultValue="calendar" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="about">About This Feature</TabsTrigger>
          <TabsTrigger value="help">Help & Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar">
          <CalendarOptimizationWrapper />
        </TabsContent>
        
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Calendar Optimization</CardTitle>
              <CardDescription>
                Understanding how this feature helps educators manage their time effectively
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The Calendar Optimization feature is designed to help educators efficiently plan, organize, and optimize their professional activities while balancing teaching responsibilities, administrative tasks, meetings, and professional development.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Key Benefits</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Intelligent Activity Scheduling:</strong> Smart scheduling algorithms that consider activity type, priority, duration, and dependencies to create optimal timetables.
                </li>
                <li>
                  <strong>Activity Categorization and Prioritization:</strong> Automatic categorization of activities with priority scoring based on urgency, importance, and educational impact.
                </li>
                <li>
                  <strong>Time Allocation Optimization:</strong> Analysis of time spent across different activity categories with recommendations for optimal time distribution.
                </li>
                <li>
                  <strong>Collaborative Scheduling:</strong> Tools for coordinating shared calendars, meeting times, and resource booking.
                </li>
                <li>
                  <strong>Wellness and Workload Management:</strong> Features to prevent schedule overloading and maintain work-life balance.
                </li>
              </ul>
              
              <h3 className="text-lg font-medium mt-4">Educational Psychology Foundations</h3>
              <p>
                This feature is built on solid educational psychology principles including cognitive load management, spaced practice, attention restoration, and work-life balance considerations.
              </p>
              
              <p className="mt-4">
                By intelligently optimizing how educators allocate their time and schedule their activities, this feature significantly reduces administrative burden while ensuring that high-impact educational activities receive appropriate focus and resources.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="help">
          <Card>
            <CardHeader>
              <CardTitle>Help & Tips</CardTitle>
              <CardDescription>
                Guidance on getting the most from the Calendar Optimization feature
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Getting Started</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Begin by adding your regular teaching schedule and recurring meetings</li>
                <li>Use the activity types to categorize different kinds of work</li>
                <li>Set appropriate priorities for each activity</li>
                <li>Use the optimization feature to receive suggestions for improving your schedule</li>
                <li>Review the analytics regularly to understand your time allocation patterns</li>
              </ol>
              
              <h3 className="text-lg font-medium mt-4">Best Practices</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Batch similar activities:</strong> Group administrative tasks together to reduce context switching
                </li>
                <li>
                  <strong>Schedule breaks:</strong> Include short recovery periods between intensive teaching sessions
                </li>
                <li>
                  <strong>Protect preparation time:</strong> Block out dedicated time for lesson planning and preparation
                </li>
                <li>
                  <strong>Use priority levels wisely:</strong> Reserve "high priority" for truly urgent and important tasks
                </li>
                <li>
                  <strong>Review and adjust:</strong> Regularly assess your calendar patterns and make adjustments
                </li>
              </ul>
              
              <h3 className="text-lg font-medium mt-4">Keyboard Shortcuts</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <span className="font-mono bg-muted px-1 rounded">n</span> - New activity
                </div>
                <div>
                  <span className="font-mono bg-muted px-1 rounded">e</span> - Edit selected activity
                </div>
                <div>
                  <span className="font-mono bg-muted px-1 rounded">d</span> - Delete selected activity
                </div>
                <div>
                  <span className="font-mono bg-muted px-1 rounded">t</span> - Today
                </div>
                <div>
                  <span className="font-mono bg-muted px-1 rounded">w</span> - Week view
                </div>
                <div>
                  <span className="font-mono bg-muted px-1 rounded">m</span> - Month view
                </div>
              </div>
              
              <p className="mt-4">
                If you need additional help or have suggestions for improving this feature, please contact the platform support team.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}