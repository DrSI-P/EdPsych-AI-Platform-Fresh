'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import { SimpleTabs  } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';

interface Template {
  id: string;
  title: string;
  description: string;
  subject: string;
  keyStage: string;
  type: string;
  questionCount: number;
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  isPublic: boolean;
  tags: any[];
  previewImage?: string;
}

export default function AssessmentTemplatesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedKeyStage, setSelectedKeyStage] = useState('');

  const subjects = [
    { value: '', label: 'All Subjects' },
    { value: 'english', label: 'English' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'history', label: 'History' },
    { value: 'geography', label: 'Geography' },
    { value: 'art', label: 'Art and Design' },
    { value: 'music', label: 'Music' },
    { value: 'pe', label: 'Physical Education' },
    { value: 'computing', label: 'Computing' },
    { value: 'languages', label: 'Modern Foreign Languages' },
  ];

  const keyStages = [
    { value: '', label: 'All Key Stages' },
    { value: 'eyfs', label: 'Early Years Foundation Stage' },
    { value: 'ks1', label: 'Key Stage 1' },
    { value: 'ks2', label: 'Key Stage 2' },
    { value: 'ks3', label: 'Key Stage 3' },
    { value: 'ks4', label: 'Key Stage 4' },
    { value: 'ks5', label: 'Key Stage 5' },
  ];

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/assessment/templates');
        
        if (!response.ok) {
          throw new Error('Failed to fetch assessment templates');
        }
        
        const data = await response.json();
        setTemplates(data);
        setFilteredTemplates(data);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('An error occurred while fetching the assessment templates');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTemplates();
  }, []);

  useEffect(() => {
    // Filter templates based on active tab, search query, subject, and key stage
    let filtered = [...templates];
    
    // Filter by tab
    if (activeTab === 'my-templates') {
      filtered = filtered.filter(template => template.createdBy.id === 'current-user-id'); // Replace with actual user ID
    } else if (activeTab === 'public') {
      filtered = filtered.filter(template => template.isPublic);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template => 
        template.title.toLowerCase().includes(query) || 
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by subject
    if (selectedSubject) {
      filtered = filtered.filter(template => template.subject === selectedSubject);
    }
    
    // Filter by key stage
    if (selectedKeyStage) {
      filtered = filtered.filter(template => template.keyStage === selectedKeyStage);
    }
    
    setFilteredTemplates(filtered);
  }, [templates, activeTab, searchQuery, selectedSubject, selectedKeyStage]);

  const handleUseTemplate = (templateId: string) => {
    router.push(`/assessment/templates/${templateId}/use`);
  };

  const handleCreateTemplate = () => {
    router.push('/assessment/templates/create');
  };

  const renderTemplateGrid = () => {
    if (filteredTemplates.length === 0) {
      return (
        <div className="text-centre py-12">
          <p className="text-grey-500 mb-4">No templates found matching your criteria.</p>
          <Button onClick={handleCreateTemplate}>
            Create New Template
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden flex flex-col">
            {template.previewImage && (
              <div className="h-40 overflow-hidden">
                <img 
                  src={template.previewImage} 
                  alt={template.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">{template.title}</h3>
                {template.isPublic && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Public
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-2 flex-grow">
              <p className="text-sm text-grey-600 mb-2 line-clamp-2">{template.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                <div>
                  <span className="text-grey-500">Subject:</span>{' '}
                  <span className="font-medium">{subjects.find(s => s.value === template.subject)?.label || template.subject}</span>
                </div>
                <div>
                  <span className="text-grey-500">Key Stage:</span>{' '}
                  <span className="font-medium">{keyStages.find(k => k.value === template.keyStage)?.label || template.keyStage}</span>
                </div>
                <div>
                  <span className="text-grey-500">Type:</span>{' '}
                  <span className="font-medium">{template.type}</span>
                </div>
                <div>
                  <span className="text-grey-500">Questions:</span>{' '}
                  <span className="font-medium">{template.questionCount}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {template.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 text-xs rounded-full bg-grey-100 text-grey-800">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between items-centre">
              <div className="text-xs text-grey-500">
                By {template.createdBy.name}
              </div>
              <Button 
                size="sm"
                onClick={() => handleUseTemplate(template.id)}
              >
                Use Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-centre items-centre min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-centre justify-between">
          <h1 className="text-2xl font-bold text-grey-900">Assessment Templates</h1>
          <Button onClick={handleCreateTemplate}>
            Create New Template
          </Button>
        </div>
        <p className="mt-2 text-grey-600">
          Use pre-built templates to quickly create assessments for your students.
        </p>
      </div>

      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      <div className="mb-6">
        <SimpleTabs
          tabs={[
            { id: 'all', label: 'All Templates' },
            { id: 'my-templates', label: 'My Templates' },
            { id: 'public', label: 'Public Templates' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-4"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="col-span-1 md:col-span-1">
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full px-4 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <select
              className="w-full px-4 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map((subject) => (
                <option key={subject.value} value={subject.value}>
                  {subject.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="w-full px-4 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedKeyStage}
              onChange={(e) => setSelectedKeyStage(e.target.value)}
            >
              {keyStages.map((keyStage) => (
                <option key={keyStage.value} value={keyStage.value}>
                  {keyStage.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {renderTemplateGrid()}
      </div>
    </div>
  );
}
