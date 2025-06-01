'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input, Textarea, Select, Checkbox } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { useToast } from '@/components/ui/toast';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'audio' | 'link' | 'worksheet';
  url?: string;
  file?: string;
  tags: any[];
  ageRange: string;
  subject: string;
  curriculum: string;
  createdAt: string;
  updatedAt: string;
}

interface ResourceLibraryProps {
  initialResources?: Resource[];
  onResourceSelect?: (resource: Resource) => void;
  className?: string;
}

export function ResourceLibrary({
  initialResources = [],
  onResourceSelect,
  className = ''
}: ResourceLibraryProps) {
  const { showToast } = useToast();
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedAgeRange, setSelectedAgeRange] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  
  // Fetch resources on component mount
  useEffect(() => {
    const fetchResources = async () => {
      try {
        // In a real application, this would fetch from an API
        // For now, we'll use the initialResources or mock data
        if (initialResources.length > 0) {
          setResources(initialResources);
          setLoading(false);
          return;
        }
        
        // Mock data for demonstration
        const mockResources: any[] = [
          {
            id: '1',
            title: 'Mathematics: Algebra Fundamentals',
            description: 'A comprehensive guide to algebraic concepts for secondary school students.',
            type: 'document',
            file: '/resources/algebra_fundamentals.pdf',
            tags: ['mathematics', 'algebra', 'secondary'],
            ageRange: 'secondary',
            subject: 'mathematics',
            curriculum: 'UK National Curriculum',
            createdAt: '2025-01-15T12:00:00Z',
            updatedAt: '2025-01-15T12:00:00Z'
          },
          {
            id: '2',
            title: 'Understanding Shakespeare: Romeo and Juliet',
            description: 'Video lecture series on Shakespeare\'s Romeo and Juliet with analysis and context.',
            type: 'video',
            url: 'https://example.com/videos/romeo_and_juliet',
            tags: ['english', 'literature', 'shakespeare', 'secondary'],
            ageRange: 'secondary',
            subject: 'english',
            curriculum: 'UK National Curriculum',
            createdAt: '2025-02-10T14:30:00Z',
            updatedAt: '2025-02-10T14:30:00Z'
          },
          {
            id: '3',
            title: 'Primary Science: The Water Cycle',
            description: 'Interactive worksheet on the water cycle for primary school students.',
            type: 'worksheet',
            file: '/resources/water_cycle_worksheet.pdf',
            tags: ['science', 'water cycle', 'primary'],
            ageRange: 'primary',
            subject: 'science',
            curriculum: 'UK National Curriculum',
            createdAt: '2025-03-05T09:15:00Z',
            updatedAt: '2025-03-05T09:15:00Z'
          }
        ];
        
        setResources(mockResources);
        setLoading(false);
      } catch (err) {
        setError('Failed to load resources');
        setLoading(false);
      }
    };
    
    fetchResources();
  }, [initialResources]);
  
  // Filter resources based on search and filters
  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchTerm === '' || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    const matchesAgeRange = selectedAgeRange === 'all' || resource.ageRange === selectedAgeRange;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesSubject && matchesAgeRange && matchesType;
  });
  
  // Handle resource selection
  const handleResourceSelect = (resource: Resource) => {
    onResourceSelect?.(resource);
  };
  
  // Resource upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    type: 'document',
    tags: '',
    ageRange: 'secondary',
    subject: 'mathematics',
    curriculum: 'UK National Curriculum',
    file: null as File | null,
    url: ''
  });
  
  // Handle upload form change
  const handleUploadFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadForm(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };
  
  // Handle resource upload
  const handleResourceUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!uploadForm.title) {
      showToast({
        title: 'Title is required',
        type: 'error'
      });
      return;
    }
    
    if (uploadForm.type !== 'link' && !uploadForm.file) {
      showToast({
        title: 'Please select a file to upload',
        type: 'error'
      });
      return;
    }
    
    if (uploadForm.type === 'link' && !uploadForm.url) {
      showToast({
        title: 'URL is required for link resources',
        type: 'error'
      });
      return;
    }
    
    // In a real application, this would upload to an API
    // For now, we'll simulate a successful upload
    
    // Create a new resource object
    const newResource: Resource = {
      id: Date.now().toString(),
      title: uploadForm.title,
      description: uploadForm.description,
      type: uploadForm.type as any,
      tags: uploadForm.tags.split(',').map(tag => tag.trim()),
      ageRange: uploadForm.ageRange,
      subject: uploadForm.subject,
      curriculum: uploadForm.curriculum,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (uploadForm.type === 'link') {
      newResource.url = uploadForm.url;
    } else {
      newResource.file = `/resources/${uploadForm.file?.name}`;
    }
    
    // Add the new resource to the list
    setResources(prev => [newResource, ...prev]);
    
    // Reset the form
    setUploadForm({
      title: '',
      description: '',
      type: 'document',
      tags: '',
      ageRange: 'secondary',
      subject: 'mathematics',
      curriculum: 'UK National Curriculum',
      file: null,
      url: ''
    });
    
    showToast({
      title: 'Resource uploaded successfully',
      type: 'success'
    });
  };
  
  // Define the tabs
  const tabs = [
    {
      id: 'browse',
      label: 'Browse Resources',
      content: (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              label="Search"
              placeholder="Search by title, description, or tags..."
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
                  { value: 'document', label: 'Document' },
                  { value: 'video', label: 'Video' },
                  { value: 'audio', label: 'Audio' },
                  { value: 'link', label: 'Link' },
                  { value: 'worksheet', label: 'Worksheet' }
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
          ) : filteredResources.length === 0 ? (
            <div className="text-centre py-8 text-grey-500">
              No resources found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map(resource => (
                <Card key={resource.id} className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold">{resource.title}</h3>
                      <span className="px-2 py-1 text-xs rounded-full bg-grey-100 text-grey-800">
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-grey-600 mb-4">{resource.description}</p>
                    <div className="text-xs text-grey-500 space-y-1">
                      <div><span className="font-medium">Subject:</span> {resource.subject.charAt(0).toUpperCase() + resource.subject.slice(1)}</div>
                      <div><span className="font-medium">Age Range:</span> {resource.ageRange.charAt(0).toUpperCase() + resource.ageRange.slice(1)}</div>
                      <div><span className="font-medium">Curriculum:</span> {resource.curriculum}</div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1">
                      {resource.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => handleResourceSelect(resource)}
                      className="w-full"
                    >
                      View Resource
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
      id: 'upload',
      label: 'Upload Resource',
      content: (
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleResourceUpload} className="space-y-4">
            <Input
              label="Title"
              name="title"
              value={uploadForm.title}
              onChange={handleUploadFormChange}
              required
            />
            
            <Textarea
              label="Description"
              name="description"
              value={uploadForm.description}
              onChange={handleUploadFormChange}
              rows={3}
            />
            
            <div className="flex gap-4">
              <Select
                label="Resource Type"
                name="type"
                value={uploadForm.type}
                onChange={handleUploadFormChange}
                options={[
                  { value: 'document', label: 'Document' },
                  { value: 'video', label: 'Video' },
                  { value: 'audio', label: 'Audio' },
                  { value: 'link', label: 'Link' },
                  { value: 'worksheet', label: 'Worksheet' }
                ]}
                className="w-1/2"
              />
              
              <Select
                label="Subject"
                name="subject"
                value={uploadForm.subject}
                onChange={handleUploadFormChange}
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
                className="w-1/2"
              />
            </div>
            
            <div className="flex gap-4">
              <Select
                label="Age Range"
                name="ageRange"
                value={uploadForm.ageRange}
                onChange={handleUploadFormChange}
                options={[
                  { value: 'early_years', label: 'Early Years' },
                  { value: 'primary', label: 'Primary' },
                  { value: 'secondary', label: 'Secondary' },
                  { value: 'sixth_form', label: 'Sixth Form' }
                ]}
                className="w-1/2"
              />
              
              <Select
                label="Curriculum"
                name="curriculum"
                value={uploadForm.curriculum}
                onChange={handleUploadFormChange}
                options={[
                  { value: 'UK National Curriculum', label: 'UK National Curriculum' },
                  { value: 'Scottish Curriculum for Excellence', label: 'Scottish Curriculum for Excellence' },
                  { value: 'Northern Ireland Curriculum', label: 'Northern Ireland Curriculum' },
                  { value: 'Welsh Curriculum', label: 'Welsh Curriculum' }
                ]}
                className="w-1/2"
              />
            </div>
            
            <Input
              label="Tags (comma-separated)"
              name="tags"
              value={uploadForm.tags}
              onChange={handleUploadFormChange}
              placeholder="e.g., mathematics, algebra, equations"
            />
            
            {uploadForm.type === 'link' ? (
              <Input
                label="URL"
                name="url"
                value={uploadForm.url}
                onChange={handleUploadFormChange}
                placeholder="https://example.com/resource"
                required={uploadForm.type === 'link'}
              />
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-grey-700">
                  File Upload
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-grey-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            )}
            
            <div className="pt-4">
              <Button type="submit" className="w-full">
                Upload Resource
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
