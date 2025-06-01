import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create demo users with different roles
  const adminPassword = await hash('admin123', 10);
  const teacherPassword = await hash('teacher123', 10);
  const studentPassword = await hash('student123', 10);
  const parentPassword = await hash('parent123', 10);
  const edPsychPassword = await hash('edpsych123', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@edpsychconnect.com' },
    update: {},
    create: {
      email: 'admin@edpsychconnect.com',
      name: 'Admin User',
      role: 'ADMIN',
      image: '/avatars/admin-avatar.png',
      password: await hash('password123', 10), // Added password field
      accounts: {
        create: {
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: 'admin@edpsychconnect.com',
          // Store hashed password in a proper field
          id_token: adminPassword
        }
      }
      // profile field removed as it's not in the schema
    },
  });

  // Create Educational Psychologist user
  const edPsych = await prisma.user.upsert({
    where: { email: 'edpsych@edpsychconnect.com' },
    update: {},
    create: {
      email: 'edpsych@edpsychconnect.com',
      name: 'Emma Richards',
      role: 'EDUCATIONAL_PSYCHOLOGIST',
      image: '/avatars/edpsych-avatar.png',
      password: await hash('password123', 10), // Added password field
      accounts: {
        create: {
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: 'edpsych@edpsychconnect.com',
          // Store hashed password in a proper field
          id_token: edPsychPassword
        }
      }
      // profile field removed as it's not in the schema
    },
  });

  // Create teacher users
  const teacher1 = await prisma.user.upsert({
    where: { email: 'teacher1@edpsychconnect.com' },
    update: {},
    create: {
      email: 'teacher1@edpsychconnect.com',
      name: 'Sarah Williams',
      role: 'TEACHER',
      image: '/avatars/teacher1-avatar.png',
      password: await hash('password123', 10), // Added password field
      accounts: {
        create: {
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: 'teacher1@edpsychconnect.com',
          // Store hashed password in a proper field
          id_token: teacherPassword
        }
      }
      // profile field removed as it's not in the schema
    },
  });

  const teacher2 = await prisma.user.upsert({
    where: { email: 'teacher2@edpsychconnect.com' },
    update: {},
    create: {
      email: 'teacher2@edpsychconnect.com',
      name: 'James Thompson',
      role: 'TEACHER',
      image: '/avatars/teacher2-avatar.png',
      password: await hash('password123', 10), // Added password field
      accounts: {
        create: {
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: 'teacher2@edpsychconnect.com',
          // Store hashed password in a proper field
          id_token: teacherPassword
        }
      }
      // profile field removed as it's not in the schema
    },
  });

  // Create student users with detailed learning preferences
  const student1 = await prisma.user.upsert({
    where: { email: 'student1@edpsychconnect.com' },
    update: {},
    create: {
      email: 'student1@edpsychconnect.com',
      name: 'Emily Johnson',
      role: 'STUDENT',
      image: '/avatars/student1-avatar.png',
      password: await hash('password123', 10), // Added password field
      accounts: {
        create: {
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: 'student1@edpsychconnect.com',
          // Store hashed password in a proper field
          id_token: studentPassword
        }
      }
      // profile field removed as it's not in the schema
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@edpsychconnect.com' },
    update: {},
    create: {
      email: 'student2@edpsychconnect.com',
      name: 'James Johnson',
      role: 'STUDENT',
      image: '/avatars/student2-avatar.png',
      password: await hash('password123', 10), // Added password field
      accounts: {
        create: {
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: 'student2@edpsychconnect.com',
          // Store hashed password in a proper field
          id_token: studentPassword
        }
      }
      // profile field removed as it's not in the schema
    },
  });

  // Create parent users
  const parent1 = await prisma.user.upsert({
    where: { email: 'parent1@edpsychconnect.com' },
    update: {},
    create: {
      email: 'parent1@edpsychconnect.com',
      name: 'Robert Johnson',
      role: 'PARENT',
      image: '/avatars/parent1-avatar.png',
      password: await hash('password123', 10), // Added password field
      accounts: {
        create: {
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: 'parent1@edpsychconnect.com',
          // Store hashed password in a proper field
          id_token: 'parentPassword'
        }
      }
      // profile field removed as it's not in the schema
    },
  });

  const parent2 = await prisma.user.upsert({
    where: { email: 'parent2@edpsychconnect.com' },
    update: {},
    create: {
      email: 'parent2@edpsychconnect.com',
      name: 'Mary Johnson',
      role: 'PARENT',
      image: '/avatars/parent2-avatar.png',
      password: await hash('password123', 10), // Added password field
      accounts: {
        create: {
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: 'parent2@edpsychconnect.com',
          // Store hashed password in a proper field
          id_token: 'parentPassword'
        }
      }
      // profile field removed as it's not in the schema
    },
  });

  // Create SEMH assessments
  const semhAssessment1 = await prisma.assessment.create({
    data: {
      title: 'Emotional Regulation Assessment - Emily Johnson',
      description: 'Comprehensive assessment of emotional regulation skills and strategies',
      type: 'observation',
      creatorId: edPsych.id,  // Changed from createdById to creatorId to match schema
      questions: {
        create: [
          {
            text: 'Self-Awareness',  // Changed from 'content' to 'text' to match schema
            type: 'observation',
            options: JSON.stringify({  // Convert options object to JSON string
              score: 3,
              maxScore: 5,
              observations: 'Emily can identify basic emotions but struggles with more complex feelings. She is beginning to recognise physical signs of anxiety.',
              recommendations: 'Use emotion cards and body mapping activities to develop emotional vocabulary and awareness of physiological responses.'
            }),
            points: 5,  // Added required field
            order: 1    // Added required field
          },
          {
            text: 'Self-Regulation',  // Changed from 'content' to 'text' to match schema
            type: 'observation',
            options: JSON.stringify({  // Convert options object to JSON string
              score: 2,
              maxScore: 5,
              observations: 'Emily finds it difficult to manage strong emotions, particularly frustration during challenging tasks. She sometimes withdraws or becomes tearful.',
              recommendations: 'Teach specific calming strategies such as deep breathing and counting. Provide a quiet space for regulation when needed.'
            }),
            points: 5,  // Added required field
            order: 2    // Added required field
          },
          {
            text: 'Social Awareness',  // Changed from 'content' to 'text' to match schema
            type: 'observation',
            options: JSON.stringify({  // Convert options object to JSON string
              score: 4,
              maxScore: 5,
              observations: 'Emily shows good empathy and can recognise how others are feeling. She is sensitive to classroom atmosphere.',
              recommendations: 'Build on this strength through peer mentoring opportunities and collaborative projects.'
            }),
            points: 5,  // Added required field
            order: 3    // Added required field
          }
        ]
      }
    }
  });

  const semhAssessment2 = await prisma.assessment.create({
    data: {
      title: 'Social Skills Assessment - James Johnson',
      description: 'Assessment of social communication and interaction skills',
      type: 'observation',
      creatorId: edPsych.id,  // Changed from createdById to creatorId to match schema
      questions: {
        create: [
          {
            text: 'Verbal Communication',  // Changed from 'content' to 'text' to match schema
            type: 'observation',
            options: JSON.stringify({  // Convert options object to JSON string
              score: 4,
              maxScore: 5,
              observations: 'James communicates clearly and can express his thoughts well. He sometimes uses overly formal language with peers.',
              recommendations: 'Role-play activities to practise casual conversation. Provide feedback on social language appropriate for different contexts.'
            }),
            points: 5,  // Added required field
            order: 1    // Added required field
          },
          {
            text: 'Non-verbal Communication',  // Changed from 'content' to 'text' to match schema
            type: 'observation',
            options: JSON.stringify({  // Convert options object to JSON string
              score: 3,
              maxScore: 5,
              observations: 'James has limited facial expression and sometimes stands too close to others. He misses some social cues.',
              recommendations: 'Explicit teaching of non-verbal cues through video modelling and social stories. Practise appropriate personal space.'
            }),
            points: 5,  // Added required field
            order: 2    // Added required field
          },
          {
            text: 'Friendship Skills',  // Changed from 'content' to 'text' to match schema
            type: 'observation',
            options: JSON.stringify({  // Convert options object to JSON string
              score: 3,
              maxScore: 5,
              observations: 'James has a small group of friends with shared interests. He struggles to join new groups or activities.',
              recommendations: 'Structured social opportunities with clear roles. Teach specific strategies for joining groups and starting conversations.'
            }),
            points: 5,  // Added required field
            order: 3    // Added required field
          }
        ]
      }
    }
  });

  console.log('Database seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
