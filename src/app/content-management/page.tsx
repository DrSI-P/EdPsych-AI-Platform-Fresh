'use client';

import React, { useState } from 'react';
import { ContentCreator } from '@/components/content-management/content-creator';
import { ContentBrowser } from '@/components/content-management/content-browser';
import { ContentViewer } from '@/components/content-management/content-viewer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Library, Settings } from 'lucide-react';
import { ContentItem } from '@/lib/content-management/types';
import { useToast } from '@/components/ui/use-toast';

// Mock curriculum standards for demonstration
const mockCurriculumStandards = [
  {
    id: '1',
    code: 'EN1',
    description: 'Read accurately by blending sounds in unfamiliar words containing GPCs that have been taught',
    subject: 'english',
    keyStage: 'ks1',
    category: 'Reading',
    subcategory: 'Word Reading',
    year: 'Year 1'
  },
  {
    id: '2',
    code: 'EN2',
    description: 'Discuss and sequence the main events in stories and how items of information are related',
    subject: 'english',
    keyStage: 'ks1',
    category: 'Reading',
    subcategory: 'Comprehension',
    year: 'Year 1'
  },
  {
    id: '3',
    code: 'MA1',
    description: 'Count to and across 100, forwards and backwards, beginning with 0 or 1, or from any given number',
    subject: 'maths',
    keyStage: 'ks1',
    category: 'Number',
    subcategory: 'Number and Place Value',
    year: 'Year 1'
  },
  {
    id: '4',
    code: 'SC1',
    description: 'Identify and name a variety of common wild and garden plants, including deciduous and evergreen trees',
    subject: 'science',
    keyStage: 'ks1',
    category: 'Plants',
    year: 'Year 1'
  },
  {
    id: '5',
    code: 'EN3',
    description: 'Apply their growing knowledge of root words, prefixes and suffixes both to read aloud and to understand the meaning of new words they meet',
    subject: 'english',
    keyStage: 'ks2',
    category: 'Reading',
    subcategory: 'Word Reading',
    year: 'Year 3'
  },
  {
    id: '6',
    code: 'MA2',
    description: 'Solve problems involving addition, subtraction, multiplication and division',
    subject: 'maths',
    keyStage: 'ks2',
    category: 'Number',
    subcategory: 'Calculations',
    year: 'Year 4'
  }
];

export default function ContentManagementPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [contentToEdit, setContentToEdit] = useState<ContentItem | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);

  // Handle content creation
  const handleContentCreate = (content: ContentItem) => {
    // In a real application, this would call an API to save the content
    const newContent = {
      ...content,
      id: `content-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setContentItems(prev => [newContent, ...prev]);
    setActiveTab('browse');
    
    toast({
      title: 'Content Created',
      description: 'The content has been created successfully',
    });
  };

  // Handle content update
  const handleContentUpdate = (content: ContentItem) => {
    // In a real application, this would call an API to update the content
    setContentItems(prev => 
      prev.map(item => item.id === content.id ? { ...content, updatedAt: new Date() } : item)
    );
    setContentToEdit(null);
    setSelectedContent(null);
    setActiveTab('browse');
    
    toast({
      title: 'Content Updated',
      description: 'The content has been updated successfully',
    });
  };

  // Handle content deletion
  const handleContentDelete = (content: ContentItem) => {
    // In a real application, this would call an API to delete the content
    setContentItems(prev => prev.filter(item => item.id !== content.id));
    
    toast({
      title: 'Content Deleted',
      description: 'The content has been deleted successfully',
    });
  };

  // Handle content selection for viewing
  const handleContentSelect = (content: ContentItem) => {
    setSelectedContent(content);
    setActiveTab('view');
  };

  // Handle content selection for editing
  const handleContentEdit = (content: ContentItem) => {
    setContentToEdit(content);
    setActiveTab('create');
  };

  // Handle content duplication
  const handleContentCopy = (content: ContentItem) => {
    const copiedContent = {
      ...content,
      id: `content-${Date.now()}`,
      title: `Copy of ${content.title}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setContentItems(prev => [copiedContent, ...prev]);
    
    toast({
      title: 'Content Duplicated',
      description: 'The content has been duplicated successfully',
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground mt-1">
            Create, manage, and organize curriculum content for all learning styles
          </p>
        </div>
        
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button 
            onClick={() => {
              setContentToEdit(null);
              setActiveTab('create');
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Content
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="browse" onClick={() => setSelectedContent(null)}>
            <Library className="h-4 w-4 mr-2" />
            Browse Content
          </TabsTrigger>
          <TabsTrigger value="create">
            <Plus className="h-4 w-4 mr-2" />
            {contentToEdit ? 'Edit Content' : 'Create Content'}
          </TabsTrigger>
          {selectedContent && (
            <TabsTrigger value="view">
              View Content
            </TabsTrigger>
          )}
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse">
          <ContentBrowser 
            initialItems={contentItems}
            onItemSelect={handleContentSelect}
            onItemEdit={handleContentEdit}
            onItemDelete={handleContentDelete}
            onItemCopy={handleContentCopy}
          />
        </TabsContent>
        
        <TabsContent value="create">
          <ContentCreator 
            initialContent={contentToEdit || undefined}
            curriculumStandards={mockCurriculumStandards}
            onSave={contentToEdit ? handleContentUpdate : handleContentCreate}
            onPreview={(content) => {
              setSelectedContent(content);
              setActiveTab('view');
            }}
          />
        </TabsContent>
        
        <TabsContent value="view">
          {selectedContent && (
            <ContentViewer 
              content={selectedContent}
              onBack={() => {
                setActiveTab('browse');
                setSelectedContent(null);
              }}
              onEdit={handleContentEdit}
            />
          )}
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Content Management Settings</h2>
            <p className="text-muted-foreground">
              Settings panel for content management will be implemented in a future update.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
