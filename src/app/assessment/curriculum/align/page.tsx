'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import { Tabs } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';

interface CurriculumStandard {
  id: string;
  code: string;
  description: string;
  subject: string;
  keyStage: string;
  year: string;
  category: string;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  subject: string;
  keyStage: string;
  type: string;
  questionCount: number;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
}

// Component to handle search params with Suspense
function AlignAssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const standardId = searchParams.get('standard');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [standard, setStandard] = useState<CurriculumStandard | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssessments, setSelectedAssessments] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the curriculum standard
        if (standardId) {
          const standardResponse = await fetch(`/api/curriculum/standards/${standardId}`);
          
          if (!standardResponse.ok) {
            throw new Error('Failed to fetch curriculum standard');
          }
          
          const standardData = await standardResponse.json();
          setStandard(standardData);
          
          // Fetch assessments matching the standard's subject and key stage
          const assessmentsResponse = await fetch(`/api/assessment?subject=${standardData.subject}&keyStage=${standardData.keyStage}`);
          
          if (!assessmentsResponse.ok) {
            throw new Error('Failed to fetch assessments');
          }
          
          const assessmentsData = await assessmentsResponse.json();
          setAssessments(assessmentsData);
          setFilteredAssessments(assessmentsData);
          
          // Fetch already aligned assessments
          const alignedResponse = await fetch(`/api/curriculum/standards/${standardId}/assessments`);
          
          if (alignedResponse.ok) {
            const alignedData = await alignedResponse.json();
            setSelectedAssessments(alignedData.map(a => a.id));
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [standardId]);

  useEffect(() => {
    // Filter assessments based on search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = assessments.filter(assessment => 
        assessment.title.toLowerCase().includes(query) || 
        assessment.description?.toLowerCase().includes(query)
      );
      setFilteredAssessments(filtered);
    } else {
      setFilteredAssessments(assessments);
    }
  }, [assessments, searchQuery]);

  const handleToggleAssessment = (assessmentId: string) => {
    setSelectedAssessments(prev => {
      if (prev.includes(assessmentId)) {
        return prev.filter(id => id !== assessmentId);
      } else {
        return [...prev, assessmentId];
      }
    });
  };

  const handleSaveAlignment = async () => {
    if (!standard) return;
    
    setSaving(true);
    setError('');

    try {
      // Save the alignment
      const response = await fetch(`/api/curriculum/standards/${standard.id}/assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentIds: selectedAssessments,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save alignment');
      }

      // Redirect back to curriculum page
      router.push('/assessment/curriculum');
    } catch (err) {
      console.error('Error saving alignment:', err);
      setError(err.message || 'An error occurred while saving the alignment');
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

  if (!standard) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error">
          Curriculum standard not found or you don't have permission to access it.
        </Alert>
        <div className="mt-4">
          <Button onClick={() => router.push('/assessment/curriculum')}>
            Back to Curriculum Standards
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-centre justify-between">
          <h1 className="text-2xl font-bold text-grey-900">Align Assessments to Curriculum Standard</h1>
          <Button
            variant="outline"
            onClick={() => router.push('/assessment/curriculum')}
          >
            Back to Curriculum Standards
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Curriculum Standard</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-centre mb-2">
                  <span className="font-mono text-sm bg-grey-100 px-2 py-1 rounded mr-2">
                    {standard.code}
                  </span>
                </div>
                
                <p className="text-base">{standard.description}</p>
                
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="text-grey-500">Subject:</span>{' '}
                    <span className="font-medium">{standard.subject}</span>
                  </div>
                  <div>
                    <span className="text-grey-500">Key Stage:</span>{' '}
                    <span className="font-medium">{standard.keyStage}</span>
                  </div>
                  {standard.year && (
                    <div>
                      <span className="text-grey-500">Year:</span>{' '}
                      <span className="font-medium">{standard.year}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-grey-500">Category:</span>{' '}
                    <span className="font-medium">{standard.category}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Select Assessments</h2>
              <p className="text-grey-600">
                Choose assessments to align with this curriculum standard.
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search assessments..."
                  className="w-full px-4 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {filteredAssessments.length === 0 ? (
                <div className="text-centre py-6">
                  <p className="text-grey-500">
                    No assessments found matching this subject and key stage.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {filteredAssessments.map((assessment) => (
                    <div 
                      key={assessment.id} 
                      className={`border rounded-md p-4 cursor-pointer transition-all ${
                        selectedAssessments.includes(assessment.id) 
                          ? 'border-indigo-500 bg-indigo-50' 
                          : 'hover:border-grey-300'
                      }`}
                      onClick={() => handleToggleAssessment(assessment.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{assessment.title}</h3>
                          {assessment.description && (
                            <p className="text-sm text-grey-600 mt-1">{assessment.description}</p>
                          )}
                          <div className="flex items-centre mt-2 text-xs text-grey-500">
                            <span className="mr-2">{assessment.type}</span>
                            <span className="mr-2">•</span>
                            <span>{assessment.questionCount} questions</span>
                          </div>
                        </div>
                        
                        <div className="flex items-centre">
                          <input
                            type="checkbox"
                            checked={selectedAssessments.includes(assessment.id)}
                            onChange={() => {}} // Handled by the div click
                            onClick={(e) => e.stopPropagation()}
                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-grey-300 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex justify-between items-centre w-full">
                <div className="text-sm text-grey-500">
                  {selectedAssessments.length} assessment(s) selected
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/assessment/curriculum')}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveAlignment}
                    disabled={saving}
                  >
                    {saving ? <Spinner size="sm" /> : 'Save Alignment'}
                  </Button>
                </div>
              </div>
              
              {error && (
                <Alert type="error" className="mt-4 w-full">
                  {error}
                </Alert>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function AlignAssessmentPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-centre items-centre min-h-screen">
        <Spinner size="lg" />
      </div>
    }>
      <AlignAssessmentContent />
    </Suspense>
  );
}
