'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, subDays, subMonths, subYears, addDays } from 'date-fns';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, RadarChart, 
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart, Treemap
} from 'recharts';
import {
  Calendar as CalendarIcon, ChevronDown, Info, HelpCircle, Download, Share2,
  BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon, Activity,
  TrendingUp, Target, Award, Star, Zap, Clock, RefreshCw, Filter
} from 'lucide-react';

import { 
  ProgressTrackingRecord, 
  ProficiencyLevel,
  KnowledgeArea,
  Skill,
  DiagnosticResult
} from '@/lib/assessment/diagnosticAssessmentTypes';
import { UKKeyStage, UKSubject } from '@/lib/assessment/types';

interface ProgressTrackingVisualizationProps {
  studentId: string;
  progressRecords: ProgressTrackingRecord[];
  knowledgeAreas: KnowledgeArea[];
  skills: Skill[];
  diagnosticResults: DiagnosticResult[];
  className?: string;
}

// Helper function to get color for proficiency level
const getProficiencyLevelColor = (level: ProficiencyLevel): string => {
  switch (level) {
    case ProficiencyLevel.MASTERY:
      return '#10b981'; // emerald-500
    case ProficiencyLevel.EXCEEDING:
      return '#22c55e'; // green-500
    case ProficiencyLevel.MEETING:
      return '#3b82f6'; // blue-500
    case ProficiencyLevel.APPROACHING:
      return '#f59e0b'; // amber-500
    case ProficiencyLevel.DEVELOPING:
      return '#f97316'; // orange-500
    case ProficiencyLevel.NEEDS_SUPPORT:
      return '#ef4444'; // red-500
    default:
      return '#6b7280'; // gray-500
  }
};

// Helper function to get proficiency level label
const getProficiencyLevelLabel = (level: ProficiencyLevel): string => {
  switch (level) {
    case ProficiencyLevel.MASTERY:
      return 'Mastery';
    case ProficiencyLevel.EXCEEDING:
      return 'Exceeding';
    case ProficiencyLevel.MEETING:
      return 'Meeting';
    case ProficiencyLevel.APPROACHING:
      return 'Approaching';
    case ProficiencyLevel.DEVELOPING:
      return 'Developing';
    case ProficiencyLevel.NEEDS_SUPPORT:
      return 'Needs Support';
    default:
      return 'Unknown';
  }
};

// Helper function to get trend icon
const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'improving':
      return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    case 'stable':
      return <Activity className="h-4 w-4 text-blue-500" />;
    case 'declining':
      return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
    case 'fluctuating':
      return <Activity className="h-4 w-4 text-amber-500" />;
    default:
      return <Info className="h-4 w-4 text-gray-500" />;
  }
};

