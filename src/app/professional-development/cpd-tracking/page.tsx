'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CPDTracking from '@/components/professional-development/cpd-tracking';

export default function CPDTrackingPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Professional Development</h1>
      
      <Tabs defaultValue="cpd-tracking" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cpd-tracking">CPD Tracking</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cpd-tracking" className="mt-6">
          <CPDTracking />
        </TabsContent>
        
        <TabsContent value="certificates" className="mt-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Your CPD Certificates</h2>
            <p className="text-muted-foreground mb-6">
              View and download certificates for your completed professional development activities.
            </p>
            
            <div className="text-centre py-12">
              <p className="text-muted-foreground">
                Complete CPD activities to earn certificates.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="resources" className="mt-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">CPD Resources</h2>
            <p className="text-muted-foreground mb-6">
              Access recommended resources to support your professional development journey.
            </p>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">UK Teaching Standards</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Official documentation on the Teachers' Standards from the Department for Education.
                </p>
                <a href="https://www.gov.uk/government/publications/teachers-standards" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-primary hover:underline text-sm">
                  View resource
                </a>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">CPD Framework</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Guidance on effective continuing professional development for teachers.
                </p>
                <a href="https://www.gov.uk/guidance/professional-development-for-teachers" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-primary hover:underline text-sm">
                  View resource
                </a>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Education Endowment Foundation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Evidence-based resources to improve teaching practise.
                </p>
                <a href="https://educationendowmentfoundation.org.uk/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-primary hover:underline text-sm">
                  View resource
                </a>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
