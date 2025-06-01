import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Schema for portfolio profile
const portfolioProfileSchema = z.object({
  userId: z.string(),
  name: z.string().min(2).max(100),
  title: z.string().min(2).max(100),
  school: z.string().optional(),
  yearsExperience: z.number().min(0).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  biography: z.string().optional(),
  teachingPhilosophy: z.string().optional(),
  specialisations: z.array(z.string()).optional(),
  avatarUrl: z.string().optional()
});

// Schema for qualification
const qualificationSchema = z.object({
  userId: z.string(),
  title: z.string().min(2).max(100),
  institution: z.string().min(2).max(100),
  year: z.string(),
  verified: z.boolean().default(false),
  certificateUrl: z.string().optional()
});

// Schema for achievement
const achievementSchema = z.object({
  userId: z.string(),
  title: z.string().min(2).max(100),
  description: z.string(),
  date: z.string(),
  type: z.string(),
  evidence: z.array(z.string()).optional(),
  visibility: z.enum(['public', 'private']).default('public')
});

// Schema for evidence
const evidenceSchema = z.object({
  userId: z.string(),
  title: z.string().min(2).max(100),
  description: z.string(),
  type: z.string(),
  date: z.string(),
  fileUrl: z.string(),
  fileType: z.string(),
  tags: z.array(z.string()).optional(),
  visibility: z.enum(['public', 'private']).default('public'),
  associatedAchievements: z.array(z.string()).optional()
});

