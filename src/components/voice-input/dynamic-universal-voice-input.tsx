'use client';

import dynamic from 'next/dynamic';

// Dynamically import the UniversalVoiceInput component with SSR disabled
const DynamicUniversalVoiceInput = dynamic(
  () => import('./universal-voice-input'),
  { ssr: false }
);

export default DynamicUniversalVoiceInput;