'use client';

import dynamic from 'next/dynamic';

// Dynamically import the StandaloneVoiceInputButton component with SSR disabled
const DynamicStandaloneVoiceInputButton = dynamic(
  () => import('./standalone-voice-input-button'),
  { ssr: false }
);

export default DynamicStandaloneVoiceInputButton;