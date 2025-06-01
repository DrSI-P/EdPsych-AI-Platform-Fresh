'use client';

import dynamic from 'next/dynamic';

// Dynamically import the AssessmentVoiceInput component with SSR disabled
const DynamicAssessmentVoiceInput = dynamic(
  () => import('./assessment-voice-input'),
  { ssr: false }
);

export default DynamicAssessmentVoiceInput;