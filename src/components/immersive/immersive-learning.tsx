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

interface ImmersiveEnvironment {
  id: string;
  title: string;
  description: string;
  type: 'vr' | 'ar' | '3d' | 'interactive';
  subject: string;
  ageRange: string;
  curriculum: string;
  objectives: any[];
  scenarioUrl: string;
  previewImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface ImmersiveLearningProps {
  initialEnvironments?: ImmersiveEnvironment[];
  onEnvironmentSelect?: (environment: ImmersiveEnvironment) => void;
  className?: string;
}

export function ImmersiveLearning({
  initialEnvironments = [],
  onEnvironmentSelect,
  className = ''
}: ImmersiveLearningProps) {
  const { showToast } = useToast();
  const [environments, setEnvironments] = useState<ImmersiveEnvironment[]>(initialEnvironments);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedAgeRange, setSelectedAgeRange] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  
  // Fetch environments on component mount
  useEffect(() => {
    const fetchEnvironments = async () => {
      try {
        // In a real application, this would fetch from an API
        // For now, we'll use the initialEnvironments or mock data
        if (initialEnvironments.length > 0) {
          setEnvironments(initialEnvironments);
          setLoading(false);
          return;
        }
        
        // Mock data for demonstration
        const mockEnvironments: any[] = [
          {
            id: '1',
            title: 'Solar System Explorer',
            description: 'An immersive 3D exploration of our solar system, allowing students to visit each planet and learn about its unique characteristics.',
            type: '3d',
            subject: 'science',
            ageRange: 'secondary',
            curriculum: 'UK National Curriculum',
            objectives: [
              'Understand the relative sizes and positions of planets in our solar system',
              'Identify key characteristics of each planet',
              'Explain how the planets orbit the sun',
              'Compare and contrast different planets'
            ],
            scenarioUrl: '/immersive/solar-system',
            previewImage: '/images/solar-system-preview.jpg',
            createdAt: '2025-01-20T10:00:00Z',
            updatedAt: '2025-01-20T10:00:00Z'
          },
          {
            id: '2',
            title: 'Historical London VR Tour',
            description: 'A virtual reality tour of London through different historical periods, from Roman Londinium to Victorian London and the present day.',
            type: 'vr',
            subject: 'history',
            ageRange: 'secondary',
            curriculum: 'UK National Curriculum',
            objectives: [
              'Understand how London has changed over time',
              'Identify key historical landmarks and their significance',
              'Compare urban development across different time periods',
              'Analyse the impact of historical events on the city'
            ],
            scenarioUrl: '/immersive/london-history',
            previewImage: '/images/london-history-preview.jpg',
            createdAt: '2025-02-15T14:30:00Z',
            updatedAt: '2025-02-15T14:30:00Z'
          },
          {
            id: '3',
            title: 'Interactive Fractions Workshop',
            description: 'An interactive 3D environment where primary students can manipulate objects to learn about fractions, decimals, and percentages.',
            type: 'interactive',
            subject: 'mathematics',
            ageRange: 'primary',
            curriculum: 'UK National Curriculum',
            objectives: [
              'Understand the concept of fractions as parts of a whole',
              'Convert between fractions, decimals, and percentages',
              'Add and subtract fractions with different denominators',
              'Solve real-world problems involving fractions'
            ],
            scenarioUrl: '/immersive/fractions',
            previewImage: '/images/fractions-preview.jpg',
            createdAt: '2025-03-10T09:15:00Z',
            updatedAt: '2025-03-10T09:15:00Z'
          }
        ];
        
        setEnvironments(mockEnvironments);
        setLoading(false);
      } catch (err) {
        setError('Failed to load immersive environments');
        setLoading(false);
      }
    };
    
    fetchEnvironments();
  }, [initialEnvironments]);
  
  // Filter environments based on search and filters
  const filteredEnvironments = environments.filter(env => {
    const matchesSearch = searchTerm === '' || 
      env.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      env.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === 'all' || env.subject === selectedSubject;
    const matchesAgeRange = selectedAgeRange === 'all' || env.ageRange === selectedAgeRange;
    const matchesType = selectedType === 'all' || env.type === selectedType;
    
    return matchesSearch && matchesSubject && matchesAgeRange && matchesType;
  });
  
  // Handle environment selection
  const handleEnvironmentSelect = (environment: ImmersiveEnvironment) => {
    onEnvironmentSelect?.(environment);
  };
  
