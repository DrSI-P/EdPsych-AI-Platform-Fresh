'use client';

import React, { useState, useEffect } from 'react';
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { 
  BookOpen, 
  FileText, 
  Users, 
  Calendar, 
  BarChart2, 
  PieChart as PieChartIcon, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus, 
  Trash, 
  Edit, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight, 
  Clipboard, 
  ClipboardCheck, 
  FileQuestion, 
  FileText as FileTextIcon, 
  FilePlus, 
  FileCheck, 
  Share2, 
  MessageSquare, 
  Award, 
  TrendingUp, 
  Zap, 
  Lightbulb, 
  Layers, 
  Briefcase, 
  Book, 
  Bookmark, 
  Star, 
  Flag, 
  HelpCircle, 
  Settings, 
  User, 
  UserPlus, 
  UserCheck, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Globe, 
  Map, 
  Target, 
  Compass, 
  Sliders, 
  Tag, 
  Tags, 
  Paperclip, 
  Link, 
  ExternalLink, 
  Mail, 
  Printer, 
  Camera, 
  Video, 
  Mic, 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  RefreshCw, 
  RotateCw, 
  RotateCcw, 
  Shuffle, 
  List, 
  Grid, 
  Table, 
  BarChart as BarChartIcon, 
  LineChart as LineChartIcon, 
  Activity, 
  AlertTriangle, 
  Info, 
  Database, 
  Server, 
  Folder, 
  FolderPlus, 
  FolderMinus, 
  File, 
  FileMinus, 
  Archive, 
  Inbox, 
  Send, 
  MessageCircle, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  Clipboard as ClipboardIcon, 
  Maximize, 
  Minimize, 
  X, 
  Menu, 
  MoreHorizontal, 
  MoreVertical, 
  Copy, 
  Scissors, 
  Loader, 
  Loader2, 
  Cpu, 
  Disc, 
  HardDrive, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Wifi, 
  WifiOff, 
  Bluetooth, 
  Battery, 
  BatteryCharging, 
  Home, 
  Building, 
  School, 
  Landmark, 
  Navigation, 
  MapPin, 
  Crosshair, 
  Anchor, 
  Compass as CompassIcon, 
  Thermometer, 
  Umbrella, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudDrizzle, 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset, 
  Wind, 
  Clock as ClockIcon, 
  Calendar as CalendarIcon, 
  Watch, 
  AlarmClock, 
  Bell, 
  BellOff, 
  Music, 
  Headphones, 
  Radio, 
  Tv, 
  Film, 
  Image, 
  Camera as CameraIcon, 
  Video as VideoIcon, 
  Aperture, 
  Mic as MicIcon, 
  VolumeX, 
  Volume1, 
  Volume2, 
  Volume, 
  Voicemail, 
  Phone, 
  PhoneCall, 
  PhoneForwarded, 
  PhoneIncoming, 
  PhoneMissed, 
  PhoneOff, 
  PhoneOutgoing, 
  MessageSquare as MessageSquareIcon, 
  MessageCircle as MessageCircleIcon, 
  Mail as MailIcon, 
  Send as SendIcon, 
  Share, 
  Share2 as Share2Icon, 
  Link as LinkIcon, 
  ExternalLink as ExternalLinkIcon, 
  Paperclip as PaperclipIcon, 
  Bookmark as BookmarkIcon, 
  Star as StarIcon, 
  Heart as HeartIcon, 
  ThumbsUp as ThumbsUpIcon, 
  ThumbsDown as ThumbsDownIcon, 
  Flag as FlagIcon, 
  Award as AwardIcon, 
  Gift, 
  Package, 
  ShoppingBag, 
  ShoppingCart, 
  CreditCard, 
  DollarSign, 
  Percent, 
  Truck, 
  Map as MapIcon, 
  MapPin as MapPinIcon, 
  Navigation as NavigationIcon, 
  Compass as CompassIcon2, 
  Globe as GlobeIcon, 
  Crosshair as CrosshairIcon, 
  Anchor as AnchorIcon, 
  Briefcase as BriefcaseIcon, 
  Clipboard as ClipboardIcon2, 
  ClipboardCheck as ClipboardCheckIcon, 
  FileText as FileTextIcon2, 
  FileQuestion as FileQuestionIcon, 
  FilePlus as FilePlusIcon, 
  FileCheck as FileCheckIcon, 
  File as FileIcon, 
  FileMinus as FileMinusIcon, 
  Folder as FolderIcon, 
  FolderPlus as FolderPlusIcon, 
  FolderMinus as FolderMinusIcon, 
  Archive as ArchiveIcon, 
  Inbox as InboxIcon, 
  Database as DatabaseIcon, 
  Server as ServerIcon, 
  HardDrive as HardDriveIcon, 
  Disc as DiscIcon, 
  Cpu as CpuIcon, 
  Monitor as MonitorIcon, 
  Smartphone as SmartphoneIcon, 
  Tablet as TabletIcon, 
  Tv as TvIcon, 
  Wifi as WifiIcon, 
  WifiOff as WifiOffIcon, 
  Bluetooth as BluetoothIcon, 
  Battery as BatteryIcon, 
  BatteryCharging as BatteryChargingIcon, 
  Home as HomeIcon, 
  Building as BuildingIcon, 
  School as SchoolIcon, 
  Landmark as LandmarkIcon, 
  Thermometer as ThermometerIcon, 
  Umbrella as UmbrellaIcon, 
  Cloud as CloudIcon, 
  CloudRain as CloudRainIcon, 
  CloudSnow as CloudSnowIcon, 
  CloudLightning as CloudLightningIcon, 
  CloudDrizzle as CloudDrizzleIcon, 
  Sun as SunIcon, 
  Moon as MoonIcon, 
  Sunrise as SunriseIcon, 
  Sunset as SunsetIcon, 
  Wind as WindIcon, 
  Clock as ClockIcon2, 
  Calendar as CalendarIcon2, 
  Watch as WatchIcon, 
  AlarmClock as AlarmClockIcon, 
  Bell as BellIcon, 
  BellOff as BellOffIcon, 
  Music as MusicIcon, 
  Headphones as HeadphonesIcon, 
  Radio as RadioIcon, 
  Film as FilmIcon, 
  Image as ImageIcon, 
  Aperture as ApertureIcon, 
  VolumeX as VolumeXIcon, 
  Volume1 as Volume1Icon, 
  Volume2 as Volume2Icon, 
  Volume as VolumeIcon, 
  Voicemail as VoicemailIcon, 
  Phone as PhoneIcon, 
  PhoneCall as PhoneCallIcon, 
  PhoneForwarded as PhoneForwardedIcon, 
  PhoneIncoming as PhoneIncomingIcon, 
  PhoneMissed as PhoneMissedIcon, 
  PhoneOff as PhoneOffIcon, 
  PhoneOutgoing as PhoneOutgoingIcon, 
  User as UserIcon, 
  UserPlus as UserPlusIcon, 
  UserCheck as UserCheckIcon, 
  Users as UsersIcon, 
  Lock as LockIcon, 
  Unlock as UnlockIcon, 
  Eye as EyeIcon, 
  EyeOff as EyeOffIcon, 
  Settings as SettingsIcon, 
  HelpCircle as HelpCircleIcon, 
  Info as InfoIcon, 
  AlertTriangle as AlertTriangleIcon, 
  AlertCircle as AlertCircleIcon, 
  CheckCircle as CheckCircleIcon, 
  X as XIcon, 
  Menu as MenuIcon, 
  MoreHorizontal as MoreHorizontalIcon, 
  MoreVertical as MoreVerticalIcon, 
  Copy as CopyIcon, 
  Scissors as ScissorsIcon, 
  Trash as TrashIcon, 
  Edit as EditIcon, 
  Save as SaveIcon, 
  Upload as UploadIcon, 
  Download as DownloadIcon, 
  Loader as LoaderIcon, 
  Loader2 as Loader2Icon, 
  RefreshCw as RefreshCwIcon, 
  RotateCw as RotateCwIcon, 
  RotateCcw as RotateCcwIcon, 
  Maximize as MaximizeIcon, 
  Minimize as MinimizeIcon, 
  Plus as PlusIcon, 
  Minus, 
  Divide, 
  ChevronDown as ChevronDownIcon, 
  ChevronUp as ChevronUpIcon, 
  ChevronRight as ChevronRightIcon, 
  ChevronLeft, 
  ArrowRight as ArrowRightIcon, 
  ArrowLeft as ArrowLeftIcon, 
  ArrowUp, 
  ArrowDown, 
  ArrowUpRight, 
  ArrowUpLeft, 
  ArrowDownRight, 
  ArrowDownLeft, 
  CornerUpRight, 
  CornerUpLeft, 
  CornerDownRight, 
  CornerDownLeft, 
  ChevronsUp, 
  ChevronsDown, 
  ChevronsRight, 
  ChevronsLeft, 
  Search as SearchIcon, 
  Filter as FilterIcon, 
  List as ListIcon, 
  Grid as GridIcon, 
  Table as TableIcon, 
  BarChart as BarChartIcon2, 
  LineChart as LineChartIcon2, 
  PieChart as PieChartIcon2, 
  Activity as ActivityIcon, 
  TrendingUp as TrendingUpIcon, 
  Zap as ZapIcon, 
  Lightbulb as LightbulbIcon, 
  Layers as LayersIcon, 
  Book as BookIcon, 
  BookOpen as BookOpenIcon, 
  FileText as FileTextIcon3, 
  Tag as TagIcon, 
  Tags as TagsIcon, 
  Target as TargetIcon, 
  Sliders as SlidersIcon, 
  Play as PlayIcon, 
  Pause as PauseIcon, 
  Square as SquareIcon, 
  SkipBack as SkipBackIcon, 
  SkipForward as SkipForwardIcon, 
  Repeat as RepeatIcon, 
  Shuffle as ShuffleIcon
} from "lucide-react";

