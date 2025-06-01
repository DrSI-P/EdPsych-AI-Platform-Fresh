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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  BarChart, 
  BookOpen, 
  Calendar, 
  Check, 
  ChevronDown, 
  Clock, 
  Edit, 
  Eye, 
  FileText, 
  Flag, 
  HelpCircle, 
  Loader2, 
  MessageSquare, 
  MoreHorizontal, 
  Search, 
  Settings, 
  Shield, 
  ThumbsDown, 
  ThumbsUp, 
  Trash, 
  User, 
  Users, 
  X
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";

// Mock data for comments awaiting moderation
const pendingComments = [
  {
    id: '101',
    postId: '1',
    postTitle: 'AI-Powered Differentiation: Transforming Inclusive Education',
    content: 'This article provides valuable insights! I\'ve been struggling with effective differentiation in my Year 4 class, especially with the wide range of abilities. I\'m going to look into the LiteracyLens platform mentioned - has anyone here had experience with it?',
    author: {
      id: '201',
      name: 'Jane Smith',
      avatar: '/avatars/jane-smith.jpg',
      role: 'Primary Teacher'
    },
    publishedAt: '2025-05-16T09:23:00',
    status: 'pending',
    flags: 0,
    reports: []
  },
  {
    id: '102',
    postId: '1',
    postTitle: 'AI-Powered Differentiation: Transforming Inclusive Education',
    content: 'As a SENCO, I\'m both excited and cautious about AI-powered differentiation. The potential benefits are clear, but I worry about over-reliance on technology and the potential loss of teacher intuition in the differentiation process. How do we ensure we\'re using these tools to enhance rather than replace professional judgment?',
    author: {
      id: '202',
      name: 'Robert Johnson',
      avatar: '/avatars/robert-johnson.jpg',
      role: 'SENCO'
    },
    publishedAt: '2025-05-16T11:42:00',
    status: 'pending',
    flags: 0,
    reports: []
  },
  {
    id: '103',
    postId: '1',
    postTitle: 'AI-Powered Differentiation: Transforming Inclusive Education',
    content: 'Check out my website for more information on AI tools for education! [spam link removed]',
    author: {
      id: '203',
      name: 'Marketing Bot',
      avatar: '/avatars/default.jpg',
      role: 'User'
    },
    publishedAt: '2025-05-16T14:30:00',
    status: 'pending',
    flags: 2,
    reports: [
      {
        id: '301',
        reason: 'spam',
        details: 'Contains promotional links',
        reporterId: '201',
        createdAt: '2025-05-16T14:35:00'
      }
    ]
  },
  {
    id: '104',
    postId: '2',
    postTitle: 'Evidence-Based Approaches to Supporting Executive Function',
    content: 'I found this article quite misleading. The research cited doesn\'t actually support the conclusions drawn, and there\'s a significant body of contradictory evidence that\'s completely ignored.',
    author: {
      id: '204',
      name: 'Dr. Patricia Lee',
      avatar: '/avatars/patricia-lee.jpg',
      role: 'Researcher'
    },
    publishedAt: '2025-05-16T16:20:00',
    status: 'pending',
    flags: 1,
    reports: [
      {
        id: '302',
        reason: 'misinformation',
        details: 'This comment makes claims about research without providing evidence',
        reporterId: '205',
        createdAt: '2025-05-16T16:45:00'
      }
    ]
  },
  {
    id: '105',
    postId: '3',
    postTitle: 'The Future of Assessment: Beyond Traditional Testing',
    content: 'This is a terrible article and the author clearly doesn\'t know what they\'re talking about. Anyone who believes this nonsense is an idiot.',
    author: {
      id: '206',
      name: 'Anonymous User',
      avatar: '/avatars/default.jpg',
      role: 'User'
    },
    publishedAt: '2025-05-16T18:10:00',
    status: 'pending',
    flags: 3,
    reports: [
      {
        id: '303',
        reason: 'harassment',
        details: 'Insulting language directed at author and readers',
        reporterId: '207',
        createdAt: '2025-05-16T18:15:00'
      }
    ]
  }
];

// Mock data for moderation statistics
const moderationStats = {
  pending: 12,
  approved: 87,
  rejected: 23,
  flagged: 8,
  totalReports: 31,
  averageResponseTime: '1.4 hours',
  topReportReasons: [
    { reason: 'spam', count: 14 },
    { reason: 'harassment', count: 9 },
    { reason: 'misinformation', count: 5 },
    { reason: 'inappropriate', count: 3 }
  ],
  moderationByDay: [
    { day: 'Mon', approved: 12, rejected: 3 },
    { day: 'Tue', approved: 15, rejected: 4 },
    { day: 'Wed', approved: 18, rejected: 5 },
    { day: 'Thu', approved: 14, rejected: 3 },
    { day: 'Fri', approved: 16, rejected: 6 },
    { day: 'Sat', approved: 8, rejected: 1 },
    { day: 'Sun', approved: 4, rejected: 1 }
  ]
};

