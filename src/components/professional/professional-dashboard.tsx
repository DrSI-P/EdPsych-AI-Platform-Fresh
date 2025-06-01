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

interface ProfessionalDashboardProps {
  className?: string;
}

export function ProfessionalDashboard({
  className = ''
}: ProfessionalDashboardProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Mock data for demonstration
  const [professionalData, setProfessionalData] = useState({
    name: 'Dr. Sarah Johnson',
    role: 'Educational Psychologist',
    organisation: 'Oakwood Educational Services',
    caseload: [
      {
        id: '1',
        name: 'Emma Thompson',
        age: 13,
        year: 'Year 8',
        school: 'Oakwood Secondary School',
        status: 'active',
        lastAssessment: '2025-05-10',
        nextSession: '2025-05-20',
        concerns: ['Reading comprehension', 'Attention difficulties'],
        notes: 'Emma has shown improvement in reading fluency but continues to struggle with comprehension. Working on strategies to improve focus during reading tasks.'
      },
      {
        id: '2',
        name: 'Oliver Williams',
        age: 9,
        year: 'Year 5',
        school: 'Oakwood Primary School',
        status: 'active',
        lastAssessment: '2025-05-12',
        nextSession: '2025-05-22',
        concerns: ['Mathematical reasoning', 'Anxiety around assessments'],
        notes: 'Oliver demonstrates good numerical skills but struggles with word problems. Working on reducing assessment anxiety through gradual exposure and relaxation techniques.'
      },
      {
        id: '3',
        name: 'Sophia Chen',
        age: 15,
        year: 'Year 10',
        school: 'Oakwood Secondary School',
        status: 'review',
        lastAssessment: '2025-04-28',
        nextSession: '2025-05-25',
        concerns: ['Exam stress', 'Organisation skills'],
        notes: 'Sophia is experiencing increased anxiety about upcoming GCSEs. Working on organisation strategies and stress management techniques.'
      },
      {
        id: '4',
        name: 'James Wilson',
        age: 7,
        year: 'Year 3',
        school: 'Oakwood Primary School',
        status: 'new',
        lastAssessment: 'N/A',
        nextSession: '2025-05-18',
        concerns: ['Phonological awareness', 'Fine motor skills'],
        notes: 'Initial assessment scheduled. Teacher reports concerns about reading development and handwriting.'
      }
    ],
    assessments: [
      {
        id: '1',
        studentName: 'Emma Thompson',
        date: '2025-05-10',
        type: 'Reading Assessment',
        scores: {
          fluency: 82,
          accuracy: 78,
          comprehension: 65,
          vocabulary: 72
        },
        recommendations: 'Continue with targeted comprehension strategies. Implement text-to-speech technology for complex texts. Regular reading practise with comprehension questions.'
      },
      {
        id: '2',
        studentName: 'Oliver Williams',
        date: '2025-05-12',
        type: 'Mathematics Assessment',
        scores: {
          number: 85,
          operations: 82,
          wordProblems: 68,
          geometry: 76
        },
        recommendations: 'Focus on word problem strategies. Use visual aids to support mathematical reasoning. Implement anxiety reduction techniques before assessments.'
      }
    ],
    reports: [
      {
        id: '1',
        studentName: 'Emma Thompson',
        date: '2025-05-11',
        type: 'Progress Report',
        status: 'draft',
        lastEdited: '2025-05-15'
      },
      {
        id: '2',
        studentName: 'Sophia Chen',
        date: '2025-04-30',
        type: 'Intervention Plan',
        status: 'completed',
        lastEdited: '2025-05-02'
      }
    ],
    resources: [
      {
        id: '1',
        title: 'Reading Comprehension Strategies',
        type: 'intervention',
        targetAreas: ['Reading comprehension', 'Attention'],
        ageRange: '11-14',
        description: 'A collection of evidence-based strategies to improve reading comprehension, with specific adaptations for students with attention difficulties.'
      },
      {
        id: '2',
        title: 'Mathematics Anxiety Toolkit',
        type: 'intervention',
        targetAreas: ['Mathematics', 'Anxiety'],
        ageRange: '7-11',
        description: 'Resources and activities to reduce mathematics anxiety and build confidence in mathematical reasoning.'
      },
      {
        id: '3',
        title: 'Executive Function Assessment',
        type: 'assessment',
        targetAreas: ['Organisation', 'Planning', 'Working memory'],
        ageRange: '14-16',
        description: 'Comprehensive assessment tools for evaluating executive function skills in adolescents.'
      }
    ],
    schedule: [
      {
        id: '1',
        title: 'Assessment: James Wilson',
        date: '2025-05-18',
        time: '09:30 - 11:00',
        location: 'Oakwood Primary School',
        type: 'assessment'
      },
      {
        id: '2',
        title: 'Session: Emma Thompson',
        date: '2025-05-20',
        time: '13:30 - 14:30',
        location: 'Oakwood Secondary School',
        type: 'session'
      },
      {
        id: '3',
        title: 'Session: Oliver Williams',
        date: '2025-05-22',
        time: '10:00 - 11:00',
        location: 'Oakwood Primary School',
        type: 'session'
      },
      {
        id: '4',
        title: 'Review Meeting: Sophia Chen',
        date: '2025-05-25',
        time: '15:00 - 16:00',
        location: 'Oakwood Secondary School',
        type: 'meeting'
      }
    ]
  });
  
  // Fetch data on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  
  // Handle AI report generation
  const handleGenerateReport = (aiResponse: string) => {
    showToast({
      title: 'Report draft generated successfully',
      type: 'success'
    });
  };
  
  // Handle AI intervention suggestion
  const handleInterventionSuggestion = (aiResponse: string) => {
    showToast({
      title: 'Intervention suggestions generated successfully',
      type: 'success'
    });
  };
  
  // Define the tabs
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      content: (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-centre py-8">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="error">
              {error}
            </Alert>
          ) : (
            <>
              <div className="flex justify-between items-centre">
                <div>
                  <h2 className="text-xl font-semibold">Welcome, {professionalData.name}</h2>
                  <p className="text-sm text-grey-600">{professionalData.role} • {professionalData.organisation}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Today's Date</p>
                  <p className="text-sm text-grey-600">{new Date().toLocaleDateString('en-GB')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-centre">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {professionalData.caseload.length}
                      </div>
                      <p className="text-sm text-grey-600">Active Cases</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-centre">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {professionalData.schedule.filter(item => 
                          new Date(item.date).toDateString() === new Date().toDateString()
                        ).length}
                      </div>
                      <p className="text-sm text-grey-600">Appointments Today</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-centre">
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        {professionalData.reports.filter(report => report.status === 'draft').length}
                      </div>
                      <p className="text-sm text-grey-600">Reports in Progress</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Upcoming Schedule</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {professionalData.schedule
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .slice(0, 3)
                      .map(item => (
                        <div 
                          key={item.id} 
                          className={`p-3 rounded-md border hover:bg-grey-50 ${
                            item.type === 'assessment' ? 'border-blue-200' :
                            item.type === 'session' ? 'border-green-200' :
                            'border-purple-200'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{item.title}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              item.type === 'assessment' ? 'bg-blue-100 text-blue-800' :
                              item.type === 'session' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {item.type}
                            </span>
                          </div>
                          <p className="text-sm text-grey-600">
                            {item.date} • {item.time}
                          </p>
                          <p className="text-sm text-grey-600">
                            Location: {item.location}
                          </p>
                        </div>
                      ))}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline"
                      className="w-full"
                    >
                      View Full Schedule
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Recent Assessments</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {professionalData.assessments
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(assessment => (
                        <div key={assessment.id} className="p-3 rounded-md border hover:bg-grey-50">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{assessment.studentName}</h4>
                            <span className="text-xs text-grey-500">{assessment.date}</span>
                          </div>
                          <p className="text-sm text-grey-600">{assessment.type}</p>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {Object.entries(assessment.scores).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-xs">
                                <span className="capitalize">{key}:</span>
                                <span className={`font-medium ${
                                  value >= 80 ? 'text-green-600' :
                                  value >= 70 ? 'text-blue-600' :
                                  'text-orange-500'
                                }`}>
                                  {value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline"
                      className="w-full"
                    >
                      View All Assessments
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Caseload Overview</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {professionalData.caseload
                      .sort((a, b) => {
                        if (a.status === 'new' && b.status !== 'new') return -1;
                        if (a.status !== 'new' && b.status === 'new') return 1;
                        return 0;
                      })
                      .slice(0, 3)
                      .map(student => (
                        <div key={student.id} className="p-4 rounded-md border hover:bg-grey-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{student.name}</h4>
                              <p className="text-sm text-grey-600">
                                {student.age} years • {student.year} • {student.school}
                              </p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              student.status === 'new' ? 'bg-blue-100 text-blue-800' :
                              student.status === 'active' ? 'bg-green-100 text-green-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {student.status}
                            </span>
                          </div>
                          
                          <div className="mt-3 space-y-2">
                            <div>
                              <p className="text-xs font-medium text-grey-500">Areas of Concern:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {student.concerns.map((concern, index) => (
                                  <span 
                                    key={index}
                                    className="text-xs px-2 py-0.5 rounded-full bg-grey-100"
                                  >
                                    {concern}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="text-sm">
                              <p className="text-xs font-medium text-grey-500">Notes:</p>
                              <p className="text-sm mt-1">{student.notes}</p>
                            </div>
                            
                            <div className="flex justify-between text-xs text-grey-500">
                              <span>Last Assessment: {student.lastAssessment !== 'N/A' ? student.lastAssessment : 'None'}</span>
                              <span>Next Session: {student.nextSession}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex justify-end gap-2">
                            <Button 
                              size="sm"
                              variant="outline"
                            >
                              View Profile
                            </Button>
                            <Button 
                              size="sm"
                            >
                              Add Notes
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    View Full Caseload
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">AI Assistant</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Generate Report Draft</h4>
                      <AIPrompt
                        placeholder="Describe the student and assessment results for report generation..."
                        systemPrompt={`You are an educational psychology assistant helping ${professionalData.name}, a ${professionalData.role}. Generate a professional report draft based on the information provided. Follow UK educational psychology report standards and use UK English spelling. Include sections for background, assessment results, interpretation, recommendations, and next steps. Keep the tone professional and evidence-based.`}
                        onCompletion={handleGenerateReport}
                      />
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Suggest Interventions</h4>
                      <AIPrompt
                        placeholder="Describe the student's needs and current assessment results..."
                        systemPrompt={`You are an educational psychology assistant helping ${professionalData.name}, a ${professionalData.role}. Suggest evidence-based interventions based on the student information provided. Follow UK educational standards and use UK English spelling. For each suggested intervention, include: name, brief description, implementation steps, expected outcomes, and monitoring approach. Keep suggestions practical, specific, and aligned with current UK educational psychology practise.`}
                        onCompletion={handleInterventionSuggestion}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )
    },
    {
      id: 'caseload',
      label: 'Caseload',
      content: (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-centre py-8">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="error">
              {error}
            </Alert>
          ) : (
            <>
              <div className="flex justify-between items-centre">
                <h2 className="text-xl font-semibold">My Caseload</h2>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search students..."
                    className="w-64"
                  />
                  <Select
                    options={[
                      { value: 'all', label: 'All Status' },
                      { value: 'new', label: 'New' },
                      { value: 'active', label: 'Active' },
                      { value: 'review', label: 'Review' }
                    ]}
                    className="w-40"
                  />
                  <Button>
                    Add Student
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {professionalData.caseload.map(student => (
                  <Card key={student.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div className="md:flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">{student.name}</h3>
                              <p className="text-sm text-grey-600">
                                {student.age} years • {student.year} • {student.school}
                              </p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              student.status === 'new' ? 'bg-blue-100 text-blue-800' :
                              student.status === 'active' ? 'bg-green-100 text-green-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {student.status}
                            </span>
                          </div>
                          
                          <div className="mt-4 space-y-3">
                            <div>
                              <p className="text-sm font-medium text-grey-500">Areas of Concern:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {student.concerns.map((concern, index) => (
                                  <span 
                                    key={index}
                                    className="text-xs px-2 py-0.5 rounded-full bg-grey-100"
                                  >
                                    {concern}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-grey-500">Notes:</p>
                              <p className="text-sm mt-1">{student.notes}</p>
                            </div>
                            
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-grey-600">
                              <div>
                                <span className="font-medium">Last Assessment:</span> {student.lastAssessment !== 'N/A' ? student.lastAssessment : 'None'}
                              </div>
                              <div>
                                <span className="font-medium">Next Session:</span> {student.nextSession}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 md:w-48">
                          <Button className="w-full">
                            View Profile
                          </Button>
                          <Button 
                            variant="outline"
                            className="w-full"
                          >
                            Add Assessment
                          </Button>
                          <Button 
                            variant="outline"
                            className="w-full"
                          >
                            Add Notes
                          </Button>
                          <Button 
                            variant="outline"
                            className="w-full"
                          >
                            Generate Report
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      )
    },
    {
      id: 'assessments',
      label: 'Assessments',
      content: (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-centre py-8">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="error">
              {error}
            </Alert>
          ) : (
            <>
              <div className="flex justify-between items-centre">
                <h2 className="text-xl font-semibold">Assessments</h2>
                <div className="flex gap-2">
                  <Select
                    options={[
                      { value: 'all', label: 'All Types' },
                      { value: 'reading', label: 'Reading' },
                      { value: 'mathematics', label: 'Mathematics' },
                      { value: 'cognitive', label: 'Cognitive' }
                    ]}
                    className="w-40"
                  />
                  <Button>
                    New Assessment
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {professionalData.assessments.map(assessment => (
                  <Card key={assessment.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div className="md:flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">{assessment.type}</h3>
                              <p className="text-sm text-grey-600">
                                Student: {assessment.studentName} • Date: {assessment.date}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4 space-y-3">
                            <div>
                              <p className="text-sm font-medium text-grey-500">Assessment Scores:</p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                                {Object.entries(assessment.scores).map(([key, value]) => (
                                  <div 
                                    key={key} 
                                    className={`p-2 rounded-md ${
                                      value >= 80 ? 'bg-green-50 border border-green-200' :
                                      value >= 70 ? 'bg-blue-50 border border-blue-200' :
                                      'bg-orange-50 border border-orange-200'
                                    }`}
                                  >
                                    <p className="text-xs text-grey-500 capitalize">{key}</p>
                                    <p className={`text-lg font-semibold ${
                                      value >= 80 ? 'text-green-600' :
                                      value >= 70 ? 'text-blue-600' :
                                      'text-orange-500'
                                    }`}>
                                      {value}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-grey-500">Recommendations:</p>
                              <p className="text-sm mt-1">{assessment.recommendations}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 md:w-48">
                          <Button className="w-full">
                            View Details
                          </Button>
                          <Button 
                            variant="outline"
                            className="w-full"
                          >
                            Edit Assessment
                          </Button>
                          <Button 
                            variant="outline"
                            className="w-full"
                          >
                            Generate Report
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      )
    },
    {
      id: 'reports',
      label: 'Reports',
      content: (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-centre py-8">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="error">
              {error}
            </Alert>
          ) : (
            <>
              <div className="flex justify-between items-centre">
                <h2 className="text-xl font-semibold">Reports</h2>
                <div className="flex gap-2">
                  <Select
                    options={[
                      { value: 'all', label: 'All Status' },
                      { value: 'draft', label: 'Draft' },
                      { value: 'completed', label: 'Completed' }
                    ]}
                    className="w-40"
                  />
                  <Button>
                    New Report
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {professionalData.reports.map(report => (
                  <Card key={report.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div className="md:flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">{report.type}</h3>
                              <p className="text-sm text-grey-600">
                                Student: {report.studentName} • Date: {report.date}
                              </p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              report.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {report.status}
                            </span>
                          </div>
                          
                          <div className="mt-4 space-y-3">
                            <div className="flex items-centre text-sm text-grey-600">
                              <svg className="h-4 w-4 mr-1 text-grey-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Last edited: {report.lastEdited}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 md:w-48">
                          <Button className="w-full">
                            {report.status === 'draft' ? 'Edit Report' : 'View Report'}
                          </Button>
                          {report.status === 'draft' && (
                            <Button 
                              variant="outline"
                              className="w-full"
                            >
                              AI Assistance
                            </Button>
                          )}
                          {report.status === 'completed' && (
                            <Button 
                              variant="outline"
                              className="w-full"
                            >
                              Download PDF
                            </Button>
                          )}
                          <Button 
                            variant="outline"
                            className="w-full"
                          >
                            Share Report
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">AI Report Assistant</h3>
                </CardHeader>
                <CardContent>
                  <AIPrompt
                    placeholder="Describe the student and assessment results for report generation..."
                    systemPrompt={`You are an educational psychology assistant helping ${professionalData.name}, a ${professionalData.role}. Generate a professional report draft based on the information provided. Follow UK educational psychology report standards and use UK English spelling. Include sections for background, assessment results, interpretation, recommendations, and next steps. Keep the tone professional and evidence-based.`}
                    onCompletion={handleGenerateReport}
                  />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )
    },
    {
      id: 'resources',
      label: 'Resources',
      content: (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-centre py-8">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="error">
              {error}
            </Alert>
          ) : (
            <>
              <div className="flex justify-between items-centre">
                <h2 className="text-xl font-semibold">Professional Resources</h2>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search resources..."
                    className="w-64"
                  />
                  <Select
                    options={[
                      { value: 'all', label: 'All Types' },
                      { value: 'intervention', label: 'Interventions' },
                      { value: 'assessment', label: 'Assessments' }
                    ]}
                    className="w-40"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {professionalData.resources.map(resource => (
                  <Card key={resource.id} className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">{resource.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          resource.type === 'intervention' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {resource.type}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-grey-600 mb-4">
                        {resource.description}
                      </p>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-grey-500">Target Areas:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {resource.targetAreas.map((area, index) => (
                              <span 
                                key={index}
                                className="text-xs px-2 py-0.5 rounded-full bg-grey-100"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-grey-500">Age Range:</p>
                          <p className="text-sm">{resource.ageRange}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        Access Resource
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">AI Resource Finder</h3>
                </CardHeader>
                <CardContent>
                  <AIPrompt
                    placeholder="Describe the student needs and areas requiring support..."
                    systemPrompt={`You are an educational psychology assistant helping ${professionalData.name}, a ${professionalData.role}. Suggest evidence-based resources and interventions based on the student needs described. Follow UK educational psychology standards and use UK English spelling. For each suggested resource, include: name, brief description, target areas, age appropriateness, implementation approach, and expected outcomes. Focus on practical, evidence-based resources that are available in the UK educational context.`}
                    onCompletion={handleInterventionSuggestion}
                  />
                </CardContent>
              </Card>
            </>
          )}
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