// Schema for reflection
const reflectionSchema = z.object({
  userId: z.string(),
  title: z.string().min(2).max(100),
  content: z.string(),
  date: z.string(),
  tags: z.array(z.string()).optional(),
  visibility: z.enum(['public', 'private']).default('public'),
  associatedEvidence: z.array(z.string()).optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'updateProfile':
        return handleUpdateProfile(body);
      case 'addQualification':
        return handleAddQualification(body);
      case 'updateQualification':
        return handleUpdateQualification(body);
      case 'deleteQualification':
        return handleDeleteQualification(body);
      case 'addAchievement':
        return handleAddAchievement(body);
      case 'updateAchievement':
        return handleUpdateAchievement(body);
      case 'deleteAchievement':
        return handleDeleteAchievement(body);
      case 'addEvidence':
        return handleAddEvidence(body);
      case 'updateEvidence':
        return handleUpdateEvidence(body);
      case 'deleteEvidence':
        return handleDeleteEvidence(body);
      case 'addReflection':
        return handleAddReflection(body);
      case 'updateReflection':
        return handleUpdateReflection(body);
      case 'deleteReflection':
        return handleDeleteReflection(body);
      case 'generatePortfolioPDF':
        return handleGeneratePortfolioPDF(body);
      case 'sharePortfolio':
        return handleSharePortfolio(body);
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in portfolio API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleUpdateProfile(body) {
  try {
    const { userId, ...profileData } = portfolioProfileSchema.parse(body);

    // Check if profile exists
    const existingProfile = await prisma.portfolioProfile.findUnique({
      where: { userId }
    });

    let profile;
    if (existingProfile) {
      // Update existing profile
      profile = await prisma.portfolioProfile.update({
        where: { userId },
        data: {
          ...profileData,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new profile
      profile = await prisma.portfolioProfile.create({
        data: {
          ...profileData,
          userId,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }

    return NextResponse.json(
      { message: 'Profile updated successfully', profile },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid profile data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleAddQualification(body) {
  try {
    const { userId, ...qualificationData } = qualificationSchema.parse(body);

    const qualification = await prisma.portfolioQualification.create({
      data: {
        ...qualificationData,
        user: { connect: { id: userId } },
        createdAt: new Date()
      }
    });

    return NextResponse.json(
      { message: 'Qualification added successfully', qualification },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid qualification data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleUpdateQualification(body) {
  try {
    const { id, userId, ...qualificationData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Qualification ID is required' },
        { status: 400 }
      );
    }

    // Validate qualification data
    qualificationSchema.parse({ userId, ...qualificationData });

    // Check if qualification exists and belongs to user
    const existingQualification = await prisma.portfolioQualification.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingQualification) {
      return NextResponse.json(
        { error: 'Qualification not found or access denied' },
        { status: 404 }
      );
    }

    const qualification = await prisma.portfolioQualification.update({
      where: { id },
      data: {
        ...qualificationData,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(
      { message: 'Qualification updated successfully', qualification },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid qualification data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleDeleteQualification(body) {
  try {
    const { id, userId } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Qualification ID is required' },
        { status: 400 }
      );
    }

    // Check if qualification exists and belongs to user
    const existingQualification = await prisma.portfolioQualification.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingQualification) {
      return NextResponse.json(
        { error: 'Qualification not found or access denied' },
        { status: 404 }
      );
    }

    await prisma.portfolioQualification.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Qualification deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    throw error;
  }
}

async function handleAddAchievement(body) {
  try {
    const { userId, ...achievementData } = achievementSchema.parse(body);

    const achievement = await prisma.portfolioAchievement.create({
      data: {
        ...achievementData,
        user: { connect: { id: userId } },
        createdAt: new Date()
      }
    });

    return NextResponse.json(
      { message: 'Achievement added successfully', achievement },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid achievement data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleUpdateAchievement(body) {
  try {
    const { id, userId, ...achievementData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Achievement ID is required' },
        { status: 400 }
      );
    }

    // Validate achievement data
    achievementSchema.parse({ userId, ...achievementData });

    // Check if achievement exists and belongs to user
    const existingAchievement = await prisma.portfolioAchievement.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingAchievement) {
      return NextResponse.json(
        { error: 'Achievement not found or access denied' },
        { status: 404 }
      );
    }

    const achievement = await prisma.portfolioAchievement.update({
      where: { id },
      data: {
        ...achievementData,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(
      { message: 'Achievement updated successfully', achievement },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid achievement data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleDeleteAchievement(body) {
  try {
    const { id, userId } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Achievement ID is required' },
        { status: 400 }
      );
    }

    // Check if achievement exists and belongs to user
    const existingAchievement = await prisma.portfolioAchievement.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingAchievement) {
      return NextResponse.json(
        { error: 'Achievement not found or access denied' },
        { status: 404 }
      );
    }

    await prisma.portfolioAchievement.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Achievement deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    throw error;
  }
}

async function handleAddEvidence(body) {
  try {
    const { userId, ...evidenceData } = evidenceSchema.parse(body);

    const evidence = await prisma.portfolioEvidence.create({
      data: {
        ...evidenceData,
        user: { connect: { id: userId } },
        createdAt: new Date()
      }
    });

    // Link to achievements if provided
    if (evidenceData.associatedAchievements && evidenceData.associatedAchievements.length > 0) {
      await Promise.all(
        evidenceData.associatedAchievements.map(async (achievementId: string) => {
          await prisma.portfolioEvidenceAchievement.create({
            data: {
              evidenceId: evidence.id,
              achievementId
            }
          });
        })
      );
    }

    return NextResponse.json(
      { message: 'Evidence added successfully', evidence },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid evidence data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleUpdateEvidence(body) {
  try {
    const { id, userId, associatedAchievements, ...evidenceData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Evidence ID is required' },
        { status: 400 }
      );
    }

    // Validate evidence data
    evidenceSchema.parse({ userId, associatedAchievements: associatedAchievements || [], ...evidenceData });

    // Check if evidence exists and belongs to user
    const existingEvidence = await prisma.portfolioEvidence.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingEvidence) {
      return NextResponse.json(
        { error: 'Evidence not found or access denied' },
        { status: 404 }
      );
    }

    const evidence = await prisma.portfolioEvidence.update({
      where: { id },
      data: {
        ...evidenceData,
        updatedAt: new Date()
      }
    });

    // Update achievement associations if provided
    if (associatedAchievements) {
      // Remove existing associations
      await prisma.portfolioEvidenceAchievement.deleteMany({
        where: { evidenceId: id }
      });

      // Add new associations
      if (associatedAchievements.length > 0) {
        await Promise.all(
          associatedAchievements.map(async (achievementId: string) => {
            await prisma.portfolioEvidenceAchievement.create({
              data: {
                evidenceId: id,
                achievementId
              }
            });
          })
        );
      }
    }

    return NextResponse.json(
      { message: 'Evidence updated successfully', evidence },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid evidence data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleDeleteEvidence(body) {
  try {
    const { id, userId } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Evidence ID is required' },
        { status: 400 }
      );
    }

    // Check if evidence exists and belongs to user
    const existingEvidence = await prisma.portfolioEvidence.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingEvidence) {
      return NextResponse.json(
        { error: 'Evidence not found or access denied' },
        { status: 404 }
      );
    }

    // Remove achievement associations
    await prisma.portfolioEvidenceAchievement.deleteMany({
      where: { evidenceId: id }
    });

    // Delete evidence
    await prisma.portfolioEvidence.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Evidence deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    throw error;
  }
}

async function handleAddReflection(body) {
  try {
    const { userId, associatedEvidence, ...reflectionData } = reflectionSchema.parse(body);

    const reflection = await prisma.portfolioReflection.create({
      data: {
        ...reflectionData,
        user: { connect: { id: userId } },
        createdAt: new Date()
      }
    });

    // Link to evidence if provided
    if (associatedEvidence && associatedEvidence.length > 0) {
      await Promise.all(
        associatedEvidence.map(async (evidenceId: string) => {
          await prisma.portfolioReflectionEvidence.create({
            data: {
              reflectionId: reflection.id,
              evidenceId
            }
          });
        })
      );
    }

    return NextResponse.json(
      { message: 'Reflection added successfully', reflection },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid reflection data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleUpdateReflection(body) {
  try {
    const { id, userId, associatedEvidence, ...reflectionData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Reflection ID is required' },
        { status: 400 }
      );
    }

    // Validate reflection data
    reflectionSchema.parse({ userId, associatedEvidence: associatedEvidence || [], ...reflectionData });

    // Check if reflection exists and belongs to user
    const existingReflection = await prisma.portfolioReflection.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingReflection) {
      return NextResponse.json(
        { error: 'Reflection not found or access denied' },
        { status: 404 }
      );
    }

    const reflection = await prisma.portfolioReflection.update({
      where: { id },
      data: {
        ...reflectionData,
        updatedAt: new Date()
      }
    });

    // Update evidence associations if provided
    if (associatedEvidence) {
      // Remove existing associations
      await prisma.portfolioReflectionEvidence.deleteMany({
        where: { reflectionId: id }
      });

      // Add new associations
      if (associatedEvidence.length > 0) {
        await Promise.all(
          associatedEvidence.map(async (evidenceId: string) => {
            await prisma.portfolioReflectionEvidence.create({
              data: {
                reflectionId: id,
                evidenceId
              }
            });
          })
        );
      }
    }

    return NextResponse.json(
      { message: 'Reflection updated successfully', reflection },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid reflection data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleDeleteReflection(body) {
  try {
    const { id, userId } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Reflection ID is required' },
        { status: 400 }
      );
    }

    // Check if reflection exists and belongs to user
    const existingReflection = await prisma.portfolioReflection.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingReflection) {
      return NextResponse.json(
        { error: 'Reflection not found or access denied' },
        { status: 404 }
      );
    }

    // Remove evidence associations
    await prisma.portfolioReflectionEvidence.deleteMany({
      where: { reflectionId: id }
    });

    // Delete reflection
    await prisma.portfolioReflection.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Reflection deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    throw error;
  }
}

async function handleGeneratePortfolioPDF(body) {
  try {
    const { userId, sections, customization } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // In a real implementation, this would generate a PDF
    // For now, we'll just return a success message with the requested sections

    return NextResponse.json(
      { 
        message: 'Portfolio PDF generation started',
        jobId: `pdf-${Date.now()}`,
        sections: sections || 'all',
        customization: customization || 'default'
      },
      { status: 200 }
    );
  } catch (error) {
    throw error;
  }
}

async function handleSharePortfolio(body) {
  try {
    const { userId, sections, expiryDays, accessCode } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // In a real implementation, this would generate a shareable link
    // For now, we'll just return a mock link

    const shareCode = `share-${Math.random().toString(36).substring(2, 10)}`;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (expiryDays || 30));

    return NextResponse.json(
      { 
        message: 'Portfolio shared successfully',
        shareUrl: `https://edpsych-connect.com/portfolio/shared/${shareCode}`,
        expiryDate: expiryDate.toISOString(),
        sections: sections || 'all',
        accessCode: accessCode || null
      },
      { status: 200 }
    );
  } catch (error) {
    throw error;
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const type = url.searchParams.get('type') || 'profile';
    const id = url.searchParams.get('id');
    const visibility = url.searchParams.get('visibility');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    switch (type) {
      case 'profile':
        return getProfile(userId);
      case 'qualifications':
        return getQualifications(userId);
      case 'achievements':
        return getAchievements(userId, visibility);
      case 'evidence':
        return getEvidence(userId, visibility);
      case 'reflections':
        return getReflections(userId, visibility);
      case 'achievement':
        if (!id) {
          return NextResponse.json(
            { error: 'Achievement ID is required' },
            { status: 400 }
          );
        }
        return getAchievementDetails(id, userId);
      case 'evidence-item':
        if (!id) {
          return NextResponse.json(
            { error: 'Evidence ID is required' },
            { status: 400 }
          );
        }
        return getEvidenceDetails(id, userId);
      case 'reflection':
        if (!id) {
          return NextResponse.json(
            { error: 'Reflection ID is required' },
            { status: 400 }
          );
        }
        return getReflectionDetails(id, userId);
      case 'analytics':
        return getPortfolioAnalytics(userId);
      case 'complete':
        return getCompletePortfolio(userId, visibility);
      default:
        return NextResponse.json(
          { error: 'Invalid request type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in portfolio API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getProfile(userId: string) {
  const profile = await prisma.portfolioProfile.findUnique({
    where: { userId }
  });

  const qualifications = await prisma.portfolioQualification.findMany({
    where: { userId },
    orderBy: { year: 'desc' }
  });

  return NextResponse.json({ 
    profile: profile || { userId },
    qualifications
  }, { status: 200 });
}

async function getQualifications(userId: string) {
  const qualifications = await prisma.portfolioQualification.findMany({
    where: { userId },
    orderBy: { year: 'desc' }
  });

  return NextResponse.json({ qualifications }, { status: 200 });
}

async function getAchievements(userId: string, visibility: string | null) {
  const where = { userId };
  
  if (visibility === 'public') {
    where.visibility = 'public';
  }

  const achievements = await prisma.portfolioAchievement.findMany({
    where,
    orderBy: { date: 'desc' }
  });

  return NextResponse.json({ achievements }, { status: 200 });
}

async function getEvidence(userId: string, visibility: string | null) {
  const where = { userId };
  
  if (visibility === 'public') {
    where.visibility = 'public';
  }

  const evidence = await prisma.portfolioEvidence.findMany({
    where,
    orderBy: { date: 'desc' }
  });

  // Get achievement associations for each evidence item
  const evidenceWithAssociations = await Promise.all(
    evidence.map(async (item) => {
      const associations = await prisma.portfolioEvidenceAchievement.findMany({
        where: { evidenceId: item.id },
        include: { achievement: true }
      });

      return {
        ...item,
        associatedAchievements: associations.map((a) => ({
          id: a.achievementId,
          title: a.achievement.title
        }))
      };
    })
  );

  return NextResponse.json({ evidence: evidenceWithAssociations }, { status: 200 });
}

async function getReflections(userId: string, visibility: string | null) {
  const where = { userId };
  
  if (visibility === 'public') {
    where.visibility = 'public';
  }

  const reflections = await prisma.portfolioReflection.findMany({
    where,
    orderBy: { date: 'desc' }
  });

  // Get evidence associations for each reflection
  const reflectionsWithAssociations = await Promise.all(
    reflections.map(async (item) => {
      const associations = await prisma.portfolioReflectionEvidence.findMany({
        where: { reflectionId: item.id },
        include: { evidence: true }
      });

      return {
        ...item,
        associatedEvidence: associations.map((a) => ({
          id: a.evidenceId,
          title: a.evidence.title
        }))
      };
    })
  );

  return NextResponse.json({ reflections: reflectionsWithAssociations }, { status: 200 });
}

async function getAchievementDetails(id: string, userId: string) {
  const achievement = await prisma.portfolioAchievement.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!achievement) {
    return NextResponse.json(
      { error: 'Achievement not found or access denied' },
      { status: 404 }
    );
  }

  // Get associated evidence
  const evidenceAssociations = await prisma.portfolioEvidenceAchievement.findMany({
    where: { achievementId: id },
    include: { evidence: true }
  });

  const associatedEvidence = evidenceAssociations.map((a) => ({
    id: a.evidenceId,
    title: a.evidence.title,
    type: a.evidence.type,
    fileUrl: a.evidence.fileUrl,
    fileType: a.evidence.fileType
  }));

  return NextResponse.json({ 
    achievement,
    associatedEvidence
  }, { status: 200 });
}

async function getEvidenceDetails(id: string, userId: string) {
  const evidence = await prisma.portfolioEvidence.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!evidence) {
    return NextResponse.json(
      { error: 'Evidence not found or access denied' },
      { status: 404 }
    );
  }

  // Get associated achievements
  const achievementAssociations = await prisma.portfolioEvidenceAchievement.findMany({
    where: { evidenceId: id },
    include: { achievement: true }
  });

  const associatedAchievements = achievementAssociations.map((a) => ({
    id: a.achievementId,
    title: a.achievement.title,
    type: a.achievement.type
  }));

  // Get associated reflections
  const reflectionAssociations = await prisma.portfolioReflectionEvidence.findMany({
    where: { evidenceId: id },
    include: { reflection: true }
  });

  const associatedReflections = reflectionAssociations.map((r) => ({
    id: r.reflectionId,
    title: r.reflection.title,
    date: r.reflection.date
  }));

  return NextResponse.json({ 
    evidence,
    associatedAchievements,
    associatedReflections
  }, { status: 200 });
}

async function getReflectionDetails(id: string, userId: string) {
  const reflection = await prisma.portfolioReflection.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!reflection) {
    return NextResponse.json(
      { error: 'Reflection not found or access denied' },
      { status: 404 }
    );
  }

  // Get associated evidence
  const evidenceAssociations = await prisma.portfolioReflectionEvidence.findMany({
    where: { reflectionId: id },
    include: { evidence: true }
  });

  const associatedEvidence = evidenceAssociations.map((a) => ({
    id: a.evidenceId,
    title: a.evidence.title,
    type: a.evidence.type,
    fileUrl: a.evidence.fileUrl,
    fileType: a.evidence.fileType
  }));

  return NextResponse.json({ 
    reflection,
    associatedEvidence
  }, { status: 200 });
}

async function getPortfolioAnalytics(userId: string) {
  // Get counts
  const achievementCount = await prisma.portfolioAchievement.count({
    where: { userId }
  });

  const evidenceCount = await prisma.portfolioEvidence.count({
    where: { userId }
  });

  const reflectionCount = await prisma.portfolioReflection.count({
    where: { userId }
  });

  const qualificationCount = await prisma.portfolioQualification.count({
    where: { userId }
  });

  // Get CPD activities
  const cpdActivities = await prisma.cPDActivity.findMany({
    where: {
      userId,
      status: 'Completed'
    },
    orderBy: {
      date: 'desc'
    },
    take: 5
  });

  // Calculate portfolio completeness
  // This is a simplified calculation - in a real implementation, this would be more sophisticated
  const hasProfile = await prisma.portfolioProfile.findUnique({
    where: { userId }
  });

  const profileScore = hasProfile ? 20 : 0;
  const achievementScore = Math.min(20, achievementCount * 5);
  const evidenceScore = Math.min(20, evidenceCount * 4);
  const reflectionScore = Math.min(20, reflectionCount * 5);
  const qualificationScore = Math.min(20, qualificationCount * 5);

  const portfolioCompleteness = profileScore + achievementScore + evidenceScore + reflectionScore + qualificationScore;

  // Get view data (mock data for now)
  const viewsData = [
    { month: 'Jan', views: Math.floor(Math.random() * 50) },
    { month: 'Feb', views: Math.floor(Math.random() * 50) },
    { month: 'Mar', views: Math.floor(Math.random() * 50) },
    { month: 'Apr', views: Math.floor(Math.random() * 50) },
    { month: 'May', views: Math.floor(Math.random() * 50) },
    { month: 'Jun', views: Math.floor(Math.random() * 50) },
    { month: 'Jul', views: Math.floor(Math.random() * 50) },
    { month: 'Aug', views: Math.floor(Math.random() * 50) },
    { month: 'Sep', views: Math.floor(Math.random() * 50) },
    { month: 'Oct', views: Math.floor(Math.random() * 50) },
    { month: 'Nov', views: Math.floor(Math.random() * 50) },
    { month: 'Dec', views: Math.floor(Math.random() * 50) }
  ];

  const sectionViewsData = [
    { name: 'Profile', value: Math.floor(Math.random() * 40) + 10 },
    { name: 'Achievements', value: Math.floor(Math.random() * 30) + 10 },
    { name: 'Evidence', value: Math.floor(Math.random() * 20) + 10 },
    { name: 'Reflections', value: Math.floor(Math.random() * 15) + 5 },
    { name: 'CPD', value: Math.floor(Math.random() * 10) + 5 }
  ];

  return NextResponse.json({ 
    counts: {
      achievements: achievementCount,
      evidence: evidenceCount,
      reflections: reflectionCount,
      qualifications: qualificationCount
    },
    portfolioCompleteness,
    recentCpdActivities: cpdActivities,
    viewsData,
    sectionViewsData,
    totalCpdPoints: cpdActivities.reduce((sum, activity) => sum + activity.points, 0),
    totalCpdHours: cpdActivities.reduce((sum, activity) => sum + activity.duration, 0)
  }, { status: 200 });
}

async function getCompletePortfolio(userId: string, visibility: string | null) {
  const where = { userId };
  
  if (visibility === 'public') {
    where.visibility = 'public';
  }

  const profile = await prisma.portfolioProfile.findUnique({
    where: { userId }
  });

  const qualifications = await prisma.portfolioQualification.findMany({
    where: { userId },
    orderBy: { year: 'desc' }
  });

  const achievements = await prisma.portfolioAchievement.findMany({
    where: {
      ...where,
      ...(visibility === 'public' ? { visibility: 'public' } : {})
    },
    orderBy: { date: 'desc' }
  });

  const evidence = await prisma.portfolioEvidence.findMany({
    where: {
      ...where,
      ...(visibility === 'public' ? { visibility: 'public' } : {})
    },
    orderBy: { date: 'desc' }
  });

  const reflections = await prisma.portfolioReflection.findMany({
    where: {
      ...where,
      ...(visibility === 'public' ? { visibility: 'public' } : {})
    },
    orderBy: { date: 'desc' }
  });

  // Get CPD activities
  const cpdActivities = await prisma.cPDActivity.findMany({
    where: {
      userId,
      status: 'Completed'
    },
    orderBy: {
      date: 'desc'
    }
  });

  // Get certificates
  const certificates = await prisma.certificate.findMany({
    where: { userId },
    orderBy: { issueDate: 'desc' }
  });

  return NextResponse.json({ 
    profile: profile || { userId },
    qualifications,
    achievements,
    evidence,
    reflections,
    cpdActivities,
    certificates
  }, { status: 200 });
}
