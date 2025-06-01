import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { BookOpen, FileText, Users, MessageSquare, Award, Download, ExternalLink, Calendar } from 'lucide-react';

/**
 * Professional Development Resources for EdPsych Connect
 * Provides educational professionals with training materials, evidence-based resources, and professional development tools.
 */
const ProfessionalDevelopment = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('training');
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample professional user data
  const [userData, setUserData] = useState({
    name: 'Dr. Sarah Williams',
    avatar: '/assets/avatars/professional-1.jpg',
    role: 'Educational Psychologist',
    organization: 'Oakwood School District',
    specializations: ['Special Educational Needs', 'Emotional Wellbeing', 'Assessment'],
    completedCourses: 4,
    certificationsEarned: 2
  });
  
  // Sample training materials data
  const [trainingMaterials, setTrainingMaterials] = useState([
    { 
      id: 'course1', 
      title: 'Introduction to Educational Psychology', 
      type: 'course',
      author: 'Dr. James Thompson',
      duration: '8 hours',
      modules: 5,
      progress: 100,
      completed: true,
      certification: true,
      description: 'A comprehensive introduction to the principles of educational psychology and their application in modern educational settings.',
      tags: ['Educational Psychology', 'Introduction', 'Theory']
    },
    { 
      id: 'course2', 
      title: 'Supporting Students with ADHD', 
      type: 'course',
      author: 'Dr. Emily Carter',
      duration: '6 hours',
      modules: 4,
      progress: 75,
      completed: false,
      certification: true,
      description: 'Evidence-based strategies for supporting students with ADHD in classroom environments.',
      tags: ['ADHD', 'Special Needs', 'Classroom Strategies']
    },
    { 
      id: 'workshop1', 
      title: 'Restorative Justice Practices Workshop', 
      type: 'workshop',
      author: 'Michael Roberts',
      duration: '3 hours',
      modules: 1,
      progress: 100,
      completed: true,
      certification: false,
      description: 'Interactive workshop on implementing restorative justice practices in schools.',
      tags: ['Restorative Justice', 'Behavior Management', 'School Culture']
    },
    { 
      id: 'webinar1', 
      title: 'Trauma-Informed Teaching Approaches', 
      type: 'webinar',
      author: 'Dr. Lisa Johnson',
      duration: '1.5 hours',
      modules: 1,
      progress: 100,
      completed: true,
      certification: false,
      description: 'Understanding trauma and its impact on learning, with practical approaches for the classroom.',
      tags: ['Trauma-Informed', 'Mental Health', 'Teaching Strategies']
    },
    { 
      id: 'course3', 
      title: 'Assessment Techniques for Educational Psychologists', 
      type: 'course',
      author: 'Prof. Robert Davis',
      duration: '10 hours',
      modules: 6,
      progress: 50,
      completed: false,
      certification: true,
      description: 'Advanced assessment techniques and interpretation methods for educational psychologists.',
      tags: ['Assessment', 'Evaluation', 'Professional Practice']
    }
  ]);
  
  // Sample evidence-based practice resources
  const [evidenceResources, setEvidenceResources] = useState([
    { 
      id: 'res1', 
      title: 'Systematic Review: Interventions for Dyslexia', 
      type: 'research',
      authors: 'Thompson et al.',
      year: 2024,
      journal: 'Journal of Educational Psychology',
      format: 'pdf',
      description: 'A systematic review of evidence-based interventions for supporting students with dyslexia.',
      tags: ['Dyslexia', 'Interventions', 'Systematic Review']
    },
    { 
      id: 'res2', 
      title: 'Meta-Analysis of Social-Emotional Learning Programs', 
      type: 'research',
      authors: 'Williams & Johnson',
      year: 2023,
      journal: 'Educational Research Review',
      format: 'pdf',
      description: 'A meta-analysis examining the effectiveness of social-emotional learning programs in schools.',
      tags: ['SEL', 'Meta-Analysis', 'Effectiveness']
    },
    { 
      id: 'res3', 
      title: 'Evidence-Based Strategies for Mathematics Anxiety', 
      type: 'guide',
      authors: 'Dr. Emily Roberts',
      year: 2024,
      format: 'pdf',
      description: 'Practical guide to evidence-based strategies for addressing mathematics anxiety in students.',
      tags: ['Mathematics', 'Anxiety', 'Interventions']
    },
    { 
      id: 'res4', 
      title: 'Implementation Science in Educational Settings', 
      type: 'research',
      authors: 'Davis et al.',
      year: 2023,
      journal: 'Implementation Science',
      format: 'pdf',
      description: 'Research on effectively implementing evidence-based practices in educational settings.',
      tags: ['Implementation', 'Evidence-Based Practice', 'School Systems']
    },
    { 
      id: 'res5', 
      title: 'Neuroscience and Learning: Current Research', 
      type: 'research',
      authors: 'Thompson & Carter',
      year: 2024,
      journal: 'Mind, Brain, and Education',
      format: 'pdf',
      description: 'Review of current neuroscience research and its implications for educational practice.',
      tags: ['Neuroscience', 'Learning', 'Brain Development']
    }
  ]);
  
  // Sample professional learning communities
  const [communities, setCommunities] = useState([
    { 
      id: 'comm1', 
      name: 'Educational Psychologists Network', 
      members: 245,
      discussions: 87,
      resources: 34,
      description: 'A community for educational psychologists to share knowledge, resources, and best practices.',
      joined: true
    },
    { 
      id: 'comm2', 
      name: 'Special Educational Needs Specialists', 
      members: 189,
      discussions: 62,
      resources: 28,
      description: 'Focused on supporting professionals working with students with special educational needs.',
      joined: true
    },
    { 
      id: 'comm3', 
      name: 'School Mental Health Practitioners', 
      members: 156,
      discussions: 45,
      resources: 19,
      description: 'Community for professionals focused on mental health support in educational settings.',
      joined: false
    },
    { 
      id: 'comm4', 
      name: 'Assessment and Evaluation Specialists', 
      members: 112,
      discussions: 38,
      resources: 22,
      description: 'For professionals specializing in educational assessment and evaluation methods.',
      joined: false
    }
  ]);
  
  // Sample certifications and assessments
  const [certifications, setCertifications] = useState([
    { 
      id: 'cert1', 
      title: 'Certified Educational Psychology Practitioner', 
      issuer: 'EdPsych Connect',
      dateEarned: '2025-04-15',
      expiryDate: '2027-04-15',
      status: 'active',
      description: 'Certification for professionals demonstrating comprehensive knowledge of educational psychology principles and practices.',
      earned: true
    },
    { 
      id: 'cert2', 
      title: 'Special Educational Needs Specialist', 
      issuer: 'EdPsych Connect',
      dateEarned: '2025-03-10',
      expiryDate: '2027-03-10',
      status: 'active',
      description: 'Specialized certification for professionals working with students with special educational needs.',
      earned: true
    },
    { 
      id: 'cert3', 
      title: 'Restorative Justice Facilitator', 
      issuer: 'EdPsych Connect',
      status: 'available',
      description: 'Certification for professionals trained in restorative justice practices in educational settings.',
      requirements: ['Complete Restorative Justice Practices Workshop', 'Pass assessment with 80% or higher', 'Submit case study'],
      earned: false
    },
    { 
      id: 'cert4', 
      title: 'Trauma-Informed Education Specialist', 
      issuer: 'EdPsych Connect',
      status: 'available',
      description: 'Certification for professionals trained in trauma-informed approaches to education.',
      requirements: ['Complete Trauma-Informed Teaching Approaches', 'Complete Advanced Trauma-Informed Practices', 'Pass assessment with 80% or higher'],
      earned: false
    }
  ]);
  
  // Sample research and publications
  const [research, setResearch] = useState([
    { 
      id: 'pub1', 
      title: 'Current Trends in Educational Psychology', 
      type: 'journal',
      journal: 'Journal of Educational Psychology',
      authors: 'Various',
      year: 2025,
      issue: 'Vol. 117, Issue 2',
      description: 'Special issue featuring current research and trends in educational psychology.',
      access: 'subscription'
    },
    { 
      id: 'pub2', 
      title: 'Handbook of Special Educational Needs', 
      type: 'book',
      authors: 'Thompson, J., & Williams, R.',
      year: 2024,
      publisher: 'Educational Press',
      description: 'Comprehensive handbook covering all aspects of special educational needs support.',
      access: 'purchase'
    },
    { 
      id: 'pub3', 
      title: 'Effectiveness of School-Based Mental Health Interventions', 
      type: 'journal',
      journal: 'School Psychology Review',
      authors: 'Johnson, L., et al.',
      year: 2024,
      issue: 'Vol. 53, Issue 1',
      description: 'Meta-analysis of school-based mental health intervention effectiveness.',
      access: 'open'
    },
    { 
      id: 'pub4', 
      title: 'Digital Tools for Educational Assessment', 
      type: 'report',
      authors: 'EdPsych Connect Research Team',
      year: 2025,
      description: 'Report on the effectiveness and implementation of digital assessment tools in education.',
      access: 'free'
    }
  ]);
  
  // Function to join a community
  const joinCommunity = (communityId) => {
    setCommunities(prevCommunities => 
      prevCommunities.map(community => 
        community.id === communityId ? { ...community, joined: true } : community
      )
    );
  };
  
  // Function to start a course
  const startCourse = (courseId) => {
    setTrainingMaterials(prevMaterials => 
      prevMaterials.map(material => 
        material.id === courseId && material.progress === 0 ? { ...material, progress: 5 } : material
      )
    );
  };
  
  // Function to continue a course
  const continueCourse = (courseId) => {
    console.log(`Continuing course ${courseId}`);
    // In a real implementation, this would navigate to the course content
  };
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4">
              <img 
                src={userData.avatar} 
                alt={userData.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Welcome, {userData.name}!
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {userData.role} • {userData.organization}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-primary">
              Professional Development Portal
            </div>
            <div className="flex mt-1 space-x-1">
              {userData.specializations.map((specialization, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                >
                  {specialization}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('training')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'training'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>Training Materials</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'evidence'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span>Evidence-Based Practice</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('communities')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'communities'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>Professional Learning Communities</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('certifications')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'certifications'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Award className="h-4 w-4 mr-2" />
              <span>Certifications & Assessment</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('research')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'research'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span>Research & Publications</span>
            </div>
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {/* Training Materials Tab */}
        {activeTab === 'training' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Training Materials & Courses</h3>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Types</option>
                  <option value="course">Courses</option>
                  <option value="workshop">Workshops</option>
                  <option value="webinar">Webinars</option>
                </select>
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Topics</option>
                  <option value="educational">Educational Psychology</option>
                  <option value="special">Special Needs</option>
                  <option value="assessment">Assessment</option>
                  <option value="behavior">Behavior Management</option>
                </select>
              </div>
            </div>
            
            {/* Progress Overview */}
            <div className="mb-6 bg-gray-50 dark:bg-neutral-750 p-4 rounded-md">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Your Learning Progress</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Courses In Progress</h5>
                  <p className="text-2xl font-bold text-primary">
                    {trainingMaterials.filter(m => m.progress > 0 && m.progress < 100).length}
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Completed Courses</h5>
                  <p className="text-2xl font-bold text-green-500">
                    {userData.completedCourses}
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Certifications Earned</h5>
                  <p className="text-2xl font-bold text-blue-500">
                    {userData.certificationsEarned}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Course List */}
            <div className="space-y-4">
              {trainingMaterials.map(material => (
                <div 
                  key={material.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <h4 className="text-md font-medium text-gray-900 dark:text-white mr-2">
                            {material.title}
                          </h4>
                          {material.certification && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              Certification
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <span className="mr-3 capitalize">{material.type}</span>
                          <span className="mr-3">By: {material.author}</span>
                          <span>{material.duration}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {material.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {material.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        {material.completed ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Completed
                          </span>
                        ) : material.progress > 0 ? (
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
                    
                    {material.progress > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{material.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              material.progress === 100 
                                ? 'bg-green-500' 
                                : 'bg-primary'
                            }`} 
                            style={{ width: `${material.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      {material.completed ? (
                        <button className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md">
                          Review
                        </button>
                      ) : material.progress > 0 ? (
                        <button 
                          onClick={() => continueCourse(material.id)}
                          className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                        >
                          Continue
                        </button>
                      ) : (
                        <button 
                          onClick={() => startCourse(material.id)}
                          className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                        >
                          Start
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Evidence-Based Practice Tab */}
        {activeTab === 'evidence' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Evidence-Based Practice Resources</h3>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Types</option>
                  <option value="research">Research Papers</option>
                  <option value="guide">Practical Guides</option>
                  <option value="review">Systematic Reviews</option>
                </select>
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Topics</option>
                  <option value="dyslexia">Dyslexia</option>
                  <option value="sel">Social-Emotional Learning</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="implementation">Implementation Science</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {evidenceResources.map(resource => (
                <div 
                  key={resource.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-1">
                        {resource.title}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span className="mr-3">{resource.authors}</span>
                        <span className="mr-3">{resource.year}</span>
                        {resource.journal && <span>{resource.journal}</span>}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {resource.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {resource.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        resource.type === 'research' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {resource.type === 'research' ? 'Research' : 'Guide'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      <span>Download {resource.format.toUpperCase()}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Professional Learning Communities Tab */}
        {activeTab === 'communities' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Professional Learning Communities</h3>
            
            {/* Communities List */}
            <div className="space-y-4">
              {communities.map(community => (
                <div 
                  key={community.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-1">
                        <h4 className="text-md font-medium text-gray-900 dark:text-white mr-2">
                          {community.name}
                        </h4>
                        {community.joined && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Joined
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {community.description}
                      </p>
                      <div className="flex space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{community.members} Members</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span>{community.discussions} Discussions</span>
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          <span>{community.resources} Resources</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-3">
                    {community.joined ? (
                      <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90">
                        View Community
                      </button>
                    ) : (
                      <button 
                        onClick={() => joinCommunity(community.id)}
                        className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                      >
                        Join Community
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Community Activity */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Recent Community Activity</h4>
              <div className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md">
                <div className="space-y-3">
                  <div className="p-3 bg-white dark:bg-neutral-800 rounded-md">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                        New Discussion: Implementing Trauma-Informed Practices
                      </h5>
                      <span className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      In Educational Psychologists Network
                    </p>
                    <button className="text-xs text-primary hover:text-primary/80">
                      View Discussion
                    </button>
                  </div>
                  
                  <div className="p-3 bg-white dark:bg-neutral-800 rounded-md">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                        New Resource: ADHD Assessment Toolkit
                      </h5>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Yesterday</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      In Special Educational Needs Specialists
                    </p>
                    <button className="text-xs text-primary hover:text-primary/80">
                      View Resource
                    </button>
                  </div>
                  
                  <div className="p-3 bg-white dark:bg-neutral-800 rounded-md">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                        Upcoming Event: Virtual Conference on Educational Psychology
                      </h5>
                      <span className="text-xs text-gray-500 dark:text-gray-400">2 days ago</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      In Educational Psychologists Network
                    </p>
                    <button className="text-xs text-primary hover:text-primary/80">
                      View Event Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Certifications & Assessment Tab */}
        {activeTab === 'certifications' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Certifications & Assessment</h3>
            
            {/* Earned Certifications */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Your Certifications</h4>
              <div className="space-y-4">
                {certifications.filter(cert => cert.earned).map(cert => (
                  <div 
                    key={cert.id}
                    className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4"
                  >
                    <div className="flex items-start">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                          <Award className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h5 className="text-md font-medium text-gray-900 dark:text-white mb-1">
                            {cert.title}
                          </h5>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            cert.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                          }`}>
                            {cert.status === 'active' ? 'Active' : 'Expired'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <span className="mr-3">Issued by: {cert.issuer}</span>
                          <span className="mr-3">Earned: {cert.dateEarned}</span>
                          <span>Expires: {cert.expiryDate}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {cert.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <button className="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-md hover:bg-primary/20">
                        View Certificate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Available Certifications */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Available Certifications</h4>
              <div className="space-y-4">
                {certifications.filter(cert => !cert.earned).map(cert => (
                  <div 
                    key={cert.id}
                    className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4"
                  >
                    <div className="flex items-start">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                          <Award className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h5 className="text-md font-medium text-gray-900 dark:text-white mb-1">
                          {cert.title}
                        </h5>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <span>Issued by: {cert.issuer}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {cert.description}
                        </p>
                        <div>
                          <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Requirements:</h6>
                          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                            {cert.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90">
                        Start Certification Path
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Research & Publications Tab */}
        {activeTab === 'research' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Research & Publications</h3>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Types</option>
                  <option value="journal">Journal Articles</option>
                  <option value="book">Books</option>
                  <option value="report">Reports</option>
                </select>
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Access Types</option>
                  <option value="open">Open Access</option>
                  <option value="free">Free</option>
                  <option value="subscription">Subscription</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {research.map(pub => (
                <div 
                  key={pub.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-1">
                        {pub.title}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span className="mr-3">{pub.authors}</span>
                        <span className="mr-3">{pub.year}</span>
                        {pub.journal && <span className="mr-3">{pub.journal}</span>}
                        {pub.publisher && <span>{pub.publisher}</span>}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {pub.description}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs rounded-full mr-2 ${
                        pub.type === 'journal' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : pub.type === 'book'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {pub.type === 'journal' ? 'Journal' : pub.type === 'book' ? 'Book' : 'Report'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        pub.access === 'open' || pub.access === 'free'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                      }`}>
                        {pub.access === 'open' 
                          ? 'Open Access' 
                          : pub.access === 'free' 
                            ? 'Free' 
                            : pub.access === 'subscription' 
                              ? 'Subscription' 
                              : 'Purchase'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 flex items-center">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      <span>Access Publication</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Research Calendar */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Upcoming Research Events</h4>
              <div className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md">
                <div className="space-y-3">
                  <div className="p-3 bg-white dark:bg-neutral-800 rounded-md flex items-start">
                    <div className="mr-3 flex-shrink-0">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Virtual Conference: Advances in Educational Psychology
                      </h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        June 15-17, 2025 • Online
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white dark:bg-neutral-800 rounded-md flex items-start">
                    <div className="mr-3 flex-shrink-0">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Call for Papers: Special Issue on Inclusive Education
                      </h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Deadline: July 30, 2025 • Journal of Educational Psychology
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white dark:bg-neutral-800 rounded-md flex items-start">
                    <div className="mr-3 flex-shrink-0">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Research Symposium: Neuroscience and Education
                      </h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        August 5, 2025 • London, UK
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalDevelopment;
