'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input, Textarea, Select, Checkbox } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { useToast } from '@/components/ui/toast';
import { AIPrompt } from '@/components/ai/ai-prompt';

interface PupilVoiceEntry {
  id: string;
  pupilName: string;
  ageGroup: string;
  school: string;
  date: string;
  topic: string;
  responses: {
    question: string;
    answer: string;
  }[];
  sentiment: 'positive' | 'neutral' | 'negative';
  tags: any[];
  notes: string;
}

interface PupilVoiceToolProps {
  initialEntries?: PupilVoiceEntry[];
  onEntrySelect?: (entry: PupilVoiceEntry) => void;
  className?: string;
}

export function PupilVoiceTool({
  initialEntries = [],
  onEntrySelect,
  className = ''
}: PupilVoiceToolProps) {
  const { showToast } = useToast();
  const [entries, setEntries] = useState<PupilVoiceEntry[]>(initialEntries);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');
  const [selectedSentiment, setSelectedSentiment] = useState('all');
  
  // Fetch entries on component mount
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        // In a real application, this would fetch from an API
        // For now, we'll use the initialEntries or mock data
        if (initialEntries.length > 0) {
          setEntries(initialEntries);
          setLoading(false);
          return;
        }
        
        // Mock data for demonstration
        const mockEntries: any[] = [
          {
            id: '1',
            pupilName: 'Alex Thompson',
            ageGroup: 'primary',
            school: 'Oakwood Primary School',
            date: '2025-01-15',
            topic: 'School Environment',
            responses: [
              {
                question: 'What do you like most about your school?',
                answer: 'I like the playground and the library. The library has lots of books I can read during break time.'
              },
              {
                question: 'Is there anything you would change about your classroom?',
                answer: 'I wish we had more computers so everyone could use them at the same time.'
              },
              {
                question: 'How do you feel when you need help with your work?',
                answer: 'Sometimes I feel nervous to ask for help, but my teacher is nice when I do ask.'
              }
            ],
            sentiment: 'positive',
            tags: ['environment', 'resources', 'support'],
            notes: 'Alex was enthusiastic throughout the session and provided thoughtful responses.'
          },
          {
            id: '2',
            pupilName: 'Samira Patel',
            ageGroup: 'secondary',
            school: 'Westfield Secondary School',
            date: '2025-02-10',
            topic: 'Learning Experience',
            responses: [
              {
                question: 'How do you prefer to learn new information?',
                answer: 'I learn best when I can see visual examples and then try things myself. Just listening to explanations is difficult for me to follow sometimes.'
              },
              {
                question: 'What subjects do you find most challenging?',
                answer: 'I find maths challenging, especially algebra. I sometimes feel lost when we move to a new topic before I understand the previous one.'
              },
              {
                question: 'How do you feel about group work?',
                answer: 'I like working in small groups where everyone participates. In larger groups, some people don\'t contribute and others take over.'
              }
            ],
            sentiment: 'neutral',
            tags: ['learning styles', 'mathematics', 'group work'],
            notes: 'Samira was reflective and articulate about her learning preferences.'
          },
          {
            id: '3',
            pupilName: 'Jamie Wilson',
            ageGroup: 'early_years',
            school: 'Sunshine Nursery',
            date: '2025-03-05',
            topic: 'Play and Activities',
            responses: [
              {
                question: 'What is your favourite thing to do at nursery?',
                answer: 'I like playing with the blocks and building towers. And painting pictures.'
              },
              {
                question: 'Is there anything that makes you feel sad at nursery?',
                answer: 'When I can\'t play outside because it\'s raining. And when other children don\'t share toys.'
              },
              {
                question: 'Who do you like to play with?',
                answer: 'I like playing with Zoe and Leo. We make up stories with the puppets.'
              }
            ],
            sentiment: 'positive',
            tags: ['play', 'social', 'outdoor activities'],
            notes: 'Jamie needed some encouragement to respond but became more animated when discussing favourite activities.'
          }
        ];
        
        setEntries(mockEntries);
        setLoading(false);
      } catch (err) {
        setError('Failed to load pupil voice entries');
        setLoading(false);
      }
    };
    
    fetchEntries();
  }, [initialEntries]);
  
  // Filter entries based on search and filters
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      entry.pupilName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.responses.some(r => 
        r.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesAgeGroup = selectedAgeGroup === 'all' || entry.ageGroup === selectedAgeGroup;
    const matchesSentiment = selectedSentiment === 'all' || entry.sentiment === selectedSentiment;
    
    return matchesSearch && matchesAgeGroup && matchesSentiment;
  });
  
  // Handle entry selection
  const handleEntrySelect = (entry: PupilVoiceEntry) => {
    onEntrySelect?.(entry);
  };
  
  // Collection form state
  const [collectionForm, setCollectionForm] = useState({
    pupilName: '',
    ageGroup: 'primary',
    school: '',
    topic: '',
    questions: [
      'What do you like most about your school?',
      'Is there anything you would change about your classroom?',
      'How do you feel when you need help with your work?'
    ],
    answers: ['', '', ''],
    notes: '',
    tags: ''
  });
  
  // Handle form change
  const handleCollectionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCollectionForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle question change
  const handleQuestionChange = (index: number, value: string) => {
    setCollectionForm(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = value;
      return { ...prev, questions: newQuestions };
    });
  };
  
  // Handle answer change
  const handleAnswerChange = (index: number, value: string) => {
    setCollectionForm(prev => {
      const newAnswers = [...prev.answers];
      newAnswers[index] = value;
      return { ...prev, answers: newAnswers };
    });
  };
  
  // Add question-answer pair
  const addQuestionAnswer = () => {
    setCollectionForm(prev => ({
      ...prev,
      questions: [...prev.questions, ''],
      answers: [...prev.answers, '']
    }));
  };
  
  // Remove question-answer pair
  const removeQuestionAnswer = (index: number) => {
    setCollectionForm(prev => {
      const newQuestions = [...prev.questions];
      const newAnswers = [...prev.answers];
      newQuestions.splice(index, 1);
      newAnswers.splice(index, 1);
      return { 
        ...prev, 
        questions: newQuestions.length ? newQuestions : [''],
        answers: newAnswers.length ? newAnswers : ['']
      };
    });
  };
  
  // Handle AI-generated questions
  const handleAIQuestions = (aiResponse: string) => {
    // Parse the AI response into individual questions
    const questions = aiResponse
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[•\-*\d.]\s*/, '').trim());
    
    if (questions.length > 0) {
      setCollectionForm(prev => ({
        ...prev,
        questions: questions,
        answers: Array(questions.length).fill('')
      }));
      
      showToast({
        title: 'Questions generated successfully',
        type: 'success'
      });
    }
  };
  
  // Determine sentiment based on answers
  const determineSentiment = (answers: any[]): 'positive' | 'neutral' | 'negative' => {
    // This is a simplified sentiment analysis
    // In a real application, this would use more sophisticated NLP
    const positiveWords = ['like', 'love', 'enjoy', 'happy', 'good', 'great', 'excellent', 'wonderful', 'fantastic'];
    const negativeWords = ['dislike', 'hate', 'sad', 'unhappy', 'bad', 'terrible', 'awful', 'poor', 'difficult'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    const combinedText = answers.join(' ').toLowerCase();
    
    positiveWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = combinedText.match(regex);
      if (matches) positiveCount += matches.length;
    });
    
    negativeWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = combinedText.match(regex);
      if (matches) negativeCount += matches.length;
    });
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };
  
  // Handle entry submission
  const handleSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!collectionForm.pupilName) {
      showToast({
        title: 'Pupil name is required',
        type: 'error'
      });
      return;
    }
    
    if (!collectionForm.school) {
      showToast({
        title: 'School name is required',
        type: 'error'
      });
      return;
    }
    
    if (!collectionForm.topic) {
      showToast({
        title: 'Topic is required',
        type: 'error'
      });
      return;
    }
    
    const hasEmptyQuestions = collectionForm.questions.some(q => !q.trim());
    if (hasEmptyQuestions) {
      showToast({
        title: 'All questions must be filled in',
        type: 'error'
      });
      return;
    }
    
    const hasEmptyAnswers = collectionForm.answers.some(a => !a.trim());
    if (hasEmptyAnswers) {
      showToast({
        title: 'All answers must be filled in',
        type: 'error'
      });
      return;
    }
    
    // Create responses array
    const responses = collectionForm.questions.map((question, index) => ({
      question,
      answer: collectionForm.answers[index]
    }));
    
    // Determine sentiment
    const sentiment = determineSentiment(collectionForm.answers);
    
    // Create tags array
    const tags = collectionForm.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);
    
    // Create a new entry object
    const newEntry: PupilVoiceEntry = {
      id: Date.now().toString(),
      pupilName: collectionForm.pupilName,
      ageGroup: collectionForm.ageGroup,
      school: collectionForm.school,
      date: new Date().toISOString().split('T')[0],
      topic: collectionForm.topic,
      responses,
      sentiment,
      tags,
      notes: collectionForm.notes
    };
    
    // Add the new entry to the list
    setEntries(prev => [newEntry, ...prev]);
    
    // Reset the form
    setCollectionForm({
      pupilName: '',
      ageGroup: 'primary',
      school: '',
      topic: '',
      questions: [
        'What do you like most about your school?',
        'Is there anything you would change about your classroom?',
        'How do you feel when you need help with your work?'
      ],
      answers: ['', '', ''],
      notes: '',
      tags: ''
    });
    
    showToast({
      title: 'Pupil voice entry recorded successfully',
      type: 'success'
    });
  };
  
  // Define the tabs
  const tabs = [
    {
      id: 'browse',
      label: 'Browse Entries',
      content: (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              label="Search"
              placeholder="Search by name, topic, or responses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-1/2"
            />
            
            <div className="flex gap-4 md:w-1/2">
              <Select
                label="Age Group"
                value={selectedAgeGroup}
                onChange={(e) => setSelectedAgeGroup(e.target.value)}
                options={[
                  { value: 'all', label: 'All Ages' },
                  { value: 'early_years', label: 'Early Years' },
                  { value: 'primary', label: 'Primary' },
                  { value: 'secondary', label: 'Secondary' },
                  { value: 'sixth_form', label: 'Sixth Form' }
                ]}
              />
              
              <Select
                label="Sentiment"
                value={selectedSentiment}
                onChange={(e) => setSelectedSentiment(e.target.value)}
                options={[
                  { value: 'all', label: 'All Sentiments' },
                  { value: 'positive', label: 'Positive' },
                  { value: 'neutral', label: 'Neutral' },
                  { value: 'negative', label: 'Negative' }
                ]}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-centre py-8">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="error">
              {error}
            </Alert>
          ) : filteredEntries.length === 0 ? (
            <div className="text-centre py-8 text-grey-500">
              No pupil voice entries found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEntries.map(entry => (
                <Card key={entry.id} className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold">{entry.pupilName}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        entry.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                        entry.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-grey-100 text-grey-800'
                      }`}>
                        {entry.sentiment.charAt(0).toUpperCase() + entry.sentiment.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-grey-500">
                      {entry.school} • {entry.date}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="mb-3">
                      <span className="text-sm font-medium">Topic:</span>
                      <span className="text-sm ml-2">{entry.topic}</span>
                    </div>
                    <div className="space-y-3">
                      {entry.responses.slice(0, 2).map((response, index) => (
                        <div key={index}>
                          <p className="text-sm font-medium">{response.question}</p>
                          <p className="text-sm text-grey-600">{response.answer}</p>
                        </div>
                      ))}
                      {entry.responses.length > 2 && (
                        <p className="text-sm text-grey-500">+ {entry.responses.length - 2} more responses</p>
                      )}
                    </div>
                    {entry.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1">
                        {entry.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => handleEntrySelect(entry)}
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      id: 'collect',
      label: 'Collect Voice',
      content: (
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmitEntry} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Pupil Name"
                name="pupilName"
                value={collectionForm.pupilName}
                onChange={handleCollectionFormChange}
                required
              />
              
              <Select
                label="Age Group"
                name="ageGroup"
                value={collectionForm.ageGroup}
                onChange={handleCollectionFormChange}
                options={[
                  { value: 'early_years', label: 'Early Years' },
                  { value: 'primary', label: 'Primary' },
                  { value: 'secondary', label: 'Secondary' },
                  { value: 'sixth_form', label: 'Sixth Form' }
                ]}
              />
              
              <Input
                label="School"
                name="school"
                value={collectionForm.school}
                onChange={handleCollectionFormChange}
                required
              />
              
              <Input
                label="Topic"
                name="topic"
                value={collectionForm.topic}
                onChange={handleCollectionFormChange}
                placeholder="e.g., School Environment, Learning Experience"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-centre">
                <h3 className="text-lg font-medium">Questions and Responses</h3>
                <Button
                  type="button"
                  onClick={addQuestionAnswer}
                  variant="outline"
                  size="sm"
                >
                  Add Question
                </Button>
              </div>
              
              <div className="space-y-4">
                {collectionForm.questions.map((question, index) => (
                  <div key={index} className="p-4 border rounded-md">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium">Question {index + 1}</h4>
                      {collectionForm.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestionAnswer(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    <Input
                      value={question}
                      onChange={(e) => handleQuestionChange(index, e.target.value)}
                      placeholder="Enter question"
                      className="mb-2"
                    />
                    
                    <Textarea
                      label="Response"
                      value={collectionForm.answers[index]}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      placeholder="Record pupil's response"
                      rows={3}
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Generate Age-Appropriate Questions with AI</h4>
                <AIPrompt
                  placeholder="Describe the topic you want to explore with the pupil..."
                  systemPrompt={`You are an educational psychologist specialising in pupil voice collection. Generate 3-5 age-appropriate questions for ${collectionForm.ageGroup} school pupils about the topic described. The questions should be open-ended, sensitive, and designed to elicit meaningful responses. Format each question on a new line. Use UK English spelling and follow UK educational standards.`}
                  onCompletion={handleAIQuestions}
                />
              </div>
            </div>
            
            <Input
              label="Tags (comma-separated)"
              name="tags"
              value={collectionForm.tags}
              onChange={handleCollectionFormChange}
              placeholder="e.g., environment, learning, support"
            />
            
            <Textarea
              label="Notes"
              name="notes"
              value={collectionForm.notes}
              onChange={handleCollectionFormChange}
              placeholder="Add any observations or additional notes about the session"
              rows={3}
            />
            
            <div className="pt-4">
              <Button type="submit" className="w-full">
                Record Pupil Voice Entry
              </Button>
            </div>
          </form>
        </div>
      )
    }
  ];
  
  return (
    <div className={className}>
      <Tabs tabs={tabs} />
    </div>
  );
}
