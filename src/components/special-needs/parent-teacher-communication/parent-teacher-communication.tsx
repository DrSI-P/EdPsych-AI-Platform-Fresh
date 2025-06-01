'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  AlertCircle,
  Bell,
  BookOpen,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Forward,
  Heart,
  HelpCircle,
  Image as ImageIcon,
  Info,
  Layers,
  Lock,
  MessageCircle,
  MessageSquare,
  Mic,
  PenTool,
  Phone,
  Plus,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  Star,
  ThumbsUp,
  Trash2,
  User,
  UserPlus,
  Users,
  Video,
  Volume2,
  VolumeX,
  X
} from "lucide-react";
import Image from "next/image";

// Define types for our data structures
type Attachment = {
  name: string;
  type: string;
  size: string;
};

type Message = {
  id: string;
  sender: string;
  senderRole: string;
  recipient: string;
  recipientRole: string;
  subject: string;
  content: string;
  date: string;
  emotionalFocus: string;
  priority: string;
  isRead: boolean;
  hasAttachments: boolean;
  attachments?: Attachment[];
};

type Participant = {
  name: string;
  role: string;
};

type Meeting = {
  id: string;
  title: string;
  date: string;
  duration: string;
  organizer: string;
  organizerRole: string;
  participants: Participant[];
  location: string;
  status: string;
  agenda: string;
  emotionalFocus: string;
  notes: string;
};

type Report = {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  date: string;
  type: string;
  student: string;
  period: string;
  emotionalFocus: string;
  content: string;
  hasAttachments: boolean;
  attachments: Attachment[];
};

