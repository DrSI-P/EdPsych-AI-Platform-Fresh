/**
 * Seed data for Mathematics KS2 curriculum content
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
 * Example Mathematics KS2 curriculum content
 */
export const mathematicsKS2Content: CurriculumContent[] = [
  // Number - Place Value
  {
    metadata: {
      id: 'math-ks2-place-value-001',
      title: 'Understanding Place Value in 4-Digit Numbers',
      description: 'Learn to recognise the place value of each digit in a four-digit number (thousands, hundreds, tens, and ones).',
      keyStage: UKKeyStage.KS2,
      subject: UKSubject.MATHEMATICS,
      topics: ['Number', 'Place Value'],
      learningObjectives: [
        'Recognise the place value of each digit in a four-digit number',
        'Identify the value of digits in different positions',
        'Represent numbers using different materials and models'
      ],
      keywords: ['place value', 'thousands', 'hundreds', 'tens', 'ones', 'digits', 'numbers'],
      difficultyLevel: ContentDifficultyLevel.CORE,
      contentType: ContentType.EXPLANATION,
      contentFormat: ContentFormat.TEXT,
      estimatedDuration: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      updatedBy: 'system',
      version: 1,
      status: ContentStatus.PUBLISHED,
      region: UKCurriculumRegion.ENGLAND,
      prerequisiteIds: ['math-ks2-place-value-intro'],
      relatedContentIds: ['math-ks2-place-value-002', 'math-ks2-place-value-exercise-001']
    },
    variants: [
      // Visual learner variant
      {
        id: 'math-ks2-place-value-001-visual',
        contentId: 'math-ks2-place-value-001',
        learningStyle: LearningStyle.VISUAL,
        content: `
# Understanding Place Value in 4-Digit Numbers

## What is place value?

Place value tells us the value of a digit based on its position in a number.

![Place Value Chart](/assets/curriculum/mathematics/ks2/place-value-chart.png)

## Four-digit numbers

In a four-digit number, we have:
- **Thousands**: The digit in the thousands place
- **Hundreds**: The digit in the hundreds place
- **Tens**: The digit in the tens place
- **Ones**: The digit in the ones place

## Visual examples

Let's look at the number **3,542**:

![3542 Place Value Breakdown](/assets/curriculum/mathematics/ks2/place-value-example.png)

- The **3** is in the thousands place, so its value is **3,000**
- The **5** is in the hundreds place, so its value is **500**
- The **4** is in the tens place, so its value is **40**
- The **2** is in the ones place, so its value is **2**

## Interactive place value chart

Try placing the following numbers in the place value chart:
- 1,234
- 5,678
- 9,302

[Interactive Place Value Chart Tool]

## Summary

Remember that in a four-digit number:
- The first digit represents thousands
- The second digit represents hundreds
- The third digit represents tens
- The fourth digit represents ones

This helps us understand the true value of each digit in a number.
        `,
        mediaUrls: [
          '/assets/curriculum/mathematics/ks2/place-value-chart.png',
          '/assets/curriculum/mathematics/ks2/place-value-example.png',
          '/assets/curriculum/mathematics/ks2/place-value-animation.gif'
        ],
        interactiveElements: {
          placeValueTool: {
            type: 'drag-and-drop',
            config: {
              items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
              dropZones: ['thousands', 'hundreds', 'tens', 'ones']
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
        id: 'math-ks2-place-value-001-auditory',
        contentId: 'math-ks2-place-value-001',
        learningStyle: LearningStyle.AUDITORY,
        content: `
# Understanding Place Value in 4-Digit Numbers

## Introduction

Listen to the explanation of place value in four-digit numbers:

[Audio: Introduction to Place Value](/assets/curriculum/mathematics/ks2/place-value-intro.mp3)

## Key Concepts to Listen For

When learning about place value in four-digit numbers, listen for these important terms:
- Thousands
- Hundreds
- Tens
- Ones

## Verbal Explanation

In a four-digit number, each position has a specific value:

- The digit on the far left is in the thousands place
- The next digit to the right is in the hundreds place
- The next digit is in the tens place
- The digit on the far right is in the ones place

For example, in the number 3,542:
- We say "three thousand, five hundred and forty-two"
- Each part of how we say it tells us the place value:
  - "three thousand" (3 in the thousands place)
  - "five hundred" (5 in the hundreds place)
  - "forty" (4 in the tens place)
  - "two" (2 in the ones place)

## Discussion Points

Think about and discuss these questions:
1. How do we say the number 7,356?
2. What is the value of the digit 7 in this number?
3. How does the value of a digit change when it moves position?

## Verbal Practice

Listen to these numbers and identify the value of each digit:
- 4,821
- 9,073
- 5,600

[Audio: Place Value Practice](/assets/curriculum/mathematics/ks2/place-value-practice.mp3)

## Summary

Remember that when we say a four-digit number, we're actually describing the value of each digit based on its position.
        `,
        mediaUrls: [
          '/assets/curriculum/mathematics/ks2/place-value-intro.mp3',
          '/assets/curriculum/mathematics/ks2/place-value-practice.mp3'
        ],
        interactiveElements: {
          audioQuiz: {
            type: 'audio-response',
            config: {
              questions: [
                'What is the value of 6 in 2,648?',
                'How do we say 3,052?',
                'What digit is in the hundreds place in 7,391?'
              ]
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
        id: 'math-ks2-place-value-001-kinesthetic',
        contentId: 'math-ks2-place-value-001',
        learningStyle: LearningStyle.KINESTHETIC,
        content: `
# Understanding Place Value in 4-Digit Numbers

## Hands-on Activities

### Activity 1: Build Your Numbers

You'll need:
- Base-10 blocks (or paper cutouts representing thousands, hundreds, tens, and ones)
- Place value mat (download and print from the link below)

[Download Place Value Mat](/assets/curriculum/mathematics/ks2/place-value-mat.pdf)

Steps:
1. Set up your place value mat with columns for thousands, hundreds, tens, and ones
2. Choose a four-digit number, such as 3,542
3. Place the correct number of blocks in each column:
   - 3 thousand blocks
   - 5 hundred blocks
   - 4 ten blocks
   - 2 one blocks
4. Say the number aloud while pointing to each group of blocks

Try building these numbers:
- 1,234
- 5,678
- 9,302

### Activity 2: Place Value Hopscotch

You'll need:
- Chalk or tape to mark the floor
- Number cards (0-9)

Steps:
1. Create a hopscotch grid with four squares in a row, labeled "Thousands," "Hundreds," "Tens," and "Ones"
2. Shuffle the number cards
3. Draw four cards and arrange them to create a four-digit number
4. Hop on each square, saying the value of that digit
   (e.g., for 3,542, hop on "Thousands" and say "3,000")

### Activity 3: Trading Game

You'll need:
- Base-10 blocks or counters
- Dice

Steps:
1. Start with some blocks in each place value position
2. Roll the dice and add that many ones
3. When you have 10 or more of any value, trade them for the next place value
   (e.g., 10 ones trade for 1 ten, 10 tens trade for 1 hundred)
4. Keep track of your four-digit number as it changes

## Reflection Questions

After completing these activities, think about:
1. How did physically building the numbers help you understand place value?
2. What happens when you add 1 to 9,999? How would you show this with blocks?
3. How does trading blocks help you understand regrouping in addition and subtraction?

## Extension Challenge

Create a physical model of a five-digit number using household items:
- Use pasta pieces for ones
- Bind 10 pasta pieces with a rubber band for tens
- Put 10 tens in a small bag for hundreds
- Put 10 small bags in a larger bag for thousands
- Put 10 large bags in a box for ten thousands
        `,
        mediaUrls: [
          '/assets/curriculum/mathematics/ks2/place-value-mat.pdf',
          '/assets/curriculum/mathematics/ks2/place-value-activities.pdf'
        ],
        interactiveElements: {
          virtualBlocks: {
            type: 'drag-and-drop',
            config: {
              items: ['thousand-block', 'hundred-block', 'ten-block', 'one-block'],
              dropZones: ['thousands', 'hundreds', 'tens', 'ones'],
              allowMultiple: true
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
        id: 'math-ks2-place-value-001-read-write',
        contentId: 'math-ks2-place-value-001',
        learningStyle: LearningStyle.READ_WRITE,
        content: `
# Understanding Place Value in 4-Digit Numbers

## Introduction

Place value is a fundamental concept in mathematics that helps us understand the value of digits in a number based on their position. In this lesson, we will focus on four-digit numbers and how to identify the value of each digit.

## Key Concepts

In a four-digit number, each position represents a specific value:

| Position | Place Value | Example in 3,542 |
|----------|-------------|------------------|
| 1st (left) | Thousands | 3 = 3,000 |
| 2nd | Hundreds | 5 = 500 |
| 3rd | Tens | 4 = 40 |
| 4th (right) | Ones | 2 = 2 |

## Detailed Explanation

When we write a four-digit number, each digit's position determines its actual value. For example, in the number 3,542:

- The digit 3 is in the thousands place, so its value is 3 × 1,000 = 3,000
- The digit 5 is in the hundreds place, so its value is 5 × 100 = 500
- The digit 4 is in the tens place, so its value is 4 × 10 = 40
- The digit 2 is in the ones place, so its value is 2 × 1 = 2

Therefore, 3,542 = 3,000 + 500 + 40 + 2

## Examples

Let's analyze some four-digit numbers:

### Example 1: 7,356
- 7 in the thousands place = 7,000
- 3 in the hundreds place = 300
- 5 in the tens place = 50
- 6 in the ones place = 6
- Total: 7,000 + 300 + 50 + 6 = 7,356

### Example 2: 9,004
- 9 in the thousands place = 9,000
- 0 in the hundreds place = 0
- 0 in the tens place = 0
- 4 in the ones place = 4
- Total: 9,000 + 0 + 0 + 4 = 9,004

## Practice Exercises

Write down the value of each digit in these numbers:

1. 6,248
2. 1,907
3. 5,555
4. 3,020

For each number, create an expanded form equation showing the sum of each digit's place value.

## Written Assignment

In your notebook, answer the following questions:

1. Explain in your own words what place value means.
2. Why is the digit 5 worth different amounts in the numbers 5,432 and 2,543?
3. Write the number 8,275 in expanded form.
4. What is the value of the digit 7 in the number 4,731?
5. Create your own four-digit number and explain the value of each digit.

## Summary

Understanding place value in four-digit numbers allows us to:
- Recognize the actual value of each digit
- Read and write numbers correctly
- Compare numbers effectively
- Perform calculations accurately

Remember that each position in a number has a specific value, and the same digit can have different values depending on its position.
        `,
        mediaUrls: [],
        interactiveElements: {
          worksheet: {
            type: 'fillable-form',
            config: {
              questions: [
                'Write 3,542 in expanded form:',
                'What is the value of 7 in 2,731?',
                'Write the number with 6 thousands, 0 hundreds, 8 tens, and 3 ones:',
                'What is the value of the underlined digit in 5̲,382?'
              ]
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
      id: 'math-ks2-place-value-001-visual',
      contentId: 'math-ks2-place-value-001',
      learningStyle: LearningStyle.VISUAL,
      content: `
# Understanding Place Value in 4-Digit Numbers

## What is place value?

Place value tells us the value of a digit based on its position in a number.

![Place Value Chart](/assets/curriculum/mathematics/ks2/place-value-chart.png)

## Four-digit numbers

In a four-digit number, we have:
- **Thousands**: The digit in the thousands place
- **Hundreds**: The digit in the hundreds place
- **Tens**: The digit in the tens place
- **Ones**: The digit in the ones place

## Visual examples

Let's look at the number **3,542**:

![3542 Place Value Breakdown](/assets/curriculum/mathematics/ks2/place-value-example.png)

- The **3** is in the thousands place, so its value is **3,000**
- The **5** is in the hundreds place, so its value is **500**
- The **4** is in the tens place, so its value is **40**
- The **2** is in the ones place, so its value is **2**

## Interactive place value chart

Try placing the following numbers in the place value chart:
- 1,234
- 5,678
- 9,302

[Interactive Place Value Chart Tool]

## Summary

Remember that in a four-digit number:
- The first digit represents thousands
- The second digit represents hundreds
- The third digit represents tens
- The fourth digit represents ones

This helps us understand the true value of each digit in a number.
      `,
      mediaUrls: [
        '/assets/curriculum/mathematics/ks2/place-value-chart.png',
        '/assets/curriculum/mathematics/ks2/place-value-example.png',
        '/assets/curriculum/mathematics/ks2/place-value-animation.gif'
      ],
      interactiveElements: {
        placeValueTool: {
          type: 'drag-and-drop',
          config: {
            items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            dropZones: ['thousands', 'hundreds', 'tens', 'ones']
          }
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      updatedBy: 'system',
      version: 1
    },
    assessments: ['math-ks2-place-value-assessment-001'],
    feedback: [],
    analytics: {
      contentId: 'math-ks2-place-value-001',
      views: 0,
      completions: 0,
      averageTimeSpent: 0,
      averageRating: 0,
      lastUpdated: new Date().toISOString()
    }
  },
  
  // Number - Addition and Subtraction
  {
    metadata: {
      id: 'math-ks2-addition-001',
      title: 'Adding and Subtracting 4-Digit Numbers',
      description: 'Learn to add and subtract numbers with up to 4 digits using the formal written methods of columnar addition and subtraction.',
      keyStage: UKKeyStage.KS2,
      subject: UKSubject.MATHEMATICS,
      topics: ['Number', 'Addition and Subtraction'],
      learningObjectives: [
        'Add numbers with up to 4 digits using columnar addition',
        'Subtract numbers with up to 4 digits using columnar subtraction',
        'Estimate and check answers using inverse operations'
      ],
      keywords: ['addition', 'subtraction', 'column method', 'regrouping', 'carrying', 'borrowing'],
      difficultyLevel: ContentDifficultyLevel.CORE,
      contentType: ContentType.EXPLANATION,
      contentFormat: ContentFormat.TEXT,
      estimatedDuration: 45,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      updatedBy: 'system',
      version: 1,
      status: ContentStatus.PUBLISHED,
      region: UKCurriculumRegion.ENGLAND,
      prerequisiteIds: ['math-ks2-place-value-001'],
      relatedContentIds: ['math-ks2-addition-exercise-001']
    },
    variants: [
      // Visual learner variant
      {
        id: 'math-ks2-addition-001-visual',
        contentId: 'math-ks2-addition-001',
        learningStyle: LearningStyle.VISUAL,
        content: `
# Adding and Subtracting 4-Digit Numbers

## Column Addition Method

When adding larger numbers, we use the column method to keep our work organized.

![Column Addition Setup](/assets/curriculum/mathematics/ks2/column-addition-setup.png)

### Steps for Column Addition:

1. Write the numbers one above the other, lining up the place values
2. Start adding from the right (ones column)
3. If a column sum is 10 or more, carry the tens digit to the next column
4. Continue left through each column

### Example with Carrying:

Let's add 3,547 + 2,685:

![Column Addition with Carrying](/assets/curriculum/mathematics/ks2/column-addition-example.png)

1. Ones: 7 + 5 = 12, write 2, carry 1
2. Tens: 1 (carried) + 4 + 8 = 13, write 3, carry 1
3. Hundreds: 1 (carried) + 5 + 6 = 12, write 2, carry 1
4. Thousands: 1 (carried) + 3 + 2 = 6
5. Result: 6,232

## Column Subtraction Method

For subtraction, we also use a column method.

![Column Subtraction Setup](/assets/curriculum/mathematics/ks2/column-subtraction-setup.png)

### Steps for Column Subtraction:

1. Write the larger number on top, smaller number below
2. Start subtracting from the right (ones column)
3. If you can't subtract directly, borrow from the next column
4. Continue left through each column

### Example with Borrowing:

Let's subtract 3,547 - 1,685:

![Column Subtraction with Borrowing](/assets/curriculum/mathematics/ks2/column-subtraction-example.png)

1. Ones: 7 - 5 = 2
2. Tens: 4 - 8 can't be done, so borrow 1 from hundreds: 14 - 8 = 6
3. Hundreds: 5 (now 4 after borrowing) - 6 can't be done, so borrow 1 from thousands: 14 - 6 = 8
4. Thousands: 3 (now 2 after borrowing) - 1 = 1
5. Result: 1,862

## Checking Your Work

Always estimate to check if your answer is reasonable:
- For addition: round each number and add
- For subtraction: round each number and subtract
- Use the inverse operation to verify (addition ↔ subtraction)

![Checking with Inverse Operations](/assets/curriculum/mathematics/ks2/inverse-operations.png)
        `,
        mediaUrls: [
          '/assets/curriculum/mathematics/ks2/column-addition-setup.png',
          '/assets/curriculum/mathematics/ks2/column-addition-example.png',
          '/assets/curriculum/mathematics/ks2/column-subtraction-setup.png',
          '/assets/curriculum/mathematics/ks2/column-subtraction-example.png',
          '/assets/curriculum/mathematics/ks2/inverse-operations.png'
        ],
        interactiveElements: {
          columnCalculator: {
            type: 'interactive-tool',
            config: {
              operations: ['addition', 'subtraction'],
              maxDigits: 4,
              showCarrying: true
            }
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
        version: 1
      },
      // Other variants would be included here
    ],
    defaultVariant: {
      id: 'math-ks2-addition-001-visual',
      contentId: 'math-ks2-addition-001',
      learningStyle: LearningStyle.VISUAL,
      content: `
# Adding and Subtracting 4-Digit Numbers

## Column Addition Method

When adding larger numbers, we use the column method to keep our work organized.

![Column Addition Setup](/assets/curriculum/mathematics/ks2/column-addition-setup.png)

### Steps for Column Addition:

1. Write the numbers one above the other, lining up the place values
2. Start adding from the right (ones column)
3. If a column sum is 10 or more, carry the tens digit to the next column
4. Continue left through each column

### Example with Carrying:

Let's add 3,547 + 2,685:

![Column Addition with Carrying](/assets/curriculum/mathematics/ks2/column-addition-example.png)

1. Ones: 7 + 5 = 12, write 2, carry 1
2. Tens: 1 (carried) + 4 + 8 = 13, write 3, carry 1
3. Hundreds: 1 (carried) + 5 + 6 = 12, write 2, carry 1
4. Thousands: 1 (carried) + 3 + 2 = 6
5. Result: 6,232

## Column Subtraction Method

For subtraction, we also use a column method.

![Column Subtraction Setup](/assets/curriculum/mathematics/ks2/column-subtraction-setup.png)

### Steps for Column Subtraction:

1. Write the larger number on top, smaller number below
2. Start subtracting from the right (ones column)
3. If you can't subtract directly, borrow from the next column
4. Continue left through each column

### Example with Borrowing:

Let's subtract 3,547 - 1,685:

![Column Subtraction with Borrowing](/assets/curriculum/mathematics/ks2/column-subtraction-example.png)

1. Ones: 7 - 5 = 2
2. Tens: 4 - 8 can't be done, so borrow 1 from hundreds: 14 - 8 = 6
3. Hundreds: 5 (now 4 after borrowing) - 6 can't be done, so borrow 1 from thousands: 14 - 6 = 8
4. Thousands: 3 (now 2 after borrowing) - 1 = 1
5. Result: 1,862

## Checking Your Work

Always estimate to check if your answer is reasonable:
- For addition: round each number and add
- For subtraction: round each number and subtract
- Use the inverse operation to verify (addition ↔ subtraction)

![Checking with Inverse Operations](/assets/curriculum/mathematics/ks2/inverse-operations.png)
      `,
      mediaUrls: [
        '/assets/curriculum/mathematics/ks2/column-addition-setup.png',
        '/assets/curriculum/mathematics/ks2/column-addition-example.png',
        '/assets/curriculum/mathematics/ks2/column-subtraction-setup.png',
        '/assets/curriculum/mathematics/ks2/column-subtraction-example.png',
        '/assets/curriculum/mathematics/ks2/inverse-operations.png'
      ],
      interactiveElements: {
        columnCalculator: {
          type: 'interactive-tool',
          config: {
            operations: ['addition', 'subtraction'],
            maxDigits: 4,
            showCarrying: true
          }
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      updatedBy: 'system',
      version: 1
    },
    assessments: ['math-ks2-addition-assessment-001'],
    feedback: [],
    analytics: {
      contentId: 'math-ks2-addition-001',
      views: 0,
      completions: 0,
      averageTimeSpent: 0,
      averageRating: 0,
      lastUpdated: new Date().toISOString()
    }
  }
];
