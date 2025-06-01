import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LearningStyleAdaptiveContentProps {
  visualContent: React.ReactNode;
  auditoryContent: React.ReactNode;
  kinestheticContent: React.ReactNode;
  readWriteContent: React.ReactNode;
  defaultStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'read-write';
  allowUserSelection?: boolean;
  userProfile?: {
    learningStyle?: string;
  };
  onStyleChange?: (style: string) => void;
}

/**
 * LearningStyleAdaptiveContent component that adapts content presentation
 * based on the user's learning style (VARK model)
 */
const LearningStyleAdaptiveContent: React.FC<LearningStyleAdaptiveContentProps> = ({
  visualContent,
  auditoryContent,
  kinestheticContent,
  readWriteContent,
  defaultStyle = 'visual',
  allowUserSelection = true,
  userProfile,
  onStyleChange
}) => {
  const [activeStyle, setActiveStyle] = useState<string>(
    userProfile?.learningStyle || defaultStyle
  );
  
  // Update active style when user profile changes
  useEffect(() => {
    if (userProfile?.learningStyle) {
      setActiveStyle(userProfile.learningStyle);
    }
  }, [userProfile]);
  
  // Handle style change
  const handleStyleChange = (style: string) => {
    setActiveStyle(style);
    if (onStyleChange) {
      onStyleChange(style);
    }
  };
  
  // Render content based on active learning style
  const renderContent = () => {
    switch (activeStyle) {
      case 'visual':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="visual-content"
          >
            {visualContent}
          </motion.div>
        );
      case 'auditory':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="auditory-content"
          >
            {auditoryContent}
          </motion.div>
        );
      case 'kinesthetic':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="kinesthetic-content"
          >
            {kinestheticContent}
          </motion.div>
        );
      case 'read-write':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="read-write-content"
          >
            {readWriteContent}
          </motion.div>
        );
      default:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="visual-content"
          >
            {visualContent}
          </motion.div>
        );
    }
  };
  
  return (
    <div className="learning-style-adaptive-content">
      {/* Style selector */}
      {allowUserSelection && (
        <div className="learning-style-selector mb-6">
          <div className="text-sm text-grey-500 mb-2">Choose your preferred learning style:</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStyleChange('visual')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeStyle === 'visual'
                  ? 'bg-blue-600 text-white'
                  : 'bg-grey-100 text-grey-700 hover:bg-grey-200'
              }`}
            >
              <span className="mr-2">👁️</span>
              Visual
            </button>
            <button
              onClick={() => handleStyleChange('auditory')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeStyle === 'auditory'
                  ? 'bg-blue-600 text-white'
                  : 'bg-grey-100 text-grey-700 hover:bg-grey-200'
              }`}
            >
              <span className="mr-2">👂</span>
              Auditory
            </button>
            <button
              onClick={() => handleStyleChange('kinesthetic')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeStyle === 'kinesthetic'
                  ? 'bg-blue-600 text-white'
                  : 'bg-grey-100 text-grey-700 hover:bg-grey-200'
              }`}
            >
              <span className="mr-2">✋</span>
              Kinesthetic
            </button>
            <button
              onClick={() => handleStyleChange('read-write')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeStyle === 'read-write'
                  ? 'bg-blue-600 text-white'
                  : 'bg-grey-100 text-grey-700 hover:bg-grey-200'
              }`}
            >
              <span className="mr-2">📝</span>
              Read/Write
            </button>
          </div>
        </div>
      )}
      
      {/* Content area */}
      <div className="learning-style-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default LearningStyleAdaptiveContent;
