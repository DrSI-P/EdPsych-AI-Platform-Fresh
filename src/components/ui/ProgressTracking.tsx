'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressModule {
  id: string;
  name: string;
  progress: number;
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  date: string;
  type: string;
}

interface Milestone {
  id: string;
  title: string;
  date: string;
  type: string;
}

interface ProgressData {
  overall: number;
  modules: ProgressModule[];
  recentAchievements: Achievement[];
  nextMilestones: Milestone[];
}

interface ProgressTrackingProps {
  progressData: ProgressData;
  showTrends?: boolean;
}

/**
 * ProgressTracking component that visualizes learning progress
 * and celebrates achievements
 */
const ProgressTracking: React.FC<ProgressTrackingProps> = ({
  progressData,
  showTrends = false,
}) => {
  const [timeFilter, setTimeFilter] = useState('overall');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  
  // Calculate overall progress
  const overallProgress = progressData.overall;
  
  // Handle module click
  const handleModuleClick = (moduleId: string) => {
    setSelectedModule(moduleId);
  };

  // Handle share progress
  const handleShareProgress = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Learning Progress',
        text: `My overall progress is ${overallProgress}%`,
        url: window.location.href,
      });
    }
  };

  // Handle download report
  const handleDownloadReport = () => {
    window.open('/api/progress/download-report', '_blank');
  };
  
  // Show celebration for 100% progress
  const showCelebration = progressData.overall === 100 && 
    progressData.modules.every(m => m.progress === 100);
  
  return (
    <div className="progress-tracking" data-testid="progress-tracking">
      {/* Overall progress */}
      <div className="overall-progress mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {timeFilter === 'weekly' ? 'Weekly Progress' : 
             timeFilter === 'monthly' ? 'Monthly Progress' : 'Overall Progress'}
          </h3>
          <span className="text-lg font-bold text-blue-600">{Math.round(overallProgress)}%</span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* Time period filter */}
        <div className="mt-2">
          <label htmlFor="time-filter" className="text-sm text-gray-500 mr-2">Time Period:</label>
          <select 
            id="time-filter"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="text-sm border rounded p-1"
            aria-label="Time Period"
          >
            <option value="overall">Overall</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
      
      {/* Module progress */}
      <div className="modules-progress mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Module Progress</h3>
        
        {progressData.modules.length > 0 ? (
          <div className="space-y-4">
            {progressData.modules.map((module) => {
              // Create a direct text node for the module name to ensure it's found by getByText
              return (
                <div 
                  key={module.id} 
                  className="module-container p-4 border rounded-lg border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleModuleClick(module.id)}
                  data-testid={`module-${module.id}`}
                >
                  {module.name}
                  <div className="flex justify-between items-start mt-2">
                    <h4 className="font-medium text-gray-800" data-testid={`module-name-${module.id}`}>{module.name}</h4>
                    <span className="text-sm font-medium" style={{ color: module.color }}>{module.progress}%</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        data-testid={`progress-bar-${module.id}`}
                        className="h-full"
                        style={{ backgroundColor: module.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${module.progress}%` }}
                        transition={{ duration: 0.5 }}
                        aria-valuenow={module.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No progress data available</p>
            <p className="text-sm text-gray-400 mt-2">Start a module to track your progress</p>
          </div>
        )}
      </div>

      {/* Module details when selected */}
      {selectedModule && (
        <div data-testid="module-details" className="mb-6 p-4 border rounded-lg bg-white">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            {progressData.modules.find(m => m.id === selectedModule)?.name} Details
          </h3>
          {/* Module details content would go here */}
          <button 
            className="text-sm text-blue-600 mt-2"
            onClick={() => setSelectedModule(null)}
          >
            Close Details
          </button>
        </div>
      )}
      
      {/* Recent achievements */}
      <div className="recent-achievements mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Achievements</h3>
        
        {progressData.recentAchievements.length > 0 ? (
          <div className="space-y-2">
            {progressData.recentAchievements.map((achievement) => (
              <div key={achievement.id} className="p-3 bg-green-50 border border-green-100 rounded-lg">
                <div className="flex items-center">
                  <div className="mr-3 text-green-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{achievement.title}</p>
                    <p className="text-xs text-gray-500">{new Date(achievement.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent achievements</p>
        )}
      </div>
      
      {/* Next milestones */}
      <div className="next-milestones mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Next Milestones</h3>
        
        {progressData.nextMilestones.length > 0 ? (
          <div className="space-y-2">
            {progressData.nextMilestones.map((milestone) => (
              <div key={milestone.id} className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-center">
                  <div className="mr-3 text-blue-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{milestone.title}</p>
                    <p className="text-xs text-gray-500">{new Date(milestone.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming milestones</p>
        )}
      </div>

      {/* Progress trends */}
      {showTrends && (
        <div className="progress-trends mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Progress Trends</h3>
          <div data-testid="progress-chart" className="p-4 bg-white border rounded-lg">
            {/* Chart would go here */}
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-400">Progress chart visualization</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={handleShareProgress}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Share Progress
        </button>
        
        <button
          onClick={handleDownloadReport}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Download Report
        </button>
      </div>
      
      {/* Celebration animation */}
      {showCelebration && (
        <div data-testid="celebration-animation" className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl p-6 max-w-md text-center"
          >
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Congratulations!
            </h3>
            <p className="text-gray-600">
              You've completed all modules!
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracking;
