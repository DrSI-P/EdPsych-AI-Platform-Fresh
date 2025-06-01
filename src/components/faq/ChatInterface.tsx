import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Loader2, Send, ThumbsUp, ThumbsDown, HelpCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string | Date;
  sources?: {
    id: string;
    question: string;
  }[];
}

interface ChatInterfaceProps {
  initialSessionId?: string;
  initialMessages?: Message[];
  showTitle?: boolean;
  showSources?: boolean;
  showFeedback?: boolean;
  className?: string;
}

export function ChatInterface({
  initialSessionId,
  initialMessages = [],
  showTitle = true,
  showSources = true,
  showFeedback = true,
  className = '',
}: ChatInterfaceProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(initialSessionId);
  const [sessionTitle, setSessionTitle] = useState<string>('New Chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: input,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/faq/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: input,
          sessionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Update session ID if this is a new session
      if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId);
      }

      // Add assistant message
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== userMessage.id),
        {
          id: data.userMessage.id,
          role: 'user',
          content: data.userMessage.content,
          createdAt: data.userMessage.createdAt,
        },
        {
          id: data.assistantMessage.id,
          role: 'assistant',
          content: data.assistantMessage.content,
          createdAt: data.assistantMessage.createdAt,
          sources: data.sources,
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message',
        variant: 'destructive',
      });

      // Remove the temporary user message
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle feedback
  const handleFeedback = async (messageId: string, isHelpful: boolean) => {
    try {
      await fetch(`/api/faq/chat/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          isHelpful,
        }),
      });

      toast({
        title: 'Thank you for your feedback',
        description: 'Your feedback helps us improve our responses.',
      });
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  // Handle starting a new chat
  const handleNewChat = () => {
    setMessages([]);
    setSessionId(undefined);
    setSessionTitle('New Chat');
  };

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      {showTitle && (
        <CardHeader className="px-4 py-2 border-b">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>{sessionTitle}</span>
            <Button variant="ghost" size="sm" onClick={handleNewChat}>
              <RefreshCw className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </CardTitle>
        </CardHeader>
      )}

      <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <HelpCircle className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium">How can I help you today?</h3>
            <p className="max-w-sm">
              Ask me anything about educational psychology, special educational needs, or UK curriculum.
            </p>
          </div>
        ) : (
          messages
            .filter((msg) => msg.role !== 'system')
            .map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    {message.role === 'user' ? (
                      session?.user?.image ? (
                        <AvatarImage src={session.user.image} alt="User" />
                      ) : (
                        <AvatarFallback>{session?.user?.name?.[0] || 'U'}</AvatarFallback>
                      )
                    ) : (
                      <AvatarImage src="/images/edpsych-logo.png" alt="EdPsych Assistant" />
                    )}
                  </Avatar>

                  <div className="space-y-2">
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p>{message.content}</p>
                      )}
                    </div>

                    {message.role === 'assistant' && showSources && message.sources && message.sources.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium">Sources:</p>
                        <ul className="list-disc list-inside">
                          {message.sources.map((source) => (
                            <li key={source.id}>
                              <a
                                href={`/faq/questions/${source.id}`}
                                className="hover:underline text-primary"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {source.question}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {message.role === 'assistant' && showFeedback && (
                      <div className="flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => handleFeedback(message.id, true)}
                              >
                                <ThumbsUp className="h-4 w-4" />
                                <span className="sr-only">Helpful</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Mark as helpful</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => handleFeedback(message.id, false)}
                              >
                                <ThumbsDown className="h-4 w-4" />
                                <span className="sr-only">Not helpful</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Mark as not helpful</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/images/edpsych-logo.png" alt="EdPsych Assistant" />
              </Avatar>
              <div className="rounded-lg p-3 bg-muted">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="p-4 pt-2 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex w-full gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            className="flex-grow resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
