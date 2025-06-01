"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from '@/components/i18n/i18n-provider';
import { TranslationNamespace } from '@/lib/i18n/types';
import { BarChart, LineChart, PieChart, Calendar, BookOpen, FileText, Users, Bell, Settings, TrendingUp, Activity } from 'lucide-react';

/**
 * ParentPortalAnalytics Component
 * 
 * Enhanced analytics dashboard for parents to track their child's progress,
 * identify trends, and understand learning patterns.
 */
export function ParentPortalAnalytics() {
  const { t, currentLanguage, isRtl } = useI18n();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('term');
  
  // Sample parent data
  const [parentData, setParentData] = useState({
    name: 'Mr. Johnson',
    avatar: '/assets/avatars/parent-1.jpg',
    children: [
      { id: 'child1', name: 'Alex Johnson', yearGroup: 'Year 5', school: 'Oakwood Primary School' }
    ]
  });
  
  // Sample analytics data
  const [analyticsData, setAnalyticsData] = useState({
    progressTrends: {
      mathematics: [65, 68, 72, 75, 78, 75],
      english: [70, 72, 68, 70, 72, 68],
      science: [75, 78, 80, 82, 85, 82],
      overall: [70, 72, 73, 75, 78, 75]
    },
    learningStyles: {
      visual: 40,
      auditory: 25,
      kinesthetic: 20,
      reading: 15
    },
    engagementMetrics: {
      timeSpent: [120, 135, 110, 145, 130, 150],
      resourcesAccessed: [8, 12, 10, 15, 14, 16],
      completionRates: [85, 90, 80, 95, 90, 92]
    },
    curriculumCoverage: {
      mathematics: {
        covered: 75,
        mastered: 60,
        struggling: 15,
        notStarted: 25
      },
      english: {
        covered: 80,
        mastered: 65,
        struggling: 15,
        notStarted: 20
      },
      science: {
        covered: 70,
        mastered: 55,
        struggling: 15,
        notStarted: 30
      }
    },
    comparisons: {
      classAverage: {
        mathematics: 72,
        english: 70,
        science: 75,
        overall: 72
      },
      yearGroupAverage: {
        mathematics: 70,
        english: 68,
        science: 72,
        overall: 70
      }
    },
    timeLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  });
  
  // Function to render a progress bar
  const renderProgressBar = (value, color = 'blue', label = '') => {
    return (
      <div className="space-y-1">
        {label && (
          <div className="flex justify-between text-xs">
            <span>{label}</span>
            <span>{value}%</span>
          </div>
        )}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full bg-${color}-500`} 
            style={{ width: `${value}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    );
  };
  
  // Function to render a simple line chart
  const renderLineChart = (data, labels, height = 100, color = 'blue') => {
    const max = Math.max(...data) * 1.1;
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value / max) * 100);
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <div className="relative" style={{ height: `${height}px` }}>
        <svg width="100%" height="100%" className="overflow-visible">
          <polyline
            points={points}
            fill="none"
            stroke={`var(--${color}-500)`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((value / max) * 100);
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="3"
                fill={`var(--${color}-500)`}
              />
            );
          })}
        </svg>
        <div className="flex justify-between mt-2">
          {labels.map((label, index) => (
            <div key={index} className="text-xs text-gray-500 dark:text-gray-400">
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Function to render a simple bar chart
  const renderBarChart = (data, labels, height = 150, color = 'blue') => {
    const max = Math.max(...data) * 1.1;
    const barWidth = 100 / data.length - 10;
    
    return (
      <div className="relative" style={{ height: `${height}px` }}>
        <div className="flex justify-between items-end h-full">
          {data.map((value, index) => {
            const barHeight = (value / max) * 100;
            return (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className={`bg-${color}-500 rounded-t-sm w-full`} 
                  style={{ 
                    height: `${barHeight}%`,
                    width: `${barWidth}%`,
                    marginLeft: `${5}%`,
                    marginRight: `${5}%`
                  }}
                ></div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {labels[index]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Function to render a simple pie chart
  const renderPieChart = (data, labels, colors, size = 150) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    let startAngle = 0;
    
    return (
      <div className="flex items-center justify-center">
        <div style={{ width: `${size}px`, height: `${size}px` }} className="relative">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            {Object.entries(data).map(([key, value], index) => {
              const percentage = (value / total) * 100;
              const angle = (percentage / 100) * 360;
              const endAngle = startAngle + angle;
              
              // Calculate the SVG arc path
              const x1 = 50 + 50 * Math.cos((startAngle - 90) * (Math.PI / 180));
              const y1 = 50 + 50 * Math.sin((startAngle - 90) * (Math.PI / 180));
              const x2 = 50 + 50 * Math.cos((endAngle - 90) * (Math.PI / 180));
              const y2 = 50 + 50 * Math.sin((endAngle - 90) * (Math.PI / 180));
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');
              
              const result = (
                <path
                  key={key}
                  d={pathData}
                  fill={`var(--${colors[index]}-500)`}
                />
              );
              
              startAngle = endAngle;
              return result;
            })}
          </svg>
        </div>
        <div className="ml-4">
          {Object.entries(data).map(([key, value], index) => {
            const percentage = Math.round((value / total) * 100);
            return (
              <div key={key} className="flex items-center mb-1">
                <div className={`w-3 h-3 rounded-full bg-${colors[index]}-500 mr-2`}></div>
                <span className="text-xs">
                  {labels[index]} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-lg shadow-md ${isRtl ? 'rtl' : 'ltr'}`}>
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
                {t('analytics_dashboard', TranslationNamespace.PARENT_TEACHER, { default: 'Analytics Dashboard' })}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {parentData.children[0].name} • {parentData.children[0].yearGroup} • {parentData.children[0].school}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="term">{t('current_term', TranslationNamespace.PARENT_TEACHER, { default: 'Current Term' })}</option>
              <option value="year">{t('academic_year', TranslationNamespace.PARENT_TEACHER, { default: 'Academic Year' })}</option>
              <option value="all">{t('all_time', TranslationNamespace.PARENT_TEACHER, { default: 'All Time' })}</option>
            </select>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              {t('export_report', TranslationNamespace.PARENT_TEACHER, { default: 'Export Report' })}
            </Button>
          </div>
        </div>
      </div>
      
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
              <Activity className="h-4 w-4 mr-2" />
              <span>{t('progress_overview', TranslationNamespace.PARENT_TEACHER, { default: 'Progress Overview' })}</span>
            </div>
          </button>
          
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
              <span>{t('curriculum_coverage', TranslationNamespace.PARENT_TEACHER, { default: 'Curriculum Coverage' })}</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('learning')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'learning'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>{t('learning_patterns', TranslationNamespace.PARENT_TEACHER, { default: 'Learning Patterns' })}</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('engagement')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'engagement'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span>{t('engagement_metrics', TranslationNamespace.PARENT_TEACHER, { default: 'Engagement Metrics' })}</span>
            </div>
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('progress_trends', TranslationNamespace.PARENT_TEACHER, { default: 'Progress Trends' })}
              </h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('overall_progress', TranslationNamespace.PARENT_TEACHER, { default: 'Overall Progress' })}
                    </h4>
                    {renderLineChart(
                      analyticsData.progressTrends.overall, 
                      analyticsData.timeLabels, 
                      150, 
                      'blue'
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('mathematics', TranslationNamespace.PARENT_TEACHER, { default: 'Mathematics' })}
                      </h4>
                      {renderLineChart(
                        analyticsData.progressTrends.mathematics, 
                        analyticsData.timeLabels, 
                        100, 
                        'green'
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('english', TranslationNamespace.PARENT_TEACHER, { default: 'English' })}
                      </h4>
                      {renderLineChart(
                        analyticsData.progressTrends.english, 
                        analyticsData.timeLabels, 
                        100, 
                        'purple'
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('science', TranslationNamespace.PARENT_TEACHER, { default: 'Science' })}
                      </h4>
                      {renderLineChart(
                        analyticsData.progressTrends.science, 
                        analyticsData.timeLabels, 
                        100, 
                        'amber'
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('comparison_with_peers', TranslationNamespace.PARENT_TEACHER, { default: 'Comparison with Peers' })}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">
                      {t('class_comparison', TranslationNamespace.PARENT_TEACHER, { default: 'Class Comparison' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{t('mathematics', TranslationNamespace.PARENT_TEACHER, { default: 'Mathematics' })}</span>
                          <span>{analyticsData.progressTrends.mathematics[5]}% vs {analyticsData.comparisons.classAverage.mathematics}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                          <div 
                            className="h-2 rounded-full bg-green-500" 
                            style={{ width: `${analyticsData.progressTrends.mathematics[5]}%` }}
                          ></div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                          <div 
                            className="h-1 rounded-full bg-gray-400" 
                            style={{ width: `${analyticsData.comparisons.classAverage.mathematics}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{t('english', TranslationNamespace.PARENT_TEACHER, { default: 'English' })}</span>
                          <span>{analyticsData.progressTrends.english[5]}% vs {analyticsData.comparisons.classAverage.english}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                          <div 
                            className="h-2 rounded-full bg-purple-500" 
                            style={{ width: `${analyticsData.progressTrends.english[5]}%` }}
                          ></div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                          <div 
                            className="h-1 rounded-full bg-gray-400" 
                            style={{ width: `${analyticsData.comparisons.classAverage.english}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{t('science', TranslationNamespace.PARENT_TEACHER, { default: 'Science' })}</span>
                          <span>{analyticsData.progressTrends.science[5]}% vs {analyticsData.comparisons.classAverage.science}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                          <div 
                            className="h-2 rounded-full bg-amber-500" 
                            style={{ width: `${analyticsData.progressTrends.science[5]}%` }}
                          ></div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                          <div 
                            className="h-1 rounded-full bg-gray-400" 
                            style={{ width: `${analyticsData.comparisons.classAverage.science}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center mr-4">
                        <div className="w-3 h-2 bg-primary mr-1"></div>
                        <span>{parentData.children[0].name}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-1 bg-gray-400 mr-1"></div>
                        <span>{t('class_average', TranslationNamespace.PARENT_TEACHER, { default: 'Class Average' })}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">
                      {t('year_group_comparison', TranslationNamespace.PARENT_TEACHER, { default: 'Year Group Comparison' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{t('mathematics', TranslationNamespace.PARENT_TEACHER, { default: 'Mathematics' })}</span>
                          <span>{analyticsData.progressTrends.mathematics[5]}% vs {analyticsData.comparisons.yearGroupAverage.mathematics}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                          <div 
                            className="h-2 rounded-full bg-green-500" 
                            style={{ width: `${analyticsData.progressTrends.mathematics[5]}%` }}
                          ></div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                          <div 
                            className="h-1 rounded-full bg-gray-400" 
                            style={{ width: `${analyticsData.comparisons.yearGroupAverage.mathematics}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{t('english', TranslationNamespace.PARENT_TEACHER, { default: 'English' })}</span>
                          <span>{analyticsData.progressTrends.english[5]}% vs {analyticsData.comparisons.yearGroupAverage.english}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                          <div 
                            className="h-2 rounded-full bg-purple-500" 
                            style={{ width: `${analyticsData.progressTrends.english[5]}%` }}
                          ></div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                          <div 
                            className="h-1 rounded-full bg-gray-400" 
                            style={{ width: `${analyticsData.comparisons.yearGroupAverage.english}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{t('science', TranslationNamespace.PARENT_TEACHER, { default: 'Science' })}</span>
                          <span>{analyticsData.progressTrends.science[5]}% vs {analyticsData.comparisons.yearGroupAverage.science}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                          <div 
                            className="h-2 rounded-full bg-amber-500" 
                            style={{ width: `${analyticsData.progressTrends.science[5]}%` }}
                          ></div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                          <div 
                            className="h-1 rounded-full bg-gray-400" 
                            style={{ width: `${analyticsData.comparisons.yearGroupAverage.science}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center mr-4">
                        <div className="w-3 h-2 bg-primary mr-1"></div>
                        <span>{parentData.children[0].name}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-1 bg-gray-400 mr-1"></div>
                        <span>{t('year_average', TranslationNamespace.PARENT_TEACHER, { default: 'Year Average' })}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
        
        {/* Curriculum Coverage Tab */}
        {activeTab === 'curriculum' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('curriculum_coverage', TranslationNamespace.PARENT_TEACHER, { default: 'Curriculum Coverage' })}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">
                      {t('mathematics', TranslationNamespace.PARENT_TEACHER, { default: 'Mathematics' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {renderProgressBar(
                        analyticsData.curriculumCoverage.mathematics.covered,
                        'blue',
                        t('covered', TranslationNamespace.PARENT_TEACHER, { default: 'Covered' })
                      )}
                      {renderProgressBar(
                        analyticsData.curriculumCoverage.mathematics.mastered,
                        'green',
                        t('mastered', TranslationNamespace.PARENT_TEACHER, { default: 'Mastered' })
                      )}
                      {renderProgressBar(
                        analyticsData.curriculumCoverage.mathematics.struggling,
                        'amber',
                        t('needs_support', TranslationNamespace.PARENT_TEACHER, { default: 'Needs Support' })
                      )}
                      {renderProgressBar(
                        analyticsData.curriculumCoverage.mathematics.notStarted,
                        'gray',
                        t('not_started', TranslationNamespace.PARENT_TEACHER, { default: 'Not Started' })
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">
                      {t('english', TranslationNamespace.PARENT_TEACHER, { default: 'English' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {renderProgressBar(
                        analyticsData.curriculumCoverage.english.covered,
                        'blue',
                        t('covered', TranslationNamespace.PARENT_TEACHER, { default: 'Covered' })
                      )}
                      {renderProgressBar(
                        analyticsData.curriculumCoverage.english.mastered,
                        'green',
                        t('mastered', TranslationNamespace.PARENT_TEACHER, { default: 'Mastered' })
                      )}
                      {renderProgressBar(
                        analyticsData.curriculumCoverage.english.struggling,
                        'amber',
                        t('needs_support', TranslationNamespace.PARENT_TEACHER, { default: 'Needs Support' })
                      )}
                      {renderProgressBar(
                        analyticsData.curriculumCoverage.english.notStarted,
                        'gray',
                        t('not_started', TranslationNamespace.PARENT_TEACHER, { default: 'Not Started' })
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">
                      {t('science', TranslationNamespace.PARENT_TEACHER, { default: 'Science' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {renderProgressBar(
                        analyticsData.curriculumCoverage.science.covered,
                        'blue',
                        t('covered', TranslationNamespace.PARENT_TEACHER, { default: 'Covered' })
                      )}
                      {renderProgressBar(
                        analyticsData.curriculumCoverage.science.mastered,
                        'green',
                        t('mastered', TranslationNamespace.PARENT_TEACHER, { default: 'Mastered' })
                      )}
                      {renderProgressBar(
                        analyticsData.curriculumCoverage.science.struggling,
                        'amber',
                        t('needs_support', TranslationNamespace.PARENT_TEACHER, { default: 'Needs Support' })
                      )}
                      {renderProgressBar(
                        analyticsData.curriculumCoverage.science.notStarted,
                        'gray',
                        t('not_started', TranslationNamespace.PARENT_TEACHER, { default: 'Not Started' })
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('key_areas_for_focus', TranslationNamespace.PARENT_TEACHER, { default: 'Key Areas for Focus' })}
              </h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="p-3 border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 rounded-md">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {t('mathematics', TranslationNamespace.PARENT_TEACHER, { default: 'Mathematics' })}: {t('fractions', TranslationNamespace.PARENT_TEACHER, { default: 'Fractions' })}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('fractions_description', TranslationNamespace.PARENT_TEACHER, { default: 'Alex is finding it challenging to add and subtract fractions with different denominators. Additional practice with equivalent fractions would be beneficial.' })}
                      </p>
                    </div>
                    
                    <div className="p-3 border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 rounded-md">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {t('english', TranslationNamespace.PARENT_TEACHER, { default: 'English' })}: {t('writing_structure', TranslationNamespace.PARENT_TEACHER, { default: 'Writing Structure' })}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('writing_structure_description', TranslationNamespace.PARENT_TEACHER, { default: 'Alex would benefit from more practice in organizing ideas in written work. Focus on paragraph structure and using connecting words to link ideas.' })}
                      </p>
                    </div>
                    
                    <div className="p-3 border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 rounded-md">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {t('science', TranslationNamespace.PARENT_TEACHER, { default: 'Science' })}: {t('scientific_inquiry', TranslationNamespace.PARENT_TEACHER, { default: 'Scientific Inquiry' })}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('scientific_inquiry_description', TranslationNamespace.PARENT_TEACHER, { default: 'Alex shows strong skills in scientific inquiry and asking thoughtful questions. Encourage this strength by exploring science topics at home through simple experiments.' })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* Learning Patterns Tab */}
        {activeTab === 'learning' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('learning_style_preferences', TranslationNamespace.PARENT_TEACHER, { default: 'Learning Style Preferences' })}
              </h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      {renderPieChart(
                        analyticsData.learningStyles,
                        [
                          t('visual', TranslationNamespace.PARENT_TEACHER, { default: 'Visual' }),
                          t('auditory', TranslationNamespace.PARENT_TEACHER, { default: 'Auditory' }),
                          t('kinesthetic', TranslationNamespace.PARENT_TEACHER, { default: 'Kinesthetic' }),
                          t('reading_writing', TranslationNamespace.PARENT_TEACHER, { default: 'Reading/Writing' })
                        ],
                        ['blue', 'purple', 'green', 'amber'],
                        180
                      )}
                    </div>
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                        {t('learning_style_insights', TranslationNamespace.PARENT_TEACHER, { default: 'Learning Style Insights' })}
                      </h4>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t('primary_learning_style', TranslationNamespace.PARENT_TEACHER, { default: 'Primary Learning Style' })}: <span className="font-medium">{t('visual', TranslationNamespace.PARENT_TEACHER, { default: 'Visual' })}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t('visual_learner_description', TranslationNamespace.PARENT_TEACHER, { default: 'Alex learns best through visual materials such as diagrams, charts, and videos. Visual learners benefit from color-coding information, using mind maps, and watching educational videos.' })}
                        </p>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {t('supporting_tips', TranslationNamespace.PARENT_TEACHER, { default: 'Supporting Tips' })}:
                          </h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                            <li>{t('use_diagrams', TranslationNamespace.PARENT_TEACHER, { default: 'Use diagrams and illustrations when explaining concepts' })}</li>
                            <li>{t('color_code', TranslationNamespace.PARENT_TEACHER, { default: 'Color-code notes and learning materials' })}</li>
                            <li>{t('educational_videos', TranslationNamespace.PARENT_TEACHER, { default: 'Supplement learning with educational videos' })}</li>
                            <li>{t('mind_maps', TranslationNamespace.PARENT_TEACHER, { default: 'Create mind maps to organize information' })}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('subject_specific_patterns', TranslationNamespace.PARENT_TEACHER, { default: 'Subject-Specific Learning Patterns' })}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">
                      {t('mathematics', TranslationNamespace.PARENT_TEACHER, { default: 'Mathematics' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{t('problem_solving', TranslationNamespace.PARENT_TEACHER, { default: 'Problem Solving' })}</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {t('strength', TranslationNamespace.PARENT_TEACHER, { default: 'Strength' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{t('mental_arithmetic', TranslationNamespace.PARENT_TEACHER, { default: 'Mental Arithmetic' })}</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {t('strength', TranslationNamespace.PARENT_TEACHER, { default: 'Strength' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{t('fractions', TranslationNamespace.PARENT_TEACHER, { default: 'Fractions' })}</span>
                        <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                          {t('developing', TranslationNamespace.PARENT_TEACHER, { default: 'Developing' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{t('geometry', TranslationNamespace.PARENT_TEACHER, { default: 'Geometry' })}</span>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {t('proficient', TranslationNamespace.PARENT_TEACHER, { default: 'Proficient' })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">
                      {t('english', TranslationNamespace.PARENT_TEACHER, { default: 'English' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{t('reading', TranslationNamespace.PARENT_TEACHER, { default: 'Reading' })}</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {t('strength', TranslationNamespace.PARENT_TEACHER, { default: 'Strength' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{t('vocabulary', TranslationNamespace.PARENT_TEACHER, { default: 'Vocabulary' })}</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {t('strength', TranslationNamespace.PARENT_TEACHER, { default: 'Strength' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{t('writing', TranslationNamespace.PARENT_TEACHER, { default: 'Writing' })}</span>
                        <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                          {t('developing', TranslationNamespace.PARENT_TEACHER, { default: 'Developing' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{t('grammar', TranslationNamespace.PARENT_TEACHER, { default: 'Grammar' })}</span>
                        <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                          {t('developing', TranslationNamespace.PARENT_TEACHER, { default: 'Developing' })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">
                      {t('science', TranslationNamespace.PARENT_TEACHER, { default: 'Science' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{t('scientific_inquiry', TranslationNamespace.PARENT_TEACHER, { default: 'Scientific Inquiry' })}</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {t('strength', TranslationNamespace.PARENT_TEACHER, { default: 'Strength' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{t('biology', TranslationNamespace.PARENT_TEACHER, { default: 'Biology' })}</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {t('strength', TranslationNamespace.PARENT_TEACHER, { default: 'Strength' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{t('data_recording', TranslationNamespace.PARENT_TEACHER, { default: 'Data Recording' })}</span>
                        <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                          {t('developing', TranslationNamespace.PARENT_TEACHER, { default: 'Developing' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{t('physics', TranslationNamespace.PARENT_TEACHER, { default: 'Physics' })}</span>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {t('proficient', TranslationNamespace.PARENT_TEACHER, { default: 'Proficient' })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
        
        {/* Engagement Metrics Tab */}
        {activeTab === 'engagement' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('engagement_over_time', TranslationNamespace.PARENT_TEACHER, { default: 'Engagement Over Time' })}
              </h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('time_spent_learning', TranslationNamespace.PARENT_TEACHER, { default: 'Time Spent Learning (minutes per day)' })}
                    </h4>
                    {renderBarChart(
                      analyticsData.engagementMetrics.timeSpent, 
                      analyticsData.timeLabels, 
                      150, 
                      'blue'
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('resources_accessed', TranslationNamespace.PARENT_TEACHER, { default: 'Resources Accessed' })}
                      </h4>
                      {renderLineChart(
                        analyticsData.engagementMetrics.resourcesAccessed, 
                        analyticsData.timeLabels, 
                        100, 
                        'purple'
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('completion_rates', TranslationNamespace.PARENT_TEACHER, { default: 'Assignment Completion Rates (%)' })}
                      </h4>
                      {renderLineChart(
                        analyticsData.engagementMetrics.completionRates, 
                        analyticsData.timeLabels, 
                        100, 
                        'green'
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('engagement_insights', TranslationNamespace.PARENT_TEACHER, { default: 'Engagement Insights' })}
              </h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="p-3 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 rounded-md">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {t('peak_learning_times', TranslationNamespace.PARENT_TEACHER, { default: 'Peak Learning Times' })}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('peak_learning_times_description', TranslationNamespace.PARENT_TEACHER, { default: 'Alex tends to be most engaged and productive in the morning hours (9-11 AM) and early afternoon (2-3 PM). Consider scheduling more challenging activities during these times.' })}
                      </p>
                    </div>
                    
                    <div className="p-3 border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 rounded-md">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {t('preferred_content_types', TranslationNamespace.PARENT_TEACHER, { default: 'Preferred Content Types' })}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('preferred_content_types_description', TranslationNamespace.PARENT_TEACHER, { default: 'Alex engages most with interactive simulations and video content. Text-heavy resources show lower engagement levels. Consider using more visual and interactive learning materials.' })}
                      </p>
                    </div>
                    
                    <div className="p-3 border border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800 rounded-md">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {t('motivation_patterns', TranslationNamespace.PARENT_TEACHER, { default: 'Motivation Patterns' })}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('motivation_patterns_description', TranslationNamespace.PARENT_TEACHER, { default: 'Alex shows increased motivation when learning about topics related to nature, animals, and space. Incorporating these interests into learning activities may boost engagement in challenging subjects.' })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
