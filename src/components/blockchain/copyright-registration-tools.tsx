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
import { Progress } from "@/components/ui/progress";
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
  FileCheck, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Fingerprint,
  Key,
  Upload,
  Search,
  Lock,
  Eye,
  EyeOff,
  Download,
  Share2,
  Info,
  FileType,
  Calendar,
  User
} from 'lucide-react';
import { useFairUsage } from '../subscription/fair-usage';

// Mock Web3 integration - would be replaced with actual Ethereum/Web3 implementation
const mockWeb3 = {
  // Connect to wallet
  connect: async () => {
    return { address: '0x1234...5678', connected: true };
  },
  
  // Calculate content hash
  calculateContentHash: async (file) => {
    // In a real implementation, this would calculate a hash of the file content
    return '0x' + Math.random().toString(16).substring(2, 66);
  },
  
  // Register copyright for content
  registerCopyright: async (contentHash, metadata) => {
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      success: true,
      txHash: '0x' + Math.random().toString(16).substring(2, 34),
      timestamp: new Date().toISOString(),
      registrationId: 'reg_' + Math.random().toString(36).substring(2, 11)
    };
  },
  
  // Verify copyright registration
  verifyCopyright: async (registrationId) => {
    // Simulate blockchain verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      valid: true,
      owner: '0xabcd...ef12',
      registeredAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      contentHash: '0x' + Math.random().toString(16).substring(2, 66),
      licenseType: 'CC BY-NC-SA'
    };
  },
  
  // Verify content hash against registered hash
  verifyContentHash: async (contentHash, registrationId) => {
    // Simulate blockchain verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real implementation, this would compare the content hash with the registered hash
    const matches = Math.random() > 0.2; // 80% chance of matching for demo purposes
    
    return {
      matches,
      registrationId: registrationId || 'reg_' + Math.random().toString(36).substring(2, 11),
      registeredAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      owner: '0xabcd...ef12',
    };
  }
};

// Licence types
const licenseTypes = [
  { id: 'all_rights_reserved', name: 'All Rights Reserved', description: 'Full copyright protection with no permissions granted' },
  { id: 'cc_by', name: 'CC BY', description: 'Credit must be given to the creator' },
  { id: 'cc_by_sa', name: 'CC BY-SA', description: 'Credit must be given and adaptations must be shared' },
  { id: 'cc_by_nc', name: 'CC BY-NC', description: 'Credit must be given and only non-commercial use' },
  { id: 'cc_by_nc_sa', name: 'CC BY-NC-SA', description: 'Credit, non-commercial use, and share-alike' },
  { id: 'cc_by_nd', name: 'CC BY-ND', description: 'Credit must be given and no derivatives' },
  { id: 'cc_by_nc_nd', name: 'CC BY-NC-ND', description: 'Credit, non-commercial use, and no derivatives' },
  { id: 'cc0', name: 'CC0 (Public Domain)', description: 'No rights reserved, public domain dedication' }
];

// Content types
const contentTypes = [
  { id: 'document', name: 'Document', icon: <FileText className="h-5 w-5" /> },
  { id: 'resource_collection', name: 'Resource Collection', icon: <FileType className="h-5 w-5" /> },
  { id: 'assessment_tool', name: 'Assessment Tool', icon: <FileCheck className="h-5 w-5" /> },
  { id: 'curriculum', name: 'Curriculum', icon: <FileText className="h-5 w-5" /> },
  { id: 'multimedia', name: 'Multimedia', icon: <FileType className="h-5 w-5" /> },
  { id: 'ai_generated', name: 'AI-Generated Content', icon: <Fingerprint className="h-5 w-5" /> }
];

