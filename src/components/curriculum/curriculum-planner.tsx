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

interface CurriculumPlan {
  id: string;
  title: string;
  description: string;
  subject: string;
  ageRange: string;
  curriculum: string;
  duration: string;
  objectives: any[];
  resources: any[];
  assessments: any[];
  createdAt: string;
  updatedAt: string;
}

interface CurriculumPlannerProps {
  initialPlans?: CurriculumPlan[];
  onPlanSelect?: (plan: CurriculumPlan) => void;
  className?: string;
}

export function CurriculumPlanner({
  initialPlans = [],
  onPlanSelect,
  className = ''
}: CurriculumPlannerProps) {
  const { showToast } = useToast();
  const [plans, setPlans] = useState<CurriculumPlan[]>(initialPlans);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedAgeRange, setSelectedAgeRange] = useState('all');
  
  // Fetch plans on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // In a real application, this would fetch from an API
        // For now, we'll use the initialPlans or mock data
        if (initialPlans.length > 0) {
          setPlans(initialPlans);
          setLoading(false);
          return;
        }
        
        // Mock data for demonstration
        const mockPlans: any[] = [
          {
            id: '1',
            title: 'Algebraic Expressions and Equations',
            description: 'A comprehensive unit on algebraic expressions and equations for Year 8 students.',
            subject: 'mathematics',
            ageRange: 'secondary',
            curriculum: 'UK National Curriculum',
            duration: '6 weeks',
            objectives: [
              'Understand and use algebraic notation',
              'Simplify and manipulate algebraic expressions',
              'Solve linear equations in one variable',
              'Apply algebraic methods to solve problems'
            ],
            resources: [
              'Textbook: Mathematics for Key Stage 3',
              'Interactive whiteboard resources',
              'Online practise exercises'
            ],
            assessments: [
              'Weekly formative quizzes',
              'Mid-unit problem-solving task',
              'End of unit summative assessment'
            ],
            createdAt: '2025-01-10T09:00:00Z',
            updatedAt: '2025-01-10T09:00:00Z'
          },
          {
            id: '2',
            title: 'Shakespeare\'s Romeo and Juliet',
            description: 'An exploration of Shakespeare\'s Romeo and Juliet for GCSE English Literature students.',
            subject: 'english',
            ageRange: 'secondary',
            curriculum: 'UK National Curriculum',
            duration: '8 weeks',
            objectives: [
              'Understand the plot, characters, and themes of Romeo and Juliet',
              'Analyse Shakespeare\'s use of language and dramatic techniques',
              'Explore the historical and social context of the play',
              'Develop critical writing skills for literary analysis'
            ],
            resources: [
              'Romeo and Juliet text (Cambridge School Shakespeare)',
              'Film adaptations for comparative analysis',
              'Historical context materials'
            ],
            assessments: [
              'Character analysis essay',
              'Creative writing: alternative ending',
              'Final analytical essay on themes'
            ],
            createdAt: '2025-02-15T14:30:00Z',
            updatedAt: '2025-02-15T14:30:00Z'
          },
          {
            id: '3',
            title: 'The Water Cycle and Weather',
            description: 'A science unit on the water cycle and weather patterns for Year 4 students.',
            subject: 'science',
            ageRange: 'primary',
            curriculum: 'UK National Curriculum',
            duration: '4 weeks',
            objectives: [
              'Understand the stages of the water cycle',
              'Identify different types of clouds and precipitation',
              'Measure and record weather data',
              'Explain how weather patterns affect our environment'
            ],
            resources: [
              'Water cycle demonstration kit',
              'Weather observation journals',
              'Interactive weather maps'
            ],
            assessments: [
              'Water cycle diagram labelling',
              'Weather observation project',
              'End of unit quiz'
            ],
            createdAt: '2025-03-05T11:15:00Z',
            updatedAt: '2025-03-05T11:15:00Z'
          }
        ];
        
        setPlans(mockPlans);
        setLoading(false);
      } catch (err) {
        setError('Failed to load curriculum plans');
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, [initialPlans]);
  
  // Filter plans based on search and filters
  const filteredPlans = plans.filter(plan => {
    const matchesSearch = searchTerm === '' || 
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === 'all' || plan.subject === selectedSubject;
    const matchesAgeRange = selectedAgeRange === 'all' || plan.ageRange === selectedAgeRange;
    
    return matchesSearch && matchesSubject && matchesAgeRange;
  });
  
  // Handle plan selection
  const handlePlanSelect = (plan: CurriculumPlan) => {
    onPlanSelect?.(plan);
  };
  
  // Plan creation form state
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    subject: 'mathematics',
    ageRange: 'secondary',
    curriculum: 'UK National Curriculum',
    duration: '',
    objectives: [''],
    resources: [''],
    assessments: ['']
  });
  
  // Handle form change
  const handleCreateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle array field change (objectives, resources, assessments)
  const handleArrayFieldChange = (field: 'objectives' | 'resources' | 'assessments', index: number, value: string) => {
    setCreateForm(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };
  
  // Add item to array field
  const addArrayItem = (field: 'objectives' | 'resources' | 'assessments') => {
    setCreateForm(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };
  
  // Remove item from array field
  const removeArrayItem = (field: 'objectives' | 'resources' | 'assessments', index: number) => {
    setCreateForm(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray.length ? newArray : [''] };
    });
  };
  
  // Handle AI-generated objectives
  const handleAIObjectives = (aiResponse: string) => {
    // Parse the AI response into individual objectives
    const objectives = aiResponse
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[•\-*]\s*/, '').trim());
    
    if (objectives.length > 0) {
      setCreateForm(prev => ({
        ...prev,
        objectives: objectives
      }));
      
      showToast({
        title: 'Objectives generated successfully',
        type: 'success'
      });
    }
  };
  
  // Handle plan creation
  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!createForm.title) {
      showToast({
        title: 'Title is required',
        type: 'error'
      });
      return;
    }
    
    if (!createForm.objectives[0]) {
      showToast({
        title: 'At least one learning objective is required',
        type: 'error'
      });
      return;
    }
    
    // Create a new plan object
    const newPlan: CurriculumPlan = {
      id: Date.now().toString(),
      title: createForm.title,
      description: createForm.description,
      subject: createForm.subject,
      ageRange: createForm.ageRange,
      curriculum: createForm.curriculum,
      duration: createForm.duration,
      objectives: createForm.objectives.filter(obj => obj.trim()),
      resources: createForm.resources.filter(res => res.trim()),
      assessments: createForm.assessments.filter(ass => ass.trim()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add the new plan to the list
    setPlans(prev => [newPlan, ...prev]);
    
    // Reset the form
    setCreateForm({
      title: '',
      description: '',
      subject: 'mathematics',
      ageRange: 'secondary',
      curriculum: 'UK National Curriculum',
      duration: '',
      objectives: [''],
      resources: [''],
      assessments: ['']
    });
    
    showToast({
      title: 'Curriculum plan created successfully',
      type: 'success'
    });
  };
  
  // Define the tabs
  const tabs = [
    {
      id: 'browse',
      label: 'Browse Plans',
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
          ) : filteredPlans.length === 0 ? (
            <div className="text-centre py-8 text-grey-500">
              No curriculum plans found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlans.map(plan => (
                <Card key={plan.id} className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold">{plan.title}</h3>
                      <span className="px-2 py-1 text-xs rounded-full bg-grey-100 text-grey-800">
                        {plan.duration}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-grey-600 mb-4">{plan.description}</p>
                    <div className="text-xs text-grey-500 space-y-1">
                      <div><span className="font-medium">Subject:</span> {plan.subject.charAt(0).toUpperCase() + plan.subject.slice(1)}</div>
                      <div><span className="font-medium">Age Range:</span> {plan.ageRange.charAt(0).toUpperCase() + plan.ageRange.slice(1)}</div>
                      <div><span className="font-medium">Curriculum:</span> {plan.curriculum}</div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium">Learning Objectives:</h4>
                      <ul className="text-xs text-grey-600 list-disc pl-5 mt-1">
                        {plan.objectives.slice(0, 3).map((objective, index) => (
                          <li key={index}>{objective}</li>
                        ))}
                        {plan.objectives.length > 3 && (
                          <li className="text-grey-500">+ {plan.objectives.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => handlePlanSelect(plan)}
                      className="w-full"
                    >
                      View Plan
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
      label: 'Create Plan',
      content: (
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleCreatePlan} className="space-y-6">
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
                placeholder="e.g., 6 weeks, 1 term"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-centre">
                <h3 className="text-lg font-medium">Learning Objectives</h3>
                <Button
                  type="button"
                  onClick={() => addArrayItem('objectives')}
                  variant="outline"
                  size="sm"
                >
                  Add Objective
                </Button>
              </div>
              
              <div className="space-y-2">
                {createForm.objectives.map((objective, index) => (
                  <div key={index} className="flex items-centre gap-2">
                    <Input
                      value={objective}
                      onChange={(e) => handleArrayFieldChange('objectives', index, e.target.value)}
                      placeholder={`Objective ${index + 1}`}
                      className="flex-grow"
                    />
                    {createForm.objectives.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('objectives', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Generate Objectives with AI</h4>
                <AIPrompt
                  placeholder="Describe the topic and learning goals to generate objectives..."
                  systemPrompt="You are an educational curriculum expert following UK educational standards and using UK English spelling. Generate 4-6 clear, measurable learning objectives for the topic described. Format each objective on a new line with a bullet point. Focus on specific, achievable outcomes that align with UK curriculum standards."
                  onCompletion={handleAIObjectives}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-centre">
                <h3 className="text-lg font-medium">Resources</h3>
                <Button
                  type="button"
                  onClick={() => addArrayItem('resources')}
                  variant="outline"
                  size="sm"
                >
                  Add Resource
                </Button>
              </div>
              
              <div className="space-y-2">
                {createForm.resources.map((resource, index) => (
                  <div key={index} className="flex items-centre gap-2">
                    <Input
                      value={resource}
                      onChange={(e) => handleArrayFieldChange('resources', index, e.target.value)}
                      placeholder={`Resource ${index + 1}`}
                      className="flex-grow"
                    />
                    {createForm.resources.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('resources', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-centre">
                <h3 className="text-lg font-medium">Assessments</h3>
                <Button
                  type="button"
                  onClick={() => addArrayItem('assessments')}
                  variant="outline"
                  size="sm"
                >
                  Add Assessment
                </Button>
              </div>
              
              <div className="space-y-2">
                {createForm.assessments.map((assessment, index) => (
                  <div key={index} className="flex items-centre gap-2">
                    <Input
                      value={assessment}
                      onChange={(e) => handleArrayFieldChange('assessments', index, e.target.value)}
                      placeholder={`Assessment ${index + 1}`}
                      className="flex-grow"
                    />
                    {createForm.assessments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('assessments', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4">
              <Button type="submit" className="w-full">
                Create Curriculum Plan
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
