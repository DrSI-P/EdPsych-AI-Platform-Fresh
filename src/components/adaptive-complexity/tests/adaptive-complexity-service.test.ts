import { 
  AdaptiveComplexityService,
  ComplexityLevel,
  LearningProfile,
  PerformanceMetric,
  AdaptiveContent
} from '@/lib/adaptive-complexity';

describe('AdaptiveComplexityService', () => {
  let service: AdaptiveComplexityService;
  let mockProfile: LearningProfile;
  let mockPerformance: PerformanceMetric;
  let mockContent: AdaptiveContent;

  beforeEach(() => {
    // Initialize service with default config
    service = new AdaptiveComplexityService();

    // Create mock learning profile
    mockProfile = {
      userId: 'user123',
      subjectPreferences: {
        'mathematics': {
          subjectId: 'mathematics',
          currentComplexityLevel: ComplexityLevel.BASIC,
          recommendedComplexityLevel: ComplexityLevel.BASIC,
          confidenceScore: 0.5,
          performanceHistory: [],
          skillAreas: {
            'algebra': {
              skillId: 'algebra',
              currentComplexityLevel: ComplexityLevel.BASIC,
              recommendedComplexityLevel: ComplexityLevel.BASIC,
              confidenceScore: 0.5,
              performanceHistory: [],
              strengths: [],
              areasForImprovement: []
            }
          }
        }
      },
      learningRate: 0.5,
      challengePreference: 0.5,
      lastUpdated: new Date()
    };

    // Create mock performance metric
    mockPerformance = {
      userId: 'user123',
      contentId: 'content123',
      score: 0.8,
      timeSpent: 300,
      completionRate: 1.0,
      attemptCount: 1,
      timestamp: new Date(),
      subjectArea: 'mathematics',
      skillArea: 'algebra'
    };

    // Create mock adaptive content
    mockContent = {
      id: 'content123',
      title: 'Algebra Basics',
      description: 'Introduction to algebraic concepts',
      subjectArea: 'mathematics',
      skillAreas: ['algebra'],
      complexityLevel: ComplexityLevel.BASIC,
      prerequisites: [],
      learningObjectives: ['Understand basic algebraic expressions'],
      estimatedTimeMinutes: 30,
      adaptiveElements: [
        {
          id: 'element1',
          elementType: 'text',
          complexityVariants: {
            [ComplexityLevel.FOUNDATIONAL]: 'Very simple explanation of algebra',
            [ComplexityLevel.BASIC]: 'Basic explanation of algebra',
            [ComplexityLevel.INTERMEDIATE]: 'Intermediate explanation of algebra',
            [ComplexityLevel.ADVANCED]: 'Advanced explanation of algebra',
            [ComplexityLevel.EXPERT]: 'Expert explanation of algebra'
          }
        }
      ]
    };
  });

  test('determineComplexityLevel returns BASIC for new subject', () => {
    const newProfile = { ...mockProfile };
    newProfile.subjectPreferences = {};
    
    const level = service.determineComplexityLevel(newProfile, 'science');
    expect(level).toBe(ComplexityLevel.BASIC);
  });

  test('determineComplexityLevel returns current level when not enough data', () => {
    const level = service.determineComplexityLevel(mockProfile, 'mathematics');
    expect(level).toBe(ComplexityLevel.BASIC);
  });

  test('updateLearningProfile adds new performance data', () => {
    const updatedProfile = service.updateLearningProfile(mockProfile, mockPerformance);
    
    // Check that performance was added to subject
    expect(updatedProfile.subjectPreferences.mathematics.performanceHistory).toHaveLength(1);
    
    // Check that performance was added to skill area
    expect(updatedProfile.subjectPreferences.mathematics.skillAreas.algebra.performanceHistory).toHaveLength(1);
    
    // Check that lastUpdated was updated
    expect(updatedProfile.lastUpdated).not.toBe(mockProfile.lastUpdated);
  });

  test('adaptContentComplexity returns original content when levels match', () => {
    const adaptedContent = service.adaptContentComplexity(mockContent, mockProfile);
    expect(adaptedContent.complexityLevel).toBe(ComplexityLevel.BASIC);
  });

  test('recordComplexityAdjustment creates valid adjustment record', () => {
    const adjustment = service.recordComplexityAdjustment(
      'user123',
      'content123',
      ComplexityLevel.BASIC,
      ComplexityLevel.INTERMEDIATE,
      'Performance improvement'
    );
    
    expect(adjustment.userId).toBe('user123');
    expect(adjustment.contentId).toBe('content123');
    expect(adjustment.previousComplexityLevel).toBe(ComplexityLevel.BASIC);
    expect(adjustment.newComplexityLevel).toBe(ComplexityLevel.INTERMEDIATE);
    expect(adjustment.adjustmentReason).toBe('Performance improvement');
    expect(adjustment.recommendedNextSteps).toBeDefined();
  });

  test('handles multiple performance updates correctly', () => {
    // Add first performance
    let updatedProfile = service.updateLearningProfile(mockProfile, mockPerformance);
    
    // Add second performance with higher score
    const secondPerformance = { ...mockPerformance, score: 0.9, timestamp: new Date(Date.now() + 86400000) };
    updatedProfile = service.updateLearningProfile(updatedProfile, secondPerformance);
    
    // Add third performance with higher score
    const thirdPerformance = { ...mockPerformance, score: 0.95, timestamp: new Date(Date.now() + 172800000) };
    updatedProfile = service.updateLearningProfile(updatedProfile, thirdPerformance);
    
    // Now we should have enough data for a recommendation
    expect(updatedProfile.subjectPreferences.mathematics.performanceHistory).toHaveLength(3);
    
    // Check if recommendation has been updated based on good performance
    const subjectPref = updatedProfile.subjectPreferences.mathematics;
    expect(subjectPref.recommendedComplexityLevel).not.toBe(ComplexityLevel.BASIC);
  });
});
