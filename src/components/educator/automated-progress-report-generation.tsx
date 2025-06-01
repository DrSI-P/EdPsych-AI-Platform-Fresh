'use client';

import React, { useState, useEffect } from 'react';
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
  BarChart, 
  BookOpen, 
  Clock, 
  Smile, 
  Award, 
  Target, 
  HelpCircle,
  Printer,
  Share2
} from 'lucide-react';

// Sample student data
const sampleStudents = [
  { id: 1, name: 'Emma Thompson', year: 8, class: '8A', subjects: ['English', 'Mathematics', 'Science', 'History', 'Art'] },
  { id: 2, name: 'James Wilson', year: 8, class: '8A', subjects: ['English', 'Mathematics', 'Science', 'Geography', 'Music'] },
  { id: 3, name: 'Olivia Davis', year: 8, class: '8A', subjects: ['English', 'Mathematics', 'Science', 'French', 'Physical Education'] },
  { id: 4, name: 'Noah Martin', year: 8, class: '8A', subjects: ['English', 'Mathematics', 'Science', 'Computer Science', 'Drama'] },
  { id: 5, name: 'Sophia Roberts', year: 8, class: '8A', subjects: ['English', 'Mathematics', 'Science', 'Religious Studies', 'Design Technology'] },
  { id: 6, name: 'William Brown', year: 7, class: '7B', subjects: ['English', 'Mathematics', 'Science', 'History', 'Art'] },
  { id: 7, name: 'Charlotte Taylor', year: 7, class: '7B', subjects: ['English', 'Mathematics', 'Science', 'Geography', 'Music'] },
  { id: 8, name: 'Ethan Johnson', year: 7, class: '7B', subjects: ['English', 'Mathematics', 'Science', 'French', 'Physical Education'] },
  { id: 9, name: 'Amelia White', year: 7, class: '7B', subjects: ['English', 'Mathematics', 'Science', 'Computer Science', 'Drama'] },
  { id: 10, name: 'Alexander Lee', year: 7, class: '7B', subjects: ['English', 'Mathematics', 'Science', 'Religious Studies', 'Design Technology'] },
];

// Sample assessment data
const sampleAssessmentData = {
  1: { // Emma Thompson
    English: { 
      currentScore: 78, 
      previousScore: 72, 
      classAverage: 74, 
      strengths: ['Creative writing', 'Reading comprehension'], 
      areasForDevelopment: ['Analytical writing', 'Grammar and punctuation'],
      effort: 'Good',
      attendance: 97,
      behaviour: 'Excellent',
      comments: 'Emma continues to show strong engagement in English lessons. Her creative writing is particularly impressive, with rich vocabulary and imaginative storylines. To progress further, Emma should focus on developing her analytical writing skills, particularly when responding to non-fiction texts.'
    },
    Mathematics: { 
      currentScore: 65, 
      previousScore: 61, 
      classAverage: 68, 
      strengths: ['Number operations', 'Data handling'], 
      areasForDevelopment: ['Algebra', 'Problem-solving'],
      effort: 'Satisfactory',
      attendance: 95,
      behaviour: 'Good',
      comments: 'Emma has made steady progress in Mathematics this term. She demonstrates good understanding of number operations and data handling. Emma would benefit from additional practise with algebraic concepts and applying mathematical knowledge to solve complex problems.'
    },
    Science: { 
      currentScore: 82, 
      previousScore: 79, 
      classAverage: 75, 
      strengths: ['Scientific investigation', 'Biology topics'], 
      areasForDevelopment: ['Physics concepts', 'Scientific vocabulary'],
      effort: 'Excellent',
      attendance: 98,
      behaviour: 'Excellent',
      comments: 'Emma shows genuine enthusiasm for Science, particularly in practical investigations and biology topics. She asks thoughtful questions and contributes well to class discussions. To enhance her understanding further, Emma should work on consolidating physics concepts and expanding her use of scientific vocabulary.'
    },
    History: { 
      currentScore: 74, 
      previousScore: 70, 
      classAverage: 72, 
      strengths: ['Historical knowledge', 'Source analysis'], 
      areasForDevelopment: ['Extended writing', 'Chronological understanding'],
      effort: 'Good',
      attendance: 96,
      behaviour: 'Good',
      comments: 'Emma demonstrates good historical knowledge and is developing her skills in analysing historical sources. Her contributions to class discussions show thoughtful engagement with the subject. To progress further, Emma should focus on structuring extended writing more effectively and developing a more secure chronological understanding of historical periods.'
    },
    Art: { 
      currentScore: 88, 
      previousScore: 85, 
      classAverage: 76, 
      strengths: ['Creativity', 'Drawing skills'], 
      areasForDevelopment: ['Art history knowledge', 'Critical analysis'],
      effort: 'Excellent',
      attendance: 100,
      behaviour: 'Excellent',
      comments: 'Emma shows exceptional talent in Art, with particularly strong drawing skills and creative approaches to projects. Her portfolio demonstrates a good range of techniques and thoughtful development of ideas. To enhance her work further, Emma should develop her knowledge of art history and practise analysing the work of other artists more critically.'
    }
  },
  // Additional student data would be included here
};

