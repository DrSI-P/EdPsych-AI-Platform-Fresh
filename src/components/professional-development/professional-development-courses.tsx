'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Progress 
} from "@/components/ui/progress";
import { 
  Badge 
} from "@/components/ui/badge";
import { 
  Button 
} from "@/components/ui/button";
import { 
  Input 
} from "@/components/ui/input";
import { 
  Label 
} from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Checkbox 
} from "@/components/ui/checkbox";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  BarChart, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Download, 
  FileText, 
  Filter, 
  Layers, 
  MessageSquare, 
  Search, 
  Share2, 
  Star, 
  Users, 
  Video 
} from "lucide-react";
import { Certificate } from "@/components/icons";

// Course difficulty levels with UK spelling
const DIFFICULTY_LEVELS = [
  { id: 'beginner', label: 'Beginner', color: 'bg-green-500' },
  { id: 'intermediate', label: 'Intermediate', color: 'bg-blue-500' },
  { id: 'advanced', label: 'Advanced', color: 'bg-purple-500' },
  { id: 'specialist', label: 'Specialist', color: 'bg-amber-500' }
];

// Course categories aligned with UK educational standards
const COURSE_CATEGORIES = [
  { id: 'sen', label: 'Special Educational Needs' },
  { id: 'restorative', label: 'Restorative Approaches' },
  { id: 'assessment', label: 'Educational Assessment' },
  { id: 'pedagogy', label: 'Pedagogical Practise' },
  { id: 'wellbeing', label: 'Wellbeing & Mental Health' },
  { id: 'inclusion', label: 'Inclusive Education' },
  { id: 'leadership', label: 'Educational Leadership' },
  { id: 'technology', label: 'Educational Technology' },
  { id: 'safeguarding', label: 'Safeguarding' },
  { id: 'curriculum', label: 'Curriculum Development' }
];

// Content types with UK spelling
const CONTENT_TYPES = [
  { id: 'video', label: 'Video Lesson', icon: <Video className="h-4 w-4" /> },
  { id: 'reading', label: 'Reading Material', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'activity', label: 'Interactive Activity', icon: <Layers className="h-4 w-4" /> },
  { id: 'quiz', label: 'Assessment Quiz', icon: <FileText className="h-4 w-4" /> },
  { id: 'discussion', label: 'Discussion Forum', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'reflection', label: 'Reflective Exercise', icon: <Star className="h-4 w-4" /> }
];

// Sample courses data with UK spelling and educational psychology focus
const SAMPLE_COURSES = [
  {
    id: 1,
    title: 'Trauma-Informed Approaches in Education',
    description: 'Learn how to implement trauma-informed practices in educational settings to support vulnerable pupils.',
    category: 'wellbeing',
    difficulty: 'intermediate',
    duration: '6 hours',
    modules: 5,
    cpd_points: 6,
    image: '/images/courses/trauma-informed.jpg',
    instructor: 'Dr. Sarah Thompson',
    enrolled: 128,
    rating: 4.8,
    progress: 0
  },
  {
    id: 2,
    title: 'Effective Differentiation Strategies',
    description: 'Develop practical skills for differentiating instruction to meet diverse learning needs in the classroom.',
    category: 'pedagogy',
    difficulty: 'beginner',
    duration: '4 hours',
    modules: 4,
    cpd_points: 4,
    image: '/images/courses/differentiation.jpg',
    instructor: 'Prof. James Wilson',
    enrolled: 245,
    rating: 4.6,
    progress: 25
  },
  {
    id: 3,
    title: 'Advanced Assessment for Learning',
    description: 'Master evidence-based assessment techniques to enhance pupil progress and inform teaching practise.',
    category: 'assessment',
    difficulty: 'advanced',
    duration: '8 hours',
    modules: 6,
    cpd_points: 8,
    image: '/images/courses/assessment.jpg',
    instructor: 'Dr. Emily Richards',
    enrolled: 92,
    rating: 4.9,
    progress: 75
  },
  {
    id: 4,
    title: 'Restorative Justice in Schools',
    description: 'Learn how to implement restorative practices to improve behaviour and strengthen school communities.',
    category: 'restorative',
    difficulty: 'intermediate',
    duration: '5 hours',
    modules: 5,
    cpd_points: 5,
    image: '/images/courses/restorative.jpg',
    instructor: 'Dr. Scott Ighavongbe-Patrick',
    enrolled: 156,
    rating: 4.9,
    progress: 50
  },
  {
    id: 5,
    title: 'Supporting Pupils with Autism Spectrum Conditions',
    description: 'Develop strategies to create inclusive learning environments for pupils with autism spectrum conditions.',
    category: 'sen',
    difficulty: 'intermediate',
    duration: '7 hours',
    modules: 6,
    cpd_points: 7,
    image: '/images/courses/autism.jpg',
    instructor: 'Dr. Rebecca Taylor',
    enrolled: 178,
    rating: 4.7,
    progress: 0
  },
  {
    id: 6,
    title: 'Attachment Theory in Educational Practise',
    description: 'Understand how attachment theory can inform educational approaches and interventions.',
    category: 'wellbeing',
    difficulty: 'advanced',
    duration: '6 hours',
    modules: 5,
    cpd_points: 6,
    image: '/images/courses/attachment.jpg',
    instructor: 'Prof. Michael Brown',
    enrolled: 112,
    rating: 4.8,
    progress: 10
  }
];

