import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, BookOpen, Check, ChevronDown, Copy, Edit, Eye, FileText, HelpCircle, Image, Info, Loader2, MessageSquare, MoreHorizontal, Plus, Save, Share2, Trash2, Upload, Users, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MDXEditor } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

import { 
  ContentMetadata, 
  ContentVariant, 
  CurriculumContent,
  ContentType,
  ContentFormat,
  ContentDifficultyLevel,
  ContentStatus,
  UKCurriculumRegion,
  ContentPermission,
  UserContentPermission
} from '@/lib/curriculum-content/types';
import { UKKeyStage, UKSubject, LearningStyle } from '@/lib/learning-path/types';
import { 
  createCurriculumContent, 
  updateCurriculumContent, 
  getCurriculumContent,
  createContentVariant,
  updateContentVariant,
  updateContentStatus,
  checkUserContentPermission,
  getUserContentPermissions
} from '@/lib/curriculum-content/api';

/**
 * Enhanced Curriculum Content Creator Component
 * 
 * Provides a comprehensive interface for educators to create and edit curriculum content
 * with support for multiple learning style variants, collaborative editing, and UK curriculum alignment
 */
export function EnhancedCurriculumContentCreator({
  initialContentId,
  onSave,
  onCancel,
  collaborativeMode = false
}: {
  initialContentId?: string;
  onSave?: (content: CurriculumContent) => void;
  onCancel?: () => void;
  collaborativeMode?: boolean;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialContent, setInitialContent] = useState<CurriculumContent | null>(null);
  const [activeTab, setActiveTab] = useState<string>('metadata');
  const [collaborators, setCollaborators] = useState<UserContentPermission[]>([]);
  const [userPermission, setUserPermission] = useState<ContentPermission>(ContentPermission.EDIT);
  const [saveProgress, setSaveProgress] = useState<number>(0);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [selectedLearningStyle, setSelectedLearningStyle] = useState<LearningStyle>(LearningStyle.VISUAL);
  const [showTemplateDialog, setShowTemplateDialog] = useState<boolean>(false);
  const [showCollaboratorsDialog, setShowCollaboratorsDialog] = useState<boolean>(false);
  const [showVersionHistoryDialog, setShowVersionHistoryDialog] = useState<boolean>(false);
  const [showHelpDialog, setShowHelpDialog] = useState<boolean>(false);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  
  // Form state for metadata
  const [metadata, setMetadata] = useState<Partial<ContentMetadata>>({
    title: '',
    description: '',
    keyStage: UKKeyStage.KS2,
    subject: UKSubject.MATHEMATICS,
    topics: [],
    learningObjectives: [],
    keywords: [],
    difficultyLevel: ContentDifficultyLevel.CORE,
    contentType: ContentType.EXPLANATION,
    contentFormat: ContentFormat.TEXT,
    estimatedDuration: 30,
    status: ContentStatus.DRAFT,
    region: UKCurriculumRegion.ENGLAND
  });
  
  // Form state for variants
  const [variants, setVariants] = useState<Record<LearningStyle, Partial<ContentVariant>>>({
    [LearningStyle.VISUAL]: {
      learningStyle: LearningStyle.VISUAL,
      content: '',
      mediaUrls: []
    },
    [LearningStyle.AUDITORY]: {
      learningStyle: LearningStyle.AUDITORY,
      content: '',
      mediaUrls: []
    },
    [LearningStyle.KINESTHETIC]: {
      learningStyle: LearningStyle.KINESTHETIC,
      content: '',
      mediaUrls: []
    },
    [LearningStyle.READ_WRITE]: {
      learningStyle: LearningStyle.READ_WRITE,
      content: '',
      mediaUrls: []
    }
  });
  
  // Input state for array fields
  const [topicInput, setTopicInput] = useState<string>('');
  const [objectiveInput, setObjectiveInput] = useState<string>('');
  const [keywordInput, setKeywordInput] = useState<string>('');
  const [mediaUrlInput, setMediaUrlInput] = useState<string>('');
  
  // Template options
  const templates = [
    { id: 'math-ks2-template', name: 'Mathematics KS2 Template', description: 'Template for KS2 Mathematics content with all learning style variants' },
    { id: 'english-ks2-template', name: 'English KS2 Template', description: 'Template for KS2 English content with all learning style variants' },
    { id: 'science-ks2-template', name: 'Science KS2 Template', description: 'Template for KS2 Science content with all learning style variants' },
    { id: 'empty-template', name: 'Empty Template', description: 'Start with a blank template for any subject or key stage' }
  ];
  
  // Load initial content if editing
  useEffect(() => {
    if (initialContentId) {
      loadContent(initialContentId);
    }
  }, [initialContentId]);
  
  // Load content by ID
  const loadContent = async (contentId: string) => {
    try {
      setLoading(true);
      const content = await getCurriculumContent(contentId);
      setInitialContent(content);
      
      // Set metadata
      setMetadata(content.metadata);
      
      // Set variants
      const variantMap: Record<LearningStyle, Partial<ContentVariant>> = {
        [LearningStyle.VISUAL]: {
          learningStyle: LearningStyle.VISUAL,
          content: '',
          mediaUrls: []
        },
        [LearningStyle.AUDITORY]: {
          learningStyle: LearningStyle.AUDITORY,
          content: '',
          mediaUrls: []
        },
        [LearningStyle.KINESTHETIC]: {
          learningStyle: LearningStyle.KINESTHETIC,
          content: '',
          mediaUrls: []
        },
        [LearningStyle.READ_WRITE]: {
          learningStyle: LearningStyle.READ_WRITE,
          content: '',
          mediaUrls: []
        }
      };
      
      // Map variants to their learning styles
      content.variants.forEach(variant => {
        variantMap[variant.learningStyle] = variant;
      });
      
      setVariants(variantMap);
      
      // Check user permissions
      if (session?.user?.id) {
        const hasEditPermission = await checkUserContentPermission(
          session.user.id,
          contentId,
          ContentPermission.EDIT
        );
        
        setUserPermission(hasEditPermission ? ContentPermission.EDIT : ContentPermission.VIEW);
      }
      
      // Load collaborators if in collaborative mode
      if (collaborativeMode) {
        loadCollaborators(contentId);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: 'Error loading content',
        description: 'Failed to load the curriculum content. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };
  
  // Load collaborators for a content item
  const loadCollaborators = async (contentId: string) => {
    try {
      if (!session?.user?.id) return;
      
      const permissions = await getUserContentPermissions(session.user.id);
      const contentCollaborators = permissions.filter(p => p.contentId === contentId);
      setCollaborators(contentCollaborators);
    } catch (error) {
      console.error('Error loading collaborators:', error);
    }
  };
  
  // Handle metadata change
  const handleMetadataChange = (key: keyof ContentMetadata, value: any) => {
    setMetadata(prev => ({
      ...prev,
      [key]: value
    }));
    setUnsavedChanges(true);
  };
  
  // Handle variant content change
  const handleVariantContentChange = (style: LearningStyle, content: string) => {
    setVariants(prev => ({
      ...prev,
      [style]: {
        ...prev[style],
        content
      }
    }));
    setUnsavedChanges(true);
  };
  
  // Handle variant media URLs change
  const handleAddMediaUrl = (style: LearningStyle) => {
    if (!mediaUrlInput.trim()) return;
    
    setVariants(prev => ({
      ...prev,
      [style]: {
        ...prev[style],
        mediaUrls: [...(prev[style].mediaUrls || []), mediaUrlInput.trim()]
      }
    }));
    setMediaUrlInput('');
    setUnsavedChanges(true);
  };
  
  // Handle remove media URL
  const handleRemoveMediaUrl = (style: LearningStyle, index: number) => {
    setVariants(prev => ({
      ...prev,
      [style]: {
        ...prev[style],
        mediaUrls: prev[style].mediaUrls?.filter((_, i) => i !== index)
      }
    }));
    setUnsavedChanges(true);
  };
  
  // Add topic
  const handleAddTopic = () => {
    if (!topicInput.trim()) return;
    
    setMetadata(prev => ({
      ...prev,
      topics: [...(prev.topics || []), topicInput.trim()]
    }));
    setTopicInput('');
    setUnsavedChanges(true);
  };
  
  // Remove topic
  const handleRemoveTopic = (index: number) => {
    setMetadata(prev => ({
      ...prev,
      topics: prev.topics?.filter((_, i) => i !== index)
    }));
    setUnsavedChanges(true);
  };
  
  // Add learning objective
  const handleAddObjective = () => {
    if (!objectiveInput.trim()) return;
    
    setMetadata(prev => ({
      ...prev,
      learningObjectives: [...(prev.learningObjectives || []), objectiveInput.trim()]
    }));
    setObjectiveInput('');
    setUnsavedChanges(true);
  };
  
  // Remove learning objective
  const handleRemoveObjective = (index: number) => {
    setMetadata(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives?.filter((_, i) => i !== index)
    }));
    setUnsavedChanges(true);
  };
  
  // Add keyword
  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return;
    
    setMetadata(prev => ({
      ...prev,
      keywords: [...(prev.keywords || []), keywordInput.trim()]
    }));
    setKeywordInput('');
    setUnsavedChanges(true);
  };
  
  // Remove keyword
  const handleRemoveKeyword = (index: number) => {
    setMetadata(prev => ({
      ...prev,
      keywords: prev.keywords?.filter((_, i) => i !== index)
    }));
    setUnsavedChanges(true);
  };
  
  // Apply template
  const handleApplyTemplate = (templateId: string) => {
    // In a real implementation, this would load template content from the server
    // For now, we'll just set some example values based on the template
    
    if (templateId === 'math-ks2-template') {
      setMetadata(prev => ({
        ...prev,
        subject: UKSubject.MATHEMATICS,
        keyStage: UKKeyStage.KS2,
        topics: ['Number', 'Place Value'],
        learningObjectives: [
          'Recognise the place value of each digit in a four-digit number',
          'Identify the value of digits in different positions',
          'Represent numbers using different materials and models'
        ],
        keywords: ['place value', 'thousands', 'hundreds', 'tens', 'ones', 'digits', 'numbers']
      }));
      
      // Set template content for each variant
      setVariants(prev => ({
        ...prev,
        [LearningStyle.VISUAL]: {
          ...prev[LearningStyle.VISUAL],
          content: `# Understanding Place Value in 4-Digit Numbers\n\n## What is place value?\n\nPlace value tells us the value of a digit based on its position in a number.\n\n[Insert place value chart image here]\n\n## Four-digit numbers\n\nIn a four-digit number, we have:\n- **Thousands**: The digit in the thousands place\n- **Hundreds**: The digit in the hundreds place\n- **Tens**: The digit in the tens place\n- **Ones**: The digit in the ones place\n\n## Visual examples\n\n[Insert visual example here]\n\n## Interactive place value chart\n\n[Insert interactive element description here]\n\n## Summary\n\nRemember that in a four-digit number:\n- The first digit represents thousands\n- The second digit represents hundreds\n- The third digit represents tens\n- The fourth digit represents ones`
        },
        [LearningStyle.AUDITORY]: {
          ...prev[LearningStyle.AUDITORY],
          content: `# Understanding Place Value in 4-Digit Numbers\n\n## Introduction\n\n[Insert audio introduction description here]\n\n## Key Listening Points\n\nWhen learning about place value in four-digit numbers, listen for these important terms:\n- Thousands\n- Hundreds\n- Tens\n- Ones\n\n## Verbal Explanation\n\nIn a four-digit number, each position has a specific value:\n\n- The digit on the far left is in the thousands place\n- The next digit to the right is in the hundreds place\n- The next digit is in the tens place\n- The digit on the far right is in the ones place\n\n## Discussion Points\n\nThink about and discuss these questions:\n1. How do we say the number 7,356?\n2. What is the value of the digit 7 in this number?\n3. How does the value of a digit change when it moves position?`
        },
        [LearningStyle.KINESTHETIC]: {
          ...prev[LearningStyle.KINESTHETIC],
          content: `# Understanding Place Value in 4-Digit Numbers\n\n## Hands-on Activities\n\n### Activity 1: Build Your Numbers\n\nYou'll need:\n- Base-10 blocks (or paper cutouts representing thousands, hundreds, tens, and ones)\n- Place value mat (download and print from the link below)\n\n[Insert activity instructions here]\n\n### Activity 2: Place Value Hopscotch\n\n[Insert activity instructions here]\n\n### Activity 3: Trading Game\n\n[Insert activity instructions here]\n\n## Reflection Questions\n\nAfter completing these activities, think about:\n1. How did physically building the numbers help you understand place value?\n2. What happens when you add 1 to 9,999? How would you show this with blocks?\n3. How does trading blocks help you understand regrouping in addition and subtraction?`
        },
        [LearningStyle.READ_WRITE]: {
          ...prev[LearningStyle.READ_WRITE],
          content: `# Understanding Place Value in 4-Digit Numbers\n\n## Introduction\n\nPlace value is a fundamental concept in mathematics that helps us understand the value of digits in a number based on their position. In this lesson, we will focus on four-digit numbers and how to identify the value of each digit.\n\n## Key Concepts\n\nIn a four-digit number, each position represents a specific value:\n\n| Position | Place Value | Example in 3,542 |\n|----------|-------------|------------------|\n| 1st (left) | Thousands | 3 = 3,000 |\n| 2nd | Hundreds | 5 = 500 |\n| 3rd | Tens | 4 = 40 |\n| 4th (right) | Ones | 2 = 2 |\n\n## Detailed Explanation\n\n[Insert detailed explanation here]\n\n## Examples\n\n[Insert examples here]\n\n## Practice Exercises\n\nWrite down the value of each digit in these numbers:\n\n1. 6,248\n2. 1,907\n3. 5,555\n4. 3,020\n\n## Written Assignment\n\n[Insert assignment instructions here]\n\n## Summary\n\nUnderstanding place value in four-digit numbers allows us to:\n- Recognize the actual value of each digit\n- Read and write numbers correctly\n- Compare numbers effectively\n- Perform calculations accurately`
        }
      }));
    } else if (templateId === 'english-ks2-template') {
      setMetadata(prev => ({
        ...prev,
        subject: UKSubject.ENGLISH,
        keyStage: UKKeyStage.KS2,
        topics: ['Reading', 'Comprehension', 'Character Analysis'],
        learningObjectives: [
          'Identify key character traits from text evidence',
          'Analyze how characters change throughout a story',
          'Draw inferences about characters from their actions and dialogue',
          'Compare and contrast different characters within a text'
        ],
        keywords: ['character', 'development', 'inference', 'evidence', 'traits', 'motivation', 'fiction']
      }));
      
      // Set template content for each variant
      // (Similar structure to math template but with English content)
    }
    
    setShowTemplateDialog(false);
    setUnsavedChanges(true);
  };
  
  // Save content
  const handleSave = async (status?: ContentStatus) => {
    try {
      setLoading(true);
      setSaveProgress(25);
      
      // Validate required fields
      if (!metadata.title || !metadata.description || !metadata.keyStage || !metadata.subject) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields in the metadata tab.",
          variant: "destructive"
        });
        setActiveTab('metadata');
        setLoading(false);
        setSaveProgress(0);
        return;
      }
      
      // Check if at least one variant has content
      const hasContent = Object.values(variants).some(v => v.content && v.content.trim().length > 0);
      if (!hasContent) {
        toast({
          title: "Missing content",
          description: "Please add content to at least one learning style variant.",
          variant: "destructive"
        });
        setActiveTab('visual');
        setLoading(false);
        setSaveProgress(0);
        return;
      }
      
      setSaveProgress(50);
      
      // Prepare content object
      const contentToSave: Partial<CurriculumContent> = {
        metadata: {
          ...metadata,
          status: status || metadata.status,
          updatedAt: new Date().toISOString(),
          updatedBy: session?.user?.id || 'unknown'
        } as ContentMetadata,
        variants: Object.values(variants)
          .filter(v => v.content && v.content.trim().length > 0)
          .map(v => ({
            ...v,
            updatedAt: new Date().toISOString(),
            updatedBy: session?.user?.id || 'unknown'
          })) as ContentVariant[],
        defaultVariant: variants[LearningStyle.VISUAL] as ContentVariant
      };
      
      setSaveProgress(75);
      
      // Save content
      let savedContent;
      if (initialContent?.metadata.id) {
        savedContent = await updateCurriculumContent(initialContent.metadata.id, contentToSave);
        
        // Update status if needed
        if (status && status !== initialContent.metadata.status) {
          await updateContentStatus(initialContent.metadata.id, status);
        }
      } else {
        savedContent = await createCurriculumContent(contentToSave);
      }
      
      setSaveProgress(100);
      
      toast({
        title: initialContent ? "Content updated" : "Content created",
        description: `Your curriculum content has been ${initialContent ? 'updated' : 'created'} successfully.`
      });
      
      setUnsavedChanges(false);
      
      if (onSave) {
        onSave(savedContent);
      }
      
      // Reset progress after a delay
      setTimeout(() => {
        setSaveProgress(0);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error saving content",
        description: "An error occurred while saving your content. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
      setSaveProgress(0);
    }
  };
  
  // Handle submit for review
  const handleSubmitForReview = () => {
    handleSave(ContentStatus.REVIEW);
  };
  
  // Handle cancel
  const handleCancel = () => {
    if (unsavedChanges) {
      // Show confirmation dialog
      if (!window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        return;
      }
    }
    
    if (onCancel) {
      onCancel();
    }
  };
  
  // Toggle preview mode
  const handleTogglePreview = () => {
    setPreviewMode(!previewMode);
  };
  
  // Get learning style label
  const getLearningStyleLabel = (style: LearningStyle) => {
    switch (style) {
      case LearningStyle.VISUAL:
        return 'Visual';
      case LearningStyle.AUDITORY:
        return 'Auditory';
      case LearningStyle.KINESTHETIC:
        return 'Kinesthetic';
      case LearningStyle.READ_WRITE:
        return 'Read/Write';
      default:
        return style;
    }
  };
  
  // Get learning style description
  const getLearningStyleDescription = (style: LearningStyle) => {
    switch (style) {
      case LearningStyle.VISUAL:
        return 'Visual learners prefer images, diagrams, charts, and videos. Include visual elements to help these learners understand concepts.';
      case LearningStyle.AUDITORY:
        return 'Auditory learners prefer listening and speaking. Include audio elements, discussions, and verbal explanations.';
      case LearningStyle.KINESTHETIC:
        return 'Kinesthetic learners prefer hands-on activities and physical movement. Include interactive elements and practical exercises.';
      case LearningStyle.READ_WRITE:
        return 'Read/Write learners prefer text-based information. Include detailed explanations, lists, and written exercises.';
      default:
        return '';
    }
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: ContentStatus) => {
    switch (status) {
      case ContentStatus.DRAFT:
        return 'bg-gray-200 text-gray-800';
      case ContentStatus.REVIEW:
        return 'bg-blue-200 text-blue-800';
      case ContentStatus.APPROVED:
        return 'bg-green-200 text-green-800';
      case ContentStatus.PUBLISHED:
        return 'bg-purple-200 text-purple-800';
      case ContentStatus.ARCHIVED:
        return 'bg-yellow-200 text-yellow-800';
      case ContentStatus.REJECTED:
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };
  
  // Render content preview
  const renderContentPreview = () => {
    const variant = variants[selectedLearningStyle];
    
    if (!variant.content) {
      return (
        <div className="flex flex-col items-center justify-center h-96 border border-dashed border-gray-300 rounded-md p-6 text-gray-500">
          <BookOpen className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">No content available for this learning style</p>
          <p className="text-sm">Switch to edit mode to add content</p>
        </div>
      );
    }
    
    return (
      <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: variant.content }} />
        
        {variant.mediaUrls && variant.mediaUrls.length > 0 && (
          <div className="mt-6">
            <h3>Media Resources</h3>
            <ul>
              {variant.mediaUrls.map((url, index) => (
                <li key={index}>
                  <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {variant.interactiveElements && Object.keys(variant.interactiveElements).length > 0 && (
          <div className="mt-6">
            <h3>Interactive Elements</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <pre className="text-sm overflow-auto">{JSON.stringify(variant.interactiveElements, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render content editor
  const renderContentEditor = () => {
    const variant = variants[selectedLearningStyle];
    
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Learning Style: {getLearningStyleLabel(selectedLearningStyle)}</h3>
          <p className="text-sm text-gray-600">{getLearningStyleDescription(selectedLearningStyle)}</p>
        </div>
        
        <div className="border rounded-md">
          <MDXEditor
            markdown={variant.content || ''}
            onChange={(content) => handleVariantContentChange(selectedLearningStyle, content)}
            className="min-h-[400px]"
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="mediaUrls">Media URLs</Label>
            <div className="flex mt-1.5">
              <Input
                id="mediaUrls"
                value={mediaUrlInput}
                onChange={(e) => setMediaUrlInput(e.target.value)}
                placeholder="Enter media URL (images, videos, audio, etc.)"
                className="flex-1 mr-2"
              />
              <Button onClick={() => handleAddMediaUrl(selectedLearningStyle)}>Add</Button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Add URLs for images, videos, audio files, or other media resources.
            </p>
          </div>
          
          {variant.mediaUrls && variant.mediaUrls.length > 0 && (
            <div className="space-y-2">
              <Label>Added Media</Label>
              <ul className="space-y-2">
                {variant.mediaUrls.map((url, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <span className="text-sm truncate flex-1">{url}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMediaUrl(selectedLearningStyle, index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {initialContent ? 'Edit Curriculum Content' : 'Create Curriculum Content'}
          </h1>
          <p className="text-muted-foreground">
            {initialContent 
              ? 'Update existing curriculum content and learning style variants' 
              : 'Create new curriculum content with variants for different learning styles'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          {saveProgress > 0 && (
            <div className="w-32 mr-2">
              <Progress value={saveProgress} className="h-2" />
            </div>
          )}
          
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Save <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSave()}>
                Save as Draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSubmitForReview}>
                Submit for Review
              </DropdownMenuItem>
              {userPermission === ContentPermission.APPROVE && (
                <DropdownMenuItem onClick={() => handleSave(ContentStatus.APPROVED)}>
                  Approve and Publish
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={handleTogglePreview} disabled={loading}>
            {previewMode ? <Edit className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowTemplateDialog(true)}>
                Apply Template
              </DropdownMenuItem>
              {collaborativeMode && (
                <DropdownMenuItem onClick={() => setShowCollaboratorsDialog(true)}>
                  Manage Collaborators
                </DropdownMenuItem>
              )}
              {initialContent && (
                <DropdownMenuItem onClick={() => setShowVersionHistoryDialog(true)}>
                  Version History
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setShowHelpDialog(true)}>
                Help & Guidelines
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Content Status */}
      {initialContent && (
        <div className="mb-6">
          <Badge className={getStatusBadgeColor(metadata.status as ContentStatus)}>
            {metadata.status}
          </Badge>
          {metadata.updatedAt && (
            <span className="text-sm text-gray-500 ml-2">
              Last updated: {new Date(metadata.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      )}
      
      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Tabs */}
        {!previewMode ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="visual">Visual</TabsTrigger>
              <TabsTrigger value="auditory">Auditory</TabsTrigger>
              <TabsTrigger value="kinesthetic">Kinesthetic</TabsTrigger>
              <TabsTrigger value="read-write">Read/Write</TabsTrigger>
            </TabsList>
            
            <TabsContent value="metadata">
              <Card>
                <CardHeader>
                  <CardTitle>Content Metadata</CardTitle>
                  <CardDescription>
                    Basic information about your curriculum content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                    <Input
                      id="title"
                      value={metadata.title || ''}
                      onChange={(e) => handleMetadataChange('title', e.target.value)}
                      placeholder="Enter a descriptive title"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="description"
                      value={metadata.description || ''}
                      onChange={(e) => handleMetadataChange('description', e.target.value)}
                      placeholder="Provide a detailed description"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="keyStage">Key Stage <span className="text-red-500">*</span></Label>
                      <Select 
                        value={metadata.keyStage} 
                        onValueChange={(value) => handleMetadataChange('keyStage', value)}
                      >
                        <SelectTrigger id="keyStage">
                          <SelectValue placeholder="Select key stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={UKKeyStage.EYFS}>Early Years (EYFS)</SelectItem>
                          <SelectItem value={UKKeyStage.KS1}>Key Stage 1</SelectItem>
                          <SelectItem value={UKKeyStage.KS2}>Key Stage 2</SelectItem>
                          <SelectItem value={UKKeyStage.KS3}>Key Stage 3</SelectItem>
                          <SelectItem value={UKKeyStage.KS4}>Key Stage 4</SelectItem>
                          <SelectItem value={UKKeyStage.KS5}>Key Stage 5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
                      <Select 
                        value={metadata.subject} 
                        onValueChange={(value) => handleMetadataChange('subject', value)}
                      >
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={UKSubject.ENGLISH}>English</SelectItem>
                          <SelectItem value={UKSubject.MATHEMATICS}>Mathematics</SelectItem>
                          <SelectItem value={UKSubject.SCIENCE}>Science</SelectItem>
                          <SelectItem value={UKSubject.HISTORY}>History</SelectItem>
                          <SelectItem value={UKSubject.GEOGRAPHY}>Geography</SelectItem>
                          <SelectItem value={UKSubject.ART_AND_DESIGN}>Art and Design</SelectItem>
                          <SelectItem value={UKSubject.COMPUTING}>Computing</SelectItem>
                          <SelectItem value={UKSubject.DESIGN_AND_TECHNOLOGY}>Design and Technology</SelectItem>
                          <SelectItem value={UKSubject.LANGUAGES}>Languages</SelectItem>
                          <SelectItem value={UKSubject.MUSIC}>Music</SelectItem>
                          <SelectItem value={UKSubject.PHYSICAL_EDUCATION}>Physical Education</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contentType">Content Type</Label>
                      <Select 
                        value={metadata.contentType} 
                        onValueChange={(value) => handleMetadataChange('contentType', value)}
                      >
                        <SelectTrigger id="contentType">
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ContentType.EXPLANATION}>Explanation</SelectItem>
                          <SelectItem value={ContentType.EXERCISE}>Exercise</SelectItem>
                          <SelectItem value={ContentType.ASSESSMENT}>Assessment</SelectItem>
                          <SelectItem value={ContentType.EXAMPLE}>Example</SelectItem>
                          <SelectItem value={ContentType.RESOURCE}>Resource</SelectItem>
                          <SelectItem value={ContentType.PROJECT}>Project</SelectItem>
                          <SelectItem value={ContentType.DISCUSSION}>Discussion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contentFormat">Content Format</Label>
                      <Select 
                        value={metadata.contentFormat} 
                        onValueChange={(value) => handleMetadataChange('contentFormat', value)}
                      >
                        <SelectTrigger id="contentFormat">
                          <SelectValue placeholder="Select content format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ContentFormat.TEXT}>Text</SelectItem>
                          <SelectItem value={ContentFormat.IMAGE}>Image</SelectItem>
                          <SelectItem value={ContentFormat.VIDEO}>Video</SelectItem>
                          <SelectItem value={ContentFormat.AUDIO}>Audio</SelectItem>
                          <SelectItem value={ContentFormat.INTERACTIVE}>Interactive</SelectItem>
                          <SelectItem value={ContentFormat.DOCUMENT}>Document</SelectItem>
                          <SelectItem value={ContentFormat.PRESENTATION}>Presentation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                      <Select 
                        value={metadata.difficultyLevel} 
                        onValueChange={(value) => handleMetadataChange('difficultyLevel', value)}
                      >
                        <SelectTrigger id="difficultyLevel">
                          <SelectValue placeholder="Select difficulty level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ContentDifficultyLevel.FOUNDATION}>Foundation</SelectItem>
                          <SelectItem value={ContentDifficultyLevel.CORE}>Core</SelectItem>
                          <SelectItem value={ContentDifficultyLevel.EXTENDED}>Extended</SelectItem>
                          <SelectItem value={ContentDifficultyLevel.ADVANCED}>Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="region">Curriculum Region</Label>
                      <Select 
                        value={metadata.region} 
                        onValueChange={(value) => handleMetadataChange('region', value)}
                      >
                        <SelectTrigger id="region">
                          <SelectValue placeholder="Select curriculum region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={UKCurriculumRegion.ENGLAND}>England</SelectItem>
                          <SelectItem value={UKCurriculumRegion.WALES}>Wales</SelectItem>
                          <SelectItem value={UKCurriculumRegion.SCOTLAND}>Scotland</SelectItem>
                          <SelectItem value={UKCurriculumRegion.NORTHERN_IRELAND}>Northern Ireland</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="estimatedDuration">Estimated Duration (minutes)</Label>
                    <Input
                      id="estimatedDuration"
                      type="number"
                      value={metadata.estimatedDuration || 30}
                      onChange={(e) => handleMetadataChange('estimatedDuration', parseInt(e.target.value))}
                      min={1}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="topics">Topics</Label>
                    <div className="flex mt-1.5">
                      <Input
                        id="topics"
                        value={topicInput}
                        onChange={(e) => setTopicInput(e.target.value)}
                        placeholder="Add a topic"
                        className="flex-1 mr-2"
                      />
                      <Button onClick={handleAddTopic}>Add</Button>
                    </div>
                    
                    {metadata.topics && metadata.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {metadata.topics.map((topic, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {topic}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => handleRemoveTopic(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="learningObjectives">Learning Objectives</Label>
                    <div className="flex mt-1.5">
                      <Input
                        id="learningObjectives"
                        value={objectiveInput}
                        onChange={(e) => setObjectiveInput(e.target.value)}
                        placeholder="Add a learning objective"
                        className="flex-1 mr-2"
                      />
                      <Button onClick={handleAddObjective}>Add</Button>
                    </div>
                    
                    {metadata.learningObjectives && metadata.learningObjectives.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {metadata.learningObjectives.map((objective, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                            <span className="text-sm">{objective}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveObjective(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <div className="flex mt-1.5">
                      <Input
                        id="keywords"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        placeholder="Add a keyword"
                        className="flex-1 mr-2"
                      />
                      <Button onClick={handleAddKeyword}>Add</Button>
                    </div>
                    
                    {metadata.keywords && metadata.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {metadata.keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            {keyword}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => handleRemoveKeyword(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="visual">
              <Card>
                <CardHeader>
                  <CardTitle>Visual Learning Style Content</CardTitle>
                  <CardDescription>
                    Create content optimized for visual learners who prefer images, diagrams, and visual representations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderContentEditor()}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="auditory">
              <Card>
                <CardHeader>
                  <CardTitle>Auditory Learning Style Content</CardTitle>
                  <CardDescription>
                    Create content optimized for auditory learners who prefer listening and speaking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderContentEditor()}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="kinesthetic">
              <Card>
                <CardHeader>
                  <CardTitle>Kinesthetic Learning Style Content</CardTitle>
                  <CardDescription>
                    Create content optimized for kinesthetic learners who prefer hands-on activities and physical movement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderContentEditor()}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="read-write">
              <Card>
                <CardHeader>
                  <CardTitle>Read/Write Learning Style Content</CardTitle>
                  <CardDescription>
                    Create content optimized for read/write learners who prefer text-based information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderContentEditor()}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{metadata.title || 'Untitled Content'}</CardTitle>
                  <CardDescription>{metadata.description || 'No description provided'}</CardDescription>
                </div>
                <Select 
                  value={selectedLearningStyle} 
                  onValueChange={(value) => setSelectedLearningStyle(value as LearningStyle)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select learning style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={LearningStyle.VISUAL}>Visual</SelectItem>
                    <SelectItem value={LearningStyle.AUDITORY}>Auditory</SelectItem>
                    <SelectItem value={LearningStyle.KINESTHETIC}>Kinesthetic</SelectItem>
                    <SelectItem value={LearningStyle.READ_WRITE}>Read/Write</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline">{metadata.keyStage}</Badge>
                <Badge variant="outline">{metadata.subject}</Badge>
                <Badge variant="outline">{metadata.contentType}</Badge>
                <Badge variant="outline">{metadata.difficultyLevel}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {renderContentPreview()}
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Template Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Apply Template</DialogTitle>
            <DialogDescription>
              Choose a template to quickly create curriculum content with predefined structure and examples.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex items-start space-x-4 p-4 border rounded-md cursor-pointer hover:bg-gray-50"
                onClick={() => handleApplyTemplate(template.id)}
              >
                <div>
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-gray-500">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Collaborators Dialog */}
      <Dialog open={showCollaboratorsDialog} onOpenChange={setShowCollaboratorsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Collaborators</DialogTitle>
            <DialogDescription>
              Add or remove collaborators for this curriculum content.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            {/* Collaborator list would go here */}
            <p className="text-center text-gray-500">Collaborator management functionality would be implemented here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCollaboratorsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Version History Dialog */}
      <Dialog open={showVersionHistoryDialog} onOpenChange={setShowVersionHistoryDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
            <DialogDescription>
              View and restore previous versions of this curriculum content.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            {/* Version history list would go here */}
            <p className="text-center text-gray-500">Version history functionality would be implemented here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVersionHistoryDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Help Dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Content Creation Guidelines</DialogTitle>
            <DialogDescription>
              Best practices for creating effective curriculum content.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6 my-4">
              <div>
                <h3 className="text-lg font-medium">General Guidelines</h3>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Ensure content aligns with UK curriculum standards for the selected key stage and subject</li>
                  <li>Use clear, concise language appropriate for the target age group</li>
                  <li>Include specific learning objectives that can be measured</li>
                  <li>Provide a mix of explanations, examples, and activities</li>
                  <li>Consider accessibility needs and provide alternative formats where possible</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Learning Style Guidelines</h3>
                
                <h4 className="font-medium mt-4">Visual Learners</h4>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Include diagrams, charts, images, and videos</li>
                  <li>Use color coding to highlight important information</li>
                  <li>Create visual hierarchies with headings and subheadings</li>
                  <li>Use mind maps and concept maps to show relationships</li>
                  <li>Include visual timelines for sequential information</li>
                </ul>
                
                <h4 className="font-medium mt-4">Auditory Learners</h4>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Include audio explanations and recordings</li>
                  <li>Provide discussion questions and verbal activities</li>
                  <li>Use rhythm, rhyme, and mnemonics</li>
                  <li>Include dialogue and verbal examples</li>
                  <li>Suggest group discussions and verbal presentations</li>
                </ul>
                
                <h4 className="font-medium mt-4">Kinesthetic Learners</h4>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Include hands-on activities and experiments</li>
                  <li>Provide step-by-step instructions for physical tasks</li>
                  <li>Suggest role-playing and movement-based learning</li>
                  <li>Include interactive elements and manipulatives</li>
                  <li>Design activities that involve building or creating</li>
                </ul>
                
                <h4 className="font-medium mt-4">Read/Write Learners</h4>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Provide detailed written explanations</li>
                  <li>Include lists, definitions, and glossaries</li>
                  <li>Use quotes and references from authoritative sources</li>
                  <li>Include written exercises and essay questions</li>
                  <li>Provide opportunities for note-taking and summarizing</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Technical Tips</h3>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Use Markdown formatting for headings, lists, and emphasis</li>
                  <li>Include proper citations for any external resources</li>
                  <li>Ensure media URLs are accessible and permanent</li>
                  <li>Test interactive elements before publishing</li>
                  <li>Save your work regularly to avoid losing changes</li>
                </ul>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setShowHelpDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