const ParentTeacherCommunication = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("messages");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageType, setMessageType] = useState("all");
  const [emotionalFocus, setEmotionalFocus] = useState("all");
  const [messages, setMessages] = useState<Message[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [newMessage, setNewMessage] = useState({
    recipient: "",
    subject: "",
    content: "",
    emotionalFocus: "general",
    priority: "normal",
    attachments: []
  });
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: new Date(),
    time: "15:00",
    duration: "30",
    participants: [],
    location: "online",
    agenda: "",
    emotionalFocus: "general"
  });
  const [newParticipant, setNewParticipant] = useState("");
  const [date, setDate] = useState(new Date());
  
  // Memoize mock data to prevent recreation on each render
  const mockMessages = useMemo(() => [
    {
      id: "m1",
      sender: "Ms. Thompson",
      senderRole: "teacher",
      recipient: "Mr. & Mrs. Johnson",
      recipientRole: "parent",
      subject: "Weekly emotional wellbeing update for Alex",
      content: "Dear Mr. and Mrs. Johnson,\n\nI wanted to share a positive update on Alex\'s emotional regulation progress this week. He\'s been using the breathing techniques we practiced when feeling frustrated, and I\'ve noticed he\'s able to calm himself more quickly. He mentioned feeling proud of this achievement.\n\nHe did have a challenging moment during group work on Tuesday, but was able to use his words to express his feelings instead of withdrawing as he might have done previously.\n\nIs there anything you\'ve noticed at home that might help us continue supporting his emotional regulation at school?\n\nBest regards,\nMs. Thompson",
      date: "2025-05-15T14:30:00Z",
      emotionalFocus: "regulation",
      priority: "normal",
      isRead: true,
      hasAttachments: false
    },
    {
      id: "m2",
      sender: "Dr. Martinez",
      senderRole: "counselor",
      recipient: "Ms. Thompson",
      recipientRole: "teacher",
      subject: "Strategies for supporting Jamie's anxiety",
      content: "Hi Ms. Thompson,\n\nFollowing our meeting about Jamie's test anxiety, I've put together some specific strategies that might help in the classroom:\n\n1. Allow Jamie to take a 2-minute breathing break before tests begin\n2. Consider seating Jamie away from distractions during assessments\n3. Provide a visual schedule so Jamie knows when tests are coming up\n4. Offer positive reinforcement for using coping strategies, regardless of test results\n\nJamie has been practicing these techniques during our sessions and is making good progress. Let me know if you notice any changes or have questions.\n\nBest,\nDr. Martinez",
      date: "2025-05-14T11:15:00Z",
      emotionalFocus: "anxiety",
      priority: "high",
      isRead: true,
      hasAttachments: true,
      attachments: [
        {
          name: "Anxiety_Support_Strategies.pdf",
          type: "pdf",
          size: "1.2 MB"
        }
      ]
    },
    {
      id: "m3",
      sender: "Mr. Johnson",
      senderRole: "parent",
      recipient: "Ms. Thompson",
      recipientRole: "teacher",
      subject: "Re: Weekly emotional wellbeing update for Alex",
      content: "Dear Ms. Thompson,\n\nThank you for the update on Alex's progress. We've definitely noticed improvement at home as well. He's been more open about his feelings and has started using his words when frustrated with his sister instead of slamming doors.\n\nOne thing we've found helpful is giving him a few minutes of quiet time when he first gets home from school to decompress before jumping into homework or activities. He seems to need that transition time.\n\nWe're so grateful for your attention to his emotional development alongside the academic work.\n\nBest regards,\nMichael Johnson",
      date: "2025-05-16T19:45:00Z",
      emotionalFocus: "regulation",
      priority: "normal",
      isRead: false,
      hasAttachments: false
    },
    {
      id: "m4",
      sender: "Ms. Williams",
      senderRole: "teacher",
      recipient: "All Parents",
      recipientRole: "parent",
      subject: "Emotional literacy focus for next week",
      content: "Dear Parents,\n\nNext week, our class will be focusing on identifying and naming complex emotions as part of our emotional literacy curriculum. We'll be exploring emotions like disappointment, pride, jealousy, and contentment through stories, art, and group discussions.\n\nYou can support this learning at home by:\n- Asking open-ended questions about how characters in books or shows might be feeling\n- Sharing appropriate examples of when you've experienced these emotions\n- Using specific emotion words rather than just 'happy', 'sad', or 'angry'\n\nI've attached our emotion vocabulary list if you'd like to review the words we'll be using.\n\nThank you for your partnership in supporting your child's emotional development.\n\nBest regards,\nMs. Williams",
      date: "2025-05-13T16:20:00Z",
      emotionalFocus: "literacy",
      priority: "normal",
      isRead: true,
      hasAttachments: true,
      attachments: [
        {
          name: "Emotion_Vocabulary_List.pdf",
          type: "pdf",
          size: "843 KB"
        }
      ]
    },
    {
      id: "m5",
      sender: "Principal Chen",
      senderRole: "administrator",
      recipient: "All Staff",
      recipientRole: "teacher",
      subject: "New emotional wellbeing resources available",
      content: "Dear Staff,\n\nI'm pleased to announce that we've added several new resources to support student emotional wellbeing:\n\n1. The mindfulness corner in the library has been expanded with new books and guided practise cards\n2. Each classroom will receive a set of emotion regulation visual supports next week\n3. The staff resource drive now includes a folder of parent handouts on supporting emotional development at home\n4. We've scheduled additional training on trauma-informed practices for next month\n\nPlease take some time to explore these resources and consider how they might support your students. Dr. Martinez is available to help you implement any of these tools in your classroom.\n\nThank you for your continued dedication to our students' emotional wellbeing.\n\nBest regards,\nPrincipal Chen",
      date: "2025-05-12T09:30:00Z",
      emotionalFocus: "resources",
      priority: "normal",
      isRead: true,
      hasAttachments: false
    }
  ], []);
  
  // Mock data for meetings
  const mockMeetings = useMemo(() => [
    {
      id: "mt1",
      title: "Alex's Emotional Regulation Progress Review",
      date: "2025-05-20T15:00:00Z",
      duration: "30",
      organizer: "Ms. Thompson",
      organizerRole: "teacher",
      participants: [
        { name: "Ms. Thompson", role: "teacher" },
        { name: "Mr. Johnson", role: "parent" },
        { name: "Mrs. Johnson", role: "parent" },
        { name: "Dr. Martinez", role: "counselor" }
      ],
      location: "online",
      status: "scheduled",
      agenda: "1. Review emotional regulation progress\n2. Discuss strategies that are working\n3. Identify areas for continued support\n4. Set goals for next month\n5. Questions and next steps",
      emotionalFocus: "regulation",
      notes: ""
    },
    {
      id: "mt2",
      title: "Jamie's Anxiety Support Planning",
      date: "2025-05-18T14:00:00Z",
      duration: "45",
      organizer: "Dr. Martinez",
      organizerRole: "counselor",
      participants: [
        { name: "Dr. Martinez", role: "counselor" },
        { name: "Ms. Thompson", role: "teacher" },
        { name: "Mr. & Mrs. Smith", role: "parent" },
        { name: "Jamie Smith", role: "student" }
      ],
      location: "Counseling Office",
      status: "scheduled",
      agenda: "1. Review Jamie's anxiety triggers\n2. Discuss coping strategies being used\n3. Develop plan for upcoming exam period\n4. Coordinate home and school support\n5. Set check-in schedule",
      emotionalFocus: "anxiety",
      notes: ""
    },
    {
      id: "mt3",
      title: "Emotional Literacy Curriculum Planning",
      date: "2025-05-22T16:30:00Z",
      duration: "60",
      organizer: "Ms. Williams",
      organizerRole: "teacher",
      participants: [
        { name: "Ms. Williams", role: "teacher" },
        { name: "Dr. Martinez", role: "counselor" },
        { name: "Ms. Thompson", role: "teacher" },
        { name: "Mr. Davis", role: "teacher" }
      ],
      location: "Staff Room",
      status: "scheduled",
      agenda: "1. Review current emotional literacy curriculum\n2. Discuss age-appropriate adjustments\n3. Plan integration with academic subjects\n4. Develop parent communication strategy\n5. Create assessment approach",
      emotionalFocus: "literacy",
      notes: ""
    },
    {
      id: "mt4",
      title: "Parent Workshop: Supporting Emotional Regulation at Home",
      date: "2025-05-25T18:00:00Z",
      duration: "90",
      organizer: "Dr. Martinez",
      organizerRole: "counselor",
      participants: [
        { name: "Dr. Martinez", role: "counselor" },
        { name: "Principal Chen", role: "administrator" },
        { name: "All Parents", role: "parent" }
      ],
      location: "School Hall",
      status: "scheduled",
      agenda: "1. Introduction to emotional regulation\n2. Age-appropriate expectations\n3. Practical strategies for home\n4. Handling emotional outbursts\n5. When to seek additional support\n6. Q&A session",
      emotionalFocus: "regulation",
      notes: ""
    },
    {
      id: "mt5",
      title: "Transition Planning for Taylor",
      date: "2025-05-19T09:15:00Z",
      duration: "45",
      organizer: "Ms. Thompson",
      organizerRole: "teacher",
      participants: [
        { name: "Ms. Thompson", role: "teacher" },
        { name: "Mr. & Mrs. Wilson", role: "parent" },
        { name: "Dr. Martinez", role: "counselor" },
        { name: "Ms. Roberts", role: "receiving teacher" }
      ],
      location: "Conference Room",
      status: "scheduled",
      agenda: "1. Review Taylor's emotional needs during transitions\n2. Discuss successful strategies from current classroom\n3. Plan gradual introduction to new classroom\n4. Create visual supports for transition\n5. Schedule follow-up check-ins",
      emotionalFocus: "transitions",
      notes: ""
    }
  ], []);
  
  // Mock data for reports
  const mockReports = useMemo(() => [
    {
      id: "r1",
      title: "Alex Johnson - Emotional Regulation Progress Report",
      author: "Ms. Thompson",
      authorRole: "teacher",
      date: "2025-05-10T00:00:00Z",
      type: "progress",
      student: "Alex Johnson",
      period: "April-May 2025",
      emotionalFocus: "regulation",
      content: "## Overview\nThis report summarizes Alex's emotional regulation progress over the past month, highlighting strengths, challenges, and strategies that have been effective.\n\n## Key Observations\n- Significant improvement in using words to express frustration instead of physical reactions\n- Successfully using breathing techniques to self-regulate in 7 out of 10 observed instances\n- Still finding group work emotionally challenging, but duration of dysregulation has decreased\n- Showing pride in emotional regulation achievements\n\n## Effective Strategies\n- Visual emotion thermometer for self-monitoring\n- 5-minute break card (used appropriately)\n- Breathing buddy during whole-class activities\n- Positive reinforcement of regulation attempts\n\n## Recommendations\n- Continue consistent use of visual supports\n- Gradually increase duration of group activities\n- Maintain regular check-ins at transition times\n- Celebrate and acknowledge regulation successes\n\n## Next Steps\n- Review progress in parent-teacher meeting on May 20\n- Introduce more complex social scenarios as regulation skills strengthen\n- Begin peer mentoring opportunity in June if progress continues",
      hasAttachments: true,
      attachments: [
        {
          name: "Emotional_Regulation_Data_Chart.pdf",
          type: "pdf",
          size: "1.1 MB"
        }
      ]
    },
    {
      id: "r2",
      title: "Jamie Smith - Anxiety Support Plan",
      author: "Dr. Martinez",
      authorRole: "counselor",
      date: "2025-05-08T00:00:00Z",
      type: "plan",
      student: "Jamie Smith",
      period: "May-June 2025",
      emotionalFocus: "anxiety",
      content: "## Background\nJamie has been experiencing test anxiety that impacts performance and emotional wellbeing. This plan outlines specific strategies and accommodations to support Jamie's anxiety management.\n\n## Identified Triggers\n- Timed assessments\n- Unexpected changes to test format\n- Perception of being watched while working\n- Comparison with peers\n\n## Support Strategies\n### Classroom Accommodations\n- Provide test preview 5 minutes before starting\n- Allow for separate seating during assessments\n- Permit use of noise-cancelling headphones\n- Give time warnings in writing rather than verbally\n\n### Coping Techniques\n- 4-7-8 breathing technique before beginning work\n- Positive self-talk scripts (provided in attachment)\n- Progressive muscle relaxation during breaks\n- Thought challenging worksheet for anxious thoughts\n\n### Communication Plan\n- Weekly check-in with Ms. Thompson\n- Bi-weekly counseling sessions\n- Monthly parent update\n- Student self-assessment after each test\n\n## Success Measures\n- Reduction in physical anxiety symptoms\n- Improved test completion rates\n- Self-reported anxiety levels (1-10 scale)\n- Use of coping strategies without prompting\n\n## Review Timeline\nThis plan will be reviewed after each major assessment and formally updated at the end of June 2025.",
      hasAttachments: true,
      attachments: [
        {
          name: "Anxiety_Coping_Scripts.pdf",
          type: "pdf",
          size: "645 KB"
        },
        {
          name: "Test_Anxiety_Accommodations.pdf",
          type: "pdf",
          size: "823 KB"
        }
      ]
    },
    {
      id: "r3",
      title: "Emotional Literacy Curriculum - Term 3 Overview",
      author: "Ms. Williams",
      authorRole: "teacher",
      date: "2025-05-05T00:00:00Z",
      type: "curriculum",
      student: "All Students",
      period: "Term 3 2025",
      emotionalFocus: "literacy",
      content: "## Curriculum Focus\nThis document outlines our emotional literacy focus for Term 3, including learning objectives, key activities, and home connection opportunities.\n\n## Learning Objectives\nStudents will be able to:\n- Identify and name at least 15 distinct emotions\n- Recognise emotional cues in facial expressions, body language, and tone of voice\n- Express their own emotions using specific vocabulary\n- Identify emotions in literature and relate to character experiences\n- Understand how emotions influence behaviour and decision-making\n\n## Weekly Focus\n### Week 1: Emotion Vocabulary Expansion\n- Introduction to emotion families (mad, sad, glad, scared)\n- Emotion intensity scales\n- Creating personal emotion dictionaries\n\n### Week 2: Emotional Body Awareness\n- Where do we feel emotions in our bodies?\n- Body mapping activities\n- Somatic awareness practices\n\n### Week 3: Emotions in Literature\n- Character emotion analysis\n- Perspective-taking exercises\n- Emotion prediction in stories\n\n### Week 4: Emotional Expression\n- Appropriate ways to express different emotions\n- Creative arts for emotional expression\n- Emotion communication role-plays\n\n## Assessment Approaches\n- Emotion vocabulary assessments\n- Observation of emotional identification in contexts\n- Self-reflection journals\n- Creative projects demonstrating understanding\n\n## Home Connection\nWeekly activities will be sent home to reinforce classroom learning. Parents are encouraged to use specific emotion vocabulary and discuss characters' feelings in books and media.",
      hasAttachments: true,
      attachments: [
        {
          name: "Emotional_Literacy_Activities.pdf",
          type: "pdf",
          size: "1.8 MB"
        }
      ]
    },
    {
      id: "r4",
      title: "Taylor Wilson - Transition Support Plan",
      author: "Dr. Martinez",
      authorRole: "counselor",
      date: "2025-05-12T00:00:00Z",
      type: "plan",
      student: "Taylor Wilson",
      period: "May-September 2025",
      emotionalFocus: "transitions",
      content: "## Background\nTaylor experiences significant anxiety during transitions and will be moving to a new classroom next term. This plan outlines strategies to support emotional wellbeing during this transition.\n\n## Current Observations\n- Shows distress through withdrawal and reluctance to engage\n- Experiences sleep disruption before anticipated changes\n- Benefits from visual schedules and advance preparation\n- Has strong relationship with current teacher (Ms. Thompson)\n\n## Transition Timeline\n### May 2025\n- Introduction to new classroom through photos and virtual tour\n- Social story about classroom change (reviewed weekly)\n- Initial meeting with new teacher in familiar environment\n\n### June 2025\n- Weekly 30-minute visits to new classroom with familiar adult\n- Identification of safe space in new environment\n- Creation of transition comfort kit\n\n### July-August 2025 (Summer)\n- Maintain predictable routine at home\n- Weekly school visits to maintain familiarity\n- Review social story and classroom photos regularly\n\n### September 2025\n- Arrive early on first day to settle before others\n- Check-in system with trusted adult\n- Gradual increase in new classroom time if needed\n\n## Support Strategies\n- Visual schedule for each day\n- Transition warning system\n- Comfort object permission\n- Calm-down corner access\n- Check-in/check-out routine\n\n## Communication Plan\n- Weekly parent-teacher email updates\n- Daily emotional check-in with Taylor\n- Regular team meetings during transition period\n\n## Success Indicators\n- Reduced anxiety symptoms before/during transitions\n- Increased engagement in new classroom\n- Self-regulation strategy use\n- Positive statements about new environment",
      hasAttachments: true,
      attachments: [
        {
          name: "Transition_Social_Story.pdf",
          type: "pdf",
          size: "1.2 MB"
        },
        {
          name: "Classroom_Transition_Photos.pdf",
          type: "pdf",
          size: "2.3 MB"
        }
      ]
    },
    {
      id: "r5",
      title: "Emotional Wellbeing Survey Results - Spring 2025",
      author: "Principal Chen",
      authorRole: "administrator",
      date: "2025-05-03T00:00:00Z",
      type: "survey",
      student: "All Students",
      period: "Spring 2025",
      emotionalFocus: "general",
      content: "## Survey Overview\nThis report summarizes the results of our Spring 2025 Emotional Wellbeing Survey, which was completed by 245 students across all year groups.\n\n## Key Findings\n\n### Emotional Awareness\n- 78% of students could identify their emotions using specific vocabulary\n- 65% reported understanding how emotions affect their behaviour\n- 82% could recognise when they need emotional support\n\n### Regulation Strategies\n- Most commonly used strategies: deep breathing, taking a break, talking to someone\n- 70% of students reported having at least 3 effective regulation strategies\n- 58% felt confident in their ability to manage strong emotions\n\n### School Climate\n- 85% of students feel there is an adult at school they can talk to about feelings\n- 73% report feeling emotionally safe in their classroom\n- 62% feel comfortable expressing emotions at school\n\n### Areas for Growth\n- Managing emotions during peer conflicts (only 45% confidence)\n- Handling academic disappointment (53% confidence)\n- Expressing needs to adults (60% confidence)\n\n## Comparison to Previous Survey\n- 12% increase in emotional vocabulary\n- 8% increase in regulation strategy use\n- 15% increase in identifying trusted adults at school\n\n## Recommendations\n1. Continue focus on emotional vocabulary across curriculum\n2. Increase teaching of strategies for peer conflict resolution\n3. Develop additional supports for managing academic disappointment\n4. Enhance opportunities for student-teacher emotional check-ins\n\n## Next Steps\nThese results will inform our emotional wellbeing action plan for the coming term. Grade-level teams will receive specific data for their students to support targeted interventions.",
      hasAttachments: true,
      attachments: [
        {
          name: "Emotional_Wellbeing_Survey_Data.pdf",
          type: "pdf",
          size: "2.4 MB"
        }
      ]
    }
  ], []);
  
  // Define fetchData before it's used in useEffect
  const fetchData = useCallback(async () => {
    let timeoutId;
    try {
      setIsLoading(true);
      
      // In a real implementation, we would fetch data from the API
      // For now, we'll simulate loading with a timeout
      timeoutId = setTimeout(() => {
        setMessages(mockMessages);
        setMeetings(mockMeetings);
        setReports(mockReports);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive"
      });
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [toast]); // Remove mockMessages, mockMeetings, mockReports from dependencies as they're already memoized
  
  // Load data on component mount
  useEffect(() => {
    let cleanup;
    if (session?.user) {
      cleanup = fetchData();
    }
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [session, fetchData]);
  
  const handleCreateMessage = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Validate message
      if (!newMessage.recipient.trim()) {
        toast({
          title: "Error",
          description: "Please select a recipient for your message.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      if (!newMessage.subject.trim()) {
        toast({
          title: "Error",
          description: "Please provide a subject for your message.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      if (!newMessage.content.trim()) {
        toast({
          title: "Error",
          description: "Please write the content of your message.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/parent-teacher-communication/messages', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newMessage),
      // });
      // const data = await response.json();
      
      // Simulating API response
      setTimeout(() => {
        const newMessageObj = {
          id: `m${messages.length + 1}`,
          sender: session?.user?.name || "Current User",
          senderRole: session?.user?.role || "teacher",
          recipient: newMessage.recipient,
          recipientRole: newMessage.recipient.toLowerCase().includes("parent") ? "parent" : 
                        newMessage.recipient.toLowerCase().includes("student") ? "student" : "teacher",
          subject: newMessage.subject,
          content: newMessage.content,
          date: new Date().toISOString(),
          emotionalFocus: newMessage.emotionalFocus,
          priority: newMessage.priority,
          isRead: false,
          hasAttachments: newMessage.attachments.length > 0,
          attachments: newMessage.attachments
        };
        
        setMessages([newMessageObj, ...messages]);
        
        // Reset form
        setNewMessage({
          recipient: "",
          subject: "",
          content: "",
          emotionalFocus: "general",
          priority: "normal",
          attachments: []
        });
        
        setIsLoading(false);
        toast({
          title: "Success",
          description: "Your message has been sent.",
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  }, [newMessage, messages, session, toast]);
  
  const handleCreateMeeting = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Validate meeting
      if (!newMeeting.title.trim()) {
        toast({
          title: "Error",
          description: "Please provide a title for the meeting.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      if (newMeeting.participants.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one participant to the meeting.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/parent-teacher-communication/meetings', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newMeeting),
      // });
      // const data = await response.json();
      
      // Simulating API response
      setTimeout(() => {
        const meetingDate = new Date(newMeeting.date);
        const [hours, minutes] = newMeeting.time.split(':').map(Number);
        meetingDate.setHours(hours, minutes);
        
        const newMeetingObj = {
          id: `mt${meetings.length + 1}`,
          title: newMeeting.title,
          date: meetingDate.toISOString(),
          duration: newMeeting.duration,
          organizer: session?.user?.name || "Current User",
          organizerRole: session?.user?.role || "teacher",
          participants: [
            { name: session?.user?.name || "Current User", role: session?.user?.role || "teacher" },
            ...newMeeting.participants.map(p => {
              const role = p.toLowerCase().includes("parent") ? "parent" : 
                          p.toLowerCase().includes("student") ? "student" : 
                          p.toLowerCase().includes("counselor") ? "counselor" : 
                          p.toLowerCase().includes("principal") ? "administrator" : "teacher";
              return { name: p, role };
            })
          ],
          location: newMeeting.location,
          status: "scheduled",
          agenda: newMeeting.agenda,
          emotionalFocus: newMeeting.emotionalFocus,
          notes: ""
        };
        
        setMeetings([newMeetingObj, ...meetings]);
        
        // Reset form
        setNewMeeting({
          title: "",
          date: new Date(),
          time: "15:00",
          duration: "30",
          participants: [],
          location: "online",
          agenda: "",
          emotionalFocus: "general"
        });
        
        setIsLoading(false);
        toast({
          title: "Success",
          description: "Your meeting has been scheduled.",
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to schedule meeting. Please try again.",
        variant: "destructive"
      });
    }
  }, [newMeeting, meetings, session, toast]);
  
  const handleAddParticipant = useCallback(() => {
    if (newParticipant.trim() && !newMeeting.participants.includes(newParticipant.trim())) {
      setNewMeeting({
        ...newMeeting,
        participants: [...newMeeting.participants, newParticipant.trim()]
      });
      setNewParticipant("");
    }
  }, [newMeeting, newParticipant]);
  
  const handleRemoveParticipant = useCallback((participantToRemove) => {
    setNewMeeting({
      ...newMeeting,
      participants: newMeeting.participants.filter(p => p !== participantToRemove)
    });
  }, [newMeeting]);
  
  const getFilteredMessages = useCallback(() => {
    let filtered = [...messages];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(message => {
        return (
          message.subject.toLowerCase().includes(query) ||
          message.content.toLowerCase().includes(query) ||
          message.sender.toLowerCase().includes(query) ||
          message.recipient.toLowerCase().includes(query)
        );
      });
    }
    
    // Apply message type filter
    if (messageType !== "all") {
      filtered = filtered.filter(message => {
        if (messageType === "sent") return message.senderRole === (session?.user?.role || "teacher");
        if (messageType === "received") return message.recipientRole === (session?.user?.role || "teacher");
        if (messageType === "unread") return !message.isRead;
        return true;
      });
    }
    
    // Apply emotional focus filter
    if (emotionalFocus !== "all") {
      filtered = filtered.filter(message => message.emotionalFocus === emotionalFocus);
    }
    
    return filtered;
  }, [messages, searchQuery, messageType, emotionalFocus, session]);
  
  const getFilteredMeetings = useCallback(() => {
    let filtered = [...meetings];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(meeting => {
        return (
          meeting.title.toLowerCase().includes(query) ||
          meeting.agenda.toLowerCase().includes(query) ||
          meeting.participants.some(p => p.name.toLowerCase().includes(query))
        );
      });
    }
    
    // Apply emotional focus filter
    if (emotionalFocus !== "all") {
      filtered = filtered.filter(meeting => meeting.emotionalFocus === emotionalFocus);
    }
    
    return filtered;
  }, [meetings, searchQuery, emotionalFocus]);
  
  const getFilteredReports = useCallback(() => {
    let filtered = [...reports];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(report => {
        return (
          report.title.toLowerCase().includes(query) ||
          report.content.toLowerCase().includes(query) ||
          report.student.toLowerCase().includes(query) ||
          report.author.toLowerCase().includes(query)
        );
      });
    }
    
    // Apply emotional focus filter
    if (emotionalFocus !== "all") {
      filtered = filtered.filter(report => report.emotionalFocus === emotionalFocus);
    }
    
    return filtered;
  }, [reports, searchQuery, emotionalFocus]);
  
  const getPriorityBadge = useCallback((priority) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="flex items-centre gap-1">
            <AlertCircle className="h-3 w-3" />
            High Priority
          </Badge>
        );
      case "normal":
        return (
          <Badge variant="secondary" className="flex items-centre gap-1">
            <Info className="h-3 w-3" />
            Normal
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="flex items-centre gap-1">
            <Info className="h-3 w-3" />
            Low Priority
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="flex items-centre gap-1">
            <Info className="h-3 w-3" />
            Normal
          </Badge>
        );
    }
  }, []);
  
  const getEmotionalFocusBadge = useCallback((focus) => {
    switch (focus) {
      case "regulation":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-centre gap-1">
            Emotional Regulation
          </Badge>
        );
      case "anxiety":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 flex items-centre gap-1">
            Anxiety
          </Badge>
        );
      case "literacy":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 flex items-centre gap-1">
            Emotional Literacy
          </Badge>
        );
      case "transitions":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 flex items-centre gap-1">
            Transitions
          </Badge>
        );
      case "resources":
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 flex items-centre gap-1">
            Resources
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-grey-50 text-grey-700 flex items-centre gap-1">
            General
          </Badge>
        );
    }
  }, []);
  
  const getRoleBadge = useCallback((role) => {
    switch (role) {
      case "teacher":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Teacher
          </Badge>
        );
      case "parent":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Parent
          </Badge>
        );
      case "student":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            Student
          </Badge>
        );
      case "counselor":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700">
            Counselor
          </Badge>
        );
      case "administrator":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Administrator
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-grey-50 text-grey-700">
            {role}
          </Badge>
        );
    }
  }, []);
  
  const getFormattedDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);
  
  const getFormattedDateOnly = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);
  
  const getFormattedTime = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);
  
  const getReportTypeBadge = useCallback((type) => {
    switch (type) {
      case "progress":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 flex items-centre gap-1">
            <FileText className="h-3 w-3" />
            Progress Report
          </Badge>
        );
      case "plan":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-centre gap-1">
            <FileText className="h-3 w-3" />
            Support Plan
          </Badge>
        );
      case "curriculum":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 flex items-centre gap-1">
            <FileText className="h-3 w-3" />
            Curriculum
          </Badge>
        );
      case "survey":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 flex items-centre gap-1">
            <FileText className="h-3 w-3" />
            Survey Results
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-grey-50 text-grey-700 flex items-centre gap-1">
            <FileText className="h-3 w-3" />
            Report
          </Badge>
        );
    }
  }, []);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Parent-Teacher-Student Emotional Communication</CardTitle>
          <CardDescription>
            Collaborate on emotional wellbeing through secure, structured communication channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="meetings">Meetings</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            {isLoading ? (
              <div className="flex justify-centre items-centre py-12">
                <p>Loading content...</p>
              </div>
            ) : (
              <>
                {/* Messages Tab */}
                <TabsContent value="messages" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Compose New Message</CardTitle>
                      <CardDescription>
                        Send a message about emotional wellbeing to parents, teachers, or students
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="message-recipient">Recipient</Label>
                          <Select 
                            value={newMessage.recipient}
                            onValueChange={(value) => setNewMessage({...newMessage, recipient: value})}
                          >
                            <SelectTrigger id="message-recipient">
                              <SelectValue placeholder="Select recipient" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Mr. & Mrs. Johnson">Mr. & Mrs. Johnson (Parent)</SelectItem>
                              <SelectItem value="Mr. & Mrs. Smith">Mr. & Mrs. Smith (Parent)</SelectItem>
                              <SelectItem value="Mr. & Mrs. Wilson">Mr. & Mrs. Wilson (Parent)</SelectItem>
                              <SelectItem value="Ms. Thompson">Ms. Thompson (Teacher)</SelectItem>
                              <SelectItem value="Ms. Williams">Ms. Williams (Teacher)</SelectItem>
                              <SelectItem value="Mr. Davis">Mr. Davis (Teacher)</SelectItem>
                              <SelectItem value="Dr. Martinez">Dr. Martinez (Counselor)</SelectItem>
                              <SelectItem value="Principal Chen">Principal Chen (Administrator)</SelectItem>
                              <SelectItem value="All Parents">All Parents</SelectItem>
                              <SelectItem value="All Staff">All Staff</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message-emotional-focus">Emotional Focus</Label>
                          <Select 
                            value={newMessage.emotionalFocus}
                            onValueChange={(value) => setNewMessage({...newMessage, emotionalFocus: value})}
                          >
                            <SelectTrigger id="message-emotional-focus">
                              <SelectValue placeholder="Select emotional focus" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Emotional Wellbeing</SelectItem>
                              <SelectItem value="regulation">Emotional Regulation</SelectItem>
                              <SelectItem value="anxiety">Anxiety</SelectItem>
                              <SelectItem value="literacy">Emotional Literacy</SelectItem>
                              <SelectItem value="transitions">Transitions</SelectItem>
                              <SelectItem value="resources">Resources</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="message-subject">Subject</Label>
                          <Input 
                            id="message-subject" 
                            placeholder="Enter message subject"
                            value={newMessage.subject}
                            onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message-priority">Priority</Label>
                          <Select 
                            value={newMessage.priority}
                            onValueChange={(value) => setNewMessage({...newMessage, priority: value})}
                          >
                            <SelectTrigger id="message-priority">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High Priority</SelectItem>
                              <SelectItem value="normal">Normal Priority</SelectItem>
                              <SelectItem value="low">Low Priority</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message-content">Message</Label>
                        <Textarea 
                          id="message-content" 
                          placeholder="Write your message here..."
                          className="min-h-[150px]"
                          value={newMessage.content}
                          onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Attachments</Label>
                        <div className="flex items-centre gap-2">
                          <Button variant="outline" type="button">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Attachment
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleCreateMessage}
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? "Sending..." : "Send Message"}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search messages..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Select 
                        value={messageType}
                        onValueChange={setMessageType}
                      >
                        <SelectTrigger className="w-[150px]">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Messages</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="received">Received</SelectItem>
                          <SelectItem value="unread">Unread</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={emotionalFocus}
                        onValueChange={setEmotionalFocus}
                      >
                        <SelectTrigger className="w-[180px]">
                          <Heart className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Emotional Focus" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Topics</SelectItem>
                          <SelectItem value="general">General Wellbeing</SelectItem>
                          <SelectItem value="regulation">Emotional Regulation</SelectItem>
                          <SelectItem value="anxiety">Anxiety</SelectItem>
                          <SelectItem value="literacy">Emotional Literacy</SelectItem>
                          <SelectItem value="transitions">Transitions</SelectItem>
                          <SelectItem value="resources">Resources</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {selectedMessage ? (
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-centre gap-2">
                              <CardTitle>{selectedMessage.subject}</CardTitle>
                              {getPriorityBadge(selectedMessage.priority)}
                            </div>
                            <CardDescription>
                              {getFormattedDate(selectedMessage.date)}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setSelectedMessage(null)}
                            >
                              <ChevronDown className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">From: <span className="font-medium text-foreground">{selectedMessage.sender}</span> {getRoleBadge(selectedMessage.senderRole)}</p>
                              <p className="text-sm text-muted-foreground">To: <span className="font-medium text-foreground">{selectedMessage.recipient}</span> {getRoleBadge(selectedMessage.recipientRole)}</p>
                            </div>
                            <div>
                              {getEmotionalFocusBadge(selectedMessage.emotionalFocus)}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="whitespace-pre-line">
                            {selectedMessage.content}
                          </div>
                          
                          {selectedMessage.hasAttachments && (
                            <div className="mt-6 space-y-2">
                              <h3 className="text-sm font-medium">Attachments</h3>
                              <div className="space-y-2">
                                {selectedMessage.attachments.map((attachment, index) => (
                                  <div key={index} className="flex items-centre justify-between rounded-md border p-2">
                                    <div className="flex items-centre gap-2">
                                      <FileText className="h-4 w-4 text-muted-foreground" />
                                      <span>{attachment.name}</span>
                                      <Badge variant="outline" className="text-xs">{attachment.size}</Badge>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Reply
                        </Button>
                        
                        <Button variant="outline">
                          <Forward className="mr-2 h-4 w-4" />
                          Forward
                        </Button>
                      </CardFooter>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {getFilteredMessages().map(message => (
                        <Card 
                          key={message.id} 
                          className={`cursor-pointer hover:shadow-md transition-shadow ${!message.isRead ? 'border-l-4 border-l-primary' : ''}`}
                          onClick={() => setSelectedMessage(message)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-centre gap-2">
                                <CardTitle className="text-lg">{message.subject}</CardTitle>
                                {!message.isRead && (
                                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                                    New
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-centre gap-2">
                                {getPriorityBadge(message.priority)}
                                {message.hasAttachments && (
                                  <Badge variant="outline" className="flex items-centre gap-1">
                                    <FileText className="h-3 w-3" />
                                    Attachment
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <CardDescription>
                              {getFormattedDate(message.date)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex justify-between mb-2">
                              <p className="text-sm">
                                <span className="text-muted-foreground">From: </span>
                                <span className="font-medium">{message.sender}</span>
                                {' '}{getRoleBadge(message.senderRole)}
                              </p>
                              <p className="text-sm">
                                <span className="text-muted-foreground">To: </span>
                                <span className="font-medium">{message.recipient}</span>
                                {' '}{getRoleBadge(message.recipientRole)}
                              </p>
                            </div>
                            <p className="line-clamp-2">{message.content}</p>
                          </CardContent>
                          <CardFooter>
                            <div className="flex items-centre justify-between w-full">
                              <div>
                                {getEmotionalFocusBadge(message.emotionalFocus)}
                              </div>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                      
                      {getFilteredMessages().length === 0 && (
                        <div className="text-centre py-12">
                          <p className="text-muted-foreground">
                            No messages found matching your filters. Try adjusting your search criteria or compose a new message.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                {/* Meetings Tab */}
                <TabsContent value="meetings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Schedule New Meeting</CardTitle>
                      <CardDescription>
                        Arrange a meeting to discuss emotional wellbeing with parents, teachers, or students
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="meeting-title">Meeting Title</Label>
                        <Input 
                          id="meeting-title" 
                          placeholder="Enter meeting title"
                          value={newMeeting.title}
                          onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="meeting-date">Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newMeeting.date ? format(newMeeting.date, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={newMeeting.date}
                                onSelect={(date) => setNewMeeting({...newMeeting, date: date || new Date()})}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="meeting-time">Time</Label>
                          <Select 
                            value={newMeeting.time}
                            onValueChange={(value) => setNewMeeting({...newMeeting, time: value})}
                          >
                            <SelectTrigger id="meeting-time">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="08:00">08:00 AM</SelectItem>
                              <SelectItem value="08:30">08:30 AM</SelectItem>
                              <SelectItem value="09:00">09:00 AM</SelectItem>
                              <SelectItem value="09:30">09:30 AM</SelectItem>
                              <SelectItem value="10:00">10:00 AM</SelectItem>
                              <SelectItem value="10:30">10:30 AM</SelectItem>
                              <SelectItem value="11:00">11:00 AM</SelectItem>
                              <SelectItem value="11:30">11:30 AM</SelectItem>
                              <SelectItem value="12:00">12:00 PM</SelectItem>
                              <SelectItem value="12:30">12:30 PM</SelectItem>
                              <SelectItem value="13:00">01:00 PM</SelectItem>
                              <SelectItem value="13:30">01:30 PM</SelectItem>
                              <SelectItem value="14:00">02:00 PM</SelectItem>
                              <SelectItem value="14:30">02:30 PM</SelectItem>
                              <SelectItem value="15:00">03:00 PM</SelectItem>
                              <SelectItem value="15:30">03:30 PM</SelectItem>
                              <SelectItem value="16:00">04:00 PM</SelectItem>
                              <SelectItem value="16:30">04:30 PM</SelectItem>
                              <SelectItem value="17:00">05:00 PM</SelectItem>
                              <SelectItem value="17:30">05:30 PM</SelectItem>
                              <SelectItem value="18:00">06:00 PM</SelectItem>
                              <SelectItem value="18:30">06:30 PM</SelectItem>
                              <SelectItem value="19:00">07:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="meeting-duration">Duration (minutes)</Label>
                          <Select 
                            value={newMeeting.duration}
                            onValueChange={(value) => setNewMeeting({...newMeeting, duration: value})}
                          >
                            <SelectTrigger id="meeting-duration">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="45">45 minutes</SelectItem>
                              <SelectItem value="60">60 minutes</SelectItem>
                              <SelectItem value="90">90 minutes</SelectItem>
                              <SelectItem value="120">120 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="meeting-location">Location</Label>
                          <Select 
                            value={newMeeting.location}
                            onValueChange={(value) => setNewMeeting({...newMeeting, location: value})}
                          >
                            <SelectTrigger id="meeting-location">
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="online">Online (Video Call)</SelectItem>
                              <SelectItem value="phone">Phone Call</SelectItem>
                              <SelectItem value="Counseling Office">Counseling Office</SelectItem>
                              <SelectItem value="Conference Room">Conference Room</SelectItem>
                              <SelectItem value="Classroom">Classroom</SelectItem>
                              <SelectItem value="Staff Room">Staff Room</SelectItem>
                              <SelectItem value="School Hall">School Hall</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="meeting-emotional-focus">Emotional Focus</Label>
                          <Select 
                            value={newMeeting.emotionalFocus}
                            onValueChange={(value) => setNewMeeting({...newMeeting, emotionalFocus: value})}
                          >
                            <SelectTrigger id="meeting-emotional-focus">
                              <SelectValue placeholder="Select emotional focus" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Emotional Wellbeing</SelectItem>
                              <SelectItem value="regulation">Emotional Regulation</SelectItem>
                              <SelectItem value="anxiety">Anxiety</SelectItem>
                              <SelectItem value="literacy">Emotional Literacy</SelectItem>
                              <SelectItem value="transitions">Transitions</SelectItem>
                              <SelectItem value="resources">Resources</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Participants</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {newMeeting.participants.map((participant, index) => (
                            <Badge key={index} variant="secondary" className="flex items-centre gap-1">
                              {participant}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-4 w-4 ml-1 hover:bg-secondary"
                                onClick={() => handleRemoveParticipant(participant)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Add participant (e.g., Mr. Johnson, Dr. Martinez)"
                            value={newParticipant}
                            onChange={(e) => setNewParticipant(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddParticipant();
                              }
                            }}
                          />
                          <Button type="button" onClick={handleAddParticipant}>Add</Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="meeting-agenda">Agenda</Label>
                        <Textarea 
                          id="meeting-agenda" 
                          placeholder="Enter meeting agenda..."
                          className="min-h-[100px]"
                          value={newMeeting.agenda}
                          onChange={(e) => setNewMeeting({...newMeeting, agenda: e.target.value})}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleCreateMeeting}
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? "Scheduling..." : "Schedule Meeting"}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search meetings..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Select 
                        value={emotionalFocus}
                        onValueChange={setEmotionalFocus}
                      >
                        <SelectTrigger className="w-[180px]">
                          <Heart className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Emotional Focus" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Topics</SelectItem>
                          <SelectItem value="general">General Wellbeing</SelectItem>
                          <SelectItem value="regulation">Emotional Regulation</SelectItem>
                          <SelectItem value="anxiety">Anxiety</SelectItem>
                          <SelectItem value="literacy">Emotional Literacy</SelectItem>
                          <SelectItem value="transitions">Transitions</SelectItem>
                          <SelectItem value="resources">Resources</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {selectedMeeting ? (
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-centre gap-2">
                              <CardTitle>{selectedMeeting.title}</CardTitle>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                {selectedMeeting.status}
                              </Badge>
                            </div>
                            <CardDescription>
                              {getFormattedDateOnly(selectedMeeting.date)} at {getFormattedTime(selectedMeeting.date)} • {selectedMeeting.duration} minutes • {selectedMeeting.location}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setSelectedMeeting(null)}
                            >
                              <ChevronDown className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Organised by: <span className="font-medium text-foreground">{selectedMeeting.organizer}</span> {getRoleBadge(selectedMeeting.organizerRole)}</p>
                            </div>
                            <div>
                              {getEmotionalFocusBadge(selectedMeeting.emotionalFocus)}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Participants</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedMeeting.participants.map((participant, index) => (
                                <Badge key={index} variant="secondary">
                                  {participant.name} {getRoleBadge(participant.role)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Agenda</h3>
                            <div className="whitespace-pre-line">
                              {selectedMeeting.agenda}
                            </div>
                          </div>
                          
                          {selectedMeeting.notes && (
                            <div className="space-y-2">
                              <h3 className="text-sm font-medium">Meeting Notes</h3>
                              <div className="whitespace-pre-line">
                                {selectedMeeting.notes}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline">
                          <Calendar className="mr-2 h-4 w-4" />
                          Add to Calendar
                        </Button>
                        
                        <div className="flex gap-2">
                          <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          
                          <Button variant="outline">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message Participants
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {getFilteredMeetings().map(meeting => (
                        <Card 
                          key={meeting.id} 
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedMeeting(meeting)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-centre gap-2">
                                <CardTitle className="text-lg">{meeting.title}</CardTitle>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                  {meeting.status}
                                </Badge>
                              </div>
                              <div className="flex items-centre gap-2">
                                {getEmotionalFocusBadge(meeting.emotionalFocus)}
                              </div>
                            </div>
                            <CardDescription>
                              {getFormattedDateOnly(meeting.date)} at {getFormattedTime(meeting.date)} • {meeting.duration} minutes
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex justify-between mb-2">
                              <p className="text-sm">
                                <span className="text-muted-foreground">Organizer: </span>
                                <span className="font-medium">{meeting.organizer}</span>
                                {' '}{getRoleBadge(meeting.organizerRole)}
                              </p>
                              <p className="text-sm">
                                <span className="text-muted-foreground">Location: </span>
                                <span className="font-medium">{meeting.location}</span>
                              </p>
                            </div>
                            <div className="mt-2">
                              <p className="text-sm text-muted-foreground">Participants:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {meeting.participants.slice(0, 3).map((participant, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {participant.name}
                                  </Badge>
                                ))}
                                {meeting.participants.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{meeting.participants.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <div className="flex items-centre justify-between w-full">
                              <Button variant="ghost" size="sm">
                                <Calendar className="h-4 w-4 mr-1" />
                                Add to Calendar
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                      
                      {getFilteredMeetings().length === 0 && (
                        <div className="text-centre py-12">
                          <p className="text-muted-foreground">
                            No meetings found matching your filters. Try adjusting your search criteria or schedule a new meeting.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                {/* Reports Tab */}
                <TabsContent value="reports" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Emotional Wellbeing Reports</CardTitle>
                      <CardDescription>
                        Access and share reports on emotional wellbeing progress, plans, and resources
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search reports..."
                              className="pl-8"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Select 
                            value={emotionalFocus}
                            onValueChange={setEmotionalFocus}
                          >
                            <SelectTrigger className="w-[180px]">
                              <Heart className="mr-2 h-4 w-4" />
                              <SelectValue placeholder="Emotional Focus" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Topics</SelectItem>
                              <SelectItem value="general">General Wellbeing</SelectItem>
                              <SelectItem value="regulation">Emotional Regulation</SelectItem>
                              <SelectItem value="anxiety">Anxiety</SelectItem>
                              <SelectItem value="literacy">Emotional Literacy</SelectItem>
                              <SelectItem value="transitions">Transitions</SelectItem>
                              <SelectItem value="resources">Resources</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {selectedReport ? (
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-centre gap-2">
                                  <CardTitle>{selectedReport.title}</CardTitle>
                                  {getReportTypeBadge(selectedReport.type)}
                                </div>
                                <CardDescription>
                                  {getFormattedDateOnly(selectedReport.date)} • {selectedReport.period} • By {selectedReport.author} {getRoleBadge(selectedReport.authorRole)}
                                </CardDescription>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setSelectedReport(null)}
                                >
                                  <ChevronDown className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-2">
                            <div className="space-y-4">
                              <div className="flex justify-between">
                                <div>
                                  <p className="text-sm text-muted-foreground">Student: <span className="font-medium text-foreground">{selectedReport.student}</span></p>
                                </div>
                                <div>
                                  {getEmotionalFocusBadge(selectedReport.emotionalFocus)}
                                </div>
                              </div>
                              
                              <Separator />
                              
                              <div className="prose prose-sm max-w-none">
                                <div className="whitespace-pre-line">
                                  {selectedReport.content}
                                </div>
                              </div>
                              
                              {selectedReport.hasAttachments && (
                                <div className="mt-6 space-y-2">
                                  <h3 className="text-sm font-medium">Attachments</h3>
                                  <div className="space-y-2">
                                    {selectedReport.attachments.map((attachment, index) => (
                                      <div key={index} className="flex items-centre justify-between rounded-md border p-2">
                                        <div className="flex items-centre gap-2">
                                          <FileText className="h-4 w-4 text-muted-foreground" />
                                          <span>{attachment.name}</span>
                                          <Badge variant="outline" className="text-xs">{attachment.size}</Badge>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                          <Download className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button variant="outline">
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </Button>
                            
                            <div className="flex gap-2">
                              <Button variant="outline">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Discuss
                              </Button>
                              
                              <Button variant="outline">
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {getFilteredReports().map(report => (
                            <Card 
                              key={report.id} 
                              className="cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => setSelectedReport(report)}
                            >
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-centre gap-2">
                                    <CardTitle className="text-lg">{report.title}</CardTitle>
                                    {getReportTypeBadge(report.type)}
                                  </div>
                                  <div className="flex items-centre gap-2">
                                    {getEmotionalFocusBadge(report.emotionalFocus)}
                                  </div>
                                </div>
                                <CardDescription>
                                  {getFormattedDateOnly(report.date)} • {report.period}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <div className="flex justify-between mb-2">
                                  <p className="text-sm">
                                    <span className="text-muted-foreground">Author: </span>
                                    <span className="font-medium">{report.author}</span>
                                    {' '}{getRoleBadge(report.authorRole)}
                                  </p>
                                  <p className="text-sm">
                                    <span className="text-muted-foreground">Student: </span>
                                    <span className="font-medium">{report.student}</span>
                                  </p>
                                </div>
                                <p className="line-clamp-2 text-sm">{report.content.substring(0, 200)}...</p>
                              </CardContent>
                              <CardFooter>
                                <div className="flex items-centre justify-between w-full">
                                  {report.hasAttachments && (
                                    <Badge variant="outline" className="flex items-centre gap-1">
                                      <FileText className="h-3 w-3" />
                                      {report.attachments.length} attachment{report.attachments.length !== 1 ? 's' : ''}
                                    </Badge>
                                  )}
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    View Report
                                  </Button>
                                </div>
                              </CardFooter>
                            </Card>
                          ))}
                          
                          {getFilteredReports().length === 0 && (
                            <div className="text-centre py-12">
                              <p className="text-muted-foreground">
                                No reports found matching your filters. Try adjusting your search criteria.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push('/special-needs')}>
            Back to Special Needs Support
          </Button>
          <Button onClick={() => router.push('/special-needs/digital-expression')}>
            Digital Expression Spaces
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ParentTeacherCommunication;
