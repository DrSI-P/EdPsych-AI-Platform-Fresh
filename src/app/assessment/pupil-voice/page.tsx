'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { PupilVoiceSurvey } from '@/types/assessment';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';

export default function PupilVoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('surveys');
  const [surveys, setSurveys] = useState<PupilVoiceSurvey[]>([]);
  const [filteredSurveys, setFilteredSurveys] = useState<PupilVoiceSurvey[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('/api/assessment/pupil-voice');
        
        if (!response.ok) {
          throw new Error('Failed to fetch pupil voice surveys');
        }
        
        const data = await response.json();
        setSurveys(data);
        setFilteredSurveys(data);
      } catch (err) {
        console.error('Error fetching pupil voice surveys:', err);
        setError('An error occurred while fetching the pupil voice surveys');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurveys();
  }, []);

  useEffect(() => {
    // Filter surveys based on search query and status
    let filtered = [...surveys];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((survey: PupilVoiceSurvey) =>
        survey.title.toLowerCase().includes(query) ||
        survey.description?.toLowerCase().includes(query)
      );
    }
    
    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((survey: PupilVoiceSurvey) => survey.status === selectedStatus);
    }
    
    setFilteredSurveys(filtered);
  }, [surveys, searchQuery, selectedStatus]);

  const handleCreateSurvey = () => {
    router.push('/assessment/pupil-voice/create');
  };

  const handleViewResults = (surveyId: string) => {
    router.push(`/assessment/pupil-voice/results/${surveyId}`);
  };

  const handleEditSurvey = (surveyId: string) => {
    router.push(`/assessment/pupil-voice/edit/${surveyId}`);
  };

  const handlePreviewSurvey = (surveyId: string) => {
    router.push(`/assessment/pupil-voice/preview/${surveyId}`);
  };

  const renderSurveysTab = () => {
    if (loading) {
      return (
        <div className="flex justify-centre items-centre py-12">
          <Spinner size="lg" />
        </div>
      );
    }

    if (filteredSurveys.length === 0) {
      return (
        <div className="text-centre py-12">
          <p className="text-grey-500 mb-4">No pupil voice surveys found matching your criteria.</p>
          <Button onClick={handleCreateSurvey}>
            Create New Survey
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredSurveys.map((survey: PupilVoiceSurvey) => (
          <Card key={survey.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <h3 className="text-lg font-medium">{survey.title}</h3>
                  {survey.description && (
                    <p className="text-sm text-grey-600 mt-1">{survey.description}</p>
                  )}
                  <div className="flex items-centre mt-2 text-xs text-grey-500">
                    <span className="mr-2">{survey.questionCount} questions</span>
                    <span className="mr-2">•</span>
                    <span>{survey.responseCount} responses</span>
                    <span className="mr-2">•</span>
                    <span>Created {new Date(survey.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      survey.status === 'draft' 
                        ? 'bg-grey-100 text-grey-800' 
                        : survey.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {survey.status === 'draft' 
                        ? 'Draft' 
                        : survey.status === 'active' 
                        ? 'Active' 
                        : 'Completed'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {survey.status !== 'draft' && (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewResults(survey.id)}
                    >
                      View Results
                    </Button>
                  )}
                  {survey.status === 'draft' && (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSurvey(survey.id)}
                    >
                      Edit
                    </Button>
                  )}
                  <Button 
                    size="sm"
                    onClick={() => handlePreviewSurvey(survey.id)}
                  >
                    {survey.status === 'draft' ? 'Preview' : 'View'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderTemplatesTab = () => {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Pupil Voice Templates</h2>
          <p className="text-grey-600">
            Use pre-designed templates to quickly create pupil voice surveys for common scenarios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium">Classroom Environment</h3>
              <p className="text-sm text-grey-600 mt-1">
                Gather feedback about the classroom environment, teaching methods, and learning experience.
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/assessment/pupil-voice/create?template=classroom')}
                >
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium">Wellbeing Check-in</h3>
              <p className="text-sm text-grey-600 mt-1">
                Monitor student wellbeing, emotional health, and identify potential support needs.
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/assessment/pupil-voice/create?template=wellbeing')}
                >
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium">Subject Feedback</h3>
              <p className="text-sm text-grey-600 mt-1">
                Collect subject-specific feedback to improve curriculum delivery and student engagement.
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/assessment/pupil-voice/create?template=subject')}
                >
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderInsightsTab = () => {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Pupil Voice Insights</h2>
          <p className="text-grey-600">
            Analyse trends and patterns across multiple pupil voice surveys to gain deeper insights.
          </p>
        </div>

        <div className="text-centre py-12">
          <p className="text-grey-500 mb-4">This feature is coming soon.</p>
          <Button onClick={() => setActiveTab('surveys')}>
            View Surveys
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-centre justify-between">
          <h1 className="text-2xl font-bold text-grey-900">Pupil Voice</h1>
          <Button
            onClick={handleCreateSurvey}
          >
            Create New Survey
          </Button>
        </div>
        <p className="mt-2 text-grey-600">
          Create and manage pupil voice surveys to gather valuable feedback from students.
        </p>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList>
            <TabsTrigger value="surveys">My Surveys</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === 'surveys' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-centre md:justify-between gap-4">
              <div className="w-full md:w-1/2">
                <input
                  type="text"
                  placeholder="Search surveys..."
                  className="w-full px-4 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/4">
                <select
                  className="w-full px-4 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {renderSurveysTab()}
          </div>
        )}

        {activeTab === 'templates' && renderTemplatesTab()}
        {activeTab === 'insights' && renderInsightsTab()}
      </div>
    </div>
  );
}
