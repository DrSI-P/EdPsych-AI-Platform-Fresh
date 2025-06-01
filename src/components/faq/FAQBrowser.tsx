import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, BookOpen, Bookmark, Clock } from 'lucide-react';

interface FAQCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count?: {
    questions: number;
  };
}

interface FAQQuestion {
  id: string;
  question: string;
  keyStage?: string | null;
  curriculumArea?: string | null;
  viewCount: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface FAQBrowserProps {
  initialCategories?: FAQCategory[];
  initialQuestions?: FAQQuestion[];
  onQuestionSelect?: (questionId: string) => void;
  showSearch?: boolean;
  showTabs?: boolean;
  className?: string;
}

export function FAQBrowser({
  initialCategories = [],
  initialQuestions = [],
  onQuestionSelect,
  showSearch = true,
  showTabs = true,
  className = '',
}: FAQBrowserProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<FAQCategory[]>(initialCategories);
  const [questions, setQuestions] = useState<FAQQuestion[]>(initialQuestions);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('categories');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch categories
        const categoriesResponse = await fetch('/api/faq/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories || []);

        // Fetch popular questions
        const questionsResponse = await fetch('/api/faq/questions');
        if (!questionsResponse.ok) {
          throw new Error('Failed to fetch questions');
        }
        const questionsData = await questionsResponse.json();
        setQuestions(questionsData.questions || []);
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
        setError('Failed to load FAQ data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (initialCategories.length === 0 || initialQuestions.length === 0) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [initialCategories.length, initialQuestions.length]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/faq/questions?search=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Failed to search questions');
      }
      const data = await response.json();
      setQuestions(data.questions || []);
      setActiveTab('questions');
    } catch (error) {
      console.error('Error searching questions:', error);
      setError('Failed to search questions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/faq/questions?categoryId=${categoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch category questions');
      }
      const data = await response.json();
      setQuestions(data.questions || []);
      setActiveTab('questions');
    } catch (error) {
      console.error('Error fetching category questions:', error);
      setError('Failed to load category questions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (questionId: string) => {
    if (onQuestionSelect) {
      onQuestionSelect(questionId);
    } else {
      router.push(`/faq/questions/${questionId}`);
    }
  };

  const renderCategories = () => {
    if (isLoading && categories.length === 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="p-4 pb-2">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (categories.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No FAQ categories found.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCategorySelect(category.id)}
          >
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-sm text-muted-foreground mb-2">
                {category.description || `Frequently asked questions about ${category.name}`}
              </p>
              <Badge variant="secondary">
                {category._count?.questions || 0} question{category._count?.questions !== 1 ? 's' : ''}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderQuestions = () => {
    if (isLoading && questions.length === 0) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Skeleton className="h-5 w-full mb-2" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (questions.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No questions found. Try a different search term or category.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {questions.map((question) => (
          <Card
            key={question.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleQuestionClick(question.id)}
          >
            <CardContent className="p-4">
              <p className="font-medium mb-2">{question.question}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {question.category.name}
                </Badge>
                
                {question.keyStage && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Bookmark className="h-3 w-3" />
                    KS{question.keyStage}
                  </Badge>
                )}
                
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {question.viewCount} view{question.viewCount !== 1 ? 's' : ''}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="p-4 pb-2">
        <CardTitle>Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {showSearch && (
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button onClick={handleSearch} disabled={isLoading || !searchTerm.trim()}>
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        )}

        {showTabs ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
            </TabsList>
            <TabsContent value="categories">{renderCategories()}</TabsContent>
            <TabsContent value="questions">{renderQuestions()}</TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6">
            {activeTab === 'categories' ? renderCategories() : renderQuestions()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
