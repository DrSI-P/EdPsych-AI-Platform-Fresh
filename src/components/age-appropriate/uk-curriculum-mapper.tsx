'use client';

import React from 'react';
import { useAgeAppropriate, AgeGroup } from './age-appropriate-provider';

// Define UK curriculum key stages
export type UKKeyStage = 
  | 'early-years' 
  | 'ks1' 
  | 'ks2' 
  | 'ks3' 
  | 'ks4' 
  | 'ks5';

// Define UK curriculum subjects
export type UKSubject = 
  | 'english' 
  | 'maths' 
  | 'science' 
  | 'computing' 
  | 'history' 
  | 'geography'
  | 'art' 
  | 'music' 
  | 'pe' 
  | 'languages' 
  | 'citizenship' 
  | 'pshe';

interface UKCurriculumMapperProps {
  children: React.ReactNode;
  keyStage: UKKeyStage | UKKeyStage[];
  subject?: UKSubject | UKSubject[];
  className?: string;
  showCurriculumBadge?: boolean;
}

// Helper function to map age group to key stage
export const mapAgeGroupToKeyStage = (ageGroup: AgeGroup): UKKeyStage[] => {
  switch (ageGroup) {
    case 'nursery':
      return ['early-years'];
    case 'primary':
      return ['ks1', 'ks2'];
    case 'secondary':
      return ['ks3', 'ks4', 'ks5'];
    case 'adult':
      return ['ks5'];
    default:
      return ['ks2']; // Default to middle primary as fallback
  }
};

// Helper function to get human-readable key stage text
export const getKeyStageText = (keyStage: UKKeyStage): string => {
  switch (keyStage) {
    case 'early-years':
      return 'Early Years Foundation Stage';
    case 'ks1':
      return 'Key Stage 1 (Years 1-2)';
    case 'ks2':
      return 'Key Stage 2 (Years 3-6)';
    case 'ks3':
      return 'Key Stage 3 (Years 7-9)';
    case 'ks4':
      return 'Key Stage 4 (Years 10-11)';
    case 'ks5':
      return 'Key Stage 5 (Years 12-13)';
    default:
      return '';
  }
};

// Helper function to get subject display name
export const getSubjectDisplayName = (subject: UKSubject): string => {
  switch (subject) {
    case 'english':
      return 'English';
    case 'maths':
      return 'Mathematics';
    case 'science':
      return 'Science';
    case 'computing':
      return 'Computing';
    case 'history':
      return 'History';
    case 'geography':
      return 'Geography';
    case 'art':
      return 'Art & Design';
    case 'music':
      return 'Music';
    case 'pe':
      return 'Physical Education';
    case 'languages':
      return 'Languages';
    case 'citizenship':
      return 'Citizenship';
    case 'pshe':
      return 'PSHE';
    default:
      return '';
  }
};

export const UKCurriculumMapper: React.FC<UKCurriculumMapperProps> = ({
  children,
  keyStage,
  subject,
  className = '',
  showCurriculumBadge = true,
}) => {
  const { ageGroup } = useAgeAppropriate();
  
  // Convert single key stage to array for consistent handling
  const keyStages = Array.isArray(keyStage) ? keyStage : [keyStage];
  
  // Convert single subject to array for consistent handling
  const subjects = subject ? (Array.isArray(subject) ? subject : [subject]) : [];
  
  // Get current user's key stages based on age group
  const userKeyStages = mapAgeGroupToKeyStage(ageGroup);
  
  // Check if content is appropriate for user's key stage
  const isAppropriateKeyStage = keyStages.some(ks => userKeyStages.includes(ks));
  
  // If content is not appropriate for the user's key stage, don't render it
  if (!isAppropriateKeyStage) {
    return null;
  }
  
  return (
    <div className={`uk-curriculum-content ${className}`}>
      {showCurriculumBadge && (
        <div className="uk-curriculum-badge">
          <div className="key-stage-badge">
            {keyStages.map((ks, index) => (
              <span key={ks} className={`key-stage ${ks}`}>
                {getKeyStageText(ks)}
                {index < keyStages.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
          
          {subjects.length > 0 && (
            <div className="subject-badge">
              {subjects.map((subj, index) => (
                <span key={subj} className={`subject ${subj}`}>
                  {getSubjectDisplayName(subj)}
                  {index < subjects.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      
      {children}
    </div>
  );
};

export default UKCurriculumMapper;
