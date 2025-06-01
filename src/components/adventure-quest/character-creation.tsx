'use client';

import React from 'react';

interface Character {
  id: string;
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  attributes: {
    intelligence: number;
    creativity: number;
    persistence: number;
    curiosity: number;
  };
  inventory: Array<{
    id: string;
    name: string;
    description: string;
    quantity: number;
  }>;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    earnedAt: string;
  }>;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  subject: string;
  keyStage: string;
  difficulty: string;
  duration: number;
  xpReward: number;
  objectives: any;
  challenges: Array<{
    id: string;
    title: string;
    description: string;
    content: string;
    type: string;
    options?: string[];
    correctAnswer?: string;
    minScore?: number;
  }>;
}

interface CharacterCreationProps {
  onCreateCharacter: (character: Character) => void;
}

interface QuestDetailProps {
  quest: Quest | null;
  onComplete: (quest: Quest, results: Record<string, unknown>) => void;
  onBack: () => void;
}

interface QuestHubProps {
  quests: any;
  character: Character | null;
  onSelectQuest: (quest: Quest) => void;
  onGenerateQuest: () => void;
}

interface CharacterDashboardProps {
  character: Character | null;
  completedQuests: any;
  onBack: () => void;
}

// Empty placeholder components for the missing components referenced in adventure-quest files
const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCreateCharacter }) => {
  return (
    <div>
      <h2>Character Creation</h2>
      <button onClick={() => onCreateCharacter({
        id: 'char1',
        name: 'Default Character',
        level: 1,
        xp: 0,
        xpToNextLevel: 1000,
        attributes: {
          intelligence: 5,
          creativity: 5,
          persistence: 5,
          curiosity: 5
        },
        inventory: [],
        achievements: []
      })}>
        Create Default Character
      </button>
    </div>
  );
};

const QuestDetail: React.FC<QuestDetailProps> = ({ quest, onComplete, onBack }) => {
  return (
    <div>
      <h2>Quest Detail: {quest?.title || 'Unknown Quest'}</h2>
      <button onClick={onBack}>Back</button>
      <button onClick={() => quest && onComplete(quest, { score: 80, timeSpent: 1200, completedChallenges: 3 })}>
        Complete Quest
      </button>
    </div>
  );
};

const QuestHub: React.FC<QuestHubProps> = ({ quests, character, onSelectQuest, onGenerateQuest }) => {
  return (
    <div>
      <h2>Quest Hub</h2>
      <button onClick={onGenerateQuest}>Generate New Quest</button>
      <div>
        {quests.map(quest => (
          <div key={quest.id}>
            <h3>{quest.title}</h3>
            <button onClick={() => onSelectQuest(quest)}>Start Quest</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CharacterDashboard: React.FC<CharacterDashboardProps> = ({ character, completedQuests, onBack }) => {
  return (
    <div>
      <h2>Character Dashboard: {character?.name || 'Unknown Character'}</h2>
      <p>Level: {character?.level || 1}</p>
      <p>XP: {character?.xp || 0}</p>
      <p>Completed Quests: {completedQuests?.length || 0}</p>
      <button onClick={onBack}>Back</button>
    </div>
  );
};

export { CharacterCreation, QuestDetail, QuestHub, CharacterDashboard };
