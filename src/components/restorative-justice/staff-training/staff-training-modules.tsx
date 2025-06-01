'use client';

import React, { useState, useEffect } from 'react';
// Replace Chakra UI imports with our own UI components
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { 
  Button 
} from "@/components/ui/button";
import { 
  Progress 
} from "@/components/ui/progress";
import { 
  Badge 
} from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  FaPlay, 
  FaCheck, 
  FaLock, 
  FaBookOpen, 
  FaVideo, 
  FaFileAlt, 
  FaQuestionCircle, 
  FaUserFriends, 
  FaChalkboardTeacher,
  FaDownload,
  FaClipboardCheck,
  FaCertificate
} from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  sections: any[];
  resources: any[];
  completed: boolean;
  progress: number;
}

interface Section {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'activity' | 'reflection';
  content: string;
  duration: string;
  completed: boolean;
}

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'template';
  url: string;
  description: string;
}

interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  questions: any[];
  passingScore: number;
}

interface Question {
  id: string;
  text: string;
  options: any[];
  correctAnswer: number;
}

interface UserProgress {
  userId: string;
  moduleId: string;
  completedSections: string[];
  quizScores: Record<string, number>;
  certificateIssued: boolean;
  lastAccessed: string;
}

const StaffTrainingModules: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  
  // Replace Chakra UI hooks with state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onOpen = () => setIsModalOpen(true);
  const onClose = () => setIsModalOpen(false);
  
  const [activeTab, setActiveTab] = useState(0);
  const [modules, setModules] = useState<Module[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [certificateModule, setCertificateModule] = useState<Module | null>(null);

  // Fetch modules and user progress
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch modules
        const modulesResponse = await fetch('/api/restorative-justice/staff-training/modules');
        const modulesData = await modulesResponse.json();
        
        if (session?.user?.id) {
          // Fetch user progress
          const progressResponse = await fetch(`/api/restorative-justice/staff-training/progress?userId=${session.user.id}`);
          const progressData = await progressResponse.json();
          
          setUserProgress(progressData);
          
          // Update modules with user progress
          const updatedModules = modulesData.map((module: Module) => {
            const userModuleProgress = progressData.find((p: UserProgress) => p.moduleId === module.id);
            
            if (userModuleProgress) {
              const completedSections = userModuleProgress.completedSections.length;
              const totalSections = module.sections.length;
              const progress = Math.round((completedSections / totalSections) * 100);
              
              return {
                ...module,
                progress,
                completed: progress === 100
              };
            }
            
            return {
              ...module,
              progress: 0,
              completed: false
            };
          });
          
          setModules(updatedModules);
        } else {
          setModules(modulesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load training modules. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [session, toast]);

  // Handle module selection
  const handleModuleSelect = async (module: Module) => {
    setCurrentModule(module);
    setCurrentSection(module.sections[0]);
    
    // Record module access
    if (session?.user?.id) {
      try {
        await fetch('/api/restorative-justice/staff-training/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session.user.id,
            moduleId: module.id,
            action: 'access'
          }),
        });
      } catch (error) {
        console.error('Error recording module access:', error);
      }
    }
  };

  // Handle section completion
  const handleSectionComplete = async (section: Section) => {
    if (!session?.user?.id || !currentModule) return;
    
    try {
      const response = await fetch('/api/restorative-justice/staff-training/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          moduleId: currentModule.id,
          sectionId: section.id,
          action: 'complete'
        }),
      });
      
      const data = await response.json();
      
      // Update user progress
      setUserProgress(prev => {
        const updated = [...prev];
        const index = updated.findIndex(p => p.moduleId === currentModule.id);
        
        if (index >= 0) {
          updated[index] = data;
        } else {
          updated.push(data);
        }
        
        return updated;
      });
      
      // Update modules progress
      setModules(prev => {
        const updated = [...prev];
        const moduleIndex = updated.findIndex(m => m.id === currentModule.id);
        
        if (moduleIndex >= 0) {
          const completedSections = data.completedSections.length;
          const totalSections = updated[moduleIndex].sections.length;
          const progress = Math.round((completedSections / totalSections) * 100);
          
          updated[moduleIndex] = {
            ...updated[moduleIndex],
            progress,
            completed: progress === 100
          };
        }
        
        return updated;
      });
      
      // Move to next section if available
      if (currentModule) {
        const currentIndex = currentModule.sections.findIndex(s => s.id === section.id);
        if (currentIndex < currentModule.sections.length - 1) {
          setCurrentSection(currentModule.sections[currentIndex + 1]);
        } else {
          // Module completed
          toast({
            title: "Section completed",
            description: "You have completed this section."
          });
          
          // Check if entire module is completed
          const moduleProgress = data.completedSections.length / currentModule.sections.length;
          if (moduleProgress === 1) {
            toast({
              title: "Module completed",
              description: "Congratulations! You have completed this module."
            });
            
            setCertificateModule(currentModule);
            onOpen();
          }
        }
      }
    } catch (error) {
      console.error('Error completing section:', error);
      toast({
        title: "Error",
        description: "Failed to record progress. Please try again."
      });
    }
  };

  // Handle quiz submission
  const handleQuizSubmit = async () => {
    if (!currentQuiz || !session?.user?.id || !currentModule) return;
    
    // Calculate score
    let correctAnswers = 0;
    currentQuiz.questions.forEach((question, index) => {
      if (quizAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    
    // Record quiz score
    try {
      await fetch('/api/restorative-justice/staff-training/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          moduleId: currentModule.id,
          quizId: currentQuiz.id,
          score,
          action: 'quiz'
        }),
      });
      
      // If passing score, mark section as complete
      if (score >= currentQuiz.passingScore) {
        const quizSection = currentModule.sections.find(s => s.type === 'quiz');
        if (quizSection) {
          handleSectionComplete(quizSection);
        }
      }
    } catch (error) {
      console.error('Error recording quiz score:', error);
    }
  };

  // Handle certificate generation
  const handleGenerateCertificate = async () => {
    if (!certificateModule || !session?.user?.id) return;
    
    try {
      const response = await fetch('/api/restorative-justice/staff-training/certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          moduleId: certificateModule.id,
        }),
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${certificateModule.title.replace(/\s+/g, '_')}_Certificate.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Certificate generated",
        description: "Your certificate has been generated and downloaded."
      });
      
      onClose();
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast({
        title: "Error",
        description: "Failed to generate certificate. Please try again."
      });
    }
  };

  // Reset current module view
  const handleBackToModules = () => {
    setCurrentModule(null);
    setCurrentSection(null);
    setCurrentQuiz(null);
    setQuizAnswers([]);
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  // Render module catalog
  const renderModuleCatalog = () => {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Staff Training on Restorative Approaches</h1>
        <p className="text-lg mb-8">
          Comprehensive professional development resources to support educators in effectively implementing
          restorative practices in their classrooms and schools. These evidence-based modules are designed
          to build knowledge, skills, and confidence in using restorative approaches.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card key={module.id} className="overflow-hidden shadow-md">
              <CardHeader className="bg-blue-50 pb-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{module.title}</h3>
                  <Badge variant={module.level === 'Beginner' ? 'success' : module.level === 'Intermediate' ? 'info' : 'secondary'}>
                    {module.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{module.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">
                    <FaChalkboardTeacher className="inline mr-1" />
                    {module.duration}
                  </span>
                  <span className="text-sm text-gray-600">
                    <FaBookOpen className="inline mr-1" />
                    {module.sections.length} sections
                  </span>
                </div>
                <Progress value={module.progress} className="mb-4 rounded-full" />
                <p className="text-sm text-right mb-2">
                  {module.progress}% complete
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  onClick={() => handleModuleSelect(module)}
                  className="w-full"
                >
                  {module.completed ? <FaCheck className="mr-2" /> : <FaPlay className="mr-2" />}
                  {module.completed ? 'Review Module' : module.progress > 0 ? 'Continue' : 'Start Module'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Render module content
  const renderModuleContent = () => {
    if (!currentModule || !currentSection) return null;
    
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <Button onClick={handleBackToModules} variant="outline">
            <FaChalkboardTeacher className="mr-2" />
            Back to Modules
          </Button>
          <Badge className="p-2" variant={currentModule.level === 'Beginner' ? 'success' : currentModule.level === 'Intermediate' ? 'info' : 'secondary'}>
            {currentModule.level} Level
          </Badge>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">{currentModule.title}</h1>
        <p className="text-md text-gray-600 mb-6">
          {currentModule.duration} • {currentModule.sections.length} sections
        </p>
        
        <Progress value={currentModule.progress} className="mb-6 rounded-full" />
        
        <div className="mb-8">
          <Tabs>
            <TabsList>
              {currentModule.sections.map((section, index) => {
                const isCompleted = userProgress.some(p =>
                  p.moduleId === currentModule.id &&
                  p.completedSections.includes(section.id)
                );
                
                return (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    onClick={() => setCurrentSection(section)}
                  >
                    <div className="flex items-center">
                      <div className="mr-3">
                        {isCompleted ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <div className={`w-4 h-4 rounded-full ${index === 0 || userProgress.some(p =>
                            p.moduleId === currentModule.id &&
                            p.completedSections.includes(currentModule.sections[index-1]?.id)
                          ) ? "bg-blue-500" : "bg-gray-300"}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-left">{section.title}</span>
                        <div className="flex items-center mt-1">
                          {section.type === 'video' && <FaVideo className="text-gray-500 mr-1" />}
                          {section.type === 'text' && <FaFileAlt className="text-gray-500 mr-1" />}
                          {section.type === 'quiz' && <FaQuestionCircle className="text-gray-500 mr-1" />}
                          {section.type === 'activity' && <FaUserFriends className="text-gray-500 mr-1" />}
                          {section.type === 'reflection' && <FaBookOpen className="text-gray-500 mr-1" />}
                          <span className="text-xs text-gray-500">{section.duration}</span>
                        </div>
                      </div>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            <TabsContent value={currentSection.id}>
              <div>
                <h2 className="text-2xl font-bold mb-4">{currentSection.title}</h2>
                
                {currentSection.type === 'video' && (
                  <div className="mb-6">
                    <div
                      className="bg-gray-100 rounded-md h-96 flex items-center justify-center mb-4"
                    >
                      <p>Video content would be embedded here</p>
                    </div>
                    <p className="whitespace-pre-wrap">{currentSection.content}</p>
                  </div>
                )}
                
                {currentSection.type === 'text' && (
                  <div className="mb-6">
                    <p className="whitespace-pre-wrap">{currentSection.content}</p>
                  </div>
                )}
                
                {currentSection.type === 'quiz' && (
                  <div className="mb-6">
                    <p className="mb-4">Quiz content would be rendered here based on the quiz data</p>
                  </div>
                )}
                
                {currentSection.type === 'activity' && (
                  <div className="mb-6">
                    <p className="whitespace-pre-wrap">{currentSection.content}</p>
                  </div>
                )}
                
                {currentSection.type === 'reflection' && (
                  <div className="mb-6">
                    <p className="whitespace-pre-wrap">{currentSection.content}</p>
                  </div>
                )}
                
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    disabled={currentModule.sections.indexOf(currentSection) === 0}
                    onClick={() => {
                      const currentIndex = currentModule.sections.indexOf(currentSection);
                      if (currentIndex > 0) {
                        setCurrentSection(currentModule.sections[currentIndex - 1]);
                      }
                    }}
                  >
                    Previous
                  </Button>
                  
                  <Button
                    onClick={() => handleSectionComplete(currentSection)}
                  >
                    {currentModule.sections.indexOf(currentSection) === currentModule.sections.length - 1
                      ? 'Complete Module'
                      : 'Mark as Complete'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <Separator className="my-8" />
        
        <div>
          <h3 className="text-xl font-medium mb-4">Module Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentModule.resources.map((resource) => (
              <Card key={resource.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-2">
                    {resource.type === 'pdf' && <FaFileAlt className="text-red-500 mr-2" />}
                    {resource.type === 'video' && <FaVideo className="text-blue-500 mr-2" />}
                    {resource.type === 'link' && <FaBookOpen className="text-green-500 mr-2" />}
                    {resource.type === 'template' && <FaClipboardCheck className="text-purple-500 mr-2" />}
                    <h4 className="text-sm font-semibold">{resource.title}</h4>
                  </div>
                  <p className="text-sm mb-3">{resource.description}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(resource.url, '_blank')}
                  >
                    <FaDownload className="mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Certificate modal
  const renderCertificateModal = () => {
    if (!certificateModule) return null;
    
    return (
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Module Completion Certificate</DialogTitle>
            <DialogDescription>
              <div className="text-center py-6">
                <FaCertificate className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
                <p className="text-lg mb-6">
                  You have successfully completed the module:
                </p>
                <h3 className="text-xl font-semibold mb-6 text-blue-600">
                  {certificateModule.title}
                </h3>
                <p className="mb-8">
                  Click the button below to generate your certificate of completion.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleGenerateCertificate}>
              <FaDownload className="mr-2" />
              Generate Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <p>Loading training modules...</p>
        </div>
      ) : (
        <>
          {currentModule ? renderModuleContent() : renderModuleCatalog()}
          {renderCertificateModal()}
        </>
      )}
    </div>
  );
};

export default StaffTrainingModules;
