'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DiagnosticAssessmentCreator } from '@/components/assessment/diagnostic-assessment-creator';
import { ProgressTrackingVisualization } from '@/components/assessment/progress-tracking-visualization';
import { 
  DiagnosticAssessment,
  KnowledgeArea,
  Skill,
  DiagnosticResult,
  ProgressTrackingRecord,
  ProficiencyLevel
} from '@/lib/assessment/diagnosticAssessmentTypes';
import { UKKeyStage, UKSubject, DifficultyLevel, CognitiveDomain } from '@/lib/assessment/types';

// Mock data for demonstration purposes
const mockKnowledgeAreas: KnowledgeArea[] = [
  {
    id: 'ka-1',
    name: 'Reading Comprehension',
    description: 'Understanding and interpreting written text',
    subject: UKSubject.ENGLISH,
    keyStage: UKKeyStage.KS2,
    curriculumReferences: ['EN2-1', 'EN2-2']
  },
  {
    id: 'ka-2',
    name: 'Grammar and Punctuation',
    description: 'Understanding and applying grammatical rules and punctuation',
    subject: UKSubject.ENGLISH,
    keyStage: UKKeyStage.KS2,
    curriculumReferences: ['EN2-3', 'EN2-4']
  },
  {
    id: 'ka-3',
    name: 'Number and Place Value',
    description: 'Understanding number systems and place value concepts',
    subject: UKSubject.MATHEMATICS,
    keyStage: UKKeyStage.KS2,
    curriculumReferences: ['MA2-1', 'MA2-2']
  },
  {
    id: 'ka-4',
    name: 'Addition and Subtraction',
    description: 'Performing addition and subtraction operations',
    subject: UKSubject.MATHEMATICS,
    keyStage: UKKeyStage.KS2,
    curriculumReferences: ['MA2-3', 'MA2-4']
  },
  {
    id: 'ka-5',
    name: 'Scientific Inquiry',
    description: 'Understanding the scientific method and conducting investigations',
    subject: UKSubject.SCIENCE,
    keyStage: UKKeyStage.KS2,
    curriculumReferences: ['SC2-1', 'SC2-2']
  }
];

const mockSkills: Skill[] = [
  {
    id: 'skill-1',
    name: 'Critical Thinking',
    description: 'Analyzing information and forming reasoned judgments',
    category: 'cognitive',
    developmentalStages: [
      {
        keyStage: UKKeyStage.KS2,
        expectedLevel: 3,
        description: 'Can analyze simple problems and identify potential solutions'
      }
    ]
  },
  {
    id: 'skill-2',
    name: 'Communication',
    description: 'Expressing ideas clearly and effectively',
    category: 'social',
    developmentalStages: [
      {
        keyStage: UKKeyStage.KS2,
        expectedLevel: 3,
        description: 'Can communicate ideas clearly in various contexts'
      }
    ]
  },
  {
    id: 'skill-3',
    name: 'Self-Regulation',
    description: 'Managing emotions and behavior appropriately',
    category: 'emotional',
    developmentalStages: [
      {
        keyStage: UKKeyStage.KS2,
        expectedLevel: 3,
        description: 'Can identify emotions and use strategies to manage them'
      }
    ]
  },
  {
    id: 'skill-4',
    name: 'Fine Motor Skills',
    description: 'Coordinating small muscle movements',
    category: 'physical',
    developmentalStages: [
      {
        keyStage: UKKeyStage.KS2,
        expectedLevel: 4,
        description: 'Can perform precise movements with good control'
      }
    ]
  },
  {
    id: 'skill-5',
    name: 'Digital Literacy',
    description: 'Using digital tools effectively and responsibly',
    category: 'technical',
    developmentalStages: [
      {
        keyStage: UKKeyStage.KS2,
        expectedLevel: 3,
        description: 'Can use basic digital tools and understand online safety'
      }
    ]
  }
];

