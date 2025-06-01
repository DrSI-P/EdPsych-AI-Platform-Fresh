import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Define form schema
const commentFormSchema = z.object({
  content: z.string().min(3, 'Comment must be at least 3 characters'),
});

type CommentFormValues = z.infer<typeof commentFormSchema>;

interface BlogCommentFormProps {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  isReply?: boolean;
}

export function BlogCommentForm({
  postId,
  parentId,
  onSuccess,
  onCancel,
  isReply = false
}: BlogCommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Define form with validation
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = async (data: CommentFormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/blog/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          content: data.content,
          parentId,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit comment');
      }
      
      // Reset form
      form.reset();
      
      // Show success message
      toast({
        title: 'Comment submitted',
        description: result.message || 'Your comment has been submitted successfully.',
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit comment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className={isReply ? 'p-3' : 'p-4'}>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder={isReply ? "Write a reply..." : "Share your thoughts..."}
                      {...field} 
                      rows={isReply ? 2 : 4}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className={`flex justify-end gap-2 ${isReply ? 'p-3 pt-0' : 'p-4 pt-0'}`}>
            {onCancel && (
              <Button 
                type="button" 
                variant="ghost" 
                size={isReply ? "sm" : "default"}
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              size={isReply ? "sm" : "default"}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isReply ? 'Reply' : 'Post Comment'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
