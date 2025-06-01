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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarIcon, Clock, Video, Users, MessageSquare, Globe, Check, X, Calendar as CalendarComponent, ChevronLeft, ChevronRight, MoreHorizontal, Plus, Star, Award, Camera, Download, Share2, Sparkles, FileText, Mic, Settings, Bell, Clipboard, PlusCircle, Trash2, Edit, ExternalLink, Copy } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

// Mock data for upcoming conferences
const MOCK_CONFERENCES = [
  {
    id: '1',
    title: 'Parents\' Evening',
    description: 'Discuss Oliver\'s progress and next steps',
    date: '2025-07-15',
    time: '16:00',
    duration: 20,
    teacher: {
      id: 'teacher_1',
      name: 'Ms. Johnson',
      role: 'Year 4 Teacher',
      avatar: '/avatars/teacher1.png'
    },
    type: 'video',
    status: 'confirmed',
    link: 'https://meet.edpsychconnect.com/parents-evening/oliver-johnson',
    notes: 'We\'ll discuss reading progress and math confidence',
    documents: [
      { id: '1', name: 'Term Progress Report', type: 'pdf', url: '/documents/progress_report.pdf' }
    ],
    translation: {
      enabled: false,
      language: null
    }
  },
  {
    id: '2',
    title: 'SEND Review Meeting',
    description: 'Annual review of Oliver\'s support plan',
    date: '2025-07-22',
    time: '14:30',
    duration: 45,
    teacher: {
      id: 'teacher_2',
      name: 'Mrs. Patel',
      role: 'SENCO',
      avatar: '/avatars/teacher2.png'
    },
    type: 'in-person',
    status: 'confirmed',
    location: 'Meeting Room 3',
    notes: 'Please bring any external reports or assessments',
    documents: [
      { id: '1', name: 'Current Support Plan', type: 'pdf', url: '/documents/support_plan.pdf' },
      { id: '2', name: 'Progress Review Form', type: 'pdf', url: '/documents/progress_review.pdf' }
    ],
    translation: {
      enabled: false,
      language: null
    }
  },
  {
    id: '3',
    title: 'End of Year Celebration',
    description: 'Celebrate Oliver\'s achievements this year',
    date: '2025-07-25',
    time: '15:00',
    duration: 30,
    teacher: {
      id: 'teacher_1',
      name: 'Ms. Johnson',
      role: 'Year 4 Teacher',
      avatar: '/avatars/teacher1.png'
    },
    type: 'video',
    status: 'pending',
    link: null,
    notes: 'We\'ll review achievements and celebrate progress',
    documents: [],
    translation: {
      enabled: false,
      language: null
    }
  }
];

// Mock data for celebration items
const MOCK_CELEBRATIONS = [
  {
    id: '1',
    title: 'Reading Fluency Milestone',
    description: 'Oliver has reached 100 words per minute with 95% accuracy!',
    date: '2025-06-10',
    type: 'achievement',
    teacher: {
      id: 'teacher_1',
      name: 'Ms. Johnson',
      role: 'Year 4 Teacher',
      avatar: '/avatars/teacher1.png'
    },
    media: {
      type: 'image',
      url: '/celebrations/reading_certificate.jpg'
    },
    reactions: {
      likes: 5,
      comments: 3
    },
    comments: [
      { id: '1', author: 'Parent', text: 'We\'re so proud of Oliver\'s progress!', date: '2025-06-10' },
      { id: '2', author: 'Ms. Johnson', text: 'Oliver has been working so hard on this goal. Well deserved!', date: '2025-06-11' }
    ],
    isPublic: true
  },
  {
    id: '2',
    title: 'Math Problem-Solving Award',
    description: 'Oliver demonstrated exceptional problem-solving skills in our math challenge week.',
    date: '2025-05-20',
    type: 'award',
    teacher: {
      id: 'teacher_3',
      name: 'Mr. Williams',
      role: 'Maths Coordinator',
      avatar: '/avatars/teacher3.png'
    },
    media: {
      type: 'image',
      url: '/celebrations/math_award.jpg'
    },
    reactions: {
      likes: 7,
      comments: 2
    },
    comments: [
      { id: '1', author: 'Mr. Williams', text: 'Oliver approached complex problems with creativity and persistence.', date: '2025-05-20' },
      { id: '2', author: 'Parent', text: 'Thank you for recognising Oliver\'s efforts!', date: '2025-05-21' }
    ],
    isPublic: true
  },
  {
    id: '3',
    title: 'Social Skills Progress',
    description: 'Oliver has made significant progress in turn-taking and collaborative work.',
    date: '2025-06-05',
    type: 'progress',
    teacher: {
      id: 'teacher_1',
      name: 'Ms. Johnson',
      role: 'Year 4 Teacher',
      avatar: '/avatars/teacher1.png'
    },
    media: {
      type: 'video',
      url: '/celebrations/social_skills.mp4'
    },
    reactions: {
      likes: 4,
      comments: 1
    },
    comments: [
      { id: '1', author: 'Ms. Johnson', text: 'Oliver has been consistently demonstrating these skills in group activities.', date: '2025-06-05' }
    ],
    isPublic: false
  }
];

export default function VirtualConferenceTools() {
  const [activeTab, setActiveTab] = useState('conferences');
  const [selectedConference, setSelectedConference] = useState(MOCK_CONFERENCES[0]);
  const [selectedCelebration, setSelectedCelebration] = useState(MOCK_CELEBRATIONS[0]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showCelebrationForm, setShowCelebrationForm] = useState(false);
  const [date, setDate] = useState(new Date());
  const [newComment, setNewComment] = useState('');
  
  // Handle submitting a new comment
  const handleSubmitComment = () => {
    if (newComment.trim() === '') return;
    
    toast({
      title: "Comment Added",
      description: "Your comment has been added to the celebration.",
    });
    
    setNewComment('');
  };
  
  // Handle requesting a new conference
  const handleRequestConference = () => {
    toast({
      title: "Conference Requested",
      description: "Your conference request has been sent to the teacher.",
    });
    
    setShowRequestForm(false);
  };
  
  // Handle sharing a celebration
  const handleShareCelebration = () => {
    toast({
      title: "Celebration Shared",
      description: "The celebration has been shared with your family.",
    });
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-centre mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parent-Teacher Collaboration</h1>
          <p className="text-muted-foreground">
            Schedule conferences and celebrate progress together
          </p>
        </div>
        <div className="flex space-x-2">
          {activeTab === 'conferences' && (
            <Button onClick={() => setShowRequestForm(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Request Conference
            </Button>
          )}
          {activeTab === 'celebrations' && (
            <Button onClick={() => setShowCelebrationForm(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Celebration
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
