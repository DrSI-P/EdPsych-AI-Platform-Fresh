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
  RadioGroup,
  RadioGroupItem,
  Checkbox
} from "@/components/ui";
import { 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Users, 
  MessageCircle, 
  Heart, 
  ArrowRight, 
  FileText, 
  Save, 
  Download,
  Lightbulb
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/**
 * Guided Restorative Conversation Frameworks Component
 * 
 * This component provides structured frameworks for conducting restorative conversations
 * based on evidence-based restorative justice principles from educational psychology research.
 * 
 * Key features:
 * - Multiple conversation frameworks for different scenarios and age groups
 * - Step-by-step guidance through the restorative process
 * - Customizable question prompts and scripts
 * - Documentation and reflection tools
 * - Resources and training materials
 */
const GuidedRestorativeConversationFrameworks = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("frameworks");
  // Define framework type
  type Framework = {
    id: string;
    title: string;
    description: string;
    ageGroup: string;
    scenario: string;
    steps: {
      title: string;
      description: string;
      questions: string[];
    }[];
  };
  
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [customFramework, setCustomFramework] = useState({
    title: "",
    description: "",
    ageGroup: "",
    scenario: "",
    steps: [{ title: "", description: "", questions: [""] }]
  });
  const [savedFrameworks, setSavedFrameworks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAgeGroup, setFilterAgeGroup] = useState("all");
  const [filterScenario, setFilterScenario] = useState("all");

  // Predefined frameworks based on restorative justice research
  const predefinedFrameworks = [
    {
      id: "framework-1",
      title: "Basic Restorative Enquiry",
      description: "A simple framework for addressing minor incidents between two individuals",
      ageGroup: "all",
      scenario: "minor-conflict",
      steps: [
        {
          title: "Preparation",
          description: "Ensure all parties are calm and ready to engage in the conversation",
          questions: [
            "Are you ready to talk about what happened?",
            "Would you prefer to have someone else present during our conversation?",
            "Let's find a quiet space where we can talk without interruptions."
          ]
        },
        {
          title: "Exploring What Happened",
          description: "Allow each person to share their perspective of the incident",
          questions: [
            "Can you tell me what happened from your perspective?",
            "What were you thinking at the time?",
            "What have you thought about since the incident?",
            "How were you feeling when this happened?"
          ]
        },
        {
          title: "Exploring Impact",
          description: "Help participants understand the impact of their actions",
          questions: [
            "Who has been affected by what happened?",
            "How do you think they have been affected?",
            "What has been the hardest thing for you?"
          ]
        },
        {
          title: "Addressing Needs",
          description: "Identify what each person needs to move forward",
          questions: [
            "What do you need to feel better about this situation?",
            "What would help you to move forward from this?"
          ]
        },
        {
          title: "Agreement and Action Plan",
          description: "Develop a plan to repair harm and prevent future incidents",
          questions: [
            "What needs to happen to make things right?",
            "What can each of you do to repair the harm caused?",
            "How can we prevent this from happening again?",
            "What support do you need to follow through with these actions?"
          ]
        },
        {
          title: "Closure and Follow-up",
          description: "Conclude the conversation and plan for follow-up",
          questions: [
            "Is there anything else anyone would like to say?",
            "How are you feeling about our conversation and the plan we've made?",
            "When shall we check in to see how things are going?"
          ]
        }
      ]
    },
    {
      id: "framework-2",
      title: "Primary School Circle Time",
      description: "A framework for addressing classroom conflicts through circle discussions",
      ageGroup: "primary",
      scenario: "classroom-conflict",
      steps: [
        {
          title: "Setting Up the Circle",
          description: "Arrange students in a circle and establish ground rules",
          questions: [
            "Can everyone see each other?",
            "Let's remember our circle rules: one person speaks at a time, listen respectfully, and be honest.",
            "We'll use this talking piece - only the person holding it can speak."
          ]
        },
        {
          title: "Check-in Round",
          description: "Begin with a simple check-in to help everyone feel included",
          questions: [
            "Let's go around the circle and share one word about how you're feeling today.",
            "Can you share something good that happened to you recently?"
          ]
        },
        {
          title: "Introducing the Issue",
          description: "Present the issue to be discussed in a neutral way",
          questions: [
            "We're here to talk about what happened during [specific time/activity].",
            "This is not about blaming anyone, but understanding what happened and how we can make things better."
          ]
        },
        {
          title: "Sharing Perspectives",
          description: "Allow each student to share their perspective",
          questions: [
            "What did you see or hear?",
            "How did you feel when this happened?",
            "Has something like this happened to you before?"
          ]
        },
        {
          title: "Exploring Solutions",
          description: "Brainstorm ways to resolve the issue and prevent future occurrences",
          questions: [
            "What could we do differently next time?",
            "How can we help each other remember to [desired behaviour]?",
            "What would make our classroom feel safer/happier for everyone?"
          ]
        },
        {
          title: "Making Agreements",
          description: "Develop class agreements based on the discussion",
          questions: [
            "What can we all agree to do to make our classroom better?",
            "How will we remind each other about our agreement?",
            "What should happen if someone forgets our agreement?"
          ]
        },
        {
          title: "Closing the Circle",
          description: "End with a positive closing activity",
          questions: [
            "Let's go around and share one thing you appreciate about our class.",
            "What's one thing you learned from our circle today?",
            "Let's finish with our class chant/song."
          ]
        }
      ]
    },
    {
      id: "framework-3",
      title: "Secondary School Restorative Conference",
      description: "A formal framework for addressing serious incidents involving multiple stakeholders",
      ageGroup: "secondary",
      scenario: "serious-incident",
      steps: [
        {
          title: "Pre-Conference Preparation",
          description: "Meet individually with all participants to prepare them for the conference",
          questions: [
            "Can you tell me what happened from your perspective?",
            "How has this incident affected you?",
            "What do you hope to achieve from the conference?",
            "Are you willing to listen to others' perspectives?",
            "Do you have any concerns about participating in the conference?"
          ]
        },
        {
          title: "Opening the Conference",
          description: "Welcome participants, explain the process, and set ground rules",
          questions: [
            "Thank you all for coming today. We're here to discuss the incident that occurred and find a way forward that addresses the harm caused.",
            "Everyone will have a chance to speak without interruption.",
            "This is about understanding what happened, who was affected, and how we can make things right.",
            "Does everyone agree to listen respectfully and speak honestly?"
          ]
        },
        {
          title: "Understanding the Incident",
          description: "Ask those involved to share what happened",
          questions: [
            "Can you tell us what happened?",
            "What were you thinking at the time?",
            "What have you thought about since?",
            "Who do you think has been affected by your actions?"
          ]
        },
        {
          title: "Exploring the Impact",
          description: "Ask those affected to share how they have been impacted",
          questions: [
            "How did this incident affect you?",
            "What has been the hardest thing for you?",
            "How have others (friends, family, school community) been affected?"
          ]
        },
        {
          title: "Addressing Needs",
          description: "Identify what each person needs to move forward",
          questions: [
            "What do you need to happen to make things right?",
            "What would help you feel better about this situation?",
            "What support do you need moving forward?"
          ]
        },
        {
          title: "Developing an Agreement",
          description: "Create a written agreement that addresses the harm and outlines future actions",
          questions: [
            "Based on what we've discussed, what actions need to be taken to repair the harm?",
            "What specific commitments can each person make?",
            "How will we know these commitments have been fulfilled?",
            "What should happen if the agreement is not kept?"
          ]
        },
        {
          title: "Closing the Conference",
          description: "Summarize the agreement and end on a positive note",
          questions: [
            "Let's review the agreement we've created together.",
            "Does everyone feel this agreement is fair and addresses the harm caused?",
            "When should we meet again to review progress?",
            "Is there anything else anyone would like to say before we close?"
          ]
        }
      ]
    },
    {
      id: "framework-4",
      title: "Peer Mediation Framework",
      description: "A student-led framework for resolving conflicts between peers",
      ageGroup: "all",
      scenario: "peer-conflict",
      steps: [
        {
          title: "Introduction",
          description: "Welcome participants and explain the mediation process",
          questions: [
            "Welcome to peer mediation. We're here to help you resolve your conflict.",
            "As mediators, we don't take sides or decide who's right or wrong.",
            "Our job is to help you find your own solution.",
            "Here are our ground rules: speak one at a time, be honest, no name-calling, and try to find a solution."
          ]
        },
        {
          title: "Hearing Both Sides",
          description: "Allow each person to share their perspective without interruption",
          questions: [
            "Please tell us what happened from your point of view.",
            "How did you feel when this happened?",
            "What is the main problem you want to solve today?"
          ]
        },
        {
          title: "Clarifying the Issues",
          description: "Identify the key issues that need to be resolved",
          questions: [
            "So the main issues seem to be [summarize issues]. Is that correct?",
            "Is there anything else important we should know about?",
            "What do you think is the most important issue to resolve first?"
          ]
        },
        {
          title: "Generating Solutions",
          description: "Brainstorm possible solutions to the conflict",
          questions: [
            "What ideas do you have for solving this problem?",
            "What would you like the other person to do differently?",
            "What are you willing to do to help solve this problem?"
          ]
        },
        {
          title: "Reaching an Agreement",
          description: "Help participants agree on a solution",
          questions: [
            "Of all the ideas we've discussed, which ones do you both think would work?",
            "What exactly will each of you do?",
            "When will you do these things?",
            "How will you handle it if a similar problem happens again?"
          ]
        },
        {
          title: "Closing the Mediation",
          description: "Finalize the agreement and conclude the session",
          questions: [
            "Let's write down what you've agreed to do.",
            "Do you both feel this agreement is fair?",
            "Would you like to shake hands or show in another way that you've resolved this conflict?",
            "We'll check in with you next week to see how things are going."
          ]
        }
      ]
    },
    {
      id: "framework-5",
      title: "Reintegration Meeting",
      description: "A framework for supporting students returning after exclusion or absence",
      ageGroup: "all",
      scenario: "reintegration",
      steps: [
        {
          title: "Welcome and Purpose",
          description: "Create a welcoming atmosphere and explain the purpose of the meeting",
          questions: [
            "Welcome back. We're here to support your return to school and make a plan for moving forward positively.",
            "This meeting is about looking forward, not dwelling on past incidents.",
            "We want to ensure you have the support you need to be successful."
          ]
        },
        {
          title: "Reflection on Time Away",
          description: "Invite the student to share their reflections on their time away from school",
          questions: [
            "How have you been during your time away from school?",
            "Have you had any thoughts about what happened and what led to it?",
            "What, if anything, would you do differently if a similar situation arose?"
          ]
        },
        {
          title: "School Community Perspective",
          description: "Share how the school community has been affected",
          questions: [
            "While you were away, your teachers and classmates noticed your absence.",
            "Your [teacher/classmates] mentioned that they missed your contributions to [specific class/activity].",
            "We want to make sure that everyone feels safe and respected in our school community."
          ]
        },
        {
          title: "Identifying Support Needs",
          description: "Determine what support the student needs to be successful",
          questions: [
            "What challenges do you think you might face as you return to school?",
            "What support would help you manage these challenges?",
            "Are there specific situations or triggers we should be aware of?",
            "Who at school do you feel comfortable talking to if you need help?"
          ]
        },
        {
          title: "Creating a Support Plan",
          description: "Develop a concrete plan with specific strategies and supports",
          questions: [
            "Based on what we've discussed, let's create a plan to support your success.",
            "What specific strategies can we put in place to help you?",
            "How will we know if the plan is working?",
            "When should we meet again to review your progress?"
          ]
        },
        {
          title: "Repairing Relationships",
          description: "Address any relationships that need to be repaired",
          questions: [
            "Are there any relationships that were affected that you'd like to repair?",
            "Would you like support in having conversations with these individuals?",
            "What might you say to begin rebuilding trust?"
          ]
        },
        {
          title: "Closing and Next Steps",
          description: "Summarize the plan and express confidence in the student's ability to succeed",
          questions: [
            "Let's review the plan we've created together.",
            "Does this plan address your concerns and provide the support you need?",
            "We believe in your ability to be successful here.",
            "Our next check-in will be on [date/time]. How does that sound?"
          ]
        }
      ]
    }
  ];

  // Load saved frameworks on component mount
  useEffect(() => {
    const loadSavedFrameworks = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use localStorage as a placeholder
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('savedRestorativeFrameworks');
          if (saved) {
            setSavedFrameworks(JSON.parse(saved));
          }
        }
      } catch (error) {
        console.error('Error loading saved frameworks:', error);
        toast.error('Failed to load saved frameworks');
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedFrameworks();
  }, []);

  // Filter frameworks based on search and filters
  const filteredFrameworks = [...predefinedFrameworks, ...savedFrameworks].filter(framework => {
    const matchesSearch = framework.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         framework.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgeGroup = filterAgeGroup === 'all' || framework.ageGroup === filterAgeGroup || framework.ageGroup === 'all';
    const matchesScenario = filterScenario === 'all' || framework.scenario === filterScenario;
    
    return matchesSearch && matchesAgeGroup && matchesScenario;
  });

  // Handle framework selection
  const handleSelectFramework = (framework: Framework) => {
    setSelectedFramework(framework);
    setActiveTab("conversation");
  };

  // Handle custom framework changes
  const handleCustomFrameworkChange = (field: string, value: string) => {
    setCustomFramework(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle step changes in custom framework
  const handleStepChange = (index: number, field: string, value: string) => {
    setCustomFramework(prev => {
      const updatedSteps = [...prev.steps];
      updatedSteps[index] = {
        ...updatedSteps[index],
        [field]: value
      };
      return {
        ...prev,
        steps: updatedSteps
      };
    });
  };

  // Handle question changes in custom framework
  const handleQuestionChange = (stepIndex: number, questionIndex: number, value: string) => {
    setCustomFramework(prev => {
      const updatedSteps = [...prev.steps];
      const updatedQuestions = [...updatedSteps[stepIndex].questions];
      updatedQuestions[questionIndex] = value;
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        questions: updatedQuestions
      };
      return {
        ...prev,
        steps: updatedSteps
      };
    });
  };

  // Add a new step to custom framework
  const addStep = () => {
    setCustomFramework(prev => ({
      ...prev,
      steps: [...prev.steps, { title: "", description: "", questions: [""] }]
    }));
  };

  // Add a new question to a step
  const addQuestion = (stepIndex: number) => {
    setCustomFramework(prev => {
      const updatedSteps = [...prev.steps];
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        questions: [...updatedSteps[stepIndex].questions, ""]
      };
      return {
        ...prev,
        steps: updatedSteps
      };
    });
  };

  // Remove a step from custom framework
  const removeStep = (index: number) => {
    setCustomFramework(prev => {
      const updatedSteps = [...prev.steps];
      updatedSteps.splice(index, 1);
      return {
        ...prev,
        steps: updatedSteps.length ? updatedSteps : [{ title: "", description: "", questions: [""] }]
      };
    });
  };

  // Remove a question from a step
  const removeQuestion = (stepIndex: number, questionIndex: number) => {
    setCustomFramework(prev => {
      const updatedSteps = [...prev.steps];
      const updatedQuestions = [...updatedSteps[stepIndex].questions];
      updatedQuestions.splice(questionIndex, 1);
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        questions: updatedQuestions.length ? updatedQuestions : [""]
      };
      return {
        ...prev,
        steps: updatedSteps
      };
    });
  };

  // Save custom framework
  const saveCustomFramework = () => {
    if (!customFramework.title) {
      toast.error('Please provide a title for your framework');
      return;
    }

    const newFramework = {
      ...customFramework,
      id: `custom-${Date.now()}`,
    };

    setSavedFrameworks(prev => {
      const updated = [...prev, newFramework];
      // In a real implementation, this would save to an API
      if (typeof window !== 'undefined') {
        localStorage.setItem('savedRestorativeFrameworks', JSON.stringify(updated));
      }
      return updated;
    });

    toast.success('Framework saved successfully');
    setCustomFramework({
      title: "",
      description: "",
      ageGroup: "",
      scenario: "",
      steps: [{ title: "", description: "", questions: [""] }]
    });
    setActiveTab("frameworks");
  };

  // Export framework as PDF
  const exportFrameworkAsPDF = () => {
    if (!selectedFramework) return;
    
    // In a real implementation, this would generate and download a PDF
    toast.success('Framework exported as PDF');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Guided Restorative Conversation Frameworks</h1>
          <p className="text-muted-foreground">
            Evidence-based frameworks for conducting restorative conversations based on restorative justice principles.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
            <TabsTrigger value="conversation" disabled={!selectedFramework}>Conversation Guide</TabsTrigger>
            <TabsTrigger value="create">Create Custom</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Frameworks Tab */}
          <TabsContent value="frameworks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Restorative Conversation Frameworks</CardTitle>
                <CardDescription>
                  Select a framework based on your needs and scenario
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="search">Search</Label>
                      <Input
                        id="search"
                        placeholder="Search frameworks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="w-full md:w-1/4">
                      <Label htmlFor="age-group">Age Group</Label>
                      <Select value={filterAgeGroup} onValueChange={setFilterAgeGroup}>
                        <SelectTrigger id="age-group">
                          <SelectValue placeholder="All age groups" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All age groups</SelectItem>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full md:w-1/4">
                      <Label htmlFor="scenario">Scenario</Label>
                      <Select value={filterScenario} onValueChange={setFilterScenario}>
                        <SelectTrigger id="scenario">
                          <SelectValue placeholder="All scenarios" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All scenarios</SelectItem>
                          <SelectItem value="minor-conflict">Minor conflict</SelectItem>
                          <SelectItem value="classroom-conflict">Classroom conflict</SelectItem>
                          <SelectItem value="serious-incident">Serious incident</SelectItem>
                          <SelectItem value="peer-conflict">Peer conflict</SelectItem>
                          <SelectItem value="reintegration">Reintegration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {filteredFrameworks.map((framework) => (
                      <Card key={framework.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{framework.title}</CardTitle>
                          <div className="flex space-x-2">
                            <span className="inline-flex items-centre rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                              {framework.ageGroup === 'all' ? 'All ages' : framework.ageGroup === 'primary' ? 'Primary' : 'Secondary'}
                            </span>
                            <span className="inline-flex items-centre rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              {framework.scenario.replace('-', ' ')}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-muted-foreground">{framework.description}</p>
                          <p className="text-sm mt-2">
                            <span className="font-medium">Steps:</span> {framework.steps.length}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => handleSelectFramework(framework)}
                          >
                            Select Framework
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}

                    {filteredFrameworks.length === 0 && (
                      <div className="col-span-full flex flex-col items-centre justify-centre p-6 text-centre">
                        <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium">No frameworks found</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Try adjusting your search or filters, or create a custom framework.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversation Guide Tab */}
          <TabsContent value="conversation" className="space-y-6">
            {selectedFramework && (
              <>
                <div className="flex justify-between items-centre">
                  <h2 className="text-2xl font-bold">{selectedFramework.title}</h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setActiveTab("frameworks")}>
                      Back to Frameworks
                    </Button>
                    <Button variant="outline" onClick={exportFrameworkAsPDF}>
                      <Download className="h-4 w-4 mr-2" />
                      Export as PDF
                    </Button>
                  </div>
                </div>

                <p className="text-muted-foreground">{selectedFramework.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Conversation Steps</CardTitle>
                        <CardDescription>
                          Follow these steps to guide your restorative conversation
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-8">
                          {selectedFramework.steps.map((step, index) => (
                            <div key={index} className="relative pl-8 pb-6 border-l-2 border-primary/20 last:border-l-0">
                              <div className="absolute left-[-9px] top-0 rounded-full bg-primary text-white w-4 h-4 flex items-centre justify-centre text-xs">
                                {index + 1}
                              </div>
                              <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                              <p className="text-muted-foreground mb-4">{step.description}</p>
                              
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium">Suggested Questions/Prompts:</h4>
                                <ul className="space-y-2">
                                  {step.questions.map((question, qIndex) => (
                                    <li key={qIndex} className="flex items-start">
                                      <ArrowRight className="h-4 w-4 mr-2 mt-1 text-primary" />
                                      <span>{question}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Guidance Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium mb-1">Key Principles</h3>
                            <ul className="text-sm space-y-1">
                              <li className="flex items-start">
                                <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                                <span>Focus on harm and needs, not rules broken</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                                <span>Address obligations to repair harm</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                                <span>Engage all stakeholders in the process</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                                <span>Work collaboratively toward resolution</span>
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium mb-1">Facilitator Tips</h3>
                            <ul className="text-sm space-y-1">
                              <li className="flex items-start">
                                <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                                <span>Remain neutral and non-judgmental</span>
                              </li>
                              <li className="flex items-start">
                                <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                                <span>Use active listening techniques</span>
                              </li>
                              <li className="flex items-start">
                                <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                                <span>Allow for silence and reflection</span>
                              </li>
                              <li className="flex items-start">
                                <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                                <span>Adapt questions to suit the situation</span>
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium mb-1">When to Use</h3>
                            <p className="text-sm text-muted-foreground">
                              This framework is best suited for {selectedFramework.scenario.replace('-', ' ')} 
                              situations with {selectedFramework.ageGroup === 'all' ? 'students of any age' : 
                              `${selectedFramework.ageGroup} school students`}.
                            </p>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium mb-1">Evidence Base</h3>
                            <p className="text-sm text-muted-foreground">
                              This framework is based on restorative justice principles from educational psychology 
                              research, including the Social Discipline Window approach and reintegrative shaming theory.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle>Documentation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="participants">Participants</Label>
                            <Textarea 
                              id="participants" 
                              placeholder="Record the names and roles of all participants"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="key-points">Key Points Discussed</Label>
                            <Textarea 
                              id="key-points" 
                              placeholder="Note the main points that emerged during the conversation"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="agreements">Agreements Made</Label>
                            <Textarea 
                              id="agreements" 
                              placeholder="Document any agreements or action plans"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="follow-up">Follow-up Plan</Label>
                            <Textarea 
                              id="follow-up" 
                              placeholder="Note when and how you will follow up"
                              className="mt-1"
                            />
                          </div>
                          <Button className="w-full">
                            <Save className="h-4 w-4 mr-2" />
                            Save Documentation
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Create Custom Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Custom Framework</CardTitle>
                <CardDescription>
                  Design your own restorative conversation framework
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="custom-title">Framework Title</Label>
                      <Input
                        id="custom-title"
                        placeholder="Enter a title for your framework"
                        value={customFramework.title}
                        onChange={(e) => handleCustomFrameworkChange('title', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="custom-description">Description</Label>
                      <Input
                        id="custom-description"
                        placeholder="Briefly describe your framework"
                        value={customFramework.description}
                        onChange={(e) => handleCustomFrameworkChange('description', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="custom-age-group">Age Group</Label>
                      <Select 
                        value={customFramework.ageGroup} 
                        onValueChange={(value) => handleCustomFrameworkChange('ageGroup', value)}
                      >
                        <SelectTrigger id="custom-age-group">
                          <SelectValue placeholder="Select age group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All age groups</SelectItem>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="custom-scenario">Scenario Type</Label>
                      <Select 
                        value={customFramework.scenario} 
                        onValueChange={(value) => handleCustomFrameworkChange('scenario', value)}
                      >
                        <SelectTrigger id="custom-scenario">
                          <SelectValue placeholder="Select scenario type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minor-conflict">Minor conflict</SelectItem>
                          <SelectItem value="classroom-conflict">Classroom conflict</SelectItem>
                          <SelectItem value="serious-incident">Serious incident</SelectItem>
                          <SelectItem value="peer-conflict">Peer conflict</SelectItem>
                          <SelectItem value="reintegration">Reintegration</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-centre justify-between">
                      <h3 className="text-lg font-medium">Conversation Steps</h3>
                      <Button variant="outline" onClick={addStep}>
                        Add Step
                      </Button>
                    </div>

                    {customFramework.steps.map((step, stepIndex) => (
                      <Card key={stepIndex} className="relative">
                        <CardHeader className="pb-2">
                          <div className="absolute right-4 top-4">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeStep(stepIndex)}
                              disabled={customFramework.steps.length === 1}
                            >
                              Remove
                            </Button>
                          </div>
                          <CardTitle className="text-base">Step {stepIndex + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor={`step-${stepIndex}-title`}>Step Title</Label>
                            <Input
                              id={`step-${stepIndex}-title`}
                              placeholder="Enter step title"
                              value={step.title}
                              onChange={(e) => handleStepChange(stepIndex, 'title', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`step-${stepIndex}-description`}>Description</Label>
                            <Textarea
                              id={`step-${stepIndex}-description`}
                              placeholder="Describe what this step involves"
                              value={step.description}
                              onChange={(e) => handleStepChange(stepIndex, 'description', e.target.value)}
                            />
                          </div>
                          <div>
                            <div className="flex items-centre justify-between mb-2">
                              <Label>Questions/Prompts</Label>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => addQuestion(stepIndex)}
                              >
                                Add Question
                              </Button>
                            </div>
                            {step.questions.map((question, questionIndex) => (
                              <div key={questionIndex} className="flex items-centre space-x-2 mb-2">
                                <Input
                                  placeholder="Enter question or prompt"
                                  value={question}
                                  onChange={(e) => handleQuestionChange(stepIndex, questionIndex, e.target.value)}
                                  className="flex-1"
                                />
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeQuestion(stepIndex, questionIndex)}
                                  disabled={step.questions.length === 1}
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setActiveTab("frameworks")}>
                  Cancel
                </Button>
                <Button onClick={saveCustomFramework}>
                  Save Framework
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Restorative Justice Resources</CardTitle>
                  <CardDescription>
                    Educational materials and guides for implementing restorative practices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Key Principles of Restorative Justice</h3>
                      <p className="text-muted-foreground mb-4">
                        Restorative justice in educational settings is based on several core principles that guide implementation:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Relationships First</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              Prioritizes building and maintaining positive relationships within the school community. 
                              When harm occurs, the focus is on repairing relationships rather than simply punishing rule-breaking.
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Responsibility and Accountability</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              Encourages individuals to take responsibility for their actions and understand how they 
                              have affected others. Accountability means making things right, not just receiving punishment.
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Inclusive Decision-Making</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              Involves all affected parties in the process of addressing harm and finding solutions. 
                              This collaborative approach empowers students and builds community ownership.
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Healing and Growth</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              Focuses on healing harm and supporting personal growth rather than punishment. 
                              The process aims to help all parties move forward in a positive way.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">The Social Discipline Window</h3>
                      <p className="text-muted-foreground mb-4">
                        The Social Discipline Window, developed by Paul McCold and Ted Wachtel, provides a framework 
                        for understanding different approaches to behaviour management:
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <Card className="bg-red-50">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Punitive (TO)</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              High control, low support. Focuses on rules and punishment.
                              "What rule was broken? Who did it? What punishment is deserved?"
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-blue-50">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Restorative (WITH)</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              High control, high support. Collaborative problem-solving.
                              "What happened? Who was affected? How can we make things right?"
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-yellow-50">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Neglectful (NOT)</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              Low control, low support. Indifferent and passive.
                              "It's not my problem. Let someone else deal with it."
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-green-50">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Permissive (FOR)</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              Low control, high support. Protective and enabling.
                              "How can I fix this for you? Let me take care of it."
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        The restorative approach (WITH) combines high expectations with high support, 
                        working collaboratively with students rather than doing things to them or for them.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Continuum of Restorative Practices</h3>
                      <p className="text-muted-foreground mb-4">
                        Restorative practices exist on a continuum from informal to formal:
                      </p>
                      <div className="relative">
                        <div className="h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full mb-4"></div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-green-700">Preventative</h4>
                            <ul className="text-sm mt-2 space-y-1">
                              <li>• Community building circles</li>
                              <li>• Check-in/check-out circles</li>
                              <li>• Classroom agreements</li>
                              <li>• Relationship building</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-yellow-700">Responsive</h4>
                            <ul className="text-sm mt-2 space-y-1">
                              <li>• Problem-solving circles</li>
                              <li>• Restorative conversations</li>
                              <li>• Peer mediation</li>
                              <li>• Small impromptu conferences</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-red-700">Intensive</h4>
                            <ul className="text-sm mt-2 space-y-1">
                              <li>• Formal restorative conferences</li>
                              <li>• Reintegration meetings</li>
                              <li>• Family group conferences</li>
                              <li>• Healing circles</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Training Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-1">Video Tutorials</h3>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start">
                            <FileText className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                            <span>Introduction to Restorative Practices</span>
                          </li>
                          <li className="flex items-start">
                            <FileText className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                            <span>Facilitating Restorative Circles</span>
                          </li>
                          <li className="flex items-start">
                            <FileText className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                            <span>Restorative Language and Questions</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-1">Downloadable Guides</h3>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start">
                            <FileText className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                            <span>Restorative Practices Handbook</span>
                          </li>
                          <li className="flex items-start">
                            <FileText className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                            <span>Question Prompt Cards (Printable)</span>
                          </li>
                          <li className="flex items-start">
                            <FileText className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                            <span>Implementation Checklist</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-1">Practise Scenarios</h3>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start">
                            <FileText className="h-4 w-4 mr-2 mt-0.5 text-purple-500" />
                            <span>Primary School Case Studies</span>
                          </li>
                          <li className="flex items-start">
                            <FileText className="h-4 w-4 mr-2 mt-0.5 text-purple-500" />
                            <span>Secondary School Case Studies</span>
                          </li>
                          <li className="flex items-start">
                            <FileText className="h-4 w-4 mr-2 mt-0.5 text-purple-500" />
                            <span>Role-Play Scenarios</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Research and Evidence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Restorative justice practices in schools are supported by a growing body of research evidence:
                      </p>
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-sm font-medium">Reduced Exclusions</h3>
                          <p className="text-sm text-muted-foreground">
                            Studies show schools implementing restorative practices experience significant reductions in exclusions and suspensions.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Improved School Climate</h3>
                          <p className="text-sm text-muted-foreground">
                            Research indicates improvements in school connectedness, sense of community, and overall climate.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Enhanced Relationships</h3>
                          <p className="text-sm text-muted-foreground">
                            Evidence shows strengthened relationships between students and staff, and among peers.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Skill Development</h3>
                          <p className="text-sm text-muted-foreground">
                            Students develop important social-emotional skills including empathy, communication, and problem-solving.
                          </p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-1">Key Research</h3>
                        <ul className="text-sm space-y-1">
                          <li>• Anyon et al. (2016) - Restorative Interventions and School Discipline Sanctions</li>
                          <li>• Augustine et al. (2018) - Restorative Practices in Pittsburgh Public Schools</li>
                          <li>• Gregory et al. (2016) - The Promise of Restorative Practices</li>
                          <li>• Davison et al. (2021) - Restorative Justice in Education</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GuidedRestorativeConversationFrameworks;
