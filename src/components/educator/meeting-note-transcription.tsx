'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAIService } from '@/lib/ai/ai-service';
import { 
  Mic, 
  MicOff, 
  FileText, 
  Users, 
  Calendar, 
  Download, 
  Edit, 
  Eye, 
  Settings, 
  Save, 
  Trash, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Search,
  Tag,
  Star,
  StarOff,
  MessageSquare,
  Share2,
  Paperclip,
  Globe,
  HelpCircle,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  List,
  ListChecks,
  Bookmark,
  BookmarkPlus
} from 'lucide-react';

// Sample meeting types
const meetingTypes = [
  { id: 'parent-conference', name: 'Parent Conference' },
  { id: 'staff-meeting', name: 'Staff Meeting' },
  { id: 'iep-meeting', name: 'IEP/504 Meeting' },
  { id: 'ehcna-meeting', name: 'EHCNA Meeting' },
  { id: 'annual-review', name: 'Annual Review' },
  { id: 'department-meeting', name: 'Department Meeting' },
  { id: 'student-conference', name: 'Student Conference' },
  { id: 'professional-development', name: 'Professional Development' },
  { id: 'admin-meeting', name: 'Administrative Meeting' },
  { id: 'other', name: 'Other' }
];

// EHCNA categories
const ehcnaCategories = [
  { id: 'communication', name: 'Communication and Interaction' },
  { id: 'cognition', name: 'Cognition and Learning' },
  { id: 'semh', name: 'Social, Emotional and Mental Health' },
  { id: 'sensory', name: 'Sensory and Physical' }
];

// Preparation for Adulthood categories
const preparationForAdulthoodCategories = [
  { id: 'employment', name: 'Employment' },
  { id: 'independent-living', name: 'Independent Living' },
  { id: 'community-inclusion', name: 'Community Inclusion' },
  { id: 'health', name: 'Health' }
];

// Sample languages
const languages = [
  { id: 'en-GB', name: 'English (UK)' },
  { id: 'en-US', name: 'English (US)' },
  { id: 'fr-FR', name: 'French' },
  { id: 'es-ES', name: 'Spanish' },
  { id: 'de-DE', name: 'German' },
  { id: 'it-IT', name: 'Italian' },
  { id: 'pl-PL', name: 'Polish' },
  { id: 'ur-PK', name: 'Urdu' },
  { id: 'ar-SA', name: 'Arabic' },
  { id: 'zh-CN', name: 'Chinese (Simplified)' },
  { id: 'hi-IN', name: 'Hindi' },
  { id: 'bn-BD', name: 'Bengali' },
  { id: 'pa-IN', name: 'Punjabi' },
  { id: 'so-SO', name: 'Somali' },
  { id: 'ro-RO', name: 'Romanian' }
];

