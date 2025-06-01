/**
 * Student Voice Analysis Tests
 * 
 * This file contains tests for the Student Voice Analysis feature
 */

import { getStudentVoiceAnalysisService, StudentVoiceAnalysisOptions } from '../lib/voice/student-voice-analysis';
import { getSpeechRecognitionService } from '../lib/voice/speechRecognition';

describe('Student Voice Analysis', () => {
  // Mock speech recognition result
  const mockRecognitionResult = {
    text: "The quick brown fox jumps over the lazy dog. I enjoy reading books about science and history.",
    confidence: 0.85,
    isFinal: true
  };

  test('Student Voice Analysis service initialization', () => {
    const options: StudentVoiceAnalysisOptions = {
      ageGroup: 'primary',
      educationalContext: 'classroom',
      readingLevel: 'developing'
    };
    
    const service = getStudentVoiceAnalysisService(options);
    expect(service).toBeDefined();
  });

  test('Student Voice Analysis with different age groups', () => {
    const ageGroups = ['early-years', 'primary', 'secondary', 'adult'];
    
    ageGroups.forEach(ageGroup => {
      const service = getStudentVoiceAnalysisService({ ageGroup: ageGroup as any });
      expect(service).toBeDefined();
    });
  });

  test('Student Voice Analysis with learning difficulties', () => {
    const options: StudentVoiceAnalysisOptions = {
      learningDifficulties: {
        dyslexia: true,
        attentionDifficulties: true
      }
    };
    
    const service = getStudentVoiceAnalysisService(options);
    expect(service).toBeDefined();
  });

  test('Student Voice Analysis service options update', () => {
    const service = getStudentVoiceAnalysisService();
    
    service.updateOptions({
      ageGroup: 'secondary',
      feedbackMode: 'instructional'
    });
    
    expect(service.areModelsLoaded()).toBeDefined();
  });
});
