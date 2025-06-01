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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Button, 
  Input, 
  Textarea, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Label,
  Checkbox,
  Badge,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Users, 
  FileText, 
  Save, 
  Download,
  Plus,
  Trash2,
  Edit,
  Search,
  Filter,
  Calendar,
  Bell,
  ArrowUpRight,
  MessageSquare,
  BarChart,
  CheckSquare,
  XSquare,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format, addDays, isAfter, isBefore, parseISO } from 'date-fns';

/**
 * Agreement Tracking System Component
 * 
 * This component provides tools for documenting, monitoring, and following up
 * on agreements made during restorative processes.
 * 
 * Key features:
 * - Agreement creation and documentation
 * - Progress tracking and monitoring
 * - Reminder system for follow-ups
 * - Reporting and analytics
 * - Integration with other restorative justice tools
 */
const AgreementTrackingSystem = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [agreements, setAgreements] = useState([]);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [newAgreement, setNewAgreement] = useState({
    title: "",
    description: "",
    type: "",
    participants: [],
    facilitator: "",
    terms: [],
    followUpDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    notes: ""
  });
  const [newParticipant, setNewParticipant] = useState("");
  const [newTerm, setNewTerm] = useState({
    description: "",
    responsibleParty: "",
    dueDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    status: "pending"
  });
  const [progressUpdate, setProgressUpdate] = useState({
    termId: "",
    status: "",
    notes: ""
  });

  // Mock data for demonstration
  const mockAgreements = [
    {
      id: "agr-001",
      title: "Classroom Disruption Resolution",
      description: "Agreement following disruptive behaviour in Year 8 Science class",
      type: "behavioural",
      status: "active",
      createdAt: "2025-05-10T10:30:00Z",
      participants: ["James Wilson (Student)", "Sarah Thompson (Teacher)", "Mark Davies (Head of Year)"],
      facilitator: "Dr. Emily Richards (School Psychologist)",
      terms: [
        {
          id: "term-001",
          description: "James will apologize to the class for the disruption",
          responsibleParty: "James Wilson",
          dueDate: "2025-05-12",
          status: "completed",
          completedDate: "2025-05-12",
          notes: "Apology delivered sincerely during morning registration"
        },
        {
          id: "term-002",
          description: "James will meet with Ms. Thompson weekly to discuss any challenges",
          responsibleParty: "James Wilson, Sarah Thompson",
          dueDate: "2025-06-10",
          status: "in-progress",
          completedDate: null,
          notes: "First meeting held successfully on 15/05"
        },
        {
          id: "term-003",
          description: "School will provide access to quiet study space during lunch periods",
          responsibleParty: "Mark Davies",
          dueDate: "2025-05-15",
          status: "completed",
          completedDate: "2025-05-14",
          notes: "Library pass issued"
        }
      ],
      followUpDate: "2025-05-24",
      progress: 67,
      notes: "Initial meeting was productive. James showed genuine remorse and willingness to make amends.",
      updates: [
        {
          date: "2025-05-12",
          author: "Sarah Thompson",
          content: "James delivered his apology to the class today. It was well-received and several students spoke with him afterward."
        },
        {
          date: "2025-05-15",
          author: "Mark Davies",
          content: "Weekly check-in system established. James has been provided with a quiet study space pass for the library."
        }
      ]
    },
    {
      id: "agr-002",
      title: "Friendship Group Conflict Resolution",
      description: "Agreement to address ongoing conflicts in Year 6 friendship group",
      type: "interpersonal",
      status: "active",
      createdAt: "2025-05-08T14:15:00Z",
      participants: ["Emma Johnson (Student)", "Olivia Smith (Student)", "Sophia Brown (Student)", "Mrs. Wilson (Teacher)"],
      facilitator: "Ms. Parker (Pastoral Lead)",
      terms: [
        {
          id: "term-004",
          description: "All students will participate in weekly friendship circle",
          responsibleParty: "Emma, Olivia, Sophia, Mrs. Wilson",
          dueDate: "2025-06-05",
          status: "in-progress",
          completedDate: null,
          notes: "First two sessions completed successfully"
        },
        {
          id: "term-005",
          description: "Students will use 'pause and reflect' cards when conflicts arise",
          responsibleParty: "Emma, Olivia, Sophia",
          dueDate: "2025-05-31",
          status: "in-progress",
          completedDate: null,
          notes: "Cards being used inconsistently, needs reinforcement"
        },
        {
          id: "term-006",
          description: "Create shared friendship agreement with group values",
          responsibleParty: "Emma, Olivia, Sophia, Mrs. Wilson",
          dueDate: "2025-05-15",
          status: "completed",
          completedDate: "2025-05-15",
          notes: "Agreement created and signed by all parties"
        }
      ],
      followUpDate: "2025-05-22",
      progress: 45,
      notes: "Group showed initial resistance but engaged well after first circle session.",
      updates: [
        {
          date: "2025-05-15",
          author: "Mrs. Wilson",
          content: "Friendship agreement completed today. All girls contributed meaningful values and signed willingly."
        },
        {
          date: "2025-05-17",
          author: "Ms. Parker",
          content: "Observed playground interaction - girls using reflection cards when disagreement started about game rules."
        }
      ]
    },
    {
      id: "agr-003",
      title: "Property Damage Reparation",
      description: "Agreement following damage to school property in Year 10 common area",
      type: "reparative",
      status: "completed",
      createdAt: "2025-04-25T09:45:00Z",
      participants: ["Daniel Taylor (Student)", "Mr. Roberts (Facilities Manager)", "Mrs. Hughes (Deputy Head)"],
      facilitator: "Mr. Johnson (Restorative Practise Lead)",
      terms: [
        {
          id: "term-007",
          description: "Daniel will help repair the damaged wall during two after-school sessions",
          responsibleParty: "Daniel Taylor, Mr. Roberts",
          dueDate: "2025-05-02",
          status: "completed",
          completedDate: "2025-05-02",
          notes: "Repair work completed satisfactorily"
        },
        {
          id: "term-008",
          description: "Daniel will create a poster about respecting school property",
          responsibleParty: "Daniel Taylor",
          dueDate: "2025-05-09",
          status: "completed",
          completedDate: "2025-05-07",
          notes: "Poster displayed in common area"
        },
        {
          id: "term-009",
          description: "School will review supervision in common areas",
          responsibleParty: "Mrs. Hughes",
          dueDate: "2025-05-16",
          status: "completed",
          completedDate: "2025-05-14",
          notes: "New supervision rota implemented"
        }
      ],
      followUpDate: "2025-05-16",
      progress: 100,
      notes: "Daniel showed genuine remorse and engaged positively throughout the process.",
      updates: [
        {
          date: "2025-05-02",
          author: "Mr. Roberts",
          content: "Daniel worked diligently during both repair sessions and showed interest in the process."
        },
        {
          date: "2025-05-07",
          author: "Mrs. Hughes",
          content: "Daniel's poster is thoughtful and well-designed. He presented it to his form group today."
        },
        {
          date: "2025-05-16",
          author: "Mr. Johnson",
          content: "Final review meeting held. All parties satisfied with outcomes. Agreement successfully completed."
        }
      ]
    },
    {
      id: "agr-004",
      title: "Online Bullying Intervention",
      description: "Agreement addressing harmful online behaviour between Year 9 students",
      type: "behavioural",
      status: "at-risk",
      createdAt: "2025-05-05T13:20:00Z",
      participants: ["Ryan Cooper (Student)", "Aisha Patel (Student)", "Mr. Williams (Head of Year 9)", "Mrs. Cooper (Parent)", "Mr. Patel (Parent)"],
      facilitator: "Dr. Martinez (Educational Psychologist)",
      terms: [
        {
          id: "term-010",
          description: "Ryan will delete all harmful posts and apologize to Aisha",
          responsibleParty: "Ryan Cooper",
          dueDate: "2025-05-07",
          status: "completed",
          completedDate: "2025-05-07",
          notes: "Posts deleted and written apology provided"
        },
        {
          id: "term-011",
          description: "Both students will attend digital citizenship workshop",
          responsibleParty: "Ryan Cooper, Aisha Patel",
          dueDate: "2025-05-14",
          status: "at-risk",
          completedDate: null,
          notes: "Ryan missed the first session without explanation"
        },
        {
          id: "term-012",
          description: "Parents will monitor social media use for one month",
          responsibleParty: "Mrs. Cooper, Mr. Patel",
          dueDate: "2025-06-05",
          status: "in-progress",
          completedDate: null,
          notes: "Weekly reports being submitted as agreed"
        }
      ],
      followUpDate: "2025-05-21",
      progress: 40,
      notes: "Initial meeting was challenging but productive. Both families committed to resolution.",
      updates: [
        {
          date: "2025-05-07",
          author: "Mr. Williams",
          content: "Ryan has provided written apology and evidence of deleted posts. Aisha has acknowledged the apology."
        },
        {
          date: "2025-05-14",
          author: "Dr. Martinez",
          content: "Concerned that Ryan missed workshop. Have contacted parents to discuss."
        }
      ]
    }
  ];

  // Load agreements on component mount
  useEffect(() => {
    const loadAgreements = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        setAgreements(mockAgreements);
      } catch (error) {
        console.error('Error loading agreements:', error);
        toast.error('Failed to load agreements');
      } finally {
        setIsLoading(false);
      }
    };

    loadAgreements();
  }, []);

  // Filter agreements based on search and filters
  const filteredAgreements = agreements.filter(agreement => {
    const matchesSearch = agreement.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         agreement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || agreement.status === filterStatus;
    const matchesType = filterType === 'all' || agreement.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate dashboard statistics
  const dashboardStats = {
    total: agreements.length,
    active: agreements.filter(a => a.status === 'active').length,
    completed: agreements.filter(a => a.status === 'completed').length,
    atRisk: agreements.filter(a => a.status === 'at-risk').length,
    upcomingFollowUps: agreements.filter(a => {
      const followUpDate = parseISO(a.followUpDate);
      const today = new Date();
      const nextWeek = addDays(today, 7);
      return a.status !== 'completed' && isAfter(followUpDate, today) && isBefore(followUpDate, nextWeek);
    }).length
  };

  // Handle agreement selection
  const handleSelectAgreement = (agreement) => {
    setSelectedAgreement(agreement);
    setActiveTab("view");
  };

  // Add participant to new agreement
  const handleAddParticipant = () => {
    if (newParticipant.trim()) {
      setNewAgreement(prev => ({
        ...prev,
        participants: [...prev.participants, newParticipant.trim()]
      }));
      setNewParticipant("");
    }
  };

  // Remove participant from new agreement
  const handleRemoveParticipant = (index) => {
    setNewAgreement(prev => {
      const updatedParticipants = [...prev.participants];
      updatedParticipants.splice(index, 1);
      return {
        ...prev,
        participants: updatedParticipants
      };
    });
  };

  // Add term to new agreement
  const handleAddTerm = () => {
    if (newTerm.description.trim() && newTerm.responsibleParty.trim()) {
      setNewAgreement(prev => ({
        ...prev,
        terms: [...prev.terms, {
          ...newTerm,
          id: `term-${Date.now()}`,
          status: "pending",
          completedDate: null,
          notes: ""
        }]
      }));
      setNewTerm({
        description: "",
        responsibleParty: "",
        dueDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
        status: "pending"
      });
    } else {
      toast.error('Please provide both a description and responsible party');
    }
  };

  // Remove term from new agreement
  const handleRemoveTerm = (index) => {
    setNewAgreement(prev => {
      const updatedTerms = [...prev.terms];
      updatedTerms.splice(index, 1);
      return {
        ...prev,
        terms: updatedTerms
      };
    });
  };

  // Handle new agreement field changes
  const handleAgreementChange = (field, value) => {
    setNewAgreement(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle new term field changes
  const handleTermChange = (field, value) => {
    setNewTerm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save new agreement
  const handleSaveAgreement = () => {
    if (!newAgreement.title) {
      toast.error('Please provide a title for the agreement');
      return;
    }

    if (!newAgreement.type) {
      toast.error('Please select an agreement type');
      return;
    }

    if (newAgreement.participants.length === 0) {
      toast.error('Please add at least one participant');
      return;
    }

    if (newAgreement.terms.length === 0) {
      toast.error('Please add at least one agreement term');
      return;
    }

    const agreement = {
      ...newAgreement,
      id: `agr-${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString(),
      progress: 0,
      updates: []
    };

    setAgreements(prev => [agreement, ...prev]);
    toast.success('Agreement created successfully');
    
    // Reset form
    setNewAgreement({
      title: "",
      description: "",
      type: "",
      participants: [],
      facilitator: "",
      terms: [],
      followUpDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      notes: ""
    });
    
    setActiveTab("dashboard");
  };

  // Update term status
  const handleUpdateTermStatus = (agreementId, termId, newStatus, notes = "") => {
    setAgreements(prev => {
      return prev.map(agreement => {
        if (agreement.id === agreementId) {
          // Update the specific term
          const updatedTerms = agreement.terms.map(term => {
            if (term.id === termId) {
              return {
                ...term,
                status: newStatus,
                completedDate: newStatus === 'completed' ? format(new Date(), 'yyyy-MM-dd') : term.completedDate,
                notes: notes || term.notes
              };
            }
            return term;
          });
          
          // Calculate new progress
          const completedTerms = updatedTerms.filter(t => t.status === 'completed').length;
          const progress = Math.round((completedTerms / updatedTerms.length) * 100);
          
          // Add update to history
          const updates = [
            {
              date: format(new Date(), 'yyyy-MM-dd'),
              author: session?.user?.name || 'System',
              content: `Term "${updatedTerms.find(t => t.id === termId).description}" status updated to ${newStatus}.${notes ? ` Notes: ${notes}` : ''}`
            },
            ...agreement.updates
          ];
          
          // Determine if agreement status should change
          let status = agreement.status;
          if (progress === 100) {
            status = 'completed';
          } else if (updatedTerms.some(t => t.status === 'at-risk')) {
            status = 'at-risk';
          }
          
          return {
            ...agreement,
            terms: updatedTerms,
            progress,
            status,
            updates
          };
        }
        return agreement;
      });
    });
    
    toast.success('Term status updated successfully');
    setProgressUpdate({
      termId: "",
      status: "",
      notes: ""
    });
  };

  // Export agreement as PDF
  const handleExportAgreement = (agreement) => {
    // In a real implementation, this would generate and download a PDF
    toast.success('Agreement exported as PDF');
  };

  // Get status badge colour
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'at-risk': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-grey-100 text-grey-800 border-grey-200';
    }
  };

  // Get status display text
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'at-risk': return 'At Risk';
      case 'pending': return 'Pending';
      case 'in-progress': return 'In Progress';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Get type display text
  const getTypeDisplay = (type) => {
    switch (type) {
      case 'behavioural': return 'Behavioural';
      case 'interpersonal': return 'Interpersonal';
      case 'reparative': return 'Reparative';
      case 'academic': return 'Academic';
      case 'attendance': return 'Attendance';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Agreement Tracking System</h1>
          <p className="text-muted-foreground">
            Document, monitor, and follow up on agreements made during restorative processes.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="agreements">Agreements</TabsTrigger>
            <TabsTrigger value="view" disabled={!selectedAgreement}>View Agreement</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Agreements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-centre">
                    <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-2xl font-bold">{dashboardStats.total}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Agreements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-centre">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-2xl font-bold">{dashboardStats.active}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">At Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-centre">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-2xl font-bold">{dashboardStats.atRisk}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Follow-ups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-centre">
                    <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-2xl font-bold">{dashboardStats.upcomingFollowUps}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Agreements</CardTitle>
                  <CardDescription>
                    Your most recently created agreements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {agreements.slice(0, 3).map((agreement) => (
                      <div key={agreement.id} className="flex items-start p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-centre">
                            <h3 className="font-medium">{agreement.title}</h3>
                            <Badge className={`ml-2 ${getStatusColor(agreement.status)}`}>
                              {getStatusDisplay(agreement.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{agreement.description}</p>
                          <div className="flex items-centre mt-2">
                            <Users className="h-4 w-4 text-muted-foreground mr-1" />
                            <span className="text-xs text-muted-foreground">{agreement.participants.length} participants</span>
                            <span className="mx-2 text-muted-foreground">•</span>
                            <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                            <span className="text-xs text-muted-foreground">Follow-up: {formatDate(agreement.followUpDate)}</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSelectAgreement(agreement)}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                    {agreements.length === 0 && (
                      <div className="text-centre p-4">
                        <p className="text-muted-foreground">No agreements found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab("agreements")}
                  >
                    View All Agreements
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Follow-ups</CardTitle>
                  <CardDescription>
                    Agreements requiring follow-up soon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {agreements
                      .filter(a => {
                        const followUpDate = parseISO(a.followUpDate);
                        const today = new Date();
                        const nextWeek = addDays(today, 7);
                        return a.status !== 'completed' && isAfter(followUpDate, today) && isBefore(followUpDate, nextWeek);
                      })
                      .slice(0, 5)
                      .map((agreement) => (
                        <div key={agreement.id} className="flex items-centre p-3 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{agreement.title}</h3>
                            <div className="flex items-centre mt-1">
                              <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                              <span className="text-xs text-muted-foreground">{formatDate(agreement.followUpDate)}</span>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleSelectAgreement(agreement)}
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    {agreements.filter(a => {
                      const followUpDate = parseISO(a.followUpDate);
                      const today = new Date();
                      const nextWeek = addDays(today, 7);
                      return a.status !== 'completed' && isAfter(followUpDate, today) && isBefore(followUpDate, nextWeek);
                    }).length === 0 && (
                      <div className="text-centre p-4">
                        <p className="text-muted-foreground">No upcoming follow-ups</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Agreement Progress</CardTitle>
                <CardDescription>
                  Status of active agreements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agreements
                    .filter(a => a.status === 'active')
                    .slice(0, 5)
                    .map((agreement) => (
                      <div key={agreement.id} className="space-y-2">
                        <div className="flex items-centre justify-between">
                          <span className="font-medium">{agreement.title}</span>
                          <span className="text-sm">{agreement.progress}%</span>
                        </div>
                        <Progress value={agreement.progress} className="h-2" />
                      </div>
                    ))}
                  {agreements.filter(a => a.status === 'active').length === 0 && (
                    <div className="text-centre p-4">
                      <p className="text-muted-foreground">No active agreements</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agreements Tab */}
          <TabsContent value="agreements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Agreements</CardTitle>
                <CardDescription>
                  View and manage all restorative agreements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="search">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Search agreements..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-1/4">
                      <Label htmlFor="status-filter">Status</Label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger id="status-filter">
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All statuses</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="at-risk">At Risk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full md:w-1/4">
                      <Label htmlFor="type-filter">Type</Label>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger id="type-filter">
                          <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All types</SelectItem>
                          <SelectItem value="behavioural">Behavioural</SelectItem>
                          <SelectItem value="interpersonal">Interpersonal</SelectItem>
                          <SelectItem value="reparative">Reparative</SelectItem>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="attendance">Attendance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Follow-up</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAgreements.map((agreement) => (
                          <TableRow key={agreement.id}>
                            <TableCell className="font-medium">{agreement.title}</TableCell>
                            <TableCell>{getTypeDisplay(agreement.type)}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(agreement.status)}>
                                {getStatusDisplay(agreement.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-centre space-x-2">
                                <Progress value={agreement.progress} className="h-2 w-20" />
                                <span className="text-xs">{agreement.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(agreement.followUpDate)}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleSelectAgreement(agreement)}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredAgreements.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-centre py-4">
                              No agreements found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredAgreements.length} of {agreements.length} agreements
                </div>
                <Button onClick={() => setActiveTab("create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Agreement
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* View Agreement Tab */}
          <TabsContent value="view" className="space-y-6">
            {selectedAgreement && (
              <>
                <div className="flex justify-between items-centre">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedAgreement.title}</h2>
                    <div className="flex items-centre mt-1">
                      <Badge className={getStatusColor(selectedAgreement.status)}>
                        {getStatusDisplay(selectedAgreement.status)}
                      </Badge>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{getTypeDisplay(selectedAgreement.type)}</span>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">Created: {formatDate(selectedAgreement.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setActiveTab("agreements")}>
                      Back to Agreements
                    </Button>
                    <Button variant="outline" onClick={() => handleExportAgreement(selectedAgreement)}>
                      <Download className="h-4 w-4 mr-2" />
                      Export as PDF
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Agreement Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                            <p className="mt-1">{selectedAgreement.description}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Participants</h3>
                            <ul className="mt-1 space-y-1">
                              {selectedAgreement.participants.map((participant, index) => (
                                <li key={index} className="flex items-centre">
                                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span>{participant}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Facilitator</h3>
                            <p className="mt-1">{selectedAgreement.facilitator}</p>
                          </div>
                          
                          {selectedAgreement.notes && (
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                              <p className="mt-1">{selectedAgreement.notes}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Agreement Terms</CardTitle>
                        <CardDescription>
                          Progress: {selectedAgreement.progress}%
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Progress value={selectedAgreement.progress} className="h-2 mb-6" />
                        
                        <div className="space-y-4">
                          {selectedAgreement.terms.map((term) => (
                            <div key={term.id} className="border rounded-lg p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-centre">
                                    <h3 className="font-medium">{term.description}</h3>
                                    <Badge className={`ml-2 ${getStatusColor(term.status)}`}>
                                      {getStatusDisplay(term.status)}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    Responsible: {term.responsibleParty}
                                  </div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    Due: {formatDate(term.dueDate)}
                                    {term.completedDate && (
                                      <>
                                        <span className="mx-1">•</span>
                                        Completed: {formatDate(term.completedDate)}
                                      </>
                                    )}
                                  </div>
                                  {term.notes && (
                                    <div className="text-sm mt-2 p-2 bg-grey-50 rounded">
                                      <span className="font-medium">Notes:</span> {term.notes}
                                    </div>
                                  )}
                                </div>
                                
                                {selectedAgreement.status !== 'completed' && (
                                  <div className="flex space-x-1">
                                    <Select 
                                      value={progressUpdate.termId === term.id ? progressUpdate.status : ''}
                                      onValueChange={(value) => {
                                        setProgressUpdate({
                                          termId: term.id,
                                          status: value,
                                          notes: ''
                                        });
                                      }}
                                    >
                                      <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Update status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="at-risk">At Risk</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    
                                    {progressUpdate.termId === term.id && progressUpdate.status && (
                                      <Button 
                                        size="sm"
                                        onClick={() => handleUpdateTermStatus(
                                          selectedAgreement.id, 
                                          term.id, 
                                          progressUpdate.status,
                                          progressUpdate.notes
                                        )}
                                      >
                                        Update
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              {progressUpdate.termId === term.id && progressUpdate.status && (
                                <div className="mt-3">
                                  <Label htmlFor="update-notes">Update Notes</Label>
                                  <Textarea
                                    id="update-notes"
                                    placeholder="Add notes about this status update..."
                                    value={progressUpdate.notes}
                                    onChange={(e) => setProgressUpdate(prev => ({
                                      ...prev,
                                      notes: e.target.value
                                    }))}
                                    className="mt-1"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Follow-up</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-centre justify-between">
                            <div>
                              <h3 className="text-sm font-medium">Next Follow-up</h3>
                              <p className="text-lg font-bold mt-1">{formatDate(selectedAgreement.followUpDate)}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Calendar className="h-4 w-4 mr-2" />
                              Reschedule
                            </Button>
                          </div>
                          
                          <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200 flex items-start">
                            <Bell className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-yellow-800">Reminder</p>
                              <p className="text-sm text-yellow-700">
                                Follow-up meeting to review progress and address any challenges.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Update History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedAgreement.updates.map((update, index) => (
                            <div key={index} className="border-l-2 border-grey-200 pl-4 pb-4">
                              <div className="flex justify-between items-start">
                                <p className="font-medium">{update.author}</p>
                                <span className="text-xs text-muted-foreground">{formatDate(update.date)}</span>
                              </div>
                              <p className="text-sm mt-1">{update.content}</p>
                            </div>
                          ))}
                          
                          {selectedAgreement.updates.length === 0 && (
                            <p className="text-muted-foreground text-centre py-4">No updates yet</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Related Resources</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/restorative-justice/reflection-prompts')}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Reflection Prompts
                          </Button>
                          <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/restorative-justice/circle-process')}>
                            <Users className="h-4 w-4 mr-2" />
                            Circle Process Templates
                          </Button>
                          <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/restorative-justice')}>
                            <FileText className="h-4 w-4 mr-2" />
                            Restorative Conversation Frameworks
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Create New Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Agreement</CardTitle>
                <CardDescription>
                  Document a new restorative agreement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="title">Agreement Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter a title for this agreement"
                        value={newAgreement.title}
                        onChange={(e) => handleAgreementChange('title', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Briefly describe the context and purpose of this agreement"
                        value={newAgreement.description}
                        onChange={(e) => handleAgreementChange('description', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Agreement Type</Label>
                      <Select 
                        value={newAgreement.type} 
                        onValueChange={(value) => handleAgreementChange('type', value)}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select agreement type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="behavioural">Behavioural</SelectItem>
                          <SelectItem value="interpersonal">Interpersonal</SelectItem>
                          <SelectItem value="reparative">Reparative</SelectItem>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="attendance">Attendance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="follow-up-date">Follow-up Date</Label>
                      <Input
                        id="follow-up-date"
                        type="date"
                        value={newAgreement.followUpDate}
                        onChange={(e) => handleAgreementChange('followUpDate', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="facilitator">Facilitator</Label>
                      <Input
                        id="facilitator"
                        placeholder="Name and role of the facilitator"
                        value={newAgreement.facilitator}
                        onChange={(e) => handleAgreementChange('facilitator', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-centre justify-between">
                      <Label>Participants</Label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add participant (name and role)"
                          value={newParticipant}
                          onChange={(e) => setNewParticipant(e.target.value)}
                          className="w-64"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleAddParticipant}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      {newAgreement.participants.length > 0 ? (
                        <ul className="space-y-2">
                          {newAgreement.participants.map((participant, index) => (
                            <li key={index} className="flex items-centre justify-between p-2 bg-grey-50 rounded">
                              <div className="flex items-centre">
                                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{participant}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoveParticipant(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-centre text-muted-foreground py-4">
                          No participants added yet
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-centre justify-between">
                      <Label>Agreement Terms</Label>
                    </div>

                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="term-description">Term Description</Label>
                          <Textarea
                            id="term-description"
                            placeholder="Describe what needs to be done"
                            value={newTerm.description}
                            onChange={(e) => handleTermChange('description', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="responsible-party">Responsible Party</Label>
                          <Input
                            id="responsible-party"
                            placeholder="Who is responsible for this term"
                            value={newTerm.responsibleParty}
                            onChange={(e) => handleTermChange('responsibleParty', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="due-date">Due Date</Label>
                          <Input
                            id="due-date"
                            type="date"
                            value={newTerm.dueDate}
                            onChange={(e) => handleTermChange('dueDate', e.target.value)}
                          />
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={handleAddTerm}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Term
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4">
                      {newAgreement.terms.length > 0 ? (
                        <div className="space-y-3">
                          {newAgreement.terms.map((term, index) => (
                            <div key={index} className="flex items-start justify-between p-3 bg-grey-50 rounded">
                              <div className="flex-1">
                                <p className="font-medium">{term.description}</p>
                                <div className="text-sm text-muted-foreground mt-1">
                                  Responsible: {term.responsibleParty}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  Due: {formatDate(term.dueDate)}
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoveTerm(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-centre text-muted-foreground py-4">
                          No terms added yet
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional notes or context about this agreement"
                      value={newAgreement.notes}
                      onChange={(e) => handleAgreementChange('notes', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setActiveTab("dashboard")}>
                  Cancel
                </Button>
                <Button onClick={handleSaveAgreement}>
                  Save Agreement
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgreementTrackingSystem;
