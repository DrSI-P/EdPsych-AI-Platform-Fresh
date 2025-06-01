/**
 * Working Memory Support Component
 * 
 * This component provides the UI for working memory support tools and exercises,
 * integrating with the working-memory-support.ts service to deliver cognitive
 * support tools for users with working memory challenges.
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { 
  WorkingMemorySupport as WorkingMemorySupportService,
  WorkingMemoryExerciseType,
  WorkingMemoryChallengeArea,
  WorkingMemorySupportLevel,
  WorkingMemoryExerciseConfig,
  WorkingMemorySupportTool,
  WorkingMemoryProfile
} from '@/lib/executive-function/working-memory-support';
import { Button, Card, Tabs, Tab, Alert, Progress, Select, Switch, Tooltip } from '@/components/ui';
import { AvatarVideo } from '@/components/ui/AvatarVideo';
import { useTranslation } from '@/components/i18n';
import { AccessibilityProvider, useAccessibility } from '@/components/accessibility';

// Exercise components
import SequentialMemoryExercise from './exercises/SequentialMemoryExercise';
import DualNBackExercise from './exercises/DualNBackExercise';
import VisualSpatialExercise from './exercises/VisualSpatialExercise';
import AuditoryVerbalExercise from './exercises/AuditoryVerbalExercise';
import PatternRecognitionExercise from './exercises/PatternRecognitionExercise';
import CategorizationExercise from './exercises/CategorizationExercise';
import MentalMathExercise from './exercises/MentalMathExercise';
import InstructionFollowingExercise from './exercises/InstructionFollowingExercise';

// Support tool components
import VisualChecklist from './tools/VisualChecklist';
import MindMapping from './tools/MindMapping';
import VerbalRehearsal from './tools/VerbalRehearsal';
import AudioNoteTaker from './tools/AudioNoteTaker';
import TaskBreakdown from './tools/TaskBreakdown';
import AttentionRefocuser from './tools/AttentionRefocuser';
import VisualMemoryBank from './tools/VisualMemoryBank';
import ConceptConnector from './tools/ConceptConnector';
import CognitiveLoadMonitor from './tools/CognitiveLoadMonitor';
import MultimodalMemoryAssistant from './tools/MultimodalMemoryAssistant';

/**
 * Working Memory Support Component
 */