// Mock diagnostic results
const mockDiagnosticResults: DiagnosticResult[] = [
  {
    id: 'result-1',
    studentId: 'student-1',
    assessmentId: 'assessment-1',
    startTime: new Date('2025-05-01T10:00:00Z'),
    endTime: new Date('2025-05-01T11:00:00Z'),
    totalScore: 75,
    maxPossibleScore: 100,
    percentage: 75,
    timeSpent: 3600,
    responses: [],
    knowledgeAreaResults: [
      {
        knowledgeAreaId: 'ka-1',
        score: 80,
        maxPossibleScore: 100,
        percentage: 80,
        proficiencyLevel: ProficiencyLevel.MEETING,
        strengths: ['Strong vocabulary comprehension'],
        weaknesses: ['Difficulty with inferential questions']
      },
      {
        knowledgeAreaId: 'ka-2',
        score: 70,
        maxPossibleScore: 100,
        percentage: 70,
        proficiencyLevel: ProficiencyLevel.MEETING,
        strengths: ['Good understanding of basic punctuation'],
        weaknesses: ['Struggles with complex sentence structures']
      }
    ],
    skillResults: [
      {
        skillId: 'skill-1',
        score: 75,
        maxPossibleScore: 100,
        percentage: 75,
        proficiencyLevel: ProficiencyLevel.MEETING,
        observations: ['Shows good analytical thinking']
      },
      {
        skillId: 'skill-2',
        score: 80,
        maxPossibleScore: 100,
        percentage: 80,
        proficiencyLevel: ProficiencyLevel.MEETING,
        observations: ['Communicates ideas clearly']
      }
    ],
    identifiedGaps: [],
    recommendations: [
      {
        type: 'resource',
        title: 'Reading Comprehension Practice',
        description: 'Interactive exercises to improve inferential reading skills',
        priority: 'medium',
        targetGapIds: []
      },
      {
        type: 'activity',
        title: 'Grammar Workshop',
        description: 'Focused activities on complex sentence structures',
        priority: 'medium',
        targetGapIds: []
      }
    ],
    nextSteps: [
      'Review inferential reading strategies',
      'Practice complex sentence structures',
      'Schedule follow-up assessment in 4 weeks'
    ],
    overallProficiencyLevel: ProficiencyLevel.MEETING,
    metadata: {
      averageResponseTime: 45,
      completionRate: 100,
      confidenceAccuracyCorrelation: 0.8
    }
  },
  {
    id: 'result-2',
    studentId: 'student-1',
    assessmentId: 'assessment-2',
    startTime: new Date('2025-05-15T10:00:00Z'),
    endTime: new Date('2025-05-15T11:00:00Z'),
    totalScore: 82,
    maxPossibleScore: 100,
    percentage: 82,
    timeSpent: 3600,
    responses: [],
    knowledgeAreaResults: [
      {
        knowledgeAreaId: 'ka-3',
        score: 85,
        maxPossibleScore: 100,
        percentage: 85,
        proficiencyLevel: ProficiencyLevel.EXCEEDING,
        strengths: ['Strong understanding of place value'],
        weaknesses: ['Some difficulty with large numbers']
      },
      {
        knowledgeAreaId: 'ka-4',
        score: 80,
        maxPossibleScore: 100,
        percentage: 80,
        proficiencyLevel: ProficiencyLevel.MEETING,
        strengths: ['Good mental arithmetic skills'],
        weaknesses: ['Occasional errors in multi-step problems']
      }
    ],
    skillResults: [
      {
        skillId: 'skill-1',
        score: 80,
        maxPossibleScore: 100,
        percentage: 80,
        proficiencyLevel: ProficiencyLevel.MEETING,
        observations: ['Shows improved analytical thinking']
      },
      {
        skillId: 'skill-5',
        score: 75,
        maxPossibleScore: 100,
        percentage: 75,
        proficiencyLevel: ProficiencyLevel.MEETING,
        observations: ['Good use of digital tools for problem-solving']
      }
    ],
    identifiedGaps: [],
    recommendations: [
      {
        type: 'resource',
        title: 'Multi-step Problem Practice',
        description: 'Guided practice with multi-step mathematical problems',
        priority: 'medium',
        targetGapIds: []
      },
      {
        type: 'activity',
        title: 'Place Value Challenge',
        description: 'Activities to reinforce place value with larger numbers',
        priority: 'low',
        targetGapIds: []
      }
    ],
    nextSteps: [
      'Practice multi-step mathematical problems',
      'Work with larger numbers to reinforce place value',
      'Schedule follow-up assessment in 4 weeks'
    ],
    overallProficiencyLevel: ProficiencyLevel.MEETING,
    metadata: {
      averageResponseTime: 40,
      completionRate: 100,
      confidenceAccuracyCorrelation: 0.85
    }
  }
];

