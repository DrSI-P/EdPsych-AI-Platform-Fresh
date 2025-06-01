'use client';

import TeacherAutomation from '@/components/ai/teacher-automation/teacher-automation';

export default function TeacherAutomationPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Teacher Administrative Automation</h1>
        <p className="text-muted-foreground">
          Save time on administrative tasks with AI-powered document generation, allowing more focus on teaching and student relationships.
        </p>
      </div>
      
      <TeacherAutomation />
    </div>
  );
}
