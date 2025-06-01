import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Define form schema
const faqFormSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters'),
  answer: z.string().min(10, 'Answer must be at least 10 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  isPublished: z.boolean().default(true),
  keywords: z.array(z.string()).default([]),
  keyStage: z.string().optional().nullable(),
  curriculumArea: z.string().optional().nullable(),
  isTrainingData: z.boolean().default(true),
});

type FAQFormValues = z.infer<typeof faqFormSchema>;

interface FAQFormProps {
  initialData?: Partial<FAQFormValues>;
  categories?: { id: string; name: string }[];
  isSubmitting?: boolean;
  onSubmit: (data: FAQFormValues) => void;
  mode?: 'create' | 'edit';
  className?: string;
}

export function FAQForm({
  initialData,
  categories = [],
  isSubmitting = false,
  onSubmit,
  mode = 'create',
  className = '',
}: FAQFormProps) {
  const { toast } = useToast();
  
  // Define form with validation
  const form = useForm<FAQFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: initialData?.question || '',
      answer: initialData?.answer || '',
      categoryId: initialData?.categoryId || '',
      isPublished: initialData?.isPublished ?? true,
      keywords: initialData?.keywords || [],
      keyStage: initialData?.keyStage || null,
      curriculumArea: initialData?.curriculumArea || null,
      isTrainingData: initialData?.isTrainingData ?? true,
    },
  });

  // Key stage options
  const keyStageOptions = [
    { value: '1', label: 'Key Stage 1' },
    { value: '2', label: 'Key Stage 2' },
    { value: '3', label: 'Key Stage 3' },
    { value: '4', label: 'Key Stage 4' },
    { value: '5', label: 'Key Stage 5' },
  ];

  // Curriculum area options
  const curriculumAreaOptions = [
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'English', label: 'English' },
    { value: 'Science', label: 'Science' },
    { value: 'History', label: 'History' },
    { value: 'Geography', label: 'Geography' },
    { value: 'Art', label: 'Art' },
    { value: 'Music', label: 'Music' },
    { value: 'Physical Education', label: 'Physical Education' },
    { value: 'Computing', label: 'Computing' },
    { value: 'Design and Technology', label: 'Design and Technology' },
    { value: 'Languages', label: 'Languages' },
    { value: 'Religious Education', label: 'Religious Education' },
    { value: 'PSHE', label: 'PSHE' },
    { value: 'Special Educational Needs', label: 'Special Educational Needs' },
  ];

  // Handle keyword input
  const [keywordInput, setKeywordInput] = useState('');
  const handleAddKeyword = () => {
    if (keywordInput.trim() && !form.getValues('keywords').includes(keywordInput.trim())) {
      form.setValue('keywords', [...form.getValues('keywords'), keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    form.setValue('keywords', form.getValues('keywords').filter(k => k !== keyword));
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Create New FAQ' : 'Edit FAQ'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the question" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the answer (supports Markdown formatting)"
                      {...field} 
                      rows={6}
                    />
                  </FormControl>
                  <FormDescription>
                    You can use Markdown formatting for rich text.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="keyStage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Stage</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a key stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {keyStageOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The UK key stage this FAQ is relevant to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="curriculumArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Curriculum Area</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a curriculum area" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {curriculumAreaOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The curriculum subject area this FAQ relates to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormLabel>Keywords</FormLabel>
              <div className="flex gap-2 mt-1">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="Add a keyword"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddKeyword();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddKeyword} variant="secondary">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.getValues('keywords').map(keyword => (
                  <div key={keyword} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1 text-sm">
                    {keyword}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="ml-1 rounded-full hover:bg-muted p-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <FormDescription className="mt-2">
                Keywords help users find this FAQ when searching.
              </FormDescription>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Published</FormLabel>
                      <FormDescription>
                        Make this FAQ visible to users
                      </FormDescription>
                    </div>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isTrainingData"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Use for AI Training</FormLabel>
                      <FormDescription>
                        Include in AI chatbot training data
                      </FormDescription>
                    </div>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Create FAQ' : 'Update FAQ'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
