'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Star,
  Lightbulb,
  BarChart,
  Lock,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';

// Import personalized learning path components
import PersonalizedPathGenerator from './components/PersonalizedPathGenerator';
import { KeyStage, Subject, LearningPath, TopicStatus } from '@/lib/learning-path';

export default function LearningPathPage() {
  const [selectedSubject, setSelectedSubject] = useState('maths');
  const [personalizedPath, setPersonalizedPath] = useState<LearningPath | null>(null);
  
  // Mock user ID - in a real implementation, this would come from authentication
  const mockUserId = 'user-123';
  
  // Handle path generation completion
  const handlePathGenerated = (path: LearningPath) => {
    setPersonalizedPath(path);
    console.log('Personalized path generated:', path);
  };
  
  // Mock data for learning paths
  const subjects = {
    maths: {
      title: 'Mathematics - Year 7',
      progress: 68,
      units: [
        {
          id: 1,
          title: 'Number Skills',
          progress: 100,
          status: 'completed',
          topics: [
            { id: 101, title: 'Place Value', status: 'completed' },
            { id: 102, title: 'Addition and Subtraction', status: 'completed' },
            { id: 103, title: 'Multiplication and Division', status: 'completed' },
            { id: 104, title: 'Fractions', status: 'completed' },
          ]
        },
        {
          id: 2,
          title: 'Algebra Basics',
          progress: 75,
          status: 'in-progress',
          topics: [
            { id: 201, title: 'Introduction to Algebra', status: 'completed' },
            { id: 202, title: 'Expressions', status: 'completed' },
            { id: 203, title: 'Equations', status: 'completed' },
            { id: 204, title: 'Algebraic Expressions', status: 'in-progress' },
          ]
        },
        {
          id: 3,
          title: 'Geometry',
          progress: 50,
          status: 'in-progress',
          topics: [
            { id: 301, title: 'Angles', status: 'completed' },
            { id: 302, title: 'Shapes', status: 'completed' },
            { id: 303, title: 'Area and Perimeter', status: 'in-progress' },
            { id: 304, title: 'Transformations', status: 'locked' },
          ]
        },
        {
          id: 4,
          title: 'Statistics',
          progress: 0,
          status: 'locked',
          topics: [
            { id: 401, title: 'Data Collection', status: 'locked' },
            { id: 402, title: 'Representing Data', status: 'locked' },
            { id: 403, title: 'Averages', status: 'locked' },
            { id: 404, title: 'Probability', status: 'locked' },
          ]
        }
      ]
    },
    english: {
      title: 'English - Year 7',
      progress: 42,
      units: [
        {
          id: 1,
          title: 'Reading Comprehension',
          progress: 100,
          status: 'completed',
          topics: [
            { id: 101, title: 'Understanding Text', status: 'completed' },
            { id: 102, title: 'Identifying Themes', status: 'completed' },
            { id: 103, title: 'Character Analysis', status: 'completed' },
            { id: 104, title: 'Context and Setting', status: 'completed' },
          ]
        },
        {
          id: 2,
          title: 'Writing Skills',
          progress: 50,
          status: 'in-progress',
          topics: [
            { id: 201, title: 'Narrative Writing', status: 'completed' },
            { id: 202, title: 'Descriptive Writing', status: 'completed' },
            { id: 203, title: 'Persuasive Writing', status: 'in-progress' },
            { id: 204, title: 'Poetry', status: 'locked' },
          ]
        },
        {
          id: 3,
          title: 'Grammar and Punctuation',
          progress: 25,
          status: 'in-progress',
          topics: [
            { id: 301, title: 'Sentence Structure', status: 'completed' },
            { id: 302, title: 'Punctuation', status: 'in-progress' },
            { id: 303, title: 'Parts of Speech', status: 'locked' },
            { id: 304, title: 'Tenses', status: 'locked' },
          ]
        },
        {
          id: 4,
          title: 'Speaking and Listening',
          progress: 0,
          status: 'locked',
          topics: [
            { id: 401, title: 'Presentations', status: 'locked' },
            { id: 402, title: 'Debates', status: 'locked' },
            { id: 403, title: 'Group Discussions', status: 'locked' },
            { id: 404, title: 'Active Listening', status: 'locked' },
          ]
        }
      ]
    },
    science: {
      title: 'Science - Year 7',
      progress: 89,
      units: [
        {
          id: 1,
          title: 'Biology Basics',
          progress: 100,
          status: 'completed',
          topics: [
            { id: 101, title: 'Cells', status: 'completed' },
            { id: 102, title: 'Organisms', status: 'completed' },
            { id: 103, title: 'Ecosystems', status: 'completed' },
            { id: 104, title: 'Human Body', status: 'completed' },
          ]
        },
        {
          id: 2,
          title: 'Chemistry Fundamentals',
          progress: 100,
          status: 'completed',
          topics: [
            { id: 201, title: 'Elements and Compounds', status: 'completed' },
            { id: 202, title: 'Chemical Reactions', status: 'completed' },
            { id: 203, title: 'Acids and Alkalis', status: 'completed' },
            { id: 204, title: 'Materials', status: 'completed' },
          ]
        },
        {
          id: 3,
          title: 'Physics Concepts',
          progress: 75,
          status: 'in-progress',
          topics: [
            { id: 301, title: 'Forces', status: 'completed' },
            { id: 302, title: 'Energy', status: 'completed' },
            { id: 303, title: 'Light and Sound', status: 'completed' },
            { id: 304, title: 'Forces and Motion', status: 'in-progress' },
          ]
        },
        {
          id: 4,
          title: 'Scientific Inquiry',
          progress: 50,
          status: 'in-progress',
          topics: [
            { id: 401, title: 'Scientific Method', status: 'completed' },
            { id: 402, title: 'Experiments', status: 'completed' },
            { id: 403, title: 'Data Analysis', status: 'in-progress' },
            { id: 404, title: 'Scientific Writing', status: 'locked' },
          ]
        }
      ]
    }
  };

  const getTopicStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getTopicStatusClass = (status) => {
    switch(status) {
      case 'completed':
        return 'text-green-500';
      case 'in-progress':
        return 'text-amber-500';
      case 'locked':
        return 'text-muted-foreground';
      default:
        return '';
    }
  };

  const currentSubject = subjects[selectedSubject];

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Learning Path</h1>
        <p className="text-muted-foreground text-lg">
          Track your progress and follow your personalised learning journey.
        </p>
      </motion.div>

      {/* Personalized Path Generator */}
      <PersonalizedPathGenerator 
        userId={mockUserId}
        subjectId={selectedSubject as Subject}
        keyStage={KeyStage.KS3}
        onPathGenerated={handlePathGenerated}
      />

      {/* Subject Selection Tabs */}
      <Tabs 
        value={selectedSubject} 
        onValueChange={setSelectedSubject}
        className="mb-8"
      >
        <TabsList className="grid grid-cols-3 mb-4 w-full max-w-md">
          <TabsTrigger value="maths" className="tab">Mathematics</TabsTrigger>
          <TabsTrigger value="english" className="tab">English</TabsTrigger>
          <TabsTrigger value="science" className="tab">Science</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Subject Overview */}
      <motion.div
        key={selectedSubject}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <Card className="card card-bordered hover:shadow-md transition-shadow">
          <CardHeader className="card-header">
            <div className="flex justify-between items-center">
              <CardTitle className="card-title text-2xl">{currentSubject.title}</CardTitle>
              <Badge className="badge badge-lg badge-primary">{currentSubject.progress}% Complete</Badge>
            </div>
          </CardHeader>
          <CardContent className="card-body">
            <div className="mb-4">
              <Progress value={currentSubject.progress} className="h-3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-3xl font-bold text-primary">{currentSubject.units.length}</div>
                <div className="text-sm text-muted-foreground">Total Units</div>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-3xl font-bold text-green-500">
                  {currentSubject.units.filter(unit => unit.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-3xl font-bold text-amber-500">
                  {currentSubject.units.filter(unit => unit.status === 'in-progress').length}
                </div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-3xl font-bold text-muted-foreground">
                  {currentSubject.units.filter(unit => unit.status === 'locked').length}
                </div>
                <div className="text-sm text-muted-foreground">Upcoming</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Learning Path Units */}
      <div className="space-y-6">
        {currentSubject.units.map((unit, index) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className={`card card-bordered hover:shadow-md transition-shadow ${
              unit.status === 'locked' ? 'opacity-70' : ''
            }`}>
              <CardHeader className="card-header">
                <div className="flex justify-between items-center">
                  <CardTitle className="card-title flex items-center">
                    {unit.status === 'completed' && (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    )}
                    {unit.status === 'in-progress' && (
                      <Clock className="h-5 w-5 text-amber-500 mr-2" />
                    )}
                    {unit.status === 'locked' && (
                      <Lock className="h-5 w-5 text-muted-foreground mr-2" />
                    )}
                    {unit.title}
                  </CardTitle>
                  <Badge className={`badge ${
                    unit.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    unit.status === 'in-progress' ? 'bg-amber-100 text-amber-800' : 
                    'bg-muted text-muted-foreground'
                  }`}>
                    {unit.progress}% Complete
                  </Badge>
                </div>
                <CardDescription className="card-description">
                  Unit {index + 1} of {currentSubject.units.length}
                </CardDescription>
              </CardHeader>
              <CardContent className="card-body">
                <div className="mb-4">
                  <Progress value={unit.progress} className={`h-2 ${
                    unit.status === 'completed' ? 'bg-green-100' : 
                    unit.status === 'in-progress' ? 'bg-amber-100' : 
                    'bg-muted'
                  }`} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unit.topics.map(topic => (
                    <div 
                      key={topic.id} 
                      className={`flex items-center p-3 rounded-lg border ${
                        topic.status === 'locked' ? 'border-muted bg-muted/20' : 'border-border bg-background'
                      }`}
                    >
                      {getTopicStatusIcon(topic.status)}
                      <span className={`ml-2 ${getTopicStatusClass(topic.status)}`}>
                        {topic.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="card-footer">
                {unit.status === 'locked' ? (
                  <Button disabled className="w-full btn btn-disabled">
                    Locked <Lock className="ml-2 h-4 w-4" />
                  </Button>
                ) : unit.status === 'completed' ? (
                  <Button variant="outline" className="w-full btn btn-outline" asChild>
                    <Link href={`/student/subjects/${selectedSubject}/units/${unit.id}`}>
                      Review Unit <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button className="w-full btn btn-primary" asChild>
                    <Link href={`/student/subjects/${selectedSubject}/units/${unit.id}`}>
                      Continue Unit <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-12"
      >
        <Card className="card card-bordered bg-primary/5 hover:shadow-md transition-shadow">
          <CardHeader className="card-header">
            <CardTitle className="card-title flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-primary" />
              AI Learning Recommendations
            </CardTitle>
            <CardDescription className="card-description">
              Personalised suggestions based on your learning style and progress
            </CardDescription>
          </CardHeader>
          <CardContent className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-background p-4 rounded-lg border border-border">
                <div className="flex items-start mb-3">
                  <Star className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Focus Area Suggestion</h4>
                    <p className="text-sm text-muted-foreground">
                      Based on your recent assessments, we recommend focusing on {selectedSubject === 'maths' ? 'Algebraic Expressions' : selectedSubject === 'english' ? 'Persuasive Writing' : 'Forces and Motion'}.
                    </p>
                  </div>
                </div>
                <Button size="sm" className="w-full btn btn-sm btn-primary">
                  View Resources <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </div>
              <div className="bg-background p-4 rounded-lg border border-border">
                <div className="flex items-start mb-3">
                  <BarChart className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Learning Style Insight</h4>
                    <p className="text-sm text-muted-foreground">
                      Your learning patterns show a preference for visual learning. We've adjusted your content accordingly.
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full btn btn-sm btn-outline">
                  Adjust Preferences <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
