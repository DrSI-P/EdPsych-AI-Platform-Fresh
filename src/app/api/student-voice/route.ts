import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define schema for feedback request
const feedbackRequestSchema = z.object({
  feedbackType: z.enum(['audio', 'text', 'drawing']),
  content: z.string(),
  language: z.string().optional(),
  studentId: z.string().optional(),
  anonymous: z.boolean().optional(),
  metadata: z.object({
    subject: z.string().optional(),
    topic: z.string().optional(),
    yearGroup: z.string().optional(),
  }).optional(),
});

// Define schema for transcription request
const transcriptionRequestSchema = z.object({
  audioContent: z.string(), // Base64 encoded audio
  sourceLanguage: z.string().default('en'),
  targetLanguage: z.string().optional(),
  context: z.string().optional(),
  subject: z.string().optional(),
});

// Define schema for translation request
const translationRequestSchema = z.object({
  text: z.string(),
  sourceLanguage: z.string(),
  targetLanguage: z.string(),
  context: z.string().optional(),
  subject: z.string().optional(),
});

// Define schema for vocabulary request
const vocabularyRequestSchema = z.object({
  term: z.string(),
  definition: z.string(),
  subject: z.string(),
  translations: z.array(
    z.object({
      language: z.string(),
      translation: z.string(),
    })
  ),
});

// Mock feedback data
const mockFeedback = [
  {
    id: '1',
    feedbackType: 'text',
    content: 'I found today\'s math lesson really helpful, especially the visual examples.',
    language: 'en',
    anonymous: false,
    studentId: 'student123',
    metadata: {
      subject: 'Mathematics',
      topic: 'Fractions',
      yearGroup: 'Year 5',
    },
    createdAt: '2025-05-15T10:30:00Z',
  },
  {
    id: '2',
    feedbackType: 'audio',
    content: 'audio_file_url_would_be_here.mp3',
    language: 'en',
    anonymous: true,
    metadata: {
      subject: 'Science',
      topic: 'Photosynthesis',
      yearGroup: 'Year 8',
    },
    createdAt: '2025-05-14T14:15:00Z',
  },
];

// Mock transcription data
const mockTranscriptions = [
  {
    id: '1',
    originalText: 'Today we will learn about photosynthesis and how plants convert sunlight into energy.',
    originalLanguage: 'en',
    translatedText: 'Dziś dowiemy się o fotosyntezie i o tym, jak rośliny przekształcają światło słoneczne w energię.',
    targetLanguage: 'pl',
    context: 'Science lesson',
    subject: 'Science',
    createdAt: '2025-05-15T09:30:00Z',
  },
  {
    id: '2',
    originalText: 'Please complete exercises 1-5 on page 42 of your workbook for homework.',
    originalLanguage: 'en',
    translatedText: 'Lütfen ev ödevi için çalışma kitabınızın 42. sayfasındaki 1-5 alıştırmaları tamamlayın.',
    targetLanguage: 'tr',
    context: 'Mathematics homework',
    subject: 'Mathematics',
    createdAt: '2025-05-14T15:20:00Z',
  },
];

// Mock vocabulary data
const mockVocabulary = [
  {
    id: '1',
    term: 'Photosynthesis',
    definition: 'The process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water.',
    translations: [
      { language: 'pl', translation: 'Fotosynteza' },
      { language: 'es', translation: 'Fotosíntesis' },
      { language: 'ar', translation: 'التمثيل الضوئي' },
    ],
    subject: 'Science',
    createdAt: '2025-05-15T10:00:00Z',
  },
  {
    id: '2',
    term: 'Equation',
    definition: 'A statement that the values of two mathematical expressions are equal.',
    translations: [
      { language: 'pl', translation: 'Równanie' },
      { language: 'es', translation: 'Ecuación' },
      { language: 'tr', translation: 'Denklem' },
    ],
    subject: 'Mathematics',
    createdAt: '2025-05-14T11:30:00Z',
  },
];

// GET handler for retrieving feedback
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const feedbackType = searchParams.get('feedbackType');
  const subject = searchParams.get('subject');
  
  let filteredFeedback = [...mockFeedback];
  
  if (feedbackType) {
    filteredFeedback = filteredFeedback.filter(f => f.feedbackType === feedbackType);
  }
  
  if (subject) {
    filteredFeedback = filteredFeedback.filter(f => f.metadata?.subject === subject);
  }
  
  return NextResponse.json({ feedback: filteredFeedback });
}

// POST handler for submitting feedback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Determine which schema to validate against based on the endpoint path or a type field
    const endpoint = request.nextUrl.pathname.split('/').pop();
    
    if (endpoint === 'feedback' || body.type === 'feedback') {
      // Validate feedback request
      const validatedData = feedbackRequestSchema.parse(body);
      
      // In a real application, this would save to a database
      const newFeedback = {
        id: Date.now().toString(),
        ...validatedData,
        createdAt: new Date().toISOString(),
      };
      
      return NextResponse.json({ 
        success: true, 
        message: 'Feedback submitted successfully', 
        feedback: newFeedback 
      });
    } 
    else if (endpoint === 'transcription' || body.type === 'transcription') {
      // Validate transcription request
      const validatedData = transcriptionRequestSchema.parse(body);
      
      // Mock transcription process
      const transcribedText = "This is a simulated transcription of the provided audio content.";
      
      const newTranscription = {
        id: Date.now().toString(),
        originalText: transcribedText,
        originalLanguage: validatedData.sourceLanguage,
        context: validatedData.context,
        subject: validatedData.subject,
        createdAt: new Date().toISOString(),
      };
      
      // If target language is provided, add translation
      if (validatedData.targetLanguage) {
        Object.assign(newTranscription, {
          translatedText: `This is a simulated translation to ${validatedData.targetLanguage}.`,
          targetLanguage: validatedData.targetLanguage,
        });
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Audio transcribed successfully', 
        transcription: newTranscription 
      });
    }
    else if (endpoint === 'translation' || body.type === 'translation') {
      // Validate translation request
      const validatedData = translationRequestSchema.parse(body);
      
      // Mock translation process
      const translatedText = `This is a simulated translation of "${validatedData.text}" from ${validatedData.sourceLanguage} to ${validatedData.targetLanguage}.`;
      
      const newTranslation = {
        id: Date.now().toString(),
        originalText: validatedData.text,
        originalLanguage: validatedData.sourceLanguage,
        translatedText: translatedText,
        targetLanguage: validatedData.targetLanguage,
        context: validatedData.context,
        subject: validatedData.subject,
        createdAt: new Date().toISOString(),
      };
      
      return NextResponse.json({ 
        success: true, 
        message: 'Text translated successfully', 
        translation: newTranslation 
      });
    }
    else if (endpoint === 'vocabulary' || body.type === 'vocabulary') {
      // Validate vocabulary request
      const validatedData = vocabularyRequestSchema.parse(body);
      
      // Mock vocabulary creation
      const newVocabulary = {
        id: Date.now().toString(),
        ...validatedData,
        createdAt: new Date().toISOString(),
      };
      
      return NextResponse.json({ 
        success: true, 
        message: 'Vocabulary term added successfully', 
        vocabulary: newVocabulary 
      });
    }
    else {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid request type' 
      }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Validation error', 
        errors: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'An error occurred while processing your request' 
    }, { status: 500 });
  }
}
