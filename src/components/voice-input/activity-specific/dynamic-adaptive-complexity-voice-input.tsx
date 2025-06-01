'use client';

import dynamic from 'next/dynamic';

// Dynamically import the AdaptiveComplexityVoiceInput component with SSR disabled
const DynamicAdaptiveComplexityVoiceInput = dynamic(
  () => import('./adaptive-complexity-voice-input'),
  { ssr: false }
);

export default DynamicAdaptiveComplexityVoiceInput;