// Sample saved meetings
const sampleMeetings = [
  {
    id: 1,
    title: 'Year 8 Parents Evening - Thompson Family',
    type: 'parent-conference',
    date: '2025-05-15T18:30:00',
    duration: 25,
    participants: ['Emma Thompson', 'Mr. Thompson', 'Mrs. Thompson', 'Ms. Johnson (English)', 'Mr. Davis (Mathematics)'],
    language: 'en-GB',
    transcript: `
Ms. Johnson: Thank you for coming in today to discuss Emma's progress in English.
Mr. Thompson: We're glad to be here. How is she doing overall?
Ms. Johnson: Emma is showing real strength in creative writing and reading comprehension. Her last assignment on Shakespeare's sonnets was particularly impressive.
Mrs. Thompson: That's wonderful to hear. She's been reading a lot at home too.
Ms. Johnson: I can tell. The area where Emma could use some additional support is in analytical writing, particularly when responding to non-fiction texts.
Mr. Thompson: What can we do at home to help with that?
Ms. Johnson: I'd recommend practicing with quality newspaper articles, asking Emma to identify the main arguments and supporting evidence. The BBC website has some excellent resources for this.
Mrs. Thompson: We'll definitely try that approach.
Ms. Johnson: Great. I've also added some specific resources to Emma's online learning portal that you can access.
Mr. Davis: Moving on to Mathematics, Emma has made steady progress this term, particularly with number operations and data handling.
Mr. Thompson: That's good to hear. She mentioned she was finding some topics challenging.
Mr. Davis: Yes, algebra remains an area for development. I'd suggest using the Khan Academy videos I've recommended, as they break down the concepts very clearly.
Mrs. Thompson: How is her participation in class?
Mr. Davis: She's attentive but sometimes hesitant to ask questions when she's unsure. I'd encourage her to be more proactive about seeking help.
Mr. Thompson: We'll discuss that with her. Are there any after-school support sessions available?
Mr. Davis: Yes, I run a mathematics support club on Wednesdays after school. Emma would be very welcome to attend.
Mrs. Thompson: That sounds perfect. We'll make arrangements for her to join.
Ms. Johnson: Before we finish, do you have any other questions about Emma's progress?
Mr. Thompson: Not at the moment, but we appreciate the detailed feedback.
Mrs. Thompson: Yes, thank you both for your time and support.
    `,
    keyPoints: [
      { text: 'Emma shows strengths in creative writing and reading comprehension', category: 'strength', highlighted: true },
      { text: 'Emma needs support with analytical writing for non-fiction texts', category: 'development', highlighted: true },
      { text: 'Parents should practise using newspaper articles with Emma', category: 'action', highlighted: true },
      { text: 'Resources added to Emma\'s online learning portal', category: 'resource', highlighted: false },
      { text: 'Emma has made progress in Mathematics with number operations', category: 'strength', highlighted: false },
      { text: 'Algebra remains an area for development', category: 'development', highlighted: true },
      { text: 'Khan Academy videos recommended for algebra support', category: 'resource', highlighted: true },
      { text: 'Emma should be encouraged to ask questions when unsure', category: 'action', highlighted: false },
      { text: 'Mathematics support club available on Wednesdays', category: 'resource', highlighted: true }
    ],
    actionItems: [
      { text: 'Parents to practise analytical writing using newspaper articles', assignedTo: 'Parents', dueDate: '2025-05-31', completed: false },
      { text: 'Emma to access online resources for analytical writing', assignedTo: 'Emma', dueDate: '2025-05-22', completed: false },
      { text: 'Emma to watch Khan Academy videos on algebra', assignedTo: 'Emma', dueDate: '2025-05-20', completed: true },
      { text: 'Arrange for Emma to attend Wednesday mathematics support club', assignedTo: 'Parents', dueDate: '2025-05-17', completed: true }
    ],
    tags: ['Year 8', 'Parents Evening', 'English', 'Mathematics', 'Academic Progress']
  },
  {
    id: 2,
    title: 'Department Meeting - Curriculum Planning',
    type: 'department-meeting',
    date: '2025-05-12T15:00:00',
    duration: 60,
    participants: ['Ms. Johnson (Head of English)', 'Mr. Williams', 'Mrs. Davies', 'Mr. Roberts', 'Ms. Thomas'],
    language: 'en-GB',
    transcript: `
Ms. Johnson: Good afternoon everyone. Today we need to finalize our curriculum plans for the next academic year. Let's start with Year 7.
Mr. Williams: I've drafted the Year 7 plan based on our previous discussions. The main changes are the addition of more diverse texts and a stronger focus on speaking and listening skills.
Mrs. Davies: I've reviewed it and think it looks good. I particularly like the inclusion of "Refugee Boy" as a core text.
Ms. Johnson: Agreed. What about assessment strategies?
Mr. Roberts: I've been researching more formative assessment approaches. I'd like to propose we reduce the number of formal written assessments and increase the use of portfolio-based assessment.
Ms. Thomas: That aligns well with the school's overall direction on assessment. I'd support that change.
Ms. Johnson: Let's discuss the practical implementation. How would we ensure consistency across different classes?
Mr. Roberts: I've prepared some standardised rubrics and exemplars that we could all use. I can share those after the meeting.
Ms. Johnson: Excellent. Let's move on to Year 8 curriculum.
Mrs. Davies: For Year 8, we need to address the gap in grammar and punctuation skills we've noticed this year.
Mr. Williams: I suggest we integrate more explicit grammar teaching into the existing units rather than creating separate grammar lessons.
Ms. Thomas: I agree. Students engage better when grammar is taught in context.
Ms. Johnson: That makes sense. Can you work together to identify specific grammar focus points for each unit?
Mrs. Davies: Yes, we can do that by the end of next week.
Ms. Johnson: Perfect. Now for Year 9, we need to ensure we're preparing students adequately for GCSE.
Mr. Roberts: The new GCSE specifications place more emphasis on 19th-century texts. We should introduce more of these in Year 9.
Ms. Thomas: I've found some accessible extracts we could use to build their confidence with these texts.
Ms. Johnson: Great initiative. Please share those with the team.
Mr. Williams: Should we also consider a cross-curricular project with History for the Victorian literature?
Ms. Johnson: That\'s an excellent idea. I\'ll speak with the Head of History about possibilities.
Mrs. Davies: For resources, we'll need to order some new class sets of books. Can we discuss budget allocation?
Ms. Johnson: Yes, I've received our department budget for next year. We have £2,500 for new resources.
Mr. Roberts: That should be sufficient if we prioritize carefully.
Ms. Johnson: Agreed. Please send me your resource requests by Friday, and I\'ll compile the order.
Ms. Thomas: One last item - the literacy intervention program needs reviewing.
Ms. Johnson: Yes, let's schedule a separate meeting focused specifically on intervention strategies next week.
Mr. Williams: Tuesday afternoon would work for me.
Ms. Johnson: Let\'s say Tuesday at 3:30 pm. I\'ll send a calendar invitation. Thank you all for your contributions today.
    `,
    keyPoints: [
      { text: 'Year 7 curriculum to include more diverse texts', category: 'decision', highlighted: true },
      { text: 'Stronger focus on speaking and listening skills for Year 7', category: 'decision', highlighted: true },
      { text: 'Reduce formal written assessments, increase portfolio-based assessment', category: 'decision', highlighted: true },
      { text: 'Standardised rubrics and exemplars to be shared', category: 'resource', highlighted: false },
      { text: 'Address grammar and punctuation skills gap in Year 8', category: 'issue', highlighted: true },
      { text: 'Integrate grammar teaching into existing units', category: 'approach', highlighted: false },
      { text: 'Year 9 to include more 19th-century texts to prepare for GCSE', category: 'decision', highlighted: true },
      { text: 'Potential cross-curricular project with History for Victorian literature', category: 'idea', highlighted: true },
      { text: 'Department budget of £2,500 for new resources', category: 'resource', highlighted: true },
      { text: 'Literacy intervention program needs reviewing', category: 'issue', highlighted: false }
    ],
    actionItems: [
      { text: 'Share standardised rubrics and exemplars for portfolio assessment', assignedTo: 'Mr. Roberts', dueDate: '2025-05-14', completed: true },
      { text: 'Identify grammar focus points for each Year 8 unit', assignedTo: 'Mrs. Davies & Mr. Williams', dueDate: '2025-05-19', completed: false },
      { text: 'Share accessible extracts of 19th-century texts', assignedTo: 'Ms. Thomas', dueDate: '2025-05-15', completed: false },
      { text: 'Speak with Head of History about cross-curricular project', assignedTo: 'Ms. Johnson', dueDate: '2025-05-16', completed: false },
      { text: 'Submit resource requests', assignedTo: 'All staff', dueDate: '2025-05-16', completed: false },
      { text: 'Schedule intervention strategy meeting', assignedTo: 'Ms. Johnson', dueDate: '2025-05-13', completed: true }
    ],
    tags: ['Curriculum Planning', 'English Department', 'Assessment', 'Resources', 'GCSE Preparation']
  }
];