export default function WorkingMemorySupport() {
  const { t } = useTranslation('working-memory');
  const router = useRouter();
  const { data: session } = useSession();
  const { highContrast, largeText, reduceMotion } = useAccessibility();
  
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [profile, setProfile] = useState<WorkingMemoryProfile | null>(null);
  const [recommendedExercises, setRecommendedExercises] = useState<WorkingMemoryExerciseConfig[]>([]);
  const [recommendedTools, setRecommendedTools] = useState<WorkingMemorySupportTool[]>([]);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [exerciseSessionId, setExerciseSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAvatarVideo, setShowAvatarVideo] = useState<boolean>(true);
  
  // Initialize service
  const workingMemoryService = WorkingMemorySupportService.getInstance();
  
  // Load user profile and recommendations
  useEffect(() => {
    if (session?.user?.id) {
      try {
        const userProfile = workingMemoryService.getUserProfile(session.user.id);
        
        if (!userProfile) {
          // Create default profile if none exists
          const defaultProfile = {
            overallCapacity: 5,
            visualSpatialCapacity: 5,
            phonologicalCapacity: 5,
            centralExecutiveStrength: 5,
            episodicBufferCapacity: 5,
            challengeAreas: [
              WorkingMemoryChallengeArea.VISUAL_SPATIAL_SKETCHPAD,
              WorkingMemoryChallengeArea.PHONOLOGICAL_LOOP
            ],
            recommendedExercises: [
              WorkingMemoryExerciseType.SEQUENTIAL_MEMORY,
              WorkingMemoryExerciseType.VISUAL_SPATIAL
            ],
            recommendedSupportLevel: WorkingMemorySupportLevel.MODERATE,
            exerciseHistory: [],
            progressTrend: 'initial'
          };
          
          const newProfile = workingMemoryService.updateUserProfile(session.user.id, defaultProfile);
          setProfile(newProfile);
        } else {
          setProfile(userProfile);
        }
        
        // Get recommended exercises and tools
        const exercises = workingMemoryService.getRecommendedExercises(session.user.id);
        const tools = workingMemoryService.getRecommendedSupportTools(session.user.id);
        
        setRecommendedExercises(exercises);
        setRecommendedTools(tools);
        setLoading(false);
      } catch (err) {
        console.error('Error loading working memory profile:', err);
        setError('Failed to load your working memory profile. Please try again later.');
        setLoading(false);
      }
    }
  }, [session]);
  
  // Start exercise
  const handleStartExercise = (exerciseId: string) => {
    if (session?.user?.id) {
      try {
        const sessionId = workingMemoryService.startExercise(session.user.id, exerciseId);
        setExerciseSessionId(sessionId);
        setActiveExercise(exerciseId);
        setActiveTab('exercise');
      } catch (err) {
        console.error('Error starting exercise:', err);
        setError('Failed to start the exercise. Please try again.');
      }
    }
  };
  
  // Complete exercise
  const handleCompleteExercise = (result: any) => {
    if (session?.user?.id && exerciseSessionId) {
      try {
        const exerciseResult = workingMemoryService.completeExercise(exerciseSessionId, result);
        
        // Update profile with latest data
        const updatedProfile = workingMemoryService.getUserProfile(session.user.id);
        setProfile(updatedProfile);
        
        // Reset exercise state
        setExerciseSessionId(null);
        setActiveExercise(null);
        setActiveTab('results');
      } catch (err) {
        console.error('Error completing exercise:', err);
        setError('Failed to save your exercise results. Please try again.');
      }
    }
  };
  
  // Activate support tool
  const handleActivateTool = (toolId: string) => {
    setActiveTool(toolId);
    setActiveTab('tool');
  };
  
  // Render exercise component based on type
  const renderExerciseComponent = () => {
    if (!activeExercise || !exerciseSessionId) return null;
    
    const exerciseConfig = workingMemoryService.getAvailableExercises().find(
      e => e.type.toString() === activeExercise
    );
    
    if (!exerciseConfig) return null;
    
    const commonProps = {
      sessionId: exerciseSessionId,
      config: exerciseConfig,
      onComplete: handleCompleteExercise,
      highContrast,
      largeText,
      reduceMotion
    };
    
    switch (exerciseConfig.type) {
      case WorkingMemoryExerciseType.SEQUENTIAL_MEMORY:
        return <SequentialMemoryExercise {...commonProps} />;
      case WorkingMemoryExerciseType.DUAL_N_BACK:
        return <DualNBackExercise {...commonProps} />;
      case WorkingMemoryExerciseType.VISUAL_SPATIAL:
        return <VisualSpatialExercise {...commonProps} />;
      case WorkingMemoryExerciseType.AUDITORY_VERBAL:
        return <AuditoryVerbalExercise {...commonProps} />;
      case WorkingMemoryExerciseType.PATTERN_RECOGNITION:
        return <PatternRecognitionExercise {...commonProps} />;
      case WorkingMemoryExerciseType.CATEGORIZATION:
        return <CategorizationExercise {...commonProps} />;
      case WorkingMemoryExerciseType.MENTAL_MATH:
        return <MentalMathExercise {...commonProps} />;
      case WorkingMemoryExerciseType.INSTRUCTION_FOLLOWING:
        return <InstructionFollowingExercise {...commonProps} />;
      default:
        return null;
    }
  };
  
  // Render support tool component based on ID
  const renderToolComponent = () => {
    if (!activeTool) return null;
    
    const toolConfig = workingMemoryService.getAvailableSupportTools().find(
      t => t.id === activeTool
    );
    
    if (!toolConfig) return null;
    
    const commonProps = {
      tool: toolConfig,
      onClose: () => {
        setActiveTool(null);
        setActiveTab('tools');
      },
      highContrast,
      largeText,
      reduceMotion
    };
    
    switch (activeTool) {
      case 'visual_checklist':
        return <VisualChecklist {...commonProps} />;
      case 'mind_mapping':
        return <MindMapping {...commonProps} />;
      case 'verbal_rehearsal':
        return <VerbalRehearsal {...commonProps} />;
      case 'audio_note_taker':
        return <AudioNoteTaker {...commonProps} />;
      case 'task_breakdown':
        return <TaskBreakdown {...commonProps} />;
      case 'attention_refocuser':
        return <AttentionRefocuser {...commonProps} />;
      case 'visual_memory_bank':
        return <VisualMemoryBank {...commonProps} />;
      case 'concept_connector':
        return <ConceptConnector {...commonProps} />;
      case 'cognitive_load_monitor':
        return <CognitiveLoadMonitor {...commonProps} />;
      case 'multimodal_memory_assistant':
        return <MultimodalMemoryAssistant {...commonProps} />;
      default:
        return null;
    }
  };
  
  // Render profile overview
  const renderOverview = () => {
    if (!profile) return null;
    
    return (
      <div className="working-memory-overview">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">{t('profile.title')}</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">{t('profile.overallCapacity')}</label>
              <Progress 
                value={profile.overallCapacity * 10} 
                max={100} 
                className="h-4 rounded-full"
                aria-label={t('profile.overallCapacity')}
              />
              <span className="text-sm text-gray-600 mt-1 block">
                {profile.overallCapacity}/10
              </span>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">{t('profile.visualSpatial')}</label>
              <Progress 
                value={profile.visualSpatialCapacity * 10} 
                max={100} 
                className="h-4 rounded-full"
                aria-label={t('profile.visualSpatial')}
              />
              <span className="text-sm text-gray-600 mt-1 block">
                {profile.visualSpatialCapacity}/10
              </span>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">{t('profile.phonological')}</label>
              <Progress 
                value={profile.phonologicalCapacity * 10} 
                max={100} 
                className="h-4 rounded-full"
                aria-label={t('profile.phonological')}
              />
              <span className="text-sm text-gray-600 mt-1 block">
                {profile.phonologicalCapacity}/10
              </span>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">{t('profile.centralExecutive')}</label>
              <Progress 
                value={profile.centralExecutiveStrength * 10} 
                max={100} 
                className="h-4 rounded-full"
                aria-label={t('profile.centralExecutive')}
              />
              <span className="text-sm text-gray-600 mt-1 block">
                {profile.centralExecutiveStrength}/10
              </span>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">{t('profile.episodicBuffer')}</label>
              <Progress 
                value={profile.episodicBufferCapacity * 10} 
                max={100} 
                className="h-4 rounded-full"
                aria-label={t('profile.episodicBuffer')}
              />
              <span className="text-sm text-gray-600 mt-1 block">
                {profile.episodicBufferCapacity}/10
              </span>
            </div>
            
            <div className="mt-6">
              <h4 className="text-md font-medium mb-2">{t('profile.challengeAreas')}</h4>
              <div className="flex flex-wrap gap-2">
                {profile.challengeAreas.map(area => (
                  <span 
                    key={area} 
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {t(`challengeAreas.${area}`)}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-md font-medium mb-2">{t('profile.progressTrend')}</h4>
              <span 
                className={`px-3 py-1 rounded-full text-sm ${
                  profile.progressTrend === 'improving' 
                    ? 'bg-green-100 text-green-800' 
                    : profile.progressTrend === 'declining'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {t(`progressTrend.${profile.progressTrend}`)}
              </span>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">{t('recommendations.title')}</h3>
            
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3">{t('recommendations.exercises')}</h4>
              <div className="space-y-3">
                {recommendedExercises.slice(0, 3).map(exercise => (
                  <div key={exercise.type} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t(`exerciseTypes.${exercise.type}`)}</p>
                      <p className="text-sm text-gray-600">
                        {t('difficulty')}: {exercise.difficulty}/10
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleStartExercise(exercise.type)}
                      variant="primary"
                      size="sm"
                    >
                      {t('start')}
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={() => setActiveTab('exercises')}
                variant="outline"
                className="mt-4 w-full"
              >
                {t('viewAllExercises')}
              </Button>
            </div>
            
            <div>
              <h4 className="text-md font-medium mb-3">{t('recommendations.tools')}</h4>
              <div className="space-y-3">
                {recommendedTools.slice(0, 3).map(tool => (
                  <div key={tool.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{tool.name}</p>
                      <p className="text-sm text-gray-600">
                        {t(`supportLevels.${tool.supportLevel}`)}
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleActivateTool(tool.id)}
                      variant="secondary"
                      size="sm"
                    >
                      {t('use')}
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={() => setActiveTab('tools')}
                variant="outline"
                className="mt-4 w-full"
              >
                {t('viewAllTools')}
              </Button>
            </div>
          </Card>
        </div>
        
        {showAvatarVideo && (
          <div className="mt-8">
            <AvatarVideo 
              src="/videos/placeholders/working-memory-introduction.mp4"
              title={t('avatarVideo.title')}
              onClose={() => setShowAvatarVideo(false)}
            />
          </div>
        )}
      </div>
    );
  };
  
  // Render exercises list
  const renderExercisesList = () => {
    const allExercises = workingMemoryService.getAvailableExercises();
    
    return (
      <div className="working-memory-exercises">
        <h3 className="text-xl font-semibold mb-4">{t('exercises.title')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allExercises.map(exercise => (
            <Card key={exercise.type} className="p-4">
              <h4 className="text-lg font-medium mb-2">
                {t(`exerciseTypes.${exercise.type}`)}
              </h4>
              
              <p className="text-sm text-gray-600 mb-3">
                {exercise.instructions}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>{t('difficulty')}: {exercise.difficulty}/10</span>
                <span>{t('duration')}: {Math.round(exercise.duration / 60)} min</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {exercise.challengeAreas.map(area => (
                  <span 
                    key={area} 
                    className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {t(`challengeAreas.${area}`)}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center">
                  <span className="mr-2">{t('adaptiveDifficulty')}:</span>
                  <span className={exercise.adaptiveDifficulty ? 'text-green-600' : 'text-red-600'}>
                    {exercise.adaptiveDifficulty ? t('enabled') : t('disabled')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                {exercise.visualSupport && (
                  <Tooltip content={t('visualSupport')}>
                    <span className="flex items-center text-sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {t('visual')}
                    </span>
                  </Tooltip>
                )}
                
                {exercise.auditorySupport && (
                  <Tooltip content={t('auditorySupport')}>
                    <span className="flex items-center text-sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m12.728 0l-3.536 3.536M6.414 8.464l3.536 3.536" />
                      </svg>
                      {t('audio')}
                    </span>
                  </Tooltip>
                )}
              </div>
              
              <Button 
                onClick={() => handleStartExercise(exercise.type)}
                variant="primary"
                className="w-full"
              >
                {t('startExercise')}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
  // Render tools list
  const renderToolsList = () => {
    const allTools = workingMemoryService.getAvailableSupportTools();
    
    return (
      <div className="working-memory-tools">
        <h3 className="text-xl font-semibold mb-4">{t('tools.title')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allTools.map(tool => (
            <Card key={tool.id} className="p-4">
              <h4 className="text-lg font-medium mb-2">{tool.name}</h4>
              
              <p className="text-sm text-gray-600 mb-3">
                {tool.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {tool.targetChallengeAreas.map(area => (
                  <span 
                    key={area} 
                    className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {t(`challengeAreas.${area}`)}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm mb-4">
                <span>{t('supportLevel')}: {t(`supportLevels.${tool.supportLevel}`)}</span>
                <span>{t('trigger')}: {t(`triggers.${tool.contextualTrigger}`)}</span>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                {tool.visualComponent && (
                  <Tooltip content={t('visualComponent')}>
                    <span className="flex items-center text-sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {t('visual')}
                    </span>
                  </Tooltip>
                )}
                
                {tool.auditoryComponent && (
                  <Tooltip content={t('auditoryComponent')}>
                    <span className="flex items-center text-sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m12.728 0l-3.536 3.536M6.414 8.464l3.536 3.536" />
                      </svg>
                      {t('audio')}
                    </span>
                  </Tooltip>
                )}
                
                {tool.interactiveComponent && (
                  <Tooltip content={t('interactiveComponent')}>
                    <span className="flex items-center text-sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                      {t('interactive')}
                    </span>
                  </Tooltip>
                )}
              </div>
              
              <Button 
                onClick={() => handleActivateTool(tool.id)}
                variant="secondary"
                className="w-full"
              >
                {t('useTool')}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
  // Render settings
  const renderSettings = () => {
    if (!session?.user?.id) return null;
    
    const config = workingMemoryService.getUserConfiguration(session.user.id);
    
    const handleUpdateConfig = (key: string, value: any) => {
      if (session?.user?.id) {
        const updatedConfig = {
          ...config,
          [key]: value
        };
        
        workingMemoryService.updateUserConfiguration(session.user.id, updatedConfig);
      }
    };
    
    return (
      <div className="working-memory-settings">
        <h3 className="text-xl font-semibold mb-4">{t('settings.title')}</h3>
        
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium mb-3">{t('settings.supportLevel')}</h4>
              <Select
                value={config.defaultSupportLevel}
                onChange={(e) => handleUpdateConfig('defaultSupportLevel', e.target.value)}
                className="w-full"
              >
                <option value={WorkingMemorySupportLevel.MINIMAL}>{t('supportLevels.minimal')}</option>
                <option value={WorkingMemorySupportLevel.MODERATE}>{t('supportLevels.moderate')}</option>
                <option value={WorkingMemorySupportLevel.SUBSTANTIAL}>{t('supportLevels.substantial')}</option>
                <option value={WorkingMemorySupportLevel.COMPREHENSIVE}>{t('supportLevels.comprehensive')}</option>
              </Select>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-3">{t('settings.notifications')}</h4>
              <Select
                value={config.notificationFrequency}
                onChange={(e) => handleUpdateConfig('notificationFrequency', e.target.value)}
                className="w-full"
              >
                <option value="low">{t('frequency.low')}</option>
                <option value="medium">{t('frequency.medium')}</option>
                <option value="high">{t('frequency.high')}</option>
              </Select>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="automaticDetection" className="text-md font-medium">
                  {t('settings.automaticDetection')}
                </label>
                <Switch
                  id="automaticDetection"
                  checked={config.automaticDetection}
                  onChange={(checked) => handleUpdateConfig('automaticDetection', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="adaptiveSupport" className="text-md font-medium">
                  {t('settings.adaptiveSupport')}
                </label>
                <Switch
                  id="adaptiveSupport"
                  checked={config.adaptiveSupport}
                  onChange={(checked) => handleUpdateConfig('adaptiveSupport', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="visualCues" className="text-md font-medium">
                  {t('settings.visualCues')}
                </label>
                <Switch
                  id="visualCues"
                  checked={config.visualCues}
                  onChange={(checked) => handleUpdateConfig('visualCues', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="auditoryCues" className="text-md font-medium">
                  {t('settings.auditoryCues')}
                </label>
                <Switch
                  id="auditoryCues"
                  checked={config.auditoryCues}
                  onChange={(checked) => handleUpdateConfig('auditoryCues', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="reminderSystem" className="text-md font-medium">
                  {t('settings.reminderSystem')}
                </label>
                <Switch
                  id="reminderSystem"
                  checked={config.reminderSystem}
                  onChange={(checked) => handleUpdateConfig('reminderSystem', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="parentNotifications" className="text-md font-medium">
                  {t('settings.parentNotifications')}
                </label>
                <Switch
                  id="parentNotifications"
                  checked={config.parentNotifications}
                  onChange={(checked) => handleUpdateConfig('parentNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="educatorNotifications" className="text-md font-medium">
                  {t('settings.educatorNotifications')}
                </label>
                <Switch
                  id="educatorNotifications"
                  checked={config.educatorNotifications}
                  onChange={(checked) => handleUpdateConfig('educatorNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="dataCollection" className="text-md font-medium">
                  {t('settings.dataCollection')}
                </label>
                <Switch
                  id="dataCollection"
                  checked={config.dataCollection}
                  onChange={(checked) => handleUpdateConfig('dataCollection', checked)}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };
  
  // Main render
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">{t('loading')}</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="error" className="mb-6">
        {error}
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-2"
        >
          {t('retry')}
        </Button>
      </Alert>
    );
  }
  
  return (
    <AccessibilityProvider>
      <div className="working-memory-support">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{t('title')}</h2>
          <p className="text-gray-600">{t('description')}</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <Tab value="overview" label={t('tabs.overview')} />
          <Tab value="exercises" label={t('tabs.exercises')} />
          <Tab value="tools" label={t('tabs.tools')} />
          <Tab value="settings" label={t('tabs.settings')} />
          {activeTab === 'exercise' && (
            <Tab value="exercise" label={t('tabs.activeExercise')} />
          )}
          {activeTab === 'tool' && (
            <Tab value="tool" label={t('tabs.activeTool')} />
          )}
          {activeTab === 'results' && (
            <Tab value="results" label={t('tabs.results')} />
          )}
        </Tabs>
        
        <div className="tab-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'exercises' && renderExercisesList()}
          {activeTab === 'tools' && renderToolsList()}
          {activeTab === 'settings' && renderSettings()}
          {activeTab === 'exercise' && renderExerciseComponent()}
          {activeTab === 'tool' && renderToolComponent()}
          {activeTab === 'results' && (
            <div className="results-summary">
              <Alert variant="success" className="mb-6">
                {t('exerciseCompleted')}
              </Alert>
              {renderOverview()}
            </div>
          )}
        </div>
      </div>
    </AccessibilityProvider>
  );
}