// Mock data for research projects
const MOCK_RESEARCH_PROJECTS = [
  {
    id: 'proj1',
    title: 'Impact of Phonics Teaching Approaches on Early Reading',
    status: 'In Progress',
    lead: 'Sarah Johnson',
    school: 'Oakwood Primary',
    collaborators: 5,
    schools: 3,
    startDate: '2025-01-15',
    endDate: '2025-07-30',
    progress: 65,
    methodology: 'Mixed Methods',
    participants: 120,
    ethics: 'Approved',
    tags: ['Literacy', 'Early Years', 'Phonics', 'Reading'],
    description: 'Investigating the comparative effectiveness of synthetic and analytic phonics approaches in early reading development across multiple school contexts.'
  },
  {
    id: 'proj2',
    title: 'Mathematics Anxiety Intervention Study',
    status: 'Planning',
    lead: 'David Wilson',
    school: 'St. Mary\'s Primary',
    collaborators: 4,
    schools: 2,
    startDate: '2025-06-01',
    endDate: '2026-03-31',
    progress: 25,
    methodology: 'Experimental',
    participants: 90,
    ethics: 'Pending',
    tags: ['Mathematics', 'Anxiety', 'Intervention', 'Primary'],
    description: 'Evaluating the effectiveness of a targeted intervention program for reducing mathematics anxiety in Key Stage 2 pupils.'
  },
  {
    id: 'proj3',
    title: 'SEND Provision Mapping Effectiveness',
    status: 'Completed',
    lead: 'Emma Thompson',
    school: 'Riverside Academy',
    collaborators: 7,
    schools: 4,
    startDate: '2024-09-01',
    endDate: '2025-03-31',
    progress: 100,
    methodology: 'Case Study',
    participants: 45,
    ethics: 'Approved',
    tags: ['SEND', 'Inclusion', 'Provision Mapping', 'Secondary'],
    description: 'Examining the impact of structured provision mapping on outcomes for students with special educational needs and disabilities across multiple secondary settings.'
  },
  {
    id: 'proj4',
    title: 'Digital Literacy Development in KS3',
    status: 'Analysis',
    lead: 'Michael Chen',
    school: 'Highfield Secondary',
    collaborators: 6,
    schools: 3,
    startDate: '2024-11-15',
    endDate: '2025-06-30',
    progress: 80,
    methodology: 'Mixed Methods',
    participants: 150,
    ethics: 'Approved',
    tags: ['Digital Literacy', 'Secondary', 'Technology', 'Curriculum'],
    description: 'Investigating approaches to developing digital literacy skills within the Key Stage 3 curriculum and their impact on student outcomes.'
  },
  {
    id: 'proj5',
    title: 'Restorative Practise Implementation Study',
    status: 'In Progress',
    lead: 'Priya Patel',
    school: 'Meadowview School',
    collaborators: 8,
    schools: 5,
    startDate: '2025-01-10',
    endDate: '2025-12-15',
    progress: 45,
    methodology: 'Action Research',
    participants: 200,
    ethics: 'Approved',
    tags: ['Behaviour', 'Restorative Practise', 'Whole School', 'Wellbeing'],
    description: 'A collaborative action research project examining the implementation and impact of restorative practices across multiple school settings.'
  }
];

