'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Check, 
  ChevronDown, 
  Clock, 
  Edit, 
  Eye, 
  FileText, 
  Image, 
  Link, 
  List, 
  ListChecks, 
  Loader2, 
  MessageSquare, 
  MoreHorizontal, 
  Plus, 
  Save, 
  Search, 
  Settings, 
  Share2, 
  Sparkles, 
  Tag, 
  Trash, 
  Upload, 
  X, 
  Zap
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";

// Mock data for categories, tags, etc.
const categories = [
  "Inclusive Education",
  "Assessment",
  "Social-Emotional Learning",
  "Cognitive Development",
  "Behaviour Management",
  "Learning Strategies",
  "Neurodiversity",
  "Educational Technology",
  "Professional Development"
];

const tags = [
  "AI",
  "Inclusion",
  "Differentiation",
  "Growth Mindset",
  "Metacognition",
  "Feedback",
  "SEND",
  "Wellbeing",
  "Assessment",
  "Digital Literacy",
  "Executive Function",
  "Working Memory",
  "Self-Regulation",
  "Emotional Literacy",
  "Restorative Practise"
];

const curriculumAreas = [
  "SEND",
  "PSHE",
  "English",
  "Mathematics",
  "Science",
  "Digital Literacy",
  "Cross-Curricular",
  "Inclusive Practise",
  "Assessment",
  "Pedagogy"
];

const ageRanges = [
  "EYFS",
  "KS1",
  "KS2",
  "KS3",
  "KS4",
  "Post-16",
  "All Phases"
];

