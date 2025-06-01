'use client';

import React, { useState, useEffect } from 'react';
import { 
  ContentElement, 
  ContentElementType,
  TextElement,
  ImageElement,
  VideoElement,
  AudioElement,
  QuestionElement,
  QuestionType,
  TableElement,
  ChartElement,
  InteractiveElement
} from '@/lib/content-creation/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ElementEditorProps {
  element: ContentElement;
  onUpdate: (updatedElement: Partial<ContentElement>) => void;
}

export const ElementEditor: React.FC<ElementEditorProps> = ({
  element,
  onUpdate
}) => {
  const { toast } = useToast();
  
  // Text element editor
  const renderTextEditor = () => {
    const textElement = element as TextElement;
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="textContent">Content</Label>
          <Textarea 
            id="textContent" 
            value={textElement.content || ''} 
            onChange={(e) => onUpdate({ content: e.target.value })} 
            className="min-h-[200px]"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="textFormat">Format</Label>
            <Select 
              value={textElement.format || 'plain'} 
              onValueChange={(value) => onUpdate({ format: value as 'plain' | 'markdown' | 'html' })}
            >
              <SelectTrigger id="textFormat">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plain">Plain Text</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="textAlign">Text Alignment</Label>
            <Select 
              value={textElement.style?.textAlign || 'left'} 
              onValueChange={(value) => onUpdate({ 
                style: { 
                  ...textElement.style, 
                  textAlign: value as 'left' | 'centre' | 'right' | 'justify' 
                } 
              })}
            >
              <SelectTrigger id="textAlign">
                <SelectValue placeholder="Select alignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="centre">Centre</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="justify">Justify</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fontSize">Font Size</Label>
            <Input 
              id="fontSize" 
              value={textElement.style?.fontSize || ''} 
              onChange={(e) => onUpdate({ 
                style: { 
                  ...textElement.style, 
                  fontSize: e.target.value 
                } 
              })} 
              placeholder="e.g., 16px or 1.2rem"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fontWeight">Font Weight</Label>
            <Select 
              value={textElement.style?.fontWeight || ''} 
              onValueChange={(value) => onUpdate({ 
                style: { 
                  ...textElement.style, 
                  fontWeight: value 
                } 
              })}
            >
              <SelectTrigger id="fontWeight">
                <SelectValue placeholder="Select weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="lighter">Lighter</SelectItem>
                <SelectItem value="bolder">Bolder</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fontStyle">Font Style</Label>
            <Select 
              value={textElement.style?.fontStyle || ''} 
              onValueChange={(value) => onUpdate({ 
                style: { 
                  ...textElement.style, 
                  fontStyle: value 
                } 
              })}
            >
              <SelectTrigger id="fontStyle">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="italic">Italic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="textColor">Text Colour</Label>
            <div className="flex gap-2">
              <Input 
                id="textColor" 
                type="colour"
                value={textElement.style?.colour || '#000000'} 
                onChange={(e) => onUpdate({ 
                  style: { 
                    ...textElement.style, 
                    color: e.target.value 
                  } 
                })} 
                className="w-12 p-1 h-10"
              />
              <Input 
                value={textElement.style?.colour || ''} 
                onChange={(e) => onUpdate({ 
                  style: { 
                    ...textElement.style, 
                    color: e.target.value 
                  } 
                })} 
                placeholder="#000000 or rgb(0,0,0)"
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bgColor">Background Colour</Label>
            <div className="flex gap-2">
              <Input 
                id="bgColor" 
                type="colour"
                value={textElement.style?.backgroundColor || '#ffffff'} 
                onChange={(e) => onUpdate({ 
                  style: { 
                    ...textElement.style, 
                    backgroundColor: e.target.value 
                  } 
                })} 
                className="w-12 p-1 h-10"
              />
              <Input 
                value={textElement.style?.backgroundColor || ''} 
                onChange={(e) => onUpdate({ 
                  style: { 
                    ...textElement.style, 
                    backgroundColor: e.target.value 
                  } 
                })} 
                placeholder="#ffffff or rgb(255,255,255)"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Image element editor
  const renderImageEditor = () => {
    const imageElement = element as ImageElement;
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="imageSrc">Image URL</Label>
          <Input 
            id="imageSrc" 
            value={imageElement.src || ''} 
            onChange={(e) => onUpdate({ src: e.target.value })} 
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="imageAlt">Alt Text (for accessibility)</Label>
          <Input 
            id="imageAlt" 
            value={imageElement.alt || ''} 
            onChange={(e) => onUpdate({ alt: e.target.value })} 
            placeholder="Descriptive text for screen readers"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="imageCaption">Caption</Label>
          <Input 
            id="imageCaption" 
            value={imageElement.caption || ''} 
            onChange={(e) => onUpdate({ caption: e.target.value })} 
            placeholder="Optional caption text"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="imageWidth">Width</Label>
            <Input 
              id="imageWidth" 
              value={imageElement.width || ''} 
              onChange={(e) => onUpdate({ width: e.target.value })} 
              placeholder="e.g., 500px or 100%"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageHeight">Height</Label>
            <Input 
              id="imageHeight" 
              value={imageElement.height || ''} 
              onChange={(e) => onUpdate({ height: e.target.value })} 
              placeholder="e.g., 300px or auto"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageAlignment">Alignment</Label>
            <Select 
              value={imageElement.alignment || 'centre'} 
              onValueChange={(value) => onUpdate({ alignment: value as 'left' | 'centre' | 'right' })}
            >
              <SelectTrigger id="imageAlignment">
                <SelectValue placeholder="Select alignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="centre">Centre</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {imageElement.src && (
          <div className="mt-4 p-4 border rounded-md">
            <p className="text-sm text-muted-foreground mb-2">Image Preview:</p>
            <div className={`flex justify-${imageElement.alignment || 'centre'}`}>
              <img 
                src={imageElement.src} 
                alt={imageElement.alt || 'Preview'} 
                style={{
                  width: imageElement.width ? (typeof imageElement.width === 'number' ? `${imageElement.width}px` : imageElement.width) : 'auto',
                  height: imageElement.height ? (typeof imageElement.height === 'number' ? `${imageElement.height}px` : imageElement.height) : 'auto',
                }}
                className="max-w-full"
              />
            </div>
            {imageElement.caption && (
              <p className="text-sm text-centre mt-2">{imageElement.caption}</p>
            )}
          </div>
        )}
      </div>
    );
  };
  
  // Video element editor
  const renderVideoEditor = () => {
    const videoElement = element as VideoElement;
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="videoSrc">Video URL</Label>
          <Input 
            id="videoSrc" 
            value={videoElement.src || ''} 
            onChange={(e) => onUpdate({ src: e.target.value })} 
            placeholder="https://example.com/video.mp4 or YouTube/Vimeo URL"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="videoTitle">Title</Label>
          <Input 
            id="videoTitle" 
            value={videoElement.title || ''} 
            onChange={(e) => onUpdate({ title: e.target.value })} 
            placeholder="Video title"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="videoDescription">Description</Label>
          <Textarea 
            id="videoDescription" 
            value={videoElement.description || ''} 
            onChange={(e) => onUpdate({ description: e.target.value })} 
            placeholder="Video description"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="videoPoster">Poster Image URL</Label>
            <Input 
              id="videoPoster" 
              value={videoElement.poster || ''} 
              onChange={(e) => onUpdate({ poster: e.target.value })} 
              placeholder="https://example.com/poster.jpg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="videoDuration">Duration (seconds)</Label>
            <Input 
              id="videoDuration" 
              type="number"
              value={videoElement.duration || ''} 
              onChange={(e) => onUpdate({ duration: parseInt(e.target.value) || undefined })} 
              placeholder="e.g., 120"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="videoWidth">Width</Label>
            <Input 
              id="videoWidth" 
              value={videoElement.width || ''} 
              onChange={(e) => onUpdate({ width: e.target.value })} 
              placeholder="e.g., 640px or 100%"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="videoHeight">Height</Label>
            <Input 
              id="videoHeight" 
              value={videoElement.height || ''} 
              onChange={(e) => onUpdate({ height: e.target.value })} 
              placeholder="e.g., 360px or auto"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-centre h-full pt-8">
              <div className="flex items-centre space-x-2">
                <input 
                  type="checkbox" 
                  id="videoControls" 
                  checked={videoElement.controls !== false} 
                  onChange={(e) => onUpdate({ controls: e.target.checked })} 
                />
                <Label htmlFor="videoControls">Show Controls</Label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Captions/Subtitles</Label>
          {videoElement.captions?.map((caption, index) => (
            <div key={index} className="flex gap-2 items-centre">
              <Input 
                value={caption.src} 
                onChange={(e) => {
                  const newCaptions = [...(videoElement.captions || [])];
                  newCaptions[index] = { ...newCaptions[index], src: e.target.value };
                  onUpdate({ captions: newCaptions });
                }} 
                placeholder="Caption file URL"
                className="flex-1"
              />
              <Input 
                value={caption.language} 
                onChange={(e) => {
                  const newCaptions = [...(videoElement.captions || [])];
                  newCaptions[index] = { ...newCaptions[index], language: e.target.value };
                  onUpdate({ captions: newCaptions });
                }} 
                placeholder="Language code (e.g., en)"
                className="w-20"
              />
              <Input 
                value={caption.label} 
                onChange={(e) => {
                  const newCaptions = [...(videoElement.captions || [])];
                  newCaptions[index] = { ...newCaptions[index], label: e.target.value };
                  onUpdate({ captions: newCaptions });
                }} 
                placeholder="Label (e.g., English)"
                className="w-32"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  const newCaptions = [...(videoElement.captions || [])];
                  newCaptions.splice(index, 1);
                  onUpdate({ captions: newCaptions });
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              const newCaptions = [...(videoElement.captions || []), { src: '', language: '', label: '' }];
              onUpdate({ captions: newCaptions });
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Caption
          </Button>
        </div>
      </div>
    );
  };
  
  // Question element editor
  const renderQuestionEditor = () => {
    const questionElement = element as QuestionElement;
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="questionType">Question Type</Label>
          <Select 
            value={questionElement.questionType || QuestionType.MULTIPLE_CHOICE} 
            onValueChange={(value) => onUpdate({ questionType: value as QuestionType })}
          >
            <SelectTrigger id="questionType">
              <SelectValue placeholder="Select question type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(QuestionType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="questionText">Question</Label>
          <Textarea 
            id="questionText" 
            value={questionElement.question || ''} 
            onChange={(e) => onUpdate({ question: e.target.value })} 
            placeholder="Enter your question here"
          />
        </div>
        
        {(questionElement.questionType === QuestionType.MULTIPLE_CHOICE || 
          questionElement.questionType === QuestionType.TRUE_FALSE ||
          questionElement.questionType === QuestionType.MATCHING ||
          questionElement.questionType === QuestionType.RANKING) && (
          <div className="space-y-2">
            <Label>Options</Label>
            {questionElement.options?.map((option, index) => (
              <div key={index} className="flex gap-2 items-centre">
                <Input 
                  value={option} 
                  onChange={(e) => {
                    const newOptions = [...(questionElement.options || [])];
                    newOptions[index] = e.target.value;
                    onUpdate({ options: newOptions });
                  }} 
                  placeholder={`Option ${index + 1}`}
                  className="flex-1"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    const newOptions = [...(questionElement.options || [])];
                    newOptions.splice(index, 1);
                    onUpdate({ options: newOptions });
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const newOptions = [...(questionElement.options || []), ''];
                onUpdate({ options: newOptions });
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Option
            </Button>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="correctAnswer">Correct Answer</Label>
          {questionElement.questionType === QuestionType.MULTIPLE_CHOICE && (
            <Select 
              value={questionElement.correctAnswer as string || ''} 
              onValueChange={(value) => onUpdate({ correctAnswer: value })}
            >
              <SelectTrigger id="correctAnswer">
                <SelectValue placeholder="Select correct answer" />
              </SelectTrigger>
              <SelectContent>
                {questionElement.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {questionElement.questionType === QuestionType.TRUE_FALSE && (
            <Select 
              value={questionElement.correctAnswer as string || ''} 
              onValueChange={(value) => onUpdate({ correctAnswer: value })}
            >
              <SelectTrigger id="correctAnswer">
                <SelectValue placeholder="Select correct answer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          {(questionElement.questionType === QuestionType.SHORT_ANSWER || 
            questionElement.questionType === QuestionType.FILL_IN_BLANK) && (
            <Input 
              id="correctAnswer" 
              value={questionElement.correctAnswer as string || ''} 
              onChange={(e) => onUpdate({ correctAnswer: e.target.value })} 
              placeholder="Correct answer"
            />
          )}
          
          {questionElement.questionType === QuestionType.ESSAY && (
            <Textarea 
              id="correctAnswer" 
              value={questionElement.correctAnswer as string || ''} 
              onChange={(e) => onUpdate({ correctAnswer: e.target.value })} 
              placeholder="Model answer or marking guide"
            />
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="explanation">Explanation</Label>
          <Textarea 
            id="explanation" 
            value={questionElement.explanation || ''} 
            onChange={(e) => onUpdate({ explanation: e.target.value })} 
            placeholder="Explanation for the correct answer"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="points">Points</Label>
            <Input 
              id="points" 
              type="number"
              value={questionElement.points || ''} 
              onChange={(e) => onUpdate({ points: parseInt(e.target.value) || undefined })} 
              placeholder="e.g., 10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select 
              value={questionElement.difficulty || 'medium'} 
              onValueChange={(value) => onUpdate({ difficulty: value as 'easy' | 'medium' | 'hard' })}
            >
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Feedback</Label>
          <div className="grid grid-cols-1 gap-2">
            <div className="space-y-1">
              <Label htmlFor="correctFeedback" className="text-sm">Correct Answer Feedback</Label>
              <Input 
                id="correctFeedback" 
                value={questionElement.feedback?.correct || ''} 
                onChange={(e) => onUpdate({ 
                  feedback: { 
                    ...questionElement.feedback,
                    correct: e.target.value 
                  } 
                })} 
                placeholder="Feedback for correct answers"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="incorrectFeedback" className="text-sm">Incorrect Answer Feedback</Label>
              <Input 
                id="incorrectFeedback" 
                value={questionElement.feedback?.incorrect || ''} 
                onChange={(e) => onUpdate({ 
                  feedback: { 
                    ...questionElement.feedback,
                    incorrect: e.target.value 
                  } 
                })} 
                placeholder="Feedback for incorrect answers"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="partialFeedback" className="text-sm">Partial Credit Feedback</Label>
              <Input 
                id="partialFeedback" 
                value={questionElement.feedback?.partial || ''} 
                onChange={(e) => onUpdate({ 
                  feedback: { 
                    ...questionElement.feedback,
                    partial: e.target.value 
                  } 
                })} 
                placeholder="Feedback for partially correct answers"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render the appropriate editor based on element type
  const renderEditor = () => {
    switch (element.type) {
      case ContentElementType.TEXT:
        return renderTextEditor();
      case ContentElementType.IMAGE:
        return renderImageEditor();
      case ContentElementType.VIDEO:
        return renderVideoEditor();
      case ContentElementType.QUESTION:
        return renderQuestionEditor();
      default:
        return (
          <div className="p-4 text-centre">
            <p>Editor for {element.type} elements is not yet implemented.</p>
            <p className="text-sm text-muted-foreground mt-2">This element type will be supported in a future update.</p>
          </div>
        );
    }
  };
  
  return (
    <div className="element-editor">
      {renderEditor()}
    </div>
  );
};

export default ElementEditor;