export default function MeetingNoteTranscription() {
  const { toast } = useToast();
  const aiService = useAIService();
  const [activeTab, setActiveTab] = useState('record');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingType, setMeetingType] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingParticipants, setMeetingParticipants] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-GB');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState<any>(null);
  const [savedMeetings, setSavedMeetings] = useState<any[]>(sampleMeetings);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMeetings, setFilteredMeetings] = useState<any[]>(sampleMeetings);
  const [editingKeyPoints, setEditingKeyPoints] = useState(false);
  const [editingActionItems, setEditingActionItems] = useState(false);
  const [newKeyPoint, setNewKeyPoint] = useState({ 
    text: '', 
    category: 'information', 
    ehcnaArea: '', 
    preparationForAdulthood: false, 
    highlighted: false 
  });
  const [newActionItem, setNewActionItem] = useState({ 
    text: '', 
    assignedTo: '', 
    dueDate: '', 
    completed: false, 
    ehcnaArea: '' 
  });
  const [useEhcnaCategories, setUseEhcnaCategories] = useState(false);
  const [usePreparationForAdulthood, setUsePreparationForAdulthood] = useState(false);
  const [studentYear, setStudentYear] = useState<number | undefined>();
  const [uploadedAudioFile, setUploadedAudioFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translationLanguage, setTranslationLanguage] = useState('');
  const [translatedTranscript, setTranslatedTranscript] = useState('');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Filter meetings based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMeetings(savedMeetings);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = savedMeetings.filter(meeting => 
      meeting.title.toLowerCase().includes(query) ||
      meeting.type.toLowerCase().includes(query) ||
      meeting.participants.some((p: string) => p.toLowerCase().includes(query)) ||
      meeting.tags.some((tag: string) => tag.toLowerCase().includes(query)) ||
      meeting.transcript.toLowerCase().includes(query) ||
      meeting.keyPoints.some((kp) => kp.text.toLowerCase().includes(query)) ||
      meeting.actionItems.some((ai) => ai.text.toLowerCase().includes(query))
    );
    
    setFilteredMeetings(filtered);
  }, [searchQuery, savedMeetings]);
  
  // Handle recording start/stop
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }
      setIsRecording(false);
      
      // In a real implementation, this would stop the actual recording
      // and process the audio for transcription
      
      // For demo purposes, we'll simulate processing and then show a sample transcript
      setIsProcessing(true);
      
      // Simulate processing delay
      setTimeout(() => {
        // Generate a sample transcript based on meeting type
        let sampleText = '';
        
        if (meetingType === 'parent-conference') {
          sampleText = `
Teacher: Thank you for coming in today to discuss [Student]'s progress.
Parent: We're glad to be here. How is [Student] doing overall?
Teacher: [Student] is showing real strength in [Subject Area]. Their recent work on [Topic] was particularly impressive.
Parent: That's good to hear. We've noticed [Student] seems more engaged at home too.
Teacher: Yes, I've observed that in class as well. The area where [Student] could use some additional support is [Challenge Area].
Parent: What can we do at home to help with that?
Teacher: I'd recommend [Specific Strategy]. Also, I've prepared some resources that might be helpful.
Parent: Thank you, we'll definitely try that approach.
Teacher: Great. Do you have any specific concerns you'd like to discuss?
Parent: Yes, we've noticed [Student] seems anxious about [Issue]. Is that something you've observed?
Teacher: I have noticed some hesitation when it comes to [Related Classroom Activity]. Let me share what I've been doing to address this...
          `;
        } else if (meetingType === 'staff-meeting') {
          sampleText = `
Head Teacher: Good morning everyone. Today we need to discuss [Main Agenda Item].
Teacher 1: I've been working on [Initiative] and have some updates to share.
Teacher 2: That aligns with what my department has been focusing on.
Head Teacher: Excellent. What progress have you made so far?
Teacher 1: We've implemented [Specific Action] and have seen [Positive Outcome].
Teacher 3: Could we apply a similar approach to [Related Area]?
Head Teacher: That's worth exploring. What resources would be needed?
Teacher 2: We would need [Resource Requirements] and possibly additional training.
Head Teacher: Let's put together a proposal. Who can take the lead on this?
Teacher 1: I'm happy to coordinate, with support from [Colleague].
Head Teacher: Perfect. Let's move on to our next agenda item: [Next Topic].
          `;
        } else {
          sampleText = `
Speaker 1: Welcome everyone. Today we're here to discuss [Meeting Purpose].
Speaker 2: Thank you for organising this. I think the main issues we need to address are [Key Issues].
Speaker 3: I agree, and I'd also like to add [Additional Concern] to our discussion.
Speaker 1: Those are all important points. Let's start by looking at [First Topic].
Speaker 2: From my perspective, the situation is [Description of Current State].
Speaker 4: I've observed similar patterns in [Related Area].
Speaker 1: What solutions have been considered so far?
Speaker 3: We've tried [Previous Approach], but encountered [Challenge].
Speaker 2: What if we tried [Alternative Approach] instead?
Speaker 4: That could work. We would need to consider [Implementation Factor].
Speaker 1: Let's develop an action plan. Who can take responsibility for [Action Item]?
          `;
        }
        
        // Replace placeholders with meeting-specific information
        const participants = meetingParticipants.split(',').map(p => p.trim());
        if (participants.length > 0) {
          // Replace generic speaker labels with actual participant names
          for (let i = 0; i < participants.length; i++) {
            const speakerPattern = new RegExp(`Speaker ${i+1}:`, 'g');
            sampleText = sampleText.replace(speakerPattern, `${participants[i]}:`);
          }
          
          // Replace remaining generic speakers with random participants
          sampleText = sampleText.replace(/Speaker \d+:/g, () => {
            const randomIndex = Math.floor(Math.random() * participants.length);
            return `${participants[randomIndex]}:`;
          });
          
          // Replace Teacher/Parent with appropriate participants in parent conferences
          if (meetingType === 'parent-conference') {
            // Assume first participant is teacher, others are parents/guardians
            sampleText = sampleText.replace(/Teacher:/g, `${participants[0]}:`);
            
            if (participants.length > 1) {
              sampleText = sampleText.replace(/Parent:/g, `${participants[1]}:`);
            }
          }
          
          // Replace Head Teacher in staff meetings
          if (meetingType === 'staff-meeting' && participants.length > 0) {
            sampleText = sampleText.replace(/Head Teacher:/g, `${participants[0]}:`);
          }
        }
        
        setLiveTranscript(sampleText);
        setIsProcessing(false);
        setActiveTab('edit');
        
        toast({
          title: "Recording processed",
          description: "Your meeting has been transcribed. You can now review and edit the transcript.",
          variant: "default"
        });
      }, 3000);
      
    } else {
      // Start recording
      if (!meetingTitle) {
        toast({
          title: "Meeting title required",
          description: "Please enter a title for your meeting before starting recording.",
          variant: "destructive"
        });
        return;
      }
      
      if (!meetingType) {
        toast({
          title: "Meeting type required",
          description: "Please select a meeting type before starting recording.",
          variant: "destructive"
        });
        return;
      }
      
      // Reset recording time
      setRecordingTime(0);
      
      // Start timer
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      setRecordingInterval(interval);
      setIsRecording(true);
      setLiveTranscript('');
      
      toast({
        title: "Recording started",
        description: "Your meeting is now being recorded and transcribed in real-time.",
        variant: "default"
      });
    }
  };
  
  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Process transcript to extract key points and action items
  const processTranscript = () => {
    if (!liveTranscript.trim()) {
      toast({
        title: "No transcript available",
        description: "Please record or upload a meeting before processing.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // In a real implementation, this would call the AI service to process the transcript
    // For demo purposes, we'll simulate AI processing
    
    setTimeout(() => {
      // Generate sample key points based on the transcript and EHCNA categories if enabled
      let sampleKeyPoints = [];
      
      if (useEhcnaCategories) {
        // EHCNA-categorized key points
        sampleKeyPoints = [
          { 
            text: 'Student shows strong verbal communication skills in one-to-one settings', 
            category: 'strength', 
            ehcnaArea: 'Communication and Interaction',
            highlighted: true 
          },
          { 
            text: 'Student struggles with processing complex written instructions', 
            category: 'development', 
            ehcnaArea: 'Cognition and Learning',
            highlighted: true 
          },
          { 
            text: 'Student demonstrates anxiety in group situations', 
            category: 'concern', 
            ehcnaArea: 'Social, Emotional and Mental Health',
            highlighted: false 
          },
          { 
            text: 'Student benefits from movement breaks during extended desk work', 
            category: 'strategy', 
            ehcnaArea: 'Sensory and Physical',
            highlighted: false 
          }
        ];
        
        // Add preparation for adulthood key points if applicable
        if (usePreparationForAdulthood || (studentYear && studentYear >= 9)) {
          sampleKeyPoints.push(
            { 
              text: 'Student expresses interest in pursuing a career in technology', 
              category: 'interest', 
              ehcnaArea: 'Preparation for Adulthood - Employment',
              preparationForAdulthood: true,
              highlighted: true 
            },
            { 
              text: 'Student needs support with independent travel planning', 
              category: 'development', 
              ehcnaArea: 'Preparation for Adulthood - Independent Living',
              preparationForAdulthood: true,
              highlighted: true 
            }
          );
        }
      } else {
        // Standard key points
        sampleKeyPoints = [
          { text: 'First key point extracted from the transcript', category: 'information', highlighted: true },
          { text: 'Important decision made during the meeting', category: 'decision', highlighted: true },
          { text: 'Issue that needs to be addressed', category: 'issue', highlighted: false },
          { text: 'Resource mentioned during discussion', category: 'resource', highlighted: false }
        ];
      }
      
      // Generate sample action items
      let sampleActionItems = [];
      
      if (useEhcnaCategories) {
        sampleActionItems = [
          { 
            text: 'Provide visual supports for complex instructions', 
            assignedTo: 'Class Teacher', 
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), 
            completed: false,
            ehcnaArea: 'Cognition and Learning'
          },
          { 
            text: 'Schedule weekly check-in with school counselor', 
            assignedTo: 'SENCO', 
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), 
            completed: false,
            ehcnaArea: 'Social, Emotional and Mental Health'
          }
        ];
        
        // Add preparation for adulthood action items if applicable
        if (usePreparationForAdulthood || (studentYear && studentYear >= 9)) {
          sampleActionItems.push(
            { 
              text: 'Arrange work experience placement in local tech company', 
              assignedTo: 'Careers Advisor', 
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), 
              completed: false,
              ehcnaArea: 'Preparation for Adulthood - Employment'
            }
          );
        }
      } else {
        sampleActionItems = [
          { text: 'Follow up on key discussion point', assignedTo: meetingParticipants.split(',')[0]?.trim() || 'Unassigned', dueDate: '', completed: false },
          { text: 'Share resources discussed in meeting', assignedTo: meetingParticipants.split(',')[1]?.trim() || 'Unassigned', dueDate: '', completed: false }
        ];
      }
      
      // Create tags based on meeting type and EHCNA/preparation for adulthood if applicable
      const tags = [meetingType];
      if (useEhcnaCategories) {
        tags.push('EHCNA');
      }
      if (usePreparationForAdulthood || (studentYear && studentYear >= 9)) {
        tags.push('Preparation for Adulthood');
      }
      
      // Create a new meeting object
      const newMeeting = {
        id: Date.now(),
        title: meetingTitle,
        type: meetingType,
        date: meetingDate || new Date().toISOString(),
        duration: recordingTime,
        participants: meetingParticipants.split('\n').map(p => p.trim()).filter(Boolean),
        language: selectedLanguage,
        transcript: liveTranscript,
        keyPoints: sampleKeyPoints,
        actionItems: sampleActionItems,
        tags: tags,
        studentYear: studentYear,
        useEhcnaCategories: useEhcnaCategories,
        usePreparationForAdulthood: usePreparationForAdulthood || (studentYear && studentYear >= 9)
      };
      
      setCurrentMeeting(newMeeting);
      setIsProcessing(false);
      setActiveTab('review');
      
      toast({
        title: "Transcript processed",
        description: "Key points and action items have been extracted. You can now review and edit them.",
        variant: "default"
      });
    }, 2000);
  };
  
  // Save current meeting
  const saveMeeting = () => {
    if (!currentMeeting) return;
    
    // Add to saved meetings
    const updatedMeetings = [...savedMeetings, currentMeeting];
    setSavedMeetings(updatedMeetings);
    
    toast({
      title: "Meeting saved",
      description: "Your meeting transcript and notes have been saved successfully.",
      variant: "default"
    });
    
    // Reset current meeting state
    setMeetingTitle('');
    setMeetingType('');
    setMeetingDate('');
    setMeetingParticipants('');
    setLiveTranscript('');
    setRecordingTime(0);
    setActiveTab('saved');
  };
  
  // View a specific meeting
  const viewMeeting = (meeting) => {
    setCurrentMeeting(meeting);
    setEditingKeyPoints(false);
    setEditingActionItems(false);
    setActiveTab('review');
  };
  
  // Delete a meeting
  const deleteMeeting = (meetingId: number) => {
    const updatedMeetings = savedMeetings.filter(meeting => meeting.id !== meetingId);
    setSavedMeetings(updatedMeetings);
    
    if (currentMeeting && currentMeeting.id === meetingId) {
      setCurrentMeeting(null);
      setActiveTab('saved');
    }
    
    toast({
      title: "Meeting deleted",
      description: "The meeting has been removed from your saved meetings.",
      variant: "default"
    });
  };
  
  // Add a new key point
  const addKeyPoint = () => {
    if (!currentMeeting) return;
    if (!newKeyPoint.text.trim()) {
      toast({
        title: "Empty key point",
        description: "Please enter text for the key point.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedKeyPoints = [...currentMeeting.keyPoints, newKeyPoint];
    setCurrentMeeting({
      ...currentMeeting,
      keyPoints: updatedKeyPoints
    });
    
    setNewKeyPoint({ text: '', category: 'information', highlighted: false });
  };
  
  // Remove a key point
  const removeKeyPoint = (index: number) => {
    if (!currentMeeting) return;
    
    const updatedKeyPoints = [...currentMeeting.keyPoints];
    updatedKeyPoints.splice(index, 1);
    
    setCurrentMeeting({
      ...currentMeeting,
      keyPoints: updatedKeyPoints
    });
  };
  
  // Toggle key point highlight
  const toggleKeyPointHighlight = (index: number) => {
    if (!currentMeeting) return;
    
    const updatedKeyPoints = [...currentMeeting.keyPoints];
    updatedKeyPoints[index] = {
      ...updatedKeyPoints[index],
      highlighted: !updatedKeyPoints[index].highlighted
    };
    
    setCurrentMeeting({
      ...currentMeeting,
      keyPoints: updatedKeyPoints
    });
  };
  
  // Add a new action item
  const addActionItem = () => {
    if (!currentMeeting) return;
    if (!newActionItem.text.trim()) {
      toast({
        title: "Empty action item",
        description: "Please enter text for the action item.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedActionItems = [...currentMeeting.actionItems, newActionItem];
    setCurrentMeeting({
      ...currentMeeting,
      actionItems: updatedActionItems
    });
    
    setNewActionItem({ text: '', assignedTo: '', dueDate: '', completed: false });
  };
  
  // Remove an action item
  const removeActionItem = (index: number) => {
    if (!currentMeeting) return;
    
    const updatedActionItems = [...currentMeeting.actionItems];
    updatedActionItems.splice(index, 1);
    
    setCurrentMeeting({
      ...currentMeeting,
      actionItems: updatedActionItems
    });
  };
  
  // Toggle action item completion
  const toggleActionItemCompletion = (index: number) => {
    if (!currentMeeting) return;
    
    const updatedActionItems = [...currentMeeting.actionItems];
    updatedActionItems[index] = {
      ...updatedActionItems[index],
      completed: !updatedActionItems[index].completed
    };
    
    setCurrentMeeting({
      ...currentMeeting,
      actionItems: updatedActionItems
    });
  };
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadedAudioFile(file);
    
    // In a real implementation, this would upload the file for processing
    // For demo purposes, we'll simulate processing
    
    toast({
      title: "File uploaded",
      description: `"${file.name}" has been uploaded and is ready for processing.`,
      variant: "default"
    });
  };
  
  // Process uploaded file
  const processUploadedFile = () => {
    if (!uploadedAudioFile) {
      toast({
        title: "No file selected",
        description: "Please upload an audio file before processing.",
        variant: "destructive"
      });
      return;
    }
    
    if (!meetingTitle) {
      toast({
        title: "Meeting title required",
        description: "Please enter a title for your meeting before processing.",
        variant: "destructive"
      });
      return;
    }
    
    if (!meetingType) {
      toast({
        title: "Meeting type required",
        description: "Please select a meeting type before processing.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Generate a sample transcript
      const sampleText = `
Speaker 1: Welcome everyone. Today we're here to discuss the upcoming curriculum changes.
Speaker 2: Thank you for organising this. I think we need to focus on how these changes will affect our assessment strategies.
Speaker 3: I agree, and I'd also like to discuss the implications for students with special educational needs.
Speaker 1: Those are all important points. Let's start by reviewing the key changes.
Speaker 2: From what I understand, the main shift is towards more project-based learning and less emphasis on final examinations.
Speaker 4: That's correct. This will require significant adjustments to our teaching approaches.
Speaker 1: What specific challenges do you foresee?
Speaker 3: For students with special needs, we'll need to ensure appropriate accommodations for project work.
Speaker 2: And we'll need to develop new rubrics for assessment that align with the project-based approach.
Speaker 4: Training will also be crucial. Many staff members are used to the current system.
Speaker 1: Let's develop an action plan. Who can take responsibility for drafting the new assessment guidelines?
      `;
      
      setLiveTranscript(sampleText);
      setIsProcessing(false);
      setActiveTab('edit');
      
      toast({
        title: "File processed",
        description: "Your audio file has been transcribed. You can now review and edit the transcript.",
        variant: "default"
      });
    }, 3000);
  };
  
  // Generate translation
  const generateTranslation = () => {
    if (!currentMeeting || !translationLanguage) return;
    
    setIsProcessing(true);
    
    // In a real implementation, this would call a translation API
    // For demo purposes, we'll simulate translation
    
    setTimeout(() => {
      // Generate a sample translation (just a placeholder)
      const sampleTranslation = `[This is a simulated translation of the transcript into ${
        languages.find(lang => lang.id === translationLanguage)?.name || translationLanguage
      }]

${currentMeeting.transcript.split('\n').map((line: string) => {
  if (line.includes(':')) {
    const [speaker, text] = line.split(':', 2);
    return `${speaker}: [Translated text would appear here]`;
  }
  return line;
}).join('\n')}`;
      
      setTranslatedTranscript(sampleTranslation);
      setShowTranslation(true);
      setIsProcessing(false);
      
      toast({
        title: "Translation generated",
        description: `The transcript has been translated to ${
          languages.find(lang => lang.id === translationLanguage)?.name || translationLanguage
        }.`,
        variant: "default"
      });
    }, 2000);
  };
  
  // Export meeting as PDF
  const exportAsPDF = () => {
    if (!currentMeeting) return;
    
    toast({
      title: "Exporting PDF",
      description: "Your meeting transcript and notes are being exported as PDF.",
      variant: "default"
    });
    
    // Simulate export delay
    setTimeout(() => {
      toast({
        title: "PDF exported",
        description: "Your PDF has been generated and is ready for download.",
        variant: "default"
      });
    }, 2000);
  };
  
  // Get meeting type display name
  const getMeetingTypeDisplayName = (typeId: string) => {
    const meetingType = meetingTypes.find(type => type.id === typeId);
    return meetingType ? meetingType.name : typeId;
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get category badge colour
  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'strength':
      case 'decision':
        return "bg-green-100 text-green-800";
      case 'development':
      case 'issue':
        return "bg-amber-100 text-amber-800";
      case 'action':
        return "bg-blue-100 text-blue-800";
      case 'resource':
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-grey-100 text-grey-800";
    }
  };
  
  // Get category display name
  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'strength': 'Strength',
      'development': 'Area for Development',
      'action': 'Action',
      'resource': 'Resource',
      'decision': 'Decision',
      'issue': 'Issue',
      'idea': 'Idea',
      'approach': 'Approach',
      'information': 'Information'
    };
    
    return categoryMap[category] || category;
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-centre">
            <FileText className="mr-2 h-5 w-5" />
            Meeting Note Transcription with Key Point Extraction
          </CardTitle>
          <CardDescription>
            Automatically transcribe meetings, extract key points, and identify action items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="record">Record</TabsTrigger>
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
            
            {/* Record Tab */}
            <TabsContent value="record" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Meeting Information</CardTitle>
                  <CardDescription>
                    Enter details about the meeting you want to record
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="meeting-title">Meeting Title</Label>
                        <Input 
                          id="meeting-title" 
                          placeholder="Enter meeting title" 
                          value={meetingTitle}
                          onChange={(e) => setMeetingTitle(e.target.value)}
                          disabled={isRecording}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="meeting-type">Meeting Type</Label>
                        <Select 
                          value={meetingType} 
                          onValueChange={setMeetingType}
                          disabled={isRecording}
                        >
                          <SelectTrigger id="meeting-type">
                            <SelectValue placeholder="Select meeting type" />
                          </SelectTrigger>
                          <SelectContent>
                            {meetingTypes.map(type => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="meeting-date">Meeting Date & Time</Label>
                        <Input 
                          id="meeting-date" 
                          type="datetime-local" 
                          value={meetingDate}
                          onChange={(e) => setMeetingDate(e.target.value)}
                          disabled={isRecording}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="meeting-participants">Participants</Label>
                        <Textarea 
                          id="meeting-participants" 
                          placeholder="Enter participant names, separated by commas" 
                          value={meetingParticipants}
                          onChange={(e) => setMeetingParticipants(e.target.value)}
                          disabled={isRecording}
                          className="min-h-[80px]"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="language-select">Primary Language</Label>
                        <Select 
                          value={selectedLanguage} 
                          onValueChange={setSelectedLanguage}
                          disabled={isRecording}
                        >
                          <SelectTrigger id="language-select">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map(language => (
                              <SelectItem key={language.id} value={language.id}>
                                {language.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-centre">
                      <Mic className="mr-2 h-5 w-5" />
                      Record Meeting
                    </CardTitle>
                    <CardDescription>
                      Record and transcribe your meeting in real-time
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-centre">
                      <Button 
                        variant={isRecording ? "destructive" : "default"}
                        size="lg"
                        className="h-20 w-20 rounded-full"
                        onClick={toggleRecording}
                        disabled={isProcessing}
                      >
                        {isRecording ? (
                          <MicOff className="h-8 w-8" />
                        ) : (
                          <Mic className="h-8 w-8" />
                        )}
                      </Button>
                    </div>
                    
                    <div className="text-centre">
                      <div className="text-2xl font-bold">
                        {formatTime(recordingTime)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isRecording ? "Recording in progress" : "Ready to record"}
                      </div>
                    </div>
                    
                    {isRecording && (
                      <div className="text-centre text-sm">
                        <p>Speaking detected. Transcription in progress...</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-centre">
                    <div className="text-sm text-muted-foreground">
                      {isRecording ? (
                        <span className="flex items-centre">
                          <span className="relative flex h-3 w-3 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                          </span>
                          Click the microphone button to stop recording
                        </span>
                      ) : (
                        "Click the microphone button to start recording"
                      )}
                    </div>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-centre">
                      <Upload className="mr-2 h-5 w-5" />
                      Upload Audio
                    </CardTitle>
                    <CardDescription>
                      Upload a pre-recorded meeting audio file for transcription
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div 
                      className="border-2 border-dashed rounded-lg p-6 text-centre cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="audio/*"
                        onChange={handleFileUpload}
                        disabled={isProcessing}
                      />
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        MP3, WAV, M4A, or MP4 files (max 2 hours)
                      </p>
                    </div>
                    
                    {uploadedAudioFile && (
                      <div className="flex items-centre justify-between p-2 border rounded-lg">
                        <div className="flex items-centre">
                          <FileAudio className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span className="text-sm font-medium truncate max-w-[200px]">
                            {uploadedAudioFile.name}
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setUploadedAudioFile(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-centre">
                    <Button 
                      onClick={processUploadedFile}
                      disabled={!uploadedAudioFile || isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Process Audio File"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            {/* Edit Tab */}
            <TabsContent value="edit" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Transcript</CardTitle>
                  <CardDescription>
                    Review and edit the automatically generated transcript
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea 
                      value={liveTranscript}
                      onChange={(e) => setLiveTranscript(e.target.value)}
                      className="min-h-[400px] font-mono text-sm"
                      placeholder="Transcript will appear here after recording or uploading audio"
                    />
                    
                    <div className="text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium">Tip:</span> For best results with speaker identification, 
                        ensure each speaker's line starts with their name followed by a colon (e.g., "John: Hello everyone").
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('record')}
                  >
                    Back to Record
                  </Button>
                  <Button 
                    onClick={processTranscript}
                    disabled={!liveTranscript.trim() || isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Extract Key Points"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Review Tab */}
            <TabsContent value="review" className="space-y-6">
              {currentMeeting ? (
                <>
                  <div className="flex justify-between items-centre">
                    <div>
                      <h2 className="text-2xl font-bold">{currentMeeting.title}</h2>
                      <p className="text-muted-foreground">
                        {getMeetingTypeDisplayName(currentMeeting.type)} • {formatDate(currentMeeting.date)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={exportAsPDF}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                      </Button>
                      <Button 
                        size="sm"
                        onClick={saveMeeting}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Meeting
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <Card>
                        <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                          <CardTitle className="text-md font-medium">Transcript</CardTitle>
                          <div className="flex items-centre space-x-2">
                            <Select 
                              value={translationLanguage} 
                              onValueChange={setTranslationLanguage}
                            >
                              <SelectTrigger className="w-[180px] h-8 text-xs">
                                <SelectValue placeholder="Translate to..." />
                              </SelectTrigger>
                              <SelectContent>
                                {languages.filter(lang => lang.id !== currentMeeting.language).map(language => (
                                  <SelectItem key={language.id} value={language.id}>
                                    {language.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={generateTranslation}
                              disabled={!translationLanguage || isProcessing}
                            >
                              <Globe className="h-4 w-4 mr-2" />
                              Translate
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-md max-h-[400px] overflow-y-auto">
                              <pre className="text-sm whitespace-pre-wrap font-sans">
                                {showTranslation && translatedTranscript ? translatedTranscript : currentMeeting.transcript}
                              </pre>
                            </div>
                            
                            {showTranslation && translatedTranscript && (
                              <div className="flex justify-end">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setShowTranslation(false)}
                                >
                                  Show Original
                                </Button>
                              </div>
                            )}
                            
                            <div className="flex items-centre space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {languages.find(lang => lang.id === currentMeeting.language)?.name || currentMeeting.language}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {currentMeeting.duration ? `${Math.floor(currentMeeting.duration / 60)}:${(currentMeeting.duration % 60).toString().padStart(2, '0')}` : 'Duration unknown'}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {currentMeeting.participants.length} participants
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="space-y-6">
                      <Card>
                        <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                          <CardTitle className="text-md font-medium">Key Points</CardTitle>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditingKeyPoints(!editingKeyPoints)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {currentMeeting.keyPoints.map((keyPoint, index: number) => (
                              <div 
                                key={index} 
                                className={`p-2 rounded-md flex items-start space-x-2 ${
                                  keyPoint.highlighted ? 'bg-primary/5 border border-primary/20' : 'bg-muted'
                                }`}
                              >
                                {editingKeyPoints ? (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-5 w-5 p-0 text-muted-foreground"
                                    onClick={() => removeKeyPoint(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-5 w-5 p-0 text-muted-foreground"
                                    onClick={() => toggleKeyPointHighlight(index)}
                                  >
                                    {keyPoint.highlighted ? (
                                      <Star className="h-4 w-4 text-amber-500" />
                                    ) : (
                                      <StarOff className="h-4 w-4" />
                                    )}
                                  </Button>
                                )}
                                <div className="flex-1">
                                  <p className="text-sm">{keyPoint.text}</p>
                                  <Badge 
                                    className={`mt-1 text-xs ${getCategoryBadgeColor(keyPoint.category)}`}
                                  >
                                    {getCategoryDisplayName(keyPoint.category)}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                            
                            {editingKeyPoints && (
                              <div className="pt-2 space-y-2">
                                <Separator />
                                <div className="space-y-2">
                                  <Label htmlFor="new-key-point">Add Key Point</Label>
                                  <Textarea 
                                    id="new-key-point"
                                    placeholder="Enter new key point"
                                    value={newKeyPoint.text}
                                    onChange={(e) => setNewKeyPoint({...newKeyPoint, text: e.target.value})}
                                    className="min-h-[60px]"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label htmlFor="key-point-category">Category</Label>
                                    <Select 
                                      value={newKeyPoint.category} 
                                      onValueChange={(value) => setNewKeyPoint({...newKeyPoint, category: value})}
                                    >
                                      <SelectTrigger id="key-point-category">
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="information">Information</SelectItem>
                                        <SelectItem value="decision">Decision</SelectItem>
                                        <SelectItem value="action">Action</SelectItem>
                                        <SelectItem value="issue">Issue</SelectItem>
                                        <SelectItem value="resource">Resource</SelectItem>
                                        <SelectItem value="strength">Strength</SelectItem>
                                        <SelectItem value="development">Development</SelectItem>
                                        <SelectItem value="idea">Idea</SelectItem>
                                        <SelectItem value="approach">Approach</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex items-end">
                                    <div className="flex items-centre space-x-2">
                                      <Checkbox 
                                        id="highlight-key-point" 
                                        checked={newKeyPoint.highlighted}
                                        onCheckedChange={(checked) => setNewKeyPoint({...newKeyPoint, highlighted: checked as boolean})}
                                      />
                                      <Label htmlFor="highlight-key-point">Highlight</Label>
                                    </div>
                                  </div>
                                </div>
                                <Button 
                                  onClick={addKeyPoint}
                                  disabled={!newKeyPoint.text.trim()}
                                  className="w-full"
                                >
                                  Add Key Point
                                </Button>
                              </div>
                            )}
                            
                            {currentMeeting.keyPoints.length === 0 && !editingKeyPoints && (
                              <div className="text-centre py-4">
                                <p className="text-sm text-muted-foreground">No key points extracted</p>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => setEditingKeyPoints(true)}
                                >
                                  Add Manually
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                          <CardTitle className="text-md font-medium">Action Items</CardTitle>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditingActionItems(!editingActionItems)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {currentMeeting.actionItems.map((actionItem, index: number) => (
                              <div 
                                key={index} 
                                className={`p-2 rounded-md flex items-start space-x-2 ${
                                  actionItem.completed ? 'bg-muted' : 'bg-primary/5 border border-primary/20'
                                }`}
                              >
                                {editingActionItems ? (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-5 w-5 p-0 text-muted-foreground"
                                    onClick={() => removeActionItem(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Checkbox 
                                    checked={actionItem.completed}
                                    onCheckedChange={() => toggleActionItemCompletion(index)}
                                  />
                                )}
                                <div className="flex-1">
                                  <p className={`text-sm ${actionItem.completed ? 'line-through text-muted-foreground' : ''}`}>
                                    {actionItem.text}
                                  </p>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {actionItem.assignedTo && (
                                      <Badge variant="outline" className="text-xs">
                                        Assigned to: {actionItem.assignedTo}
                                      </Badge>
                                    )}
                                    {actionItem.dueDate && (
                                      <Badge variant="outline" className="text-xs">
                                        Due: {new Date(actionItem.dueDate).toLocaleDateString('en-GB')}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {editingActionItems && (
                              <div className="pt-2 space-y-2">
                                <Separator />
                                <div className="space-y-2">
                                  <Label htmlFor="new-action-item">Add Action Item</Label>
                                  <Textarea 
                                    id="new-action-item"
                                    placeholder="Enter new action item"
                                    value={newActionItem.text}
                                    onChange={(e) => setNewActionItem({...newActionItem, text: e.target.value})}
                                    className="min-h-[60px]"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="action-assigned-to">Assigned To</Label>
                                  <Input 
                                    id="action-assigned-to"
                                    placeholder="Enter name"
                                    value={newActionItem.assignedTo}
                                    onChange={(e) => setNewActionItem({...newActionItem, assignedTo: e.target.value})}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="action-due-date">Due Date</Label>
                                  <Input 
                                    id="action-due-date"
                                    type="date"
                                    value={newActionItem.dueDate}
                                    onChange={(e) => setNewActionItem({...newActionItem, dueDate: e.target.value})}
                                  />
                                </div>
                                <Button 
                                  onClick={addActionItem}
                                  disabled={!newActionItem.text.trim()}
                                  className="w-full"
                                >
                                  Add Action Item
                                </Button>
                              </div>
                            )}
                            
                            {currentMeeting.actionItems.length === 0 && !editingActionItems && (
                              <div className="text-centre py-4">
                                <p className="text-sm text-muted-foreground">No action items extracted</p>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => setEditingActionItems(true)}
                                >
                                  Add Manually
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-centre py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No meeting to review</h3>
                  <p className="mt-2 text-muted-foreground">
                    Record a meeting or upload an audio file to get started
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab('record')}
                  >
                    Go to Record
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Saved Tab */}
            <TabsContent value="saved" className="space-y-6">
              <div className="flex items-centre space-x-2">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search meetings by title, content, or tags..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>
              
              {filteredMeetings.length > 0 ? (
                <div className="space-y-4">
                  {filteredMeetings.map(meeting => (
                    <Card key={meeting.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div>
                            <CardTitle>{meeting.title}</CardTitle>
                            <CardDescription>
                              {getMeetingTypeDisplayName(meeting.type)} • {formatDate(meeting.date)}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => viewMeeting(meeting)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteMeeting(meeting.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <div>
                            <h3 className="text-sm font-medium">Participants:</h3>
                            <p className="text-sm text-muted-foreground">
                              {meeting.participants.join(', ')}
                            </p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium">Key Points:</h3>
                            <div className="mt-1">
                              {meeting.keyPoints
                                .filter((kp) => kp.highlighted)
                                .slice(0, 2)
                                .map((keyPoint, index: number) => (
                                  <div key={index} className="flex items-start space-x-2 mb-1">
                                    <Star className="h-3 w-3 text-amber-500 mt-1 flex-shrink-0" />
                                    <p className="text-xs text-muted-foreground">{keyPoint.text}</p>
                                  </div>
                                ))}
                              {meeting.keyPoints.filter((kp) => kp.highlighted).length > 2 && (
                                <p className="text-xs text-muted-foreground italic">
                                  +{meeting.keyPoints.filter((kp) => kp.highlighted).length - 2} more highlighted points
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium">Action Items:</h3>
                            <div className="mt-1">
                              {meeting.actionItems
                                .filter((ai) => !ai.completed)
                                .slice(0, 2)
                                .map((actionItem, index: number) => (
                                  <div key={index} className="flex items-start space-x-2 mb-1">
                                    <CheckCircle className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                    <p className="text-xs text-muted-foreground">{actionItem.text}</p>
                                  </div>
                                ))}
                              {meeting.actionItems.filter((ai) => !ai.completed).length > 2 && (
                                <p className="text-xs text-muted-foreground italic">
                                  +{meeting.actionItems.filter((ai) => !ai.completed).length - 2} more pending actions
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <div className="flex flex-wrap gap-1">
                          {meeting.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-centre py-12">
                  <Save className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No saved meetings</h3>
                  <p className="mt-2 text-muted-foreground">
                    {searchQuery ? "No meetings match your search criteria" : "Record and save meetings to access them here"}
                  </p>
                  {searchQuery ? (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab('record')}
                    >
                      Record New Meeting
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button 
            variant="outline"
            onClick={() => {
              // Open help documentation
              toast({
                title: "Help & Documentation",
                description: "Documentation would open here.",
                variant: "default"
              });
            }}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Help
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// Additional components for the file upload section
function Upload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function FileAudio(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3" />
      <path d="M14 2v6h6" />
      <path d="M10 20v-1a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0Z" />
      <path d="M6 20v-1a2 2 0 1 0-4 0v1a2 2 0 1 0 4 0Z" />
      <path d="M2 19v-3a6 6 0 0 1 12 0v3" />
    </svg>
  );
}

function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