// Sample module data for a course
const SAMPLE_MODULES = [
  {
    id: 1,
    title: 'Understanding Trauma and Its Impact on Learning',
    description: 'Explore the neuroscience of trauma and how it affects cognitive development and learning.',
    duration: '75 minutes',
    content_types: ['video', 'reading', 'reflection'],
    completed: true
  },
  {
    id: 2,
    title: 'Recognising Signs of Trauma in Educational Settings',
    description: 'Learn to identify behavioural and emotional indicators of trauma in pupils of different ages.',
    duration: '60 minutes',
    content_types: ['video', 'activity', 'quiz'],
    completed: true
  },
  {
    id: 3,
    title: 'Creating Trauma-Sensitive Classrooms',
    description: 'Practical strategies for developing safe, supportive learning environments for all pupils.',
    duration: '90 minutes',
    content_types: ['video', 'reading', 'activity', 'discussion'],
    completed: true
  },
  {
    id: 4,
    title: 'Trauma-Informed Behaviour Management',
    description: 'Approaches to managing challenging behaviour through a trauma-informed lens.',
    duration: '75 minutes',
    content_types: ['video', 'activity', 'reflection', 'quiz'],
    completed: false
  },
  {
    id: 5,
    title: 'Self-Care and Professional Wellbeing',
    description: 'Strategies for educator wellbeing when working with traumatised pupils.',
    duration: '60 minutes',
    content_types: ['video', 'reading', 'reflection', 'discussion'],
    completed: false
  }
];

// Sample discussion data
const SAMPLE_DISCUSSIONS = [
  {
    id: 1,
    title: 'Implementing trauma-informed approaches in resource-constrained settings',
    author: 'Jane Smith',
    date: '15 May 2025',
    replies: 12,
    last_activity: '2 hours ago'
  },
  {
    id: 2,
    title: 'Case study: Supporting a pupil with complex trauma history',
    author: 'Robert Johnson',
    date: '12 May 2025',
    replies: 8,
    last_activity: '1 day ago'
  },
  {
    id: 3,
    title: 'Balancing accountability and trauma-sensitivity',
    author: 'Sarah Williams',
    date: '10 May 2025',
    replies: 15,
    last_activity: '3 days ago'
  }
];

// Sample community members
const SAMPLE_COMMUNITY_MEMBERS = [
  {
    id: 1,
    name: 'Dr. Sarah Thompson',
    role: 'Course Instructor',
    avatar: '/images/avatars/sarah.jpg',
    status: 'online'
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'Educational Psychologist',
    avatar: '/images/avatars/jane.jpg',
    status: 'offline'
  },
  {
    id: 3,
    name: 'Robert Johnson',
    role: 'SENDCo',
    avatar: '/images/avatars/robert.jpg',
    status: 'online'
  },
  {
    id: 4,
    name: 'Sarah Williams',
    role: 'Teacher',
    avatar: '/images/avatars/sarah-w.jpg',
    status: 'offline'
  }
];

