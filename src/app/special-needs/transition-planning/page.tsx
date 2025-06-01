import React from 'react';
import { Metadata } from 'next';
import TransitionPlanningEngine from '@/components/special-needs/transition-planning/transition-planning-engine';

export const metadata: Metadata = {
  title: 'Transition Planning Tools | EdPsych Connect',
  description: 'Create and manage transition plans for educational changes, supporting students through key transitions in their educational journey.',
};

export default function TransitionPlanningPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Transition Planning Tools</h1>
          <p className="text-lg text-muted-foreground">
            Create and manage comprehensive transition plans to support students through key educational transitions.
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-blue-800">About Transition Planning</h2>
          <p className="text-blue-700">
            Educational transitions can be challenging for all students, but particularly for those with special educational needs. 
            Effective transition planning helps reduce anxiety, builds confidence, and ensures appropriate support is in place.
          </p>
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <div className="bg-white rounded-md p-4 shadow-sm">
              <h3 className="font-medium text-blue-800 mb-2">Key Transitions</h3>
              <ul className="space-y-2 text-sm">
                <li>• Primary to secondary school</li>
                <li>• Between year groups</li>
                <li>• Between schools</li>
                <li>• Secondary to further education</li>
                <li>• Education to employment</li>
              </ul>
            </div>
            <div className="bg-white rounded-md p-4 shadow-sm">
              <h3 className="font-medium text-blue-800 mb-2">Benefits of Planning</h3>
              <ul className="space-y-2 text-sm">
                <li>• Reduces anxiety and uncertainty</li>
                <li>• Ensures continuity of support</li>
                <li>• Builds student confidence</li>
                <li>• Promotes self-advocacy</li>
                <li>• Facilitates communication between stakeholders</li>
              </ul>
            </div>
          </div>
        </div>
        
        <TransitionPlanningEngine />
        
        <div className="bg-grey-50 border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Evidence-Based Approach</h2>
          <p>
            Our transition planning tools are based on research and best practices from educational psychology and special needs education.
          </p>
          <div className="space-y-2 mt-2">
            <p className="text-sm text-grey-600">
              <span className="font-medium">Research basis:</span> This feature draws on research from the Department for Education's SEND Code of Practise, 
              the Education Endowment Foundation's research on effective transitions, and studies published in the British Journal of Special Education.
            </p>
            <p className="text-sm text-grey-600">
              <span className="font-medium">Person-centred approach:</span> Our tools emphasize student voice and preferences, aligning with best practices 
              in person-centred planning and the SEND Code of Practise's focus on putting children, young people, and families at the centre of the process.
            </p>
            <p className="text-sm text-grey-600">
              <span className="font-medium">Collaborative framework:</span> The transition planning tools facilitate collaboration between students, parents, 
              teachers, and other professionals, reflecting research showing that multi-agency approaches lead to more successful transitions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
