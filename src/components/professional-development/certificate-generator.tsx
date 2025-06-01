'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Button 
} from "@/components/ui/button";
import { 
  Progress 
} from "@/components/ui/progress";
import { 
  Badge 
} from "@/components/ui/badge";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
// Import Certificate from our custom icons to fix build errors
import { 
  Clock, 
  Download, 
  FileText, 
  Layers, 
  Share2, 
  Star, 
  Users 
} from "lucide-react";
import { Certificate } from "@/components/icons/certificate";

// Certificate generation component
export default function CertificateGenerator() {
  const [generating, setGenerating] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  
  // Sample certificate data
  const sampleCertificate = {
    id: 'cert-123456',
    courseTitle: 'Trauma-Informed Approaches in Education',
    recipientName: 'Jane Smith',
    completionDate: '17 May 2025',
    cpd_points: 6,
    instructor: 'Dr. Sarah Thompson',
    organisation: 'EdPsych Connect',
    certificationId: 'EC-TIA-2025-123456'
  };
  
  // Certificate templates
  const templates = [
    { id: 'standard', name: 'Standard Certificate', preview: '/images/certificates/standard-preview.jpg' },
    { id: 'professional', name: 'Professional Certificate', preview: '/images/certificates/professional-preview.jpg' },
    { id: 'modern', name: 'Modern Certificate', preview: '/images/certificates/modern-preview.jpg' }
  ];
  
  // Handle certificate generation
  const handleGenerateCertificate = () => {
    setGenerating(true);
    
    // Simulate API call to generate certificate
    setTimeout(() => {
      setCertificate(sampleCertificate);
      setGenerating(false);
    }, 2000);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Certificate Generator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Preview</CardTitle>
              <CardDescription>
                Preview and customise your certificate before generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {certificate ? (
                <div className="bg-white p-8 border rounded-lg shadow-lg">
                  <div className="text-centre mb-6">
                    <h2 className="text-3xl font-serif mb-2">Certificate of Completion</h2>
                    <div className="w-32 h-1 bg-primary mx-auto"></div>
                  </div>
                  
                  <div className="text-centre mb-8">
                    <p className="text-lg">This certifies that</p>
                    <h3 className="text-2xl font-bold my-2">{certificate.recipientName}</h3>
                    <p className="text-lg">has successfully completed</p>
                    <h4 className="text-xl font-bold my-2">{certificate.courseTitle}</h4>
                    <p className="text-lg">on {certificate.completionDate}</p>
                  </div>
                  
                  <div className="flex justify-between items-centre mt-12">
                    <div>
                      <div className="w-40 h-px bg-grey-400 mb-2"></div>
                      <p className="text-sm">{certificate.instructor}</p>
                      <p className="text-xs text-grey-600">Course Instructor</p>
                    </div>
                    
                    <div className="flex flex-col items-centre">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-centre justify-centre mb-2">
                        <Certificate className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-xs text-grey-600">{certificate.cpd_points} CPD Points</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="w-40 h-px bg-grey-400 mb-2"></div>
                      <p className="text-sm">{certificate.organisation}</p>
                      <p className="text-xs text-grey-600">Issuing Organisation</p>
                    </div>
                  </div>
                  
                  <div className="text-centre mt-8">
                    <p className="text-xs text-grey-500">Certificate ID: {certificate.certificationId}</p>
                    <p className="text-xs text-grey-500">Verify this certificate at edpsychconnect.com/verify</p>
                  </div>
                </div>
              ) : (
                <div className="bg-muted h-96 rounded-lg flex flex-col items-centre justify-centre">
                  <Certificate className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Certificate Generated</h3>
                  <p className="text-muted-foreground text-centre max-w-md mb-6">
                    Select a template and click "Generate Certificate" to create your certificate
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                disabled={!certificate}
                className="flex items-centre gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              
              <Button 
                disabled={!certificate}
                className="flex items-centre gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Certificate Options</CardTitle>
              <CardDescription>
                Customise your certificate appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Select Template
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {templates.map(template => (
                      <div 
                        key={template.id}
                        className={`border rounded-lg p-3 cursor-pointer ${
                          selectedTemplate === template.id ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="flex items-centre gap-3">
                          <div className="w-12 h-12 bg-muted rounded flex items-centre justify-centre">
                            <Certificate className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              Professional design with official styling
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleGenerateCertificate}
                disabled={generating}
              >
                {generating ? 'Generating...' : 'Generate Certificate'}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Certificate Details</CardTitle>
              <CardDescription>
                Information included in your certificate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Course</span>
                  <span className="text-sm font-medium">Trauma-Informed Approaches</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Recipient</span>
                  <span className="text-sm font-medium">Jane Smith</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completion Date</span>
                  <span className="text-sm font-medium">17 May 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">CPD Points</span>
                  <span className="text-sm font-medium">6 Points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Instructor</span>
                  <span className="text-sm font-medium">Dr. Sarah Thompson</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