const CommentModerationDashboard = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedComment, setSelectedComment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredComments, setFilteredComments] = useState(pendingComments);
  
  // Filter comments based on search query
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    const filtered = pendingComments.filter(comment => 
      comment.content.toLowerCase().includes(query) || 
      comment.author.name.toLowerCase().includes(query) ||
      comment.postTitle.toLowerCase().includes(query)
    );
    setFilteredComments(filtered);
  };
  
  // Clear search filters
  const clearSearch = () => {
    setSearchQuery("");
    setFilteredComments(pendingComments);
  };
  
  // Handle comment approval
  const handleApprove = (comment) => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      // Remove from list
      setFilteredComments(filteredComments.filter(c => c.id !== comment.id));
      toast({
        title: "Comment approved",
        description: "The comment has been published successfully.",
      });
    }, 1000);
  };
  
  // Open rejection dialog
  const openRejectionDialog = (comment) => {
    setSelectedComment(comment);
    setRejectionReason("");
    setShowRejectionDialog(true);
  };
  
  // Handle comment rejection
  const handleReject = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowRejectionDialog(false);
      // Remove from list
      if (selectedComment) {
        setFilteredComments(filteredComments.filter(c => c.id !== selectedComment.id));
      }
      toast({
        title: "Comment rejected",
        description: "The comment has been rejected and will not be published.",
      });
    }, 1000);
  };
  
  // Handle comment flagging for review
  const handleFlag = (comment) => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      // Update status in list
      const updatedComments = filteredComments.map(c => 
        c.id === comment.id ? { ...c, status: 'flagged' } : c
      );
      setFilteredComments(updatedComments);
      toast({
        title: "Comment flagged",
        description: "The comment has been flagged for further review.",
      });
    }, 1000);
  };
  
  // Handle comment deletion
  const handleDelete = (comment) => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      // Remove from list
      setFilteredComments(filteredComments.filter(c => c.id !== comment.id));
      toast({
        title: "Comment deleted",
        description: "The comment has been permanently deleted.",
      });
    }, 1000);
  };
  
  // Render comment list
  const renderCommentList = () => (
    <div className="space-y-4">
      {filteredComments.length > 0 ? (
        filteredComments.map((comment) => (
          <Card key={comment.id} className={comment.flags > 0 ? "border-yellow-200 bg-yellow-50" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{comment.author.name}</p>
                    <p className="text-xs text-muted-foreground">{comment.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {comment.flags > 0 && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      <Flag className="h-3 w-3 mr-1" />
                      {comment.flags} {comment.flags === 1 ? 'flag' : 'flags'}
                    </Badge>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {new Date(comment.publishedAt).toLocaleString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                On post: <span className="font-medium">{comment.postTitle}</span>
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{comment.content}</p>
              
              {comment.reports && comment.reports.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                  <h4 className="text-sm font-medium text-red-800 flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    Reported Content
                  </h4>
                  <div className="mt-2 space-y-2">
                    {comment.reports.map((report) => (
                      <div key={report.id} className="text-xs text-red-700">
                        <p className="font-medium">Reason: {report.reason}</p>
                        {report.details && <p>Details: {report.details}</p>}
                        <p className="text-xs text-red-500">
                          Reported on {new Date(report.createdAt).toLocaleString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleFlag(comment)}
                disabled={isProcessing}
              >
                <Flag className="h-4 w-4 mr-2" />
                Flag
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(comment)}
                disabled={isProcessing}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 hover:text-red-700"
                onClick={() => openRejectionDialog(comment)}
                disabled={isProcessing}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => handleApprove(comment)}
                disabled={isProcessing}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No comments to moderate</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {searchQuery ? "No comments match your search criteria" : "All comments have been moderated"}
          </p>
          {searchQuery && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={clearSearch}
            >
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
  
  // Render statistics dashboard
  const renderStatsDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moderationStats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{moderationStats.approved}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{moderationStats.rejected}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Flagged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{moderationStats.flagged}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  
  return (
    <div className="comment-moderation-dashboard">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Comment Moderation</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search comments..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
          
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="flagged">Most flagged</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">
              Pending
              <Badge variant="secondary" className="ml-2">{moderationStats.pending}</Badge>
            </TabsTrigger>
            <TabsTrigger value="flagged">
              Flagged
              <Badge variant="secondary" className="ml-2">{moderationStats.flagged}</Badge>
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4">
            {renderCommentList()}
          </TabsContent>
          
          <TabsContent value="flagged" className="space-y-4">
            {/* Similar to pending but with flagged comments */}
            <div className="text-center py-12">
              <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No flagged comments</h3>
              <p className="text-sm text-muted-foreground mt-2">
                All flagged comments have been reviewed
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            {/* Comment moderation history */}
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Moderation History</h3>
              <p className="text-sm text-muted-foreground mt-2">
                View a log of all moderation actions
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            {renderStatsDashboard()}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Comment</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this comment. This will not be visible to the user.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="notify-user" />
              <Label htmlFor="notify-user">Notify user of rejection</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectionDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleReject} disabled={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentModerationDashboard;