// Mock data for research outputs
const MOCK_RESEARCH_OUTPUTS = [
  {
    id: 'out1',
    title: 'Synthetic Phonics Implementation: A Cross-School Analysis',
    type: 'Report',
    authors: ['Sarah Johnson', 'James Smith', 'Emma Brown'],
    schools: ['Oakwood Primary', 'St. Mary\'s Primary', 'Riverside Academy'],
    date: '2025-03-15',
    downloads: 87,
    citations: 12,
    tags: ['Literacy', 'Phonics', 'Implementation', 'Primary'],
    abstract: 'This report presents findings from a cross-school analysis of synthetic phonics implementation, identifying key success factors and challenges across different educational contexts.'
  },
  {
    id: 'out2',
    title: 'Supporting SEND Students: Effective Provision Mapping',
    type: 'Journal Article',
    authors: ['Emma Thompson', 'David Wilson', 'Michael Chen'],
    schools: ['Riverside Academy', 'St. Mary\'s Primary', 'Highfield Secondary'],
    date: '2025-02-28',
    downloads: 124,
    citations: 8,
    tags: ['SEND', 'Inclusion', 'Provision Mapping', 'Secondary'],
    abstract: 'This article examines the effectiveness of structured provision mapping approaches for supporting students with special educational needs and disabilities across multiple educational settings.'
  },
  {
    id: 'out3',
    title: 'Digital Literacy Framework for Secondary Schools',
    type: 'Toolkit',
    authors: ['Michael Chen', 'Priya Patel', 'Sarah Johnson'],
    schools: ['Highfield Secondary', 'Meadowview School', 'Oakwood Primary'],
    date: '2025-01-20',
    downloads: 156,
    citations: 5,
    tags: ['Digital Literacy', 'Framework', 'Secondary', 'Curriculum'],
    abstract: 'A practical toolkit for developing and implementing a comprehensive digital literacy framework within secondary school settings, based on research across multiple schools.'
  },
  {
    id: 'out4',
    title: 'Mathematics Anxiety: Early Intervention Approaches',
    type: 'Conference Paper',
    authors: ['David Wilson', 'Emma Thompson'],
    schools: ['St. Mary\'s Primary', 'Riverside Academy'],
    date: '2024-11-10',
    downloads: 68,
    citations: 3,
    tags: ['Mathematics', 'Anxiety', 'Intervention', 'Primary'],
    abstract: 'This paper presents preliminary findings from an intervention study addressing mathematics anxiety in primary school pupils, with implications for classroom practise.'
  },
  {
    id: 'out5',
    title: 'Restorative Approaches in UK Schools: Implementation Guide',
    type: 'Practise Guide',
    authors: ['Priya Patel', 'Sarah Johnson', 'James Smith'],
    schools: ['Meadowview School', 'Oakwood Primary', 'St. Mary\'s Primary'],
    date: '2025-04-05',
    downloads: 112,
    citations: 7,
    tags: ['Behaviour', 'Restorative Practise', 'Implementation', 'Guide'],
    abstract: 'A comprehensive guide to implementing restorative approaches in UK school settings, based on findings from a multi-school action research project.'
  }
];

