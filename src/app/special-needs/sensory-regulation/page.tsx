'use client';

import React from 'react';
import { SensoryRegulationEngine } from '@/components/special-needs/sensory-regulation/sensory-regulation-engine';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Vibrate, BookOpen, Lightbulb } from 'lucide-react';

export default function SensoryRegulationPage(): React.ReactNode {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Sensory Regulation Tools</h1>
        <p className="text-muted-foreground">
          Personalized tools to help maintain optimal sensory regulation for learning
        </p>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <SensoryRegulationEngine />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-centre">
                <BookOpen className="mr-2 h-5 w-5" />
                Evidence-Based Approach
              </CardTitle>
              <CardDescription>
                Our sensory regulation tools are based on established research and best practices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Sensory Integration Theory</h3>
                <p className="text-sm text-muted-foreground">
                  Based on the work of Dr. A. Jean Ayres, sensory integration theory explains how the brain processes sensory information and how sensory processing affects behaviour and learning.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Alert Programme®</h3>
                <p className="text-sm text-muted-foreground">
                  Incorporates principles from the Alert Programme® (&quot;How Does Your Engine Run?&quot;) to help students recognise and regulate their alertness levels for optimal learning.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Zones of Regulation®</h3>
                <p className="text-sm text-muted-foreground">
                  Integrates concepts from the Zones of Regulation® framework to support self-regulation and emotional control through sensory strategies.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-centre">
                <Info className="mr-2 h-5 w-5" />
                About Sensory Regulation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Sensory regulation refers to the ability to maintain an appropriate level of alertness for a given situation or task. Everyone processes sensory information differently, and some students may have specific sensory needs that affect their learning.
              </p>
              <p className="text-sm text-muted-foreground">
                These tools help students identify their sensory needs and provide strategies to maintain an optimal state for learning and engagement.
              </p>
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Did you know?</AlertTitle>
                <AlertDescription>
                  Up to 16% of children have sensory processing differences that can impact their learning and behaviour in the classroom.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-centre">
                <Vibrate className="mr-2 h-5 w-5" />
                Sensory Systems
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="visual" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="visual">Visual</TabsTrigger>
                  <TabsTrigger value="auditory">Auditory</TabsTrigger>
                  <TabsTrigger value="tactile">Tactile</TabsTrigger>
                </TabsList>
                <TabsContent value="visual" className="space-y-2 pt-4">
                  <h3 className="text-sm font-medium">Visual System</h3>
                  <p className="text-xs text-muted-foreground">
                    Processes light, colors, shapes, and movement. Visual input can be calming or alerting depending on the individual and the specific input.
                  </p>
                  <div className="text-xs space-y-1 mt-2">
                    <p><strong>Signs of sensitivity:</strong> Easily distracted by visual stimuli, bothered by bright lights</p>
                    <p><strong>Signs of seeking:</strong> Drawn to bright colors and moving objects, visual stimming</p>
                  </div>
                </TabsContent>
                <TabsContent value="auditory" className="space-y-2 pt-4">
                  <h3 className="text-sm font-medium">Auditory System</h3>
                  <p className="text-xs text-muted-foreground">
                    Processes sounds, including volume, pitch, and rhythm. Auditory input can significantly impact focus and emotional state.
                  </p>
                  <div className="text-xs space-y-1 mt-2">
                    <p><strong>Signs of sensitivity:</strong> Covering ears, distressed by loud or unexpected sounds</p>
                    <p><strong>Signs of seeking:</strong> Making noises, seeking loud environments, auditory stimming</p>
                  </div>
                </TabsContent>
                <TabsContent value="tactile" className="space-y-2 pt-4">
                  <h3 className="text-sm font-medium">Tactile System</h3>
                  <p className="text-xs text-muted-foreground">
                    Processes touch sensations including pressure, texture, and temperature. Tactile input can be grounding and organising.
                  </p>
                  <div className="text-xs space-y-1 mt-2">
                    <p><strong>Signs of sensitivity:</strong> Avoiding certain textures, disliking light touch</p>
                    <p><strong>Signs of seeking:</strong> Touching everything, seeking deep pressure, tactile stimming</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