// Mock copyright registrations
const mockCopyrightRegistrations = [
  {
    id: 'reg_1a2b3c4d',
    title: 'Inclusive Education Framework',
    type: 'document',
    registeredAt: '2025-02-10T10:20:00Z',
    contentHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f',
    licenseType: 'cc_by_nc_sa',
    description: 'A comprehensive framework for implementing inclusive education practices in mainstream schools',
    txHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
    verified: true,
    visibility: 'public',
    downloads: 24,
    views: 87
  },
  {
    id: 'reg_5e6f7g8h',
    title: 'Anxiety Intervention Toolkit',
    type: 'resource_collection',
    registeredAt: '2025-04-05T15:30:00Z',
    contentHash: '0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j',
    licenseType: 'cc_by_nc',
    description: 'Collection of evidence-based tools and resources for addressing anxiety in educational settings',
    txHash: '0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x',
    verified: true,
    visibility: 'private',
    downloads: 0,
    views: 3
  },
  {
    id: 'reg_9i0j1k2l',
    title: 'Developmental Assessment Protocol',
    type: 'assessment_tool',
    registeredAt: '2024-12-18T09:45:00Z',
    contentHash: '0x9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n',
    licenseType: 'all_rights_reserved',
    description: 'Standardised protocol for assessing developmental progress in children aged 3-7',
    txHash: '0x9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b',
    verified: true,
    visibility: 'restricted',
    downloads: 12,
    views: 45
  },
  {
    id: 'reg_3m4n5o6p',
    title: 'AI-Generated Lesson Plan: Emotional Regulation',
    type: 'ai_generated',
    registeredAt: '2025-03-22T14:15:00Z',
    contentHash: '0x3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r',
    licenseType: 'cc_by',
    description: 'AI-generated comprehensive lesson plan for teaching emotional regulation strategies to primary school students',
    txHash: '0x3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f',
    verified: true,
    visibility: 'public',
    downloads: 56,
    views: 142,
    aiGenerated: true
  }
];