// Mock data for research methods
const MOCK_RESEARCH_METHODS = [
  {
    id: 'method1',
    title: 'Student Voice Survey Template',
    type: 'Survey',
    creator: 'Sarah Johnson',
    school: 'Oakwood Primary',
    downloads: 145,
    rating: 4.8,
    tags: ['Student Voice', 'Survey', 'Feedback', 'Wellbeing'],
    description: 'A validated survey template for gathering student voice data across multiple age ranges, with guidance for administration and analysis.'
  },
  {
    id: 'method2',
    title: 'Classroom Observation Protocol for Literacy Teaching',
    type: 'Observation Tool',
    creator: 'Emma Thompson',
    school: 'Riverside Academy',
    downloads: 98,
    rating: 4.6,
    tags: ['Literacy', 'Observation', 'Teaching Quality', 'Assessment'],
    description: 'A structured observation protocol for assessing literacy teaching practices, with rubrics and guidance for consistent implementation.'
  },
  {
    id: 'method3',
    title: 'Semi-Structured Interview Guide for SEND Research',
    type: 'Interview Guide',
    creator: 'David Wilson',
    school: 'St. Mary\'s Primary',
    downloads: 112,
    rating: 4.7,
    tags: ['SEND', 'Interview', 'Qualitative', 'Inclusion'],
    description: 'A comprehensive guide for conducting semi-structured interviews with stakeholders in SEND research, including question banks and analysis frameworks.'
  },
  {
    id: 'method4',
    title: 'Digital Skills Assessment Framework',
    type: 'Assessment Tool',
    creator: 'Michael Chen',
    school: 'Highfield Secondary',
    downloads: 87,
    rating: 4.5,
    tags: ['Digital Literacy', 'Assessment', 'Skills', 'Secondary'],
    description: 'A framework for assessing digital literacy skills across Key Stages 3 and 4, with rubrics and practical assessment activities.'
  },
  {
    id: 'method5',
    title: 'Behaviour Incident Analysis Toolkit',
    type: 'Analysis Framework',
    creator: 'Priya Patel',
    school: 'Meadowview School',
    downloads: 76,
    rating: 4.4,
    tags: ['Behaviour', 'Analysis', 'Incidents', 'Patterns'],
    description: 'A systematic approach to analysing behaviour incidents, identifying patterns, and developing targeted interventions based on data.'
  }
];

// Mock data for research networks
const MOCK_RESEARCH_NETWORKS = [
  {
    id: 'network1',
    name: 'Early Literacy Research Network',
    members: 42,
    schools: 15,
    projects: 8,
    outputs: 12,
    focus: ['Phonics', 'Early Reading', 'Language Development', 'Literacy'],
    description: 'A collaborative network of researchers and practitioners focused on early literacy development and effective teaching approaches.'
  },
  {
    id: 'network2',
    name: 'SEND Research Collaborative',
    members: 38,
    schools: 22,
    projects: 6,
    outputs: 9,
    focus: ['SEND', 'Inclusion', 'Differentiation', 'Support Strategies'],
    description: 'A network dedicated to researching effective approaches for supporting students with special educational needs and disabilities.'
  },
  {
    id: 'network3',
    name: 'Mathematics Education Research Group',
    members: 35,
    schools: 18,
    projects: 5,
    outputs: 7,
    focus: ['Mathematics', 'Numeracy', 'Problem Solving', 'Mastery'],
    description: 'A collaborative group investigating effective approaches to mathematics teaching and learning across all key stages.'
  },
  {
    id: 'network4',
    name: 'Digital Learning Research Network',
    members: 40,
    schools: 25,
    projects: 7,
    outputs: 11,
    focus: ['EdTech', 'Digital Literacy', 'Online Learning', 'Technology Integration'],
    description: 'A network exploring the effective integration of technology in teaching and learning across educational settings.'
  },
  {
    id: 'network5',
    name: 'Behaviour and Wellbeing Research Collaborative',
    members: 45,
    schools: 28,
    projects: 9,
    outputs: 14,
    focus: ['Behaviour', 'Wellbeing', 'Mental Health', 'Restorative Practise'],
    description: 'A collaborative network researching approaches to supporting positive behaviour and wellbeing in educational settings.'
  }
];

