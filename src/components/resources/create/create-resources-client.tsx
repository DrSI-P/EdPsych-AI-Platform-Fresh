'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Upload, X, Plus, FileText, Image, FileVideo, FileAudio, File } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

export default function CreateResourcesClient() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin?callbackUrl=/resources/create');
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [resourceType, setResourceType] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    keyStage: '',
    type: '',
    isPublic: true,
    allowDownload: true,
    requireAttribution: true,
    curriculumLinks: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name === 'type') {
      setResourceType(value);
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags([...tags, tagInput.trim().toLowerCase()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
      
      // Generate preview for the first image file
      if (!previewUrl) {
        const imageFile = [...files, ...newFiles].find(file => file.type.startsWith('image/'));
        if (imageFile) {
          const url = URL.createObjectURL(imageFile);
          setPreviewUrl(url);
        }
      }
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    const updatedFiles = files.filter(file => file !== fileToRemove);
    setFiles(updatedFiles);
    
    // Update preview if needed
    if (previewUrl && files.indexOf(fileToRemove) === 0) {
      URL.revokeObjectURL(previewUrl);
      const imageFile = updatedFiles.find(file => file.type.startsWith('image/'));
      if (imageFile) {
        const url = URL.createObjectURL(imageFile);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.subject) errors.subject = 'Subject is required';
    if (!formData.keyStage) errors.keyStage = 'Key Stage is required';
    if (!formData.type) errors.type = 'Resource type is required';
    if (files.length === 0) errors.files = 'At least one file is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Show error message and switch to the tab with errors
      if (formErrors.files) {
        setActiveTab('files');
      } else {
        setActiveTab('details');
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would be a FormData submission with files
      // const formDataToSubmit = new FormData();
      // formDataToSubmit.append('title', formData.title);
      // formDataToSubmit.append('description', formData.description);
      // ... other form fields
      // files.forEach(file => formDataToSubmit.append('files', file));
      
      // const response = await fetch('/api/resources', {
      //   method: 'POST',
      //   body: formDataToSubmit,
      // });
      
      // if (!response.ok) throw new Error('Failed to create resource');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to the resource library
      router.push('/resources');
    } catch (error) {
      console.error('Error creating resource:', error);
      setFormErrors((prev) => ({ ...prev, submit: 'Failed to create resource. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (file.type.startsWith('video/')) return <FileVideo className="h-5 w-5" />;
    if (file.type.startsWith('audio/')) return <FileAudio className="h-5 w-5" />;
    if (file.type.includes('pdf')) return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Create Resource</h1>
        <p className="text-muted-foreground mt-2">
          Share your educational resources with the EdPsych community
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="details">Resource Details</TabsTrigger>
                <TabsTrigger value="files">Files & Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-6 space-y-6">
                {formErrors.submit && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{formErrors.submit}</AlertDescription>
                  </Alert>
                )}
                
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Provide details about your educational resource
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter a descriptive title"
                        className={formErrors.title ? 'border-destructive' : ''}
                      />
                      {formErrors.title && (
                        <p className="text-sm text-destructive">{formErrors.title}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your resource and how it can be used"
                        className={`min-h-[120px] ${formErrors.description ? 'border-destructive' : ''}`}
                      />
                      {formErrors.description && (
                        <p className="text-sm text-destructive">{formErrors.description}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) => handleSelectChange('subject', value)}
                        >
                          <SelectTrigger id="subject" className={formErrors.subject ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="Science">Science</SelectItem>
                            <SelectItem value="History">History</SelectItem>
                            <SelectItem value="Geography">Geography</SelectItem>
                            <SelectItem value="Art">Art</SelectItem>
                            <SelectItem value="Music">Music</SelectItem>
                            <SelectItem value="Physical Education">Physical Education</SelectItem>
                            <SelectItem value="Computing">Computing</SelectItem>
                            <SelectItem value="Design and Technology">Design and Technology</SelectItem>
                            <SelectItem value="Languages">Languages</SelectItem>
                            <SelectItem value="Religious Education">Religious Education</SelectItem>
                            <SelectItem value="PSHE">PSHE</SelectItem>
                            <SelectItem value="Cross-curricular">Cross-curricular</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.subject && (
                          <p className="text-sm text-destructive">{formErrors.subject}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="keyStage">Key Stage</Label>
                        <Select
                          value={formData.keyStage}
                          onValueChange={(value) => handleSelectChange('keyStage', value)}
                        >
                          <SelectTrigger id="keyStage" className={formErrors.keyStage ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select key stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EYFS">Early Years (EYFS)</SelectItem>
                            <SelectItem value="KS1">Key Stage 1</SelectItem>
                            <SelectItem value="KS2">Key Stage 2</SelectItem>
                            <SelectItem value="KS3">Key Stage 3</SelectItem>
                            <SelectItem value="KS4">Key Stage 4</SelectItem>
                            <SelectItem value="KS5">Key Stage 5</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.keyStage && (
                          <p className="text-sm text-destructive">{formErrors.keyStage}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Resource Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => handleSelectChange('type', value)}
                      >
                        <SelectTrigger id="type" className={formErrors.type ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Select resource type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Worksheet">Worksheet</SelectItem>
                          <SelectItem value="Guide">Guide</SelectItem>
                          <SelectItem value="Activity">Activity</SelectItem>
                          <SelectItem value="Presentation">Presentation</SelectItem>
                          <SelectItem value="Assessment">Assessment</SelectItem>
                          <SelectItem value="Interactive">Interactive</SelectItem>
                          <SelectItem value="Video">Video</SelectItem>
                          <SelectItem value="Audio">Audio</SelectItem>
                          <SelectItem value="Lesson Plan">Lesson Plan</SelectItem>
                          <SelectItem value="Scheme of Work">Scheme of Work</SelectItem>
                          <SelectItem value="Display">Display</SelectItem>
                          <SelectItem value="Game">Game</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.type && (
                        <p className="text-sm text-destructive">{formErrors.type}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-centre gap-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Add tags (press Enter to add)"
                      />
                      <p className="text-xs text-muted-foreground">
                        Add relevant keywords to help others find your resource
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Sharing Settings</CardTitle>
                    <CardDescription>
                      Control how your resource is shared with others
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-centre justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="isPublic">Public Resource</Label>
                        <p className="text-sm text-muted-foreground">
                          Make this resource visible to all users
                        </p>
                      </div>
                      <Switch
                        id="isPublic"
                        checked={formData.isPublic}
                        onCheckedChange={(checked) => handleSwitchChange('isPublic', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-centre justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allowDownload">Allow Downloads</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow users to download this resource
                        </p>
                      </div>
                      <Switch
                        id="allowDownload"
                        checked={formData.allowDownload}
                        onCheckedChange={(checked) => handleSwitchChange('allowDownload', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-centre justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="requireAttribution">Require Attribution</Label>
                        <p className="text-sm text-muted-foreground">
                          Users must credit you when using this resource
                        </p>
                      </div>
                      <Switch
                        id="requireAttribution"
                        checked={formData.requireAttribution}
                        onCheckedChange={(checked) => handleSwitchChange('requireAttribution', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="files" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Files</CardTitle>
                    <CardDescription>
                      Upload the files for your resource
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="border-2 border-dashed rounded-lg p-6 text-centre">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-sm font-medium">
                          Drag and drop files here or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Supported formats: PDF, DOCX, PPTX, JPG, PNG, MP4, MP3, and more
                        </p>
                        <Input
                          id="file-upload"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Select Files
                        </Button>
                      </div>
                      
                      {formErrors.files && (
                        <p className="text-sm text-destructive">{formErrors.files}</p>
                      )}
                      
                      {files.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Uploaded Files</h4>
                          <div className="space-y-2">
                            {files.map((file, index) => (
                              <div
                                key={`${file.name}-${index}`}
                                className="flex items-centre justify-between p-3 bg-muted rounded-md"
                              >
                                <div className="flex items-centre space-x-3">
                                  {getFileIcon(file)}
                                  <div>
                                    <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-[300px]">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveFile(file)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Resource Preview</CardTitle>
                    <CardDescription>
                      This is how your resource will appear in the library
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-48 bg-muted flex items-centre justify-centre">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Resource preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <p className="text-muted-foreground">
                            Upload an image for preview
                          </p>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">
                          {formData.title || 'Resource Title'}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formData.subject || 'Subject'} • {formData.type || 'Type'} • {formData.keyStage || 'Key Stage'}
                        </p>
                        <p className="text-sm mt-2 line-clamp-2">
                          {formData.description || 'Resource description will appear here...'}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {tags.length === 0 && (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              example-tag
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resource Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Title</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.title || 'Not specified'}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Type</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.type || 'Not specified'}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Subject</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.subject || 'Not specified'}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Key Stage</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.keyStage || 'Not specified'}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Files</p>
                    <p className="text-sm text-muted-foreground">
                      {files.length} file{files.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Visibility</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.isPublic ? 'Public' : 'Private'}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Resource'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/resources')}
                  >
                    Cancel
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Resources should be aligned with UK curriculum standards and use UK English spelling.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
                    <li>Include clear instructions for use</li>
                    <li>Provide all necessary files</li>
                    <li>Use descriptive titles and tags</li>
                    <li>Ensure content is age-appropriate</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}