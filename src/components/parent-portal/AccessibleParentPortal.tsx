"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from '@/components/i18n/i18n-provider';
import { TranslationNamespace } from '@/lib/i18n/types';
import { useAccessibility } from '@/components/accessibility/accessibility-provider';
import { Globe, MessageSquare, BookOpen, FileText, Users, Bell, Settings, Calendar, Eye, EyeOff, ZoomIn, ZoomOut } from 'lucide-react';

/**
 * AccessibleParentPortal Component
 * 
 * Enhanced parent portal with comprehensive accessibility features
 * for parents with various disabilities and special needs.
 */
export function AccessibleParentPortal() {
  const { t, currentLanguage, isRtl } = useI18n();
  const { 
    highContrast, 
    fontSize, 
    increaseFontSize, 
    decreaseFontSize, 
    reducedMotion,
    colorBlindMode,
    toggleHighContrast,
    toggleReducedMotion,
    setColorBlindMode
  } = useAccessibility();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [readAloudActive, setReadAloudActive] = useState(false);
  
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
    ]
  });
  
  // Toggle read aloud functionality
  const toggleReadAloud = () => {
    setReadAloudActive(!readAloudActive);
    // Implementation would connect to text-to-speech service
  };
  
  // Get appropriate color scheme based on accessibility settings
  const getColorScheme = (baseColor) => {
    if (highContrast) {
      return {
        bg: 'bg-black',
        text: 'text-white',
        border: 'border-white'
      };
    }
    
    if (colorBlindMode === 'protanopia') {
      // Adjust colors for red-blind users
      const colorMap = {
        'red': 'blue',
        'green': 'blue',
        'blue': 'blue',
        'purple': 'blue',
        'orange': 'yellow',
        'amber': 'yellow'
      };
      return {
        bg: `bg-${colorMap[baseColor] || baseColor}-100 dark:bg-${colorMap[baseColor] || baseColor}-900/20`,
        text: `text-${colorMap[baseColor] || baseColor}-800 dark:text-${colorMap[baseColor] || baseColor}-200`,
        border: `border-${colorMap[baseColor] || baseColor}-500`
      };
    }
    
    if (colorBlindMode === 'deuteranopia') {
      // Adjust colors for green-blind users
      const colorMap = {
        'red': 'blue',
        'green': 'blue',
        'blue': 'blue',
        'purple': 'blue',
        'orange': 'yellow',
        'amber': 'yellow'
      };
      return {
        bg: `bg-${colorMap[baseColor] || baseColor}-100 dark:bg-${colorMap[baseColor] || baseColor}-900/20`,
        text: `text-${colorMap[baseColor] || baseColor}-800 dark:text-${colorMap[baseColor] || baseColor}-200`,
        border: `border-${colorMap[baseColor] || baseColor}-500`
      };
    }
    
    // Default colors
    return {
      bg: `bg-${baseColor}-100 dark:bg-${baseColor}-900/20`,
      text: `text-${baseColor}-800 dark:text-${baseColor}-200`,
      border: `border-${baseColor}-500`
    };
  };
  
  return (
    <div 
      className={`bg-white dark:bg-neutral-800 rounded-lg shadow-md ${isRtl ? 'rtl' : 'ltr'}`}
      style={{ fontSize: `${fontSize}%` }}
    >
      {/* Accessibility Toolbar */}
      <div className="p-2 bg-gray-100 dark:bg-neutral-850 border-b border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleHighContrast}
          aria-label={highContrast ? 'Disable high contrast' : 'Enable high contrast'}
        >
          {highContrast ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={decreaseFontSize}
          aria-label="Decrease font size"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={increaseFontSize}
          aria-label="Increase font size"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleReadAloud}
          aria-label={readAloudActive ? 'Disable read aloud' : 'Enable read aloud'}
          className={readAloudActive ? 'bg-primary/20' : ''}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 6v12M6 12h12"></path>
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        </Button>
      </div>
      
      {/* Header */}
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
            <Settings className="h-6 w-6 text-gray-500 dark:text-gray-400 cursor-pointer" />
          </div>
        </div>
      </div>
      
      {/* Child Selector (for parents with multiple children) */}
      {parentData.children.length > 1 && (
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <select 
            className="w-full md:w-auto text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5"
            aria-label={t('select_child', TranslationNamespace.PARENT_TEACHER, { default: 'Select child' })}
          >
            {parentData.children.map(child => (
              <option key={child.id} value={child.id}>
                {child.name} - {child.yearGroup}, {child.school}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Tabs - Enhanced for keyboard navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto" role="tablist" aria-label="Parent Portal Sections">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            role="tab"
            aria-selected={activeTab === 'overview'}
            aria-controls="overview-panel"
            id="overview-tab"
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
            role="tab"
            aria-selected={activeTab === 'progress'}
            aria-controls="progress-panel"
            id="progress-tab"
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
            role="tab"
            aria-selected={activeTab === 'communication'}
            aria-controls="communication-panel"
            id="communication-tab"
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
            role="tab"
            aria-selected={activeTab === 'events'}
            aria-controls="events-panel"
            id="events-tab"
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
            role="tab"
            aria-selected={activeTab === 'resources'}
            aria-controls="resources-panel"
            id="resources-tab"
          >
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>{t('family_resources', TranslationNamespace.PARENT_TEACHER, { default: 'Family Resources' })}</span>
            </div>
          </button>
        </nav>
      </div>
      
      {/* Tab Content - Enhanced with ARIA roles */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div 
            role="tabpanel" 
            id="overview-panel" 
            aria-labelledby="overview-tab"
          >
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
                      <div 
                        className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2"
                        role="progressbar"
                        aria-valuenow={childProgress.attendance.present}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
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
                    <div 
                      className="text-2xl font-bold text-primary"
                      aria-label={`${Math.round(childProgress.subjects.reduce((acc, subj) => acc + subj.progress, 0) / childProgress.subjects.length)}% overall progress`}
                    >
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
                  <div 
                    key={activity.id} 
                    className="p-4 bg-white dark:bg-neutral-800 rounded-md shadow-sm"
                  >
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
                          ? getColorScheme('green').bg + ' ' + getColorScheme('green').text
                          : getColorScheme('blue').bg + ' ' + getColorScheme('blue').text
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
          </div>
        )}
        
        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div 
            role="tabpanel" 
            id="progress-panel" 
            aria-labelledby="progress-tab"
          >
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
                      <div 
                        className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2"
                        role="progressbar"
                        aria-valuenow={subject.progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-label={`${subject.name} progress: ${subject.progress}%`}
                      >
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
          </div>
        )}
        
        {/* Communication Tab */}
        {activeTab === 'communication' && (
          <div 
            role="tabpanel" 
            id="communication-panel" 
            aria-labelledby="communication-tab"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('teacher_communication', TranslationNamespace.PARENT_TEACHER, { default: 'Teacher Communication' })}
              </h3>
              <Button>
                {t('new_message', TranslationNamespace.PARENT_TEACHER, { default: 'New Message' })}
              </Button>
            </div>
            
            {/* Simplified communication interface for accessibility */}
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {t('contact_teacher', TranslationNamespace.PARENT_TEACHER, { default: 'Contact Teacher' })}
                </h4>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('select_teacher', TranslationNamespace.PARENT_TEACHER, { default: 'Select Teacher' })}
                    </label>
                    <select 
                      id="teacher"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-2"
                    >
                      <option value="ms-thompson">Ms. Thompson (Class Teacher)</option>
                      <option value="mr-roberts">Mr. Roberts (Science)</option>
                      <option value="mrs-jones">Mrs. Jones (Mathematics)</option>
                      <option value="mr-williams">Mr. Williams (English)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('subject', TranslationNamespace.PARENT_TEACHER, { default: 'Subject' })}
                    </label>
                    <input 
                      type="text"
                      id="subject"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-2"
                      placeholder={t('message_subject', TranslationNamespace.PARENT_TEACHER, { default: 'Message subject' })}
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('message', TranslationNamespace.PARENT_TEACHER, { default: 'Message' })}
                    </label>
                    <textarea 
                      id="message"
                      rows={4}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-2"
                      placeholder={t('type_message', TranslationNamespace.PARENT_TEACHER, { default: 'Type your message here...' })}
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <Button>
                      {t('send_message', TranslationNamespace.PARENT_TEACHER, { default: 'Send Message' })}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {t('schedule_meeting', TranslationNamespace.PARENT_TEACHER, { default: 'Schedule a Meeting' })}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {t('schedule_meeting_desc', TranslationNamespace.PARENT_TEACHER, { default: 'Request a meeting with your child\'s teacher or school staff.' })}
                </p>
                <Button variant="outline">
                  {t('request_meeting', TranslationNamespace.PARENT_TEACHER, { default: 'Request Meeting' })}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Events Tab */}
        {activeTab === 'events' && (
          <div 
            role="tabpanel" 
            id="events-panel" 
            aria-labelledby="events-tab"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t('school_events', TranslationNamespace.PARENT_TEACHER, { default: 'School Events & Calendar' })}
            </h3>
            
            {/* Simplified calendar view for accessibility */}
            <div className="mb-6 p-4 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                {t('upcoming_events', TranslationNamespace.PARENT_TEACHER, { default: 'Upcoming Events' })}
              </h4>
              <ul className="space-y-3">
                <li className="p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div className="flex items-start">
                    <div className="min-w-[60px] text-center mr-3">
                      <div className="text-sm font-bold text-primary">10</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">June</div>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">Parent-Teacher Conference</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">16:00 • Classroom 5B</p>
                    </div>
                  </div>
                </li>
                <li className="p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div className="flex items-start">
                    <div className="min-w-[60px] text-center mr-3">
                      <div className="text-sm font-bold text-primary">15</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">June</div>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">School Assembly</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">09:30 • Main Hall</p>
                    </div>
                  </div>
                </li>
                <li className="p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div className="flex items-start">
                    <div className="min-w-[60px] text-center mr-3">
                      <div className="text-sm font-bold text-primary">20</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">June</div>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">Science Fair</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">13:00 • School Gymnasium</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                {t('term_dates', TranslationNamespace.PARENT_TEACHER, { default: 'Term Dates' })}
              </h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Summer Term Begins</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">17 April 2025</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Half Term</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">26 - 30 May 2025</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Summer Term Ends</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">23 July 2025</span>
                </li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div 
            role="tabpanel" 
            id="resources-panel" 
            aria-labelledby="resources-tab"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t('family_resources', TranslationNamespace.PARENT_TEACHER, { default: 'Family Resources' })}
            </h3>
            
            {/* Simplified resources view for accessibility */}
            <div className="mb-4">
              <label htmlFor="resource-search" className="sr-only">
                {t('search_resources', TranslationNamespace.PARENT_TEACHER, { default: 'Search resources' })}
              </label>
              <input
                id="resource-search"
                type="text"
                placeholder={t('search_resources', TranslationNamespace.PARENT_TEACHER, { default: 'Search resources...' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
              />
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Supporting Your Child's Learning</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  A comprehensive guide for parents on how to support their child's learning at home.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Guide • Educational Support</span>
                  <Button variant="outline" size="sm">
                    {t('view', TranslationNamespace.PARENT_TEACHER, { default: 'View' })}
                  </Button>
                </div>
              </div>
              
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Understanding the UK Curriculum</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  An overview of the UK curriculum and what your child will be learning at each key stage.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Document • Curriculum</span>
                  <Button variant="outline" size="sm">
                    {t('view', TranslationNamespace.PARENT_TEACHER, { default: 'View' })}
                  </Button>
                </div>
              </div>
              
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Helping with Mathematics Homework</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Practical tips and strategies for helping your child with mathematics homework.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Video • Subject Support</span>
                  <Button variant="outline" size="sm">
                    {t('view', TranslationNamespace.PARENT_TEACHER, { default: 'View' })}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