// Mock data for research impact
const MOCK_RESEARCH_IMPACT = [
  {
    id: 'impact1',
    project: 'Synthetic Phonics Implementation Study',
    type: 'Practise Change',
    schools: 18,
    students: 4500,
    description: 'Implementation of revised synthetic phonics approach based on research findings, resulting in 15% improvement in early reading outcomes.',
    evidence: ['Assessment Data', 'Teacher Surveys', 'Classroom Observations'],
    testimonial: 'The research findings transformed our approach to phonics teaching, with significant improvements in pupil outcomes and teacher confidence.'
  },
  {
    id: 'impact2',
    project: 'SEND Provision Mapping Study',
    type: 'Policy Change',
    schools: 12,
    students: 3200,
    description: 'Development of new SEND provision mapping policy adopted by local authority, improving consistency and effectiveness of support.',
    evidence: ['Policy Documents', 'Stakeholder Feedback', 'Case Studies'],
    testimonial: 'The research-informed provision mapping approach has significantly improved our ability to track and evaluate SEND support effectiveness.'
  },
  {
    id: 'impact3',
    project: 'Digital Literacy Framework Project',
    type: 'Curriculum Development',
    schools: 15,
    students: 8500,
    description: 'Implementation of comprehensive digital literacy curriculum framework across multiple schools, enhancing student skills and teacher confidence.',
    evidence: ['Skills Assessments', 'Curriculum Documents', 'Student Work Samples'],
    testimonial: 'The digital literacy framework has transformed our approach to technology integration across the curriculum, with measurable improvements in student capabilities.'
  },
  {
    id: 'impact4',
    project: 'Mathematics Anxiety Intervention Study',
    type: 'Student Outcomes',
    schools: 8,
    students: 1200,
    description: 'Implementation of targeted intervention reducing mathematics anxiety and improving attainment for participating students.',
    evidence: ['Anxiety Measures', 'Attainment Data', 'Student Interviews'],
    testimonial: 'The intervention has made a remarkable difference to our students\' confidence and engagement with mathematics, particularly for previously anxious learners.'
  },
  {
    id: 'impact5',
    project: 'Restorative Practise Implementation Study',
    type: 'School Culture',
    schools: 10,
    students: 6500,
    description: 'Whole-school implementation of restorative approaches, resulting in 40% reduction in exclusions and improved school climate.',
    evidence: ['Behaviour Data', 'Climate Surveys', 'Stakeholder Interviews'],
    testimonial: 'The research-based implementation of restorative practices has transformed our school culture and significantly reduced serious behaviour incidents.'
  }
];

// Colors for charts
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f43f5e', '#84cc16'];

