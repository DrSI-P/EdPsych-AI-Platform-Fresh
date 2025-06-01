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
  Key
} from 'lucide-react';
import { useFairUsage } from '../subscription/fair-usage';

// Mock Web3 integration - would be replaced with actual Ethereum/Web3 implementation
const mockWeb3 = {
  // Connect to wallet
  connect: async () => {
    return { address: '0x1234...5678', connected: true };
  },
  
  // Issue a credential on blockchain
  issueCredential: async (data) => {
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      success: true,
      txHash: '0x' + Math.random().toString(16).substring(2, 34),
      timestamp: new Date().toISOString(),
      credentialId: 'cred_' + Math.random().toString(36).substring(2, 11)
    };
  },
  
  // Verify a credential
  verifyCredential: async (id) => {
    // Simulate blockchain verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      valid: true,
      issuer: '0xabcd...ef12',
      issuedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      expiresAt: new Date(Date.now() + Math.random() * 10000000000).toISOString(),
      revoked: false
    };
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
  }
};

// Credential types
const credentialTypes = [
  { id: 'course_completion', name: 'Course Completion', icon: <Award className="h-5 w-5" /> },
  { id: 'professional_certification', name: 'Professional Certification', icon: <Shield className="h-5 w-5" /> },
  { id: 'skill_badge', name: 'Skill Badge', icon: <Badge className="h-5 w-5" /> },
  { id: 'achievement', name: 'Achievement', icon: <CheckCircle className="h-5 w-5" /> },
  { id: 'attendance', name: 'Event Attendance', icon: <Clock className="h-5 w-5" /> }
];

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

// Mock credentials data
const mockCredentials = [
  {
    id: 'cred_1a2b3c4d',
    type: 'course_completion',
    title: 'Advanced Educational Psychology',
    issuer: 'EdPsych Connect Professional Development',
    issuedAt: '2025-03-15T14:30:00Z',
    expiresAt: '2028-03-15T14:30:00Z',
    description: 'Successfully completed the Advanced Educational Psychology course with distinction',
    skills: ['Educational Assessment', 'Intervention Design', 'Research Methods'],
    txHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
    verified: true
  },
  {
    id: 'cred_5e6f7g8h',
    type: 'professional_certification',
    title: 'Certified Educational Psychologist',
    issuer: 'British Psychological Society',
    issuedAt: '2024-11-22T09:15:00Z',
    expiresAt: '2027-11-22T09:15:00Z',
    description: 'Professional certification as an Educational Psychologist meeting all BPS standards',
    skills: ['Psychological Assessment', 'Educational Intervention', 'Professional Ethics'],
    txHash: '0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x',
    verified: true
  },
  {
    id: 'cred_9i0j1k2l',
    type: 'skill_badge',
    title: 'Restorative Justice Practitioner',
    issuer: 'EdPsych Connect',
    issuedAt: '2025-01-08T11:45:00Z',
    expiresAt: null,
    description: 'Demonstrated expertise in applying restorative justice principles in educational settings',
    skills: ['Conflict Resolution', 'Restorative Practices', 'Mediation'],
    txHash: '0x9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b',
    verified: true
  }
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
    verified: true
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
    verified: true
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
    verified: true
  }
];

