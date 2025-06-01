'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAIService } from '@/lib/ai/ai-service';

type Question = {
  id: string;
  text: string;
  type: 'multiple-choice' | 'open-ended';
  options?: string[];
};

type LearningStyle = {
  name: string;
  score: number;
  description: string;
  strategies: string[];
};

export default function LearningStyleAssessment() {
  const { toast } = useToast();
  const aiService = useAIService();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{
    primaryStyle: LearningStyle;
    secondaryStyle: LearningStyle;
    allStyles: LearningStyle[];
    personalizedRecommendations: string[];
  } | null>(null);

  // Sample questions - in production, these would be more comprehensive
  const questions: Question[] = [
    {
      id: 'q1',
      text: 'When learning something new, I prefer to:',
      type: 'multiple-choice',
      options: [
        'Read about it and take notes',
        'Listen to someone explain it',
        'Try it out hands-on',
        'See diagrams or watch videos about it'
      ]
    },
    {
      id: 'q2',
      text: 'When I need to remember information, I usually:',
      type: 'multiple-choice',
      options: [
        'Write it down multiple times',
        'Repeat it out loud to myself',
        'Associate it with movements or actions',
        'Create mental pictures or diagrams'
      ]
    },
    {
      id: 'q3',
      text: 'I find it easiest to concentrate when:',
      type: 'multiple-choice',
      options: [
        'I\'m in a quiet environment with minimal distractions',
        'I can discuss the topic with others',
        'I can move around or fidget while thinking',
        'I have visual aids or colorful materials'
      ]
    },
    {
      id: 'q4',
      text: 'When solving problems, I tend to:',
      type: 'multiple-choice',
      options: [
        'Make lists and follow step-by-step procedures',
        'Talk through the problem out loud',
        'Use trial and error and physical manipulation',
        'Draw diagrams or visualise the solution'
      ]
    },
    {
      id: 'q5',
      text: 'I enjoy lessons that involve:',
      type: 'multiple-choice',
      options: [
        'Reading and writing activities',
        'Discussion and debate',
        'Building, creating, or experimenting',
        'Charts, graphs, and visual presentations'
      ]
    },
    {
      id: 'q6',
      text: 'When I\'m bored in class, I tend to:',
      type: 'multiple-choice',
      options: [
        'Doodle or write notes',
        'Whisper to a friend or hum quietly',
        'Fidget, tap my foot, or play with objects',
        'Daydream or look around the room'
      ]
    },
    {
      id: 'q7',
      text: 'I remember people best by:',
      type: 'multiple-choice',
      options: [
        'Their names and what they said',
        'The sound of their voice',
        'What I did with them',
        'Their face or how they looked'
      ]
    },
    {
      id: 'q8',
      text: 'When giving directions, I usually:',
      type: 'multiple-choice',
      options: [
        'Write them down',
        'Explain them verbally in detail',
        'Demonstrate or walk through the route',
        'Draw a map or use landmarks'
      ]
    },
    {
      id: 'q9',
      text: 'In my free time, I often:',
      type: 'multiple-choice',
      options: [
        'Read books or write',
        'Listen to music or podcasts',
        'Play sports or do crafts',
        'Watch videos or look at photos'
      ]
    },
    {
      id: 'q10',
      text: 'Describe a recent learning experience that you enjoyed. What made it engaging for you?',
      type: 'open-ended'
    }
  ];

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      processResults();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const processResults = async () => {
    setIsProcessing(true);
    try {
      // In a real implementation, this would call the AI service to analyse the answers
      // For now, we'll simulate the AI analysis with a timeout
      
      const prompt = `
        Analyse the following learning style assessment answers and determine the primary and secondary learning styles.
        Provide detailed descriptions and personalized learning strategies for each style.
        
        Answers:
        ${Object.entries(answers).map(([id, answer]) => {
          const question = questions.find(q => q.id === id);
          return `${question?.text}: ${answer}`;
        }).join('\n')}
      `;
      
      const aiResponse = await aiService.getCompletion({
        prompt,
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 1000
      });
      
      // Parse the AI response - in a real implementation, this would be more robust
      // For now, we'll simulate the results
      
      const mockResults = {
        primaryStyle: {
          name: 'Visual',
          score: 42,
          description: 'You learn best through seeing information presented visually. You benefit from diagrams, charts, videos, and written instructions. You often visualise concepts to understand them better and may create mental pictures when trying to remember information.',
          strategies: [
            'Use colour-coding for notes and materials',
            'Create mind maps and diagrams',
            'Watch educational videos',
            'Use flashcards with images',
            'Visualise concepts and processes'
          ]
        },
        secondaryStyle: {
          name: 'Kinesthetic',
          score: 28,
          description: 'Your secondary learning style is kinesthetic, meaning you also benefit from hands-on activities and physical engagement with learning materials. You learn well through doing, touching, and experiencing.',
          strategies: [
            'Use manipulatives when possible',
            'Take breaks for physical movement',
            'Create models or physical representations',
            'Role-play concepts',
            'Use gesture when learning new information'
          ]
        },
        allStyles: [
          {
            name: 'Visual',
            score: 42,
            description: 'Learning through seeing information presented visually.',
            strategies: ['Use colour-coding', 'Create mind maps', 'Watch videos']
          },
          {
            name: 'Kinesthetic',
            score: 28,
            description: 'Learning through physical activities and hands-on experiences.',
            strategies: ['Use manipulatives', 'Take movement breaks', 'Create models']
          },
          {
            name: 'Auditory',
            score: 18,
            description: 'Learning through listening and verbal communication.',
            strategies: ['Record lectures', 'Discuss topics', 'Use verbal repetition']
          },
          {
            name: 'Reading/Writing',
            score: 12,
            description: 'Learning through reading and writing text.',
            strategies: ['Take detailed notes', 'Rewrite information', 'Create summaries']
          }
        ],
        personalizedRecommendations: [
          'Combine visual aids with hands-on activities for optimal learning',
          'Request visual demonstrations followed by opportunities to practise',
          'Create illustrated notes with diagrams and symbols',
          'Use movement to reinforce visual learning (e.g., tracing diagrams in the air)',
          'Take frequent short breaks to move around during study sessions',
          'Record yourself explaining concepts while drawing them out'
        ]
      };
      
      setResults(mockResults);
    } catch (error) {
      toast({
        title: "Error processing results",
        description: "There was a problem analysing your answers. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <RadioGroup
            value={answers[question.id] || ''}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-centre space-x-2 mb-3">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`} className="text-base">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'open-ended':
        return (
          <Textarea
            placeholder="Type your answer here..."
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="min-h-[120px]"
          />
        );
      default:
        return null;
    }
  };

  if (results) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Your Learning Style Profile</CardTitle>
            <CardDescription>
              Based on your responses, we've identified your primary and secondary learning styles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Primary Learning Style: {results.primaryStyle.name}</h3>
              <Progress value={results.primaryStyle.score} className="h-3 mb-2" />
              <p className="mb-4">{results.primaryStyle.description}</p>
              
              <h4 className="font-medium mb-2">Recommended Strategies:</h4>
              <ul className="list-disc pl-5 mb-6 space-y-1">
                {results.primaryStyle.strategies.map((strategy, index) => (
                  <li key={index}>{strategy}</li>
                ))}
              </ul>
              
              <h3 className="text-xl font-semibold mb-2">Secondary Learning Style: {results.secondaryStyle.name}</h3>
              <Progress value={results.secondaryStyle.score} className="h-3 mb-2" />
              <p className="mb-4">{results.secondaryStyle.description}</p>
              
              <h4 className="font-medium mb-2">Recommended Strategies:</h4>
              <ul className="list-disc pl-5 mb-6 space-y-1">
                {results.secondaryStyle.strategies.map((strategy, index) => (
                  <li key={index}>{strategy}</li>
                ))}
              </ul>
            </div>
            
            <Tabs defaultValue="recommendations">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="recommendations">Personalized Recommendations</TabsTrigger>
                <TabsTrigger value="allStyles">All Learning Styles</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recommendations" className="pt-4">
                <h3 className="text-lg font-semibold mb-3">Your Personalized Learning Recommendations</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {results.personalizedRecommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </TabsContent>
              
              <TabsContent value="allStyles" className="pt-4">
                <div className="space-y-6">
                  {results.allStyles.map((style, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex items-centre justify-between mb-1">
                        <h4 className="font-medium">{style.name}</h4>
                        <span>{style.score}%</span>
                      </div>
                      <Progress value={style.score} className="h-2 mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">{style.description}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setResults(null)}>Retake Assessment</Button>
            <Button>Save Results</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Learning Style Assessment</CardTitle>
          <CardDescription>
            Discover your unique learning style to personalize your educational experience.
            This assessment will help identify how you best process and retain information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2 text-sm">
              <span>Question {currentStep + 1} of {questions.length}</span>
              <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% Complete</span>
            </div>
            <Progress value={((currentStep + 1) / questions.length) * 100} className="h-2" />
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">{questions[currentStep].text}</h3>
            {renderQuestion(questions[currentStep])}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!answers[questions[currentStep].id] || isProcessing}
          >
            {currentStep === questions.length - 1 ? (isProcessing ? 'Processing...' : 'Submit') : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