// Sample certificates
const SAMPLE_CERTIFICATES = [
  {
    id: 1,
    course_title: 'Effective Differentiation Strategies',
    completion_date: '10 April 2025',
    cpd_points: 4,
    certificate_url: '/certificates/differentiation-cert.pdf'
  },
  {
    id: 2,
    course_title: 'Restorative Justice in Schools',
    completion_date: '28 March 2025',
    cpd_points: 5,
    certificate_url: '/certificates/restorative-cert.pdf'
  }
];

export default function ProfessionalDevelopmentCourses() {
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState(SAMPLE_COURSES);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter courses based on search query and selected filters
  useEffect(() => {
    let result = SAMPLE_COURSES;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(query) || 
        course.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter(course => selectedCategories.includes(course.category));
    }
    
    // Filter by difficulties
    if (selectedDifficulties.length > 0) {
      result = result.filter(course => selectedDifficulties.includes(course.difficulty));
    }
    
    setFilteredCourses(result);
  }, [searchQuery, selectedCategories, selectedDifficulties]);
  
  // Toggle category selection
  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  // Toggle difficulty selection
  const toggleDifficulty = (difficultyId) => {
    setSelectedDifficulties(prev => 
      prev.includes(difficultyId)
        ? prev.filter(id => id !== difficultyId)
        : [...prev, difficultyId]
    );
  };
  
  // Get difficulty badge colour
  const getDifficultyColor = (difficultyId) => {
    const difficulty = DIFFICULTY_LEVELS.find(d => d.id === difficultyId);
    return difficulty ? difficulty.colour : 'bg-grey-500';
  };
  
  // Get difficulty label
  const getDifficultyLabel = (difficultyId) => {
    const difficulty = DIFFICULTY_LEVELS.find(d => d.id === difficultyId);
    return difficulty ? difficulty.label : 'Unknown';
  };
  
  // Get category label
  const getCategoryLabel = (categoryId) => {
    const category = COURSE_CATEGORIES.find(c => c.id === categoryId);
    return category ? category.label : 'Uncategorised';
  };
  
  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setActiveTab('course');
  };
  
  // Handle back to courses
  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setActiveTab('explore');
  };
  
  // Render content type icons
  const renderContentTypeIcons = (contentTypes) => {
    return contentTypes.map(type => {
      const contentType = CONTENT_TYPES.find(ct => ct.id === type);
      return contentType ? (
        <div key={type} className="tooltip" data-tip={contentType.label}>
          <span className="mr-1">{contentType.icon}</span>
        </div>
      ) : null;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Professional Development</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="explore">Explore Courses</TabsTrigger>
          <TabsTrigger value="my-courses">My Courses</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>
        
        {/* Explore Courses Tab */}
        <TabsContent value="explore">
          {!selectedCourse ? (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-centre mb-6 gap-4">
                <div className="relative w-full md:w-1/2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-grey-400" size={18} />
                  <Input
                    placeholder="Search courses..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-centre gap-2"
                >
                  <Filter size={16} />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </div>
              
              {showFilters && (
                <div className="bg-muted p-4 rounded-lg mb-6">
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {COURSE_CATEGORIES.map(category => (
                      <Badge
                        key={category.id}
                        variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleCategory(category.id)}
                      >
                        {category.label}
                      </Badge>
                    ))}
                  </div>
                  
                  <h3 className="font-medium mb-3">Difficulty Level</h3>
                  <div className="flex flex-wrap gap-2">
                    {DIFFICULTY_LEVELS.map(difficulty => (
                      <Badge
                        key={difficulty.id}
                        variant={selectedDifficulties.includes(difficulty.id) ? "default" : "outline"}
                        className={`cursor-pointer ${selectedDifficulties.includes(difficulty.id) ? difficulty.colour : ''}`}
                        onClick={() => toggleDifficulty(difficulty.id)}
                      >
                        {difficulty.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map(course => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="h-48 bg-grey-200 relative">
                        {/* Course image would be here */}
                        <div className="absolute top-2 right-2">
                          <Badge className={getDifficultyColor(course.difficulty)}>
                            {getDifficultyLabel(course.difficulty)}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{course.title}</CardTitle>
                          <Badge variant="outline">{getCategoryLabel(course.category)}</Badge>
                        </div>
                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-centre justify-between text-sm mb-4">
                          <div className="flex items-centre gap-1">
                            <Clock size={16} />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-centre gap-1">
                            <Layers size={16} />
                            <span>{course.modules} Modules</span>
                          </div>
                          <div className="flex items-centre gap-1">
                            <Certificate size={16} />
                            <span>{course.cpd_points} CPD Points</span>
                          </div>
                        </div>
                        <div className="flex items-centre gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{course.instructor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{course.instructor}</span>
                        </div>
                        <div className="flex items-centre justify-between text-sm text-muted-foreground">
                          <div className="flex items-centre gap-1">
                            <Users size={14} />
                            <span>{course.enrolled} enrolled</span>
                          </div>
                          <div className="flex items-centre gap-1">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            <span>{course.rating}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" onClick={() => handleCourseSelect(course)}>
                          {course.progress > 0 ? 'Continue Course' : 'View Course'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-centre py-12">
                  <h3 className="text-xl font-medium mb-2">No courses found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </>
          ) : (
            <div>
              <Button variant="ghost" onClick={handleBackToCourses} className="mb-4">
                ← Back to courses
              </Button>
              
              <div className="bg-muted p-6 rounded-lg mb-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedCourse.title}</h2>
                    <p className="text-muted-foreground mb-4">{selectedCourse.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={getDifficultyColor(selectedCourse.difficulty)}>
                        {getDifficultyLabel(selectedCourse.difficulty)}
                      </Badge>
                      <Badge variant="outline">{getCategoryLabel(selectedCourse.category)}</Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-centre gap-1">
                        <Clock size={16} />
                        <span>{selectedCourse.duration}</span>
                      </div>
                      <div className="flex items-centre gap-1">
                        <Layers size={16} />
                        <span>{selectedCourse.modules} Modules</span>
                      </div>
                      <div className="flex items-centre gap-1">
                        <Certificate size={16} />
                        <span>{selectedCourse.cpd_points} CPD Points</span>
                      </div>
                      <div className="flex items-centre gap-1">
                        <Users size={16} />
                        <span>{selectedCourse.enrolled} enrolled</span>
                      </div>
                      <div className="flex items-centre gap-1">
                        <Star size={16} className="fill-yellow-400 text-yellow-400" />
                        <span>{selectedCourse.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button className="w-full">Enrol Now</Button>
                    <Button variant="outline" className="w-full flex items-centre gap-2">
                      <Share2 size={16} />
                      Share Course
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Content</CardTitle>
                      <CardDescription>
                        {selectedCourse.modules} modules • {selectedCourse.duration} total length
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {SAMPLE_MODULES.map((module, index) => (
                          <AccordionItem key={module.id} value={`module-${module.id}`}>
                            <AccordionTrigger>
                              <div className="flex items-centre gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-centre justify-centre text-xs ${module.completed ? 'bg-green-500 text-white' : 'bg-grey-200'}`}>
                                  {module.completed ? <CheckCircle size={14} /> : index + 1}
                                </div>
                                <span>{module.title}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pl-9">
                                <p className="mb-2">{module.description}</p>
                                <div className="flex items-centre justify-between">
                                  <div className="flex items-centre gap-4">
                                    <div className="flex items-centre gap-1 text-sm text-muted-foreground">
                                      <Clock size={14} />
                                      <span>{module.duration}</span>
                                    </div>
                                    <div className="flex items-centre gap-1">
                                      {renderContentTypeIcons(module.content_types)}
                                    </div>
                                  </div>
                                  <Button size="sm" disabled={!module.completed}>
                                    {module.completed ? 'Review' : 'Start'}
                                  </Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Instructor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-centre gap-3 mb-3">
                        <Avatar>
                          <AvatarFallback>{selectedCourse.instructor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{selectedCourse.instructor}</h4>
                          <p className="text-sm text-muted-foreground">Educational Psychologist</p>
                        </div>
                      </div>
                      <p className="text-sm">
                        Expert in trauma-informed practices with over 15 years of experience in educational psychology and school-based interventions.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Discussions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {SAMPLE_DISCUSSIONS.map(discussion => (
                        <div key={discussion.id} className="mb-4 pb-4 border-b last:border-0 last:mb-0 last:pb-0">
                          <h4 className="font-medium mb-1">{discussion.title}</h4>
                          <div className="flex items-centre justify-between text-sm text-muted-foreground">
                            <span>Started by {discussion.author}</span>
                            <span>{discussion.replies} replies</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Last activity: {discussion.last_activity}
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full mt-2">View All Discussions</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* My Courses Tab */}
        <TabsContent value="my-courses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_COURSES.filter(course => course.progress > 0).map(course => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <Badge className={getDifficultyColor(course.difficulty)}>
                      {getDifficultyLabel(course.difficulty)}
                    </Badge>
                  </div>
                  <CardDescription>{getCategoryLabel(course.category)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  <div className="flex items-centre justify-between text-sm mb-4">
                    <div className="flex items-centre gap-1">
                      <Clock size={16} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-centre gap-1">
                      <Certificate size={16} />
                      <span>{course.cpd_points} CPD Points</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleCourseSelect(course)}>
                    Continue Course
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {SAMPLE_COURSES.filter(course => course.progress > 0).length === 0 && (
              <div className="col-span-full text-centre py-12">
                <h3 className="text-xl font-medium mb-2">No courses in progress</h3>
                <p className="text-muted-foreground mb-4">Explore our course catalogue to get started</p>
                <Button onClick={() => setActiveTab('explore')}>Browse Courses</Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Certificates Tab */}
        <TabsContent value="certificates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_CERTIFICATES.map(certificate => (
              <Card key={certificate.id}>
                <CardHeader>
                  <CardTitle>{certificate.course_title}</CardTitle>
                  <CardDescription>Completed on {certificate.completion_date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-6 rounded-lg flex flex-col items-centre justify-centre mb-4">
                    <Certificate size={48} className="mb-2 text-primary" />
                    <h3 className="text-lg font-medium">Certificate of Completion</h3>
                    <p className="text-sm text-muted-foreground">{certificate.cpd_points} CPD Points</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="flex items-centre gap-2">
                    <Download size={16} />
                    Download
                  </Button>
                  <Button variant="outline" className="flex items-centre gap-2">
                    <Share2 size={16} />
                    Share
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {SAMPLE_CERTIFICATES.length === 0 && (
              <div className="col-span-full text-centre py-12">
                <h3 className="text-xl font-medium mb-2">No certificates yet</h3>
                <p className="text-muted-foreground mb-4">Complete courses to earn certificates</p>
                <Button onClick={() => setActiveTab('explore')}>Browse Courses</Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Community Tab */}
        <TabsContent value="community">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Discussion Forums</CardTitle>
                  <CardDescription>Engage with other professionals in our learning community</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {SAMPLE_DISCUSSIONS.map(discussion => (
                      <div key={discussion.id} className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-1">{discussion.title}</h4>
                        <div className="flex items-centre justify-between text-sm text-muted-foreground mb-3">
                          <span>Started by {discussion.author} • {discussion.date}</span>
                          <span>{discussion.replies} replies</span>
                        </div>
                        <div className="flex justify-between items-centre">
                          <span className="text-xs text-muted-foreground">
                            Last activity: {discussion.last_activity}
                          </span>
                          <Button size="sm">View Discussion</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Start New Discussion</Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Community Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {SAMPLE_COMMUNITY_MEMBERS.map(member => (
                      <div key={member.id} className="flex items-centre justify-between">
                        <div className="flex items-centre gap-3">
                          <Avatar>
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{member.name}</h4>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${member.status === 'online' ? 'bg-green-500' : 'bg-grey-300'}`}></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Members</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-centre gap-3 mb-2">
                        <Calendar className="text-primary" />
                        <div>
                          <h4 className="font-medium">Trauma-Informed Practise Webinar</h4>
                          <p className="text-sm text-muted-foreground">25 May 2025, 16:00-17:30</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">Add to Calendar</Button>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-centre gap-3 mb-2">
                        <Calendar className="text-primary" />
                        <div>
                          <h4 className="font-medium">Q&A with Dr. Sarah Thompson</h4>
                          <p className="text-sm text-muted-foreground">2 June 2025, 17:00-18:00</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">Add to Calendar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