const BlogPostEditor = () => {
  const [activeTab, setActiveTab] = useState("content");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCurriculumAreas, setSelectedCurriculumAreas] = useState<string[]>([]);
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<string[]>([]);
  
  // Form state
  const [postData, setPostData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    featuredImage: null,
    publishDate: new Date().toISOString().split('T')[0],
    isDraft: true,
    allowComments: true,
    isPrivate: false,
    isFeatured: false
  });

  const handleInputChange = (field: string, value: string) => {
    setPostData({
      ...postData,
      [field]: value
    });
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCurriculumToggle = (area: string) => {
    if (selectedCurriculumAreas.includes(area)) {
      setSelectedCurriculumAreas(selectedCurriculumAreas.filter(a => a !== area));
    } else {
      setSelectedCurriculumAreas([...selectedCurriculumAreas, area]);
    }
  };

  const handleAgeRangeToggle = (range: string) => {
    if (selectedAgeRanges.includes(range)) {
      setSelectedAgeRanges(selectedAgeRanges.filter(r => r !== range));
    } else {
      setSelectedAgeRanges([...selectedAgeRanges, range]);
    }
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Draft saved",
        description: "Your blog post draft has been saved successfully.",
      });
    }, 1500);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    // Simulate API call
    setTimeout(() => {
      setIsPublishing(false);
      toast({
        title: "Post published",
        description: "Your blog post has been published successfully.",
      });
    }, 2000);
  };

  const handleAIGenerate = () => {
    setIsGeneratingWithAI(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGeneratingWithAI(false);
      setShowAIDialog(false);
      
      // Example AI-generated content based on the prompt
      if (aiPrompt.toLowerCase().includes("title")) {
        setPostData({
          ...postData,
          title: "AI-Enhanced Approaches to Supporting Executive Function in the Classroom"
        });
      } else if (aiPrompt.toLowerCase().includes("excerpt")) {
        setPostData({
          ...postData,
          excerpt: "Discover evidence-based strategies for supporting executive function development in students, enhanced by artificial intelligence tools that can provide personalized scaffolding and real-time feedback."
        });
      } else if (aiPrompt.toLowerCase().includes("content")) {
        setPostData({
          ...postData,
          content: postData.content + "\n\n## AI-Enhanced Executive Function Support\n\nExecutive function skills are critical for academic success and lifelong learning. These cognitive processes include working memory, cognitive flexibility, and inhibitory control. Recent research has demonstrated that targeted interventions, particularly when enhanced with AI-driven personalization, can significantly improve these skills in students of all ages.\n\n### Evidence-Based Approaches\n\nMultiple studies have shown that explicit instruction in executive function strategies, combined with regular practise and feedback, leads to measurable improvements in student performance across subject areas. For example, a 2023 study by Thompson et al. found that students who received structured executive function training showed a 27% improvement in task completion and a 32% reduction in off-task behaviour."
        });
      } else if (aiPrompt.toLowerCase().includes("tags")) {
        setSelectedTags(["Executive Function", "Working Memory", "AI", "Cognitive Development", "Self-Regulation"]);
      }
      
      toast({
        title: "AI content generated",
        description: "The AI has generated content based on your prompt.",
      });
    }, 3000);
  };

  const renderContentTab = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Post Title</Label>
        <Input 
          id="title" 
          placeholder="Enter a compelling title..." 
          value={postData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea 
          id="excerpt" 
          placeholder="Write a brief summary of your post..." 
          rows={3}
          value={postData.excerpt}
          onChange={(e) => handleInputChange("excerpt", e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="content">Content</Label>
          <div className="flex items-centre space-x-2">
            <Button variant="outline" size="sm">
              <Image className="h-4 w-4 mr-2" />
              Add Image
            </Button>
            <Button variant="outline" size="sm">
              <Link className="h-4 w-4 mr-2" />
              Add Link
            </Button>
            <Button variant="outline" size="sm">
              <List className="h-4 w-4 mr-2" />
              Add List
            </Button>
          </div>
        </div>
        <Textarea 
          id="content" 
          placeholder="Write your blog post content here... You can use Markdown formatting." 
          rows={15}
          value={postData.content}
          onChange={(e) => handleInputChange("content", e.target.value)}
          className="font-mono"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Assist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>AI Content Assistant</DialogTitle>
              <DialogDescription>
                Describe what you'd like the AI to help you with. Be specific about the type of content, tone, and educational focus.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea 
                placeholder="e.g., Generate an introduction about executive function development in primary school children, focusing on evidence-based strategies..." 
                rows={5}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Suggested Prompts:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer"
                    onClick={() => setAiPrompt("Generate a title for a blog post about executive function support strategies")}
                  >
                    Generate title
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer"
                    onClick={() => setAiPrompt("Write an excerpt for a blog post about AI-enhanced learning strategies")}
                  >
                    Write excerpt
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer"
                    onClick={() => setAiPrompt("Suggest relevant tags for a post about executive function and working memory")}
                  >
                    Suggest tags
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer"
                    onClick={() => setAiPrompt("Draft a section about evidence-based approaches to supporting executive function")}
                  >
                    Draft content section
                  </Badge>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAIDialog(false)}>Cancel</Button>
              <Button onClick={handleAIGenerate} disabled={isGeneratingWithAI}>
                {isGeneratingWithAI ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderMetadataTab = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select 
          value={postData.category} 
          onValueChange={(value) => handleInputChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="border rounded-md p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTags.map((tag) => (
              <Badge key={tag} className="flex items-center gap-1">
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleTagToggle(tag)}
                />
              </Badge>
            ))}
            {selectedTags.length === 0 && (
              <div className="text-sm text-muted-foreground">No tags selected</div>
            )}
          </div>
          <Separator className="my-2" />
          <div className="mt-2">
            <Label className="text-sm">Available Tags</Label>
            <ScrollArea className="h-[200px] mt-2">
              <div className="space-y-2">
                {tags.filter(tag => !selectedTags.includes(tag)).map((tag) => (
                  <div 
                    key={tag} 
                    className="flex items-center space-x-2"
                  >
                    <Checkbox 
                      id={`tag-${tag}`} 
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => handleTagToggle(tag)}
                    />
                    <Label 
                      htmlFor={`tag-${tag}`}
                      className="text-sm cursor-pointer"
                    >
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Curriculum Areas</Label>
          <div className="border rounded-md p-4">
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {curriculumAreas.map((area) => (
                  <div 
                    key={area} 
                    className="flex items-center space-x-2"
                  >
                    <Checkbox 
                      id={`curriculum-${area}`} 
                      checked={selectedCurriculumAreas.includes(area)}
                      onCheckedChange={() => handleCurriculumToggle(area)}
                    />
                    <Label 
                      htmlFor={`curriculum-${area}`}
                      className="text-sm cursor-pointer"
                    >
                      {area}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Age Ranges</Label>
          <div className="border rounded-md p-4">
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {ageRanges.map((range) => (
                  <div 
                    key={range} 
                    className="flex items-center space-x-2"
                  >
                    <Checkbox 
                      id={`age-${range}`} 
                      checked={selectedAgeRanges.includes(range)}
                      onCheckedChange={() => handleAgeRangeToggle(range)}
                    />
                    <Label 
                      htmlFor={`age-${range}`}
                      className="text-sm cursor-pointer"
                    >
                      {range}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="featuredImage">Featured Image</Label>
        <div className="border border-dashed rounded-md p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              Drag and drop an image here, or click to browse
            </div>
            <Button variant="outline" size="sm">
              Upload Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="publishDate">Publish Date</Label>
        <Input 
          id="publishDate" 
          type="date" 
          value={postData.publishDate}
          onChange={(e) => handleInputChange("publishDate", e.target.value)}
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="isDraft" className="text-base">Save as Draft</Label>
            <p className="text-sm text-muted-foreground">
              Save this post as a draft to continue editing later.
            </p>
          </div>
          <Switch 
            id="isDraft" 
            checked={postData.isDraft}
            onCheckedChange={(checked) => handleInputChange("isDraft", checked.toString())}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="allowComments" className="text-base">Allow Comments</Label>
            <p className="text-sm text-muted-foreground">
              Allow readers to comment on this post.
            </p>
          </div>
          <Switch 
            id="allowComments" 
            checked={postData.allowComments}
            onCheckedChange={(checked) => handleInputChange("allowComments", checked.toString())}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="isPrivate" className="text-base">Private Post</Label>
            <p className="text-sm text-muted-foreground">
              Make this post visible only to logged-in users.
            </p>
          </div>
          <Switch 
            id="isPrivate" 
            checked={postData.isPrivate}
            onCheckedChange={(checked) => handleInputChange("isPrivate", checked.toString())}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="isFeatured" className="text-base">Feature Post</Label>
            <p className="text-sm text-muted-foreground">
              Feature this post on the homepage and in featured sections.
            </p>
          </div>
          <Switch 
            id="isFeatured" 
            checked={postData.isFeatured}
            onCheckedChange={(checked) => handleInputChange("isFeatured", checked.toString())}
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <Label className="text-base text-destructive">Danger Zone</Label>
        <p className="text-sm text-muted-foreground">
          Actions here cannot be undone.
        </p>
        <div className="flex space-x-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="h-4 w-4 mr-2" />
                Delete Post
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this blog post and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );

  const renderPreviewTab = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Post Preview</h2>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Open in New Tab
        </Button>
      </div>
      
      <div className="border rounded-lg p-6 space-y-6">
        <div>
          <Badge variant="outline" className="mb-2">
            {postData.category || "Uncategorized"}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">
            {postData.title || "Untitled Post"}
          </h1>
          <div className="flex flex-wrap items-centre gap-x-4 gap-y-2 mt-4">
            <div className="flex items-centre space-x-2">
              <Avatar>
                <AvatarImage src="/avatars/author.jpg" alt="Author" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Dr. Emma Wilson</p>
                <p className="text-xs text-muted-foreground">Educational Psychologist</p>
              </div>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-centre text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(postData.publishDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-centre text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {postData.content ? `${Math.ceil(postData.content.split(' ').length / 200)} min read` : "0 min read"}
            </div>
          </div>
        </div>
        
        {postData.excerpt && (
          <p className="text-lg text-muted-foreground">{postData.excerpt}</p>
        )}
        
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        )}
        
        <div className="prose prose-slate max-w-none">
          {postData.content ? (
            <div dangerouslySetInnerHTML={{ __html: postData.content.replace(/\n/g, '<br />') }} />
          ) : (
            <p className="text-muted-foreground italic">No content yet. Start writing in the Content tab.</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Button>
          <h1 className="text-2xl font-bold">
            {postData.title ? postData.title : "New Blog Post"}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </>
            )}
          </Button>
          <Button onClick={handlePublish} disabled={isPublishing}>
            {isPublishing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4 mr-2" />
                Publish
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="mt-6">
          {renderContentTab()}
        </TabsContent>
        <TabsContent value="metadata" className="mt-6">
          {renderMetadataTab()}
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          {renderSettingsTab()}
        </TabsContent>
        <TabsContent value="preview" className="mt-6">
          {renderPreviewTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogPostEditor;
