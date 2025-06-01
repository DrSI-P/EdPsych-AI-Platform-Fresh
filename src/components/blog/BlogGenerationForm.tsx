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
const generationFormSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  topicArea: z.string().optional(),
  keyStage: z.string().optional(),
  targetAudience: z.string().optional(),
  contentLength: z.enum(['short', 'medium', 'long']).default('medium'),
});

type GenerationFormValues = z.infer<typeof generationFormSchema>;

export function BlogGenerationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Define form with validation
  const form = useForm<GenerationFormValues>({
    resolver: zodResolver(generationFormSchema),
    defaultValues: {
      prompt: '',
      topicArea: '',
      keyStage: '',
      targetAudience: '',
      contentLength: 'medium',
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

  // Target audience options
  const targetAudienceOptions = [
    { value: 'students', label: 'Students' },
    { value: 'teachers', label: 'Teachers' },
    { value: 'parents', label: 'Parents' },
    { value: 'professionals', label: 'Educational Professionals' },
  ];

  const onSubmit = async (data: GenerationFormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate content');
      }
      
      // Reset form
      form.reset();
      
      // Show success message
      toast({
        title: 'Content generation started',
        description: 'Your blog post is being generated. This may take a few minutes.',
      });
      
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate content',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate New Blog Content</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Prompt</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the blog post you want to generate..."
                      {...field} 
                      rows={4}
                    />
                  </FormControl>
                  <FormDescription>
                    Be specific about the topic, educational context, and key points to include.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="topicArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Curriculum Area</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a curriculum area" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Any</SelectItem>
                        {curriculumAreaOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="keyStage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Stage</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a key stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Any</SelectItem>
                        {keyStageOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target audience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Any</SelectItem>
                        {targetAudienceOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contentLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Length</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content length" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="short">Short (~300 words)</SelectItem>
                        <SelectItem value="medium">Medium (~800 words)</SelectItem>
                        <SelectItem value="long">Long (~1500 words)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Blog Post
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
