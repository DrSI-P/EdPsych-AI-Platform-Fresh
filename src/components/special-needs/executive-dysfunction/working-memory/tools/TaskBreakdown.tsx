/**
 * Task Breakdown Assistant Tool Component
 * 
 * This component helps users break down complex tasks into manageable steps,
 * reducing working memory load by externalizing task planning and sequencing.
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Input, Textarea, IconButton, DragDropContext, Draggable, Droppable } from '@/components/ui';
import { useTranslation } from '@/components/i18n';
import { WorkingMemorySupportTool } from '@/lib/executive-function/working-memory-support';

interface TaskBreakdownProps {
  tool: WorkingMemorySupportTool;
  onClose: () => void;
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
}

export default function TaskBreakdown({
  tool,
  onClose,
  highContrast,
  largeText,
  reduceMotion
}: TaskBreakdownProps) {
  const { t } = useTranslation('working-memory');
  
  // State
  const [mainTask, setMainTask] = useState<string>('');
  const [steps, setSteps] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newStepText, setNewStepText] = useState<string>('');
  const [savedTasks, setSavedTasks] = useState<{ id: string; title: string }[]>([]);
  const [currentTaskId, setCurrentTaskId] = useState<string>(`task_${Date.now()}`);
  const [aiSuggesting, setAiSuggesting] = useState<boolean>(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  
  // Load saved tasks on mount
  useEffect(() => {
    const loadSavedTasks = () => {
      try {
        const savedTasksData = localStorage.getItem('working_memory_tasks');
        if (savedTasksData) {
          const parsedData = JSON.parse(savedTasksData);
          setSavedTasks(parsedData.tasks || []);
          
          // Load most recent task if available
          if (parsedData.currentTaskId && parsedData.tasks.some((task: any) => task.id === parsedData.currentTaskId)) {
            setCurrentTaskId(parsedData.currentTaskId);
            loadTask(parsedData.currentTaskId);
          }
        }
      } catch (error) {
        console.error('Error loading saved tasks:', error);
      }
    };
    
    loadSavedTasks();
  }, []);
  
  // Save current task
  const saveCurrentTask = () => {
    if (!mainTask.trim()) return;
    
    try {
      // Get existing data
      const savedTasksData = localStorage.getItem('working_memory_tasks');
      const parsedData = savedTasksData ? JSON.parse(savedTasksData) : { tasks: [] };
      
      // Update or add current task
      const existingTaskIndex = parsedData.tasks.findIndex((task: any) => task.id === currentTaskId);
      
      if (existingTaskIndex >= 0) {
        parsedData.tasks[existingTaskIndex] = { id: currentTaskId, title: mainTask };
      } else {
        parsedData.tasks.push({ id: currentTaskId, title: mainTask });
        setSavedTasks(parsedData.tasks);
      }
      
      // Save current task ID
      parsedData.currentTaskId = currentTaskId;
      
      // Save steps for current task
      localStorage.setItem(`working_memory_task_${currentTaskId}`, JSON.stringify({
        mainTask,
        steps
      }));
      
      // Save tasks metadata
      localStorage.setItem('working_memory_tasks', JSON.stringify(parsedData));
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };
  
  // Load a specific task
  const loadTask = (taskId: string) => {
    try {
      const taskData = localStorage.getItem(`working_memory_task_${taskId}`);
      if (taskData) {
        const parsedTask = JSON.parse(taskData);
        setMainTask(parsedTask.mainTask || '');
        setSteps(parsedTask.steps || []);
        
        // Update current task ID
        setCurrentTaskId(taskId);
        
        // Update saved tasks metadata
        const savedTasksData = localStorage.getItem('working_memory_tasks');
        if (savedTasksData) {
          const parsedData = JSON.parse(savedTasksData);
          parsedData.currentTaskId = taskId;
          localStorage.setItem('working_memory_tasks', JSON.stringify(parsedData));
        }
      }
    } catch (error) {
      console.error('Error loading task:', error);
    }
  };
  
  // Create a new task
  const createNewTask = () => {
    const newTaskId = `task_${Date.now()}`;
    
    // Update state
    setCurrentTaskId(newTaskId);
    setMainTask('');
    setSteps([]);
    
    // Update saved tasks
    const updatedTasks = [...savedTasks, { id: newTaskId, title: t('tools.taskBreakdown.newTask') }];
    setSavedTasks(updatedTasks);
    
    // Save to localStorage
    try {
      const savedTasksData = localStorage.getItem('working_memory_tasks');
      const parsedData = savedTasksData ? JSON.parse(savedTasksData) : { tasks: [] };
      
      parsedData.tasks = updatedTasks;
      parsedData.currentTaskId = newTaskId;
      
      localStorage.setItem('working_memory_tasks', JSON.stringify(parsedData));
      localStorage.setItem(`working_memory_task_${newTaskId}`, JSON.stringify({
        mainTask: '',
        steps: []
      }));
    } catch (error) {
      console.error('Error creating new task:', error);
    }
  };
  
  // Delete a task
  const deleteTask = (taskId: string) => {
    // Remove from saved tasks
    const updatedTasks = savedTasks.filter(task => task.id !== taskId);
    setSavedTasks(updatedTasks);
    
    // Remove from localStorage
    try {
      localStorage.removeItem(`working_memory_task_${taskId}`);
      
      const savedTasksData = localStorage.getItem('working_memory_tasks');
      if (savedTasksData) {
        const parsedData = JSON.parse(savedTasksData);
        parsedData.tasks = updatedTasks;
        
        // Update current task ID if needed
        if (parsedData.currentTaskId === taskId) {
          if (updatedTasks.length > 0) {
            parsedData.currentTaskId = updatedTasks[0].id;
            setCurrentTaskId(updatedTasks[0].id);
            loadTask(updatedTasks[0].id);
          } else {
            delete parsedData.currentTaskId;
            createNewTask();
          }
        }
        
        localStorage.setItem('working_memory_tasks', JSON.stringify(parsedData));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  
  // Add a new step
  const addStep = (text?: string) => {
    const stepText = text || newStepText.trim();
    if (stepText) {
      const newStep = {
        id: `step_${Date.now()}`,
        text: stepText,
        completed: false
      };
      
      const updatedSteps = [...steps, newStep];
      setSteps(updatedSteps);
      setNewStepText('');
      
      // Save to localStorage
      try {
        localStorage.setItem(`working_memory_task_${currentTaskId}`, JSON.stringify({
          mainTask,
          steps: updatedSteps
        }));
      } catch (error) {
        console.error('Error saving task step:', error);
      }
    }
  };
  
  // Toggle step completion
  const toggleStep = (id: string) => {
    const updatedSteps = steps.map(step => 
      step.id === id ? { ...step, completed: !step.completed } : step
    );
    
    setSteps(updatedSteps);
    
    // Save to localStorage
    try {
      localStorage.setItem(`working_memory_task_${currentTaskId}`, JSON.stringify({
        mainTask,
        steps: updatedSteps
      }));
    } catch (error) {
      console.error('Error updating task step:', error);
    }
  };
  
  // Delete a step
  const deleteStep = (id: string) => {
    const updatedSteps = steps.filter(step => step.id !== id);
    setSteps(updatedSteps);
    
    // Save to localStorage
    try {
      localStorage.setItem(`working_memory_task_${currentTaskId}`, JSON.stringify({
        mainTask,
        steps: updatedSteps
      }));
    } catch (error) {
      console.error('Error deleting task step:', error);
    }
  };
  
  // Handle key press in new step input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addStep();
    }
  };
  
  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const reorderedSteps = [...steps];
    const [movedStep] = reorderedSteps.splice(result.source.index, 1);
    reorderedSteps.splice(result.destination.index, 0, movedStep);
    
    setSteps(reorderedSteps);
    
    // Save to localStorage
    try {
      localStorage.setItem(`working_memory_task_${currentTaskId}`, JSON.stringify({
        mainTask,
        steps: reorderedSteps
      }));
    } catch (error) {
      console.error('Error reordering task steps:', error);
    }
  };
  
  // Generate AI suggestions for task breakdown
  const generateSuggestions = () => {
    if (!mainTask.trim()) return;
    
    setAiSuggesting(true);
    
    // Simulate AI suggestions (in a real implementation, this would call an API)
    setTimeout(() => {
      // Generate suggestions based on task type
      let suggestions: string[] = [];
      
      if (mainTask.toLowerCase().includes('essay') || mainTask.toLowerCase().includes('write')) {
        suggestions = [
          'Research the topic and gather sources',
          'Create an outline with main points',
          'Write the introduction with thesis statement',
          'Develop each main point in separate paragraphs',
          'Write the conclusion',
          'Review and edit for clarity and grammar',
          'Format according to required style guide'
        ];
      } else if (mainTask.toLowerCase().includes('project') || mainTask.toLowerCase().includes('presentation')) {
        suggestions = [
          'Define project scope and objectives',
          'Research background information',
          'Create outline or storyboard',
          'Gather necessary materials and resources',
          'Create first draft or prototype',
          'Get feedback from peers or teachers',
          'Revise based on feedback',
          'Prepare final version'
        ];
      } else if (mainTask.toLowerCase().includes('math') || mainTask.toLowerCase().includes('problem')) {
        suggestions = [
          'Understand what the problem is asking',
          'Identify the relevant information given',
          'Choose appropriate formula or method',
          'Break down complex problems into smaller steps',
          'Solve each step systematically',
          'Check your work and verify the answer'
        ];
      } else if (mainTask.toLowerCase().includes('read') || mainTask.toLowerCase().includes('book')) {
        suggestions = [
          'Preview the text (title, headings, images)',
          'Set a purpose for reading',
          'Break reading into manageable sections',
          'Take notes on key points',
          'Summarize each section',
          'Review and connect ideas across sections',
          'Reflect on the overall meaning'
        ];
      } else {
        // Generic task breakdown
        suggestions = [
          'Define the main goal clearly',
          'Break the task into smaller sub-tasks',
          'Prioritize sub-tasks by importance',
          'Estimate time needed for each sub-task',
          'Identify any resources or materials needed',
          'Set deadlines for each sub-task',
          'Plan for potential obstacles'
        ];
      }
      
      setAiSuggestions(suggestions);
      setAiSuggesting(false);
    }, 1500);
  };
  
  // Add all AI suggestions as steps
  const addAllSuggestions = () => {
    aiSuggestions.forEach(suggestion => {
      addStep(suggestion);
    });
    setAiSuggestions([]);
  };
  
  return (
    <div className={`task-breakdown ${largeText ? 'text-lg' : ''}`}>
      <Card className={`p-6 ${highContrast ? 'bg-yellow-50 border-black' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{t('tools.taskBreakdown.title')}</h3>
          
          <div className="flex items-center">
            <Button 
              onClick={saveCurrentTask}
              variant="outline"
              size="sm"
              className="mr-2"
              disabled={!mainTask.trim()}
            >
              {t('save')}
            </Button>
            <Button 
              onClick={onClose}
              variant="secondary"
              size="sm"
            >
              {t('close')}
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            {t('tools.taskBreakdown.mainTask')}
          </label>
          <Textarea
            value={mainTask}
            onChange={(e) => setMainTask(e.target.value)}
            placeholder={t('tools.taskBreakdown.mainTaskPlaceholder')}
            className={`w-full ${highContrast ? 'bg-white border-black' : ''}`}
            rows={2}
          />
          
          <div className="flex justify-between mt-2">
            <Button 
              onClick={generateSuggestions}
              variant="outline"
              size="sm"
              disabled={!mainTask.trim() || aiSuggesting}
              className="flex items-center"
            >
              {aiSuggesting ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  {t('tools.taskBreakdown.generating')}
                </>
              ) : (
                <>
                  <span className="mr-2">✨</span>
                  {t('tools.taskBreakdown.suggestSteps')}
                </>
              )}
            </Button>
            
            <div className="text-sm text-gray-500">
              {steps.filter(step => step.completed).length}/{steps.length} {t('completed')}
            </div>
          </div>
        </div>
        
        {aiSuggestions.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-200">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">{t('tools.taskBreakdown.suggestions')}</h4>
              <div className="flex">
                <Button 
                  onClick={addAllSuggestions}
                  variant="outline"
                  size="sm"
                  className="text-xs mr-2"
                >
                  {t('tools.taskBreakdown.addAll')}
                </Button>
                <Button 
                  onClick={() => setAiSuggestions([])}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                >
                  {t('dismiss')}
                </Button>
              </div>
            </div>
            
            <ul className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-center">
                  <Button 
                    onClick={() => {
                      addStep(suggestion);
                      setAiSuggestions(aiSuggestions.filter((_, i) => i !== index));
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-xs mr-2"
                  >
                    +
                  </Button>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Input
              value={newStepText}
              onChange={(e) => setNewStepText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('tools.taskBreakdown.addStepPlaceholder')}
              className={`flex-grow ${highContrast ? 'bg-white border-black' : ''}`}
            />
            <Button 
              onClick={() => addStep()}
              variant="primary"
              className="ml-2"
              disabled={!newStepText.trim()}
            >
              {t('add')}
            </Button>
          </div>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="steps">
              {(provided) => (
                <div 
                  className="steps-list space-y-2"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {steps.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      {t('tools.taskBreakdown.emptySteps')}
                    </p>
                  ) : (
                    steps.map((step, index) => (
                      <Draggable key={step.id} draggableId={step.id} index={index}>
                        {(provided) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center p-2 rounded ${
                              step.completed 
                                ? highContrast 
                                  ? 'bg-yellow-200' 
                                  : 'bg-green-50' 
                                : highContrast 
                                  ? 'bg-white' 
                                  : 'bg-gray-50'
                            }`}
                          >
                            <div className="mr-2 text-gray-400">
                              {index + 1}.
                            </div>
                            <input
                              type="checkbox"
                              checked={step.completed}
                              onChange={() => toggleStep(step.id)}
                              id={step.id}
                              className={highContrast ? 'border-black' : ''}
                            />
                            <label 
                              htmlFor={step.id} 
                              className={`ml-2 flex-grow ${
                                step.completed 
                                  ? 'line-through text-gray-500' 
                                  : ''
                              }`}
                            >
                              {step.text}
                            </label>
                            <IconButton
                              onClick={() => deleteStep(step.id)}
                              aria-label={t('delete')}
                              variant="ghost"
                              size="sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </IconButton>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        
        <div className="saved-tasks">
          <h4 className="text-md font-medium mb-2">{t('tools.taskBreakdown.savedTasks')}</h4>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {savedTasks.map(task => (
              <div 
                key={task.id} 
                className={`flex items-center px-3 py-1 rounded-full text-sm ${
                  task.id === currentTaskId 
                    ? highContrast 
                      ? 'bg-yellow-300 text-black' 
                      : 'bg-blue-500 text-white' 
                    : highContrast 
                      ? 'bg-gray-200 text-black' 
                      : 'bg-gray-100 text-gray-800'
                }`}
              >
                <span 
                  className="cursor-pointer" 
                  onClick={() => loadTask(task.id)}
                >
                  {task.title || t('tools.taskBreakdown.untitled')}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="ml-2 text-xs"
                  aria-label={t('delete')}
                >
                  ×
                </button>
              </div>
            ))}
            
            <Button 
              onClick={createNewTask}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              + {t('tools.taskBreakdown.newTask')}
            </Button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>{t('tools.taskBreakdown.helpText')}</p>
        </div>
      </Card>
    </div>
  );
}
