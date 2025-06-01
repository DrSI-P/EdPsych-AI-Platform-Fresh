/**
 * Mock data for Adventure Quest components
 * 
 * This file provides mock data for development and testing of the Adventure Quest feature
 */

// Mock character data
export const mockCharacter = {
  id: 'char1',
  name: 'Alex',
  level: 5,
  xp: 750,
  xpToNextLevel: 1000,
  attributes: {
    intelligence: 8,
    creativity: 7,
    persistence: 6,
    curiosity: 9
  },
  inventory: [
    { id: 'item1', name: 'Knowledge Scroll', description: 'Grants bonus XP for completing quests', quantity: 2 },
    { id: 'item2', name: 'Focus Potion', description: 'Increases focus during challenging quests', quantity: 1 }
  ],
  achievements: [
    { id: 'ach1', name: 'First Steps', description: 'Complete your first quest', earnedAt: '2023-01-10T10:15:00Z' },
    { id: 'ach2', name: 'Quick Learner', description: 'Complete 5 quests', earnedAt: '2023-02-05T16:30:00Z' }
  ]
};

// Mock quests data
export const mockQuests = [
  {
    id: 'q1',
    title: 'The Mathematical Mystery',
    description: 'Solve a series of mathematical puzzles to unlock the secret code',
    subject: 'Mathematics',
    keyStage: 'KS2',
    difficulty: 'intermediate',
    duration: 30,
    xpReward: 200,
    objectives: [
      'Understand place value in 4-digit numbers',
      'Apply addition and subtraction strategies',
      'Use multiplication facts to solve problems'
    ],
    challenges: [
      {
        id: 'c1',
        title: 'Number Patterns',
        description: 'Identify the pattern and find the missing numbers',
        content: 'What numbers come next in this sequence: 3, 6, 12, 24, ?',
        type: 'multiple-choice',
        options: ['36, 48', '48, 96', '48, 72', '30, 36'],
        correctAnswer: '48, 96'
      },
      {
        id: 'c2',
        title: 'Word Problems',
        description: 'Solve real-world problems using mathematical operations',
        content: 'If a train travels at 60 miles per hour, how far will it travel in 2.5 hours?',
        type: 'text-input',
        correctAnswer: '150'
      }
    ]
  },
  {
    id: 'q2',
    title: 'The Language Explorer',
    description: 'Embark on a journey through language and literature',
    subject: 'English',
    keyStage: 'KS2',
    difficulty: 'beginner',
    duration: 25,
    xpReward: 150,
    objectives: [
      'Identify different types of nouns',
      'Use descriptive language effectively',
      'Understand paragraph structure'
    ],
    challenges: [
      {
        id: 'c1',
        title: 'Noun Hunt',
        description: 'Identify all the nouns in the passage',
        content: 'The old castle stood on the hill. Birds flew around its towers while children played in the garden below.',
        type: 'highlight',
        correctAnswers: ['castle', 'hill', 'birds', 'towers', 'children', 'garden']
      },
      {
        id: 'c2',
        title: 'Creative Writing',
        description: 'Write a descriptive paragraph about a forest',
        content: 'Use at least 5 adjectives and 3 different sentence structures',
        type: 'free-text',
        minWords: 50
      }
    ]
  },
  {
    id: 'q3',
    title: 'Science Explorers',
    description: 'Discover the wonders of the natural world through scientific investigation',
    subject: 'Science',
    keyStage: 'KS2',
    difficulty: 'intermediate',
    duration: 35,
    xpReward: 225,
    objectives: [
      'Understand the water cycle',
      'Identify different states of matter',
      'Conduct a simple experiment'
    ],
    challenges: [
      {
        id: 'c1',
        title: 'States of Matter',
        description: 'Match each substance to its state of matter',
        content: 'Classify these substances: ice cream, oxygen, metal spoon, juice',
        type: 'matching',
        pairs: [
          { item: 'ice cream', match: 'solid/liquid mixture' },
          { item: 'oxygen', match: 'gas' },
          { item: 'metal spoon', match: 'solid' },
          { item: 'juice', match: 'liquid' }
        ]
      },
      {
        id: 'c2',
        title: 'Water Cycle Experiment',
        description: 'Follow the instructions to create a mini water cycle',
        content: 'You will need: a clear plastic bag, water, blue food coloring, and tape',
        type: 'procedure',
        steps: [
          'Add water to the plastic bag',
          'Add a drop of blue food coloring',
          'Seal the bag and tape it to a sunny window',
          'Observe what happens over the next few hours',
          'Record your observations'
        ]
      }
    ]
  }
];

// Mock learning styles
export const learningStyles = [
  { id: 'visual', name: 'Visual', description: 'Learns best through seeing and visualizing information' },
  { id: 'auditory', name: 'Auditory', description: 'Learns best through listening and verbal instructions' },
  { id: 'reading', name: 'Reading/Writing', description: 'Learns best through reading and writing information' },
  { id: 'kinesthetic', name: 'Kinesthetic', description: 'Learns best through hands-on activities and physical experiences' }
];

// Mock learning history
export const learningHistory = [
  {
    id: 'lh1',
    subject: 'Mathematics',
    topics: ['Addition', 'Subtraction', 'Multiplication'],
    strengths: ['Problem-solving', 'Mental arithmetic'],
    areasForImprovement: ['Fractions', 'Word problems'],
    completedActivities: 12,
    averageScore: 85
  },
  {
    id: 'lh2',
    subject: 'English',
    topics: ['Grammar', 'Vocabulary', 'Reading comprehension'],
    strengths: ['Creative writing', 'Vocabulary'],
    areasForImprovement: ['Spelling', 'Punctuation'],
    completedActivities: 15,
    averageScore: 78
  },
  {
    id: 'lh3',
    subject: 'Science',
    topics: ['Plants', 'Animals', 'Weather'],
    strengths: ['Observation', 'Classification'],
    areasForImprovement: ['Scientific method', 'Experiments'],
    completedActivities: 8,
    averageScore: 82
  }
];
