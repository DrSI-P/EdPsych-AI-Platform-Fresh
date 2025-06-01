'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BookOpen, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Star,
  Lightbulb,
  BarChart,
  Lock,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

import {
  KeyStage,
  Subject,
  LearningPath,
  TopicStatus,
  createPersonalizedLearningPath,
  fetchLearningPath
} from '@/lib/learning-path';

interface PersonalizedPathGeneratorProps {
  userId: string;
  subjectId: string;
  keyStage: KeyStage;
  onPathGenerated?: (path: LearningPath) => void;
}

export default function PersonalizedPathGenerator({
  userId,
  subjectId,
  keyStage,
  onPathGenerated
}: PersonalizedPathGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingPath, setExistingPath] = useState<LearningPath | null>(null);
  const [generatingPath, setGeneratingPath] = useState(false);

  // Check for existing path on component mount
  useEffect(() => {
    const checkExistingPath = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const path = await fetchLearningPath(userId, subjectId, keyStage);
        setExistingPath(path);
        
        if (path && onPathGenerated) {
          onPathGenerated(path);
        }
      } catch (err) {
        console.error('Error checking for existing path:', err);
        setError('Failed to check for existing learning path');
      } finally {
        setLoading(false);
      }
    };
    
    checkExistingPath();
  }, [userId, subjectId, keyStage, onPathGenerated]);

  // Handle path generation
  const handleGeneratePath = async () => {
    try {
      setGeneratingPath(true);
      setError(null);
      
      const newPath = await createPersonalizedLearningPath(userId, subjectId, keyStage);
      setExistingPath(newPath);
      
      if (onPathGenerated) {
        onPathGenerated(newPath);
      }
    } catch (err) {
      console.error('Error generating personalized path:', err);
      setError('Failed to generate personalized learning path');
    } finally {
      setGeneratingPath(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full mb-8">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (existingPath) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                Personalized Learning Path
              </CardTitle>
              <Badge variant="outline" className="bg-primary/10">
                {existingPath.overallProgress}% Complete
              </Badge>
            </div>
            <CardDescription>
              Your learning journey is tailored to your unique needs and learning style
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Progress value={existingPath.overallProgress} className="h-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-background p-3 rounded-lg border border-border">
                <div className="flex items-center mb-1">
                  <BookOpen className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium">Units</span>
                </div>
                <div className="text-muted-foreground">
                  {existingPath.units.length} learning units
                </div>
              </div>
              <div className="bg-background p-3 rounded-lg border border-border">
                <div className="flex items-center mb-1">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span className="font-medium">Completed</span>
                </div>
                <div className="text-muted-foreground">
                  {existingPath.units.filter(u => 
                    u.status === TopicStatus.COMPLETED || 
                    u.status === TopicStatus.MASTERED
                  ).length} units
                </div>
              </div>
              <div className="bg-background p-3 rounded-lg border border-border">
                <div className="flex items-center mb-1">
                  <Clock className="h-4 w-4 mr-2 text-amber-500" />
                  <span className="font-medium">Estimated Completion</span>
                </div>
                <div className="text-muted-foreground">
                  {existingPath.estimatedCompletionDate ? 
                    new Date(existingPath.estimatedCompletionDate).toLocaleDateString('en-GB') : 
                    'Not available'}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleGeneratePath}
              disabled={generatingPath}
              className="text-xs"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${generatingPath ? 'animate-spin' : ''}`} />
              Regenerate Path
            </Button>
            <Button size="sm" className="text-xs">
              View Details <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-primary" />
            Generate Personalized Learning Path
          </CardTitle>
          <CardDescription>
            Create a learning journey tailored to your unique needs and learning style
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Our AI-powered system will analyze your:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Learning Style</h4>
                  <p className="text-xs text-muted-foreground">
                    Content adapted to how you learn best
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <BarChart className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Current Knowledge</h4>
                  <p className="text-xs text-muted-foreground">
                    Starting from your current understanding
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Curriculum Alignment</h4>
                  <p className="text-xs text-muted-foreground">
                    Mapped to UK curriculum standards
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Lightbulb className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Personal Interests</h4>
                  <p className="text-xs text-muted-foreground">
                    Content contextualized to your interests
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleGeneratePath}
            disabled={generatingPath}
          >
            {generatingPath ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating Your Path...
              </>
            ) : (
              <>
                Generate My Learning Path
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