export default function ResearchCollaboration() {
  const [activeTab, setActiveTab] = useState('projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethodology, setSelectedMethodology] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  
  // Filter projects based on search and filters
  const filteredProjects = MOCK_RESEARCH_PROJECTS.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMethodology = selectedMethodology === 'all' || project.methodology === selectedMethodology;
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    const matchesSchool = selectedSchool === 'all' || project.school === selectedSchool;
    
    return matchesSearch && matchesMethodology && matchesStatus && matchesSchool;
  });
  
  // Filter research outputs based on search
  const filteredOutputs = MOCK_RESEARCH_OUTPUTS.filter(output => {
    return output.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           output.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
           output.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
  });
  
  // Handle project selection
  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };
  
  // Handle project creation
  const handleCreateProject = () => {
    setIsCreatingProject(true);
    setSelectedProject(null);
  };
  
  // Handle cancel project creation
  const handleCancelCreate = () => {
    setIsCreatingProject(false);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-centre">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Research Collaboration</h1>
          <p className="text-muted-foreground">
            Conduct, share, and collaborate on educational research projects
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleCreateProject} className="flex items-centre">
            <Plus className="mr-2 h-4 w-4" /> New Research Project
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-centre text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">+3</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Research Outputs</p>
                <p className="text-3xl font-bold">28</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-centre text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">+5</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Participating Schools</p>
                <p className="text-3xl font-bold">32</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <School className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-centre text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">+2</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Research Networks</p>
                <p className="text-3xl font-bold">5</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-centre text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">+1</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-centre space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects, outputs, or methods..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={selectedMethodology} onValueChange={setSelectedMethodology}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Methodology" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methodologies</SelectItem>
            <SelectItem value="Mixed Methods">Mixed Methods</SelectItem>
            <SelectItem value="Experimental">Experimental</SelectItem>
            <SelectItem value="Case Study">Case Study</SelectItem>
            <SelectItem value="Action Research">Action Research</SelectItem>
            <SelectItem value="Survey">Survey</SelectItem>
            <SelectItem value="Ethnographic">Ethnographic</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Planning">Planning</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Analysis">Analysis</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedSchool} onValueChange={setSelectedSchool}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="School" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Schools</SelectItem>
            <SelectItem value="Oakwood Primary">Oakwood Primary</SelectItem>
            <SelectItem value="St. Mary's Primary">St. Mary's Primary</SelectItem>
            <SelectItem value="Riverside Academy">Riverside Academy</SelectItem>
            <SelectItem value="Highfield Secondary">Highfield Secondary</SelectItem>
            <SelectItem value="Meadowview School">Meadowview School</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="projects" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="outputs">Research Outputs</TabsTrigger>
          <TabsTrigger value="methods">Research Methods</TabsTrigger>
          <TabsTrigger value="networks">Research Networks</TabsTrigger>
          <TabsTrigger value="impact">Research Impact</TabsTrigger>
        </TabsList>
        
        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          {selectedProject || isCreatingProject ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-centre">
                  <div>
                    {isCreatingProject ? (
                      <CardTitle>Create New Research Project</CardTitle>
                    ) : (
                      <CardTitle>{selectedProject.title}</CardTitle>
                    )}
                    {!isCreatingProject && (
                      <CardDescription>
                        Led by {selectedProject.lead} ({selectedProject.school})
                      </CardDescription>
                    )}
                  </div>
                  <Button variant="outline" onClick={() => {
                    setSelectedProject(null);
                    setIsCreatingProject(false);
                  }}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isCreatingProject ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="project-title">Project Title</Label>
                      <Input id="project-title" placeholder="Enter project title" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="project-description">Project Description</Label>
                      <Textarea id="project-description" placeholder="Describe your research project" rows={4} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="project-methodology">Methodology</Label>
                        <Select>
                          <SelectTrigger id="project-methodology">
                            <SelectValue placeholder="Select methodology" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mixed">Mixed Methods</SelectItem>
                            <SelectItem value="experimental">Experimental</SelectItem>
                            <SelectItem value="case-study">Case Study</SelectItem>
                            <SelectItem value="action">Action Research</SelectItem>
                            <SelectItem value="survey">Survey</SelectItem>
                            <SelectItem value="ethnographic">Ethnographic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="project-status">Status</Label>
                        <Select defaultValue="planning">
                          <SelectTrigger id="project-status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="analysis">Analysis</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="project-start">Start Date</Label>
                        <Input id="project-start" type="date" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="project-end">End Date</Label>
                        <Input id="project-end" type="date" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="project-tags">Tags (comma separated)</Label>
                      <Input id="project-tags" placeholder="e.g., Literacy, Primary, Reading" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Ethics Approval</Label>
                      <div className="flex items-centre space-x-2">
                        <Checkbox id="ethics-required" />
                        <label
                          htmlFor="ethics-required"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          This project requires ethics approval
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Invite Collaborators</Label>
                      <div className="flex space-x-2">
                        <Input placeholder="Enter email address" className="flex-1" />
                        <Button variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={handleCancelCreate}>Cancel</Button>
                      <Button>Create Project</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">Project Details</h3>
                          <Separator className="my-2" />
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt className="text-sm text-muted-foreground">Status:</dt>
                              <dd>
                                <Badge className={
                                  selectedProject.status === 'Completed' ? 'bg-green-500' :
                                  selectedProject.status === 'In Progress' ? 'bg-blue-500' :
                                  selectedProject.status === 'Planning' ? 'bg-amber-500' :
                                  'bg-purple-500'
                                }>
                                  {selectedProject.status}
                                </Badge>
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm text-muted-foreground">Methodology:</dt>
                              <dd className="text-sm font-medium">{selectedProject.methodology}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm text-muted-foreground">Start Date:</dt>
                              <dd className="text-sm font-medium">{selectedProject.startDate}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm text-muted-foreground">End Date:</dt>
                              <dd className="text-sm font-medium">{selectedProject.endDate}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm text-muted-foreground">Participants:</dt>
                              <dd className="text-sm font-medium">{selectedProject.participants}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm text-muted-foreground">Ethics:</dt>
                              <dd>
                                <Badge variant={selectedProject.ethics === 'Approved' ? 'default' : 'outline'}>
                                  {selectedProject.ethics}
                                </Badge>
                              </dd>
                            </div>
                          </dl>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium">Collaboration</h3>
                          <Separator className="my-2" />
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt className="text-sm text-muted-foreground">Collaborators:</dt>
                              <dd className="text-sm font-medium">{selectedProject.collaborators}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm text-muted-foreground">Schools:</dt>
                              <dd className="text-sm font-medium">{selectedProject.schools}</dd>
                            </div>
                          </dl>
                          <div className="mt-4">
                            <Button variant="outline" className="w-full text-sm">
                              <UserPlus className="mr-2 h-4 w-4" /> Invite Collaborators
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium">Tags</h3>
                          <Separator className="my-2" />
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2 space-y-6">
                        <div>
                          <h3 className="text-lg font-medium">Description</h3>
                          <Separator className="my-2" />
                          <p className="text-sm">{selectedProject.description}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium">Progress</h3>
                          <Separator className="my-2" />
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Overall Completion</span>
                              <span className="font-medium">{selectedProject.progress}%</span>
                            </div>
                            <Progress value={selectedProject.progress} className="h-2" />
                          </div>
                          
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="bg-muted/50">
                              <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-sm">Project Milestones</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <ul className="space-y-2 text-sm">
                                  <li className="flex items-centre">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    <span>Research question formulation</span>
                                  </li>
                                  <li className="flex items-centre">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    <span>Ethics approval</span>
                                  </li>
                                  <li className="flex items-centre">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    <span>Data collection tools development</span>
                                  </li>
                                  {selectedProject.progress >= 50 ? (
                                    <li className="flex items-centre">
                                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                      <span>Initial data collection</span>
                                    </li>
                                  ) : (
                                    <li className="flex items-centre">
                                      <Circle className="h-4 w-4 text-muted-foreground mr-2" />
                                      <span className="text-muted-foreground">Initial data collection</span>
                                    </li>
                                  )}
                                  {selectedProject.progress >= 75 ? (
                                    <li className="flex items-centre">
                                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                      <span>Data analysis</span>
                                    </li>
                                  ) : (
                                    <li className="flex items-centre">
                                      <Circle className="h-4 w-4 text-muted-foreground mr-2" />
                                      <span className="text-muted-foreground">Data analysis</span>
                                    </li>
                                  )}
                                  {selectedProject.progress === 100 ? (
                                    <li className="flex items-centre">
                                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                      <span>Final report</span>
                                    </li>
                                  ) : (
                                    <li className="flex items-centre">
                                      <Circle className="h-4 w-4 text-muted-foreground mr-2" />
                                      <span className="text-muted-foreground">Final report</span>
                                    </li>
                                  )}
                                </ul>
                              </CardContent>
                            </Card>
                            
                            <Card className="bg-muted/50">
                              <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-sm">Upcoming Tasks</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <ul className="space-y-2 text-sm">
                                  {selectedProject.progress < 100 && (
                                    <>
                                      {selectedProject.progress < 50 && (
                                        <li className="flex items-centre">
                                          <Clock className="h-4 w-4 text-amber-500 mr-2" />
                                          <span>Complete initial data collection (Due: {new Date(selectedProject.startDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })})</span>
                                        </li>
                                      )}
                                      {selectedProject.progress >= 50 && selectedProject.progress < 75 && (
                                        <li className="flex items-centre">
                                          <Clock className="h-4 w-4 text-amber-500 mr-2" />
                                          <span>Begin data analysis (Due: {new Date(selectedProject.startDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })})</span>
                                        </li>
                                      )}
                                      {selectedProject.progress >= 75 && selectedProject.progress < 100 && (
                                        <li className="flex items-centre">
                                          <Clock className="h-4 w-4 text-amber-500 mr-2" />
                                          <span>Draft final report (Due: {new Date(selectedProject.endDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })})</span>
                                        </li>
                                      )}
                                      <li className="flex items-centre">
                                        <Clock className="h-4 w-4 text-blue-500 mr-2" />
                                        <span>Collaborator meeting (Due: {new Date().toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })})</span>
                                      </li>
                                      <li className="flex items-centre">
                                        <Clock className="h-4 w-4 text-blue-500 mr-2" />
                                        <span>Progress update (Due: {new Date().toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })})</span>
                                      </li>
                                    </>
                                  )}
                                  {selectedProject.progress === 100 && (
                                    <li className="flex items-centre">
                                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                      <span>All tasks completed</span>
                                    </li>
                                  )}
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium">Actions</h3>
                          <Separator className="my-2" />
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <Button variant="outline" className="text-sm">
                              <FileText className="mr-2 h-4 w-4" /> View Data
                            </Button>
                            <Button variant="outline" className="text-sm">
                              <MessageSquare className="mr-2 h-4 w-4" /> Discussions
                            </Button>
                            <Button variant="outline" className="text-sm">
                              <Calendar className="mr-2 h-4 w-4" /> Schedule
                            </Button>
                            <Button variant="outline" className="text-sm">
                              <Share2 className="mr-2 h-4 w-4" /> Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleProjectSelect(project)}>
                  <CardContent className="p-6">
                    <div className="flex justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge className={
                          project.status === 'Completed' ? 'bg-green-500' :
                          project.status === 'In Progress' ? 'bg-blue-500' :
                          project.status === 'Planning' ? 'bg-amber-500' :
                          'bg-purple-500'
                        }>
                          {project.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{project.methodology}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-centre">
                      <div className="flex items-centre">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback>{project.lead.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{project.lead}</span>
                        <span className="text-sm text-muted-foreground mx-2">•</span>
                        <School className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{project.school}</span>
                      </div>
                      <div className="flex items-centre space-x-4">
                        <div className="flex items-centre">
                          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{project.collaborators}</span>
                        </div>
                        <div className="flex items-centre">
                          <School className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{project.schools}</span>
                        </div>
                        <div className="w-24">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-1" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredProjects.length === 0 && (
                <Card>
                  <CardContent className="p-6 flex flex-col items-centre justify-centre">
                    <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-centre">No projects found</h3>
                    <p className="text-sm text-muted-foreground text-centre mt-1">Try adjusting your search or filters</p>
                    <Button className="mt-4" onClick={handleCreateProject}>
                      <Plus className="mr-2 h-4 w-4" /> Create New Project
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
        
        {/* Research Outputs Tab */}
        <TabsContent value="outputs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOutputs.map((output) => (
              <Card key={output.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{output.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{output.abstract}</p>
                    </div>
                    <Badge>{output.type}</Badge>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm">
                      <span className="font-medium">Authors:</span> {output.authors.join(', ')}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Schools:</span> {output.schools.join(', ')}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Published:</span> {output.date}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {output.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between items-centre">
                    <div className="flex items-centre space-x-4">
                      <div className="flex items-centre">
                        <Download className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{output.downloads}</span>
                      </div>
                      <div className="flex items-centre">
                        <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{output.citations} citations</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" /> Download
                      </Button>
                      <Button size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" /> View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredOutputs.length === 0 && (
              <Card className="md:col-span-2">
                <CardContent className="p-6 flex flex-col items-centre justify-centre">
                  <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-centre">No research outputs found</h3>
                  <p className="text-sm text-muted-foreground text-centre mt-1">Try adjusting your search criteria</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        {/* Research Methods Tab */}
        <TabsContent value="methods" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_RESEARCH_METHODS.map((method) => (
              <Card key={method.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{method.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{method.description}</p>
                    </div>
                    <Badge>{method.type}</Badge>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm">
                      <span className="font-medium">Creator:</span> {method.creator}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">School:</span> {method.school}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {method.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between items-centre">
                    <div className="flex items-centre space-x-4">
                      <div className="flex items-centre">
                        <Download className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{method.downloads}</span>
                      </div>
                      <div className="flex items-centre">
                        <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-muted-foreground">{method.rating}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" /> Download
                      </Button>
                      <Button size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" /> View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Research Networks Tab */}
        <TabsContent value="networks" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {MOCK_RESEARCH_NETWORKS.map((network) => (
              <Card key={network.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{network.name}</h3>
                      <p className="text-sm text-muted-foreground">{network.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <UserPlus className="h-4 w-4 mr-1" /> Join Network
                    </Button>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-muted/50 p-3 rounded-md flex flex-col items-centre justify-centre">
                      <p className="text-2xl font-bold">{network.members}</p>
                      <p className="text-sm text-muted-foreground">Members</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md flex flex-col items-centre justify-centre">
                      <p className="text-2xl font-bold">{network.schools}</p>
                      <p className="text-sm text-muted-foreground">Schools</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md flex flex-col items-centre justify-centre">
                      <p className="text-2xl font-bold">{network.projects}</p>
                      <p className="text-sm text-muted-foreground">Projects</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md flex flex-col items-centre justify-centre">
                      <p className="text-2xl font-bold">{network.outputs}</p>
                      <p className="text-sm text-muted-foreground">Outputs</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Focus Areas:</p>
                    <div className="flex flex-wrap gap-2">
                      {network.focus.map((area, index) => (
                        <Badge key={index} variant="secondary">{area}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" /> Discussions
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-1" /> Events
                    </Button>
                    <Button size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" /> View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Research Impact Tab */}
        <TabsContent value="impact" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <BarChart2 className="mr-2 h-5 w-5" /> Impact by Type
                </CardTitle>
                <CardDescription>
                  Distribution of research impact by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Practise Change', value: 18 },
                        { name: 'Policy Change', value: 12 },
                        { name: 'Curriculum Development', value: 15 },
                        { name: 'Student Outcomes', value: 22 },
                        { name: 'School Culture', value: 10 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <PieChartIcon className="mr-2 h-5 w-5" /> Schools Impacted
                </CardTitle>
                <CardDescription>
                  Number of schools impacted by research
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Primary', value: 24 },
                          { name: 'Secondary', value: 18 },
                          { name: 'Special', value: 12 },
                          { name: 'All-through', value: 8 },
                          { name: 'Alternative Provision', value: 5 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Primary', value: 24 },
                          { name: 'Secondary', value: 18 },
                          { name: 'Special', value: 12 },
                          { name: 'All-through', value: 8 },
                          { name: 'Alternative Provision', value: 5 },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {MOCK_RESEARCH_IMPACT.map((impact) => (
              <Card key={impact.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{impact.project}</h3>
                      <p className="text-sm text-muted-foreground">{impact.description}</p>
                    </div>
                    <Badge>{impact.type}</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Schools Impacted:</span> {impact.schools}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Students Reached:</span> {impact.students}
                      </p>
                      <p className="text-sm font-medium mt-2">Evidence:</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {impact.evidence.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-md">
                      <p className="text-sm font-medium mb-2">Testimonial:</p>
                      <p className="text-sm italic">"{impact.testimonial}"</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" /> Case Study
                    </Button>
                    <Button size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" /> View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
