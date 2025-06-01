"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from '@/components/i18n/i18n-provider';
import { SupportedLanguage, TranslationNamespace } from '@/lib/i18n/types';
import { Globe, MessageSquare, BookOpen, FileText, Users, Bell, Settings, Calendar } from 'lucide-react';

/**
 * Enhanced Parent Portal with Multi-language Support
 * 
 * This component extends the existing parent portal with comprehensive
 * multi-language support, ensuring accessibility for non-English speaking parents.
 */
export function ParentPortalMultiLanguage() {
  const { t, currentLanguage, changeLanguage, isRtl } = useI18n();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample parent data
  const [parentData, setParentData] = useState({
    name: 'Mr. Johnson',
    avatar: '/assets/avatars/parent-1.jpg',
    children: [
      { id: 'child1', name: 'Alex Johnson', yearGroup: 'Year 5', school: 'Oakwood Primary School' }
    ],
    notifications: [
      { id: 'notif1', type: 'message', from: 'Ms. Thompson', subject: 'Weekly Update', date: '2025-05-29', read: false },
      { id: 'notif2', type: 'alert', subject: 'Homework Submission', date: '2025-05-28', read: true },
      { id: 'notif3', type: 'event', subject: 'Parent-Teacher Conference', date: '2025-05-27', read: true }
    ]
  });
  
  // Sample child progress data
  const [childProgress, setChildProgress] = useState({
    attendance: { present: 95, late: 3, absent: 2 },
    subjects: [
      { name: 'Mathematics', progress: 75, grade: 'B+', strengths: ['Problem solving', 'Number operations'], areas_for_improvement: ['Fractions', 'Word problems'] },
      { name: 'English', progress: 68, grade: 'B', strengths: ['Reading comprehension', 'Vocabulary'], areas_for_improvement: ['Writing structure', 'Grammar'] },
      { name: 'Science', progress: 82, grade: 'A-', strengths: ['Scientific inquiry', 'Plant biology'], areas_for_improvement: ['Data recording'] },
      { name: 'Social Studies', progress: 60, grade: 'C+', strengths: ['Historical knowledge'], areas_for_improvement: ['Geography', 'Current events'] }
    ],
    recentActivities: [
      { id: 'act1', type: 'assignment', title: 'Mathematics Quiz', date: '2025-05-29', score: 85, status: 'completed' },
      { id: 'act2', type: 'lesson', title: 'Plant Life Cycles', date: '2025-05-28', status: 'completed' },
      { id: 'act3', type: 'resource', title: 'Reading Comprehension', date: '2025-05-27', status: 'in-progress' }
    ],
    upcomingAssignments: [
      { id: 'assign1', title: 'Fractions Worksheet', subject: 'Mathematics', dueDate: '2025-06-02' },
      { id: 'assign2', title: 'Book Report', subject: 'English', dueDate: '2025-06-05' },
      { id: 'assign3', title: 'Plant Diagram', subject: 'Science', dueDate: '2025-06-07' }
    ],
    behaviourNotes: [
      { id: 'note1', date: '2025-05-25', teacher: 'Ms. Thompson', note: 'Alex was very helpful in group activities today.', type: 'positive' },
      { id: 'note2', date: '2025-05-20', teacher: 'Mr. Roberts', note: 'Alex had difficulty focusing during afternoon lessons.', type: 'concern' }
    ]
  });
  
  // Sample communication data
  const [communications, setCommunications] = useState([
    { id: 'comm1', type: 'message', with: 'Ms. Thompson (Teacher)', subject: 'Progress Update', date: '2025-05-28', status: 'received', preview: 'Alex has been making good progress in mathematics...' },
    { id: 'comm2', type: 'message', with: 'Mr. Roberts (Science Teacher)', subject: 'Science Project', date: '2025-05-25', status: 'sent', preview: 'Thank you for the information about the upcoming science project...' },
    { id: 'comm3', type: 'message', with: 'School Admin', subject: 'Attendance', date: '2025-05-22', status: 'sent', preview: 'I wanted to inform you that Alex will be absent next Monday due to...' }
  ]);
  
  // Sample events data
  const [events, setEvents] = useState([
    { id: 'evt1', title: 'Parent-Teacher Conference', date: '2025-06-10', time: '16:00', location: 'Classroom 5B', description: 'Discuss Alex\'s progress and development.' },
    { id: 'evt2', title: 'School Assembly', date: '2025-06-15', time: '09:30', location: 'Main Hall', description: 'End of term assembly with student presentations.' },
    { id: 'evt3', title: 'Science Fair', date: '2025-06-20', time: '13:00', location: 'School Gymnasium', description: 'Students will present their science projects.' }
  ]);
  
  // Sample resources data
  const [resources, setResources] = useState([
    { id: 'res1', title: 'Supporting Your Child\'s Learning', type: 'guide', category: 'Educational Support', dateAdded: '2025-05-20' },
    { id: 'res2', title: 'Understanding the UK Curriculum', type: 'document', category: 'Curriculum', dateAdded: '2025-05-18' },
    { id: 'res3', title: 'Helping with Mathematics Homework', type: 'video', category: 'Subject Support', dateAdded: '2025-05-15' },
    { id: 'res4', title: 'Emotional Wellbeing for Children', type: 'guide', category: 'Wellbeing', dateAdded: '2025-05-10' },
    { id: 'res5', title: 'Reading with Your Child', type: 'video', category: 'Subject Support', dateAdded: '2025-05-05' }
  ]);
  
  // Language options for the parent portal
  const languageOptions = [
    { value: SupportedLanguage.ENGLISH_UK, label: "English (UK)" },
    { value: SupportedLanguage.WELSH, label: "Cymraeg (Welsh)" },
    { value: SupportedLanguage.POLISH, label: "Polski (Polish)" },
    { value: SupportedLanguage.URDU, label: "اردو (Urdu)" },
    { value: SupportedLanguage.PUNJABI, label: "ਪੰਜਾਬੀ (Punjabi)" },
    { value: SupportedLanguage.ARABIC, label: "العربية (Arabic)" }
  ];
  
  // Mark notification as read
  const markNotificationAsRead = (notificationId: string) => {
    setParentData(prevData => ({
      ...prevData,
      notifications: prevData.notifications.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    }));
  };
  
  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-lg shadow-md ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Header with Language Selection */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4">
              <img 
                src={parentData.avatar} 
                alt={parentData.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('welcome_parent', TranslationNamespace.PARENT_TEACHER, { default: 'Welcome' })}, {parentData.name}!
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('parent_portal', TranslationNamespace.PARENT_TEACHER, { default: 'Parent/Guardian Portal' })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-500 dark:text-gray-400 cursor-pointer" />
              {parentData.notifications.some(n => !n.read) && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </div>
            <div className="relative">
              <select 
                className="appearance-none bg-transparent border border-gray-300 dark:border-gray-600 rounded-md py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={currentLanguage}
                onChange={(e) => changeLanguage(e.target.value as SupportedLanguage)}
              >
                {languageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
            </div>
            <Settings className="h-6 w-6 text-gray-500 dark:text-gray-400 cursor-pointer" />
          </div>
        </div>
      </div>
      
      {/* Child Selector (for parents with multiple children) */}
      {parentData.children.length > 1 && (
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <select className="w-full md:w-auto text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
            {parentData.children.map(child => (
              <option key={child.id} value={child.id}>
                {child.name} - {child.yearGroup}, {child.school}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>{t('child_overview', TranslationNamespace.PARENT_TEACHER, { default: 'Child Overview' })}</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'progress'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span>{t('academic_progress', TranslationNamespace.PARENT_TEACHER, { default: 'Academic Progress' })}</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('communication')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'communication'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>{t('teacher_communication', TranslationNamespace.PARENT_TEACHER, { default: 'Teacher Communication' })}</span>
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
              <span>{t('events_calendar', TranslationNamespace.PARENT_TEACHER, { default: 'Events & Calendar' })}</span>
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
              <BookOpen className="h-4 w-4 mr-2" />
              <span>{t('family_resources', TranslationNamespace.PARENT_TEACHER, { default: 'Family Resources' })}</span>
            </div>
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Child Information */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('child_information', TranslationNamespace.PARENT_TEACHER, { default: 'Child Information' })}
              </h3>
              <div className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4">
                    <img 
                      src="/assets/avatars/student-1.jpg" 
                      alt={parentData.children[0].name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      {parentData.children[0].name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {parentData.children[0].yearGroup} • {parentData.children[0].school}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {t('attendance', TranslationNamespace.PARENT_TEACHER, { default: 'Attendance' })}
                    </h5>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-green-500 h-2.5 rounded-full" 
                          style={{ width: `${childProgress.attendance.present}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {childProgress.attendance.present}%
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="mr-2">{t('present', TranslationNamespace.PARENT_TEACHER, { default: 'Present' })}: {childProgress.attendance.present}</span>
                      <span className="mr-2">{t('late', TranslationNamespace.PARENT_TEACHER, { default: 'Late' })}: {childProgress.attendance.late}</span>
                      <span>{t('absent', TranslationNamespace.PARENT_TEACHER, { default: 'Absent' })}: {childProgress.attendance.absent}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {t('overall_progress', TranslationNamespace.PARENT_TEACHER, { default: 'Overall Progress' })}
                    </h5>
                    <div className="text-2xl font-bold text-primary">
                      {Math.round(childProgress.subjects.reduce((acc, subj) => acc + subj.progress, 0) / childProgress.subjects.length)}%
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {t('across_all_subjects', TranslationNamespace.PARENT_TEACHER, { default: 'Across all subjects' })}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {t('upcoming', TranslationNamespace.PARENT_TEACHER, { default: 'Upcoming' })}
                    </h5>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {childProgress.upcomingAssignments[0].title}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {t('due', TranslationNamespace.PARENT_TEACHER, { default: 'Due' })}: {childProgress.upcomingAssignments[0].dueDate}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activities */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('recent_activities', TranslationNamespace.PARENT_TEACHER, { default: 'Recent Activities' })}
              </h3>
              <div className="space-y-3">
                {childProgress.recentActivities.map(activity => (
                  <div key={activity.id} className="p-4 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t('date', TranslationNamespace.PARENT_TEACHER, { default: 'Date' })}: {activity.date}
                        </p>
                        {activity.score && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('score', TranslationNamespace.PARENT_TEACHER, { default: 'Score' })}: {activity.score}%
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activity.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {activity.status === 'completed' 
                          ? t('completed', TranslationNamespace.PARENT_TEACHER, { default: 'Completed' })
                          : t('in_progress', TranslationNamespace.PARENT_TEACHER, { default: 'In Progress' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  {t('view_all_activities', TranslationNamespace.PARENT_TEACHER, { default: 'View All Activities' })}
                </Button>
              </div>
            </div>
            
            {/* Upcoming Assignments */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('upcoming_assignments', TranslationNamespace.PARENT_TEACHER, { default: 'Upcoming Assignments' })}
              </h3>
              <div className="space-y-3">
                {childProgress.upcomingAssignments.map(assignment => (
                  <div key={assignment.id} className="p-4 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
                    <h4 className="font-medium text-gray-900 dark:text-white">{assignment.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('subject', TranslationNamespace.PARENT_TEACHER, { default: 'Subject' })}: {assignment.subject}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('due_date', TranslationNamespace.PARENT_TEACHER, { default: 'Due Date' })}: {assignment.dueDate}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  {t('view_all_assignments', TranslationNamespace.PARENT_TEACHER, { default: 'View All Assignments' })}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t('academic_progress', TranslationNamespace.PARENT_TEACHER, { default: 'Academic Progress' })}
            </h3>
            
            {/* Subject Progress */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                {t('subject_progress', TranslationNamespace.PARENT_TEACHER, { default: 'Subject Progress' })}
              </h4>
              <div className="space-y-4">
                {childProgress.subjects.map(subject => (
                  <div key={subject.name} className="p-4 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium text-gray-900 dark:text-white">{subject.name}</h5>
                      <span className="text-sm font-medium">{subject.grade}</span>
                    </div>
                    <div className="flex items-center mb-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            subject.progress >= 80 ? 'bg-green-500' :
                            subject.progress >= 60 ? 'bg-blue-500' :
                            'bg-orange-500'
                          }`}
                          style={{ width: `${subject.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {subject.progress}%
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <h6 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t('strengths', TranslationNamespace.PARENT_TEACHER, { default: 'Strengths' })}:
                        </h6>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside">
                          {subject.strengths.map((strength, index) => (
                            <li key={index}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h6 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t('areas_for_improvement', TranslationNamespace.PARENT_TEACHER, { default: 'Areas for Improvement' })}:
                        </h6>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside">
                          {subject.areas_for_improvement.map((area, index) => (
                            <li key={index}>{area}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Behaviour Notes */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                {t('behaviour_notes', TranslationNamespace.PARENT_TEACHER, { default: 'Behaviour Notes' })}
              </h4>
              <div className="space-y-3">
                {childProgress.behaviourNotes.map(note => (
                  <div 
                    key={note.id} 
                    className={`p-4 rounded-md shadow-sm ${
                      note.type === 'positive' 
                        ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500' 
                        : 'bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-800 dark:text-gray-200">{note.note}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {note.teacher} • {note.date}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        note.type === 'positive' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                      }`}>
                        {note.type === 'positive' 
                          ? t('positive', TranslationNamespace.PARENT_TEACHER, { default: 'Positive' })
                          : t('concern', TranslationNamespace.PARENT_TEACHER, { default: 'Concern' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Communication Tab */}
        {activeTab === 'communication' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('teacher_communication', TranslationNamespace.PARENT_TEACHER, { default: 'Teacher Communication' })}
              </h3>
              <Button>
                {t('new_message', TranslationNamespace.PARENT_TEACHER, { default: 'New Message' })}
              </Button>
            </div>
            
            <div className="space-y-4">
              {communications.map(comm => (
                <div key={comm.id} className="p-4 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{comm.subject}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {comm.with} • {comm.date}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      comm.status === 'received' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {comm.status === 'received' 
                        ? t('received', TranslationNamespace.PARENT_TEACHER, { default: 'Received' })
                        : t('sent', TranslationNamespace.PARENT_TEACHER, { default: 'Sent' })}
                    </span>
                  </div>
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-neutral-750 rounded-md">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{comm.preview}</p>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button variant="outline" size="sm">
                      {t('view_full_message', TranslationNamespace.PARENT_TEACHER, { default: 'View Full Message' })}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t('school_events', TranslationNamespace.PARENT_TEACHER, { default: 'School Events & Calendar' })}
            </h3>
            
            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="p-4 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
                  <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{t('date', TranslationNamespace.PARENT_TEACHER, { default: 'Date' })}:</span> {event.date}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{t('time', TranslationNamespace.PARENT_TEACHER, { default: 'Time' })}:</span> {event.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{t('location', TranslationNamespace.PARENT_TEACHER, { default: 'Location' })}:</span> {event.location}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{event.description}</p>
                  <div className="mt-3 flex justify-end">
                    <Button variant="outline" size="sm">
                      {t('add_to_calendar', TranslationNamespace.PARENT_TEACHER, { default: 'Add to Calendar' })}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t('family_resources', TranslationNamespace.PARENT_TEACHER, { default: 'Family Resources' })}
            </h3>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder={t('search_resources', TranslationNamespace.PARENT_TEACHER, { default: 'Search resources...' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
              />
            </div>
            
            <div className="space-y-4">
              {resources.map(resource => (
                <div key={resource.id} className="p-4 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{resource.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {resource.category} • {t('added', TranslationNamespace.PARENT_TEACHER, { default: 'Added' })}: {resource.dateAdded}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      resource.type === 'guide' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                        : resource.type === 'video'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {resource.type === 'guide' 
                        ? t('guide', TranslationNamespace.PARENT_TEACHER, { default: 'Guide' })
                        : resource.type === 'video'
                          ? t('video', TranslationNamespace.PARENT_TEACHER, { default: 'Video' })
                          : t('document', TranslationNamespace.PARENT_TEACHER, { default: 'Document' })}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button variant="outline" size="sm">
                      {t('view_resource', TranslationNamespace.PARENT_TEACHER, { default: 'View Resource' })}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