// Mock progress tracking records
const mockProgressRecords: ProgressTrackingRecord[] = [
  {
    id: 'progress-1',
    studentId: 'student-1',
    knowledgeAreaId: 'ka-1',
    assessmentResults: [
      {
        assessmentId: 'assessment-1',
        resultId: 'result-1',
        date: new Date('2025-03-01T11:00:00Z'),
        score: 65,
        proficiencyLevel: ProficiencyLevel.APPROACHING
      },
      {
        assessmentId: 'assessment-1',
        resultId: 'result-1',
        date: new Date('2025-04-01T11:00:00Z'),
        score: 72,
        proficiencyLevel: ProficiencyLevel.MEETING
      },
      {
        assessmentId: 'assessment-1',
        resultId: 'result-1',
        date: new Date('2025-05-01T11:00:00Z'),
        score: 80,
        proficiencyLevel: ProficiencyLevel.MEETING
      }
    ],
    currentProficiencyLevel: ProficiencyLevel.MEETING,
    progressTrend: 'improving',
    growthRate: 7.5,
    lastUpdated: new Date('2025-05-01T11:00:00Z'),
    targetProficiencyLevel: ProficiencyLevel.MASTERY,
    interventions: [],
    notes: []
  },
  {
    id: 'progress-2',
    studentId: 'student-1',
    knowledgeAreaId: 'ka-2',
    assessmentResults: [
      {
        assessmentId: 'assessment-1',
        resultId: 'result-1',
        date: new Date('2025-03-01T11:00:00Z'),
        score: 60,
        proficiencyLevel: ProficiencyLevel.APPROACHING
      },
      {
        assessmentId: 'assessment-1',
        resultId: 'result-1',
        date: new Date('2025-04-01T11:00:00Z'),
        score: 65,
        proficiencyLevel: ProficiencyLevel.APPROACHING
      },
      {
        assessmentId: 'assessment-1',
        resultId: 'result-1',
        date: new Date('2025-05-01T11:00:00Z'),
        score: 70,
        proficiencyLevel: ProficiencyLevel.MEETING
      }
    ],
    currentProficiencyLevel: ProficiencyLevel.MEETING,
    progressTrend: 'improving',
    growthRate: 5,
    lastUpdated: new Date('2025-05-01T11:00:00Z'),
    targetProficiencyLevel: ProficiencyLevel.MASTERY,
    interventions: [],
    notes: []
  },
  {
    id: 'progress-3',
    studentId: 'student-1',
    knowledgeAreaId: 'ka-3',
    assessmentResults: [
      {
        assessmentId: 'assessment-2',
        resultId: 'result-2',
        date: new Date('2025-03-15T11:00:00Z'),
        score: 75,
        proficiencyLevel: ProficiencyLevel.MEETING
      },
      {
        assessmentId: 'assessment-2',
        resultId: 'result-2',
        date: new Date('2025-04-15T11:00:00Z'),
        score: 80,
        proficiencyLevel: ProficiencyLevel.MEETING
      },
      {
        assessmentId: 'assessment-2',
        resultId: 'result-2',
        date: new Date('2025-05-15T11:00:00Z'),
        score: 85,
        proficiencyLevel: ProficiencyLevel.EXCEEDING
      }
    ],
    currentProficiencyLevel: ProficiencyLevel.EXCEEDING,
    progressTrend: 'improving',
    growthRate: 5,
    lastUpdated: new Date('2025-05-15T11:00:00Z'),
    targetProficiencyLevel: ProficiencyLevel.MASTERY,
    interventions: [],
    notes: []
  },
  {
    id: 'progress-4',
    studentId: 'student-1',
    knowledgeAreaId: 'ka-4',
    assessmentResults: [
      {
        assessmentId: 'assessment-2',
        resultId: 'result-2',
        date: new Date('2025-03-15T11:00:00Z'),
        score: 82,
        proficiencyLevel: ProficiencyLevel.MEETING
      },
      {
        assessmentId: 'assessment-2',
        resultId: 'result-2',
        date: new Date('2025-04-15T11:00:00Z'),
        score: 78,
        proficiencyLevel: ProficiencyLevel.MEETING
      },
      {
        assessmentId: 'assessment-2',
        resultId: 'result-2',
        date: new Date('2025-05-15T11:00:00Z'),
        score: 80,
        proficiencyLevel: ProficiencyLevel.MEETING
      }
    ],
    currentProficiencyLevel: ProficiencyLevel.MEETING,
    progressTrend: 'fluctuating',
    growthRate: -1,
    lastUpdated: new Date('2025-05-15T11:00:00Z'),
    targetProficiencyLevel: ProficiencyLevel.MASTERY,
    interventions: [],
    notes: []
  },
  {
    id: 'progress-5',
    studentId: 'student-1',
    knowledgeAreaId: 'ka-5',
    assessmentResults: [
      {
        assessmentId: 'assessment-3',
        resultId: 'result-3',
        date: new Date('2025-03-30T11:00:00Z'),
        score: 70,
        proficiencyLevel: ProficiencyLevel.MEETING
      },
      {
        assessmentId: 'assessment-3',
        resultId: 'result-3',
        date: new Date('2025-04-30T11:00:00Z'),
        score: 75,
        proficiencyLevel: ProficiencyLevel.MEETING
      }
    ],
    currentProficiencyLevel: ProficiencyLevel.MEETING,
    progressTrend: 'improving',
    growthRate: 5,
    lastUpdated: new Date('2025-04-30T11:00:00Z'),
    targetProficiencyLevel: ProficiencyLevel.MASTERY,
    interventions: [],
    notes: []
  },
  {
    id: 'progress-6',
    studentId: 'student-1',
    skillId: 'skill-1',
    assessmentResults: [
      {
        assessmentId: 'assessment-1',
        resultId: 'result-1',
        date: new Date('2025-03-01T11:00:00Z'),
        score: 70,
        proficiencyLevel: ProficiencyLevel.MEETING
      },
      {
        assessmentId: 'assessment-2',
        resultId: 'result-2',
        date: new Date('2025-05-15T11:00:00Z'),
        score: 80,
        proficiencyLevel: ProficiencyLevel.MEETING
      }
    ],
    currentProficiencyLevel: ProficiencyLevel.MEETING,
    progressTrend: 'improving',
    growthRate: 5,
    lastUpdated: new Date('2025-05-15T11:00:00Z'),
    targetProficiencyLevel: ProficiencyLevel.MASTERY,
    interventions: [],
    notes: []
  },
  {
    id: 'progress-7',
    studentId: 'student-1',
    skillId: 'skill-2',
    assessmentResults: [
      {
        assessmentId: 'assessment-1',
        resultId: 'result-1',
        date: new Date('2025-03-01T11:00:00Z'),
        score: 75,
        proficiencyLevel: ProficiencyLevel.MEETING
      },
      {
        assessmentId: 'assessment-1',
        resultId: 'result-1',
        date: new Date('2025-05-01T11:00:00Z'),
        score: 80,
        proficiencyLevel: ProficiencyLevel.MEETING
      }
    ],
    currentProficiencyLevel: ProficiencyLevel.MEETING,
    progressTrend: 'improving',
    growthRate: 2.5,
    lastUpdated: new Date('2025-05-01T11:00:00Z'),
    targetProficiencyLevel: ProficiencyLevel.MASTERY,
    interventions: [],
    notes: []
  },
  {
    id: 'progress-8',
    studentId: 'student-1',
    skillId: 'skill-5',
    assessmentResults: [
      {
        assessmentId: 'assessment-2',
        resultId: 'result-2',
        date: new Date('2025-03-15T11:00:00Z'),
        score: 70,
        proficiencyLevel: ProficiencyLevel.MEETING
      },
      {
        assessmentId: 'assessment-2',
        resultId: 'result-2',
        date: new Date('2025-05-15T11:00:00Z'),
        score: 75,
        proficiencyLevel: ProficiencyLevel.MEETING
      }
    ],
    currentProficiencyLevel: ProficiencyLevel.MEETING,
    progressTrend: 'improving',
    growthRate: 2.5,
    lastUpdated: new Date('2025-05-15T11:00:00Z'),
    targetProficiencyLevel: ProficiencyLevel.MASTERY,
    interventions: [],
    notes: []
  }
];