// Main component
const CopyrightRegistrationTools = () => {
  const { toast } = useToast();
  const { useFeatureWithCredit, CreditPurchaseDialog } = useFairUsage();
  
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('register');
  
  const [copyrightRegistrations, setCopyrightRegistrations] = useState(mockCopyrightRegistrations);
  
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showLicenseDialog, setShowLicenseDialog] = useState(false);
  
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [verificationId, setVerificationId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // New copyright registration form state
  const [newCopyright, setNewCopyright] = useState({
    title: '',
    type: 'document',
    description: '',
    licenseType: 'cc_by_nc_sa',
    visibility: 'public',
    file: null,
    aiGenerated: false
  });
  
  // Connect wallet
  const connectWallet = async () => {
    setIsLoading(true);
    
    try {
      // Connect to wallet
      const result = await mockWeb3.connect();
      
      if (result.connected) {
        setWalletConnected(true);
        setWalletAddress(result.address);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${result.address}`,
          variant: "success",
        });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register copyright
  const registerCopyright = async () => {
    setIsLoading(true);
    setIsUploading(true);
    
    try {
      // Check if feature can be used (fair usage)
      const usageResult = await useFeatureWithCredit('copyrightRegistration');
      
      if (!usageResult.success && !usageResult.usedCredits) {
        // If feature cannot be used and credits weren't used, exit
        setIsUploading(false);
        return;
      }
      
      // Validate form
      if (!newCopyright.title || !newCopyright.type) {
        throw new Error('Please fill in all required fields');
      }
      
      if (!newCopyright.file && !newCopyright.aiGenerated) {
        throw new Error('Please upload a file or select AI-generated content');
      }
      
      // Simulate file upload with progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Mock content hash generation
      const contentHash = await mockWeb3.calculateContentHash(newCopyright.file);
      
      // Register copyright on blockchain
      const result = await mockWeb3.registerCopyright(contentHash, {
        title: newCopyright.title,
        type: newCopyright.type,
        description: newCopyright.description,
        licenseType: newCopyright.licenseType,
        visibility: newCopyright.visibility,
        aiGenerated: newCopyright.aiGenerated
      });
      
      if (result.success) {
        // Add to registrations list
        const registration = {
          id: result.registrationId,
          title: newCopyright.title,
          type: newCopyright.type,
          registeredAt: result.timestamp,
          contentHash: contentHash,
          licenseType: newCopyright.licenseType,
          description: newCopyright.description,
          txHash: result.txHash,
          verified: true,
          visibility: newCopyright.visibility,
          downloads: 0,
          views: 0,
          aiGenerated: newCopyright.aiGenerated
        };
        
        setCopyrightRegistrations(prev => [registration, ...prev]);
        
        toast({
          title: "Copyright Registered",
          description: `Successfully registered copyright for: ${newCopyright.title}`,
          variant: "success",
        });
        
        // Reset form and close dialogue
        setNewCopyright({
          title: '',
          type: 'document',
          description: '',
          licenseType: 'cc_by_nc_sa',
          visibility: 'public',
          file: null,
          aiGenerated: false
        });
        
        setShowRegistrationDialog(false);
      }
    } catch (error) {
      console.error('Error registering copyright:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register copyright",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  // Verify copyright
  const verifyCopyright = async () => {
    setIsLoading(true);
    
    try {
      if (!verificationId) {
        throw new Error('Please enter a valid registration ID');
      }
      
      // Verify copyright on blockchain
      const result = await mockWeb3.verifyCopyright(verificationId);
      result.type = 'copyright';
      
      setVerificationResult(result);
      
      toast({
        title: "Verification Complete",
        description: result.valid ? "Copyright successfully verified" : "Verification failed",
        variant: result.valid ? "success" : "destructive",
      });
    } catch (error) {
      console.error('Error verifying copyright:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify copyright",
        variant: "destructive",
      });
      setVerificationResult(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verify content hash
  const verifyContentHash = async (file) => {
    setIsLoading(true);
    
    try {
      // Calculate hash of the uploaded file
      const contentHash = await mockWeb3.calculateContentHash(file);
      
      // Verify hash against blockchain records
      const result = await mockWeb3.verifyContentHash(contentHash);
      
      setVerificationResult({
        ...result,
        contentHash,
        type: 'content'
      });
      
      toast({
        title: "Content Verification Complete",
        description: result.matches ? "Content matches a registered copyright" : "No matching copyright found",
        variant: result.matches ? "success" : "destructive",
      });
    } catch (error) {
      console.error('Error verifying content:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify content",
        variant: "destructive",
      });
      setVerificationResult(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Copy verification link
  const copyVerificationLink = (id) => {
    const link = `https://edpsychconnect.com/verify/${id}`;
    navigator.clipboard.writeText(link);
    
    toast({
      title: "Link Copied",
      description: "Verification link copied to clipboard",
      variant: "success",
    });
  };
  
  // Get license name from ID
  const getLicenseName = (licenseId) => {
    const license = licenseTypes.find(l => l.id === licenseId);
    return license ? license.name : licenseId;
  };
  
  // Get content type name and icon
  const getContentTypeInfo = (typeId) => {
    const type = contentTypes.find(t => t.id === typeId);
    return type || { name: typeId, icon: <FileText className="h-5 w-5" /> };
  };
  
  // Handle file upload for verification
  const handleVerificationFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      verifyContentHash(file);
    }
  };
  
  // Render copyright registration card
  const renderCopyrightCard = (registration) => {
    const typeInfo = getContentTypeInfo(registration.type);
    
    return (
      <Card key={registration.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-centre">
              {typeInfo.icon}
              <Badge variant="outline" className="ml-2">
                {typeInfo.name}
              </Badge>
            </div>
            <div className="flex items-centre space-x-2">
              {registration.aiGenerated && (
                <Badge variant="secondary">AI-Generated</Badge>
              )}
              <Badge variant={registration.verified ? "success" : "outline"}>
                {registration.verified ? "Verified" : "Unverified"}
              </Badge>
            </div>
          </div>
          <CardTitle className="mt-2">{registration.title}</CardTitle>
          <CardDescription>
            Registered on {new Date(registration.registeredAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">{registration.description}</p>
          
          <div className="flex items-centre mt-2 justify-between">
            <div className="flex items-centre">
              <p className="text-sm font-medium mr-2">Licence:</p>
              <Badge variant="secondary">
                {getLicenseName(registration.licenseType)}
              </Badge>
            </div>
            <div className="flex items-centre">
              {registration.visibility === 'public' ? (
                <Eye className="h-4 w-4 mr-1 text-green-500" />
              ) : registration.visibility === 'private' ? (
                <EyeOff className="h-4 w-4 mr-1 text-red-500" />
              ) : (
                <Lock className="h-4 w-4 mr-1 text-amber-500" />
              )}
              <span className="text-xs capitalize">{registration.visibility}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-muted-foreground">
            <div className="flex items-centre">
              <Download className="h-3 w-3 mr-1" />
              <span>{registration.downloads} downloads</span>
            </div>
            <div className="flex items-centre">
              <Eye className="h-3 w-3 mr-1" />
              <span>{registration.views} views</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Button variant="outline" size="sm" onClick={() => copyVerificationLink(registration.id)}>
            <Copy className="h-4 w-4 mr-1" />
            Copy Link
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => {
              setSelectedRegistration(registration);
              setShowDetailsDialog(true);
            }}
          >
            <FileCheck className="h-4 w-4 mr-1" />
            Details
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Licence information component
  const LicenseInfo = ({ licenseType }) => {
    const license = licenseTypes.find(l => l.id === licenseType) || {
      name: licenseType,
      description: 'Custom license type'
    };
    
    const getLicenseIcon = (type) => {
      if (type === 'all_rights_reserved') return <Lock className="h-5 w-5" />;
      if (type === 'cc0') return <Unlock className="h-5 w-5" />;
      return <Info className="h-5 w-5" />;
    };
    
    return (
      <div className="p-4 border rounded-lg">
        <div className="flex items-centre mb-2">
          {getLicenseIcon(licenseType)}
          <h3 className="text-lg font-medium ml-2">{license.name}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{license.description}</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-centre">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            <span className="text-sm">Attribution Required</span>
          </div>
          <div className="flex items-centre">
            {licenseType.includes('nc') ? (
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
            )}
            <span className="text-sm">Non-Commercial Only</span>
          </div>
          <div className="flex items-centre">
            {licenseType.includes('nd') ? (
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
            )}
            <span className="text-sm">No Derivatives</span>
          </div>
          <div className="flex items-centre">
            {licenseType.includes('sa') ? (
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
            )}
            <span className="text-sm">Share-Alike Required</span>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-centre mb-6">
        <div>
          <h1 className="text-3xl font-bold">Copyright Registration & Verification</h1>
          <p className="text-muted-foreground mt-1">
            Protect your educational content with blockchain-verified copyright registration
          </p>
        </div>
        
        {!walletConnected ? (
          <Button 
            onClick={connectWallet} 
            disabled={isLoading}
            className="mt-4 md:mt-0"
          >
            <Key className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        ) : (
          <div className="mt-4 md:mt-0 flex items-centre">
            <Badge variant="outline" className="font-mono">
              {walletAddress}
            </Badge>
            <Badge variant="success" className="ml-2">
              Connected
            </Badge>
          </div>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="register">
            <FileCheck className="h-4 w-4 mr-2" />
            Register
          </TabsTrigger>
          <TabsTrigger value="manage">
            <FileText className="h-4 w-4 mr-2" />
            My Registrations
          </TabsTrigger>
          <TabsTrigger value="verify">
            <Shield className="h-4 w-4 mr-2" />
            Verify
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="register" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Register Copyright</CardTitle>
              <CardDescription>
                Secure blockchain-verified copyright protection for your educational content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Inclusive Education Framework"
                      value={newCopyright.title}
                      onChange={(e) => setNewCopyright({...newCopyright, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contentType">Content Type *</Label>
                    <select
                      id="contentType"
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newCopyright.type}
                      onChange={(e) => setNewCopyright({...newCopyright, type: e.target.value})}
                    >
                      {contentTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Brief description of the content"
                    value={newCopyright.description}
                    onChange={(e) => setNewCopyright({...newCopyright, description: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="licenseType">Licence Type *</Label>
                    <select
                      id="licenseType"
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newCopyright.licenseType}
                      onChange={(e) => setNewCopyright({...newCopyright, licenseType: e.target.value})}
                    >
                      {licenseTypes.map((licence) => (
                        <option key={license.id} value={license.id}>
                          {license.name}
                        </option>
                      ))}
                    </select>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-xs mt-1"
                      onClick={() => {
                        setShowLicenseDialog(true);
                      }}
                    >
                      Learn more about license types
                    </Button>
                  </div>
                  
                  <div>
                    <Label htmlFor="visibility">Visibility *</Label>
                    <select
                      id="visibility"
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newCopyright.visibility}
                      onChange={(e) => setNewCopyright({...newCopyright, visibility: e.target.value})}
                    >
                      <option value="public">Public - Anyone can view</option>
                      <option value="restricted">Restricted - Specific users only</option>
                      <option value="private">Private - Only you can view</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-centre space-x-2 mt-2">
                  <input 
                    type="checkbox" 
                    id="aiGenerated" 
                    className="rounded border-grey-300"
                    checked={newCopyright.aiGenerated}
                    onChange={(e) => setNewCopyright({...newCopyright, aiGenerated: e.target.checked})}
                  />
                  <Label htmlFor="aiGenerated">This is AI-generated content</Label>
                </div>
                
                {!newCopyright.aiGenerated && (
                  <div className="mt-2">
                    <Label htmlFor="file">Upload File *</Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={(e) => setNewCopyright({...newCopyright, file: e.target.files[0]})}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Supported formats: PDF, DOCX, PPTX, JPG, PNG, MP3, MP4 (max 100MB)
                    </p>
                  </div>
                )}
                
                {isUploading && (
                  <div className="mt-2">
                    <Label className="text-sm">Upload Progress</Label>
                    <div className="flex items-centre mt-1">
                      <Progress value={uploadProgress} className="flex-1 mr-2" />
                      <span className="text-sm">{uploadProgress}%</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setNewCopyright({
                title: '',
                type: 'document',
                description: '',
                licenseType: 'cc_by_nc_sa',
                visibility: 'public',
                file: null,
                aiGenerated: false
              })}>
                Reset
              </Button>
              <Button 
                onClick={registerCopyright} 
                disabled={isLoading || (!newCopyright.file && !newCopyright.aiGenerated) || !newCopyright.title}
              >
                <FileCheck className="h-4 w-4 mr-2" />
                {isLoading ? 'Registering...' : 'Register Copyright'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage" className="mt-0">
          <div className="flex justify-between items-centre mb-6">
            <h2 className="text-xl font-semibold">My Copyright Registrations</h2>
            <Button 
              onClick={() => setActiveTab('register')}
              disabled={isLoading}
            >
              <FileCheck className="h-4 w-4 mr-2" />
              Register New Copyright
            </Button>
          </div>
          
          {copyrightRegistrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {copyrightRegistrations.map(renderCopyrightCard)}
            </div>
          ) : (
            <div className="text-centre py-12 border rounded-lg">
              <FileCheck className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Copyright Registrations</h3>
              <p className="text-muted-foreground mt-1">
                Register your first content copyright on the blockchain
              </p>
              <Button 
                onClick={() => setActiveTab('register')} 
                className="mt-4"
                disabled={isLoading}
              >
                Register New Copyright
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="verify" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Verify Copyright</CardTitle>
              <CardDescription>
                Verify the authenticity of copyright registrations or check content for existing registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="id" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="id">
                    <Shield className="h-4 w-4 mr-2" />
                    Verify by ID
                  </TabsTrigger>
                  <TabsTrigger value="content">
                    <Fingerprint className="h-4 w-4 mr-2" />
                    Verify Content
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="id" className="mt-0">
                  <div className="flex flex-col space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-3">
                        <Label htmlFor="verificationId">Registration ID</Label>
                        <Input
                          id="verificationId"
                          placeholder="Enter registration ID (e.g., reg_1a2b3c4d)"
                          value={verificationId}
                          onChange={(e) => setVerificationId(e.target.value)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button 
                          onClick={verifyCopyright} 
                          disabled={isLoading || !verificationId}
                          className="w-full"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Verify
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="content" className="mt-0">
                  <div className="flex flex-col space-y-4">
                    <div>
                      <Label htmlFor="contentFile">Upload Content to Verify</Label>
                      <Input
                        id="contentFile"
                        type="file"
                        onChange={handleVerificationFileUpload}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload a file to check if it matches any registered content
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              {verificationResult && (
                <div className="mt-6 border rounded-lg p-4">
                  <div className="flex items-centre mb-4">
                    {(verificationResult.valid || verificationResult.matches) ? (
                      <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                    )}
                    <h3 className="text-lg font-medium">
                      {verificationResult.type === 'copyright' ? (
                        verificationResult.valid ? 'Copyright Verified' : 'Verification Failed'
                      ) : (
                        verificationResult.matches ? 'Content Match Found' : 'No Match Found'
                      )}
                    </h3>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {verificationResult.type === 'copyright' ? (
                      <>
                        <div>
                          <p className="text-sm font-medium">Owner</p>
                          <p className="text-sm font-mono">{verificationResult.owner}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Registered At</p>
                          <p className="text-sm">
                            {new Date(verificationResult.registeredAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Licence Type</p>
                          <Badge variant="outline">
                            {verificationResult.licenseType}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Content Hash</p>
                          <p className="text-sm font-mono truncate">
                            {verificationResult.contentHash}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-sm font-medium">Registration ID</p>
                          <p className="text-sm font-mono">{verificationResult.registrationId}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Registered At</p>
                          <p className="text-sm">
                            {new Date(verificationResult.registeredAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Owner</p>
                          <p className="text-sm font-mono">{verificationResult.owner}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Content Hash</p>
                          <p className="text-sm font-mono truncate">
                            {verificationResult.contentHash}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Registration Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Copyright Registration Details</DialogTitle>
            <DialogDescription>
              {selectedRegistration && `Details for "${selectedRegistration.title}"`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRegistration && (
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Content Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Title</p>
                      <p>{selectedRegistration.title}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Type</p>
                      <div className="flex items-centre">
                        {getContentTypeInfo(selectedRegistration.type).icon}
                        <span className="ml-1">{getContentTypeInfo(selectedRegistration.type).name}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Description</p>
                      <p className="text-sm">{selectedRegistration.description}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Licence</p>
                      <Badge variant="secondary">
                        {getLicenseName(selectedRegistration.licenseType)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Registration Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Registration ID</p>
                      <p className="font-mono text-sm">{selectedRegistration.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Registration Date</p>
                      <div className="flex items-centre">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{new Date(selectedRegistration.registeredAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Transaction Hash</p>
                      <p className="font-mono text-xs truncate">{selectedRegistration.txHash}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Content Hash</p>
                      <p className="font-mono text-xs truncate">{selectedRegistration.contentHash}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Licence Information</h3>
                  <LicenseInfo licenseType={selectedRegistration.licenseType} />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Usage Statistics</h3>
                  <div className="border rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Views</p>
                        <div className="flex items-centre">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{selectedRegistration.views}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Downloads</p>
                        <div className="flex items-centre">
                          <Download className="h-4 w-4 mr-1" />
                          <span>{selectedRegistration.downloads}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Visibility</p>
                        <div className="flex items-centre">
                          {selectedRegistration.visibility === 'public' ? (
                            <Eye className="h-4 w-4 mr-1 text-green-500" />
                          ) : selectedRegistration.visibility === 'private' ? (
                            <EyeOff className="h-4 w-4 mr-1 text-red-500" />
                          ) : (
                            <Lock className="h-4 w-4 mr-1 text-amber-500" />
                          )}
                          <span className="capitalize">{selectedRegistration.visibility}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Owner</p>
                        <div className="flex items-centre">
                          <User className="h-4 w-4 mr-1" />
                          <span className="font-mono text-xs truncate">You</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
            <Button onClick={() => copyVerificationLink(selectedRegistration.id)}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Verification Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Licence Information Dialog */}
      <Dialog open={showLicenseDialog} onOpenChange={setShowLicenseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Licence Types</DialogTitle>
            <DialogDescription>
              Understanding copyright licenses for educational content
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-4">
              {licenseTypes.map((licence) => (
                <div key={license.id} className="border rounded-lg p-3">
                  <h3 className="font-medium">{license.name}</h3>
                  <p className="text-sm text-muted-foreground">{license.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Choosing the Right Licence</h3>
              <p className="text-sm text-muted-foreground mb-2">
                When selecting a license for your educational content, consider:
              </p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>How you want others to be able to use your content</li>
                <li>Whether you want to allow commercial use</li>
                <li>If you want to allow modifications or adaptations</li>
                <li>Whether you want to require attribution</li>
                <li>If you want derivatives to be shared under the same licence</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowLicenseDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Credit purchase dialogue from fair usage hook */}
      <CreditPurchaseDialog />
    </div>
  );
};

// Integration with resource library
const ResourceCopyrightRegistration = ({ resource, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [licenseType, setLicenseType] = useState('cc_by_nc_sa');
  const { toast } = useToast();
  
  const handleRegister = async () => {
    setIsRegistering(true);
    
    try {
      // Mock content hash generation
      const contentHash = '0x' + Math.random().toString(16).substring(2, 66);
      
      // Register copyright on blockchain
      const result = await mockWeb3.registerCopyright(contentHash, {
        title: resource.title,
        type: resource.type,
        description: resource.description,
        licenseType: licenseType,
        visibility: 'public'
      });
      
      if (result.success) {
        onRegister(result.registrationId, licenseType);
        
        toast({
          title: "Copyright Registered",
          description: `Successfully registered copyright for: ${resource.title}`,
          variant: "success",
        });
      }
    } catch (error) {
      console.error('Error registering copyright:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register copyright",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };
  
  return (
    <div className="space-y-4 py-4">
      <div>
        <Label htmlFor="resourceLicenseType">Licence Type</Label>
        <select
          id="resourceLicenseType"
          className="w-full mt-1 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={licenseType}
          onChange={(e) => setLicenseType(e.target.value)}
        >
          {licenseTypes.map((licence) => (
            <option key={license.id} value={license.id}>
              {license.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground mt-1">
          Select the appropriate license for your resource
        </p>
      </div>
      
      <div className="flex items-centre space-x-2">
        <input type="checkbox" id="resourcePublic" className="rounded border-grey-300" defaultChecked />
        <Label htmlFor="resourcePublic">Make registration publicly visible</Label>
      </div>
      
      <Button 
        onClick={handleRegister} 
        disabled={isRegistering}
        className="w-full"
      >
        <Shield className="h-4 w-4 mr-2" />
        {isRegistering ? 'Registering...' : 'Register Copyright'}
      </Button>
    </div>
  );
};

// Integration with AI-generated content
const AIContentCopyrightRegistration = ({ content, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [licenseType, setLicenseType] = useState('cc_by');
  const { toast } = useToast();
  
  const handleRegister = async () => {
    setIsRegistering(true);
    
    try {
      // Mock content hash generation
      const contentHash = '0x' + Math.random().toString(16).substring(2, 66);
      
      // Register copyright on blockchain
      const result = await mockWeb3.registerCopyright(contentHash, {
        title: content.title,
        type: 'ai_generated',
        description: content.description,
        licenseType: licenseType,
        visibility: 'public',
        aiGenerated: true
      });
      
      if (result.success) {
        onRegister(result.registrationId, licenseType);
        
        toast({
          title: "Copyright Registered",
          description: `Successfully registered copyright for AI-generated content: ${content.title}`,
          variant: "success",
        });
      }
    } catch (error) {
      console.error('Error registering copyright:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register copyright",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };
  
  return (
    <div className="space-y-4 py-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-2">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">AI-Generated Content Notice</h4>
            <p className="text-sm text-amber-700">
              This content was generated using AI. While you can register copyright for your prompt and the resulting content, there may be limitations on copyright protection for purely AI-generated works.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="aiContentLicenseType">Licence Type</Label>
        <select
          id="aiContentLicenseType"
          className="w-full mt-1 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={licenseType}
          onChange={(e) => setLicenseType(e.target.value)}
        >
          {licenseTypes.map((licence) => (
            <option key={license.id} value={license.id}>
              {license.name}
            </option>
          ))}
        </select>
      </div>
      
      <Button 
        onClick={handleRegister} 
        disabled={isRegistering}
        className="w-full"
      >
        <Fingerprint className="h-4 w-4 mr-2" />
        {isRegistering ? 'Registering...' : 'Register AI Content'}
      </Button>
    </div>
  );
};

export { 
  CopyrightRegistrationTools, 
  ResourceCopyrightRegistration, 
  AIContentCopyrightRegistration,
  LicenseInfo
};
