import React from 'react';
import CircleProcessTemplates from '@/components/restorative-justice/circle-process/circle-process-templates';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Circle Process Templates | EdPsych Connect',
  description: 'Evidence-based templates for conducting restorative circles in educational settings',
};

/**
 * Circle Process Templates Page
 * 
 * This page provides structured templates for conducting restorative circles
 * in educational settings, based on evidence-based restorative justice principles.
 */
export default function CircleProcessPage() {
  return (
    <div className="container mx-auto py-8">
      <CircleProcessTemplates />
    </div>
  );
}
