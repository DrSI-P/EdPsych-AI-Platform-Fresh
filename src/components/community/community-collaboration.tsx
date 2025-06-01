import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Users, MessageCircle, Share2, Bell, Calendar, FileText, Video } from 'lucide-react';

/**
 * Community & Collaboration Tools Component for EdPsych Connect
 * Provides features for community engagement, collaboration, and knowledge sharing
 * among students, educators, and professionals.
 */
const CommunityCollaboration = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('forums');
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample forum data
  const [forumData, setForumData] = useState({
    categories: [
      { id: 'teaching', name: 'Teaching Strategies', icon: 'book', posts: 156, threads: 42 },
      { id: 'sen', name: 'Special Educational Needs', icon: 'heart', posts: 243, threads: 68 },
      { id: 'behaviour', name: 'Behaviour Management', icon: 'shield', posts: 189, threads: 51 },
      { id: 'assessment', name: 'Assessment & Progress', icon: 'chart', posts: 124, threads: 37 },
      { id: 'wellbeing', name: 'Student Wellbeing', icon: 'smile', posts: 178, threads: 45 },
      { id: 'technology', name: 'Educational Technology', icon: 'laptop', posts: 132, threads: 39 },
      { id: 'research', name: 'Research & Evidence', icon: 'search', posts: 97, threads: 28 },
      { id: 'cpd', name: 'Professional Development', icon: 'award', posts: 112, threads: 34 }
    ],
    popularThreads: [
      {
        id: 'thread1',
        title: 'Effective strategies for supporting dyslexic students in mainstream classrooms',
        category: 'sen',
        author: 'Dr. Emma Wilson',
        authorRole: 'Educational Psychologist',
        date: '2 days ago',
        replies: 24,
        views: 187,
        lastReply: {
          author: 'Michael Thompson',
          date: '3 hours ago'
        }
      },
      {
        id: 'thread2',
        title: 'Implementing restorative justice approaches in secondary schools',
        category: 'behaviour',
        author: 'James Roberts',
        authorRole: 'Head of Year',
        date: '4 days ago',
        replies: 31,
        views: 243,
        lastReply: {
          author: 'Sarah Johnson',
          date: '6 hours ago'
        }
      },
      {
        id: 'thread3',
        title: 'Using AI tools to reduce teacher workload - experiences and recommendations',
        category: 'technology',
        author: 'Priya Sharma',
        authorRole: 'Digital Learning Lead',
        date: '1 week ago',
        replies: 42,
        views: 356,
        lastReply: {
          author: 'Dr. Scott Ighavongbe-Patrick',
          date: '1 day ago'
        }
      },
      {
        id: 'thread4',
        title: 'Supporting students with anxiety during exam periods',
        category: 'wellbeing',
        author: 'Dr. Lisa Chen',
        authorRole: 'School Counsellor',
        date: '3 days ago',
        replies: 19,
        views: 167,
        lastReply: {
          author: 'Rebecca Williams',
          date: '12 hours ago'
        }
      },
      {
        id: 'thread5',
        title: 'Evidence-based interventions for improving executive function skills',
        category: 'research',
        author: 'Prof. David Miller',
        authorRole: 'Researcher',
        date: '5 days ago',
        replies: 27,
        views: 198,
        lastReply: {
          author: 'Dr. Emma Wilson',
          date: '1 day ago'
        }
      }
    ]
  });
  
  // Sample collaboration projects data
  const [collaborationProjects, setCollaborationProjects] = useState([
    {
      id: 'proj1',
      title: 'Developing a Whole-School Approach to Mental Health',
      description: 'A collaborative project to create a comprehensive framework for supporting student mental health across all year groups.',
      members: 12,
      progress: 65,
      dueDate: '15 July 2025',
      tags: ['Mental Health', 'Wellbeing', 'Whole-School'],
      recentActivity: '2 hours ago'
    },
    {
      id: 'proj2',
      title: 'Inclusive Curriculum Design for SEND Students',
      description: 'Working together to develop curriculum resources that are accessible and engaging for students with special educational needs and disabilities.',
      members: 8,
      progress: 40,
      dueDate: '30 August 2025',
      tags: ['SEND', 'Curriculum', 'Inclusion'],
      recentActivity: '1 day ago'
    },
    {
      id: 'proj3',
      title: 'AI-Enhanced Formative Assessment Tools',
      description: 'Collaboratively developing and testing AI-powered formative assessment tools to provide timely feedback and reduce teacher workload.',
      members: 15,
      progress: 25,
      dueDate: '10 September 2025',
      tags: ['AI', 'Assessment', 'EdTech'],
      recentActivity: '4 hours ago'
    },
    {
      id: 'proj4',
      title: 'Restorative Justice Implementation Guide',
      description: 'Creating a comprehensive guide for schools looking to implement restorative justice approaches to behaviour management.',
      members: 9,
      progress: 80,
      dueDate: '20 June 2025',
      tags: ['Behaviour', 'Restorative Justice', 'Guide'],
      recentActivity: '3 days ago'
    }
  ]);
  
  // Sample events data
  const [eventsData, setEventsData] = useState([
    {
      id: 'event1',
      title: 'Webinar: Supporting Neurodivergent Students in the Classroom',
      type: 'Webinar',
      date: '10 June 2025',
      time: '16:00 - 17:30',
      host: 'Dr. Scott Ighavongbe-Patrick',
      attendees: 87,
      description: 'This webinar will explore practical strategies for supporting neurodivergent students in mainstream classrooms, with a focus on creating inclusive learning environments.',
      tags: ['Neurodiversity', 'Inclusion', 'Teaching Strategies']
    },
    {
      id: 'event2',
      title: 'Workshop: Implementing Effective Behaviour Management Strategies',
      type: 'Workshop',
      date: '15 June 2025',
      time: '09:30 - 15:00',
      host: 'James Roberts & Sarah Johnson',
      attendees: 42,
      description: 'A hands-on workshop exploring evidence-based behaviour management strategies, with practical examples and opportunities for discussion and reflection.',
      tags: ['Behaviour', 'Classroom Management', 'Workshop']
    },
    {
      id: 'event3',
      title: 'Panel Discussion: The Future of AI in Education',
      type: 'Panel Discussion',
      date: '22 June 2025',
      time: '18:00 - 19:30',
      host: 'EdPsych Connect',
      attendees: 124,
      description: 'Join our panel of experts as they discuss the potential impact of AI on education, including opportunities, challenges, and ethical considerations.',
      tags: ['AI', 'EdTech', 'Future of Education']
    },
    {
      id: 'event4',
      title: 'Conference: Annual Educational Psychology Symposium',
      type: 'Conference',
      date: '5-7 July 2025',
      time: 'All Day',
      host: 'EdPsych Connect & University Partners',
      attendees: 356,
      description: 'Our annual symposium bringing together educational psychologists, teachers, researchers, and other professionals to share knowledge, research, and best practices.',
      tags: ['Conference', 'Research', 'Networking']
    }
  ]);
  
  // Sample resource sharing data
  const [sharedResources, setSharedResources] = useState([
    {
      id: 'res1',
      title: 'Executive Function Skills Development Toolkit',
      type: 'Toolkit',
      author: 'Dr. Emma Wilson',
      authorRole: 'Educational Psychologist',
      date: '1 week ago',
      downloads: 187,
      rating: 4.8,
      description: 'A comprehensive toolkit with strategies, activities, and resources to help develop executive function skills in students aged 7-16.',
      tags: ['Executive Function', 'Toolkit', 'Intervention']
    },
    {
      id: 'res2',
      title: 'Anxiety Management Strategies for Exam Periods',
      type: 'Guide',
      author: 'Dr. Lisa Chen',
      authorRole: 'School Counsellor',
      date: '2 weeks ago',
      downloads: 243,
      rating: 4.7,
      description: 'A practical guide for teachers and parents to help students manage anxiety during exam periods, with strategies based on cognitive-behavioural approaches.',
      tags: ['Anxiety', 'Exams', 'Wellbeing']
    },
    {
      id: 'res3',
      title: 'Inclusive Classroom Checklist',
      type: 'Checklist',
      author: 'Priya Sharma',
      authorRole: 'SENCO',
      date: '3 weeks ago',
      downloads: 156,
      rating: 4.9,
      description: 'A practical checklist to help teachers evaluate and improve the inclusivity of their classroom environment and teaching practices.',
      tags: ['Inclusion', 'Classroom', 'SEND']
    },
    {
      id: 'res4',
      title: 'Restorative Conversations Script Templates',
      type: 'Templates',
      author: 'James Roberts',
      authorRole: 'Head of Year',
      date: '1 month ago',
      downloads: 312,
      rating: 4.6,
      description: 'A collection of script templates to guide restorative conversations with students following behavioural incidents.',
      tags: ['Restorative Justice', 'Behaviour', 'Templates']
    }
  ]);
  
  // Sample mentoring data
  const [mentoringData, setMentoringData] = useState({
    mentors: [
      {
        id: 'mentor1',
        name: 'Dr. Scott Ighavongbe-Patrick',
        role: 'Educational Psychologist',
        expertise: ['SEND', 'Behaviour Management', 'Educational Assessment'],
        experience: '12+ years',
        mentees: 8,
        rating: 4.9,
        availability: 'Limited'
      },
      {
        id: 'mentor2',
        name: 'Dr. Emma Wilson',
        role: 'Educational Psychologist',
        expertise: ['Dyslexia', 'Executive Function', 'Cognitive Assessment'],
        experience: '10+ years',
        mentees: 6,
        rating: 4.8,
        availability: 'Available'
      },
      {
        id: 'mentor3',
        name: 'James Roberts',
        role: 'Head of Year',
        expertise: ['Behaviour Management', 'Restorative Justice', 'Pastoral Care'],
        experience: '15+ years',
        mentees: 5,
        rating: 4.7,
        availability: 'Available'
      },
      {
        id: 'mentor4',
        name: 'Priya Sharma',
        role: 'SENCO & Digital Learning Lead',
        expertise: ['SEND', 'EdTech', 'Inclusive Education'],
        experience: '8+ years',
        mentees: 7,
        rating: 4.8,
        availability: 'Limited'
      }
    ],
    mentoringSessions: [
      {
        id: 'session1',
        mentor: 'Dr. Scott Ighavongbe-Patrick',
        topic: 'Implementing Effective Behaviour Support Plans',
        date: '12 June 2025',
        time: '16:00 - 17:00',
        format: 'Video Call',
        status: 'Upcoming'
      },
      {
        id: 'session2',
        mentor: 'Dr. Emma Wilson',
        topic: 'Supporting Students with Working Memory Difficulties',
        date: '15 June 2025',
        time: '15:30 - 16:30',
        format: 'Video Call',
        status: 'Upcoming'
      },
      {
        id: 'session3',
        mentor: 'James Roberts',
        topic: 'Restorative Approaches to Conflict Resolution',
        date: '8 June 2025',
        time: '17:00 - 18:00',
        format: 'Video Call',
        status: 'Upcoming'
      }
    ]
  });
  
  // Function to view a forum thread
  const viewThread = (threadId) => {
    console.log(`Viewing thread ${threadId}`);
    // In a real implementation, this would navigate to the thread
  };
  
  // Function to view a collaboration project
  const viewProject = (projectId) => {
    console.log(`Viewing project ${projectId}`);
    // In a real implementation, this would navigate to the project
  };
  
  // Function to view an event
  const viewEvent = (eventId) => {
    console.log(`Viewing event ${eventId}`);
    // In a real implementation, this would navigate to the event
  };
  
  // Function to view a shared resource
  const viewResource = (resourceId) => {
    console.log(`Viewing resource ${resourceId}`);
    // In a real implementation, this would open the resource
  };
  
  // Function to view a mentor profile
  const viewMentorProfile = (mentorId) => {
    console.log(`Viewing mentor profile ${mentorId}`);
    // In a real implementation, this would navigate to the mentor profile
  };
  
  // Function to book a mentoring session
  const bookMentoringSession = (mentorId) => {
    console.log(`Booking mentoring session with mentor ${mentorId}`);
    // In a real implementation, this would open the booking form
  };
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Community & Collaboration
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connect, collaborate, and share with the EdPsych community
            </p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('forums')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'forums'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              <span>Discussion Forums</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('collaboration')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'collaboration'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>Collaboration Projects</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'events'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Events & Webinars</span>
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
              <Share2 className="h-4 w-4 mr-2" />
              <span>Resource Sharing</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('mentoring')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'mentoring'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>Mentoring</span>
            </div>
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {/* Discussion Forums Tab */}
        {activeTab === 'forums' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Discussion Forums
              </h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90">
                  New Thread
                </button>
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Categories</option>
                  {forumData.categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {forumData.categories.map(category => (
                <div 
                  key={category.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:border-primary dark:hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                      {/* Placeholder for category icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-1">
                        {category.name}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="mr-3">{category.threads} Threads</span>
                        <span>{category.posts} Posts</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white">
                  Popular Discussions
                </h4>
                <button className="text-sm text-primary hover:text-primary/90">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {forumData.popularThreads.map(thread => (
                  <div 
                    key={thread.id}
                    className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:border-primary dark:hover:border-primary transition-colors cursor-pointer"
                    onClick={() => viewThread(thread.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-md font-medium text-gray-900 dark:text-white mb-1">
                          {thread.title}
                        </h5>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <span className="mr-3">by {thread.author}</span>
                          <span className="mr-3">{thread.authorRole}</span>
                          <span>{thread.date}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span className="mr-3">{thread.replies} Replies</span>
                          <span>{thread.views} Views</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {forumData.categories.find(c => c.id === thread.category)?.name}
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                      <span>Last reply by {thread.lastReply.author}, {thread.lastReply.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Collaboration Projects Tab */}
        {activeTab === 'collaboration' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Collaboration Projects
              </h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90">
                  New Project
                </button>
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Projects</option>
                  <option value="my">My Projects</option>
                  <option value="open">Open Projects</option>
                  <option value="completed">Completed Projects</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {collaborationProjects.map(project => (
                <div 
                  key={project.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-1">
                        {project.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center mr-3">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{project.members} Members</span>
                        </div>
                        <div className="flex items-center mr-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Due: {project.dueDate}</span>
                        </div>
                        <div className="flex items-center">
                          <Bell className="h-4 w-4 mr-1" />
                          <span>Active: {project.recentActivity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          project.progress >= 80 
                            ? 'bg-green-500' 
                            : project.progress >= 40
                              ? 'bg-amber-500'
                              : 'bg-primary'
                        }`} 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      onClick={() => viewProject(project.id)}
                      className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                      View Project
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Events & Webinars Tab */}
        {activeTab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Events & Webinars
              </h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90">
                  Create Event
                </button>
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Events</option>
                  <option value="webinar">Webinars</option>
                  <option value="workshop">Workshops</option>
                  <option value="conference">Conferences</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {eventsData.map(event => (
                <div 
                  key={event.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-1">
                        {event.title}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span className="mr-3">Host: {event.host}</span>
                        <span className="mr-3">{event.attendees} Attendees</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center mr-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{event.time}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {event.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.type === 'Webinar' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        : event.type === 'Workshop'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : event.type === 'Panel Discussion'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      onClick={() => viewEvent(event.id)}
                      className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                      {event.type === 'Webinar' ? 'Join Webinar' : 'View Details'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Resource Sharing Tab */}
        {activeTab === 'resources' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Resource Sharing
              </h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90">
                  Share Resource
                </button>
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Resources</option>
                  <option value="toolkit">Toolkits</option>
                  <option value="guide">Guides</option>
                  <option value="template">Templates</option>
                  <option value="checklist">Checklists</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {sharedResources.map(resource => (
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
                        <span className="mr-3">by {resource.author}</span>
                        <span className="mr-3">{resource.authorRole}</span>
                        <span>{resource.date}</span>
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
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>{resource.rating}</span>
                        </div>
                        <span>{resource.downloads} Downloads</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      resource.type === 'Toolkit' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        : resource.type === 'Guide'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : resource.type === 'Templates'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                    }`}>
                      {resource.type}
                    </span>
                  </div>
                  
                  <div className="flex justify-end mt-3">
                    <button 
                      onClick={() => viewResource(resource.id)}
                      className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                      Download Resource
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Mentoring Tab */}
        {activeTab === 'mentoring' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Mentoring
              </h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90">
                  Become a Mentor
                </button>
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Expertise Areas</option>
                  <option value="send">SEND</option>
                  <option value="behaviour">Behaviour Management</option>
                  <option value="assessment">Educational Assessment</option>
                </select>
              </div>
            </div>
            
            <div className="mb-8">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                Available Mentors
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mentoringData.mentors.map(mentor => (
                  <div 
                    key={mentor.id}
                    className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4"
                  >
                    <div className="flex items-start">
                      <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                        {/* Placeholder for mentor avatar */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="text-md font-medium text-gray-900 dark:text-white mb-1">
                          {mentor.name}
                        </h5>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <span>{mentor.role}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <div className="flex items-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{mentor.rating}</span>
                          </div>
                          <span>{mentor.experience} Experience</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {mentor.expertise.map((area, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        mentor.availability === 'Available' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                      }`}>
                        {mentor.availability}
                      </span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => viewMentorProfile(mentor.id)}
                          className="px-3 py-1.5 text-sm bg-white text-primary border border-primary rounded-md hover:bg-primary/10"
                        >
                          View Profile
                        </button>
                        <button 
                          onClick={() => bookMentoringSession(mentor.id)}
                          className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                          disabled={mentor.availability !== 'Available'}
                        >
                          Book Session
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                Upcoming Mentoring Sessions
              </h4>
              <div className="space-y-4">
                {mentoringData.mentoringSessions.map(session => (
                  <div 
                    key={session.id}
                    className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-md font-medium text-gray-900 dark:text-white mb-1">
                          {session.topic}
                        </h5>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <span>Mentor: {session.mentor}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center mr-3">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center">
                            <Video className="h-4 w-4 mr-1" />
                            <span>{session.format}</span>
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {session.status}
                      </span>
                    </div>
                    
                    <div className="flex justify-end mt-3">
                      <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90">
                        Join Session
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityCollaboration;