// Main component
const BlockchainCredentialsWallet = () => {
  const { toast } = useToast();
  const { useFeatureWithCredit, CreditPurchaseDialog } = useFairUsage();
  
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('credentials');
  
  const [credentials, setCredentials] = useState(mockCredentials);
  const [copyrightRegistrations, setCopyrightRegistrations] = useState(mockCopyrightRegistrations);
  
  const [showCredentialDialog, setShowCredentialDialog] = useState(false);
  const [showCopyrightDialog, setShowCopyrightDialog] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [verificationId, setVerificationId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  
  // New credential form state
  const [newCredential, setNewCredential] = useState({
    type: 'course_completion',
    title: '',
    issuer: '',
    description: '',
    skills: ''
  });
  
  // New copyright registration form state
  const [newCopyright, setNewCopyright] = useState({
    title: '',
    type: 'document',
    description: '',
    licenseType: 'cc_by_nc_sa',
    file: null
  });
  
  // Connect wallet
  const connectWallet = async () => {
    setIsLoading(true);
    
    try {
      // Check if feature can be used (fair usage)
      const usageResult = await useFeatureWithCredit('blockchainCredentials');
      
      if (!usageResult.success && !usageResult.usedCredits) {
        // If feature cannot be used and credits weren't used, exit
        return;
      }
      
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
  
  // Issue new credential
  const issueCredential = async () => {
    setIsLoading(true);
    
    try {
      // Check if feature can be used (fair usage)
      const usageResult = await useFeatureWithCredit('blockchainCredentials');
      
      if (!usageResult.success && !usageResult.usedCredits) {
        // If feature cannot be used and credits weren't used, exit
        return;
      }
      
      // Validate form
      if (!newCredential.title || !newCredential.issuer) {
        throw new Error('Please fill in all required fields');
      }
      
      // Issue credential on blockchain
      const result = await mockWeb3.issueCredential({
        type: newCredential.type,
        title: newCredential.title,
        issuer: newCredential.issuer,
        description: newCredential.description,
        skills: newCredential.skills.split(',').map(skill => skill.trim()).filter(Boolean)
      });
      
      if (result.success) {
        // Add to credentials list
        const credential = {
          id: result.credentialId,
          type: newCredential.type,
          title: newCredential.title,
          issuer: newCredential.issuer,
          issuedAt: result.timestamp,
          expiresAt: null,
          description: newCredential.description,
          skills: newCredential.skills.split(',').map(skill => skill.trim()).filter(Boolean),
          txHash: result.txHash,
          verified: true
        };
        
        setCredentials(prev => [credential, ...prev]);
        
        toast({
          title: "Credential Issued",
          description: `Successfully issued credential: ${newCredential.title}`,
          variant: "success",
        });
        
        // Reset form and close dialogue
        setNewCredential({
          type: 'course_completion',
          title: '',
          issuer: '',
          description: '',
          skills: ''
        });
        
        setShowCredentialDialog(false);
      }
    } catch (error) {
      console.error('Error issuing credential:', error);
      toast({
        title: "Issuance Failed",
        description: error.message || "Failed to issue credential",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register copyright
  const registerCopyright = async () => {
    setIsLoading(true);
    
    try {
      // Check if feature can be used (fair usage)
      const usageResult = await useFeatureWithCredit('copyrightRegistration');
      
      if (!usageResult.success && !usageResult.usedCredits) {
        // If feature cannot be used and credits weren't used, exit
        return;
      }
      
      // Validate form
      if (!newCopyright.title || !newCopyright.type) {
        throw new Error('Please fill in all required fields');
      }
      
      // Mock file hash generation
      const contentHash = '0x' + Math.random().toString(16).substring(2, 66);
      
      // Register copyright on blockchain
      const result = await mockWeb3.registerCopyright(contentHash, {
        title: newCopyright.title,
        type: newCopyright.type,
        description: newCopyright.description,
        licenseType: newCopyright.licenseType
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
          verified: true
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
          file: null
        });
        
        setShowCopyrightDialog(false);
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
    }
  };
  
  // Verify credential or copyright
  const verifyItem = async () => {
    setIsLoading(true);
    
    try {
      if (!verificationId) {
        throw new Error('Please enter a valid verification ID');
      }
      
      let result;
      
      // Determine if it's a credential or copyright registration
      if (verificationId.startsWith('cred_')) {
        result = await mockWeb3.verifyCredential(verificationId);
        result.type = 'credential';
      } else if (verificationId.startsWith('reg_')) {
        result = await mockWeb3.verifyCopyright(verificationId);
        result.type = 'copyright';
      } else {
        throw new Error('Invalid verification ID format');
      }
      
      setVerificationResult(result);
      
      toast({
        title: "Verification Complete",
        description: result.valid ? "Item successfully verified" : "Verification failed",
        variant: result.valid ? "success" : "destructive",
      });
    } catch (error) {
      console.error('Error verifying item:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify item",
        variant: "destructive",
      });
      setVerificationResult(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Share credential
  const shareCredential = (credential) => {
    setSelectedCredential(credential);
    setShowShareDialog(true);
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
  
  // Get credential type name and icon
  const getCredentialTypeInfo = (typeId) => {
    const type = credentialTypes.find(t => t.id === typeId);
    return type || { name: typeId, icon: <Award className="h-5 w-5" /> };
  };
  
  // Render credential card
  const renderCredentialCard = (credential) => {
    const typeInfo = getCredentialTypeInfo(credential.type);
    
    return (
      <Card key={credential.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-centre">
              {typeInfo.icon}
              <Badge variant="outline" className="ml-2">
                {typeInfo.name}
              </Badge>
            </div>
            <Badge variant={credential.verified ? "success" : "outline"}>
              {credential.verified ? "Verified" : "Unverified"}
            </Badge>
          </div>
          <CardTitle className="mt-2">{credential.title}</CardTitle>
          <CardDescription>Issued by {credential.issuer}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">{credential.description}</p>
          
          {credential.skills && credential.skills.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium mb-1">Skills</p>
              <div className="flex flex-wrap gap-1">
                {credential.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-muted-foreground">
            <div>
              <p className="font-medium">Issued</p>
              <p>{new Date(credential.issuedAt).toLocaleDateString()}</p>
            </div>
            {credential.expiresAt && (
              <div>
                <p className="font-medium">Expires</p>
                <p>{new Date(credential.expiresAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Button variant="outline" size="sm" onClick={() => copyVerificationLink(credential.id)}>
            <Copy className="h-4 w-4 mr-1" />
            Copy Link
          </Button>
          <Button variant="default" size="sm" onClick={() => shareCredential(credential)}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Render copyright registration card
  const renderCopyrightCard = (registration) => {
    return (
      <Card key={registration.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge variant="outline">
              {registration.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
            <Badge variant={registration.verified ? "success" : "outline"}>
              {registration.verified ? "Verified" : "Unverified"}
            </Badge>
          </div>
          <CardTitle className="mt-2">{registration.title}</CardTitle>
          <CardDescription>
            Registered on {new Date(registration.registeredAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">{registration.description}</p>
          
          <div className="bg-muted p-2 rounded-md text-xs font-mono overflow-hidden text-ellipsis mb-3">
            {registration.contentHash}
          </div>
          
          <div className="flex items-centre mt-2">
            <p className="text-sm font-medium mr-2">Licence:</p>
            <Badge variant="secondary">
              {getLicenseName(registration.licenseType)}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Button variant="outline" size="sm" onClick={() => copyVerificationLink(registration.id)}>
            <Copy className="h-4 w-4 mr-1" />
            Copy Link
          </Button>
          <Button variant="default" size="sm" onClick={() => setSelectedRegistration(registration)}>
            <FileCheck className="h-4 w-4 mr-1" />
            Details
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-centre mb-6">
        <div>
          <h1 className="text-3xl font-bold">Blockchain Credentials Wallet</h1>
          <p className="text-muted-foreground mt-1">
            Securely manage your verified credentials and copyright registrations
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
          <TabsTrigger value="credentials">
            <Award className="h-4 w-4 mr-2" />
            Credentials
          </TabsTrigger>
          <TabsTrigger value="copyright">
            <FileCheck className="h-4 w-4 mr-2" />
            Copyright
          </TabsTrigger>
          <TabsTrigger value="verify">
            <Shield className="h-4 w-4 mr-2" />
            Verify
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="credentials" className="mt-0">
          <div className="flex justify-between items-centre mb-6">
            <h2 className="text-xl font-semibold">My Credentials</h2>
            <Button 
              onClick={() => setShowCredentialDialog(true)}
              disabled={!walletConnected || isLoading}
            >
              <Award className="h-4 w-4 mr-2" />
              Issue New Credential
            </Button>
          </div>
          
          {credentials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {credentials.map(renderCredentialCard)}
            </div>
          ) : (
            <div className="text-centre py-12 border rounded-lg">
              <Award className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Credentials Yet</h3>
              <p className="text-muted-foreground mt-1">
                Issue your first blockchain-verified credential to get started
              </p>
              <Button 
                onClick={() => setShowCredentialDialog(true)} 
                className="mt-4"
                disabled={!walletConnected || isLoading}
              >
                Issue New Credential
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="copyright" className="mt-0">
          <div className="flex justify-between items-centre mb-6">
            <h2 className="text-xl font-semibold">Copyright Registrations</h2>
            <Button 
              onClick={() => setShowCopyrightDialog(true)}
              disabled={!walletConnected || isLoading}
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
                onClick={() => setShowCopyrightDialog(true)} 
                className="mt-4"
                disabled={!walletConnected || isLoading}
              >
                Register New Copyright
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="verify" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Verify Credentials & Copyright</CardTitle>
              <CardDescription>
                Verify the authenticity of credentials and copyright registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <Label htmlFor="verificationId">Verification ID</Label>
                    <Input
                      id="verificationId"
                      placeholder="Enter credential ID or registration ID"
                      value={verificationId}
                      onChange={(e) => setVerificationId(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={verifyItem} 
                      disabled={isLoading || !verificationId}
                      className="w-full"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Verify
                    </Button>
                  </div>
                </div>
                
                {verificationResult && (
                  <div className="mt-6 border rounded-lg p-4">
                    <div className="flex items-centre mb-4">
                      {verificationResult.valid ? (
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                      )}
                      <h3 className="text-lg font-medium">
                        {verificationResult.valid ? 'Verification Successful' : 'Verification Failed'}
                      </h3>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {verificationResult.type === 'credential' ? (
                        <>
                          <div>
                            <p className="text-sm font-medium">Issuer</p>
                            <p className="text-sm font-mono">{verificationResult.issuer}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Issued At</p>
                            <p className="text-sm">
                              {new Date(verificationResult.issuedAt).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Expires At</p>
                            <p className="text-sm">
                              {verificationResult.expiresAt ? 
                                new Date(verificationResult.expiresAt).toLocaleString() : 
                                'Never'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Status</p>
                            <Badge variant={verificationResult.revoked ? "destructive" : "success"}>
                              {verificationResult.revoked ? "Revoked" : "Active"}
                            </Badge>
                          </div>
                        </>
                      ) : (
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
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Issue Credential Dialog */}
      <Dialog open={showCredentialDialog} onOpenChange={setShowCredentialDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue New Credential</DialogTitle>
            <DialogDescription>
              Create a new blockchain-verified credential
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-centre gap-4">
              <Label htmlFor="credentialType" className="text-right">
                Type
              </Label>
              <select
                id="credentialType"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newCredential.type}
                onChange={(e) => setNewCredential({...newCredential, type: e.target.value})}
              >
                {credentialTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-centre gap-4">
              <Label htmlFor="credentialTitle" className="text-right">
                Title *
              </Label>
              <Input
                id="credentialTitle"
                className="col-span-3"
                value={newCredential.title}
                onChange={(e) => setNewCredential({...newCredential, title: e.target.value})}
                placeholder="e.g., Advanced Educational Psychology Certificate"
              />
            </div>
            
            <div className="grid grid-cols-4 items-centre gap-4">
              <Label htmlFor="credentialIssuer" className="text-right">
                Issuer *
              </Label>
              <Input
                id="credentialIssuer"
                className="col-span-3"
                value={newCredential.issuer}
                onChange={(e) => setNewCredential({...newCredential, issuer: e.target.value})}
                placeholder="e.g., EdPsych Connect Professional Development"
              />
            </div>
            
            <div className="grid grid-cols-4 items-centre gap-4">
              <Label htmlFor="credentialDescription" className="text-right">
                Description
              </Label>
              <Input
                id="credentialDescription"
                className="col-span-3"
                value={newCredential.description}
                onChange={(e) => setNewCredential({...newCredential, description: e.target.value})}
                placeholder="Brief description of the credential"
              />
            </div>
            
            <div className="grid grid-cols-4 items-centre gap-4">
              <Label htmlFor="credentialSkills" className="text-right">
                Skills
              </Label>
              <Input
                id="credentialSkills"
                className="col-span-3"
                value={newCredential.skills}
                onChange={(e) => setNewCredential({...newCredential, skills: e.target.value})}
                placeholder="Comma-separated list of skills (e.g., Assessment, Intervention)"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCredentialDialog(false)}>
              Cancel
            </Button>
            <Button onClick={issueCredential} disabled={isLoading}>
              {isLoading ? 'Issuing...' : 'Issue Credential'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Register Copyright Dialog */}
      <Dialog open={showCopyrightDialog} onOpenChange={setShowCopyrightDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register New Copyright</DialogTitle>
            <DialogDescription>
              Register copyright for your educational content on the blockchain
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-centre gap-4">
              <Label htmlFor="copyrightTitle" className="text-right">
                Title *
              </Label>
              <Input
                id="copyrightTitle"
                className="col-span-3"
                value={newCopyright.title}
                onChange={(e) => setNewCopyright({...newCopyright, title: e.target.value})}
                placeholder="e.g., Inclusive Education Framework"
              />
            </div>
            
            <div className="grid grid-cols-4 items-centre gap-4">
              <Label htmlFor="copyrightType" className="text-right">
                Type *
              </Label>
              <select
                id="copyrightType"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newCopyright.type}
                onChange={(e) => setNewCopyright({...newCopyright, type: e.target.value})}
              >
                <option value="document">Document</option>
                <option value="resource_collection">Resource Collection</option>
                <option value="assessment_tool">Assessment Tool</option>
                <option value="curriculum">Curriculum</option>
                <option value="multimedia">Multimedia</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-centre gap-4">
              <Label htmlFor="copyrightDescription" className="text-right">
                Description
              </Label>
              <Input
                id="copyrightDescription"
                className="col-span-3"
                value={newCopyright.description}
                onChange={(e) => setNewCopyright({...newCopyright, description: e.target.value})}
                placeholder="Brief description of the content"
              />
            </div>
            
            <div className="grid grid-cols-4 items-centre gap-4">
              <Label htmlFor="copyrightLicense" className="text-right">
                Licence
              </Label>
              <select
                id="copyrightLicense"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newCopyright.licenseType}
                onChange={(e) => setNewCopyright({...newCopyright, licenseType: e.target.value})}
              >
                {licenseTypes.map((licence) => (
                  <option key={license.id} value={license.id}>
                    {license.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-centre gap-4">
              <Label htmlFor="copyrightFile" className="text-right">
                File
              </Label>
              <Input
                id="copyrightFile"
                type="file"
                className="col-span-3"
                onChange={(e) => setNewCopyright({...newCopyright, file: e.target.files[0]})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCopyrightDialog(false)}>
              Cancel
            </Button>
            <Button onClick={registerCopyright} disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register Copyright'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Share Credential Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Credential</DialogTitle>
            <DialogDescription>
              {selectedCredential && `Share your "${selectedCredential.title}" credential`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCredential && (
            <div className="py-4">
              <div className="flex justify-centre mb-4">
                <div className="bg-muted p-4 rounded-lg">
                  <QrCode className="h-32 w-32" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="shareLink">Verification Link</Label>
                  <div className="flex mt-1">
                    <Input
                      id="shareLink"
                      readOnly
                      value={`https://edpsychconnect.com/verify/${selectedCredential.id}`}
                    />
                    <Button 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => copyVerificationLink(selectedCredential.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label>Share Options</Label>
                  <div className="grid grid-cols-4 gap-2 mt-1">
                    <Button variant="outline" className="flex flex-col h-auto py-2">
                      <svg className="h-5 w-5 mb-1" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                      </svg>
                      Twitter
                    </Button>
                    <Button variant="outline" className="flex flex-col h-auto py-2">
                      <svg className="h-5 w-5 mb-1" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                      </svg>
                      LinkedIn
                    </Button>
                    <Button variant="outline" className="flex flex-col h-auto py-2">
                      <svg className="h-5 w-5 mb-1" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                      Email
                    </Button>
                    <Button variant="outline" className="flex flex-col h-auto py-2">
                      <Download className="h-5 w-5 mb-1" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="privacySettings">Privacy Settings</Label>
                  <select
                    id="privacySettings"
                    className="w-full mt-1 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="public">Public - Anyone with the link can view</option>
                    <option value="protected">Protected - Requires access code</option>
                    <option value="private">Private - Only you can view</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
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

export default BlockchainCredentialsWallet;