export function ProgressTrackingVisualization({
  studentId,
  progressRecords,
  knowledgeAreas,
  skills,
  diagnosticResults,
  className = ''
}: ProgressTrackingVisualizationProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedKeyStage, setSelectedKeyStage] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('6months');
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subMonths(new Date(), 6),
    to: new Date()
  });

  // Update date range when time range changes
  useEffect(() => {
    const now = new Date();
    switch (selectedTimeRange) {
      case '1month':
        setDateRange({ from: subMonths(now, 1), to: now });
        break;
      case '3months':
        setDateRange({ from: subMonths(now, 3), to: now });
        break;
      case '6months':
        setDateRange({ from: subMonths(now, 6), to: now });
        break;
      case '1year':
        setDateRange({ from: subYears(now, 1), to: now });
        break;
      case 'custom':
        // Don't change the date range for custom
        break;
    }
  }, [selectedTimeRange]);

  // Filter progress records based on selected filters
  const filteredProgressRecords = progressRecords.filter(record => {
    // Filter by subject
    if (selectedSubject !== 'all') {
      const ka = knowledgeAreas.find(ka => ka.id === record.knowledgeAreaId);
      if (ka && ka.subject !== selectedSubject) {
        return false;
      }
    }

    // Filter by key stage
    if (selectedKeyStage !== 'all') {
      const ka = knowledgeAreas.find(ka => ka.id === record.knowledgeAreaId);
      if (ka && ka.keyStage !== selectedKeyStage) {
        return false;
      }
    }

    // Filter by date range
    const latestAssessment = record.assessmentResults
      .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
    
    if (latestAssessment && (
      latestAssessment.date < dateRange.from || 
      latestAssessment.date > dateRange.to
    )) {
      return false;
    }

    return true;
  });

  // Group progress records by subject
  const progressBySubject = new Map<string, ProgressTrackingRecord[]>();
  
  filteredProgressRecords.forEach(record => {
    const ka = knowledgeAreas.find(ka => ka.id === record.knowledgeAreaId);
    if (ka) {
      const subject = ka.subject;
      if (!progressBySubject.has(subject)) {
        progressBySubject.set(subject, []);
      }
      progressBySubject.get(subject)!.push(record);
    }
  });

  // Prepare data for overall proficiency distribution chart
  const proficiencyDistributionData = Object.values(ProficiencyLevel).map(level => {
    const count = filteredProgressRecords.filter(
      record => record.currentProficiencyLevel === level
    ).length;
    
    return {
      name: getProficiencyLevelLabel(level),
      value: count,
      color: getProficiencyLevelColor(level)
    };
  }).filter(item => item.value > 0);

  // Prepare data for progress over time chart
  const progressOverTimeData: {
    date: Date;
    [key: string]: any;
  }[] = [];

  // Get all unique assessment dates
  const allDates = new Set<string>();
  filteredProgressRecords.forEach(record => {
    record.assessmentResults.forEach(result => {
      allDates.add(result.date.toISOString().split('T')[0]);
    });
  });

  // Sort dates
  const sortedDates = Array.from(allDates).sort();

  // Create data points for each date
  sortedDates.forEach(dateStr => {
    const date = new Date(dateStr);
    const dataPoint: any = { date };
    
    // Calculate average score for each subject on this date
    progressBySubject.forEach((records, subject) => {
      let totalScore = 0;
      let count = 0;
      
      records.forEach(record => {
        const result = record.assessmentResults.find(
          r => r.date.toISOString().split('T')[0] === dateStr
        );
        
        if (result) {
          totalScore += result.score;
          count++;
        }
      });
      
      if (count > 0) {
        dataPoint[subject] = totalScore / count;
      }
    });
    
    progressOverTimeData.push(dataPoint);
  });

  // Prepare data for radar chart
  const subjectAverages = Array.from(progressBySubject.entries()).map(([subject, records]) => {
    let totalScore = 0;
    let count = 0;
    
    records.forEach(record => {
      const latestResult = record.assessmentResults
        .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
      
      if (latestResult) {
        totalScore += latestResult.score;
        count++;
      }
    });
    
    return {
      subject,
      score: count > 0 ? totalScore / count : 0,
      fullMark: 100
    };
  });

  // Prepare data for knowledge area heatmap
  const knowledgeAreaData = filteredProgressRecords
    .filter(record => record.knowledgeAreaId)
    .map(record => {
      const ka = knowledgeAreas.find(ka => ka.id === record.knowledgeAreaId);
      return {
        name: ka ? ka.name : record.knowledgeAreaId,
        subject: ka ? ka.subject : 'Unknown',
        score: record.assessmentResults.length > 0 
          ? record.assessmentResults.sort((a, b) => b.date.getTime() - a.date.getTime())[0].score 
          : 0,
        proficiencyLevel: record.currentProficiencyLevel,
        trend: record.progressTrend,
        growthRate: record.growthRate
      };
    })
    .sort((a, b) => b.score - a.score);

  // Prepare data for skill radar chart
  const skillData = filteredProgressRecords
    .filter(record => record.skillId)
    .map(record => {
      const skill = skills.find(s => s.id === record.skillId);
      return {
        name: skill ? skill.name : record.skillId,
        category: skill ? skill.category : 'Unknown',
        score: record.assessmentResults.length > 0 
          ? record.assessmentResults.sort((a, b) => b.date.getTime() - a.date.getTime())[0].score 
          : 0,
        proficiencyLevel: record.currentProficiencyLevel
      };
    });

  const skillRadarData = skillData.map(skill => ({
    skill: skill.name,
    score: skill.score,
    fullMark: 100
  }));

  // Prepare data for next steps and recommendations
  const nextStepsData = diagnosticResults
    .sort((a, b) => b.endTime.getTime() - a.endTime.getTime())
    .slice(0, 3)
    .flatMap(result => result.nextSteps.map(step => ({
      step,
      assessmentId: result.id,
      date: result.endTime
    })));

  const recommendationsData = diagnosticResults
    .sort((a, b) => b.endTime.getTime() - a.endTime.getTime())
    .slice(0, 3)
    .flatMap(result => result.recommendations.map(rec => ({
      title: rec.title,
      description: rec.description,
      priority: rec.priority,
      type: rec.type,
      assessmentId: result.id,
      date: result.endTime
    })));

  // Render the overview tab
  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredProgressRecords.length > 0 
                ? `${Math.round(filteredProgressRecords.reduce((sum, record) => 
                    sum + (record.assessmentResults.length > 0 
                      ? record.assessmentResults.sort((a, b) => b.date.getTime() - a.date.getTime())[0].score 
                      : 0), 0) / filteredProgressRecords.length)}%`
                : 'No data'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average across all subjects
            </p>
            <div className="mt-4 h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressOverTimeData}>
                  <Line 
                    type="monotone" 
                    dataKey={Array.from(progressBySubject.keys())[0] || 'value'} 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                  <YAxis domain={[0, 100]} hide />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Proficiency Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={proficiencyDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {proficiencyDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value} areas`, 'Count']}
                    labelFormatter={() => ''}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {proficiencyDistributionData.map((entry, index) => (
                <div key={index} className="flex items-center text-xs">
                  <div 
                    className="w-3 h-3 rounded-full mr-1" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Learning Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-emerald-500 mr-2" />
                  <span className="text-sm">Improving</span>
                </div>
                <span className="font-medium">
                  {filteredProgressRecords.filter(r => r.progressTrend === 'improving').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm">Stable</span>
                </div>
                <span className="font-medium">
                  {filteredProgressRecords.filter(r => r.progressTrend === 'stable').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180 mr-2" />
                  <span className="text-sm">Declining</span>
                </div>
                <span className="font-medium">
                  {filteredProgressRecords.filter(r => r.progressTrend === 'declining').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 text-amber-500 mr-2" />
                  <span className="text-sm">Fluctuating</span>
                </div>
                <span className="font-medium">
                  {filteredProgressRecords.filter(r => r.progressTrend === 'fluctuating').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress Over Time</CardTitle>
          <CardDescription>
            Track progress across different subjects over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'dd/MM/yy')}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  labelFormatter={(date) => format(new Date(date), 'dd MMM yyyy')}
                  formatter={(value: any) => [`${Math.round(value)}%`, 'Score']}
                />
                <Legend />
                {Array.from(progressBySubject.keys()).map((subject, index) => (
                  <Line
                    key={subject}
                    type="monotone"
                    dataKey={subject}
                    name={subject}
                    stroke={[
                      '#3b82f6', // blue
                      '#ef4444', // red
                      '#10b981', // emerald
                      '#f59e0b', // amber
                      '#8b5cf6', // violet
                      '#ec4899', // pink
                      '#06b6d4', // cyan
                    ][index % 7]}
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
            <CardDescription>
              Current proficiency levels across subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={subjectAverages}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Tooltip formatter={(value: any) => `${Math.round(value)}%`} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps & Recommendations</CardTitle>
            <CardDescription>
              Based on recent assessment results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nextStepsData.length > 0 ? (
                <div>
                  <h4 className="font-medium mb-2">Next Steps</h4>
                  <ul className="space-y-2">
                    {nextStepsData.slice(0, 3).map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-2 mt-0.5">
                          <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs text-blue-700 font-medium">{index + 1}</span>
                          </div>
                        </div>
                        <span className="text-sm">{item.step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No next steps available</p>
              )}

              {recommendationsData.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="space-y-3">
                    {recommendationsData.slice(0, 3).map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-2 mt-0.5">
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center
                            ${item.priority === 'high' ? 'bg-red-100' : 
                              item.priority === 'medium' ? 'bg-amber-100' : 'bg-green-100'}`}>
                            <span className={`text-xs font-medium
                              ${item.priority === 'high' ? 'text-red-700' : 
                                item.priority === 'medium' ? 'text-amber-700' : 'text-green-700'}`}>
                              {item.type.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Render the knowledge areas tab
  const renderKnowledgeAreasTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Area Proficiency</CardTitle>
          <CardDescription>
            Current proficiency levels across knowledge areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={knowledgeAreaData.slice(0, 10)}
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value: any) => `${Math.round(value)}%`} />
                <Legend />
                <Bar 
                  dataKey="score" 
                  name="Proficiency Score"
                  background={{ fill: '#f3f4f6' }}
                >
                  {knowledgeAreaData.slice(0, 10).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getProficiencyLevelColor(entry.proficiencyLevel)} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Growth Rates</CardTitle>
            <CardDescription>
              Improvement rates for knowledge areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="score" 
                    name="Score" 
                    domain={[0, 100]}
                    label={{ value: 'Current Score (%)', position: 'bottom', offset: 0 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="growthRate" 
                    name="Growth Rate" 
                    domain={[-20, 20]}
                    label={{ value: 'Growth Rate (%)', angle: -90, position: 'left' }}
                  />
                  <Tooltip 
                    formatter={(value: any, name: any) => [
                      name === 'Score' ? `${Math.round(value)}%` : `${value > 0 ? '+' : ''}${value}%`,
                      name
                    ]}
                    labelFormatter={(index) => knowledgeAreaData[index]?.name || ''}
                  />
                  <Scatter 
                    name="Knowledge Areas" 
                    data={knowledgeAreaData} 
                    fill="#3b82f6"
                  >
                    {knowledgeAreaData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getProficiencyLevelColor(entry.proficiencyLevel)} 
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Knowledge Area Details</CardTitle>
            <CardDescription>
              Detailed view of knowledge area proficiency
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-y-auto">
            <div className="space-y-4">
              {knowledgeAreaData.map((area, index) => (
                <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{area.name}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{area.subject}</span>
                        <span className="mx-2">•</span>
                        <div className="flex items-center">
                          {getTrendIcon(area.trend)}
                          <span className="ml-1">
                            {area.growthRate > 0 ? `+${area.growthRate}%` : `${area.growthRate}%`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      style={{ backgroundColor: getProficiencyLevelColor(area.proficiencyLevel) }}
                      className="text-white"
                    >
                      {getProficiencyLevelLabel(area.proficiencyLevel)}
                    </Badge>
                  </div>
                  <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${area.score}%`, 
                        backgroundColor: getProficiencyLevelColor(area.proficiencyLevel) 
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs">
                    <span>0%</span>
                    <span>{Math.round(area.score)}%</span>
                    <span>100%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Render the skills tab
  const renderSkillsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Skill Proficiency</CardTitle>
          <CardDescription>
            Current proficiency levels across skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={150} data={skillRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Tooltip formatter={(value: any) => `${Math.round(value)}%`} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['cognitive', 'social', 'emotional', 'physical', 'technical'].map(category => {
          const categorySkills = skillData.filter(skill => skill.category === category);
          if (categorySkills.length === 0) return null;
          
          return (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="capitalize">{category} Skills</CardTitle>
                <CardDescription>
                  {categorySkills.length} skills in this category
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[250px] overflow-y-auto">
                <div className="space-y-4">
                  {categorySkills.map((skill, index) => (
                    <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{skill.name}</h4>
                        <Badge 
                          style={{ backgroundColor: getProficiencyLevelColor(skill.proficiencyLevel) }}
                          className="text-white"
                        >
                          {getProficiencyLevelLabel(skill.proficiencyLevel)}
                        </Badge>
                      </div>
                      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${skill.score}%`, 
                            backgroundColor: getProficiencyLevelColor(skill.proficiencyLevel) 
                          }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-xs">
                        <span>0%</span>
                        <span>{Math.round(skill.score)}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // Render the spaced repetition tab
  const renderSpacedRepetitionTab = () => {
    // Get upcoming repetition dates
    const today = new Date();
    const upcomingDates = new Map<string, {
      date: Date;
      knowledgeAreas: {
        id: string;
        name: string;
        subject: string;
        proficiencyLevel: ProficiencyLevel;
      }[];
    }>();
    
    // Simulate spaced repetition schedule
    filteredProgressRecords.forEach(record => {
      if (record.knowledgeAreaId) {
        const ka = knowledgeAreas.find(ka => ka.id === record.knowledgeAreaId);
        if (!ka) return;
        
        // Only schedule repetition for areas that need improvement
        if (
          record.currentProficiencyLevel !== ProficiencyLevel.MASTERY && 
          record.currentProficiencyLevel !== ProficiencyLevel.EXCEEDING
        ) {
          // Generate spaced repetition dates based on proficiency level
          let nextDate: Date;
          
          switch (record.currentProficiencyLevel) {
            case ProficiencyLevel.NEEDS_SUPPORT:
              nextDate = addDays(today, 2); // Very frequent review
              break;
            case ProficiencyLevel.DEVELOPING:
              nextDate = addDays(today, 4); // Frequent review
              break;
            case ProficiencyLevel.APPROACHING:
              nextDate = addDays(today, 7); // Weekly review
              break;
            case ProficiencyLevel.MEETING:
              nextDate = addDays(today, 14); // Bi-weekly review
              break;
            default:
              nextDate = addDays(today, 30); // Monthly review
          }
          
          const dateStr = nextDate.toISOString().split('T')[0];
          
          if (!upcomingDates.has(dateStr)) {
            upcomingDates.set(dateStr, {
              date: nextDate,
              knowledgeAreas: []
            });
          }
          
          upcomingDates.get(dateStr)!.knowledgeAreas.push({
            id: ka.id,
            name: ka.name,
            subject: ka.subject,
            proficiencyLevel: record.currentProficiencyLevel
          });
        }
      }
    });
    
    // Sort dates
    const sortedDates = Array.from(upcomingDates.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Spaced Repetition Schedule</CardTitle>
            <CardDescription>
              Optimized review schedule based on learning science
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sortedDates.length > 0 ? (
                sortedDates.slice(0, 5).map((item, index) => (
                  <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center mb-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <CalendarIcon className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {format(item.date, 'EEEE, d MMMM yyyy')}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {item.knowledgeAreas.length} knowledge areas to review
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">
                        Schedule
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {item.knowledgeAreas.map((ka, kaIndex) => (
                        <div key={kaIndex} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div 
                              className="h-3 w-3 rounded-full mr-2"
                              style={{ backgroundColor: getProficiencyLevelColor(ka.proficiencyLevel) }}
                            />
                            <span className="text-sm">{ka.name}</span>
                          </div>
                          <Badge variant="outline">{ka.subject}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-1">No scheduled repetitions</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete more assessments to generate a spaced repetition schedule
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spaced Repetition Effectiveness</CardTitle>
            <CardDescription>
              Impact of spaced repetition on knowledge retention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { day: 1, withSpacing: 100, withoutSpacing: 100 },
                    { day: 2, withSpacing: 90, withoutSpacing: 70 },
                    { day: 7, withSpacing: 85, withoutSpacing: 40 },
                    { day: 14, withSpacing: 80, withoutSpacing: 25 },
                    { day: 30, withSpacing: 75, withoutSpacing: 15 },
                    { day: 60, withSpacing: 70, withoutSpacing: 10 },
                    { day: 90, withSpacing: 65, withoutSpacing: 5 }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="day" 
                    label={{ value: 'Days Since Learning', position: 'bottom', offset: 0 }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    label={{ value: 'Retention (%)', angle: -90, position: 'left' }}
                  />
                  <Tooltip formatter={(value: any) => `${value}%`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="withSpacing"
                    name="With Spaced Repetition"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="withoutSpacing"
                    name="Without Spaced Repetition"
                    stroke="#ef4444"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                Spaced repetition significantly improves long-term knowledge retention by
                strategically scheduling reviews at optimal intervals. This evidence-based
                approach can increase retention by up to 70% compared to traditional study methods.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className={className}>
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Progress Tracking</h1>
          <p className="text-muted-foreground">
            Comprehensive visualization of learning progress and achievements
          </p>
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {Object.values(UKSubject).map((subject) => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedKeyStage} onValueChange={setSelectedKeyStage}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Key Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Key Stages</SelectItem>
              {Object.values(UKKeyStage).map((keyStage) => (
                <SelectItem key={keyStage} value={keyStage}>{keyStage}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          {selectedTimeRange === 'custom' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-auto justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    "Select date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange as any}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="knowledgeAreas">Knowledge Areas</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="spacedRepetition">Spaced Repetition</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          {renderOverviewTab()}
        </TabsContent>
        
        <TabsContent value="knowledgeAreas" className="mt-6">
          {renderKnowledgeAreasTab()}
        </TabsContent>
        
        <TabsContent value="skills" className="mt-6">
          {renderSkillsTab()}
        </TabsContent>
        
        <TabsContent value="spacedRepetition" className="mt-6">
          {renderSpacedRepetitionTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
