'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAIService } from '@/lib/ai/ai-service';
import { Mic, MicOff, Save, Copy, Download, FileText, Upload, RefreshCw } from 'lucide-react';

interface DocumentationTemplate {
  id: string;
  name: string;
  description: string;
  sections: {
    id: string;
    name: string;
    description: string;
    placeholder: string;
  }[];
}

const documentationTemplates: any[] = [
  {
    id: 'classroom-observation',
    name: 'Classroom Observation',
    description: 'Document student behaviors, interactions, and learning moments during class',
    sections: [
      {
        id: 'context',
        name: 'Context',
        description: 'Class details, time, subject, and activity',
        placeholder: 'Year 4 Mathematics, Tuesday 10:30-11:30, Fractions lesson with group activities'
      },
      {
        id: 'observations',
        name: 'Observations',
        description: 'Detailed notes about what happened during the session',
        placeholder: 'Record specific behaviors, interactions, questions asked, etc.'
      },
      {
        id: 'student-engagement',
        name: 'Student Engagement',
        description: 'Notes on student participation and engagement levels',
        placeholder: 'Which students were engaged? Who needed support? Any notable interactions?'
      },
      {
        id: 'learning-evidence',
        name: 'Learning Evidence',
        description: 'Evidence of student understanding or misconceptions',
        placeholder: 'Examples of student work, verbal responses, or demonstrations of understanding'
      },
      {
        id: 'next-steps',
        name: 'Next Steps',
        description: 'Follow-up actions based on the observations',
        placeholder: 'Interventions needed, adjustments to teaching, students requiring additional support'
      }
    ]
  },
  {
    id: 'student-conference',
    name: 'Student Conference',
    description: 'Document one-on-one meetings with students about their progress',
    sections: [
      {
        id: 'student-info',
        name: 'Student Information',
        description: 'Student name, year group, date and purpose of meeting',
        placeholder: 'Emma Thompson, Year 8, 15 May 2025, Discussing recent English assessment'
      },
      {
        id: 'discussion-points',
        name: 'Discussion Points',
        description: 'Main topics discussed during the conference',
        placeholder: 'Current progress, recent assessment results, goals, challenges'
      },
      {
        id: 'student-perspective',
        name: 'Student Perspective',
        description: 'Student\'s thoughts, feelings, and self-assessment',
        placeholder: 'How does the student feel about their progress? What challenges do they identify?'
      },
      {
        id: 'agreed-goals',
        name: 'Agreed Goals',
        description: 'Goals and targets set during the conference',
        placeholder: 'Specific, measurable goals agreed upon with timeframes'
      },
      {
        id: 'support-strategies',
        name: 'Support Strategies',
        description: 'Strategies to help the student achieve their goals',
        placeholder: 'Resources, interventions, accommodations, or support to be provided'
      },
      {
        id: 'follow-up',
        name: 'Follow-up Plan',
        description: 'When and how progress will be reviewed',
        placeholder: 'Date for follow-up meeting, check-in points, assessment plans'
      }
    ]
  },
  {
    id: 'behaviour-incident',
    name: 'Behaviour Incident',
    description: 'Document behavioural incidents for record-keeping and pattern identification',
    sections: [
      {
        id: 'incident-details',
        name: 'Incident Details',
        description: 'Date, time, location, and students involved',
        placeholder: '15 May 2025, 10:15am, Playground, Students: [names]'
      },
      {
        id: 'description',
        name: 'Description',
        description: 'Factual description of what happened',
        placeholder: 'Detailed account of the incident without judgment or interpretation'
      },
      {
        id: 'antecedent',
        name: 'Antecedent',
        description: 'What happened before the incident',
        placeholder: 'Events, triggers, or circumstances leading up to the incident'
      },
      {
        id: 'response',
        name: 'Response',
        description: 'How the situation was handled',
        placeholder: 'Actions taken, interventions, restorative practices used'
      },
      {
        id: 'outcome',
        name: 'Outcome',
        description: 'Resolution and immediate consequences',
        placeholder: 'How the situation was resolved, any consequences applied'
      },
      {
        id: 'follow-up',
        name: 'Follow-up Actions',
        description: 'Next steps and preventative measures',
        placeholder: 'Support plans, parent contact, monitoring arrangements'
      }
    ]
  },
  {
    id: 'parent-meeting',
    name: 'Parent/Guardian Meeting',
    description: 'Document discussions with parents or guardians',
    sections: [
      {
        id: 'meeting-details',
        name: 'Meeting Details',
        description: 'Date, time, attendees, and purpose',
        placeholder: '15 May 2025, 16:00-16:30, Mr. & Mrs. Thompson (Emma\'s parents), Class teacher'
      },
      {
        id: 'discussion-points',
        name: 'Discussion Points',
        description: 'Main topics discussed during the meeting',
        placeholder: 'Academic progress, behaviour, social development, concerns raised'
      },
      {
        id: 'parent-perspective',
        name: 'Parent/Guardian Perspective',
        description: 'Views, concerns, and information shared by parents',
        placeholder: 'Concerns, observations from home, relevant family circumstances'
      },
      {
        id: 'school-perspective',
        name: 'School Perspective',
        description: 'Information and perspectives shared by school staff',
        placeholder: 'Academic data, classroom observations, social interactions'
      },
      {
        id: 'agreed-actions',
        name: 'Agreed Actions',
        description: 'Actions agreed by all parties',
        placeholder: 'Support strategies, interventions, home-school coordination'
      },
      {
        id: 'follow-up',
        name: 'Follow-up Plan',
        description: 'How and when progress will be communicated',
        placeholder: 'Next meeting date, communication method, review timeline'
      }
    ]
  },
  {
    id: 'lesson-reflection',
    name: 'Lesson Reflection',
    description: 'Reflect on lesson effectiveness and student learning',
    sections: [
      {
        id: 'lesson-details',
        name: 'Lesson Details',
        description: 'Class, subject, topic, and objectives',
        placeholder: 'Year 7 Science, States of Matter, Understanding particle arrangement in solids, liquids, and gases'
      },
      {
        id: 'what-went-well',
        name: 'What Went Well',
        description: 'Successful aspects of the lesson',
        placeholder: 'Activities that engaged students, effective explanations, learning achievements'
      },
      {
        id: 'challenges',
        name: 'Challenges',
        description: 'Difficulties or unexpected issues',
        placeholder: 'Misconceptions, timing issues, resource problems, behaviour management'
      },
      {
        id: 'student-learning',
        name: 'Student Learning',
        description: 'Evidence of student understanding or confusion',
        placeholder: 'Assessment results, work samples, verbal responses, observations'
      },
      {
        id: 'differentiation-effectiveness',
        name: 'Differentiation Effectiveness',
        description: 'How well differentiation strategies worked',
        placeholder: 'Effectiveness of support for different learners, extension activities'
      },
      {
        id: 'adjustments',
        name: 'Future Adjustments',
        description: 'Changes for next time',
        placeholder: 'Modifications to activities, pacing, resources, or approaches'
      }
    ]
  },
  {
    id: 'custom',
    name: 'Custom Documentation',
    description: 'Create your own documentation structure',
    sections: [
      {
        id: 'title',
        name: 'Title',
        description: 'Title of your documentation',
        placeholder: 'Enter a descriptive title'
      },
      {
        id: 'content',
        name: 'Content',
        description: 'Main content of your documentation',
        placeholder: 'Enter your documentation content here'
      }
    ]
  }
];

