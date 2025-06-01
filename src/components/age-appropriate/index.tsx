'use client';

import { AgeAppropriateProvider, useAgeAppropriate, AgeGroup, ComplexityLevel } from './age-appropriate-provider';
import { AgeAppropriateContent } from './age-appropriate-content';
import { AgeGroupSelector } from './age-group-selector';
import { ComplexityAdjuster } from './complexity-adjuster';
import { UKCurriculumMapper, UKKeyStage, UKSubject, mapAgeGroupToKeyStage, getKeyStageText, getSubjectDisplayName } from './uk-curriculum-mapper';
import { AgeSpecificUI } from './age-specific-ui';
import { UKCurriculumResource } from './uk-curriculum-resource';

export {
  AgeAppropriateProvider,
  useAgeAppropriate,
  AgeAppropriateContent,
  AgeGroupSelector,
  ComplexityAdjuster,
  UKCurriculumMapper,
  AgeSpecificUI,
  UKCurriculumResource,
  mapAgeGroupToKeyStage,
  getKeyStageText,
  getSubjectDisplayName
};

export type { AgeGroup, ComplexityLevel, UKKeyStage, UKSubject };