// Report template options
const reportTemplates = [
  { 
    id: 'end-of-term', 
    name: 'End of Term Report', 
    description: 'Comprehensive report covering all subjects and aspects of school life',
    sections: ['Academic Progress', 'Attendance and Punctuality', 'Behaviour and Attitude', 'Extra-Curricular Activities', 'Targets for Next Term']
  },
  { 
    id: 'mid-term', 
    name: 'Mid-Term Progress Update', 
    description: 'Brief update on progress since the last full report',
    sections: ['Current Attainment', 'Progress Towards Targets', 'Areas for Focus']
  },
  { 
    id: 'parent-evening', 
    name: 'Parent Evening Summary', 
    description: 'Summary report to support parent-teacher consultations',
    sections: ['Current Attainment', 'Strengths and Achievements', 'Areas for Development', 'Suggested Support Strategies']
  },
  { 
    id: 'subject-specific', 
    name: 'Subject Specific Report', 
    description: 'Detailed report focusing on a single subject area',
    sections: ['Attainment', 'Progress', 'Skills Development', 'Knowledge Acquisition', 'Next Steps']
  },
  { 
    id: 'sen', 
    name: 'Special Educational Needs Report', 
    description: 'Specialised report focusing on progress against IEP/504 targets',
    sections: ['Target Progress', 'Intervention Effectiveness', 'Social and Emotional Development', 'Recommended Adjustments']
  },
  { 
    id: 'custom', 
    name: 'Custom Report Template', 
    description: 'Create your own report structure',
    sections: ['Custom Section 1', 'Custom Section 2', 'Custom Section 3']
  }
];