export default function AutomatedDocumentation() {
  const { toast } = useToast();
  const aiService = useAIService();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentationTemplate | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [sectionContent, setSectionContent] = useState<Record<string, string>>({});
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [savedDocuments, setSavedDocuments] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSection, setRecordingSection] = useState('');
  const [transcription, setTranscription] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Reference for MediaRecorder
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Initialize saved documents from localStorage
  useEffect(() => {
    const loadSavedDocuments = () => {
      try {
        const saved = localStorage.getItem('automatedDocuments');
        if (saved) {
          setSavedDocuments(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading saved documents:', error);
      }
    };
    
    loadSavedDocuments();
  }, []);
  
  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = documentationTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      // Initialize section content with empty strings
      const initialContent: Record<string, string> = {};
      template.sections.forEach(section => {
        initialContent[section.id] = '';
      });
      setSectionContent(initialContent);
      setDocumentTitle(template.name);
    }
  };
  
  // Handle section content change
  const handleSectionChange = (sectionId: string, content: string) => {
    setSectionContent(prev => ({
      ...prev,
      [sectionId]: content
    }));
  };
  
  // Start voice recording for a section
  const startRecording = async (sectionId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // In a real implementation, this would send the audio to a speech-to-text service
        // For now, we'll simulate a transcription after a delay
        setIsProcessing(true);
        setTimeout(() => {
          // Simulate transcription based on section
          const simulatedTranscriptions: Record<string, string> = {
            'context': 'Year 4 Mathematics class on Tuesday from 10:30 to 11:30. The lesson focused on fractions with students working in small groups to solve fraction problems using manipulatives.',
            'observations': 'Students were engaged in the group activities. Most groups collaborated well, with students taking turns to explain their thinking. There was some confusion in Group 3 about equivalent fractions, which required additional support.',
            'student-engagement': 'Overall engagement was high. Emma and James were particularly active in discussions. Michael was initially reluctant to participate but became more involved after receiving one-on-one support. Three students in the back (Sam, Olivia, and Noah) were occasionally off-task.',
            'learning-evidence': 'Most students demonstrated understanding of basic fraction concepts. Group 1 successfully completed all extension tasks. Group 3 struggled with equivalent fractions but improved after targeted support. Work samples collected show varying levels of mastery.',
            'next-steps': 'Plan additional activities on equivalent fractions for next lesson. Provide extra support for Group 3. Create extension activities for Group 1. Rearrange seating to better support off-task students.',
            'student-info': 'Emma Thompson, Year 8, meeting held on 15 May 2025 to discuss recent English assessment results and set goals for the upcoming term.',
            'discussion-points': 'We discussed Emma\'s recent English assessment where she scored 78%. We reviewed her strengths in creative writing and areas for improvement in analytical responses. Emma expressed interest in developing her essay writing skills.',
            'student-perspective': 'Emma feels confident about her creative writing but acknowledges she struggles with analysing texts in depth. She mentioned feeling rushed during timed assessments and would like strategies to manage her time better.',
            'agreed-goals': '1. Improve analytical writing skills by practicing one analytical paragraph per week. 2. Develop time management strategies for assessments. 3. Read at least one book from the recommended literature list by the end of term.',
            'support-strategies': 'Provide Emma with analytical writing frameworks. Schedule a 10-minute check-in every two weeks. Share time management techniques for exams. Recommend specific books based on her interests.',
            'follow-up': 'Schedule follow-up meeting for June 12th to review progress. Weekly quick checks on analytical writing samples. Email parents with update on goals and support strategies.',
          };
          
          const transcription = simulatedTranscriptions[sectionId] || 
            `This is a simulated transcription for the ${sectionId} section. In a real implementation, this would be the text converted from your audio recording.`;
          
          setTranscription(transcription);
          handleSectionChange(sectionId, transcription);
          setIsProcessing(false);
        }, 2000);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSection(sectionId);
      
      // Start timer
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingInterval(interval);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  
  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop timer
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
        setRecordingTime(0);
      }
    }
  };
  
  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Generate document from sections
  const generateDocument = async () => {
    if (!selectedTemplate) return;
    
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would use the AI service to generate a coherent document
      // For now, we'll simulate it by combining the sections
      
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let document = `# ${documentTitle}\n\n`;
      
      selectedTemplate.sections.forEach(section => {
        const content = sectionContent[section.id] || '';
        if (content) {
          document += `## ${section.name}\n\n${content}\n\n`;
        }
      });
      
      setGeneratedDocument(document);
      setActiveTab('preview');
      
      toast({
        title: "Document Generated",
        description: "Your documentation has been successfully generated.",
      });
    } catch (error) {
      toast({
        title: "Generation Error",
        description: "An error occurred while generating your document.",
        variant: "destructive"
      });
      console.error('Error generating document:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Save document
  const saveDocument = () => {
    if (!generatedDocument || !documentTitle) return;
    
    try {
      const newDocument = {
        id: Date.now().toString(),
        title: documentTitle,
        content: generatedDocument,
        createdAt: new Date().toISOString(),
        templateId: selectedTemplate?.id || 'custom'
      };
      
      const updatedDocuments = [...savedDocuments, newDocument];
      setSavedDocuments(updatedDocuments);
      
      // Save to localStorage
      localStorage.setItem('automatedDocuments', JSON.stringify(updatedDocuments));
      
      toast({
        title: "Document Saved",
        description: "Your documentation has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Error",
        description: "An error occurred while saving your document.",
        variant: "destructive"
      });
      console.error('Error saving document:', error);
    }
  };
  
  // Copy document to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDocument)
      .then(() => {
        toast({
          title: "Copied to Clipboard",
          description: "Document content copied to clipboard.",
        });
      })
      .catch(err => {
        toast({
          title: "Copy Failed",
          description: "Failed to copy content to clipboard.",
          variant: "destructive"
        });
        console.error('Error copying to clipboard:', err);
      });
  };
  
  // Download document as markdown
  const downloadDocument = () => {
    const blob = new Blob([generatedDocument], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Delete saved document
  const deleteDocument = (id: string) => {
    const updatedDocuments = savedDocuments.filter(doc => doc.id !== id);
    setSavedDocuments(updatedDocuments);
    localStorage.setItem('automatedDocuments', JSON.stringify(updatedDocuments));
    
    toast({
      title: "Document Deleted",
      description: "The document has been deleted.",
    });
  };
  
  // Load saved document
  const loadDocument = (doc) => {
    setDocumentTitle(doc.title);
    setGeneratedDocument(doc.content);
    setActiveTab('preview');
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Automated Documentation</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="saved">Saved Documents</TabsTrigger>
        </TabsList>
        
        {/* Create Tab */}
        <TabsContent value="create" className="space-y-6">
          {!selectedTemplate ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documentationTemplates.map(template => (
                <Card 
                  key={template.id} 
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardHeader>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {template.sections.length} sections
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="secondary" className="w-full">
                      Select Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold">{selectedTemplate.name}</h2>
                  <p className="text-muted-foreground">{selectedTemplate.description}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedTemplate(null)}
                >
                  Change Template
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="document-title">Document Title</Label>
                <Input 
                  id="document-title" 
                  value={documentTitle} 
                  onChange={e => setDocumentTitle(e.target.value)} 
                  placeholder="Enter a title for your document"
                />
              </div>
              
              <Separator />
              
              {selectedTemplate.sections.map(section => (
                <div key={section.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`section-${section.id}`} className="text-lg font-medium">
                      {section.name}
                    </Label>
                    <div className="flex items-center space-x-2">
                      {isRecording && recordingSection === section.id ? (
                        <div className="flex items-center space-x-2">
                          <Badge variant="destructive" className="animate-pulse">
                            Recording {formatTime(recordingTime)}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={stopRecording}
                            disabled={isProcessing}
                          >
                            <MicOff className="h-4 w-4 mr-2" />
                            Stop
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => startRecording(section.id)}
                          disabled={isRecording || isProcessing}
                        >
                          <Mic className="h-4 w-4 mr-2" />
                          Record
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                  <Textarea 
                    id={`section-${section.id}`} 
                    value={sectionContent[section.id] || ''} 
                    onChange={e => handleSectionChange(section.id, e.target.value)} 
                    placeholder={section.placeholder}
                    rows={6}
                    className="min-h-[150px]"
                  />
                </div>
              ))}
              
              <div className="flex justify-end">
                <Button 
                  onClick={generateDocument} 
                  disabled={isProcessing || Object.values(sectionContent).every(content => !content)}
                >
                  {isProcessing && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Document
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          {generatedDocument ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{documentTitle}</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadDocument}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" onClick={saveDocument}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none dark:prose-invert">
                    {/* In a real implementation, this would use a markdown renderer */}
                    <pre className="whitespace-pre-wrap font-sans">{generatedDocument}</pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Document Generated</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Create a document using one of our templates or load a saved document to preview it here.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setActiveTab('create')}
              >
                Create Document
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Saved Documents Tab */}
        <TabsContent value="saved" className="space-y-6">
          {savedDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedDocuments.map(doc => (
                <Card key={doc.id}>
                  <CardHeader>
                    <CardTitle className="truncate">{doc.title}</CardTitle>
                    <CardDescription>
                      {new Date(doc.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {doc.content.substring(0, 150)}...
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => loadDocument(doc)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => deleteDocument(doc.id)}>
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Saved Documents</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                You haven't saved any documents yet. Create and save a document to see it here.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setActiveTab('create')}
              >
                Create Document
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
