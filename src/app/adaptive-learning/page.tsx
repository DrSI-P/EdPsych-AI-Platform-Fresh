'use client';

import React from 'react';
import { AdaptiveComplexityDashboard } from '@/components/adaptive-complexity/adaptive-complexity-dashboard';
import { motion } from 'framer-motion';

/**
 * Adaptive Learning Page
 * 
 * This page provides access to the adaptive complexity features of the platform,
 * allowing students and educators to view and manage learning complexity settings.
 */
export default function AdaptiveLearningPage() {
  // In a real implementation, this would come from authentication
  const userId = 'current-user-id';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Adaptive Learning</h1>
        <p className="text-grey-600">
          Your personalized learning experience that adapts to your needs and progress.
          Content complexity is automatically adjusted based on your performance to provide
          the right level of challenge.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <AdaptiveComplexityDashboard userId={userId} />
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-bold mb-4">How Adaptive Learning Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Personalized Complexity</h3>
              <p className="text-sm">
                Content difficulty automatically adjusts based on your performance,
                ensuring you're always appropriately challenged without being overwhelmed.
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2">Progress Tracking</h3>
              <p className="text-sm">
                Your learning journey is continuously monitored to identify strengths
                and areas for improvement, helping focus your efforts where they matter most.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Evidence-Based Approach</h3>
              <p className="text-sm">
                Our adaptive system is built on educational psychology principles,
                ensuring effective learning that respects individual differences and needs.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-1">Can I override the automatic complexity settings?</h3>
              <p className="text-grey-600">
                Yes, you can switch to manual mode at any time to select your preferred complexity level.
                The system will continue to provide recommendations based on your performance.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-1">How is my performance measured?</h3>
              <p className="text-grey-600">
                Performance is measured through various factors including assessment scores,
                completion rates, time spent, and number of attempts. These metrics are combined
                to create a comprehensive picture of your learning progress.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-1">Will content become too difficult?</h3>
              <p className="text-grey-600">
                The system is designed to provide an appropriate level of challenge without
                becoming overwhelming. Complexity increases gradually and only when you've
                demonstrated readiness for more advanced content.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-1">How do educators use this system?</h3>
              <p className="text-grey-600">
                Educators can view detailed information about student progress and complexity levels,
                receive recommendations for interventions, and generate personalized resources
                tailored to each student's needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
