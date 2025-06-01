'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Shield, 
  Award, 
  FileCheck, 
  Copy, 
  CheckCircle, 
  Clock, 
  Download, 
  Share2, 
  QrCode, 
  Lock, 
  Unlock, 
  AlertCircle,
  FileText,
  Fingerprint,
  Key,
  Briefcase
} from 'lucide-react';

// Integration with portfolio module
const PortfolioIntegration = ({ credential, onAddToPortfolio }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [portfolioSection, setPortfolioSection] = useState('achievements');
  const { toast } = useToast();
  
  const handleAddToPortfolio = async () => {
    setIsAdding(true);
    
    try {
      // Simulate API call to add credential to portfolio
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onAddToPortfolio(credential, portfolioSection);
      
      toast({
        title: "Added to Portfolio",
        description: `Credential added to your ${portfolioSection} section`,
        variant: "success",
      });
    } catch (error) {
      console.error('Error adding to portfolio:', error);
      toast({
        title: "Error",
        description: "Failed to add credential to portfolio",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };
  
  return (
    <div className="space-y-4 py-4">
      <div>
        <Label htmlFor="portfolioSection">Portfolio Section</Label>
        <select
          id="portfolioSection"
          className="w-full mt-1 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={portfolioSection}
          onChange={(e) => setPortfolioSection(e.target.value)}
        >
          <option value="achievements">Achievements</option>
          <option value="qualifications">Qualifications</option>
          <option value="certifications">Certifications</option>
          <option value="skills">Skills & Competencies</option>
          <option value="professional_development">Professional Development</option>
        </select>
      </div>
      
      <div className="flex items-centre space-x-2">
        <input type="checkbox" id="featured" className="rounded border-grey-300" />
        <Label htmlFor="featured">Feature this credential on portfolio homepage</Label>
      </div>
      
      <div className="flex items-centre space-x-2">
        <input type="checkbox" id="public" className="rounded border-grey-300" defaultChecked />
        <Label htmlFor="public">Make this credential publicly visible</Label>
      </div>
      
      <Button 
        onClick={handleAddToPortfolio} 
        disabled={isAdding}
        className="w-full"
      >
        <Briefcase className="h-4 w-4 mr-2" />
        {isAdding ? 'Adding...' : 'Add to Portfolio'}
      </Button>
    </div>
  );
};

// Integration with CPD tracking module
const CPDIntegration = ({ credential, onLinkToCPD }) => {
  const [isLinking, setIsLinking] = useState(false);
  const [selectedCPD, setSelectedCPD] = useState('');
  const { toast } = useToast();
  
  // Mock CPD activities
  const cpdActivities = [
    { id: 'cpd1', title: 'Educational Psychology Conference 2025' },
    { id: 'cpd2', title: 'Advanced Assessment Techniques Workshop' },
    { id: 'cpd3', title: 'Inclusive Education Seminar Series' },
    { id: 'cpd4', title: 'Restorative Justice in Schools Training' },
    { id: 'cpd5', title: 'Digital Learning Tools for SEN' }
  ];
  
  const handleLinkToCPD = async () => {
    if (!selectedCPD) {
      toast({
        title: "Selection Required",
        description: "Please select a CPD activity to link",
        variant: "destructive",
      });
      return;
    }
    
    setIsLinking(true);
    
    try {
      // Simulate API call to link credential to CPD
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const activity = cpdActivities.find(a => a.id === selectedCPD);
      onLinkToCPD(credential, activity);
      
      toast({
        title: "Linked to CPD",
        description: `Credential linked to "${activity.title}"`,
        variant: "success",
      });
    } catch (error) {
      console.error('Error linking to CPD:', error);
      toast({
        title: "Error",
        description: "Failed to link credential to CPD activity",
        variant: "destructive",
      });
    } finally {
      setIsLinking(false);
    }
  };
  
  return (
    <div className="space-y-4 py-4">
      <div>
        <Label htmlFor="cpdActivity">CPD Activity</Label>
        <select
          id="cpdActivity"
          className="w-full mt-1 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={selectedCPD}
          onChange={(e) => setSelectedCPD(e.target.value)}
        >
          <option value="">Select a CPD activity...</option>
          {cpdActivities.map(activity => (
            <option key={activity.id} value={activity.id}>
              {activity.title}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex items-centre space-x-2">
        <input type="checkbox" id="evidence" className="rounded border-grey-300" defaultChecked />
        <Label htmlFor="evidence">Use as evidence of completion</Label>
      </div>
      
      <div className="flex items-centre space-x-2">
        <input type="checkbox" id="hours" className="rounded border-grey-300" defaultChecked />
        <Label htmlFor="hours">Include hours in CPD total</Label>
      </div>
      
      <Button 
        onClick={handleLinkToCPD} 
        disabled={isLinking || !selectedCPD}
        className="w-full"
      >
        <Clock className="h-4 w-4 mr-2" />
        {isLinking ? 'Linking...' : 'Link to CPD Record'}
      </Button>
    </div>
  );
};

// Integration component for blockchain credentials
const BlockchainCredentialIntegration = ({ credential, onClose }) => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const { toast } = useToast();
  
  const handleAddToPortfolio = (credential, section) => {
    // In a real implementation, this would call an API to add the credential to the portfolio
    console.log(`Added credential ${credential.id} to ${section} section`);
  };
  
  const handleLinkToCPD = (credential, activity) => {
    // In a real implementation, this would call an API to link the credential to CPD
    console.log(`Linked credential ${credential.id} to CPD activity ${activity.id}`);
  };
  
  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="portfolio">
            <Briefcase className="h-4 w-4 mr-2" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="cpd">
            <Clock className="h-4 w-4 mr-2" />
            CPD Record
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolio">
          <PortfolioIntegration 
            credential={credential} 
            onAddToPortfolio={handleAddToPortfolio} 
          />
        </TabsContent>
        
        <TabsContent value="cpd">
          <CPDIntegration 
            credential={credential} 
            onLinkToCPD={handleLinkToCPD} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { BlockchainCredentialIntegration };
