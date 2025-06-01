"use client";

/**
 * Restorative Justice Resources Component
 * 
 * This component provides additional resources for understanding and implementing
 * restorative justice practices in educational settings.
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export function RestorativeJusticeResources() {
  const resources = [
    {
      id: 'thesis',
      title: 'What Can Children and Young People Tell Us About School Sanctions and Social Relationships',
      author: 'Dr. SI-P',
      description: 'An exploration of exclusionary and restorative justice practices in UK schools, including chapters on "Learning from listening to children\'s voices on sanctions and alternative approaches that foster belonging and connectedness" and "Primary study on the effectiveness of Restorative justice in UK schools".',
      url: 'https://www.researchgate.net/publication/369982171_What_Can_Children_and_Young_People_Tell_Us_About_School_Sanctions_and_Social_Relationships_An_Exploration_of_Exclusionary_and_Restorative_Justice_Practices',
      type: 'Research Thesis'
    },
    {
      id: 'iirp',
      title: 'International Institute for Restorative Practices',
      author: 'IIRP',
      description: 'Resources and training for implementing restorative practices in educational settings.',
      url: 'https://www.iirp.edu/',
      type: 'Organization'
    },
    {
      id: 'rj4all',
      title: 'Restorative Justice for All',
      author: 'RJ4All',
      description: 'UK-based institute providing resources and research on restorative justice practices.',
      url: 'https://www.rj4all.info/',
      type: 'Organization'
    },
    {
      id: 'restorativejustice-uk',
      title: 'Restorative Justice Council',
      author: 'RJC',
      description: 'UK organization promoting restorative justice in schools and communities.',
      url: 'https://restorativejustice.org.uk/',
      type: 'Organization'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Restorative Justice Resources</h2>
      <p className="text-muted-foreground">
        These resources provide valuable information on implementing restorative justice practices in educational settings, with a focus on UK schools.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((resource) => (
          <Card key={resource.id} className={resource.id === 'thesis' ? 'border-primary/50' : ''}>
            <CardHeader>
              <CardTitle className="text-lg">{resource.title}</CardTitle>
              <CardDescription>{resource.author} • {resource.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{resource.description}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  View Resource <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
