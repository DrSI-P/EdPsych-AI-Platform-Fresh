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
  Checkbox,
  Switch
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
  Lightbulb,
  Circle,
  Plus,
  Trash2,
  Edit,
  Copy
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/**
 * Circle Process Templates Component
 * 
 * This component provides structured templates for conducting restorative circles
 * in educational settings, based on evidence-based restorative justice principles.
 * 
 * Key features:
 * - Multiple circle templates for different purposes and age groups
 * - Customizable circle structures and question sequences
 * - Visual circle arrangement tools
 * - Printable resources and guides
 * - Integration with the restorative justice framework
 */
const CircleProcessTemplates = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customTemplate, setCustomTemplate] = useState({
    title: "",
    description: "",
    ageGroup: "",
    purpose: "",
    structure: {
      openingCeremony: "",
      checkIn: "",
      mainActivity: "",
      checkOut: "",
      closingCeremony: ""
    },
    questions: [],
    materials: [],
    timeRequired: "",
    spaceSetup: ""
  });
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAgeGroup, setFilterAgeGroup] = useState("all");
  const [filterPurpose, setFilterPurpose] = useState("all");

  // Predefined templates based on restorative justice research
  const predefinedTemplates = [
    {
      id: "template-1",
      title: "Community Building Circle",
      description: "A basic circle format for building relationships and community in the classroom",
      ageGroup: "all",
      purpose: "community-building",
      structure: {
        openingCeremony: "Welcome everyone to our circle. Today we're going to take some time to connect as a community and get to know each other better. In our circle, we use a talking piece (show the object). When you're holding the talking piece, it's your turn to speak, and everyone else listens respectfully. You can always pass if you don't want to share.",
        checkIn: "Let's start with a quick check-in. When the talking piece comes to you, please share your name and how you're feeling today in one or two words.",
        mainActivity: "For our main activity today, we\'ll be exploring the topic of [specific topic]. I\'ll ask a question, and we\'ll pass the talking piece around the circle. Remember, you can always pass if you don\'t want to share.",
        checkOut: "Before we close our circle, let's do a quick check-out. When the talking piece comes to you, please share one word about how you're feeling now.",
        closingCeremony: "Thank you everyone for participating in our circle today. I appreciate your honesty and respect for each other. Let's close our circle with a moment of silence to reflect on what we've shared."
      },
      questions: [
        {
          category: "Getting to Know Each Other",
          items: [
            "What's something you enjoy doing outside of school?",
            "If you could have any superpower, what would it be and why?",
            "What's something that made you smile recently?",
            "Who is someone you look up to and why?",
            "What's your favourite place to be and why?"
          ]
        },
        {
          category: "Building Connections",
          items: [
            "What's one thing you appreciate about our class/group?",
            "Share a time when someone in this room helped you.",
            "What's something you're good at that you could help others with?",
            "What does respect look like to you?",
            "What helps you feel welcome in a new place?"
          ]
        },
        {
          category: "Values and Aspirations",
          items: [
            "What's one value that's important to you?",
            "What's something you're looking forward to?",
            "What's one goal you have for this term/year?",
            "What helps you do your best work?",
            "What's one thing you'd like us to know about you?"
          ]
        }
      ],
      materials: [
        "Talking piece (a special object that is passed around)",
        "Circle guidelines poster",
        "Chairs arranged in a circle with no tables/desks in between",
        "Optional: centerpiece for the middle of the circle"
      ],
      timeRequired: "30-45 minutes",
      spaceSetup: "Chairs arranged in a perfect circle with no tables or desks in between. Everyone should be able to see each other clearly."
    },
    {
      id: "template-2",
      title: "Problem-Solving Circle",
      description: "A structured circle format for addressing classroom issues or challenges",
      ageGroup: "all",
      purpose: "problem-solving",
      structure: {
        openingCeremony: "Welcome everyone to our circle. Today we're going to work together to address [specific issue] that has been affecting our community. In our circle, we use a talking piece. When you're holding it, it's your turn to speak, and everyone else listens respectfully. Our goal today is not to blame anyone but to understand what's happening and find solutions together.",
        checkIn: "Let's start with a quick check-in. When the talking piece comes to you, please share your name and one word about how you're feeling about being in this circle today.",
        mainActivity: "For our main activity, we\'ll explore what\'s been happening, how it\'s affecting everyone, and what we can do to make things better. I\'ll ask several questions, and we\'ll pass the talking piece around for each one.",
        checkOut: "Before we close, let's do a final round. When the talking piece comes to you, please share one thing you're taking away from our circle today.",
        closingCeremony: "Thank you everyone for your honesty and ideas today. I'm confident that together we can improve this situation. Let's close our circle by taking a deep breath together and committing to our agreements."
      },
      questions: [
        {
          category: "Understanding the Issue",
          items: [
            "What do you know about what's been happening with [the issue]?",
            "How has this issue affected you personally?",
            "How do you think it has affected our classroom/community?",
            "What do you think might be causing this issue?",
            "What feelings come up for you when you think about this issue?"
          ]
        },
        {
          category: "Exploring Solutions",
          items: [
            "What could help improve this situation?",
            "What's one thing you could do personally to help?",
            "What support do you need from others?",
            "What agreements could we make as a group?",
            "How will we know if things are getting better?"
          ]
        },
        {
          category: "Moving Forward",
          items: [
            "What's one specific action we could take this week?",
            "How can we support each other in keeping our agreements?",
            "What should we do if the problem happens again?",
            "When should we check in again about this issue?",
            "What gives you hope that we can improve this situation?"
          ]
        }
      ],
      materials: [
        "Talking piece",
        "Circle guidelines poster",
        "Whiteboard or chart paper for recording agreements",
        "Markers",
        "Chairs arranged in a circle"
      ],
      timeRequired: "45-60 minutes",
      spaceSetup: "Chairs arranged in a perfect circle. A whiteboard or chart paper should be visible to record key points and agreements."
    },
    {
      id: "template-3",
      title: "Celebration Circle",
      description: "A circle format for acknowledging achievements and celebrating successes",
      ageGroup: "all",
      purpose: "celebration",
      structure: {
        openingCeremony: "Welcome everyone to our celebration circle! Today is a special opportunity for us to acknowledge our achievements and celebrate our successes. In our circle, we use a talking piece to ensure everyone has a chance to speak and be heard. Let's begin with a moment to appreciate being together.",
        checkIn: "Let's start with a quick check-in. When the talking piece comes to you, please share your name and one word that describes how you're feeling today.",
        mainActivity: "For our main activity, we\'ll be celebrating [specific achievement/milestone]. I\'ll ask several questions, and we\'ll pass the talking piece around for each one. Remember, this is a time to acknowledge both individual and collective achievements.",
        checkOut: "Before we close our celebration, let's do a final round. When the talking piece comes to you, please share one thing you're grateful for from our time together.",
        closingCeremony: "Thank you everyone for sharing in this celebration. Your contributions make our community stronger. Let's close our circle by [closing activity - e.g., a group cheer, a moment of appreciation, etc.]."
      },
      questions: [
        {
          category: "Acknowledging Achievements",
          items: [
            "What's something you're proud of accomplishing recently?",
            "What's something you've seen someone else in our circle do well?",
            "What's a challenge you've overcome this term/year?",
            "What's something new you've learned?",
            "What's a way you've grown or changed?"
          ]
        },
        {
          category: "Celebrating Together",
          items: [
            "What's something our class/group has accomplished together?",
            "What's a positive change you've noticed in our community?",
            "What's a moment from this term/year that made you smile?",
            "Who would you like to appreciate today and why?",
            "What's something about our class/group that makes you proud?"
          ]
        },
        {
          category: "Looking Forward",
          items: [
            "What are you looking forward to in the coming weeks/months?",
            "What's something you hope we'll continue doing?",
            "What's a goal you have for the future?",
            "What's something you'd like to celebrate next time?",
            "What's one hope you have for our community?"
          ]
        }
      ],
      materials: [
        "Talking piece (decorated festively if possible)",
        "Circle guidelines poster",
        "Celebration decorations (optional)",
        "Certificates or recognition items (if applicable)",
        "Refreshments (optional)"
      ],
      timeRequired: "30-45 minutes",
      spaceSetup: "Chairs arranged in a circle. The space can be decorated festively if appropriate. A special centerpiece representing the achievement being celebrated can be placed in the middle."
    },
    {
      id: "template-4",
      title: "Conflict Resolution Circle",
      description: "A structured circle format for resolving conflicts between students",
      ageGroup: "all",
      purpose: "conflict-resolution",
      structure: {
        openingCeremony: "Welcome everyone to our circle. We're here today to address a conflict that has occurred and find a way forward that works for everyone. This is a safe space where we listen to understand, not to respond. When you hold the talking piece, you have the floor to speak your truth. When you're not holding it, your job is to listen with an open heart and mind.",
        checkIn: "Let's start with a check-in. When the talking piece comes to you, please share your name and how you're feeling about being here today, in just a word or two.",
        mainActivity: "For our main activity, we\'ll explore what happened, how everyone has been affected, and how we can make things right. I\'ll ask several questions, and we\'ll pass the talking piece around for each one. Remember, we\'re here to understand and resolve, not to blame.",
        checkOut: "Before we close, let's do a final round. When the talking piece comes to you, please share one thing you're committing to do moving forward.",
        closingCeremony: "Thank you everyone for your honesty and willingness to work through this conflict. The agreements we've made today will help us move forward in a positive way. Let's close our circle by shaking hands (or another appropriate gesture) as a sign of our commitment to these agreements."
      },
      questions: [
        {
          category: "Understanding What Happened",
          items: [
            "What happened from your perspective?",
            "What were you thinking at the time?",
            "What have you thought about since?",
            "What's been the hardest part of this situation for you?",
            "Is there anything else about what happened that you want us to know?"
          ]
        },
        {
          category: "Exploring the Impact",
          items: [
            "How have you been affected by what happened?",
            "Who else do you think has been affected, and how?",
            "What feelings have come up for you?",
            "What's been the most difficult thing to deal with?",
            "How has this affected your relationship with others involved?"
          ]
        },
        {
          category: "Making Things Right",
          items: [
            "What do you need to move forward from this?",
            "What could help repair the harm that's been caused?",
            "What would you like to see happen next?",
            "What are you willing to do to help resolve this situation?",
            "What support do you need from others?"
          ]
        },
        {
          category: "Creating Agreements",
          items: [
            "What specific agreements can we make today?",
            "How will we know if these agreements are working?",
            "What should happen if there are further problems?",
            "When should we check in again about how things are going?",
            "Is there anything else you need to feel that this matter is resolved?"
          ]
        }
      ],
      materials: [
        "Talking piece",
        "Circle guidelines poster",
        "Agreement template or paper for recording agreements",
        "Pens",
        "Tissues"
      ],
      timeRequired: "45-60 minutes",
      spaceSetup: "Chairs arranged in a circle in a private, quiet space where the conversation won't be interrupted or overheard."
    },
    {
      id: "template-5",
      title: "Academic Circle",
      description: "A circle format for collaborative learning and academic discussion",
      ageGroup: "all",
      purpose: "academic",
      structure: {
        openingCeremony: "Welcome to our academic circle. Today we'll be exploring [specific topic/subject] together. In our circle, everyone's voice and perspective is valuable. We use a talking piece to ensure everyone has a chance to contribute. Our goal today is to deepen our understanding through collaborative discussion.",
        checkIn: "Let's start with a quick check-in. When the talking piece comes to you, please share your name and one thing you already know or wonder about our topic today.",
        mainActivity: "For our main activity, we\'ll explore different aspects of [topic]. I\'ll pose several questions, and we\'ll pass the talking piece around for each one. Feel free to build on others\' ideas as we go.",
        checkOut: "Before we close, let's do a final round. When the talking piece comes to you, please share one new insight you're taking away from our discussion today.",
        closingCeremony: "Thank you everyone for your thoughtful contributions. Our collective wisdom has helped us understand this topic more deeply. Let's close our circle by acknowledging what we've learned together."
      },
      questions: [
        {
          category: "Exploring Prior Knowledge",
          items: [
            "What do you already know about this topic?",
            "What experiences have you had that connect to this topic?",
            "What questions do you have about this topic?",
            "Why do you think this topic is important to learn about?",
            "How might this topic connect to other things we've studied?"
          ]
        },
        {
          category: "Deepening Understanding",
          items: [
            "What are the key concepts or ideas we need to understand?",
            "How would you explain this concept in your own words?",
            "What examples can you think of that illustrate this idea?",
            "What patterns or connections do you notice?",
            "What's something that surprises or interests you about this topic?"
          ]
        },
        {
          category: "Critical Thinking",
          items: [
            "What different perspectives exist on this topic?",
            "What evidence supports these different viewpoints?",
            "How might we apply what we're learning to real-world situations?",
            "What are the implications or consequences of these ideas?",
            "What might be some limitations or challenges to consider?"
          ]
        },
        {
          category: "Reflection and Application",
          items: [
            "How has your understanding of this topic changed?",
            "What's one way you might use what you've learned?",
            "What further questions do you have now?",
            "What resources might help us explore this topic further?",
            "How does this learning connect to your own goals or interests?"
          ]
        }
      ],
      materials: [
        "Talking piece",
        "Circle guidelines poster",
        "Relevant learning materials (texts, images, etc.)",
        "Whiteboard or chart paper for recording key ideas",
        "Notebooks and pens for individual note-taking"
      ],
      timeRequired: "30-45 minutes",
      spaceSetup: "Chairs arranged in a circle. Learning materials should be accessible but not create barriers between participants. A whiteboard or chart paper should be visible for recording key ideas."
    }
  ];

  // Load saved templates on component mount
  useEffect(() => {
    const loadSavedTemplates = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use localStorage as a placeholder
        const saved = localStorage.getItem('savedCircleTemplates');
        if (saved) {
          setSavedTemplates(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading saved templates:', error);
        toast.error('Failed to load saved templates');
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedTemplates();
  }, []);

  // Filter templates based on search and filters
  const filteredTemplates = [...predefinedTemplates, ...savedTemplates].filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgeGroup = filterAgeGroup === 'all' || template.ageGroup === filterAgeGroup || template.ageGroup === 'all';
    const matchesPurpose = filterPurpose === 'all' || template.purpose === filterPurpose;
    
    return matchesSearch && matchesAgeGroup && matchesPurpose;
  });

  // Handle template selection
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setActiveTab("designer");
  };

  // Handle custom template changes
  const handleCustomTemplateChange = (field, value) => {
    setCustomTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle structure changes in custom template
  const handleStructureChange = (field, value) => {
    setCustomTemplate(prev => ({
      ...prev,
      structure: {
        ...prev.structure,
        [field]: value
      }
    }));
  };

  // Add a new question category to custom template
  const addQuestionCategory = () => {
    setCustomTemplate(prev => ({
      ...prev,
      questions: [...prev.questions, { category: "", items: [""] }]
    }));
  };

  // Handle question category changes
  const handleCategoryChange = (index, value) => {
    setCustomTemplate(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        category: value
      };
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  // Add a new question to a category
  const addQuestion = (categoryIndex) => {
    setCustomTemplate(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[categoryIndex] = {
        ...updatedQuestions[categoryIndex],
        items: [...updatedQuestions[categoryIndex].items, ""]
      };
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  // Handle question changes
  const handleQuestionChange = (categoryIndex, questionIndex, value) => {
    setCustomTemplate(prev => {
      const updatedQuestions = [...prev.questions];
      const updatedItems = [...updatedQuestions[categoryIndex].items];
      updatedItems[questionIndex] = value;
      updatedQuestions[categoryIndex] = {
        ...updatedQuestions[categoryIndex],
        items: updatedItems
      };
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  // Remove a question from a category
  const removeQuestion = (categoryIndex, questionIndex) => {
    setCustomTemplate(prev => {
      const updatedQuestions = [...prev.questions];
      const updatedItems = [...updatedQuestions[categoryIndex].items];
      updatedItems.splice(questionIndex, 1);
      updatedQuestions[categoryIndex] = {
        ...updatedQuestions[categoryIndex],
        items: updatedItems.length ? updatedItems : [""]
      };
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  // Remove a question category
  const removeQuestionCategory = (index) => {
    setCustomTemplate(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions.splice(index, 1);
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  // Add a material to custom template
  const addMaterial = () => {
    setCustomTemplate(prev => ({
      ...prev,
      materials: [...prev.materials, ""]
    }));
  };

  // Handle material changes
  const handleMaterialChange = (index, value) => {
    setCustomTemplate(prev => {
      const updatedMaterials = [...prev.materials];
      updatedMaterials[index] = value;
      return {
        ...prev,
        materials: updatedMaterials
      };
    });
  };

  // Remove a material
  const removeMaterial = (index) => {
    setCustomTemplate(prev => {
      const updatedMaterials = [...prev.materials];
      updatedMaterials.splice(index, 1);
      return {
        ...prev,
        materials: updatedMaterials
      };
    });
  };

  // Save custom template
  const saveCustomTemplate = () => {
    if (!customTemplate.title) {
      toast.error('Please provide a title for your template');
      return;
    }

    const newTemplate = {
      ...customTemplate,
      id: `custom-${Date.now()}`,
    };

    setSavedTemplates(prev => {
      const updated = [...prev, newTemplate];
      // In a real implementation, this would save to an API
      localStorage.setItem('savedCircleTemplates', JSON.stringify(updated));
      return updated;
    });

    toast.success('Template saved successfully');
    setCustomTemplate({
      title: "",
      description: "",
      ageGroup: "",
      purpose: "",
      structure: {
        openingCeremony: "",
        checkIn: "",
        mainActivity: "",
        checkOut: "",
        closingCeremony: ""
      },
      questions: [],
      materials: [],
      timeRequired: "",
      spaceSetup: ""
    });
    setActiveTab("templates");
  };

  // Export template as PDF
  const exportTemplateAsPDF = () => {
    if (!selectedTemplate) return;
    
    // In a real implementation, this would generate and download a PDF
    toast.success('Template exported as PDF');
  };

  // Duplicate a template
  const duplicateTemplate = (template) => {
    const duplicated = {
      ...template,
      id: `custom-${Date.now()}`,
      title: `Copy of ${template.title}`
    };

    setSavedTemplates(prev => {
      const updated = [...prev, duplicated];
      localStorage.setItem('savedCircleTemplates', JSON.stringify(updated));
      return updated;
    });

    toast.success('Template duplicated successfully');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Circle Process Templates</h1>
          <p className="text-muted-foreground">
            Evidence-based templates for conducting restorative circles in educational settings.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="designer" disabled={!selectedTemplate}>Circle Designer</TabsTrigger>
            <TabsTrigger value="create">Create Custom</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Circle Process Templates</CardTitle>
                <CardDescription>
                  Select a template based on your needs and purpose
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="search">Search</Label>
                      <Input
                        id="search"
                        placeholder="Search templates..."
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
                      <Label htmlFor="purpose">Purpose</Label>
                      <Select value={filterPurpose} onValueChange={setFilterPurpose}>
                        <SelectTrigger id="purpose">
                          <SelectValue placeholder="All purposes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All purposes</SelectItem>
                          <SelectItem value="community-building">Community building</SelectItem>
                          <SelectItem value="problem-solving">Problem solving</SelectItem>
                          <SelectItem value="celebration">Celebration</SelectItem>
                          <SelectItem value="conflict-resolution">Conflict resolution</SelectItem>
                          <SelectItem value="academic">Academic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {filteredTemplates.map((template) => (
                      <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{template.title}</CardTitle>
                          <div className="flex space-x-2">
                            <span className="inline-flex items-centre rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                              {template.ageGroup === 'all' ? 'All ages' : template.ageGroup === 'primary' ? 'Primary' : 'Secondary'}
                            </span>
                            <span className="inline-flex items-centre rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              {template.purpose.replace('-', ' ')}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                          <p className="text-sm mt-2">
                            <span className="font-medium">Time:</span> {template.timeRequired}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => duplicateTemplate(template)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Duplicate
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleSelectTemplate(template)}
                          >
                            Select
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}

                    {filteredTemplates.length === 0 && (
                      <div className="col-span-full flex flex-col items-centre justify-centre p-6 text-centre">
                        <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium">No templates found</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Try adjusting your search or filters, or create a custom template.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Circle Designer Tab */}
          <TabsContent value="designer" className="space-y-6">
            {selectedTemplate && (
              <>
                <div className="flex justify-between items-centre">
                  <h2 className="text-2xl font-bold">{selectedTemplate.title}</h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setActiveTab("templates")}>
                      Back to Templates
                    </Button>
                    <Button variant="outline" onClick={exportTemplateAsPDF}>
                      <Download className="h-4 w-4 mr-2" />
                      Export as PDF
                    </Button>
                  </div>
                </div>

                <p className="text-muted-foreground">{selectedTemplate.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Circle Structure</CardTitle>
                        <CardDescription>
                          Follow this structure to guide your circle process
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="relative p-4 border rounded-lg bg-blue-50 border-blue-200">
                            <h3 className="text-lg font-medium mb-2">Opening Ceremony</h3>
                            <p className="text-sm">{selectedTemplate.structure.openingCeremony}</p>
                          </div>
                          
                          <div className="relative p-4 border rounded-lg bg-green-50 border-green-200">
                            <h3 className="text-lg font-medium mb-2">Check-In</h3>
                            <p className="text-sm">{selectedTemplate.structure.checkIn}</p>
                          </div>
                          
                          <div className="relative p-4 border rounded-lg bg-purple-50 border-purple-200">
                            <h3 className="text-lg font-medium mb-2">Main Activity</h3>
                            <p className="text-sm">{selectedTemplate.structure.mainActivity}</p>
                            
                            <div className="mt-4 space-y-4">
                              <h4 className="text-sm font-medium">Suggested Questions:</h4>
                              {selectedTemplate.questions.map((category, index) => (
                                <div key={index} className="space-y-2">
                                  <h5 className="text-sm font-medium">{category.category}</h5>
                                  <ul className="space-y-1">
                                    {category.items.map((question, qIndex) => (
                                      <li key={qIndex} className="flex items-start">
                                        <ArrowRight className="h-4 w-4 mr-2 mt-1 text-purple-500" />
                                        <span className="text-sm">{question}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="relative p-4 border rounded-lg bg-amber-50 border-amber-200">
                            <h3 className="text-lg font-medium mb-2">Check-Out</h3>
                            <p className="text-sm">{selectedTemplate.structure.checkOut}</p>
                          </div>
                          
                          <div className="relative p-4 border rounded-lg bg-red-50 border-red-200">
                            <h3 className="text-lg font-medium mb-2">Closing Ceremony</h3>
                            <p className="text-sm">{selectedTemplate.structure.closingCeremony}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Circle Setup</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium mb-1">Time Required</h3>
                            <p className="text-sm text-muted-foreground">{selectedTemplate.timeRequired}</p>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium mb-1">Space Setup</h3>
                            <p className="text-sm text-muted-foreground">{selectedTemplate.spaceSetup}</p>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium mb-1">Materials Needed</h3>
                            <ul className="text-sm space-y-1">
                              {selectedTemplate.materials.map((material, index) => (
                                <li key={index} className="flex items-start">
                                  <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                                  <span>{material}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-6">
                            <h3 className="text-sm font-medium mb-3">Visual Circle Arrangement</h3>
                            <div className="relative w-full aspect-square bg-grey-100 rounded-full flex items-centre justify-centre border border-grey-300">
                              <div className="absolute w-1/3 aspect-square bg-white rounded-full flex items-centre justify-centre border border-grey-300">
                                <span className="text-xs text-centre text-grey-500">Centerpiece</span>
                              </div>
                              
                              {/* Participant chairs */}
                              {Array.from({ length: 12 }).map((_, i) => {
                                const angle = (i * 30) * Math.PI / 180;
                                const radius = 42; // % of container
                                const x = 50 + radius * Math.cos(angle);
                                const y = 50 + radius * Math.sin(angle);
                                
                                return (
                                  <div 
                                    key={i}
                                    className="absolute w-4 h-4 bg-blue-500 rounded-full"
                                    style={{
                                      left: `${x}%`,
                                      top: `${y}%`,
                                      transform: 'translate(-50%, -50%)'
                                    }}
                                  />
                                );
                              })}
                            </div>
                            <p className="text-xs text-centre mt-2 text-muted-foreground">
                              Chairs arranged in a circle with equal spacing
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle>Facilitator Tips</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                            <span className="text-sm">Begin by explaining the purpose and process of the circle</span>
                          </div>
                          <div className="flex items-start">
                            <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                            <span className="text-sm">Model the depth of sharing you hope to see from participants</span>
                          </div>
                          <div className="flex items-start">
                            <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                            <span className="text-sm">Honour the talking piece and remind others to do the same</span>
                          </div>
                          <div className="flex items-start">
                            <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                            <span className="text-sm">Allow for silence and reflection between shares</span>
                          </div>
                          <div className="flex items-start">
                            <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                            <span className="text-sm">Acknowledge and appreciate contributions</span>
                          </div>
                          <div className="flex items-start">
                            <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                            <span className="text-sm">Be prepared to adapt questions based on the group's needs</span>
                          </div>
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
                <CardTitle>Create Custom Circle Template</CardTitle>
                <CardDescription>
                  Design your own circle process template
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="custom-title">Template Title</Label>
                      <Input
                        id="custom-title"
                        placeholder="Enter a title for your template"
                        value={customTemplate.title}
                        onChange={(e) => handleCustomTemplateChange('title', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="custom-description">Description</Label>
                      <Input
                        id="custom-description"
                        placeholder="Briefly describe your template"
                        value={customTemplate.description}
                        onChange={(e) => handleCustomTemplateChange('description', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="custom-age-group">Age Group</Label>
                      <Select 
                        value={customTemplate.ageGroup} 
                        onValueChange={(value) => handleCustomTemplateChange('ageGroup', value)}
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
                      <Label htmlFor="custom-purpose">Purpose</Label>
                      <Select 
                        value={customTemplate.purpose} 
                        onValueChange={(value) => handleCustomTemplateChange('purpose', value)}
                      >
                        <SelectTrigger id="custom-purpose">
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="community-building">Community building</SelectItem>
                          <SelectItem value="problem-solving">Problem solving</SelectItem>
                          <SelectItem value="celebration">Celebration</SelectItem>
                          <SelectItem value="conflict-resolution">Conflict resolution</SelectItem>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="custom-time">Time Required</Label>
                      <Input
                        id="custom-time"
                        placeholder="e.g., 30-45 minutes"
                        value={customTemplate.timeRequired}
                        onChange={(e) => handleCustomTemplateChange('timeRequired', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="custom-space">Space Setup</Label>
                      <Input
                        id="custom-space"
                        placeholder="Describe how the space should be arranged"
                        value={customTemplate.spaceSetup}
                        onChange={(e) => handleCustomTemplateChange('spaceSetup', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Circle Structure</h3>
                    
                    <div>
                      <Label htmlFor="opening-ceremony">Opening Ceremony</Label>
                      <Textarea
                        id="opening-ceremony"
                        placeholder="Script for opening the circle"
                        value={customTemplate.structure.openingCeremony}
                        onChange={(e) => handleStructureChange('openingCeremony', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="check-in">Check-In</Label>
                      <Textarea
                        id="check-in"
                        placeholder="Script for the check-in round"
                        value={customTemplate.structure.checkIn}
                        onChange={(e) => handleStructureChange('checkIn', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="main-activity">Main Activity</Label>
                      <Textarea
                        id="main-activity"
                        placeholder="Script for the main activity"
                        value={customTemplate.structure.mainActivity}
                        onChange={(e) => handleStructureChange('mainActivity', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="check-out">Check-Out</Label>
                      <Textarea
                        id="check-out"
                        placeholder="Script for the check-out round"
                        value={customTemplate.structure.checkOut}
                        onChange={(e) => handleStructureChange('checkOut', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="closing-ceremony">Closing Ceremony</Label>
                      <Textarea
                        id="closing-ceremony"
                        placeholder="Script for closing the circle"
                        value={customTemplate.structure.closingCeremony}
                        onChange={(e) => handleStructureChange('closingCeremony', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-centre justify-between">
                      <h3 className="text-lg font-medium">Question Categories</h3>
                      <Button variant="outline" size="sm" onClick={addQuestionCategory}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Category
                      </Button>
                    </div>

                    {customTemplate.questions.map((category, categoryIndex) => (
                      <Card key={categoryIndex}>
                        <CardHeader className="pb-2">
                          <div className="flex items-centre justify-between">
                            <Label htmlFor={`category-${categoryIndex}`}>Category Name</Label>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeQuestionCategory(categoryIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Input
                            id={`category-${categoryIndex}`}
                            placeholder="e.g., Understanding the Issue"
                            value={category.category}
                            onChange={(e) => handleCategoryChange(categoryIndex, e.target.value)}
                          />
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-centre justify-between">
                            <Label>Questions</Label>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => addQuestion(categoryIndex)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Question
                            </Button>
                          </div>
                          {category.items.map((question, questionIndex) => (
                            <div key={questionIndex} className="flex items-centre space-x-2">
                              <Input
                                placeholder="Enter question"
                                value={question}
                                onChange={(e) => handleQuestionChange(categoryIndex, questionIndex, e.target.value)}
                                className="flex-1"
                              />
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeQuestion(categoryIndex, questionIndex)}
                                disabled={category.items.length === 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-centre justify-between">
                      <h3 className="text-lg font-medium">Materials Needed</h3>
                      <Button variant="outline" size="sm" onClick={addMaterial}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Material
                      </Button>
                    </div>

                    {customTemplate.materials.map((material, index) => (
                      <div key={index} className="flex items-centre space-x-2">
                        <Input
                          placeholder="e.g., Talking piece"
                          value={material}
                          onChange={(e) => handleMaterialChange(index, e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeMaterial(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setActiveTab("templates")}>
                  Cancel
                </Button>
                <Button onClick={saveCustomTemplate}>
                  Save Template
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Circle Process Resources</CardTitle>
                  <CardDescription>
                    Educational materials and guides for implementing circle processes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Key Elements of Circle Process</h3>
                      <p className="text-muted-foreground mb-4">
                        Circle processes are based on several core elements that create a safe, inclusive space for dialogue:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">The Circle</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              Participants sit in a circle with no tables or barriers between them. This arrangement 
                              symbolizes equality, connection, and the wholeness of the community. Everyone can see 
                              each other, and no one is in a position of greater power.
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">The Talking Piece</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              A special object passed around the circle that gives the holder the right to speak while 
                              others listen. It regulates the dialogue, slows the pace, and ensures everyone has an 
                              equal opportunity to contribute without interruption.
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">The Keeper/Facilitator</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              The person who guides the process, poses questions, and helps maintain the integrity of 
                              the circle. The keeper participates in the circle as well, sharing when the talking piece 
                              comes to them and modelling the depth of sharing invited.
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Ceremonies and Rituals</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              Opening and closing ceremonies mark the circle as a special space distinct from ordinary 
                              interaction. These might include moments of silence, reading a poem, lighting a candle, 
                              or other meaningful activities that help participants transition into and out of circle space.
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Guidelines</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              Agreed-upon principles that shape how participants interact in the circle. Common guidelines 
                              include speaking from the heart, listening from the heart, speaking with respect, and honoring 
                              confidentiality. These are often developed collaboratively with the group.
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Consensus Decision-Making</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              When decisions need to be made, circles use a consensus process rather than majority rule. 
                              This means working toward solutions that everyone can accept, even if they're not everyone's 
                              first choice. This builds stronger commitment to implementing decisions.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Types of Circles</h3>
                      <p className="text-muted-foreground mb-4">
                        Circles can serve many different purposes in educational settings:
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Circle className="h-4 w-4 mr-2 mt-1 text-blue-500 fill-blue-500" />
                          <div>
                            <h4 className="text-base font-medium">Community Building Circles</h4>
                            <p className="text-sm text-muted-foreground">
                              Focus on creating connections, building relationships, and developing a sense of belonging. 
                              These circles help establish a foundation of trust and mutual respect that supports all other 
                              circle work.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Circle className="h-4 w-4 mr-2 mt-1 text-green-500 fill-green-500" />
                          <div>
                            <h4 className="text-base font-medium">Problem-Solving Circles</h4>
                            <p className="text-sm text-muted-foreground">
                              Address issues affecting the classroom or school community. These circles help identify 
                              concerns, explore impacts, and develop collaborative solutions that address the needs of 
                              all stakeholders.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Circle className="h-4 w-4 mr-2 mt-1 text-purple-500 fill-purple-500" />
                          <div>
                            <h4 className="text-base font-medium">Conflict Resolution Circles</h4>
                            <p className="text-sm text-muted-foreground">
                              Bring together those involved in and affected by a conflict to understand what happened, 
                              explore the impacts, and develop agreements to repair harm and prevent future incidents.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Circle className="h-4 w-4 mr-2 mt-1 text-amber-500 fill-amber-500" />
                          <div>
                            <h4 className="text-base font-medium">Celebration Circles</h4>
                            <p className="text-sm text-muted-foreground">
                              Acknowledge achievements, mark transitions, and celebrate successes. These circles help 
                              build a positive community culture by recognising growth, effort, and accomplishment.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Circle className="h-4 w-4 mr-2 mt-1 text-red-500 fill-red-500" />
                          <div>
                            <h4 className="text-base font-medium">Academic Circles</h4>
                            <p className="text-sm text-muted-foreground">
                              Use the circle format for collaborative learning, exploring curriculum content, and 
                              developing critical thinking skills. These circles support deeper engagement with 
                              academic material through dialogue and shared inquiry.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Circle Process Structure</h3>
                      <p className="text-muted-foreground mb-4">
                        While circles can be adapted for different purposes, they typically follow this general structure:
                      </p>
                      <div className="relative">
                        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-full mb-4"></div>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-centre justify-centre text-white font-medium">1</div>
                            <div className="ml-4">
                              <h4 className="text-base font-medium">Opening Ceremony</h4>
                              <p className="text-sm text-muted-foreground">
                                Marks the beginning of circle time and helps participants transition into the circle space. 
                                This might include a moment of silence, a brief reading, or another meaningful ritual.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-centre justify-centre text-white font-medium">2</div>
                            <div className="ml-4">
                              <h4 className="text-base font-medium">Check-In Round</h4>
                              <p className="text-sm text-muted-foreground">
                                A quick round where everyone shares briefly, often about how they're feeling or something 
                                simple about themselves. This helps everyone get comfortable speaking in the circle.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-centre justify-centre text-white font-medium">3</div>
                            <div className="ml-4">
                              <h4 className="text-base font-medium">Main Activity</h4>
                              <p className="text-sm text-muted-foreground">
                                The core purpose of the circle, which might involve multiple rounds of sharing on different 
                                questions or topics. This is where the deeper work of the circle happens.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500 flex items-centre justify-centre text-white font-medium">4</div>
                            <div className="ml-4">
                              <h4 className="text-base font-medium">Check-Out Round</h4>
                              <p className="text-sm text-muted-foreground">
                                A final round where participants share reflections, commitments, or feelings about the 
                                circle experience. This helps bring closure to the process.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 flex items-centre justify-centre text-white font-medium">5</div>
                            <div className="ml-4">
                              <h4 className="text-base font-medium">Closing Ceremony</h4>
                              <p className="text-sm text-muted-foreground">
                                Marks the end of circle time and helps participants transition back to regular activities. 
                                This might include a moment of silence, a group gesture, or another meaningful ritual.
                              </p>
                            </div>
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
                            <span>Introduction to Circle Process</span>
                          </li>
                          <li className="flex items-start">
                            <FileText className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                            <span>Facilitating Effective Circles</span>
                          </li>
                          <li className="flex items-start">
                            <FileText className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                            <span>Circle Questions and Prompts</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-1">Downloadable Guides</h3>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start">
                            <FileText className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                            <span>Circle Keeper's Handbook</span>
                          </li>
                          <li className="flex items-start">
                            <FileText className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                            <span>Circle Guidelines Poster (Printable)</span>
                          </li>
                          <li className="flex items-start">
                            <FileText className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                            <span>Question Bank for Different Circle Types</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-1">Practise Scenarios</h3>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start">
                            <FileText className="h-4 w-4 mr-2 mt-0.5 text-purple-500" />
                            <span>Primary School Circle Scenarios</span>
                          </li>
                          <li className="flex items-start">
                            <FileText className="h-4 w-4 mr-2 mt-0.5 text-purple-500" />
                            <span>Secondary School Circle Scenarios</span>
                          </li>
                          <li className="flex items-start">
                            <FileText className="h-4 w-4 mr-2 mt-0.5 text-purple-500" />
                            <span>Troubleshooting Common Circle Challenges</span>
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
                        Circle processes in schools are supported by research evidence showing multiple benefits:
                      </p>
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-sm font-medium">Improved Relationships</h3>
                          <p className="text-sm text-muted-foreground">
                            Research shows circles help build stronger relationships between students and between students and staff.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Enhanced School Climate</h3>
                          <p className="text-sm text-muted-foreground">
                            Schools using regular circles report improvements in overall school climate and sense of community.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Skill Development</h3>
                          <p className="text-sm text-muted-foreground">
                            Circles help students develop important social-emotional skills including empathy, active listening, and respectful communication.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Reduced Disciplinary Issues</h3>
                          <p className="text-sm text-muted-foreground">
                            Schools implementing regular circles often see reductions in behaviour incidents and exclusionary discipline.
                          </p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-1">Key Research</h3>
                        <ul className="text-sm space-y-1">
                          <li>• Boyes-Watson & Pranis (2015) - Circle Forward: Building a Restorative School Community</li>
                          <li>• Riestenberg (2012) - Circle in the Square: Building Community and Repairing Harm in School</li>
                          <li>• Pranis (2005) - The Little Book of Circle Processes</li>
                          <li>• Costello et al. (2010) - Restorative Circles in Schools</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Talking Piece Ideas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        The talking piece is a central element of circle process. Here are some ideas for meaningful talking pieces:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 border rounded-lg">
                          <h3 className="text-sm font-medium">Natural Objects</h3>
                          <ul className="text-xs space-y-1 mt-1 text-muted-foreground">
                            <li>• Smooth stone or crystal</li>
                            <li>• Pinecone or acorn</li>
                            <li>• Feather</li>
                            <li>• Small branch or stick</li>
                          </ul>
                        </div>
                        <div className="p-2 border rounded-lg">
                          <h3 className="text-sm font-medium">Symbolic Items</h3>
                          <ul className="text-xs space-y-1 mt-1 text-muted-foreground">
                            <li>• Small stuffed animal</li>
                            <li>• Object representing class mascot</li>
                            <li>• Item related to curriculum</li>
                            <li>• Cultural artifact</li>
                          </ul>
                        </div>
                        <div className="p-2 border rounded-lg">
                          <h3 className="text-sm font-medium">Student-Created</h3>
                          <ul className="text-xs space-y-1 mt-1 text-muted-foreground">
                            <li>• Decorated stick or wand</li>
                            <li>• Painted rock</li>
                            <li>• Handmade object</li>
                            <li>• Collaborative art piece</li>
                          </ul>
                        </div>
                        <div className="p-2 border rounded-lg">
                          <h3 className="text-sm font-medium">Practical Items</h3>
                          <ul className="text-xs space-y-1 mt-1 text-muted-foreground">
                            <li>• Soft ball</li>
                            <li>• Koosh ball</li>
                            <li>• Stress ball</li>
                            <li>• Bean bag</li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        The best talking pieces have meaning to the group and are comfortable to hold and pass.
                      </p>
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

export default CircleProcessTemplates;