  // Environment creation form state
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    type: '3d',
    subject: 'science',
    ageRange: 'secondary',
    curriculum: 'UK National Curriculum',
    objectives: [''],
    scenarioUrl: '',
    previewImage: ''
  });
  
  // Handle form change
  const handleCreateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle objectives change
  const handleObjectiveChange = (index: number, value: string) => {
    setCreateForm(prev => {
      const newObjectives = [...prev.objectives];
      newObjectives[index] = value;
      return { ...prev, objectives: newObjectives };
    });
  };
  
  // Add objective
  const addObjective = () => {
    setCreateForm(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };
  
  // Remove objective
  const removeObjective = (index: number) => {
    setCreateForm(prev => {
      const newObjectives = [...prev.objectives];
      newObjectives.splice(index, 1);
      return { 
        ...prev, 
        objectives: newObjectives.length ? newObjectives : ['']
      };
    });
  };
  
  // Handle AI-generated objectives
  const handleAIObjectives = (aiResponse: string) => {
    // Parse the AI response into individual objectives
    const objectives = aiResponse
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[•\-*\d.]\s*/, '').trim());
    
    if (objectives.length > 0) {
      setCreateForm(prev => ({
        ...prev,
        objectives: objectives
      }));
      
      showToast({
        title: 'Learning objectives generated successfully',
        type: 'success'
      });
    }
  };
  
  // Handle environment creation
  const handleCreateEnvironment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!createForm.title) {
      showToast({
        title: 'Title is required',
        type: 'error'
      });
      return;
    }
    
    if (!createForm.scenarioUrl) {
      showToast({
        title: 'Scenario URL is required',
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
    
    // Create a new environment object
    const newEnvironment: ImmersiveEnvironment = {
      id: Date.now().toString(),
      title: createForm.title,
      description: createForm.description,
      type: createForm.type as any,
      subject: createForm.subject,
      ageRange: createForm.ageRange,
      curriculum: createForm.curriculum,
      objectives: createForm.objectives.filter(obj => obj.trim()),
      scenarioUrl: createForm.scenarioUrl,
      previewImage: createForm.previewImage || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add the new environment to the list
    setEnvironments(prev => [newEnvironment, ...prev]);
    
    // Reset the form
    setCreateForm({
      title: '',
      description: '',
      type: '3d',
      subject: 'science',
      ageRange: 'secondary',
      curriculum: 'UK National Curriculum',
      objectives: [''],
      scenarioUrl: '',
      previewImage: ''
    });
    
    showToast({
      title: 'Immersive environment created successfully',
      type: 'success'
    });
  };
  
  // Define the tabs
  const tabs = [
    {
      id: 'browse',
      label: 'Browse Environments',
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
              
              <Select
                label="Type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'vr', label: 'Virtual Reality' },
                  { value: 'ar', label: 'Augmented Reality' },
                  { value: '3d', label: '3D Environment' },
                  { value: 'interactive', label: 'Interactive' }
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
          ) : filteredEnvironments.length === 0 ? (
            <div className="text-centre py-8 text-grey-500">
              No immersive environments found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEnvironments.map(environment => (
                <Card key={environment.id} className="h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    {environment.previewImage ? (
                      <img 
                        src={environment.previewImage} 
                        alt={environment.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-grey-200 flex items-centre justify-centre">
                        <span className="text-grey-500">No preview available</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 px-2 py-1 text-xs rounded-full bg-blue-500 text-white">
                      {environment.type === 'vr' ? 'Virtual Reality' :
                       environment.type === 'ar' ? 'Augmented Reality' :
                       environment.type === '3d' ? '3D Environment' : 'Interactive'}
                    </div>
                  </div>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">{environment.title}</h3>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-grey-600 mb-4">{environment.description}</p>
                    <div className="text-xs text-grey-500 space-y-1">
                      <div><span className="font-medium">Subject:</span> {environment.subject.charAt(0).toUpperCase() + environment.subject.slice(1)}</div>
                      <div><span className="font-medium">Age Range:</span> {environment.ageRange.charAt(0).toUpperCase() + environment.ageRange.slice(1)}</div>
                      <div><span className="font-medium">Curriculum:</span> {environment.curriculum}</div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium">Learning Objectives:</h4>
                      <ul className="text-xs text-grey-600 list-disc pl-5 mt-1">
                        {environment.objectives.slice(0, 2).map((objective, index) => (
                          <li key={index}>{objective}</li>
                        ))}
                        {environment.objectives.length > 2 && (
                          <li className="text-grey-500">+ {environment.objectives.length - 2} more</li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => handleEnvironmentSelect(environment)}
                      className="w-full"
                    >
                      Launch Environment
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
      label: 'Create Environment',
      content: (
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleCreateEnvironment} className="space-y-6">
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
                label="Environment Type"
                name="type"
                value={createForm.type}
                onChange={handleCreateFormChange}
                options={[
                  { value: 'vr', label: 'Virtual Reality' },
                  { value: 'ar', label: 'Augmented Reality' },
                  { value: '3d', label: '3D Environment' },
                  { value: 'interactive', label: 'Interactive' }
                ]}
              />
              
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
              
              <div className="md:col-span-2">
                <Input
                  label="Scenario URL"
                  name="scenarioUrl"
                  value={createForm.scenarioUrl}
                  onChange={handleCreateFormChange}
                  placeholder="e.g., /immersive/solar-system"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <Input
                  label="Preview Image URL"
                  name="previewImage"
                  value={createForm.previewImage}
                  onChange={handleCreateFormChange}
                  placeholder="e.g., /images/preview.jpg"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-centre">
                <h3 className="text-lg font-medium">Learning Objectives</h3>
                <Button
                  type="button"
                  onClick={addObjective}
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
                      onChange={(e) => handleObjectiveChange(index, e.target.value)}
                      placeholder={`Objective ${index + 1}`}
                      className="flex-grow"
                    />
                    {createForm.objectives.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeObjective(index)}
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
                  placeholder="Describe the immersive environment and learning goals..."
                  systemPrompt={`You are an educational expert specialising in immersive learning environments. Generate 4-6 clear, measurable learning objectives for a ${createForm.type} environment about the topic described. Format each objective on a new line with a bullet point. Focus on specific, achievable outcomes that align with UK curriculum standards for ${createForm.ageRange} students. Use UK English spelling.`}
                  onCompletion={handleAIObjectives}
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button type="submit" className="w-full">
                Create Immersive Environment
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
