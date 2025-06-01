'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import { Tabs } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';

export default function UseAssessmentTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [template, setTemplate] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [passingScore, setPassingScore] = useState('');
  const [allowRetakes, setAllowRetakes] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch(`/api/assessment/templates/${templateId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch template');
        }
        
        const data = await response.json();
        setTemplate(data);
        setTitle(`${data.title} - Copy`);
        setDescription(data.templateData.description || '');
        setPassingScore(data.templateData.passingScore || 70);
      } catch (err) {
        console.error('Error fetching template:', err);
        setError('An error occurred while fetching the template');
      } finally {
        setLoading(false);
      }
    };
    
    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  const handleCreateAssessment = async () => {
    if (!title.trim()) {
      setError('Please provide a title for the assessment');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (!template) {
        setError('Template not found or has been deleted');
        return;
      }
      
      // Prepare the assessment data from the template
      const assessmentData = {
        ...template.templateData,
        title: title,
        description: description,
        dueDate: dueDate || null,
        timeLimit: timeLimit ? parseInt(timeLimit) : null,
        passingScore: passingScore ? parseInt(passingScore) : 70,
        allowRetakes: allowRetakes,
        showAnswers: showAnswers,
        isTemplate: false,
        templateId: template?.id
      };

      // Create the assessment
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create assessment');
      }

      const data = await response.json();
      
      // Redirect to the assessment edit page
      router.push(`/assessment/edit/${data.id}`);
    } catch (err) {
      console.error('Error creating assessment:', err);
      setError(err.message || 'An error occurred while creating the assessment');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-centre items-centre min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="error">
          Template not found or you don't have permission to access it.
        </Alert>
        <div className="mt-4">
          <Button onClick={() => router.push('/assessment/templates')}>
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-centre justify-between">
          <h1 className="text-2xl font-bold text-grey-900">Create Assessment from Template</h1>
          <Button
            variant="outline"
            onClick={() => router.push('/assessment/templates')}
          >
            Back to Templates
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">Assessment Details</h2>
            </CardHeader>
            <CardContent>
              <Form className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-grey-700">Assessment Title</label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title for your assessment"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-grey-700">Description</label>
                  <textarea
                    className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this assessment is for"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-grey-700">Due Date (Optional)</label>
                    <input
                      type="datetime-local"
                      className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-grey-700">Time Limit (Minutes, Optional)</label>
                    <input
                      type="number"
                      min="0"
                      className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(e.target.value)}
                      placeholder="No time limit"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-grey-700">Passing Score (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={passingScore}
                      onChange={(e) => setPassingScore(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-centre">
                    <input
                      id="allow-retakes"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-grey-300 rounded"
                      checked={allowRetakes}
                      onChange={(e) => setAllowRetakes(e.target.checked)}
                    />
                    <label htmlFor="allow-retakes" className="ml-2 block text-sm text-grey-900">
                      Allow students to retake this assessment
                    </label>
                  </div>
                  
                  <div className="flex items-centre mt-2">
                    <input
                      id="show-answers"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-grey-300 rounded"
                      checked={showAnswers}
                      onChange={(e) => setShowAnswers(e.target.checked)}
                    />
                    <label htmlFor="show-answers" className="ml-2 block text-sm text-grey-900">
                      Show correct answers after submission
                    </label>
                  </div>
                </div>
              </Form>
            </CardContent>
            <CardFooter>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/assessment/templates')}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateAssessment}
                  disabled={saving || !title.trim()}
                >
                  {saving ? <Spinner size="sm" /> : 'Create Assessment'}
                </Button>
              </div>
              
              {error && (
                <Alert variant="error" className="mt-4 w-full">
                  {error}
                </Alert>
              )}
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Template Information</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{template.title}</h3>
                  <p className="text-sm text-grey-600 mt-1">{template.description}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="text-grey-500">Subject:</span>{' '}
                    <span className="font-medium">{template.subject}</span>
                  </div>
                  <div>
                    <span className="text-grey-500">Key Stage:</span>{' '}
                    <span className="font-medium">{template.keyStage}</span>
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
                
                {template.tags && template.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-grey-700 mb-2">Tags:</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs rounded-full bg-grey-100 text-grey-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-grey-500 pt-2 border-t">
                  Created by {template.createdBy?.name || 'Unknown'} on {new Date(template.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