export default function AssessmentPage() {
  const [activeTab, setActiveTab] = useState('progress');
  const [savedAssessment, setSavedAssessment] = useState<DiagnosticAssessment | null>(null);

  const handleSaveAssessment = (assessment: DiagnosticAssessment) => {
    console.log('Assessment saved:', assessment);
    setSavedAssessment(assessment);
  };

  const handlePreviewAssessment = (assessment: DiagnosticAssessment) => {
    console.log('Assessment preview:', assessment);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Assessment & Progress Tracking</h1>
      
      <Tabs defaultValue="progress" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          <TabsTrigger value="create">Create Assessment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="progress" className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Learning Progress</CardTitle>
              <CardDescription>
                Track your progress across subjects and skills with detailed analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressTrackingVisualization
                studentId="student-1"
                progressRecords={mockProgressRecords}
                knowledgeAreas={mockKnowledgeAreas}
                skills={mockSkills}
                diagnosticResults={mockDiagnosticResults}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="create" className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create Diagnostic Assessment</CardTitle>
              <CardDescription>
                Design comprehensive assessments aligned with UK curriculum standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DiagnosticAssessmentCreator
                knowledgeAreas={mockKnowledgeAreas}
                skills={mockSkills}
                onSave={handleSaveAssessment}
                onPreview={handlePreviewAssessment}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
