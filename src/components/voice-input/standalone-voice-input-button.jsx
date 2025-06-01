'use client';

import React, { useState, useEffect } from 'react';
import { VoiceInputProvider, VoiceInputButton } from '@/components/VoiceInput';

/**
 * Standalone Voice Input Button
 *
 * This component wraps the VoiceInputButton with its own VoiceInputProvider
 * to ensure it can be used anywhere in the application without needing to be
 * inside a parent VoiceInputProvider context.
 */
const StandaloneVoiceInputButton = (props) => {
  const { onResult, ...otherProps } = props;
  
  // Handle transcript changes from the VoiceInputButton
  const handleTranscriptChange = (transcript) => {
    if (onResult) {
      onResult(transcript);
    }
  };
  
  return (
    <VoiceInputProvider>
      <VoiceInputButton
        onTranscriptChange={handleTranscriptChange}
        {...otherProps}
      />
    </VoiceInputProvider>
  );
};

export default StandaloneVoiceInputButton;