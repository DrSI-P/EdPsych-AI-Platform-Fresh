import React from 'react';
import { Metadata } from 'next';
import EmotionalVocabularyDevelopment from '@/components/special-needs/emotional-vocabulary/emotional-vocabulary-development';

export const metadata: Metadata = {
  title: 'Emotional Vocabulary Development | EdPsych Connect',
  description: 'Explore, learn, and practise using words to identify and express emotions with our comprehensive emotional vocabulary development tools.',
};

export default function EmotionalVocabularyPage(): React.ReactNode {
  return (
    <div className="container mx-auto py-6">
      <EmotionalVocabularyDevelopment />
    </div>
  );
}
