import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { BookOpen, FileText, Users, Video, Play, Check, Clock, Calendar } from 'lucide-react';

/**
 * Curriculum & Learning Resources Component for EdPsych Connect
 * Provides structured curriculum content, learning resources, and educational materials
 * aligned with UK educational standards and curriculum requirements.
 */
const CurriculumResources = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('curriculum');
  const [selectedSubject, setSelectedSubject] = useState('mathematics');
  const [selectedYearGroup, setSelectedYearGroup] = useState('year5');
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample curriculum data
  const [curriculumData, setCurriculumData] = useState({
    subjects: [
      { id: 'mathematics', name: 'Mathematics', icon: 'calculator' },
      { id: 'english', name: 'English', icon: 'book' },
      { id: 'science', name: 'Science', icon: 'flask' },
      { id: 'history', name: 'History', icon: 'landmark' },
      { id: 'geography', name: 'Geography', icon: 'globe' },
      { id: 'art', name: 'Art & Design', icon: 'palette' },
      { id: 'computing', name: 'Computing', icon: 'laptop' },
      { id: 'pe', name: 'Physical Education', icon: 'activity' }
    ],
    yearGroups: [
      { id: 'eyfs', name: 'Early Years Foundation Stage' },
      { id: 'year1', name: 'Year 1' },
      { id: 'year2', name: 'Year 2' },
      { id: 'year3', name: 'Year 3' },
      { id: 'year4', name: 'Year 4' },
      { id: 'year5', name: 'Year 5' },
      { id: 'year6', name: 'Year 6' },
      { id: 'ks3', name: 'Key Stage 3' },
      { id: 'ks4', name: 'Key Stage 4' }
    ]
  });
  
  // Sample curriculum units for Mathematics Year 5
  const [curriculumUnits, setCurriculumUnits] = useState([
    {
      id: 'unit1',
      title: 'Number and Place Value',
      description: 'Read, write, order and compare numbers to at least 1,000,000 and determine the value of each digit.',
      objectives: [
        'Read and write numbers to at least 1,000,000',
        'Order and compare numbers to at least 1,000,000',
        'Count forwards or backwards in steps of powers of 10',
        'Interpret negative numbers in context',
        'Round any number up to 1,000,000 to the nearest 10, 100, 1,000, 10,000 and 100,000'
      ],
      resources: 6,
      lessons: 8,
      progress: 75
    },
    {
      id: 'unit2',
      title: 'Addition and Subtraction',
      description: 'Add and subtract whole numbers with more than 4 digits, including using formal written methods.',
      objectives: [
        'Add and subtract whole numbers with more than 4 digits',
        'Use rounding to check answers to calculations',
        'Solve addition and subtraction multi-step problems in contexts',
        'Use mental calculation strategies'
      ],
      resources: 5,
      lessons: 7,
      progress: 100
    },
    {
      id: 'unit3',
      title: 'Multiplication and Division',
      description: 'Multiply and divide whole numbers and decimals by 10, 100 and 1,000.',
      objectives: [
        'Identify multiples and factors',
        'Solve problems involving multiplication and division',
        'Multiply and divide whole numbers and decimals by 10, 100 and 1,000',
        'Recognise and use square numbers and cube numbers'
      ],
      resources: 8,
      lessons: 10,
      progress: 40
    },
    {
      id: 'unit4',
      title: 'Fractions',
      description: 'Compare and order fractions whose denominators are all multiples of the same number.',
      objectives: [
        'Compare and order fractions',
        'Identify, name and write equivalent fractions',
        'Add and subtract fractions with the same denominator',
        'Multiply proper fractions and mixed numbers by whole numbers'
      ],
      resources: 7,
      lessons: 9,
      progress: 0
    },
    {
      id: 'unit5',
      title: 'Measurement',
      description: 'Convert between different units of metric measure.',
      objectives: [
        'Convert between different units of metric measure',
        'Understand and use approximate equivalences between metric and imperial units',
        'Measure and calculate the perimeter of composite rectilinear shapes',
        'Calculate and compare the area of rectangles'
      ],
      resources: 6,
      lessons: 8,
      progress: 0
    }
  ]);
  
  // Sample lesson data for a specific unit
  const [lessonData, setLessonData] = useState([
    {
      id: 'lesson1',
      title: 'Understanding Place Value to 1,000,000',
      duration: '45 minutes',
      type: 'Core Lesson',
      resources: ['Presentation', 'Worksheet', 'Interactive Activity'],
      objectives: [
        'Read and write numbers to 1,000,000',
        'Understand the value of each digit in numbers to 1,000,000',
        'Represent numbers to 1,000,000 using different models'
      ],
      completed: true
    },
    {
      id: 'lesson2',
      title: 'Comparing and Ordering Numbers to 1,000,000',
      duration: '45 minutes',
      type: 'Core Lesson',
      resources: ['Presentation', 'Worksheet', 'Game'],
      objectives: [
        'Compare numbers to 1,000,000 using <, > and =',
        'Order a set of numbers to 1,000,000',
        'Use place value to explain comparisons'
      ],
      completed: true
    },
    {
      id: 'lesson3',
      title: 'Counting in Powers of 10',
      duration: '45 minutes',
      type: 'Core Lesson',
      resources: ['Presentation', 'Worksheet', 'Number Cards'],
      objectives: [
        'Count forwards and backwards in steps of 10, 100, 1,000, 10,000 and 100,000',
        'Identify patterns when counting in powers of 10',
        'Solve problems involving counting in powers of 10'
      ],
      completed: true
    },
    {
      id: 'lesson4',
      title: 'Negative Numbers in Context',
      duration: '45 minutes',
      type: 'Core Lesson',
      resources: ['Presentation', 'Worksheet', 'Temperature Charts'],
      objectives: [
        'Interpret negative numbers in context',
        'Count forwards and backwards with positive and negative numbers',
        'Solve problems involving negative numbers'
      ],
      completed: false
    },
    {
      id: 'lesson5',
      title: 'Rounding Numbers',
      duration: '45 minutes',
      type: 'Core Lesson',
      resources: ['Presentation', 'Worksheet', 'Number Line'],
      objectives: [
        'Round any number up to 1,000,000 to the nearest 10',
        'Round any number up to 1,000,000 to the nearest 100, 1,000, 10,000 and 100,000',
        'Use rounding to estimate and approximate'
      ],
      completed: false
    },
    {
      id: 'lesson6',
      title: 'Roman Numerals',
      duration: '45 minutes',
      type: 'Core Lesson',
      resources: ['Presentation', 'Worksheet', 'Roman Numeral Cards'],
      objectives: [
        'Read Roman numerals to 1,000 (M)',
        'Recognise years written in Roman numerals',
        'Convert between Roman numerals and Arabic numbers'
      ],
      completed: false
    },
    {
      id: 'lesson7',
      title: 'Problem Solving with Place Value',
      duration: '45 minutes',
      type: 'Application',
      resources: ['Problem Cards', 'Worksheet', 'Challenge Questions'],
      objectives: [
        'Solve problems involving place value',
        'Apply understanding of place value to multi-step problems',
        'Explain reasoning using place value knowledge'
      ],
      completed: false
    },
    {
      id: 'lesson8',
      title: 'Assessment: Number and Place Value',
      duration: '45 minutes',
      type: 'Assessment',
      resources: ['Assessment Paper', 'Mark Scheme'],
      objectives: [
        'Demonstrate understanding of number and place value concepts',
        'Apply skills to solve a range of problems',
        'Show reasoning and explanation skills'
      ],
      completed: false
    }
  ]);
  
  // Sample educational resources
  const [educationalResources, setEducationalResources] = useState([
    {
      id: 'res1',
      title: 'Place Value Chart Interactive',
      type: 'interactive',
      format: 'web',
      subject: 'Mathematics',
      yearGroups: ['Year 4', 'Year 5', 'Year 6'],
      description: 'Interactive place value chart for numbers up to 1,000,000. Drag and drop digits to create numbers and see their expanded form.',
      thumbnail: '/assets/resources/place-value-chart.jpg',
      popularity: 4.8,
      downloads: 1245
    },
    {
      id: 'res2',
      title: 'Number and Place Value Workbook',
      type: 'worksheet',
      format: 'pdf',
      subject: 'Mathematics',
      yearGroups: ['Year 5'],
      description: 'Comprehensive workbook with exercises on reading, writing, ordering and comparing numbers to 1,000,000.',
      thumbnail: '/assets/resources/place-value-workbook.jpg',
      popularity: 4.6,
      downloads: 987
    },
    {
      id: 'res3',
      title: 'Place Value Video Lesson',
      type: 'video',
      format: 'mp4',
      subject: 'Mathematics',
      yearGroups: ['Year 5'],
      description: 'Engaging video lesson explaining place value concepts for numbers up to 1,000,000.',
      thumbnail: '/assets/resources/place-value-video.jpg',
      duration: '12:34',
      popularity: 4.9,
      views: 3456
    },
    {
      id: 'res4',
      title: 'Rounding Numbers Game',
      type: 'game',
      format: 'web',
      subject: 'Mathematics',
      yearGroups: ['Year 4', 'Year 5'],
      description: 'Interactive game where students practice rounding numbers to the nearest 10, 100, 1,000, 10,000 and 100,000.',
      thumbnail: '/assets/resources/rounding-game.jpg',
      popularity: 4.7,
      plays: 2345
    },
    {
      id: 'res5',
      title: 'Place Value Assessment',
      type: 'assessment',
      format: 'pdf',
      subject: 'Mathematics',
      yearGroups: ['Year 5'],
      description: 'Comprehensive assessment to evaluate understanding of place value concepts.',
      thumbnail: '/assets/resources/place-value-assessment.jpg',
      popularity: 4.5,
      downloads: 876
    },
    {
      id: 'res6',
      title: 'Negative Numbers Presentation',
      type: 'presentation',
      format: 'pptx',
      subject: 'Mathematics',
      yearGroups: ['Year 5'],
      description: 'Slide presentation explaining negative numbers in real-world contexts.',
      thumbnail: '/assets/resources/negative-numbers.jpg',
      popularity: 4.4,
      downloads: 765
    }
  ]);
  
  // Sample educational videos
  const [educationalVideos, setEducationalVideos] = useState([
    {
      id: 'vid1',
      title: 'Understanding Place Value',
      subject: 'Mathematics',
      yearGroups: ['Year 5'],
      duration: '12:34',
      thumbnail: '/assets/videos/place-value.jpg',
      description: 'This video explains the concept of place value for numbers up to 1,000,000, using visual models and examples.',
      views: 3456,
      popularity: 4.9
    },
    {
      id: 'vid2',
      title: 'Comparing and Ordering Numbers',
      subject: 'Mathematics',
      yearGroups: ['Year 5'],
      duration: '10:21',
      thumbnail: '/assets/videos/comparing-numbers.jpg',
      description: 'Learn how to compare and order numbers using place value knowledge and the symbols <, > and =.',
      views: 2987,
      popularity: 4.7
    },
    {
      id: 'vid3',
      title: 'Counting in Powers of 10',
      subject: 'Mathematics',
      yearGroups: ['Year 5'],
      duration: '08:45',
      thumbnail: '/assets/videos/powers-of-10.jpg',
      description: 'This video demonstrates how to count forwards and backwards in steps of powers of 10.',
      views: 2543,
      popularity: 4.6
    },
    {
      id: 'vid4',
      title: 'Negative Numbers in Real Life',
      subject: 'Mathematics',
      yearGroups: ['Year 5'],
      duration: '11:18',
      thumbnail: '/assets/videos/negative-numbers.jpg',
      description: 'Explore negative numbers in real-world contexts such as temperature, elevation, and finance.',
      views: 2198,
      popularity: 4.8
    },
    {
      id: 'vid5',
      title: 'Rounding Numbers to Different Powers of 10',
      subject: 'Mathematics',
      yearGroups: ['Year 5'],
      duration: '09:52',
      thumbnail: '/assets/videos/rounding.jpg',
      description: 'Learn strategies for rounding numbers to the nearest 10, 100, 1,000, 10,000 and 100,000.',
      views: 1876,
      popularity: 4.5
    },
    {
      id: 'vid6',
      title: 'Roman Numerals Explained',
      subject: 'Mathematics',
      yearGroups: ['Year 5'],
      duration: '07:39',
      thumbnail: '/assets/videos/roman-numerals.jpg',
      description: 'This video explains how to read and write Roman numerals up to 1,000 (M).',
      views: 1654,
      popularity: 4.4
    }
  ]);
  
  // Sample assessment data
  const [assessmentData, setAssessmentData] = useState([
    {
      id: 'assess1',
      title: 'Number and Place Value Assessment',
      subject: 'Mathematics',
      yearGroups: ['Year 5'],
      type: 'End of Unit',
      format: 'pdf',
      questions: 25,
      duration: '45 minutes',
      description: 'Comprehensive assessment covering all aspects of number and place value for Year 5.',
      downloads: 876
    },
    {
      id: 'assess2',
      title: 'Place Value Quick Quiz',
      subject: 'Mathematics',
      yearGroups: ['Year 5'],
      type: 'Formative',
      format: 'interactive',
      questions: 10,
      duration: '15 minutes',
      description: 'Quick interactive quiz to check understanding of place value concepts.',
      plays: 1543
    },
    {
      id: 'assess3',
      title: 'Comparing and Ordering Numbers Assessment',
      subject: 'Mathematics',
      yearGroups: ['Year 5'],
      type: 'Topic',
      format: 'pdf',
      questions: 15,
      duration: '30 minutes',
      description: 'Assessment focused on comparing and ordering numbers to 1,000,000.',
      downloads: 654
    },
    {
      id: 'assess4',
      title: 'Negative Numbers Assessment',
      subject: 'Mathematics',
      yearGroups: ['Year 5'],
      type: 'Topic',
      format: 'pdf',
      questions: 12,
      duration: '25 minutes',
      description: 'Assessment focused on understanding and using negative numbers in context.',
      downloads: 543
    }
  ]);
  
  // Function to view a lesson
  const viewLesson = (lessonId) => {
    console.log(`Viewing lesson ${lessonId}`);
    // In a real implementation, this would navigate to the lesson content
  };
  
  // Function to view a resource
  const viewResource = (resourceId) => {
    console.log(`Viewing resource ${resourceId}`);
    // In a real implementation, this would open the resource
  };
  
  // Function to view a video
  const viewVideo = (videoId) => {
    console.log(`Viewing video ${videoId}`);
    // In a real implementation, this would play the video
  };
  
  // Function to download an assessment
  const downloadAssessment = (assessmentId) => {
    console.log(`Downloading assessment ${assessmentId}`);
    // In a real implementation, this would download the assessment
  };
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Curriculum & Learning Resources
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              UK curriculum-aligned educational materials and resources
            </p>
          </div>
          <div className="flex space-x-2">
            <select 
              value={selectedYearGroup}
              onChange={(e) => setSelectedYearGroup(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5"
            >
              {curriculumData.yearGroups.map(yearGroup => (
                <option key={yearGroup.id} value={yearGroup.id}>
                  {yearGroup.name}
                </option>
              ))}
            </select>
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5"
            >
              {curriculumData.subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'curriculum'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>Curriculum Units</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('lessons')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'lessons'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span>Lesson Plans</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'resources'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span>Educational Resources</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'videos'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Video className="h-4 w-4 mr-2" />
              <span>Educational Videos</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('assessments')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'assessments'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span>Assessments</span>
            </div>
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {/* Curriculum Units Tab */}
        {activeTab === 'curriculum' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Mathematics Curriculum Units - Year 5
              </h3>
              <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90">
                View Curriculum Overview
              </button>
            </div>
            
            <div className="space-y-4">
              {curriculumUnits.map(unit => (
                <div 
                  key={unit.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-1">
                          {unit.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {unit.description}
                        </p>
                        <div className="flex space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            <span>{unit.lessons} Lessons</span>
                          </div>
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            <span>{unit.resources} Resources</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        {unit.progress === 100 ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Completed
                          </span>
                        ) : unit.progress > 0 ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                            In Progress
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            Not Started
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {unit.progress > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{unit.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              unit.progress === 100 
                                ? 'bg-green-500' 
                                : 'bg-primary'
                            }`} 
                            style={{ width: `${unit.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Learning Objectives:</h5>
                      <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                        {unit.objectives.map((objective, index) => (
                          <li key={index}>{objective}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex justify-end">
                      <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90">
                        View Unit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Lesson Plans Tab */}
        {activeTab === 'lessons' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Number and Place Value - Lesson Plans
              </h3>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Lesson Types</option>
                  <option value="core">Core Lessons</option>
                  <option value="application">Application</option>
                  <option value="assessment">Assessment</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {lessonData.map(lesson => (
                <div 
                  key={lesson.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-1">
                        <h4 className="text-md font-medium text-gray-900 dark:text-white mr-2">
                          {lesson.title}
                        </h4>
                        {lesson.completed && (
                          <span className="flex items-center text-xs text-green-600 dark:text-green-400">
                            <Check className="h-3 w-3 mr-1" />
                            <span>Completed</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span className="mr-3">{lesson.type}</span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{lesson.duration}</span>
                        </span>
                      </div>
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Learning Objectives:</h5>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                          {lesson.objectives.map((objective, index) => (
                            <li key={index}>{objective}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resources:</h5>
                        <div className="flex flex-wrap gap-2">
                          {lesson.resources.map((resource, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                            >
                              {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      onClick={() => viewLesson(lesson.id)}
                      className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                      View Lesson
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Educational Resources Tab */}
        {activeTab === 'resources' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Educational Resources
              </h3>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Resource Types</option>
                  <option value="interactive">Interactive</option>
                  <option value="worksheet">Worksheets</option>
                  <option value="presentation">Presentations</option>
                  <option value="game">Games</option>
                  <option value="assessment">Assessments</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {educationalResources.map(resource => (
                <div 
                  key={resource.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    {/* Placeholder for resource thumbnail */}
                    <div className="text-gray-400 dark:text-gray-500">
                      {resource.type === 'interactive' && (
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                          </svg>
                          <span className="mt-2">Interactive</span>
                        </div>
                      )}
                      {resource.type === 'worksheet' && (
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="mt-2">Worksheet</span>
                        </div>
                      )}
                      {resource.type === 'video' && (
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="mt-2">Video</span>
                        </div>
                      )}
                      {resource.type === 'game' && (
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="mt-2">Game</span>
                        </div>
                      )}
                      {resource.type === 'assessment' && (
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span className="mt-2">Assessment</span>
                        </div>
                      )}
                      {resource.type === 'presentation' && (
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                          </svg>
                          <span className="mt-2">Presentation</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white">
                        {resource.title}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        resource.type === 'interactive' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : resource.type === 'video'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            : resource.type === 'game'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                      }`}>
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span className="mr-3">{resource.subject}</span>
                      <span>{resource.yearGroups.join(', ')}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {resource.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>{resource.popularity}</span>
                        </div>
                        {resource.downloads && (
                          <span>{resource.downloads} Downloads</span>
                        )}
                        {resource.views && (
                          <span>{resource.views} Views</span>
                        )}
                        {resource.plays && (
                          <span>{resource.plays} Plays</span>
                        )}
                      </div>
                      <button 
                        onClick={() => viewResource(resource.id)}
                        className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                      >
                        View Resource
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Educational Videos Tab */}
        {activeTab === 'videos' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Educational Videos
              </h3>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Video Types</option>
                  <option value="lesson">Lesson Videos</option>
                  <option value="tutorial">Tutorials</option>
                  <option value="explanation">Explanations</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {educationalVideos.map(video => (
                <div 
                  key={video.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 relative">
                    {/* Placeholder for video thumbnail */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                      {video.title}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span className="mr-3">{video.subject}</span>
                      <span>{video.yearGroups.join(', ')}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {video.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>{video.popularity}</span>
                        </div>
                        <span>{video.views} Views</span>
                      </div>
                      <button 
                        onClick={() => viewVideo(video.id)}
                        className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 flex items-center"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        <span>Play Video</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Assessments Tab */}
        {activeTab === 'assessments' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Assessments
              </h3>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Assessment Types</option>
                  <option value="formative">Formative</option>
                  <option value="summative">Summative</option>
                  <option value="diagnostic">Diagnostic</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {assessmentData.map(assessment => (
                <div 
                  key={assessment.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-1">
                        {assessment.title}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span className="mr-3">{assessment.subject}</span>
                        <span className="mr-3">{assessment.yearGroups.join(', ')}</span>
                        <span className="mr-3">{assessment.type}</span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{assessment.duration}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {assessment.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="mr-3">{assessment.questions} Questions</span>
                        <span className="capitalize">{assessment.format} Format</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      assessment.format === 'interactive' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                    }`}>
                      {assessment.format.charAt(0).toUpperCase() + assessment.format.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex justify-end mt-3">
                    <button 
                      onClick={() => downloadAssessment(assessment.id)}
                      className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                      {assessment.format === 'interactive' ? 'Start Assessment' : 'Download Assessment'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurriculumResources;
