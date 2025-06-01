'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Headphones, 
  MousePointer, 
  FileSpreadsheet, 
  Presentation,
  Save,
  Eye,
  Trash2,
  Plus,
  X,
  Check,
  AlertCircle,
  Info,
  History,
  GitBranch,
  GitMerge,
  GitCommit
} from 'lucide-react';

import { 
  ContentType,
  ContentStatus,
  ContentMetadata
} from '@/lib/curriculum-content/types';

/**
 * Content Version Control Component
 * 
 * Provides version control and workflow management for curriculum content
 * with features for tracking changes, managing versions, and content approval workflow.
 */
export function ContentVersionControl() {
  const { toast } = useToast();
  
  // Mock content data
  const [content, setContent] = useState<ContentMetadata | null>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [comparisonVersion, setComparisonVersion] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  
  // Workflow state
  const [currentStatus, setCurrentStatus] = useState<ContentStatus>(ContentStatus.DRAFT);
  const [reviewComments, setReviewComments] = useState<string>('');
  const [reviewers, setReviewers] = useState<string[]>([]);
  const [selectedReviewer, setSelectedReviewer] = useState<string>('');
  
  // Fetch content and version history
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // Mock data for demonstration
    const mockContent: ContentMetadata = {
      id: 'content-123',
      title: 'Introduction to Fractions',
      description: 'A comprehensive introduction to fractions for Key Stage 2',
      keyStage: 'KS2',
      subject: 'Mathematics',
      contentType: ContentType.EXPLANATION,
      status: ContentStatus.DRAFT,
      createdAt: '2025-05-20T10:30:00Z',
      updatedAt: '2025-05-30T14:45:00Z',
      createdBy: 'John Smith',
      updatedBy: 'Jane Doe'
    };
    
    const mockVersions = [
      {
        id: 'v3',
        versionNumber: '1.2',
        createdAt: '2025-05-30T14:45:00Z',
        createdBy: 'Jane Doe',
        commitMessage: 'Added visual examples and improved explanations',
        status: ContentStatus.DRAFT
      },
      {
        id: 'v2',
        versionNumber: '1.1',
        createdAt: '2025-05-25T11:20:00Z',
        createdBy: 'John Smith',
        commitMessage: 'Fixed typos and updated examples',
        status: ContentStatus.REVIEW
      },
      {
        id: 'v1',
        versionNumber: '1.0',
        createdAt: '2025-05-20T10:30:00Z',
        createdBy: 'John Smith',
        commitMessage: 'Initial version',
        status: ContentStatus.PUBLISHED
      }
    ];
    
    const mockReviewers = [
      'Sarah Johnson (Mathematics Lead)',
      'David Williams (KS2 Coordinator)',
      'Emma Brown (Educational Psychologist)',
      'Michael Taylor (Content Reviewer)'
    ];
    
    setContent(mockContent);
    setVersions(mockVersions);
    setSelectedVersion(mockVersions[0].id);
    setCurrentStatus(mockContent.status);
    setReviewers(mockReviewers);
  }, []);
  
  // Handle version selection
  const handleVersionSelect = (versionId: string) => {
    setSelectedVersion(versionId);
    if (showComparison && versionId === comparisonVersion) {
      setComparisonVersion(null);
    }
  };
  
  // Handle comparison version selection
  const handleComparisonSelect = (versionId: string) => {
    setComparisonVersion(versionId);
    setShowComparison(true);
  };
  
  // Handle status change
  const handleStatusChange = (newStatus: ContentStatus) => {
    setCurrentStatus(newStatus);
    
    // In a real implementation, this would update via API
    toast({
      title: "Status updated",
      description: `Content status changed to ${newStatus}`
    });
  };
  
  // Handle reviewer selection
  const handleAddReviewer = () => {
    if (selectedReviewer && !reviewers.includes(selectedReviewer)) {
      setReviewers(prev => [...prev, selectedReviewer]);
      setSelectedReviewer('');
      
      toast({
        title: "Reviewer added",
        description: `${selectedReviewer} has been added as a reviewer`
      });
    }
  };
  
  // Handle save version
  const handleSaveVersion = () => {
    // In a real implementation, this would save via API
    toast({
      title: "New version saved",
      description: "Your changes have been saved as a new version"
    });
  };
  
  // Handle submit for review
  const handleSubmitForReview = () => {
    handleStatusChange(ContentStatus.REVIEW);
    
    toast({
      title: "Submitted for review",
      description: "Content has been submitted for review"
    });
  };
  
  // Handle approve content
  const handleApproveContent = () => {
    handleStatusChange(ContentStatus.APPROVED);
    
    toast({
      title: "Content approved",
      description: "Content has been approved and is ready for publishing"
    });
  };
  
  // Handle publish content
  const handlePublishContent = () => {
    handleStatusChange(ContentStatus.PUBLISHED);
    
    toast({
      title: "Content published",
      description: "Content has been published and is now available to users"
    });
  };
  
  // Handle reject content
  const handleRejectContent = () => {
    if (!reviewComments.trim()) {
      toast({
        title: "Review comments required",
        description: "Please provide feedback before rejecting content",
        variant: "destructive"
      });
      return;
    }
    
    handleStatusChange(ContentStatus.REJECTED);
    
    toast({
      title: "Content rejected",
      description: "Content has been rejected and returned to the author"
    });
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Get status badge color
  const getStatusColor = (status: ContentStatus) => {
    switch (status) {
      case ContentStatus.DRAFT:
        return 'bg-yellow-500';
      case ContentStatus.REVIEW:
        return 'bg-blue-500';
      case ContentStatus.APPROVED:
        return 'bg-green-500';
      case ContentStatus.PUBLISHED:
        return 'bg-purple-500';
      case ContentStatus.ARCHIVED:
        return 'bg-gray-500';
      case ContentStatus.REJECTED:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Get selected version
  const getSelectedVersionData = () => {
    return versions.find(v => v.id === selectedVersion) || null;
  };
  
  // Get comparison version
  const getComparisonVersionData = () => {
    return versions.find(v => v.id === comparisonVersion) || null;
  };
  
  if (!content) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{content.title}</CardTitle>
              <CardDescription>{content.description}</CardDescription>
            </div>
            <Badge className={getStatusColor(currentStatus)}>
              {currentStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <span className="text-sm font-medium">Key Stage:</span>
              <span className="ml-2">{content.keyStage}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Subject:</span>
              <span className="ml-2">{content.subject}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Content Type:</span>
              <span className="ml-2">{content.contentType}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Created By:</span>
              <span className="ml-2">{content.createdBy}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Created At:</span>
              <span className="ml-2">{formatDate(content.createdAt)}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Last Updated:</span>
              <span className="ml-2">{formatDate(content.updatedAt)}</span>
            </div>
          </div>
          
          <Tabs defaultValue="versions">
            <TabsList className="mb-4">
              <TabsTrigger value="versions">Version History</TabsTrigger>
              <TabsTrigger value="workflow">Workflow Management</TabsTrigger>
              {showComparison && <TabsTrigger value="comparison">Version Comparison</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="versions">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Version History</h3>
                  <Button onClick={handleSaveVersion}>
                    <Save className="mr-2 h-4 w-4" />
                    Save New Version
                  </Button>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="p-3 text-left">Version</th>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Author</th>
                        <th className="p-3 text-left">Commit Message</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {versions.map((version) => (
                        <tr 
                          key={version.id} 
                          className={`border-t hover:bg-muted/50 ${selectedVersion === version.id ? 'bg-muted/50' : ''}`}
                        >
                          <td className="p-3">
                            <div className="flex items-center">
                              <input 
                                type="radio" 
                                name="selectedVersion"
                                checked={selectedVersion === version.id}
                                onChange={() => handleVersionSelect(version.id)}
                                className="mr-2"
                              />
                              <span>{version.versionNumber}</span>
                            </div>
                          </td>
                          <td className="p-3">{formatDate(version.createdAt)}</td>
                          <td className="p-3">{version.createdBy}</td>
                          <td className="p-3">{version.commitMessage}</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(version.status)}>
                              {version.status}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleComparisonSelect(version.id)}
                                disabled={selectedVersion === version.id}
                              >
                                <GitBranch className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => window.location.href = `/curriculum-content/view/${content.id}?version=${version.id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {selectedVersion && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Selected Version: {getSelectedVersionData()?.versionNumber}</h4>
                    <p className="text-sm mb-2">
                      <span className="font-medium">Commit Message:</span> {getSelectedVersionData()?.commitMessage}
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.href = `/curriculum-content/editor/${content.id}?version=${selectedVersion}`}
                      >
                        Edit This Version
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Handle restore version
                          toast({
                            title: "Version restored",
                            description: `Version ${getSelectedVersionData()?.versionNumber} has been restored as the current version`
                          });
                        }}
                      >
                        Restore This Version
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="workflow">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Workflow Management</h3>
                  <Badge className={getStatusColor(currentStatus)}>
                    Current Status: {currentStatus}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div className={`p-4 border rounded-lg text-center ${currentStatus === ContentStatus.DRAFT ? 'border-yellow-500 bg-yellow-50' : ''}`}>
                    <div className="flex justify-center mb-2">
                      <FileText className={`h-6 w-6 ${currentStatus === ContentStatus.DRAFT ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                    </div>
                    <h4 className="font-medium">Draft</h4>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="h-0.5 w-full bg-muted"></div>
                  </div>
                  
                  <div className={`p-4 border rounded-lg text-center ${currentStatus === ContentStatus.REVIEW ? 'border-blue-500 bg-blue-50' : ''}`}>
                    <div className="flex justify-center mb-2">
                      <Eye className={`h-6 w-6 ${currentStatus === ContentStatus.REVIEW ? 'text-blue-500' : 'text-muted-foreground'}`} />
                    </div>
                    <h4 className="font-medium">Review</h4>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="h-0.5 w-full bg-muted"></div>
                  </div>
                  
                  <div className={`p-4 border rounded-lg text-center ${currentStatus === ContentStatus.PUBLISHED ? 'border-purple-500 bg-purple-50' : ''}`}>
                    <div className="flex justify-center mb-2">
                      <BookOpen className={`h-6 w-6 ${currentStatus === ContentStatus.PUBLISHED ? 'text-purple-500' : 'text-muted-foreground'}`} />
                    </div>
                    <h4 className="font-medium">Published</h4>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Review Management</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reviewComments">Review Comments</Label>
                    <Textarea 
                      id="reviewComments"
                      value={reviewComments}
                      onChange={(e) => setReviewComments(e.target.value)}
                      placeholder="Enter feedback, suggestions, or requirements for revision..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reviewers">Assign Reviewers</Label>
                    <div className="flex space-x-2">
                      <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
                        <SelectTrigger id="reviewers" className="flex-1">
                          <SelectValue placeholder="Select reviewer" />
                        </SelectTrigger>
                        <SelectContent>
                          {reviewers.map((reviewer) => (
                            <SelectItem key={reviewer} value={reviewer}>
                              {reviewer}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleAddReviewer} disabled={!selectedReviewer}>
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  {reviewers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {reviewers.map((reviewer) => (
                        <Badge key={reviewer} variant="secondary" className="px-3 py-1">
                          {reviewer}
                          <button 
                            onClick={() => setReviewers(prev => prev.filter(r => r !== reviewer))}
                            className="ml-2 text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex flex-wrap gap-2">
                  {currentStatus === ContentStatus.DRAFT && (
                    <Button onClick={handleSubmitForReview}>
                      Submit for Review
                    </Button>
                  )}
                  
                  {currentStatus === ContentStatus.REVIEW && (
                    <>
                      <Button onClick={handleApproveContent} variant="default">
                        <Check className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button onClick={handleRejectContent} variant="destructive">
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  )}
                  
                  {currentStatus === ContentStatus.APPROVED && (
                    <Button onClick={handlePublishContent} variant="default">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Publish
                    </Button>
                  )}
                  
                  {currentStatus === ContentStatus.PUBLISHED && (
                    <Button 
                      onClick={() => handleStatusChange(ContentStatus.ARCHIVED)} 
                      variant="outline"
                    >
                      Archive
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
            
            {showComparison && (
              <TabsContent value="comparison">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Version Comparison</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowComparison(false)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Close Comparison
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">
                        Version {getSelectedVersionData()?.versionNumber}
                        <span className="text-sm font-normal ml-2">
                          ({formatDate(getSelectedVersionData()?.createdAt)})
                        </span>
                      </h4>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Author:</span> {getSelectedVersionData()?.createdBy}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Commit Message:</span> {getSelectedVersionData()?.commitMessage}
                      </p>
                      <Badge className={getStatusColor(getSelectedVersionData()?.status)}>
                        {getSelectedVersionData()?.status}
                      </Badge>
                      
                      {/* In a real implementation, this would show the actual content */}
                      <div className="mt-4 p-3 bg-muted/50 rounded-md">
                        <p className="text-sm">Content preview would appear here...</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">
                        Version {getComparisonVersionData()?.versionNumber}
                        <span className="text-sm font-normal ml-2">
                          ({formatDate(getComparisonVersionData()?.createdAt)})
                        </span>
                      </h4>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Author:</span> {getComparisonVersionData()?.createdBy}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Commit Message:</span> {getComparisonVersionData()?.commitMessage}
                      </p>
                      <Badge className={getStatusColor(getComparisonVersionData()?.status)}>
                        {getComparisonVersionData()?.status}
                      </Badge>
                      
                      {/* In a real implementation, this would show the actual content */}
                      <div className="mt-4 p-3 bg-muted/50 rounded-md">
                        <p className="text-sm">Content preview would appear here...</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        // Handle merge versions
                        toast({
                          title: "Versions merged",
                          description: `Changes from version ${getComparisonVersionData()?.versionNumber} have been merged into version ${getSelectedVersionData()?.versionNumber}`
                        });
                      }}
                    >
                      <GitMerge className="mr-2 h-4 w-4" />
                      Merge Versions
                    </Button>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
