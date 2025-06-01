'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Heart,
  Share2,
  Zap,
  Award,
  Star,
  MessageCircle,
  Smile,
  ThumbsUp,
  BookOpen,
  Lightbulb,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

export default function ReflectionPromptsPage() {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('primary');
  const [selectedPromptType, setSelectedPromptType] = useState('incident');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample reflection prompt templates
  const promptTemplates = {
    primary: {
      incident: [
        {
          id: 1,
          title: "Understanding Feelings",
          description: "Simple prompts to help younger pupils identify and express feelings after an incident",
          visualSupport: "emoji-based",
          questions: [
            "How did you feel when this happened? (Point to the emoji that matches)",
            "How do you think the other person felt? (Circle the emoji)",
            "What could you do next time? (Draw or write your idea)",
            "What would help make things better now? (Choose from the pictures)"
          ],
          ageRange: "5-7 years",
          curriculum: "PSHE KS1",
          visualElements: ["emotion emojis", "simple action illustrations", "basic cause-effect visuals"]
        },
        {
          id: 2,
          title: "My Actions and Choices",
          description: "Visual sequence cards to help pupils reflect on actions and consequences",
          visualSupport: "sequence cards",
          questions: [
            "What happened first? (Put the cards in order)",
            "What did you do? (Point to the card)",
            "What happened next? (Draw what happened)",
            "What could you choose next time? (Circle the better choice)"
          ],
          ageRange: "7-11 years",
          curriculum: "PSHE KS2",
          visualElements: ["sequence cards", "choice pathway illustrations", "traffic light system"]
        }
      ],
      community: [
        {
          id: 3,
          title: "Our Classroom Community",
          description: "Visual prompts to help pupils reflect on their role in the classroom community",
          visualSupport: "classroom map",
          questions: [
            "Where do you feel happiest in our classroom? (Place your marker)",
            "Who do you help in our classroom? (Draw a line to them)",
            "How do you make our classroom a nice place? (Draw or write)",
            "What could you do to help someone new feel welcome? (Choose or draw)"
          ],
          ageRange: "5-7 years",
          curriculum: "PSHE KS1",
          visualElements: ["classroom map", "connection lines", "helper badges"]
        },
        {
          id: 4,
          title: "Building Our Community",
          description: "Reflection on personal contributions to the school community",
          visualSupport: "community web",
          questions: [
            "What strengths do you bring to our class? (Write in your strand of the web)",
            "How have you helped someone this week? (Draw a picture)",
            "What could you do to make our class stronger? (Add to the web)",
            "Who makes you feel included? (Add their name to your web)"
          ],
          ageRange: "7-11 years",
          curriculum: "PSHE KS2, Citizenship",
          visualElements: ["community web diagram", "strength cards", "contribution tracker"]
        }
      ],
      personal: [
        {
          id: 5,
          title: "My Learning Journey",
          description: "Visual reflection on personal learning progress and goals",
          visualSupport: "journey map",
          questions: [
            "What have you learned this week? (Add to your journey map)",
            "What was challenging? (Draw or write on the mountain)",
            "What are you proud of? (Place a star on your map)",
            "What would you like to learn next? (Draw at the end of your path)"
          ],
          ageRange: "5-7 years",
          curriculum: "PSHE KS1",
          visualElements: ["journey path", "mountain/challenge points", "achievement stars"]
        },
        {
          id: 6,
          title: "My Growth Mindset",
          description: "Visual prompts to develop resilience and growth mindset",
          visualSupport: "growing tree",
          questions: [
            "What new thing did you try? (Add a leaf to your tree)",
            "What mistake helped you learn? (Write on a branch)",
            "What will you keep practicing? (Add to the roots)",
            "Who helped you grow? (Add their name to a raindrop)"
          ],
          ageRange: "7-11 years",
          curriculum: "PSHE KS2",
          visualElements: ["growing tree diagram", "challenge/growth illustrations", "progress visualization"]
        }
      ]
    },
    secondary: {
      incident: [
        {
          id: 7,
          title: "Conflict Analysis",
          description: "Structured visual reflection on conflict situations and resolution",
          visualSupport: "conflict map",
          questions: [
            "What factors contributed to this situation? (Map the influences)",
            "How did your actions impact others? (Complete the ripple diagram)",
            "What assumptions might you have made? (Identify on the thought bubbles)",
            "What alternative approaches could you take in future? (Create a decision tree)"
          ],
          ageRange: "11-14 years",
          curriculum: "PSHE KS3, Citizenship",
          visualElements: ["conflict mapping", "ripple effect diagram", "thought bubbles", "decision trees"]
        },
        {
          id: 8,
          title: "Restorative Reflection",
          description: "In-depth analysis of incidents with focus on repair and growth",
          visualSupport: "perspective wheel",
          questions: [
            "Describe the situation from multiple perspectives (Complete the perspective wheel)",
            "What needs were you trying to meet? (Identify on the needs hierarchy)",
            "What impact did your actions have on the community? (Map on the community web)",
            "What steps can you take to repair harm? (Create an action plan)"
          ],
          ageRange: "14-16 years",
          curriculum: "PSHE KS4, Citizenship",
          visualElements: ["perspective wheel", "needs hierarchy", "community impact web", "action planning template"]
        }
      ],
      community: [
        {
          id: 9,
          title: "Community Contribution Analysis",
          description: "Reflection on personal role and impact within school community",
          visualSupport: "impact mapping",
          questions: [
            "How do your actions contribute to school culture? (Map your influence)",
            "What community strengths do you help develop? (Identify on the asset map)",
            "Where could you increase your positive impact? (Highlight growth areas)",
            "How might you support others in the community? (Create a support plan)"
          ],
          ageRange: "11-14 years",
          curriculum: "PSHE KS3, Citizenship",
          visualElements: ["influence mapping", "community asset visualization", "growth area highlighting", "support planning template"]
        },
        {
          id: 10,
          title: "Leadership and Community",
          description: "Reflection on leadership role and community development",
          visualSupport: "leadership web",
          questions: [
            "How do you currently demonstrate leadership? (Map on your leadership web)",
            "What community needs have you identified? (Complete the needs assessment)",
            "How could you address these needs? (Develop an initiative plan)",
            "What support would you need to implement your ideas? (Create a resource map)"
          ],
          ageRange: "14-16 years",
          curriculum: "PSHE KS4, Citizenship, Leadership",
          visualElements: ["leadership web", "community needs assessment", "initiative planning", "resource mapping"]
        }
      ],
      personal: [
        {
          id: 11,
          title: "Personal Development Reflection",
          description: "Visual tools for reflecting on personal growth and development",
          visualSupport: "growth radar",
          questions: [
            "What areas have you developed this term? (Plot on your growth radar)",
            "What challenges have you overcome? (Map your resilience journey)",
            "What skills would you like to develop further? (Create a learning plan)",
            "What support would help you achieve your goals? (Identify resources)"
          ],
          ageRange: "11-14 years",
          curriculum: "PSHE KS3",
          visualElements: ["growth radar chart", "resilience journey mapping", "skill development planning", "resource identification"]
        },
        {
          id: 12,
          title: "Future Self Reflection",
          description: "Visual exploration of values, goals and future aspirations",
          visualSupport: "values and goals mapping",
          questions: [
            "What values are most important to you? (Create your values map)",
            "How do your current actions align with these values? (Complete the alignment chart)",
            "What steps would bring you closer to your ideal future? (Develop a pathway plan)",
            "What might challenge your progress? (Identify obstacles and solutions)"
          ],
          ageRange: "14-16 years",
          curriculum: "PSHE KS4, Careers",
          visualElements: ["values mapping", "action-value alignment chart", "future pathway visualization", "obstacle-solution planning"]
        }
      ]
    }
  };
  
  // Get current templates based on selections
  const currentTemplates = promptTemplates[selectedAgeGroup][selectedPromptType] || [];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  // Filter templates based on search query
  const filteredTemplates = currentTemplates.filter(template => 
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Reflection Prompts</h1>
        <p className="text-muted-foreground text-lg">
          Visual tools to guide meaningful reflection and personal growth
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Tabs Navigation */}
          <Tabs defaultValue="templates" onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>
            
            {/* Templates Tab */}
            <TabsContent value="templates">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <CardTitle>Reflection Prompt Templates</CardTitle>
                        <CardDescription>
                          Age-appropriate templates with visual support
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <select 
                          className="border rounded-md p-2 text-sm"
                          value={selectedAgeGroup}
                          onChange={(e) => setSelectedAgeGroup(e.target.value)}
                        >
                          <option value="primary">Primary (KS1-KS2)</option>
                          <option value="secondary">Secondary (KS3-KS4)</option>
                        </select>
                        <select 
                          className="border rounded-md p-2 text-sm"
                          value={selectedPromptType}
                          onChange={(e) => setSelectedPromptType(e.target.value)}
                        >
                          <option value="incident">Incident Reflection</option>
                          <option value="community">Community Building</option>
                          <option value="personal">Personal Growth</option>
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <motion.div variants={itemVariants} className="mb-6">
                      <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search templates..." 
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      
                      {/* Template Cards */}
                      <div className="space-y-6">
                        {filteredTemplates.length > 0 ? (
                          filteredTemplates.map((template) => (
                            <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
                              <CardHeader className="bg-primary/5 pb-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="text-lg">{template.title}</CardTitle>
                                    <CardDescription>{template.description}</CardDescription>
                                  </div>
                                  <Badge className="bg-primary/10 text-primary border-primary/20">
                                    {template.ageRange}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-4">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Visual Support Type</h4>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                      {template.visualSupport}
                                    </Badge>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Sample Reflection Questions</h4>
                                    <ul className="space-y-2 text-sm">
                                      {template.questions.map((question, index) => (
                                        <li key={index} className="flex items-start">
                                          <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full w-5 h-5 text-xs font-medium mr-2 mt-0.5">
                                            {index + 1}
                                          </span>
                                          <span>{question}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Visual Elements</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {template.visualElements.map((element, index) => (
                                        <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                          {element}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Curriculum Alignment</h4>
                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                      {template.curriculum}
                                    </Badge>
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="bg-gray-50 flex justify-between">
                                <Button variant="ghost" size="sm">
                                  <FileText className="h-4 w-4 mr-2" /> Preview
                                </Button>
                                <Button>
                                  <Edit className="h-4 w-4 mr-2" /> Use Template
                                </Button>
                              </CardFooter>
                            </Card>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No templates found</h3>
                            <p className="text-muted-foreground">
                              Try adjusting your search or filters to find reflection templates.
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            {/* Create Tab */}
            <TabsContent value="create">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Create Custom Reflection Prompt</CardTitle>
                    <CardDescription>
                      Design your own reflection prompts with visual support
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div variants={itemVariants} className="space-y-6">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Basic Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="prompt-title" className="text-sm font-medium">
                              Prompt Title
                            </label>
                            <Input 
                              id="prompt-title" 
                              placeholder="Enter a title for your reflection prompt"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="prompt-age-group" className="text-sm font-medium">
                              Age Group
                            </label>
                            <select 
                              id="prompt-age-group"
                              className="w-full border rounded-md p-2 text-sm"
                            >
                              <option value="">Select age group</option>
                              <option value="ks1">KS1 (5-7 years)</option>
                              <option value="ks2">KS2 (7-11 years)</option>
                              <option value="ks3">KS3 (11-14 years)</option>
                              <option value="ks4">KS4 (14-16 years)</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="prompt-description" className="text-sm font-medium">
                            Description
                          </label>
                          <Textarea 
                            id="prompt-description" 
                            placeholder="Describe the purpose of this reflection prompt"
                            rows={3}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="prompt-type" className="text-sm font-medium">
                              Prompt Type
                            </label>
                            <select 
                              id="prompt-type"
                              className="w-full border rounded-md p-2 text-sm"
                            >
                              <option value="">Select prompt type</option>
                              <option value="incident">Incident Reflection</option>
                              <option value="community">Community Building</option>
                              <option value="personal">Personal Growth</option>
                              <option value="academic">Academic Reflection</option>
                              <option value="custom">Custom</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="prompt-curriculum" className="text-sm font-medium">
                              Curriculum Alignment
                            </label>
                            <select 
                              id="prompt-curriculum"
                              className="w-full border rounded-md p-2 text-sm"
                            >
                              <option value="">Select curriculum area</option>
                              <option value="pshe">PSHE</option>
                              <option value="citizenship">Citizenship</option>
                              <option value="english">English</option>
                              <option value="science">Science</option>
                              <option value="maths">Mathematics</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      {/* Visual Support */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Visual Support</h3>
                        
                        <div className="space-y-2">
                          <label htmlFor="visual-type" className="text-sm font-medium">
                            Visual Support Type
                          </label>
                          <select 
                            id="visual-type"
                            className="w-full border rounded-md p-2 text-sm"
                          >
                            <option value="">Select visual support type</option>
                            <option value="emojis">Emotion Emojis</option>
                            <option value="sequence">Sequence Cards</option>
                            <option value="mapping">Visual Mapping</option>
                            <option value="journey">Journey Visualization</option>
                            <option value="web">Connection Web</option>
                            <option value="custom">Custom Visual</option>
                          </select>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <Card className="bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                              <div className="mb-2 flex space-x-1">
                                <span className="text-2xl">😊</span>
                                <span className="text-2xl">😢</span>
                                <span className="text-2xl">😡</span>
                              </div>
                              <span className="text-xs text-center">Emotion Emojis</span>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                              <div className="mb-2 flex space-x-1">
                                <div className="w-6 h-8 border rounded bg-blue-100 flex items-center justify-center text-xs">1</div>
                                <div className="w-6 h-8 border rounded bg-blue-100 flex items-center justify-center text-xs">2</div>
                                <div className="w-6 h-8 border rounded bg-blue-100 flex items-center justify-center text-xs">3</div>
                              </div>
                              <span className="text-xs text-center">Sequence Cards</span>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                              <div className="mb-2 w-12 h-8 relative">
                                <div className="absolute inset-0 border-2 border-blue-300 rounded-full"></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-2 border-blue-500 rounded-full"></div>
                              </div>
                              <span className="text-xs text-center">Visual Mapping</span>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                              <div className="mb-2 w-12 h-8 relative">
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-300"></div>
                                <div className="absolute bottom-0 left-1/4 w-1 h-3 bg-blue-500"></div>
                                <div className="absolute bottom-0 left-2/4 w-1 h-5 bg-blue-500"></div>
                                <div className="absolute bottom-0 left-3/4 w-1 h-2 bg-blue-500"></div>
                              </div>
                              <span className="text-xs text-center">Journey Path</span>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="visual-elements" className="text-sm font-medium">
                            Visual Elements to Include
                          </label>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="cursor-pointer bg-blue-50 text-blue-700 border-blue-200">
                              <CheckCircle className="h-3 w-3 mr-1" /> Emotion Icons
                            </Badge>
                            <Badge variant="outline" className="cursor-pointer">
                              <Plus className="h-3 w-3 mr-1" /> Sequence Cards
                            </Badge>
                            <Badge variant="outline" className="cursor-pointer">
                              <Plus className="h-3 w-3 mr-1" /> Progress Bars
                            </Badge>
                            <Badge variant="outline" className="cursor-pointer">
                              <Plus className="h-3 w-3 mr-1" /> Connection Lines
                            </Badge>
                            <Badge variant="outline" className="cursor-pointer">
                              <Plus className="h-3 w-3 mr-1" /> Decision Trees
                            </Badge>
                            <Badge variant="outline" className="cursor-pointer">
                              <Plus className="h-3 w-3 mr-1" /> Add Custom
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Reflection Questions */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Reflection Questions</h3>
                        
                        <div className="space-y-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                  <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full w-5 h-5 text-xs font-medium mr-2">
                                    1
                                  </span>
                                  <h4 className="text-sm font-medium">Question 1</h4>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <Input 
                                  placeholder="Enter reflection question"
                                  defaultValue="How did you feel during this situation?"
                                />
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <span className="mr-2">Visual prompt:</span>
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    Emotion Emojis
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                  <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full w-5 h-5 text-xs font-medium mr-2">
                                    2
                                  </span>
                                  <h4 className="text-sm font-medium">Question 2</h4>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <Input 
                                  placeholder="Enter reflection question"
                                  defaultValue="What happened before, during, and after?"
                                />
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <span className="mr-2">Visual prompt:</span>
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    Sequence Cards
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Button className="w-full">
                            <Plus className="h-4 w-4 mr-2" /> Add Question
                          </Button>
                        </div>
                      </div>
                      
                      {/* Accessibility Options */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Accessibility Options</h3>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="simplified-language" 
                              className="mr-2"
                              defaultChecked
                            />
                            <label htmlFor="simplified-language" className="text-sm">
                              Use simplified language
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="high-contrast" 
                              className="mr-2"
                              defaultChecked
                            />
                            <label htmlFor="high-contrast" className="text-sm">
                              High contrast visuals
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="text-to-speech" 
                              className="mr-2"
                              defaultChecked
                            />
                            <label htmlFor="text-to-speech" className="text-sm">
                              Enable text-to-speech support
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="voice-input" 
                              className="mr-2"
                              defaultChecked
                            />
                            <label htmlFor="voice-input" className="text-sm">
                              Enable voice input for responses
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-2" /> Preview
                        </Button>
                        <Button>
                          <CheckCircle className="h-4 w-4 mr-2" /> Save Template
                        </Button>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            {/* Progress Tab */}
            <TabsContent value="progress">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Reflection Progress Tracking</CardTitle>
                    <CardDescription>
                      Monitor reflection engagement and growth over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div variants={itemVariants} className="space-y-8">
                      {/* Class/Student Selector */}
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Search student or class..." 
                            className="pl-10"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label htmlFor="date-range" className="text-sm font-medium">Period:</label>
                          <select 
                            id="date-range"
                            className="border rounded-md p-2 text-sm"
                          >
                            <option value="term">Current Term</option>
                            <option value="month">Last Month</option>
                            <option value="year">Academic Year</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Engagement Overview */}
                      <div>
                        <h3 className="font-medium mb-4">Reflection Engagement Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="bg-primary/5">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-2xl font-bold">42</div>
                                  <div className="text-sm text-muted-foreground">Reflections Completed</div>
                                </div>
                                <FileText className="h-8 w-8 text-primary/40" />
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-green-50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-2xl font-bold text-green-700">85%</div>
                                  <div className="text-sm text-green-600">Completion Rate</div>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-300" />
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-blue-50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-2xl font-bold text-blue-700">+18%</div>
                                  <div className="text-sm text-blue-600">Growth Trend</div>
                                </div>
                                <RefreshCw className="h-8 w-8 text-blue-300" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      
                      {/* Reflection Types */}
                      <div>
                        <h3 className="font-medium mb-4">Reflection Types Distribution</h3>
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <div className="flex justify-center items-center h-64">
                            <div className="flex flex-col items-center">
                              <div className="relative w-48 h-48 mb-4">
                                {/* Simplified pie chart representation */}
                                <div className="absolute inset-0 rounded-full border-8 border-blue-300" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 0, 50% 0)' }}></div>
                                <div className="absolute inset-0 rounded-full border-8 border-green-300" style={{ clipPath: 'polygon(50% 50%, 50% 0, 0 0, 0 50%)' }}></div>
                                <div className="absolute inset-0 rounded-full border-8 border-amber-300" style={{ clipPath: 'polygon(50% 50%, 0 50%, 0 100%, 50% 100%)' }}></div>
                                <div className="absolute inset-0 rounded-full border-8 border-purple-300" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 100% 100%, 100% 50%)' }}></div>
                              </div>
                              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-blue-300 mr-2"></div>
                                  <span className="text-xs">Incident (35%)</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-green-300 mr-2"></div>
                                  <span className="text-xs">Community (25%)</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-amber-300 mr-2"></div>
                                  <span className="text-xs">Personal (30%)</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-purple-300 mr-2"></div>
                                  <span className="text-xs">Academic (10%)</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Recent Reflections */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium">Recent Reflections</h3>
                          <Button variant="outline" size="sm">
                            View All
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">Understanding Feelings</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Year 3 Oak • 24 May 2025
                                  </p>
                                </div>
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                  Incident
                                </Badge>
                              </div>
                              
                              <div className="mt-4">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-muted-foreground">Completion</span>
                                  <span className="text-xs font-medium">92%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="h-1.5 rounded-full bg-blue-500"
                                    style={{ width: '92%' }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="flex justify-end items-center mt-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-primary text-xs"
                                >
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">Building Our Community</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Year 5 Maple • 22 May 2025
                                  </p>
                                </div>
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  Community
                                </Badge>
                              </div>
                              
                              <div className="mt-4">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-muted-foreground">Completion</span>
                                  <span className="text-xs font-medium">100%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="h-1.5 rounded-full bg-green-500"
                                    style={{ width: '100%' }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="flex justify-end items-center mt-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-primary text-xs"
                                >
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">My Growth Mindset</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Year 4 Birch • 20 May 2025
                                  </p>
                                </div>
                                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                                  Personal
                                </Badge>
                              </div>
                              
                              <div className="mt-4">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-muted-foreground">Completion</span>
                                  <span className="text-xs font-medium">85%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="h-1.5 rounded-full bg-amber-500"
                                    style={{ width: '85%' }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="flex justify-end items-center mt-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-primary text-xs"
                                >
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      
                      {/* Report Actions */}
                      <div className="flex flex-wrap gap-3">
                        <Button>
                          <FileText className="h-4 w-4 mr-2" /> Generate Progress Report
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" /> Export Data
                        </Button>
                        <Button variant="ghost">
                          <Calendar className="h-4 w-4 mr-2" /> Schedule Reports
                        </Button>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-8">
          {/* UK Educational Context */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">UK Educational Context</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <p className="text-muted-foreground">
                    Reflection prompts support UK educational frameworks for personal development and social-emotional learning.
                  </p>
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h3 className="font-medium text-sm mb-2">UK Curriculum Alignment:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Supports PSHE curriculum objectives for self-awareness</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Aligns with Ofsted framework for personal development</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Complements DfE guidance on mental wellbeing</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" /> Create New Prompt
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" /> Browse Templates
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" /> Download Resources
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" /> Manage Groups
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Implementation Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Implementation Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Start Simple</p>
                      <p className="text-muted-foreground">Begin with basic reflection prompts and gradually increase complexity</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Regular Practice</p>
                      <p className="text-muted-foreground">Schedule consistent reflection time for maximum benefit</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Visual First</p>
                      <p className="text-muted-foreground">Introduce visual elements before written reflection</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Celebrate Growth</p>
                      <p className="text-muted-foreground">Acknowledge progress in reflection skills over time</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Resources Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8"
      >
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle>Reflection Resources</CardTitle>
            <CardDescription>
              Tools and resources to support effective reflection practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Visual Prompt Library</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    Age-appropriate visual prompts and templates for different reflection contexts.
                  </p>
                  <Button variant="outline" className="w-full">Access Library</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Teacher Guides</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    Implementation guides and best practices for facilitating meaningful reflection.
                  </p>
                  <Button variant="outline" className="w-full">View Guides</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Research Evidence</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    UK-based research on the impact of visual reflection tools in educational settings.
                  </p>
                  <Button variant="outline" className="w-full">View Research</Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" asChild>
          <Link href="/restorative-justice/community-building">
            <ArrowLeft className="mr-2 h-4 w-4" /> Community Building
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/restorative-justice">
            Restorative Justice Overview <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
