
'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PeerLearningDashboard } from '@/components/collaborative-learning/peer-learning/peer-learning-dashboard';
import { GroupProjectsDashboard } from '@/components/collaborative-learning/group-projects/group-projects-dashboard';
import { DiscussionForumDashboard } from '@/components/collaborative-learning/discussion-forums/discussion-forum-dashboard';
import { StudentResourceBrowser } from '@/components/collaborative-learning/peer-learning/student-resource-browser';

/**
 * Collaborative Learning Page
 * 
 * Main entry point for all collaborative learning features, including
 * peer learning, group projects, and discussion forums.
 */
export default function CollaborativeLearningPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-2">Collaborative Learning</h1>
      <p className="text-muted-foreground mb-8">
        Engage with peers, work on group projects, and participate in discussions
      </p>

      <Tabs defaultValue="peer-learning" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="peer-learning">Peer Learning</TabsTrigger>
          <TabsTrigger value="group-projects">Group Projects</TabsTrigger>
          <TabsTrigger value="discussion-forums">Discussion Forums</TabsTrigger>
          <TabsTrigger value="student-resources">Student Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="peer-learning">
          <PeerLearningDashboard />
        </TabsContent>
        <TabsContent value="group-projects">
          <GroupProjectsDashboard />
        </TabsContent>
        <TabsContent value="discussion-forums">
          <DiscussionForumDashboard />
        </TabsContent>
        <TabsContent value="student-resources">
          <StudentResourceBrowser />
        </TabsContent>
      </Tabs>
    </div>
  );
}

