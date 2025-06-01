'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input, Textarea, Select, Checkbox } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { useToast } from '@/components/ui/toast';
import { AIPrompt } from '@/components/ai/ai-prompt';

interface Assessment {
  id: string;
  title: string;
  description: string;
  subject: string;
  ageRange: string;
  curriculum: string;
  duration: string;
  questions: {
    id: string;
    type: 'multiple_choice' | 'short_answer' | 'essay' | 'matching' | 'true_false';
    text: string;
    options?: string[];
    correctAnswer?: string | string[];
    points: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface AssessmentModuleProps {
  initialAssessments?: Assessment[];
  onAssessmentSelect?: (assessment: Assessment) => void;
  className?: string;
}

export function AssessmentModule({
  initialAssessments = [],
  onAssessmentSelect,
  className = ''
}: AssessmentModuleProps) {
  const { showToast } = useToast();
  const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedAgeRange, setSelectedAgeRange] = useState('all');
  
  // Fetch assessments on component mount
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        // In a real application, this would fetch from an API
        // For now, we'll use the initialAssessments or mock data
        if (initialAssessments.length > 0) {
          setAssessments(initialAssessments);
          setLoading(false);
          return;
        }
        
        // Mock data for demonstration
        const mockAssessments: Assessment[] = [
          {
            id: '1',
            title: 'Year 8 Algebra Assessment',
            description: 'End of unit assessment covering algebraic expressions, equations, and problem-solving.',
            subject: 'mathematics',
            ageRange: 'secondary',
            curriculum: 'UK National Curriculum',
            duration: '45 minutes',
            questions: [
              {
                id: '1-1',
                type: 'multiple_choice',
                text: 'Simplify the expression: 3x + 2y - x + 5y',
                options: ['2x + 7y', '4x + 7y', '2x + 3y', '3x + 7y'],
                correctAnswer: '2x + 7y',
                points: 1
              },
              {
                id: '1-2',
                type: 'multiple_choice',
                text: 'Solve for x: 2x + 5 = 15',
                options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 5.5'],
                correctAnswer: 'x = 5',
                points: 1
              },
              {
                id: '1-3',
                type: 'short_answer',
                text: 'Factorise the expression: x² - 9',
                correctAnswer: '(x+3)(x-3)',
                points: 2
              },
              {
                id: '1-4',
                type: 'short_answer',
                text: 'Solve the equation: 3(x - 2) = 18',
                correctAnswer: 'x = 8',
                points: 2
              },
              {
                id: '1-5',
                type: 'essay',
                text: 'A rectangle has a length that is 5 cm more than its width. If the perimeter of the rectangle is 42 cm, find the dimensions of the rectangle. Show all your working.',
                points: 4
              }
            ],
            createdAt: '2025-01-15T10:00:00Z',
            updatedAt: '2025-01-15T10:00:00Z'
          },
          {
            id: '2',
            title: 'Year 6 Reading Comprehension',
            description: 'Assessment of reading comprehension skills using a fiction text.',
            subject: 'english',
            ageRange: 'primary',
            curriculum: 'UK National Curriculum',
            duration: '30 minutes',
            questions: [
              {
                id: '2-1',
                type: 'multiple_choice',
                text: 'What is the main character\'s name in the story?',
                options: ['Emma', 'Sarah', 'Lucy', 'Olivia'],
                correctAnswer: 'Lucy',
                points: 1
              },
              {
                id: '2-2',
                type: 'true_false',
                text: 'The story takes place during winter.',
                correctAnswer: 'true',
                points: 1
              },
              {
                id: '2-3',
                type: 'short_answer',
                text: 'What problem does the main character face in the story?',
                correctAnswer: 'She is lost in the forest',
                points: 2
              },
              {
                id: '2-4',
                type: 'multiple_choice',
                text: 'Which word best describes how the character feels at the end of the story?',
                options: ['Sad', 'Relieved', 'Angry', 'Confused'],
                correctAnswer: 'Relieved',
                points: 1
              },
              {
                id: '2-5',
                type: 'essay',
                text: 'Why do you think the author chose this setting for the story? Use evidence from the text to support your answer.',
                points: 3
              }
            ],
            createdAt: '2025-02-10T14:30:00Z',
            updatedAt: '2025-02-10T14:30:00Z'
          },
          {
            id: '3',
            title: 'Year 4 States of Matter Quiz',
            description: 'Quick assessment of understanding of solids, liquids, and gases.',
            subject: 'science',
            ageRange: 'primary',
            curriculum: 'UK National Curriculum',
            duration: '20 minutes',
            questions: [
              {
                id: '3-1',
                type: 'multiple_choice',
                text: 'Which of these is a solid?',
                options: ['Water', 'Air', 'Ice', 'Steam'],
                correctAnswer: 'Ice',
                points: 1
              },
              {
                id: '3-2',
                type: 'matching',
                text: 'Match the state of matter with its properties:',
                options: [
                  'Solid - Has a fixed shape and volume',
                  'Liquid - Has a fixed volume but takes the shape of its container',
                  'Gas - Has no fixed shape or volume'
                ],
                correctAnswer: [
                  'Solid - Has a fixed shape and volume',
                  'Liquid - Has a fixed volume but takes the shape of its container',
                  'Gas - Has no fixed shape or volume'
                ],
                points: 3
              },
              {
                id: '3-3',
                type: 'true_false',
                text: 'When water boils, it changes from a liquid to a gas.',
                correctAnswer: 'true',
                points: 1
              },
              {
                id: '3-4',
                type: 'short_answer',
                text: 'What is the process called when a solid changes directly to a gas?',
                correctAnswer: 'Sublimation',
                points: 2
              },
              {
                id: '3-5',
                type: 'multiple_choice',
                text: 'Which state of matter has particles that are far apart and move freely?',
                options: ['Solid', 'Liquid', 'Gas', 'Plasma'],
                correctAnswer: 'Gas',
                points: 1
              }
            ],
            createdAt: '2025-03-05T09:15:00Z',
            updatedAt: '2025-03-05T09:15:00Z'
          }
        ];
        
        setAssessments(mockAssessments);
        setLoading(false);
      } catch (err) {
        setError('Failed to load assessments');
        setLoading(false);
      }
    };
    
    fetchAssessments();
  }, [initialAssessments]);
  
  // Filter assessments based on search and filters
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = searchTerm === '' || 
      assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === 'all' || assessment.subject === selectedSubject;
    const matchesAgeRange = selectedAgeRange === 'all' || assessment.ageRange === selectedAgeRange;
    
    return matchesSearch && matchesSubject && matchesAgeRange;
  });
  
  // Handle assessment selection
  const handleAssessmentSelect = (assessment: Assessment) => {
    onAssessmentSelect?.(assessment);
  };
  
  // Assessment creation form state
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    subject: 'mathematics',
    ageRange: 'secondary',
    curriculum: 'UK National Curriculum',
    duration: '',
    questions: [
      {
        type: 'multiple_choice',
        text: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        points: 1
      }
    ]
  });
  
  // Handle form change
  const handleCreateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle question text change
  const handleQuestionTextChange = (index: number, value: string) => {
    setCreateForm(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = { ...newQuestions[index], text: value };
      return { ...prev, questions: newQuestions };
    });
  };
  
  // Handle question type change
  const handleQuestionTypeChange = (index: number, value: string) => {
    setCreateForm(prev => {
      const newQuestions = [...prev.questions];
      
      // Reset options and correctAnswer based on new type
      let options;
      let correctAnswer;
      
      if (value === 'multiple_choice') {
        options = ['', '', '', ''];
        correctAnswer = '';
      } else if (value === 'true_false') {
        options = ['True', 'False'];
        correctAnswer = '';
      } else if (value === 'matching') {
        options = ['', '', ''];
        correctAnswer = ['', '', ''];
      } else {
        options = undefined;
        correctAnswer = '';
      }
      
      newQuestions[index] = { 
        ...newQuestions[index], 
        type: value as 'multiple_choice' | 'short_answer' | 'essay' | 'matching' | 'true_false',
        options,
        correctAnswer
      };
      
      return { ...prev, questions: newQuestions };
    });
  };
  
  // Handle question option change
  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setCreateForm(prev => {
      const newQuestions = [...prev.questions];
      const question = newQuestions[questionIndex];
      
      if (question.options) {
        const newOptions = [...question.options];
        newOptions[optionIndex] = value;
        newQuestions[questionIndex] = { ...question, options: newOptions };
      }
      
      return { ...prev, questions: newQuestions };
    });
  };
  
  // Handle correct answer change
  const handleCorrectAnswerChange = (questionIndex: number, value: string) => {
    setCreateForm(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[questionIndex] = { ...newQuestions[questionIndex], correctAnswer: value };
      return { ...prev, questions: newQuestions };
    });
  };
  
  // Handle points change
  const handlePointsChange = (questionIndex: number, value: string) => {
    const points = parseInt(value) || 1;
    setCreateForm(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[questionIndex] = { ...newQuestions[questionIndex], points };
      return { ...prev, questions: newQuestions };
    });
  };
  
  // Add question
  const addQuestion = () => {
    setCreateForm(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          type: 'multiple_choice',
          text: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          points: 1
        }
      ]
    }));
  };
  
  // Remove question
  const removeQuestion = (index: number) => {
    setCreateForm(prev => {
      const newQuestions = [...prev.questions];
      newQuestions.splice(index, 1);
      return { 
        ...prev, 
        questions: newQuestions.length ? newQuestions : [{
          type: 'multiple_choice',
          text: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          points: 1
        }]
      };
    });
  };
  
  // Add option to multiple choice question
  const addOption = (questionIndex: number) => {
    setCreateForm(prev => {
      const newQuestions = [...prev.questions];
      const question = newQuestions[questionIndex];
      
      if (question.options) {
        newQuestions[questionIndex] = {
          ...question,
          options: [...question.options, '']
        };
      }
      
      return { ...prev, questions: newQuestions };
    });
  };
  
  // Remove option from multiple choice question
  const removeOption = (questionIndex: number, optionIndex: number) => {
    setCreateForm(prev => {
      const newQuestions = [...prev.questions];
      const question = newQuestions[questionIndex];
      
      if (question.options && question.options.length > 2) {
        const newOptions = [...question.options];
        newOptions.splice(optionIndex, 1);
        newQuestions[questionIndex] = { ...question, options: newOptions };
      }
      
      return { ...prev, questions: newQuestions };
    });
  };
  
  // Handle AI-generated questions
  const handleAIQuestions = (aiResponse: string) => {
    try {
      // Attempt to parse the AI response as JSON
      const questions = JSON.parse(aiResponse);
      
      if (Array.isArray(questions) && questions.length > 0) {
        // Validate and format the questions
        const formattedQuestions = questions.map(q => {
          // Ensure each question has the required properties
          return {
            type: q.type || 'multiple_choice',
            text: q.text || '',
            options: q.options || (q.type === 'multiple_choice' ? ['', '', '', ''] : 
                                  q.type === 'true_false' ? ['True', 'False'] : undefined),
            correctAnswer: q.correctAnswer || '',
            points: q.points || 1
          };
        });
        
        setCreateForm(prev => ({
          ...prev,
          questions: formattedQuestions
        }));
        
        showToast({
          title: 'Questions generated successfully',
          type: 'success'
        });
      } else {
        throw new Error('Invalid question format');
      }
    } catch (err) {
      // If JSON parsing fails, try to extract questions in a more forgiving way
      const lines = aiResponse.split('\n');
      const questions = [];
      let currentQuestion = null;
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (trimmedLine.match(/^(Question|Q)(\s+\d+|\s*\d*:)/i)) {
          // This looks like a new question
          if (currentQuestion && currentQuestion.text) {
            questions.push(currentQuestion);
          }
          
          currentQuestion = {
            type: 'multiple_choice',
            text: trimmedLine.replace(/^(Question|Q)(\s+\d+|\s*\d*:)/i, '').trim(),
            options: [],
            correctAnswer: '',
            points: 1
          };
        } else if (currentQuestion && trimmedLine.match(/^[A-D][\s).:-]/)) {
          // This looks like a multiple choice option
          const option = trimmedLine.replace(/^[A-D][\s).:-]/, '').trim();
          if (option && currentQuestion.options) {
            currentQuestion.options.push(option);
          }
        } else if (currentQuestion && trimmedLine.match(/correct\s+answer/i)) {
          // This looks like the correct answer
          const answer = trimmedLine.replace(/^.*correct\s+answer\s*[:=-]\s*/i, '').trim();
          if (answer) {
            currentQuestion.correctAnswer = answer;
          }
        } else if (currentQuestion && trimmedLine) {
          // Append to the current question text
          currentQuestion.text += ' ' + trimmedLine;
        }
      }
      
      // Add the last question if it exists
      if (currentQuestion && currentQuestion.text) {
        questions.push(currentQuestion);
      }
      
      if (questions.length > 0) {
        // Format the questions properly
        const formattedQuestions = questions.map(q => {
          return {
            type: 'multiple_choice',
            text: q.text || '',
            options: q.options.length ? q.options : ['', '', '', ''],
            correctAnswer: q.correctAnswer || '',
            points: 1
          };
        });
        
        setCreateForm(prev => ({
          ...prev,
          questions: formattedQuestions
        }));
        
        showToast({
          title: 'Questions generated successfully',
          type: 'success'
        });
      } else {
        showToast({
          title: 'Failed to parse AI-generated questions',
          type: 'error'
        });
      }
    }
  };
  
  // Handle assessment creation
  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!createForm.title) {
      showToast({
        title: 'Title is required',
        type: 'error'
      });
      return;
    }
    
    if (!createForm.duration) {
      showToast({
        title: 'Duration is required',
        type: 'error'
      });
      return;
    }
    
    const hasEmptyQuestions = createForm.questions.some(q => !q.text.trim());
    if (hasEmptyQuestions) {
      showToast({
        title: 'All questions must have text',
        type: 'error'
      });
      return;
    }
    
    // Validate multiple choice questions have options and correct answer
    const invalidMultipleChoice = createForm.questions.some(q => 
      q.type === 'multiple_choice' && 
      (!q.options || q.options.some(o => !o.trim()) || !q.correctAnswer)
    );
    
    if (invalidMultipleChoice) {
      showToast({
        title: 'Multiple choice questions must have all options filled and a correct answer selected',
        type: 'error'
      });
      return;
    }
    
    // Create a new assessment object
    const newAssessment: Assessment = {
      id: Date.now().toString(),
      title: createForm.title,
      description: createForm.description,
      subject: createForm.subject,
      ageRange: createForm.ageRange,
      curriculum: createForm.curriculum,
      duration: createForm.duration,
      questions: createForm.questions.map((q, index) => ({
        ...q,
        id: `new-${index + 1}`
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add the new assessment to the list
    setAssessments(prev => [newAssessment, ...prev]);
    
    // Reset the form
    setCreateForm({
      title: '',
      description: '',
      subject: 'mathematics',
      ageRange: 'secondary',
      curriculum: 'UK National Curriculum',
      duration: '',
      questions: [
        {
          type: 'multiple_choice',
          text: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          points: 1
        }
      ]
    });
    
    showToast({
      title: 'Assessment created successfully',
      type: 'success'
    });
  };
  
  // Define the tabs
  const tabs = [
    {
      id: 'browse',
      label: 'Browse Assessments',
      content: (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              label="Search"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-1/2"
            />
            
            <div className="flex gap-4 md:w-1/2">
              <Select
                label="Subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                options={[
                  { value: 'all', label: 'All Subjects' },
                  { value: 'mathematics', label: 'Mathematics' },
                  { value: 'english', label: 'English' },
                  { value: 'science', label: 'Science' },
                  { value: 'history', label: 'History' },
                  { value: 'geography', label: 'Geography' },
                  { value: 'art', label: 'Art' },
                  { value: 'music', label: 'Music' },
                  { value: 'physical_education', label: 'Physical Education' }
                ]}
              />
              
              <Select
                label="Age Range"
                value={selectedAgeRange}
                onChange={(e) => setSelectedAgeRange(e.target.value)}
                options={[
                  { value: 'all', label: 'All Ages' },
                  { value: 'early_years', label: 'Early Years' },
                  { value: 'primary', label: 'Primary' },
                  { value: 'secondary', label: 'Secondary' },
                  { value: 'sixth_form', label: 'Sixth Form' }
                ]}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-centre py-8">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="error">
              {error}
            </Alert>
          ) : filteredAssessments.length === 0 ? (
            <div className="text-centre py-8 text-grey-500">
              No assessments found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssessments.map(assessment => (
                <Card key={assessment.id} className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold">{assessment.title}</h3>
                      <span className="px-2 py-1 text-xs rounded-full bg-grey-100 text-grey-800">
                        {assessment.duration}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-grey-600 mb-4">{assessment.description}</p>
                    <div className="text-xs text-grey-500 space-y-1">
                      <div><span className="font-medium">Subject:</span> {assessment.subject.charAt(0).toUpperCase() + assessment.subject.slice(1)}</div>
                      <div><span className="font-medium">Age Range:</span> {assessment.ageRange.charAt(0).toUpperCase() + assessment.ageRange.slice(1)}</div>
                      <div><span className="font-medium">Curriculum:</span> {assessment.curriculum}</div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium">Questions:</h4>
                      <ul className="text-xs text-grey-600 list-disc pl-5 mt-1">
                        <li>{assessment.questions.length} questions</li>
                        <li>
                          {assessment.questions.reduce((total, q) => total + q.points, 0)} total points
                        </li>
                        <li>
                          Types: {Array.from(new Set(assessment.questions.map(q => q.type)))
                            .map(type => type.replace('_', ' '))
                            .join(', ')}
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => handleAssessmentSelect(assessment)}
                      className="w-full"
                    >
                      View Assessment
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      id: 'create',
      label: 'Create Assessment',
      content: (
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleCreateAssessment} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Title"
                  name="title"
                  value={createForm.title}
                  onChange={handleCreateFormChange}
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <Textarea
                  label="Description"
                  name="description"
                  value={createForm.description}
                  onChange={handleCreateFormChange}
                  rows={3}
                />
              </div>
              
              <Select
                label="Subject"
                name="subject"
                value={createForm.subject}
                onChange={handleCreateFormChange}
                options={[
                  { value: 'mathematics', label: 'Mathematics' },
                  { value: 'english', label: 'English' },
                  { value: 'science', label: 'Science' },
                  { value: 'history', label: 'History' },
                  { value: 'geography', label: 'Geography' },
                  { value: 'art', label: 'Art' },
                  { value: 'music', label: 'Music' },
                  { value: 'physical_education', label: 'Physical Education' }
                ]}
              />
              
              <Select
                label="Age Range"
                name="ageRange"
                value={createForm.ageRange}
                onChange={handleCreateFormChange}
                options={[
                  { value: 'early_years', label: 'Early Years' },
                  { value: 'primary', label: 'Primary' },
                  { value: 'secondary', label: 'Secondary' },
                  { value: 'sixth_form', label: 'Sixth Form' }
                ]}
              />
              
              <Select
                label="Curriculum"
                name="curriculum"
                value={createForm.curriculum}
                onChange={handleCreateFormChange}
                options={[
                  { value: 'UK National Curriculum', label: 'UK National Curriculum' },
                  { value: 'Scottish Curriculum for Excellence', label: 'Scottish Curriculum for Excellence' },
                  { value: 'Northern Ireland Curriculum', label: 'Northern Ireland Curriculum' },
                  { value: 'Welsh Curriculum', label: 'Welsh Curriculum' }
                ]}
              />
              
              <Input
                label="Duration"
                name="duration"
                value={createForm.duration}
                onChange={handleCreateFormChange}
                placeholder="e.g., 45 minutes, 1 hour"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-centre">
                <h3 className="text-lg font-medium">Questions</h3>
                <Button
                  type="button"
                  onClick={addQuestion}
                  variant="outline"
                  size="sm"
                >
                  Add Question
                </Button>
              </div>
              
              <div className="space-y-6">
                {createForm.questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="p-4 border rounded-md">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-sm font-medium">Question {questionIndex + 1}</h4>
                      {createForm.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(questionIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="md:col-span-2">
                        <Textarea
                          label="Question Text"
                          value={question.text}
                          onChange={(e) => handleQuestionTextChange(questionIndex, e.target.value)}
                          rows={2}
                          required
                        />
                      </div>
                      
                      <Select
                        label="Question Type"
                        value={question.type}
                        onChange={(e) => handleQuestionTypeChange(questionIndex, e.target.value)}
                        options={[
                          { value: 'multiple_choice', label: 'Multiple Choice' },
                          { value: 'short_answer', label: 'Short Answer' },
                          { value: 'essay', label: 'Essay' },
                          { value: 'matching', label: 'Matching' },
                          { value: 'true_false', label: 'True/False' }
                        ]}
                      />
                      
                      <Input
                        label="Points"
                        type="number"
                        min="1"
                        value={question.points.toString()}
                        onChange={(e) => handlePointsChange(questionIndex, e.target.value)}
                      />
                    </div>
                    
                    {question.type === 'multiple_choice' && question.options && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-centre">
                          <h5 className="text-sm font-medium">Options</h5>
                          <Button
                            type="button"
                            onClick={() => addOption(questionIndex)}
                            variant="outline"
                            size="xs"
                          >
                            Add Option
                          </Button>
                        </div>
                        
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-centre gap-2">
                            <Input
                              value={option}
                              onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                              className="flex-grow"
                            />
                            <div className="flex items-centre">
                              <input
                                type="radio"
                                name={`correct-${questionIndex}`}
                                checked={question.correctAnswer === option}
                                onChange={() => handleCorrectAnswerChange(questionIndex, option)}
                                className="mr-2"
                              />
                              <label className="text-xs">Correct</label>
                            </div>
                            {question.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(questionIndex, optionIndex)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {question.type === 'true_false' && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Correct Answer</h5>
                        <div className="flex gap-4">
                          <div className="flex items-centre">
                            <input
                              type="radio"
                              name={`correct-${questionIndex}`}
                              checked={question.correctAnswer === 'true'}
                              onChange={() => handleCorrectAnswerChange(questionIndex, 'true')}
                              className="mr-2"
                            />
                            <label>True</label>
                          </div>
                          <div className="flex items-centre">
                            <input
                              type="radio"
                              name={`correct-${questionIndex}`}
                              checked={question.correctAnswer === 'false'}
                              onChange={() => handleCorrectAnswerChange(questionIndex, 'false')}
                              className="mr-2"
                            />
                            <label>False</label>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {(question.type === 'short_answer') && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Correct Answer</h5>
                        <Input
                          value={question.correctAnswer as string || ''}
                          onChange={(e) => handleCorrectAnswerChange(questionIndex, e.target.value)}
                          placeholder="Enter the correct answer"
                        />
                      </div>
                    )}
                    
                    {question.type === 'matching' && question.options && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-centre">
                          <h5 className="text-sm font-medium">Matching Pairs</h5>
                          <Button
                            type="button"
                            onClick={() => addOption(questionIndex)}
                            variant="outline"
                            size="xs"
                          >
                            Add Pair
                          </Button>
                        </div>
                        
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-centre gap-2">
                            <Input
                              value={option}
                              onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                              placeholder={`Matching pair ${optionIndex + 1} (e.g., "Term - Definition")`}
                              className="flex-grow"
                            />
                            {question.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(questionIndex, optionIndex)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {question.type === 'essay' && (
                      <div className="text-sm text-grey-600">
                        Essay questions will be manually graded.
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Generate Questions with AI</h4>
                <AIPrompt
                  placeholder={`Describe the assessment content for ${createForm.subject} at ${createForm.ageRange} level...`}
                  systemPrompt={`You are an educational assessment expert specialising in ${createForm.subject} for ${createForm.ageRange} students following the ${createForm.curriculum}. Generate 5 appropriate assessment questions based on the user's description. Include a mix of question types (multiple_choice, short_answer, true_false, etc.). For multiple choice questions, include 4 options and indicate the correct answer. Format your response as a JSON array of question objects with the following structure:
[
  {
    "type": "multiple_choice",
    "text": "Question text here",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": "Correct option here",
    "points": 1
  },
  {
    "type": "short_answer",
    "text": "Question text here",
    "correctAnswer": "Correct answer here",
    "points": 2
  }
]
Use UK English spelling and follow UK educational standards.`}
                  onCompletion={handleAIQuestions}
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button type="submit" className="w-full">
                Create Assessment
              </Button>
            </div>
          </form>
        </div>
      )
    }
  ];
  
  return (
    <div className={className}>
      <Tabs tabs={tabs} />
    </div>
  );
}
