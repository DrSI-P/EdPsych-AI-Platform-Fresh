'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  PlusCircle, MinusCircle, Save, Edit, Trash2, Copy, Check, X, 
  Search, Filter, SortAsc, SortDesc, FileText, Book, Video, 
  Image, File, ExternalLink, Eye, Download, Upload, RefreshCw
} from 'lucide-react';

import { 
  ContentItem, 
  ContentType, 
  ContentFormat, 
  ReviewStatus, 
  DifficultyLevel,
  ContentVariant,
  ContentData,
  InteractiveElement,
  InteractiveElementType,
  ExternalResource,
  ExternalResourceType,
  CurriculumStandard
} from '@/lib/content-management/types';
import { UKKeyStage, UKSubject } from '@/lib/assessment/types';
import { LearningStyle } from '@/lib/learning-path/types';

interface ContentCreatorProps {
  initialContent?: ContentItem;
  curriculumStandards: CurriculumStandard[];
  onSave?: (content: ContentItem) => void;
  onPreview?: (content: ContentItem) => void;
  className?: string;
}

export function ContentCreator({
  initialContent,
  curriculumStandards,
  onSave,
  onPreview,
  className = ''
}: ContentCreatorProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  const [content, setContent] = useState<Partial<ContentItem>>(
    initialContent || {
      title: '',
      description: '',
      type: ContentType.LESSON,
      format: ContentFormat.HTML,
      subject: UKSubject.ENGLISH,
      keyStage: UKKeyStage.KS2,
      yearGroup: [],
      curriculumStandards: [],
      learningObjectives: [''],
      content: [
        {
          learningStyle: LearningStyle.VISUAL,
          data: {
            body: '',
            mediaUrls: [],
            attachments: [],
            interactiveElements: [],
            externalResources: []
          },
          isDefault: true
        }
      ],
      author: '',
      reviewStatus: ReviewStatus.DRAFT,
      tags: [],
      difficulty: DifficultyLevel.INTERMEDIATE,
      estimatedDuration: 30,
      prerequisites: [],
      relatedContent: [],
      assessments: []
    }
  );

  // Handle basic field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle array field change (learning objectives, tags, etc.)
  const handleArrayFieldChange = (field: 'learningObjectives' | 'tags' | 'prerequisites' | 'relatedContent' | 'assessments' | 'yearGroup', index: number, value: string) => {
    setContent(prev => {
      const newArray = [...(prev[field] || [])];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  // Add item to array field
  const addArrayItem = (field: 'learningObjectives' | 'tags' | 'prerequisites' | 'relatedContent' | 'assessments' | 'yearGroup') => {
    setContent(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  // Remove item from array field
  const removeArrayItem = (field: 'learningObjectives' | 'tags' | 'prerequisites' | 'relatedContent' | 'assessments' | 'yearGroup', index: number) => {
    setContent(prev => {
      const newArray = [...(prev[field] || [])];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray.length ? newArray : [''] };
    });
  };

  // Handle curriculum standard selection
  const handleCurriculumStandardChange = (selectedIds: string[]) => {
    const selectedStandards = curriculumStandards.filter(standard => 
      selectedIds.includes(standard.id)
    );
    
    setContent(prev => ({
      ...prev,
      curriculumStandards: selectedStandards
    }));
  };

  // Handle content variant changes
  const handleContentVariantChange = (index: number, field: keyof ContentVariant, value: any) => {
    setContent(prev => {
      const newVariants = [...(prev.content || [])];
      newVariants[index] = {
        ...newVariants[index],
        [field]: value
      };
      return { ...prev, content: newVariants };
    });
  };

  // Handle content data changes
  const handleContentDataChange = (variantIndex: number, field: keyof ContentData, value: any) => {
    setContent(prev => {
      const newVariants = [...(prev.content || [])];
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        data: {
          ...newVariants[variantIndex].data,
          [field]: value
        }
      };
      return { ...prev, content: newVariants };
    });
  };

  // Add content variant for a learning style
  const addContentVariant = (learningStyle: LearningStyle) => {
    // Check if variant for this learning style already exists
    if (content.content?.some(variant => variant.learningStyle === learningStyle)) {
      toast({
        title: 'Variant already exists',
        description: `A variant for ${learningStyle} learning style already exists.`,
        variant: 'destructive'
      });
      return;
    }

    setContent(prev => ({
      ...prev,
      content: [
        ...(prev.content || []),
        {
          learningStyle,
          data: {
            body: '',
            mediaUrls: [],
            attachments: [],
            interactiveElements: [],
            externalResources: []
          },
          isDefault: false
        }
      ]
    }));
  };

  // Remove content variant
  const removeContentVariant = (index: number) => {
    // Don't allow removing the default variant
    if (content.content?.[index].isDefault) {
      toast({
        title: 'Cannot remove default variant',
        description: 'The default variant cannot be removed.',
        variant: 'destructive'
      });
      return;
    }

    setContent(prev => {
      const newVariants = [...(prev.content || [])];
      newVariants.splice(index, 1);
      return { ...prev, content: newVariants };
    });
  };

  // Set a variant as default
  const setDefaultVariant = (index: number) => {
    setContent(prev => {
      const newVariants = (prev.content || []).map((variant, i) => ({
        ...variant,
        isDefault: i === index
      }));
      return { ...prev, content: newVariants };
    });
  };

  // Add media URL to a variant
  const addMediaUrl = (variantIndex: number, url: string) => {
    setContent(prev => {
      const newVariants = [...(prev.content || [])];
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        data: {
          ...newVariants[variantIndex].data,
          mediaUrls: [...(newVariants[variantIndex].data.mediaUrls || []), url]
        }
      };
      return { ...prev, content: newVariants };
    });
  };

  // Remove media URL from a variant
  const removeMediaUrl = (variantIndex: number, urlIndex: number) => {
    setContent(prev => {
      const newVariants = [...(prev.content || [])];
      const newMediaUrls = [...(newVariants[variantIndex].data.mediaUrls || [])];
      newMediaUrls.splice(urlIndex, 1);
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        data: {
          ...newVariants[variantIndex].data,
          mediaUrls: newMediaUrls
        }
      };
      return { ...prev, content: newVariants };
    });
  };

  // Add interactive element to a variant
  const addInteractiveElement = (variantIndex: number, element: InteractiveElement) => {
    setContent(prev => {
      const newVariants = [...(prev.content || [])];
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        data: {
          ...newVariants[variantIndex].data,
          interactiveElements: [
            ...(newVariants[variantIndex].data.interactiveElements || []),
            element
          ]
        }
      };
      return { ...prev, content: newVariants };
    });
  };

  // Remove interactive element from a variant
  const removeInteractiveElement = (variantIndex: number, elementIndex: number) => {
    setContent(prev => {
      const newVariants = [...(prev.content || [])];
      const newElements = [...(newVariants[variantIndex].data.interactiveElements || [])];
      newElements.splice(elementIndex, 1);
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        data: {
          ...newVariants[variantIndex].data,
          interactiveElements: newElements
        }
      };
      return { ...prev, content: newVariants };
    });
  };

  // Add external resource to a variant
  const addExternalResource = (variantIndex: number, resource: ExternalResource) => {
    setContent(prev => {
      const newVariants = [...(prev.content || [])];
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        data: {
          ...newVariants[variantIndex].data,
          externalResources: [
            ...(newVariants[variantIndex].data.externalResources || []),
            resource
          ]
        }
      };
      return { ...prev, content: newVariants };
    });
  };

  // Remove external resource from a variant
  const removeExternalResource = (variantIndex: number, resourceIndex: number) => {
    setContent(prev => {
      const newVariants = [...(prev.content || [])];
      const newResources = [...(newVariants[variantIndex].data.externalResources || [])];
      newResources.splice(resourceIndex, 1);
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        data: {
          ...newVariants[variantIndex].data,
          externalResources: newResources
        }
      };
      return { ...prev, content: newVariants };
    });
  };

  // Handle save
  const handleSave = () => {
    // Validate content
    if (!content.title) {
      toast({
        title: 'Validation Error',
        description: 'Content title is required',
        variant: 'destructive'
      });
      return;
    }

    if (!content.content || content.content.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'At least one content variant is required',
        variant: 'destructive'
      });
      return;
    }

    // Ensure there is a default variant
    if (!content.content.some(variant => variant.isDefault)) {
      toast({
        title: 'Validation Error',
        description: 'One content variant must be set as default',
        variant: 'destructive'
      });
      return;
    }

    // Call onSave callback with the content
    onSave?.(content as ContentItem);
    
    toast({
      title: 'Content Saved',
      description: 'The content has been saved successfully',
      variant: 'default'
    });
  };

  // Handle preview
  const handlePreview = () => {
    // Validate content
    if (!content.title) {
      toast({
        title: 'Validation Error',
        description: 'Content title is required',
        variant: 'destructive'
      });
      return;
    }

    if (!content.content || content.content.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'At least one content variant is required',
        variant: 'destructive'
      });
      return;
    }

    // Call onPreview callback with the content
    onPreview?.(content as ContentItem);
  };

  // Render the details tab
  const renderDetailsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Content Title</Label>
          <Input
            id="title"
            name="title"
            value={content.title || ''}
            onChange={handleChange}
            placeholder="Enter content title"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={content.description || ''}
            onChange={handleChange}
            placeholder="Enter content description"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">Content Type</Label>
            <Select
              value={content.type}
              onValueChange={(value) => handleSelectChange('type', value)}
            >
              <SelectTrigger id="type" className="mt-1">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ContentType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="format">Content Format</Label>
            <Select
              value={content.format}
              onValueChange={(value) => handleSelectChange('format', value)}
            >
              <SelectTrigger id="format" className="mt-1">
                <SelectValue placeholder="Select content format" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ContentFormat).map((format) => (
                  <SelectItem key={format} value={format}>
                    {format.charAt(0).toUpperCase() + format.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Select
              value={content.subject}
              onValueChange={(value) => handleSelectChange('subject', value)}
            >
              <SelectTrigger id="subject" className="mt-1">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UKSubject).map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="keyStage">Key Stage</Label>
            <Select
              value={content.keyStage}
              onValueChange={(value) => handleSelectChange('keyStage', value)}
            >
              <SelectTrigger id="keyStage" className="mt-1">
                <SelectValue placeholder="Select key stage" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UKKeyStage).map((keyStage) => (
                  <SelectItem key={keyStage} value={keyStage}>
                    {keyStage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="yearGroup">Year Groups</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 
              'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'].map((year) => {
              const isSelected = content.yearGroup?.includes(year);
              return (
                <Badge 
                  key={year} 
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    if (isSelected) {
                      setContent(prev => ({
                        ...prev,
                        yearGroup: prev.yearGroup?.filter(y => y !== year)
                      }));
                    } else {
                      setContent(prev => ({
                        ...prev,
                        yearGroup: [...(prev.yearGroup || []), year]
                      }));
                    }
                  }}
                >
                  {year}
                </Badge>
              );
            })}
          </div>
        </div>

        <div>
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select
            value={content.difficulty}
            onValueChange={(value) => handleSelectChange('difficulty', value)}
          >
            <SelectTrigger id="difficulty" className="mt-1">
              <SelectValue placeholder="Select difficulty level" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(DifficultyLevel).map((level) => (
                <SelectItem key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="estimatedDuration">Estimated Duration (minutes)</Label>
          <Input
            id="estimatedDuration"
            name="estimatedDuration"
            type="number"
            value={content.estimatedDuration || ''}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            name="author"
            value={content.author || ''}
            onChange={handleChange}
            placeholder="Enter author name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="tags">Tags (press Enter to add)</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {content.tags?.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeArrayItem('tags', index)}
                />
              </Badge>
            ))}
          </div>
          <Input
            id="tags"
            placeholder="Add a tag"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const target = e.target as HTMLInputElement;
                const value = target.value.trim();
                if (value) {
                  setContent(prev => ({
                    ...prev,
                    tags: [...(prev.tags || []), value]
                  }));
                  target.value = '';
                }
              }
            }}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );

  // Render the curriculum standards tab
  const renderCurriculumStandardsTab = () => {
    // Filter curriculum standards by selected subject and key stage
    const filteredStandards = curriculumStandards.filter(
      standard => 
        (!content.subject || standard.subject === content.subject) && 
        (!content.keyStage || standard.keyStage === content.keyStage)
    );

    return (
      <div className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Selected Curriculum Standards</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {content.curriculumStandards?.length ? (
              content.curriculumStandards.map((standard, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {standard.code}: {standard.description.substring(0, 30)}...
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => {
                      setContent(prev => ({
                        ...prev,
                        curriculumStandards: prev.curriculumStandards?.filter((_, i) => i !== index)
                      }));
                    }}
                  />
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No curriculum standards selected</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Available Curriculum Standards</h3>
            <Input 
              placeholder="Search standards..." 
              className="w-64"
              onChange={(e) => {
                // Implement search functionality here
              }}
            />
          </div>

          {filteredStandards.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredStandards.map((standard) => (
                <Card key={standard.id} className="overflow-hidden">
                  <div className="flex items-center p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{standard.code}</h4>
                        <Badge>{standard.subject}</Badge>
                        <Badge variant="outline">{standard.keyStage}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{standard.description}</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        <span className="font-medium">Category:</span> {standard.category}
                        {standard.subcategory && (
                          <> | <span className="font-medium">Subcategory:</span> {standard.subcategory}</>
                        )}
                        <> | <span className="font-medium">Year:</span> {standard.year}</>
                      </div>
                    </div>
                    <Button
                      variant={content.curriculumStandards?.some(s => s.id === standard.id) ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => {
                        const isSelected = content.curriculumStandards?.some(s => s.id === standard.id);
                        if (isSelected) {
                          setContent(prev => ({
                            ...prev,
                            curriculumStandards: prev.curriculumStandards?.filter(s => s.id !== standard.id)
                          }));
                        } else {
                          setContent(prev => ({
                            ...prev,
                            curriculumStandards: [...(prev.curriculumStandards || []), standard]
                          }));
                        }
                      }}
                    >
                      {content.curriculumStandards?.some(s => s.id === standard.id) ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Selected
                        </>
                      ) : (
                        <>
                          <PlusCircle className="h-4 w-4 mr-1" />
                          Select
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No curriculum standards available for the selected subject and key stage</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render the learning objectives tab
  const renderLearningObjectivesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Learning Objectives</h3>
        <Button onClick={() => addArrayItem('learningObjectives')}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Objective
        </Button>
      </div>

      {content.learningObjectives?.length ? (
        <div className="space-y-4">
          {content.learningObjectives.map((objective, index) => (
            <div key={index} className="flex items-start gap-2">
              <Textarea
                value={objective}
                onChange={(e) => handleArrayFieldChange('learningObjectives', index, e.target.value)}
                placeholder="Enter learning objective"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem('learningObjectives', index)}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No learning objectives added yet</p>
          <Button variant="outline" className="mt-4" onClick={() => addArrayItem('learningObjectives')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Your First Objective
          </Button>
        </div>
      )}
    </div>
  );

  // Render the content variants tab
  const renderContentVariantsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Content Variants</h3>
        <div className="flex gap-2">
          <Select
            onValueChange={(value) => addContentVariant(value as LearningStyle)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Add variant" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(LearningStyle)
                .filter(style => !content.content?.some(variant => variant.learningStyle === style))
                .map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {content.content?.length ? (
        <Tabs defaultValue={content.content[0].learningStyle} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            {content.content.map((variant, index) => (
              <TabsTrigger key={index} value={variant.learningStyle} className="relative">
                {variant.learningStyle}
                {variant.isDefault && (
                  <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">
                    Default
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {content.content.map((variant, index) => (
            <TabsContent key={index} value={variant.learningStyle} className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{variant.learningStyle} Content</CardTitle>
                    <div className="flex gap-2">
                      {!variant.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDefaultVariant(index)}
                        >
                          Set as Default
                        </Button>
                      )}
                      {!variant.isDefault && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeContentVariant(index)}
                        >
                          Remove Variant
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    Create content optimized for {variant.learningStyle.toLowerCase()} learners
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`content-body-${index}`}>Content Body</Label>
                    <Textarea
                      id={`content-body-${index}`}
                      value={variant.data.body || ''}
                      onChange={(e) => handleContentDataChange(index, 'body', e.target.value)}
                      placeholder="Enter content body"
                      className="mt-1 min-h-[200px]"
                    />
                  </div>

                  <div>
                    <Label>Media URLs</Label>
                    <div className="space-y-2 mt-1">
                      {variant.data.mediaUrls?.map((url, urlIndex) => (
                        <div key={urlIndex} className="flex items-center gap-2">
                          <Input
                            value={url}
                            onChange={(e) => {
                              const newMediaUrls = [...(variant.data.mediaUrls || [])];
                              newMediaUrls[urlIndex] = e.target.value;
                              handleContentDataChange(index, 'mediaUrls', newMediaUrls);
                            }}
                            placeholder="Enter media URL"
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMediaUrl(index, urlIndex)}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addMediaUrl(index, '')}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Media URL
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>External Resources</Label>
                    <div className="space-y-2 mt-1">
                      {variant.data.externalResources?.map((resource, resourceIndex) => (
                        <Card key={resourceIndex} className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{resource.title}</h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeExternalResource(index, resourceIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">{resource.description}</p>
                            <div className="flex items-center gap-2 text-sm">
                              <ExternalLink className="h-4 w-4" />
                              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                {resource.url}
                              </a>
                            </div>
                            <Badge>{resource.type}</Badge>
                          </div>
                        </Card>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Open a modal or form to add external resource
                          const newResource: ExternalResource = {
                            id: `resource-${Date.now()}`,
                            title: 'New Resource',
                            description: 'Resource description',
                            url: 'https://example.com',
                            type: ExternalResourceType.WEBSITE
                          };
                          addExternalResource(index, newResource);
                        }}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add External Resource
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Interactive Elements</Label>
                    <div className="space-y-2 mt-1">
                      {variant.data.interactiveElements?.map((element, elementIndex) => (
                        <Card key={elementIndex} className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{element.title}</h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeInteractiveElement(index, elementIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">{element.description}</p>
                            <Badge>{element.type}</Badge>
                          </div>
                        </Card>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Open a modal or form to add interactive element
                          const newElement: InteractiveElement = {
                            id: `element-${Date.now()}`,
                            type: InteractiveElementType.QUIZ,
                            title: 'New Quiz',
                            description: 'Quiz description',
                            config: {}
                          };
                          addInteractiveElement(index, newElement);
                        }}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Interactive Element
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No content variants added yet</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => addContentVariant(LearningStyle.VISUAL)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Your First Variant
          </Button>
        </div>
      )}
    </div>
  );

  // Render the related content tab
  const renderRelatedContentTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Prerequisites</h3>
          <div className="space-y-2">
            {content.prerequisites?.map((prerequisite, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={prerequisite}
                  onChange={(e) => handleArrayFieldChange('prerequisites', index, e.target.value)}
                  placeholder="Enter prerequisite content ID"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem('prerequisites', index)}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('prerequisites')}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Prerequisite
            </Button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Related Content</h3>
          <div className="space-y-2">
            {content.relatedContent?.map((related, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={related}
                  onChange={(e) => handleArrayFieldChange('relatedContent', index, e.target.value)}
                  placeholder="Enter related content ID"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem('relatedContent', index)}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('relatedContent')}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Related Content
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Associated Assessments</h3>
        <div className="space-y-2">
          {content.assessments?.map((assessment, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={assessment}
                onChange={(e) => handleArrayFieldChange('assessments', index, e.target.value)}
                placeholder="Enter assessment ID"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem('assessments', index)}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('assessments')}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Assessment
          </Button>
        </div>
      </div>
    </div>
  );

  // Render the settings tab
  const renderSettingsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Status</CardTitle>
          <CardDescription>
            Set the current review status of this content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={content.reviewStatus}
            onValueChange={(value) => handleSelectChange('reviewStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select review status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ReviewStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI-Assisted Content Generation</CardTitle>
          <CardDescription>
            Use AI to help generate content variants for different learning styles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Generate Content Variants</h4>
                <p className="text-sm text-muted-foreground">
                  Create variants for different learning styles based on the default content
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  // Implement AI-assisted content generation
                  toast({
                    title: 'Generating content variants',
                    description: 'This feature is not yet implemented',
                    variant: 'default'
                  });
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Variants
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Enhance Content</h4>
                <p className="text-sm text-muted-foreground">
                  Improve the quality and clarity of your content
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  // Implement AI-assisted content enhancement
                  toast({
                    title: 'Enhancing content',
                    description: 'This feature is not yet implemented',
                    variant: 'default'
                  });
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Enhance Content
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Content Creator</CardTitle>
          <CardDescription>
            Create comprehensive curriculum content aligned with UK educational standards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="curriculumStandards">Curriculum</TabsTrigger>
              <TabsTrigger value="learningObjectives">Objectives</TabsTrigger>
              <TabsTrigger value="contentVariants">Content</TabsTrigger>
              <TabsTrigger value="relatedContent">Related</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="details">{renderDetailsTab()}</TabsContent>
            <TabsContent value="curriculumStandards">{renderCurriculumStandardsTab()}</TabsContent>
            <TabsContent value="learningObjectives">{renderLearningObjectivesTab()}</TabsContent>
            <TabsContent value="contentVariants">{renderContentVariantsTab()}</TabsContent>
            <TabsContent value="relatedContent">{renderRelatedContentTab()}</TabsContent>
            <TabsContent value="settings">{renderSettingsTab()}</TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Content
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
