import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  id: string;
  title: string;
  content: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

interface InteractiveGuidanceProps {
  steps: Step[];
  onComplete?: () => void;
  initialStep?: number;
  showProgress?: boolean;
  allowSkip?: boolean;
  supportAnxiety?: boolean;
}

/**
 * InteractiveGuidance component that provides step-by-step guidance
 * with special support for users with anxiety
 */
const InteractiveGuidance: React.FC<InteractiveGuidanceProps> = ({
  steps,
  onComplete,
  initialStep = 0,
  showProgress = true,
  allowSkip = true,
  supportAnxiety = true,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [isVisible, setIsVisible] = useState(true);
  const [anxietyLevel, setAnxietyLevel] = useState<'low' | 'medium' | 'high'>('low');
  
  const currentStep = steps[currentStepIndex];
  
  // Handle next step
  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }
  };
  
  // Handle previous step
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  // Handle skip all
  const handleSkip = () => {
    setIsVisible(false);
    if (onComplete) {
      onComplete();
    }
  };
  
  // Update anxiety support based on level
  const getAnxietySupport = () => {
    switch (anxietyLevel) {
      case 'low':
        return null;
      case 'medium':
        return (
          <div className="mt-2 p-2 bg-blue-50 rounded-md text-sm">
            <p>You're doing great! Take your time with this step.</p>
          </div>
        );
      case 'high':
        return (
          <div className="mt-2 p-3 bg-blue-50 rounded-md text-sm">
            <p className="font-medium">It's okay to feel overwhelmed.</p>
            <ul className="list-disc list-inside mt-1">
              <li>Take a deep breath</li>
              <li>You can come back to this later</li>
              <li>Try one small step at a time</li>
            </ul>
            <button 
              onClick={handleSkip} 
              className="mt-2 text-blue-600 hover:underline focus:outline-none"
            >
              I need a break (save progress)
            </button>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Position classes for the guidance popup
  const getPositionClasses = () => {
    switch (currentStep.position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };
  
  // Animation variants
  const variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.3 }}
          className={`absolute pointer-events-auto max-w-sm bg-white rounded-lg shadow-xl border border-grey-200 p-4 ${getPositionClasses()}`}
        >
          {/* Progress indicator */}
          {showProgress && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-grey-500 mb-1">
                <span>Progress</span>
                <span>{currentStepIndex + 1} of {steps.length}</span>
              </div>
              <div className="w-full bg-grey-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Step content */}
          <h3 className="text-lg font-semibold text-grey-800 mb-2">{currentStep.title}</h3>
          <div className="text-grey-600 mb-4">{currentStep.content}</div>
          
          {/* Anxiety support */}
          {supportAnxiety && getAnxietySupport()}
          
          {/* Controls */}
          <div className="flex justify-between items-centre mt-4">
            <div>
              {currentStepIndex > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-3 py-1 text-sm text-grey-600 hover:text-grey-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  Back
                </button>
              )}
            </div>
            
            <div className="flex items-centre space-x-2">
              {supportAnxiety && (
                <div className="flex items-centre mr-2">
                  <span className="text-xs text-grey-500 mr-2">Feeling anxious?</span>
                  <select
                    value={anxietyLevel}
                    onChange={(e) => setAnxietyLevel(e.target.value as 'low' | 'medium' | 'high')}
                    className="text-xs border rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">I'm fine</option>
                    <option value="medium">A little</option>
                    <option value="high">Very anxious</option>
                  </select>
                </div>
              )}
              
              {allowSkip && (
                <button
                  onClick={handleSkip}
                  className="px-3 py-1 text-sm text-grey-500 hover:text-grey-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  Skip
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {currentStepIndex < steps.length - 1 ? 'Next' : 'Finish'}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default InteractiveGuidance;
