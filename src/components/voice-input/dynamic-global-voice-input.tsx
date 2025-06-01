'use client';

import dynamic from 'next/dynamic';

// Dynamically import the GlobalVoiceInput component with SSR disabled
const DynamicGlobalVoiceInput = dynamic(
  () => import('./global-voice-input'),
  { ssr: false }
);

export default DynamicGlobalVoiceInput;