export default function AutomatedProgressReportGeneration() {
  const { toast } = useToast();
  const aiService = useAIService();
  const [activeTab, setActiveTab] = useState('create');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [reportPeriod, setReportPeriod] = useState('current-term');
  const [includeAttendance, setIncludeAttendance] = useState(true);
  const [includeBehavior, setIncludeBehavior] = useState(true);
  const [includeGraphs, setIncludeGraphs] = useState(true);
  const [includeNextSteps, setIncludeNextSteps] = useState(true);
  const [commentStyle, setCommentStyle] = useState('balanced');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<any[]>([]);
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [currentReport, setCurrentReport] = useState<any>(null);
  const [editingReport, setEditingReport] = useState(false);
  const [editedComments, setEditedComments] = useState<Record<string, string>>({});
  
  // Load saved reports from localStorage on component mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedProgressReports');
      if (saved) {
        setSavedReports(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved reports:', error);
    }
  }, []);
  
  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
  };
  
  // Handle student selection
  const handleStudentSelection = (studentId: number) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };
  
  // Handle subject selection
  const handleSubjectSelection = (subject: string) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subject)) {
        return prev.filter(s => s !== subject);
      } else {
        return [...prev, subject];
      }
    });
  };
  
  // Select all students in a class
  const selectAllStudentsInClass = (className: string) => {
    const studentsInClass = sampleStudents.filter(student => student.class === className);
    const studentIds = studentsInClass.map(student => student.id);
    setSelectedStudents(studentIds);
  };
  
  // Select all subjects
  const selectAllSubjects = () => {
    const allSubjects = Array.from(new Set(sampleStudents.flatMap(student => student.subjects)));
    setSelectedSubjects(allSubjects);
  };
  
  // Clear all selections
  const clearSelections = () => {
    setSelectedStudents([]);
    setSelectedSubjects([]);
  };
  
  // Generate reports
  const generateReports = async () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "No students selected",
        description: "Please select at least one student to generate reports.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedSubjects.length === 0) {
      toast({
        title: "No subjects selected",
        description: "Please select at least one subject to include in the reports.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // In a real implementation, this would call the backend API
      // For now, we'll simulate report generation with a delay
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reports = selectedStudents.map(studentId => {
        const student = sampleStudents.find(s => s.id === studentId);
        if (!student) return null;
        
        const studentData = sampleAssessmentData[studentId as keyof typeof sampleAssessmentData] || {};
        const template = reportTemplates.find(t => t.id === selectedTemplate);
        
        // Filter subjects based on selection and available data
        const reportSubjects = selectedSubjects.filter(subject => 
          student.subjects.includes(subject) && studentData[subject as keyof typeof studentData]
        );
        
        // Generate report content
        const subjectReports = reportSubjects.map(subject => {
          const data = studentData[subject as keyof typeof studentData];
          if (!data) return null;
          
          // Calculate progress indicators
          const progress = data.currentScore - data.previousScore;
          const comparisonToAverage = data.currentScore - data.classAverage;
          
          // Generate AI-enhanced comments
          // In a real implementation, this would use the AI service
          const aiEnhancedComment = data.comments;
          
          return {
            subject,
            currentScore: data.currentScore,
            previousScore: data.previousScore,
            progress,
            classAverage: data.classAverage,
            comparisonToAverage,
            strengths: data.strengths,
            areasForDevelopment: data.areasForDevelopment,
            effort: data.effort,
            attendance: data.attendance,
            behaviour: data.behaviour,
            comments: aiEnhancedComment
          };
        }).filter(Boolean);
        
        // Generate overall summary
        // In a real implementation, this would use the AI service
        const overallComments = generateOverallComments(student, subjectReports as any[], commentStyle);
        
        // Generate next steps
        const nextSteps = includeNextSteps ? generateNextSteps(subjectReports as any[]) : [];
        
        return {
          id: Date.now() + studentId,
          student,
          template: template?.name || 'Custom Report',
          date: new Date().toISOString(),
          period: reportPeriod,
          subjects: subjectReports,
          overallComments,
          nextSteps,
          includeAttendance,
          includeBehavior,
          includeGraphs
        };
      }).filter(Boolean);
      
      setGeneratedReports(reports as any[]);
      setActiveTab('preview');
      
      toast({
        title: "Reports generated",
        description: `Successfully generated ${reports.length} student reports.`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error generating reports:', error);
      toast({
        title: "Error generating reports",
        description: "An error occurred while generating the reports. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Generate overall comments based on subject reports
  const generateOverallComments = (student: any, subjectReports: any[], style: string) => {
    // Calculate average scores and progress
    const averageCurrentScore = Math.round(
      subjectReports.reduce((sum, report) => sum + report.currentScore, 0) / subjectReports.length
    );
    
    const averageProgress = Math.round(
      subjectReports.reduce((sum, report) => sum + report.progress, 0) / subjectReports.length
    );
    
    // Count strengths in effort and behaviour
    const goodEffortCount = subjectReports.filter(report => 
      ['Good', 'Excellent'].includes(report.effort)
    ).length;
    
    const goodBehaviorCount = subjectReports.filter(report => 
      ['Good', 'Excellent'].includes(report.behaviour)
    ).length;
    
    const effortRatio = goodEffortCount / subjectReports.length;
    const behaviorRatio = goodBehaviorCount / subjectReports.length;
    
    // Generate comment based on style preference
    let comment = '';
    
    switch (style) {
      case 'positive':
        comment = `${student.name} has demonstrated ${averageProgress > 0 ? 'positive' : 'steady'} progress this term, with an average attainment of ${averageCurrentScore}%. `;
        comment += effortRatio > 0.7 ? `${student.name}'s effort has been consistently good across most subjects. ` : `${student.name} has shown good effort in some subject areas. `;
        comment += behaviorRatio > 0.7 ? `Behaviour has been exemplary throughout the term. ` : `Behaviour has been generally appropriate. `;
        comment += `${student.name} has particular strengths in ${subjectReports.sort((a, b) => b.currentScore - a.currentScore)[0].subject} and should be encouraged to continue developing these skills.`;
        break;
        
      case 'constructive':
        comment = `${student.name} has achieved an average attainment of ${averageCurrentScore}%, which represents ${averageProgress > 0 ? 'an improvement of ' + averageProgress + '% from the previous assessment' : 'a consistent performance compared to previous assessments'}. `;
        comment += `There are clear areas for development in ${subjectReports.sort((a, b) => a.currentScore - b.currentScore)[0].subject}, where focused attention would be beneficial. `;
        comment += effortRatio < 0.7 ? `Increased effort across all subjects would help to improve overall attainment. ` : `The good effort shown in most subjects should be maintained. `;
        comment += `Setting specific targets in each subject area will help ${student.name} to make further progress next term.`;
        break;
        
      case 'balanced':
      default:
        comment = `${student.name} has achieved an average attainment of ${averageCurrentScore}%, which represents ${averageProgress > 0 ? 'a positive improvement of ' + averageProgress + '%' : 'a consistent performance'} compared to previous assessments. `;
        comment += `Particular strengths are evident in ${subjectReports.sort((a, b) => b.currentScore - a.currentScore)[0].subject}, while ${subjectReports.sort((a, b) => a.currentScore - b.currentScore)[0].subject} presents opportunities for further development. `;
        comment += effortRatio > 0.7 ? `${student.name}'s consistent effort across most subjects is commendable. ` : `Increasing effort in some subject areas would help to improve overall attainment. `;
        comment += behaviorRatio > 0.7 ? `Behaviour has been positive throughout the term. ` : `Some improvements in classroom behaviour would enhance learning experiences. `;
        comment += `With continued focus and appropriate support, ${student.name} should continue to make good progress.`;
        break;
    }
    
    return comment;
  };
  
  // Generate next steps based on subject reports
  const generateNextSteps = (subjectReports: any[]) => {
    const nextSteps = [];
    
    // Find lowest performing subject
    const lowestSubject = subjectReports.sort((a, b) => a.currentScore - b.currentScore)[0];
    if (lowestSubject) {
      nextSteps.push(`Focus on improving ${lowestSubject.subject} skills, particularly in areas of ${lowestSubject.areasForDevelopment.join(' and ')}.`);
    }
    
    // Find subject with most progress
    const mostProgressSubject = subjectReports.sort((a, b) => b.progress - a.progress)[0];
    if (mostProgressSubject && mostProgressSubject.progress > 0) {
      nextSteps.push(`Continue the excellent progress in ${mostProgressSubject.subject} by building on strengths in ${mostProgressSubject.strengths.join(' and ')}.`);
    }
    
    // General recommendations
    nextSteps.push('Develop independent study skills through regular revision and self-assessment.');
    nextSteps.push('Actively participate in class discussions to deepen understanding of key concepts.');
    
    return nextSteps;
  };
  
  // View a specific report
  const viewReport = (reportId: string | number) => {
    const report = [...generatedReports, ...savedReports].find(r => r.id === reportId);
    if (report) {
      setCurrentReport(report);
      setEditingReport(false);
      setActiveTab('view');
    }
  };
  
  // Edit a report
  const editReport = () => {
    if (!currentReport) return;
    
    // Initialize edited comments with current comments
    const initialComments = {};
    currentReport.subjects.forEach((subject: any) => {
      initialComments[subject.subject] = subject.comments;
    });
    initialComments['overall'] = currentReport.overallComments;
    
    setEditedComments(initialComments);
    setEditingReport(true);
  };
  
  // Save edited report
  const saveEditedReport = () => {
    if (!currentReport) return;
    
    // Update subject comments
    const updatedSubjects = currentReport.subjects.map((subject: any) => ({
      ...subject,
      comments: editedComments[subject.subject] || subject.comments
    }));
    
    // Create updated report
    const updatedReport = {
      ...currentReport,
      subjects: updatedSubjects,
      overallComments: editedComments['overall'] || currentReport.overallComments,
      lastEdited: new Date().toISOString()
    };
    
    // Update in generated reports if it exists there
    const genIndex = generatedReports.findIndex(r => r.id === currentReport.id);
    if (genIndex >= 0) {
      const updatedGenReports = [...generatedReports];
      updatedGenReports[genIndex] = updatedReport;
      setGeneratedReports(updatedGenReports);
    }
    
    // Update in saved reports if it exists there
    const savedIndex = savedReports.findIndex(r => r.id === currentReport.id);
    if (savedIndex >= 0) {
      const updatedSavedReports = [...savedReports];
      updatedSavedReports[savedIndex] = updatedReport;
      setSavedReports(updatedSavedReports);
      
      // Update localStorage
      localStorage.setItem('savedProgressReports', JSON.stringify(updatedSavedReports));
    }
    
    setCurrentReport(updatedReport);
    setEditingReport(false);
    
    toast({
      title: "Report updated",
      description: "Your changes to the report have been saved.",
      variant: "default"
    });
  };
  
  // Save report to localStorage
  const saveReport = (report: any) => {
    const updatedSavedReports = [...savedReports, { ...report, savedAt: new Date().toISOString() }];
    setSavedReports(updatedSavedReports);
    
    // Update localStorage
    localStorage.setItem('savedProgressReports', JSON.stringify(updatedSavedReports));
    
    toast({
      title: "Report saved",
      description: "The report has been saved to your local storage.",
      variant: "default"
    });
  };
  
  // Delete report
  const deleteReport = (reportId: string | number, isSaved: boolean) => {
    if (isSaved) {
      const updatedSavedReports = savedReports.filter(r => r.id !== reportId);
      setSavedReports(updatedSavedReports);
      
      // Update localStorage
      localStorage.setItem('savedProgressReports', JSON.stringify(updatedSavedReports));
    } else {
      setGeneratedReports(generatedReports.filter(r => r.id !== reportId));
    }
    
    // If viewing the deleted report, go back to list
    if (currentReport && currentReport.id === reportId) {
      setCurrentReport(null);
      setActiveTab(isSaved ? 'saved' : 'preview');
    }
    
    toast({
      title: "Report deleted",
      description: "The report has been deleted.",
      variant: "default"
    });
  };
  
  // Export report as PDF
  const exportReportAsPDF = () => {
    if (!currentReport) return;
    
    // In a real implementation, this would generate a PDF
    // For now, we'll just show a toast
    toast({
      title: "Export initiated",
      description: "The report is being exported as PDF. It will download automatically when ready.",
      variant: "default"
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "The report has been exported as PDF and downloaded.",
        variant: "default"
      });
    }, 2000);
  };
  
  // Print report
  const printReport = () => {
    if (!currentReport) return;
    
    // In a real implementation, this would open the print dialog
    // For now, we'll just show a toast
    toast({
      title: "Print dialog",
      description: "The print dialog would normally open here.",
      variant: "default"
    });
  };
  
  // Share report
  const shareReport = () => {
    if (!currentReport) return;
    
    // In a real implementation, this would open sharing options
    // For now, we'll just show a toast
    toast({
      title: "Share options",
      description: "Sharing options would normally appear here.",
      variant: "default"
    });
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Progress Report Generator</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Create detailed student progress reports with AI assistance
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid grid-cols-3 md:grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="create" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Create Reports
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            Generated Reports
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center">
            <Save className="mr-2 h-4 w-4" />
            Saved Reports
          </TabsTrigger>
          <TabsTrigger value="view" className="flex items-center md:hidden">
            <BookOpen className="mr-2 h-4 w-4" />
            View Report
          </TabsTrigger>
        </TabsList>
        
        {/* Create Reports Tab */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Report Template Selection */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Report Template
                </CardTitle>
                <CardDescription>
                  Select the type of report you want to generate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {reportTemplates.map(template => (
                    <div 
                      key={template.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedTemplate === template.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                      onClick={() => handleTemplateChange(template.id)}
                    >
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">{template.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Student Selection */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Select Students
                </CardTitle>
                <CardDescription>
                  Choose the students to generate reports for
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => selectAllStudentsInClass('8A')}
                  >
                    Select 8A
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => selectAllStudentsInClass('7B')}
                  >
                    Select 7B
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearSelections}
                  >
                    Clear All
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {sampleStudents.map(student => (
                    <div 
                      key={student.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox 
                        id={`student-${student.id}`}
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() => handleStudentSelection(student.id)}
                      />
                      <Label 
                        htmlFor={`student-${student.id}`}
                        className="flex flex-1 items-center justify-between cursor-pointer"
                      >
                        <span>{student.name}</span>
                        <Badge variant="outline">{student.class}</Badge>
                      </Label>
                    </div>
                  ))}
                </div>
                
                <div className="text-sm text-muted-foreground mt-2">
                  {selectedStudents.length} students selected
                </div>
              </CardContent>
            </Card>
            
            {/* Subject Selection */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Select Subjects
                </CardTitle>
                <CardDescription>
                  Choose the subjects to include in the reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={selectAllSubjects}
                  >
                    Select All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedSubjects([])}
                  >
                    Clear All
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {Array.from(new Set(sampleStudents.flatMap(student => student.subjects))).map(subject => (
                    <div 
                      key={subject}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox 
                        id={`subject-${subject}`}
                        checked={selectedSubjects.includes(subject)}
                        onCheckedChange={() => handleSubjectSelection(subject)}
                      />
                      <Label 
                        htmlFor={`subject-${subject}`}
                        className="cursor-pointer"
                      >
                        {subject}
                      </Label>
                    </div>
                  ))}
                </div>
                
                <div className="text-sm text-muted-foreground mt-2">
                  {selectedSubjects.length} subjects selected
                </div>
              </CardContent>
            </Card>
            
            {/* Report Options */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Report Options
                </CardTitle>
                <CardDescription>
                  Customize the content and style of your reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Report Period */}
                  <div className="space-y-2">
                    <Label htmlFor="report-period">Report Period</Label>
                    <Select value={reportPeriod} onValueChange={setReportPeriod}>
                      <SelectTrigger id="report-period">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current-term">Current Term</SelectItem>
                        <SelectItem value="previous-term">Previous Term</SelectItem>
                        <SelectItem value="full-year">Full Academic Year</SelectItem>
                        <SelectItem value="custom">Custom Period</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Comment Style */}
                  <div className="space-y-2">
                    <Label>Comment Style</Label>
                    <RadioGroup value={commentStyle} onValueChange={setCommentStyle}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="balanced" id="balanced" />
                        <Label htmlFor="balanced">Balanced</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="positive" id="positive" />
                        <Label htmlFor="positive">Positive Focus</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="constructive" id="constructive" />
                        <Label htmlFor="constructive">Constructive Focus</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Include Options */}
                  <div className="space-y-2">
                    <Label>Include in Report</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="include-attendance" 
                          checked={includeAttendance}
                          onCheckedChange={(checked) => setIncludeAttendance(!!checked)}
                        />
                        <Label htmlFor="include-attendance">Attendance Data</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="include-behavior" 
                          checked={includeBehavior}
                          onCheckedChange={(checked) => setIncludeBehavior(!!checked)}
                        />
                        <Label htmlFor="include-behavior">Behavior Information</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="include-graphs" 
                          checked={includeGraphs}
                          onCheckedChange={(checked) => setIncludeGraphs(!!checked)}
                        />
                        <Label htmlFor="include-graphs">Visual Progress Graphs</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="include-next-steps" 
                          checked={includeNextSteps}
                          onCheckedChange={(checked) => setIncludeNextSteps(!!checked)}
                        />
                        <Label htmlFor="include-next-steps">Next Steps/Targets</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={clearSelections}>
                  Reset All
                </Button>
                <Button 
                  onClick={generateReports}
                  disabled={isGenerating || selectedStudents.length === 0 || selectedSubjects.length === 0 || !selectedTemplate}
                >
                  {isGenerating ? (
                    <>Generating Reports...</>
                  ) : (
                    <>
                      Generate Reports
                      <FileText className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Generated Reports Tab */}
        <TabsContent value="preview" className="space-y-6">
          {generatedReports.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold">No Reports Generated</h3>
              <p className="mt-2 text-muted-foreground">
                Generate reports using the Create Reports tab to see them here.
              </p>
              <Button className="mt-6" onClick={() => setActiveTab('create')}>
                Create Reports
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedReports.map(report => (
                <Card key={report.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle>{report.student.name}</CardTitle>
                    <CardDescription>
                      {report.template} • {new Date(report.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Class:</span>
                        <span className="font-medium">{report.student.class}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Subjects:</span>
                        <span className="font-medium">{report.subjects.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Average Score:</span>
                        <span className="font-medium">
                          {Math.round(report.subjects.reduce((sum: number, s: any) => sum + s.currentScore, 0) / report.subjects.length)}%
                        </span>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {report.overallComments}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteReport(report.id, false)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => saveReport(report)}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => viewReport(report.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Saved Reports Tab */}
        <TabsContent value="saved" className="space-y-6">
          {savedReports.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Save className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold">No Saved Reports</h3>
              <p className="mt-2 text-muted-foreground">
                Save generated reports to access them here later.
              </p>
              <Button className="mt-6" onClick={() => setActiveTab('preview')}>
                View Generated Reports
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedReports.map(report => (
                <Card key={report.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle>{report.student.name}</CardTitle>
                    <CardDescription>
                      {report.template} • {new Date(report.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Class:</span>
                        <span className="font-medium">{report.student.class}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Subjects:</span>
                        <span className="font-medium">{report.subjects.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Average Score:</span>
                        <span className="font-medium">
                          {Math.round(report.subjects.reduce((sum: number, s: any) => sum + s.currentScore, 0) / report.subjects.length)}%
                        </span>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {report.overallComments}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteReport(report.id, true)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => viewReport(report.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* View Report Tab */}
        <TabsContent value="view" className="space-y-6">
          {!currentReport ? (
            <Card className="p-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold">No Report Selected</h3>
              <p className="mt-2 text-muted-foreground">
                Select a report to view its details.
              </p>
              <div className="flex justify-center space-x-4 mt-6">
                <Button onClick={() => setActiveTab('preview')}>
                  Generated Reports
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('saved')}>
                  Saved Reports
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Report Header */}
              <Card className="lg:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{currentReport.student.name} - {currentReport.template}</CardTitle>
                    <CardDescription>
                      Generated on {new Date(currentReport.date).toLocaleDateString()} • Class {currentReport.student.class}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {!editingReport ? (
                      <>
                        <Button variant="outline" size="sm" onClick={shareReport}>
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm" onClick={printReport}>
                          <Printer className="h-4 w-4 mr-1" />
                          Print
                        </Button>
                        <Button variant="outline" size="sm" onClick={exportReportAsPDF}>
                          <Download className="h-4 w-4 mr-1" />
                          Export PDF
                        </Button>
                        <Button variant="default" size="sm" onClick={editReport}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" onClick={() => setEditingReport(false)}>
                          Cancel
                        </Button>
                        <Button variant="default" size="sm" onClick={saveEditedReport}>
                          <Save className="h-4 w-4 mr-1" />
                          Save Changes
                        </Button>
                      </>
                    )}
                  </div>
                </CardHeader>
              </Card>
              
              {/* Overall Summary */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="mr-2 h-5 w-5" />
                    Overall Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!editingReport ? (
                    <p>{currentReport.overallComments}</p>
                  ) : (
                    <Textarea 
                      value={editedComments['overall'] || currentReport.overallComments}
                      onChange={(e) => setEditedComments({...editedComments, overall: e.target.value})}
                      className="min-h-[150px]"
                    />
                  )}
                </CardContent>
              </Card>
              
              {/* Subject Reports */}
              {currentReport.subjects.map((subject: any) => (
                <Card key={subject.subject}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{subject.subject}</span>
                      <Badge className={subject.progress > 0 ? 'bg-green-500' : subject.progress < 0 ? 'bg-red-500' : 'bg-yellow-500'}>
                        {subject.progress > 0 ? '+' : ''}{subject.progress}%
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Current Score: {subject.currentScore}% (Class Average: {subject.classAverage}%)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Strengths</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {subject.strengths.map((strength: string) => (
                            <li key={strength}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Areas for Development</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {subject.areasForDevelopment.map((area: string) => (
                            <li key={area}>{area}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Teacher Comments</h4>
                      {!editingReport ? (
                        <p className="text-sm">{subject.comments}</p>
                      ) : (
                        <Textarea 
                          value={editedComments[subject.subject] || subject.comments}
                          onChange={(e) => setEditedComments({...editedComments, [subject.subject]: e.target.value})}
                          className="min-h-[100px]"
                        />
                      )}
                    </div>
                    
                    {currentReport.includeAttendance && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Attendance:</span>
                        <Badge variant="outline">{subject.attendance}%</Badge>
                      </div>
                    )}
                    
                    {currentReport.includeBehavior && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Behaviour:</span>
                        <Badge variant="outline">{subject.behaviour}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {/* Next Steps */}
              {currentReport.includeNextSteps && currentReport.nextSteps.length > 0 && (
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="mr-2 h-5 w-5" />
                      Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {currentReport.nextSteps.map((step: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
