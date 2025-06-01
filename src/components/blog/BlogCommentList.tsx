import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BlogCommentForm } from './BlogCommentForm';

interface Comment {
  id: string;
  content: string;
  status: string;
  createdAt: string | Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  replies: any[];
}

interface BlogCommentListProps {
  postId: string;
}

export function BlogCommentList({ postId }: BlogCommentListProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/blog/comments?postId=${postId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="p-4 pb-0">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
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

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  const handleReplySuccess = () => {
    setReplyingTo(null);
    fetchComments();
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const isAuthor = session?.user?.id === comment.author.id;
    const isAdmin = session?.user?.role === 'admin';
    const isTeacher = session?.user?.role === 'teacher';
    const canModerate = isAdmin || isTeacher;
    
    // Format the comment date
    const commentDate = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
    
    return (
      <Card key={comment.id} className={isReply ? 'ml-8 mt-2' : 'mb-4'}>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author.image || undefined} alt={comment.author.name || 'User'} />
                <AvatarFallback>{comment.author.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{comment.author.name}</p>
                <p className="text-xs text-muted-foreground">{commentDate}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 pb-2">
          <p className="text-sm">{comment.content}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <div className="flex gap-2">
            {session && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              >
                {replyingTo === comment.id ? 'Cancel' : 'Reply'}
              </Button>
            )}
          </div>
          
          {(isAuthor || canModerate) && (
            <div className="flex gap-2">
              {isAuthor && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  // Edit functionality would be implemented here
                >
                  Edit
                </Button>
              )}
              
              {(isAuthor || canModerate) && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  // Delete functionality would be implemented here
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </CardFooter>
        
        {replyingTo === comment.id && (
          <div className="px-4 pb-4">
            <BlogCommentForm 
              postId={postId}
              parentId={comment.id}
              onSuccess={handleReplySuccess}
              onCancel={() => setReplyingTo(null)}
              isReply
            />
          </div>
        )}
        
        {comment.replies && comment.replies.length > 0 && (
          <div className="px-4 pb-4">
            {comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {comments.map(comment => renderComment(comment))}
    </div>
  );
}
