/**
 * Seed data for English KS2 curriculum content
 * Provides example content structure with learning style variants
 */

import { 
  ContentMetadata, 
  ContentVariant, 
  CurriculumContent,
  ContentType,
  ContentFormat,
  ContentDifficultyLevel,
  ContentStatus,
  UKCurriculumRegion
} from '../types';
import { UKKeyStage, UKSubject, LearningStyle } from '@/lib/learning-path/types';

/**
 * Example English KS2 curriculum content
 */
export const englishKS2Content: CurriculumContent[] = [
  // Reading - Comprehension
  {
    metadata: {
      id: 'english-ks2-comprehension-001',
      title: 'Understanding Character Development in Fiction',
      description: 'Learn to analyze how characters develop and change throughout a story, drawing inferences from their actions, dialogue, and descriptions.',
      keyStage: UKKeyStage.KS2,
      subject: UKSubject.ENGLISH,
      topics: ['Reading', 'Comprehension', 'Character Analysis'],
      learningObjectives: [
        'Identify key character traits from text evidence',
        'Analyze how characters change throughout a story',
        'Draw inferences about characters from their actions and dialogue',
        'Compare and contrast different characters within a text'
      ],
      keywords: ['character', 'development', 'inference', 'evidence', 'traits', 'motivation', 'fiction'],
      difficultyLevel: ContentDifficultyLevel.CORE,
      contentType: ContentType.EXPLANATION,
      contentFormat: ContentFormat.TEXT,
      estimatedDuration: 40,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      updatedBy: 'system',
      version: 1,
      status: ContentStatus.PUBLISHED,
      region: UKCurriculumRegion.ENGLAND,
      prerequisiteIds: ['english-ks2-reading-basics'],
      relatedContentIds: ['english-ks2-comprehension-002', 'english-ks2-writing-characters']
    },
    variants: [
      // Visual learner variant
      {
        id: 'english-ks2-comprehension-001-visual',
        contentId: 'english-ks2-comprehension-001',
        learningStyle: LearningStyle.VISUAL,
        content: `
# Understanding Character Development in Fiction

## What is character development?

Character development is how characters change throughout a story. Good characters aren't static—they learn, grow, and sometimes change their beliefs or behaviours.

![Character Development Arc](/assets/curriculum/english/ks2/character-development-arc.png)

## Visual Character Analysis

Let's look at how we can track a character's development visually:

### Character Trait Map

![Character Trait Map](/assets/curriculum/english/ks2/character-trait-map.png)

This map shows how we can identify traits from different sources in the text.

### Character Development Timeline

![Character Timeline](/assets/curriculum/english/ks2/character-timeline.png)

A timeline helps us see how a character changes from the beginning to the end of a story.

## Example: Analyzing a Character

Let's analyze the character of Matilda from Roald Dahl's "Matilda":

![Matilda Character Analysis](/assets/curriculum/english/ks2/matilda-analysis.png)

Notice how we can see:
- Initial traits (clever, kind, loves reading)
- Challenges she faces (unsupportive family)
- How she changes (becomes more confident, stands up for herself)
- Final development (finds a new home with Miss Honey)

## Finding Evidence in the Text

When analyzing characters, always look for evidence in:

1. **Physical descriptions** - How the author describes their appearance
2. **Actions** - What the character does
3. **Dialogue** - What the character says
4. **Thoughts** - What the character thinks (if shown)
5. **Others' reactions** - How other characters respond to them

![Types of Character Evidence](/assets/curriculum/english/ks2/character-evidence-types.png)

## Character Comparison

We can also compare different characters to better understand them:

![Character Comparison](/assets/curriculum/english/ks2/character-comparison.png)

## Your Turn

Try creating a visual character map for a character from a book you're reading. Include:
- Key traits
- Evidence from the text
- How they change throughout the story

[Interactive Character Mapping Tool]
        `,
        mediaUrls: [
          '/assets/curriculum/english/ks2/character-development-arc.png',
          '/assets/curriculum/english/ks2/character-trait-map.png',
          '/assets/curriculum/english/ks2/character-timeline.png',
          '/assets/curriculum/english/ks2/matilda-analysis.png',
          '/assets/curriculum/english/ks2/character-evidence-types.png',
          '/assets/curriculum/english/ks2/character-comparison.png'
        ],
        interactiveElements: {
          characterMapper: {
            type: 'interactive-tool',
            config: {
              template: 'character-map',
              saveEnabled: true,
              shareEnabled: true
            }
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
        version: 1
      },
      // Auditory learner variant
      {
        id: 'english-ks2-comprehension-001-auditory',
        contentId: 'english-ks2-comprehension-001',
        learningStyle: LearningStyle.AUDITORY,
        content: `
# Understanding Character Development in Fiction

## Introduction to Character Development

Listen to this introduction about character development in stories:

[Audio: Character Development Introduction](/assets/curriculum/english/ks2/character-development-intro.mp3)

## Key Listening Points

When reading stories, listen for these clues about characters:

1. **What characters say** - Their dialogue reveals personality, beliefs, and feelings
2. **How they say it** - Tone, volume, and word choice give additional clues
3. **What others say about them** - How other characters describe or react to them
4. **Changes in speech patterns** - How their way of speaking might change throughout the story

## Audio Examples

Listen to these examples of character dialogue and what they reveal:

[Audio: Character Dialogue Examples](/assets/curriculum/english/ks2/character-dialogue-examples.mp3)

## Discussion Questions

Think about and discuss these questions:

1. How does the character's voice change from the beginning to the end of the story?
2. What words or phrases does the character repeat often? What might this tell us?
3. How do other characters speak to this character? What does this reveal about relationships?
4. If you could interview this character, what questions would you ask?

## Character Development Through Dialogue

Listen to how this character's dialogue changes throughout the story:

[Audio: Character Development Through Dialogue](/assets/curriculum/english/ks2/character-dialogue-development.mp3)

Notice how the character:
- Starts hesitant and unsure
- Gradually becomes more confident
- Uses different vocabulary as they learn and grow
- Speaks differently to different characters

## Verbal Character Analysis Exercise

Choose a character from a book you're reading and:
1. Read some of their dialogue aloud
2. Discuss how their speech reveals their personality
3. Identify any changes in how they speak throughout the story
4. Explain what these changes tell us about their development

## Audio Story Analysis

Listen to this short story and pay attention to the main character's development:

[Audio: Short Story for Analysis](/assets/curriculum/english/ks2/character-short-story.mp3)

After listening, think about:
- How did the character change from beginning to end?
- What specific dialogue showed this change?
- What caused the character to change?
        `,
        mediaUrls: [
          '/assets/curriculum/english/ks2/character-development-intro.mp3',
          '/assets/curriculum/english/ks2/character-dialogue-examples.mp3',
          '/assets/curriculum/english/ks2/character-dialogue-development.mp3',
          '/assets/curriculum/english/ks2/character-short-story.mp3'
        ],
        interactiveElements: {
          audioDiscussion: {
            type: 'audio-response',
            config: {
              prompts: [
                'Describe how the main character changed in the story you heard.',
                'What dialogue gave you clues about the character's personality?',
                'How did the character's voice change from beginning to end?'
              ],
              recordEnabled: true
            }
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
        version: 1
      },
      // Kinesthetic learner variant
      {
        id: 'english-ks2-comprehension-001-kinesthetic',
        contentId: 'english-ks2-comprehension-001',
        learningStyle: LearningStyle.KINESTHETIC,
        content: `
# Understanding Character Development in Fiction

## Hands-on Character Analysis Activities

### Activity 1: Character Journey Map

You'll need:
- Large sheet of paper
- Coloured markers or pencils
- Sticky notes
- A book you're reading or have read

Steps:
1. Draw a winding path across your paper
2. Mark key events from the story along the path
3. At each event, write how the character felt and acted
4. Use different colours to show different emotions
5. Connect events that show significant character changes
6. Add quotes from the text on sticky notes as evidence

![Character Journey Map Example](/assets/curriculum/english/ks2/character-journey-example.jpg)

### Activity 2: Character Transformation Role Play

You'll need:
- A partner or small group
- Props (optional)
- Character quotes from a story

Steps:
1. Choose a character who changes significantly in a story
2. Select scenes from the beginning, middle, and end of the story
3. Act out these scenes, showing how the character changes
4. After each scene, freeze and explain what traits you're showing
5. Discuss what caused these changes in the character

### Activity 3: Evidence Sorting

You'll need:
- Index cards or paper strips
- Quotes from a story showing character traits
- Large paper divided into sections for different traits

Steps:
1. Write different character quotes and descriptions on cards
2. Create categories for different character traits
3. Sort the evidence cards into these categories
4. Arrange the cards in chronological order within each category
5. Draw arrows showing how traits develop or change

## Movement-Based Learning

### Character Emotion Statues

1. Stand in a circle
2. The teacher calls out a character and a point in the story
3. Strike a pose that shows how that character felt at that moment
4. Hold the pose while others guess the emotion
5. Discuss how and why the character's emotions changed throughout the story

### Character Development Walk

1. Mark one end of the room as "Beginning" and the other as "End"
2. Walk slowly from one end to the other
3. As you walk, change your posture, expression, and movement to show how a character develops
4. At different points, explain what's happening in the story to cause these changes

## Crafting Character Development

### Create a Character Development Cube

You'll need:
- A cube template (printed or drawn)
- Colouring supplies
- Scissors and glue

Steps:
1. On each face of the cube, show a different aspect of character development:
   - Initial traits
   - Major challenge
   - How they respond
   - Key relationship
   - Important decision
   - Final change
2. Include evidence from the text for each aspect
3. Assemble the cube
4. Use it to explain the character's development to others

### Character Trait Bracelets

Create a bracelet where each bead represents a different trait or change in the character. As you add each bead, explain the evidence from the text that shows this trait or change.
        `,
        mediaUrls: [
          '/assets/curriculum/english/ks2/character-journey-example.jpg',
          '/assets/curriculum/english/ks2/character-cube-template.pdf',
          '/assets/curriculum/english/ks2/character-activities-guide.pdf'
        ],
        interactiveElements: {
          characterJourneyCreator: {
            type: 'interactive-canvas',
            config: {
              template: 'journey-map',
              tools: ['draw', 'text', 'sticky-note', 'connector'],
              saveEnabled: true
            }
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
        version: 1
      },
      // Read/Write learner variant
      {
        id: 'english-ks2-comprehension-001-read-write',
        contentId: 'english-ks2-comprehension-001',
        learningStyle: LearningStyle.READ_WRITE,
        content: `
# Understanding Character Development in Fiction

## Introduction to Character Development

Character development refers to how characters change throughout a narrative. Well-developed characters evolve in response to events, relationships, and internal conflicts. This evolution makes characters more realistic and engaging for readers.

## Key Elements of Character Development

### 1. Initial Character Establishment

At the beginning of a story, authors establish characters through:

- **Direct characterization**: Explicitly stating character traits
  Example: "Sarah was a shy girl who rarely spoke up in class."

- **Indirect characterization**: Revealing traits through:
  - Actions: What the character does
  - Dialogue: What the character says
  - Thoughts: What the character thinks
  - Appearance: How the character looks
  - Others' reactions: How other characters respond to them

### 2. Character Motivation

Understanding why characters act as they do is essential for analyzing their development:

- **External motivations**: Goals, threats, or rewards from the outside world
- **Internal motivations**: Desires, fears, values, or beliefs within the character

### 3. Character Change

Characters typically change in one or more of these ways:

- **Growth**: Learning new skills or developing positive traits
- **Deterioration**: Developing negative traits or losing abilities
- **Transformation**: Fundamental change in beliefs or personality
- **Revelation**: Discovery of hidden aspects of themselves

## Analyzing Character Development

When analyzing character development, consider these questions:

1. What traits does the character exhibit at the beginning of the story?
2. What challenges or conflicts does the character face?
3. How does the character respond to these challenges?
4. What decisions does the character make, and what do these reveal?
5. How has the character changed by the end of the story?
6. What caused these changes?
7. What theme or message does this character's development illustrate?

## Example Character Analysis: Ebenezer Scrooge

Let's analyze the character development of Ebenezer Scrooge from "A Christmas Carol" by Charles Dickens:

### Initial Character (Stave One)

Scrooge is established as:
- Miserly and greedy: "squeezing, wrenching, grasping, scraping, clutching, covetous old sinner"
- Cold-hearted: "No warmth could warm, no wintry weather chill him"
- Isolated: "solitary as an oyster"
- Dismissive of others' happiness: "Bah! Humbug!"

### Challenges and Catalysts for Change

- Visits from four ghosts (Marley and the three Christmas spirits)
- Confrontation with his past, present, and possible future
- Witnessing others' joy despite poverty (Fezziwig, Cratchits)
- Seeing his own loneliness and eventual unlamented death

### Character Development

1. **With Ghost of Christmas Past**: Shows first emotions (tears) when confronted with memories
   Evidence: "He sobbed"

2. **With Ghost of Christmas Present**: Begins showing concern for Tiny Tim
   Evidence: "Spirit," said Scrooge, with an interest he had never felt before, "tell me if Tiny Tim will live."

3. **With Ghost of Christmas Yet to Come**: Experiences fear and regret, pledges to change
   Evidence: "I will honour Christmas in my heart, and try to keep it all the year."

### Final Character (Stave Five)

Scrooge is transformed to:
- Generous: "I'll raise your salary, and endeavour to assist your struggling family"
- Joyful: "I am as light as a feather, I am as happy as an angel"
- Connected to others: Becomes "a second father" to Tiny Tim
- Compassionate: "known as a man who knew how to keep Christmas well"

### Analysis of Development

Scrooge's transformation illustrates:
- The possibility of redemption regardless of age or past
- The importance of human connection and compassion
- The emptiness of material wealth without relationships
- The power of self-reflection and confronting one's choices

## Written Exercise: Character Development Analysis

Choose a character from a book you're reading and write a detailed analysis:

1. Introduction: Briefly introduce the character and story
2. Initial Character: Describe the character at the beginning with text evidence
3. Challenges: Explain what challenges or conflicts the character faces
4. Development: Analyze how the character changes, with specific examples
5. Conclusion: Explain what this character's development reveals about the story's themes

Use the following structure for citing evidence:
- Direct quote: "Quote from the text" (Page number)
- Paraphrase: Summary of what happened or was said (Page number)

Remember to analyze not just what changes occurred, but why they happened and what they mean for the character and story.
        `,
        mediaUrls: [],
        interactiveElements: {
          characterAnalysisTemplate: {
            type: 'fillable-form',
            config: {
              sections: [
                {
                  title: 'Character Basics',
                  fields: [
                    { name: 'characterName', label: 'Character Name', type: 'text' },
                    { name: 'bookTitle', label: 'Book Title', type: 'text' },
                    { name: 'author', label: 'Author', type: 'text' }
                  ]
                },
                {
                  title: 'Initial Character',
                  fields: [
                    { name: 'initialTraits', label: 'Initial Character Traits', type: 'textarea' },
                    { name: 'initialEvidence', label: 'Text Evidence (with page numbers)', type: 'textarea' }
                  ]
                },
                {
                  title: 'Character Challenges',
                  fields: [
                    { name: 'challenges', label: 'Challenges Faced', type: 'textarea' },
                    { name: 'responses', label: 'How Character Responds', type: 'textarea' }
                  ]
                },
                {
                  title: 'Character Development',
                  fields: [
                    { name: 'changes', label: 'How Character Changes', type: 'textarea' },
                    { name: 'changeEvidence', label: 'Text Evidence of Changes (with page numbers)', type: 'textarea' },
                    { name: 'causesOfChange', label: 'What Causes These Changes', type: 'textarea' }
                  ]
                },
                {
                  title: 'Analysis',
                  fields: [
                    { name: 'themeConnection', label: 'Connection to Story Themes', type: 'textarea' },
                    { name: 'readerImpact', label: 'Impact on Reader', type: 'textarea' }
                  ]
                }
              ],
              saveEnabled: true,
              printEnabled: true
            }
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
        version: 1
      }
    ],
    defaultVariant: {
      id: 'english-ks2-comprehension-001-visual',
      contentId: 'english-ks2-comprehension-001',
      learningStyle: LearningStyle.VISUAL,
      content: `
# Understanding Character Development in Fiction

## What is character development?

Character development is how characters change throughout a story. Good characters aren't static—they learn, grow, and sometimes change their beliefs or behaviours.

![Character Development Arc](/assets/curriculum/english/ks2/character-development-arc.png)

## Visual Character Analysis

Let's look at how we can track a character's development visually:

### Character Trait Map

![Character Trait Map](/assets/curriculum/english/ks2/character-trait-map.png)

This map shows how we can identify traits from different sources in the text.

### Character Development Timeline

![Character Timeline](/assets/curriculum/english/ks2/character-timeline.png)

A timeline helps us see how a character changes from the beginning to the end of a story.

## Example: Analyzing a Character

Let's analyze the character of Matilda from Roald Dahl's "Matilda":

![Matilda Character Analysis](/assets/curriculum/english/ks2/matilda-analysis.png)

Notice how we can see:
- Initial traits (clever, kind, loves reading)
- Challenges she faces (unsupportive family)
- How she changes (becomes more confident, stands up for herself)
- Final development (finds a new home with Miss Honey)

## Finding Evidence in the Text

When analyzing characters, always look for evidence in:

1. **Physical descriptions** - How the author describes their appearance
2. **Actions** - What the character does
3. **Dialogue** - What the character says
4. **Thoughts** - What the character thinks (if shown)
5. **Others' reactions** - How other characters respond to them

![Types of Character Evidence](/assets/curriculum/english/ks2/character-evidence-types.png)

## Character Comparison

We can also compare different characters to better understand them:

![Character Comparison](/assets/curriculum/english/ks2/character-comparison.png)

## Your Turn

Try creating a visual character map for a character from a book you're reading. Include:
- Key traits
- Evidence from the text
- How they change throughout the story

[Interactive Character Mapping Tool]
      `,
      mediaUrls: [
        '/assets/curriculum/english/ks2/character-development-arc.png',
        '/assets/curriculum/english/ks2/character-trait-map.png',
        '/assets/curriculum/english/ks2/character-timeline.png',
        '/assets/curriculum/english/ks2/matilda-analysis.png',
        '/assets/curriculum/english/ks2/character-evidence-types.png',
        '/assets/curriculum/english/ks2/character-comparison.png'
      ],
      interactiveElements: {
        characterMapper: {
          type: 'interactive-tool',
          config: {
            template: 'character-map',
            saveEnabled: true,
            shareEnabled: true
          }
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      updatedBy: 'system',
      version: 1
    },
    assessments: ['english-ks2-comprehension-assessment-001'],
    feedback: [],
    analytics: {
      contentId: 'english-ks2-comprehension-001',
      views: 0,
      completions: 0,
      averageTimeSpent: 0,
      averageRating: 0,
      lastUpdated: new Date().toISOString()
    }
  }
];
