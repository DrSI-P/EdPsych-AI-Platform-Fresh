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
  Plus,
  Trash2,
  Edit,
  Copy,
  Search,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Define types for prompts
interface ReflectionPrompt {
  id: string;
  title: string;
  description: string;
  ageGroup: string;
  category: string;
  promptText: string;
  supportingQuestions: string[];
  visualSupports: boolean;
  simplifiedLanguage: boolean;
  visualAids?: string[];
}

/**
 * Age-Appropriate Reflection Prompts Component
 * 
 * This component provides developmentally appropriate reflection prompts
 * for students at different age levels within the restorative justice framework.
 * 
 * Key features:
 * - Age-appropriate prompts categorized by developmental stage
 * - Different prompt types for various restorative scenarios
 * - Customizable prompt collections
 * - Visual supports for younger students
 * - Integration with the restorative justice framework
 */
const AgeAppropriateReflectionPrompts = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedPrompt, setSelectedPrompt] = useState<ReflectionPrompt | null>(null);
  const [customPrompt, setCustomPrompt] = useState<ReflectionPrompt>({
    id: "",
    title: "",
    description: "",
    ageGroup: "",
    category: "",
    promptText: "",
    supportingQuestions: [],
    visualSupports: false,
    simplifiedLanguage: false
  });
  const [savedPrompts, setSavedPrompts] = useState<ReflectionPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAgeGroup, setFilterAgeGroup] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Predefined reflection prompts based on restorative justice research and developmental psychology
  const predefinedPrompts: ReflectionPrompt[] = [
    // Early Years (3-5)
    {
      id: "early-1",
      title: "Feelings Check",
      description: "Simple prompts to help young children identify and express their feelings",
      ageGroup: "early-years",
      category: "self-awareness",
      promptText: "How are you feeling right now? Can you point to the face that shows how you feel?",
      supportingQuestions: [
        "Can you tell me why you feel that way?",
        "What happened to make you feel like this?",
        "What would help you feel better?",
        "Is there something you need right now?"
      ],
      visualSupports: true,
      simplifiedLanguage: true,
      visualAids: [
        "/images/restorative-justice/emotions/happy.png",
        "/images/restorative-justice/emotions/sad.png",
        "/images/restorative-justice/emotions/angry.png",
        "/images/restorative-justice/emotions/scared.png",
        "/images/restorative-justice/emotions/confused.png"
      ]
    },
    {
      id: "early-2",
      title: "What Happened?",
      description: "Simple prompts to help young children describe events",
      ageGroup: "early-years",
      category: "incident-reflection",
      promptText: "Can you tell me what happened? Let's draw it together.",
      supportingQuestions: [
        "Who was there?",
        "What did you do?",
        "What did the other person do?",
        "How did it make you feel?",
        "What do you wish had happened instead?"
      ],
      visualSupports: true,
      simplifiedLanguage: true,
      visualAids: [
        "/images/restorative-justice/sequence/first.png",
        "/images/restorative-justice/sequence/then.png",
        "/images/restorative-justice/sequence/next.png",
        "/images/restorative-justice/sequence/last.png"
      ]
    },
    {
      id: "early-3",
      title: "Making Things Better",
      description: "Simple prompts to help young children think about making amends",
      ageGroup: "early-years",
      category: "making-amends",
      promptText: "What could you do to make things better?",
      supportingQuestions: [
        "How could you help [name] feel better?",
        "Would you like to make a card/picture for them?",
        "Could you use kind words to help?",
        "What could you share with them?",
        "Would a hug help if they want one?"
      ],
      visualSupports: true,
      simplifiedLanguage: true,
      visualAids: [
        "/images/restorative-justice/actions/say-sorry.png",
        "/images/restorative-justice/actions/help-clean.png",
        "/images/restorative-justice/actions/share-toy.png",
        "/images/restorative-justice/actions/kind-words.png"
      ]
    },
    
    // Primary (5-11)
    {
      id: "primary-1",
      title: "Understanding Impact",
      description: "Prompts to help primary students reflect on how their actions affect others",
      ageGroup: "primary",
      category: "impact-awareness",
      promptText: "When [incident] happened, how do you think it affected other people?",
      supportingQuestions: [
        "How do you think [name] felt when that happened?",
        "What might they have been thinking?",
        "How might it have affected their day?",
        "Did it affect anyone else? How?",
        "If you were in their position, how would you have felt?"
      ],
      visualSupports: true,
      simplifiedLanguage: false
    },
    {
      id: "primary-2",
      title: "Exploring Choices",
      description: "Prompts to help primary students reflect on decision-making",
      ageGroup: "primary",
      category: "choice-reflection",
      promptText: "What choices did you make before, during, and after what happened?",
      supportingQuestions: [
        "What were you thinking when you made that choice?",
        "What else could you have chosen to do instead?",
        "What stopped you from making a different choice?",
        "How might things have been different if you chose differently?",
        "What might help you make different choices next time?"
      ],
      visualSupports: false,
      simplifiedLanguage: false
    },
    {
      id: "primary-3",
      title: "Repairing Harm",
      description: "Prompts to help primary students think about making things right",
      ageGroup: "primary",
      category: "making-amends",
      promptText: "What could you do to help make things right?",
      supportingQuestions: [
        "What do you think would help [name] feel better?",
        "Is there something you could do to fix what happened?",
        "Is there something you could say that would help?",
        "How will you know if things are better?",
        "What might you do differently next time?"
      ],
      visualSupports: false,
      simplifiedLanguage: false
    },
    {
      id: "primary-4",
      title: "Community Impact",
      description: "Prompts to help primary students understand wider impacts",
      ageGroup: "primary",
      category: "community-awareness",
      promptText: "How do you think what happened affected our classroom community?",
      supportingQuestions: [
        "Did it change how people feel in our classroom?",
        "Did it make it harder for anyone to learn or play?",
        "Did it affect how people trust each other?",
        "What could we all do to make our classroom feel better?",
        "What classroom agreements does this remind us about?"
      ],
      visualSupports: false,
      simplifiedLanguage: false
    },
    
    // Secondary (11-18)
    {
      id: "secondary-1",
      title: "Personal Responsibility",
      description: "Prompts to help secondary students reflect on their role in situations",
      ageGroup: "secondary",
      category: "responsibility",
      promptText: "Reflecting on the situation, what part did you play and what responsibility do you have?",
      supportingQuestions: [
        "What factors influenced your decisions or actions?",
        "Which aspects were within your control and which weren't?",
        "How might your actions or words have contributed to what happened?",
        "Were there moments where you could have changed the outcome?",
        "What does taking responsibility mean to you in this situation?"
      ],
      visualSupports: false,
      simplifiedLanguage: false
    },
    {
      id: "secondary-2",
      title: "Perspective Taking",
      description: "Prompts to help secondary students consider multiple perspectives",
      ageGroup: "secondary",
      category: "empathy",
      promptText: "How might different people involved view and experience this situation?",
      supportingQuestions: [
        "How do you think [name] experienced this situation?",
        "What might they have been thinking or feeling?",
        "What pressures or influences might they have been under?",
        "How might someone not directly involved view this situation?",
        "What assumptions might you be making about others' intentions or experiences?"
      ],
      visualSupports: false,
      simplifiedLanguage: false
    },
    {
      id: "secondary-3",
      title: "Values Alignment",
      description: "Prompts to help secondary students reflect on personal values",
      ageGroup: "secondary",
      category: "values",
      promptText: "How does what happened align with your personal values and who you want to be?",
      supportingQuestions: [
        "What values are important to you as a person?",
        "Which of your values were honored or compromised in this situation?",
        "How would someone who embodies your values have handled this situation?",
        "What does this situation reveal about what matters to you?",
        "How might this experience shape your values going forward?"
      ],
      visualSupports: false,
      simplifiedLanguage: false
    },
    {
      id: "secondary-4",
      title: "Relationship Impact",
      description: "Prompts to help secondary students reflect on relationship effects",
      ageGroup: "secondary",
      category: "relationships",
      promptText: "How has this situation affected your relationships with others involved?",
      supportingQuestions: [
        "How has trust been affected in your relationship(s)?",
        "What might be needed to repair these relationship(s)?",
        "How might this experience change how you interact in the future?",
        "What strengths in your relationship(s) might help with moving forward?",
        "What have you learned about yourself in relationships from this experience?"
      ],
      visualSupports: false,
      simplifiedLanguage: false
    },
    {
      id: "secondary-5",
      title: "Future Planning",
      description: "Prompts to help secondary students plan for similar situations",
      ageGroup: "secondary",
      category: "future-planning",
      promptText: "What have you learned from this experience that you can apply in the future?",
      supportingQuestions: [
        "What warning signs or triggers can you identify now?",
        "What strategies could you use in similar situations?",
        "What support might you need to respond differently?",
        "How might you repair similar harm if it happens again?",
        "What commitments are you willing to make going forward?"
      ],
      visualSupports: false,
      simplifiedLanguage: false
    },
    
    // Staff Reflection
    {
      id: "staff-1",
      title: "Facilitation Reflection",
      description: "Prompts for staff to reflect on their restorative facilitation",
      ageGroup: "staff",
      category: "facilitation",
      promptText: "How effective was your facilitation of the restorative process?",
      supportingQuestions: [
        "How well did you maintain neutrality throughout the process?",
        "How effectively did you create a safe space for all participants?",
        "What questions or techniques were most effective?",
        "What challenges did you encounter and how did you address them?",
        "What would you do differently next time?"
      ],
      visualSupports: false,
      simplifiedLanguage: false
    },
    {
      id: "staff-2",
      title: "Relationship Building",
      description: "Prompts for staff to reflect on relationship aspects",
      ageGroup: "staff",
      category: "relationships",
      promptText: "How has this restorative process affected your relationships with the students involved?",
      supportingQuestions: [
        "How has trust been affected in your relationships?",
        "What have you learned about these students through this process?",
        "How might this experience change how you interact with them in the future?",
        "What strengths in your relationships helped with the process?",
        "How can you continue to build on these relationships?"
      ],
      visualSupports: false,
      simplifiedLanguage: false
    }
  ];

  // Load saved prompts on component mount
  useEffect(() => {
    const loadSavedPrompts = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use localStorage as a placeholder
        const saved = localStorage.getItem('savedReflectionPrompts');
        if (saved) {
          setSavedPrompts(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading saved prompts:', error);
        toast.error('Failed to load saved prompts');
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedPrompts();
  }, []);

  // Filter prompts based on search and filters
  const filteredPrompts = [...predefinedPrompts, ...savedPrompts].filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.promptText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgeGroup = filterAgeGroup === 'all' || prompt.ageGroup === filterAgeGroup;
    const matchesCategory = filterCategory === 'all' || prompt.category === filterCategory;
    
    return matchesSearch && matchesAgeGroup && matchesCategory;
  });

  // Handle prompt selection
  const handleSelectPrompt = (prompt: ReflectionPrompt) => {
    setSelectedPrompt(prompt);
    setActiveTab("view");
  };

  // Handle custom prompt changes
  const handleCustomPromptChange = (field: keyof ReflectionPrompt, value: string | boolean | string[]) => {
    setCustomPrompt(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add a supporting question to custom prompt
  const addSupportingQuestion = () => {
    setCustomPrompt(prev => ({
      ...prev,
      supportingQuestions: [...prev.supportingQuestions, ""]
    }));
  };

  // Handle supporting question changes
  const handleQuestionChange = (index: number, value: string) => {
    setCustomPrompt(prev => {
      const updatedQuestions = [...prev.supportingQuestions];
      updatedQuestions[index] = value;
      return {
        ...prev,
        supportingQuestions: updatedQuestions
      };
    });
  };

  // Remove a supporting question
  const removeQuestion = (index: number) => {
    setCustomPrompt(prev => {
      const updatedQuestions = [...prev.supportingQuestions];
      updatedQuestions.splice(index, 1);
      return {
        ...prev,
        supportingQuestions: updatedQuestions
      };
    });
  };

  // Save custom prompt
  const saveCustomPrompt = () => {
    if (!customPrompt.title) {
      toast.error('Please provide a title for your prompt');
      return;
    }

    if (!customPrompt.promptText) {
      toast.error('Please provide the main reflection prompt');
      return;
    }

    const newPrompt = {
      ...customPrompt,
      id: `custom-${Date.now()}`,
    };

    setSavedPrompts(prev => {
      const updated = [...prev, newPrompt];
      // Save to localStorage
      localStorage.setItem('savedReflectionPrompts', JSON.stringify(updated));
      return updated;
    });

    toast.success('Prompt saved successfully');
    setActiveTab("browse");
    setCustomPrompt({
      id: "",
      title: "",
      description: "",
      ageGroup: "",
      category: "",
      promptText: "",
      supportingQuestions: [],
      visualSupports: false,
      simplifiedLanguage: false
    });
  };

  // Download prompt as PDF
  const downloadPromptPDF = () => {
    if (!selectedPrompt) return;
    
    toast.success('Downloading prompt as PDF...');
    // In a real implementation, this would generate and download a PDF
  };

  // Export prompt collection
  const exportPromptCollection = () => {
    const dataStr = JSON.stringify(savedPrompts);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = 'reflection-prompts.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Prompt collection exported successfully');
  };

  // Import prompt collection
  const importPromptCollection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (!event.target.files || event.target.files.length === 0) return;
    
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = e => {
      try {
        if (!e.target || typeof e.target.result !== 'string') return;
        
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) {
          toast.error('Invalid file format');
          return;
        }
        
        setSavedPrompts(imported);
        localStorage.setItem('savedReflectionPrompts', JSON.stringify(imported));
        toast.success('Prompt collection imported successfully');
      } catch (error) {
        console.error('Error importing prompts:', error);
        toast.error('Failed to import prompts');
      }
    };
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Age-Appropriate Reflection Prompts</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Prompts</TabsTrigger>
          <TabsTrigger value="create">Create Custom Prompt</TabsTrigger>
          <TabsTrigger value="view" disabled={!selectedPrompt}>View Prompt</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search prompts..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterAgeGroup} onValueChange={setFilterAgeGroup}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Age Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Age Groups</SelectItem>
                  <SelectItem value="early-years">Early Years (3-5)</SelectItem>
                  <SelectItem value="primary">Primary (5-11)</SelectItem>
                  <SelectItem value="secondary">Secondary (11-18)</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="self-awareness">Self-Awareness</SelectItem>
                  <SelectItem value="incident-reflection">Incident Reflection</SelectItem>
                  <SelectItem value="making-amends">Making Amends</SelectItem>
                  <SelectItem value="impact-awareness">Impact Awareness</SelectItem>
                  <SelectItem value="choice-reflection">Choice Reflection</SelectItem>
                  <SelectItem value="community-awareness">Community Awareness</SelectItem>
                  <SelectItem value="responsibility">Responsibility</SelectItem>
                  <SelectItem value="empathy">Empathy</SelectItem>
                  <SelectItem value="values">Values</SelectItem>
                  <SelectItem value="relationships">Relationships</SelectItem>
                  <SelectItem value="future-planning">Future Planning</SelectItem>
                  <SelectItem value="facilitation">Facilitation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrompts.length > 0 ? (
                filteredPrompts.map((prompt) => (
                  <Card key={prompt.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleSelectPrompt(prompt)}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{prompt.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{prompt.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {prompt.ageGroup === 'early-years' && 'Early Years (3-5)'}
                          {prompt.ageGroup === 'primary' && 'Primary (5-11)'}
                          {prompt.ageGroup === 'secondary' && 'Secondary (11-18)'}
                          {prompt.ageGroup === 'staff' && 'Staff'}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {prompt.category === 'self-awareness' && 'Self-Awareness'}
                          {prompt.category === 'incident-reflection' && 'Incident Reflection'}
                          {prompt.category === 'making-amends' && 'Making Amends'}
                          {prompt.category === 'impact-awareness' && 'Impact Awareness'}
                          {prompt.category === 'choice-reflection' && 'Choice Reflection'}
                          {prompt.category === 'community-awareness' && 'Community Awareness'}
                          {prompt.category === 'responsibility' && 'Responsibility'}
                          {prompt.category === 'empathy' && 'Empathy'}
                          {prompt.category === 'values' && 'Values'}
                          {prompt.category === 'relationships' && 'Relationships'}
                          {prompt.category === 'future-planning' && 'Future Planning'}
                          {prompt.category === 'facilitation' && 'Facilitation'}
                        </span>
                      </div>
                      <p className="text-sm line-clamp-3">{prompt.promptText}</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="flex justify-between w-full text-xs text-muted-foreground">
                        <span className="flex items-center">
                          {prompt.visualSupports && <span className="mr-2">Visual Supports</span>}
                          {prompt.simplifiedLanguage && <span>Simplified Language</span>}
                        </span>
                        <span>{prompt.supportingQuestions.length} supporting questions</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center h-64">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No prompts found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-between mt-6">
            <div className="flex gap-2">
              <input
                type="file"
                id="import-prompts"
                className="hidden"
                accept=".json"
                onChange={importPromptCollection}
              />
              <Button variant="outline" onClick={() => document.getElementById('import-prompts')?.click()}>
                <Download className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" onClick={exportPromptCollection} disabled={savedPrompts.length === 0}>
                <Save className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <Button onClick={() => setActiveTab("create")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Custom Prompt
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Custom Reflection Prompt</CardTitle>
              <CardDescription>
                Design your own age-appropriate reflection prompt for restorative practices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Input
                    label="Title"
                    placeholder="E.g., Conflict Resolution Reflection"
                    value={customPrompt.title}
                    onChange={(e) => handleCustomPromptChange('title', e.target.value)}
                    required
                  />
                  
                  <Textarea
                    label="Description"
                    placeholder="Brief description of this prompt's purpose"
                    value={customPrompt.description}
                    onChange={(e) => handleCustomPromptChange('description', e.target.value)}
                  />
                  
                  <Select
                    value={customPrompt.ageGroup}
                    onValueChange={(value) => handleCustomPromptChange('ageGroup', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Age Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="early-years">Early Years (3-5)</SelectItem>
                      <SelectItem value="primary">Primary (5-11)</SelectItem>
                      <SelectItem value="secondary">Secondary (11-18)</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={customPrompt.category}
                    onValueChange={(value) => handleCustomPromptChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self-awareness">Self-Awareness</SelectItem>
                      <SelectItem value="incident-reflection">Incident Reflection</SelectItem>
                      <SelectItem value="making-amends">Making Amends</SelectItem>
                      <SelectItem value="impact-awareness">Impact Awareness</SelectItem>
                      <SelectItem value="choice-reflection">Choice Reflection</SelectItem>
                      <SelectItem value="community-awareness">Community Awareness</SelectItem>
                      <SelectItem value="responsibility">Responsibility</SelectItem>
                      <SelectItem value="empathy">Empathy</SelectItem>
                      <SelectItem value="values">Values</SelectItem>
                      <SelectItem value="relationships">Relationships</SelectItem>
                      <SelectItem value="future-planning">Future Planning</SelectItem>
                      <SelectItem value="facilitation">Facilitation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <Textarea
                    label="Main Prompt"
                    placeholder="The main reflection question or prompt"
                    value={customPrompt.promptText}
                    onChange={(e) => handleCustomPromptChange('promptText', e.target.value)}
                    required
                  />
                  
                  <div className="flex flex-col space-y-2">
                    <Label>Options</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="visual-supports"
                        checked={customPrompt.visualSupports}
                        onCheckedChange={(checked) => 
                          handleCustomPromptChange('visualSupports', checked === true)
                        }
                      />
                      <label
                        htmlFor="visual-supports"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include visual supports
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="simplified-language"
                        checked={customPrompt.simplifiedLanguage}
                        onCheckedChange={(checked) => 
                          handleCustomPromptChange('simplifiedLanguage', checked === true)
                        }
                      />
                      <label
                        htmlFor="simplified-language"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Use simplified language
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Supporting Questions</Label>
                  <Button variant="outline" size="sm" onClick={addSupportingQuestion}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
                
                {customPrompt.supportingQuestions.length > 0 ? (
                  <div className="space-y-2">
                    {customPrompt.supportingQuestions.map((question, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={question}
                          onChange={(e) => handleQuestionChange(index, e.target.value)}
                          placeholder={`Supporting question ${index + 1}`}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeQuestion(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No supporting questions added yet</p>
                    <p className="text-sm">Click "Add Question" to add follow-up questions</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("browse")}>Cancel</Button>
              <Button onClick={saveCustomPrompt}>Save Prompt</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="view">
          {selectedPrompt && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{selectedPrompt.title}</CardTitle>
                    <CardDescription>{selectedPrompt.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setActiveTab("browse")}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {selectedPrompt.category === 'self-awareness' && 'Students need to identify and express their feelings'}
                    {selectedPrompt.category === 'incident-reflection' && 'Reflecting on a specific incident or event'}
                    {selectedPrompt.category === 'making-amends' && 'Considering how to repair harm or make things right'}
                    {selectedPrompt.category === 'impact-awareness' && 'Exploring how actions affect others'}
                    {selectedPrompt.category === 'choice-reflection' && 'Examining decision-making processes'}
                    {selectedPrompt.category === 'community-awareness' && 'Understanding impacts on the wider community'}
                    {selectedPrompt.category === 'responsibility' && 'Exploring personal responsibility in a situation'}
                    {selectedPrompt.category === 'empathy' && 'Developing perspective-taking skills'}
                    {selectedPrompt.category === 'values' && 'Connecting actions to personal values'}
                    {selectedPrompt.category === 'relationships' && 'Examining effects on relationships'}
                    {selectedPrompt.category === 'future-planning' && 'Planning for similar situations in the future'}
                    {selectedPrompt.category === 'facilitation' && 'Reflecting on restorative facilitation practise'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Main Prompt:</h3>
                  <p className="text-lg">{selectedPrompt.promptText}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Supporting Questions:</h3>
                  <ul className="space-y-2">
                    {selectedPrompt.supportingQuestions.map((question, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs mr-2">
                          {index + 1}
                        </span>
                        <span>{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {selectedPrompt.visualAids && selectedPrompt.visualAids.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Visual Supports:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedPrompt.visualAids.map((image, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                          {/* In a real implementation, this would display actual images */}
                          <div className="absolute inset-0 flex items-center justify-center bg-muted">
                            <span className="text-xs text-muted-foreground">Image placeholder</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Age Group:</span>
                    <span>
                      {selectedPrompt.ageGroup === 'early-years' && 'Early Years (3-5)'}
                      {selectedPrompt.ageGroup === 'primary' && 'Primary (5-11)'}
                      {selectedPrompt.ageGroup === 'secondary' && 'Secondary (11-18)'}
                      {selectedPrompt.ageGroup === 'staff' && 'Staff'}
                    </span>
                  </div>
                  
                  {selectedPrompt.visualSupports && (
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                      <span>Visual Supports</span>
                    </div>
                  )}
                  
                  {selectedPrompt.simplifiedLanguage && (
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                      <span>Simplified Language</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={downloadPromptPDF}>
                    <FileText className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </div>
                <Button onClick={() => setActiveTab("browse")}>Back to Browse</Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgeAppropriateReflectionPrompts;
