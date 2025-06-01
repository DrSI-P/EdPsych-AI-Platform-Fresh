import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ThumbsUp, ThumbsDown, ArrowLeft, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';

interface FAQDetailProps {
  questionId: string;
  onBack?: () => void;
  showBackButton?: boolean;
  showRelated?: boolean;
  className?: string;
}

export function FAQDetail({
  questionId,
  onBack,
  showBackButton = true,
  showRelated = true,
  className = '',
}: FAQDetailProps) {
  const router = useRouter();
  const [question, setQuestion] = useState<any>(null);
  const [relatedQuestions, setRelatedQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!questionId) return;
      
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/faq/questions?id=${questionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch question');
        }
        const data = await response.json();
        setQuestion(data);

        // Fetch related questions
        if (showRelated) {
          const relatedResponse = await fetch(`/api/faq/questions?categoryId=${data.categoryId}&limit=3`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            setRelatedQuestions(
              relatedData.questions.filter((q) => q.id !== questionId).slice(0, 3)
            );
          }
        }
      } catch (error) {
        console.error('Error fetching FAQ question:', error);
        setError('Failed to load question. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId, showRelated]);

  const handleVote = async (isHelpful: boolean) => {
    try {
      const response = await fetch(`/api/faq/questions/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          isHelpful,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit vote');
      }

      toast({
        title: 'Thank you for your feedback',
        description: 'Your feedback helps us improve our content.',
      });

      // Update local state to reflect the vote
      setQuestion((prev) => ({
        ...prev,
        helpfulVotes: isHelpful ? prev.helpfulVotes + 1 : prev.helpfulVotes,
        notHelpfulVotes: !isHelpful ? prev.notHelpfulVotes + 1 : prev.notHelpfulVotes,
      }));
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your feedback. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/faq/questions/${questionId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: question?.question,
          text: 'Check out this FAQ from EdPsych Connect',
          url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: 'Link copied',
          description: 'The link has been copied to your clipboard.',
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  const handleRelatedQuestionClick = (id: string) => {
    if (id === questionId) return;
    
    router.push(`/faq/questions/${id}`);
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (error || !question) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertDescription>{error || 'Question not found'}</AlertDescription>
          </Alert>
          {showBackButton && (
            <Button variant="outline" className="mt-4" onClick={handleBackClick}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{question.question}</CardTitle>
            <CardDescription className="mt-1">
              Category: {question.category?.name || 'Uncategorized'}
              {question.keyStage && ` • Key Stage ${question.keyStage}`}
              {question.curriculumArea && ` • ${question.curriculumArea}`}
            </CardDescription>
          </div>
          {showBackButton && (
            <Button variant="ghost" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm sm:prose-base max-w-none">
          <ReactMarkdown>{question.answer}</ReactMarkdown>
        </div>

        {question.keywords && question.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {question.keywords.map((keyword: string) => (
              <Badge key={keyword} variant="outline">
                {keyword}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-6 pt-2">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleVote(true)}>
              <ThumbsUp className="mr-2 h-4 w-4" />
              Helpful {question.helpfulVotes > 0 && `(${question.helpfulVotes})`}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleVote(false)}>
              <ThumbsDown className="mr-2 h-4 w-4" />
              Not Helpful {question.notHelpfulVotes > 0 && `(${question.notHelpfulVotes})`}
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        {showRelated && relatedQuestions.length > 0 && (
          <>
            <Separator className="w-full" />
            <div className="w-full">
              <h3 className="text-lg font-medium mb-3">Related Questions</h3>
              <div className="space-y-2">
                {relatedQuestions.map((relatedQuestion) => (
                  <Card
                    key={relatedQuestion.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleRelatedQuestionClick(relatedQuestion.id)}
                  >
                    <CardContent className="p-3">
                      <p className="font-medium">{relatedQuestion.question}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
