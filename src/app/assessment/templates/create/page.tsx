'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import { SimpleTabs  } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';

export default function CreateAssessmentTemplatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [templateTitle, setTemplateTitle] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState('');

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch('/api/assessment?owned=true');
        
        if (!response.ok) {
          throw new Error('Failed to fetch assessments');
        }
        
        const data = await response.json();
        setAssessments(data);
      } catch (err) {
        console.error('Error fetching assessments:', err);
        setError('An error occurred while fetching your assessments');
      }
    };
    
    fetchAssessments();
  }, []);

  const handleSelectAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setTemplateTitle(assessment.title);
    setTemplateDescription(assessment.description || '');
  };

  const handleCreateTemplate = async () => {
    if (!selectedAssessment) {
      setError('Please select an assessment to create a template from');
      return;
    }

    if (!templateTitle.trim()) {
      setError('Please provide a title for the template');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare the template data
      const templateData = {
        title: templateTitle,
        description: templateDescription,
        subject: selectedAssessment.subject,
        keyStage: selectedAssessment.keyStage,
        type: selectedAssessment.type,
        isPublic: isPublic,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        assessment: selectedAssessment
      };

      // Create the template
      const response = await fetch('/api/assessment/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create template');
      }

      // Redirect to templates page
      router.push('/assessment/templates');
    } catch (err) {
      console.error('Error creating template:', err);
      setError(err.message || 'An error occurred while creating the template');
    } finally {
      setLoading(false);
    }
  };

  const renderDetailsTab = () => {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Create Assessment Template</h2>
          <p className="text-grey-600">
            Create a reusable template from an existing assessment. Templates can be used to quickly create new assessments with the same structure.
          </p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Template Details</h3>
          </CardHeader>
          <CardContent>
            <Form className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-grey-700">Template Title</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={templateTitle}
                  onChange={(e) => setTemplateTitle(e.target.value)}
                  placeholder="Enter a title for your template"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-grey-700">Description</label>
                <textarea
                  className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Describe what this template is for and how it should be used"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-grey-700">Tags (comma separated)</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., formative, science, year 7"
                />
              </div>

              <div className="flex items-centre">
                <input
                  id="is-public"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-grey-300 rounded"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                <label htmlFor="is-public" className="ml-2 block text-sm text-grey-900">
                  Make this template public (available to all users)
                </label>
              </div>
            </Form>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => router.push('/assessment/templates')}
          >
            Cancel
          </Button>
          <Button
            onClick={() => setActiveTab('select-assessment')}
            disabled={!templateTitle.trim()}
          >
            Next: Select Assessment
          </Button>
        </div>
      </div>
    );
  };

  const renderSelectAssessmentTab = () => {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Select Assessment</h2>
          <p className="text-grey-600">
            Choose an existing assessment to use as the basis for your template.
          </p>
        </div>

        {assessments.length === 0 ? (
          <div className="text-centre py-12">
            <p className="text-grey-500 mb-4">You don't have any assessments yet.</p>
            <Button onClick={() => router.push('/assessment/create')}>
              Create an Assessment
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <Card 
                key={assessment.id} 
                className={`cursor-pointer transition-all ${
                  selectedAssessment?.id === assessment.id 
                    ? 'border-indigo-500 ring-2 ring-indigo-200' 
                    : 'hover:border-grey-300'
                }`}
                onClick={() => handleSelectAssessment(assessment)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">{assessment.title}</h3>
                      <p className="text-sm text-grey-600 mt-1">{assessment.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                          <span className="text-grey-500">Subject:</span>{' '}
                          <span className="font-medium">{assessment.subject}</span>
                        </div>
                        <div>
                          <span className="text-grey-500">Key Stage:</span>{' '}
                          <span className="font-medium">{assessment.keyStage}</span>
                        </div>
                        <div>
                          <span className="text-grey-500">Type:</span>{' '}
                          <span className="font-medium">{assessment.type}</span>
                        </div>
                        <div>
                          <span className="text-grey-500">Questions:</span>{' '}
                          <span className="font-medium">{assessment.questions?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    {selectedAssessment?.id === assessment.id && (
                      <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-semibold">
                        Selected
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setActiveTab('details')}
          >
            Back
          </Button>
          
          <Button
            onClick={handleCreateTemplate}
            disabled={loading || !selectedAssessment}
          >
            {loading ? <Spinner size="sm" /> : 'Create Template'}
          </Button>
        </div>

        {error && (
          <Alert type="error" className="mt-4">
            {error}
          </Alert>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-centre justify-between">
          <h1 className="text-2xl font-bold text-grey-900">Create Assessment Template</h1>
          <Button
            variant="outline"
            onClick={() => router.push('/assessment/templates')}
          >
            Back to Templates
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <SimpleTabs
            tabs={[
              { id: 'details', label: 'Template Details' },
              { id: 'select-assessment', label: 'Select Assessment' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="mb-6"
          />

          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'select-assessment' && renderSelectAssessmentTab()}
        </CardContent>
      </Card>
    </div>
  );
}
