import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for credential verification
const VerificationSchema = z.object({
  credentialId: z.string().optional(),
  transactionId: z.string().optional(),
  verificationCode: z.string().optional(),
  type: z.enum(["credential", "copyright"]),
  network: z.enum(["ethereum", "polygon"]).optional()
});

// Schema for credential issuance
const CredentialIssueSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  recipientId: z.string(),
  recipientName: z.string(),
  issuerName: z.string(),
  type: z.enum(["Certificate", "Badge", "Qualification"]),
  skills: z.array(z.string()),
  expiryDate: z.string().optional(),
  cpdPoints: z.number().optional(),
  cpdCategory: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

// Schema for copyright registration
const CopyrightRegistrationSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  creatorId: z.string(),
  creatorName: z.string(),
  type: z.string(),
  tags: z.array(z.string()),
  license: z.string(),
  contentHash: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

// Define types for the blockchain interaction
type BlockchainAction = 'verify' | 'issue' | 'register';

interface BlockchainData {
  id?: string;
  type?: string;
  network?: string;
  transactionId?: string;
  verificationCode?: string;
  [key: string]: unknown; // Allow for additional properties
}

interface BlockchainResult {
  success: boolean;
  transactionId: string;
  blockNumber: number;
  timestamp: string;
  network: string;
  data?: Record<string, unknown>;
}

// Mock blockchain interaction for development purposes
async function mockBlockchainInteraction(
  action: BlockchainAction, 
  data: BlockchainData
): Promise<BlockchainResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const timestamp = new Date().toISOString();
  const blockNumber = Math.floor(Math.random() * 10000000);
  const transactionId = data.transactionId || 
    `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  
  return {
    success: true,
    transactionId,
    blockNumber,
    timestamp,
    network: data.network || 'polygon',
    data: data
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const transactionId = searchParams.get('transactionId');
  const credentialId = searchParams.get('credentialId');
  const type = searchParams.get('type') as 'credential' | 'copyright';
  
  if (!transactionId && !credentialId) {
    return NextResponse.json({ error: 'Missing transactionId or credentialId parameter' }, { status: 400 });
  }
  
  if (!type || !['credential', 'copyright'].includes(type)) {
    return NextResponse.json({ error: 'Invalid or missing type parameter' }, { status: 400 });
  }
  
  try {
    // Mock verification
    const verificationResult = await mockBlockchainInteraction('verify', {
      transactionId,
      type,
      network: 'polygon'
    });
    
    return NextResponse.json({
      success: true,
      verified: true,
      data: {
        id: credentialId || `${type}-${Math.floor(Math.random() * 1000)}`,
        title: type === 'credential' ? 'Advanced Differentiation Strategies Certificate' : 'Inclusive Classroom Guide',
        issuer: type === 'credential' ? 'EdPsych Professional Development' : null,
        recipient: type === 'credential' ? 'Jane Smith' : null,
        creator: type === 'copyright' ? 'Dr. Emily Johnson' : null,
        issueDate: type === 'credential' ? '2025-01-15T00:00:00Z' : null,
        creationDate: type === 'copyright' ? '2025-02-12T00:00:00Z' : null,
        type: type === 'credential' ? 'Certificate' : 'Document',
        skills: type === 'credential' ? ['Differentiated Instruction', 'Inclusive Education', 'Assessment Design'] : null,
        tags: type === 'copyright' ? ['Inclusion', 'Classroom Management', 'Differentiation', 'Accessibility'] : null,
        description: type === 'credential' 
          ? 'Awarded for completing 30 hours of professional development in advanced differentiation strategies for inclusive classrooms.'
          : 'A comprehensive guide to creating inclusive classroom environments for students with diverse needs.',
        license: type === 'copyright' ? 'Creative Commons BY-NC-SA' : null,
        blockchainData: {
          transactionId: transactionId || verificationResult.transactionId,
          blockNumber: verificationResult.blockNumber,
          timestamp: verificationResult.timestamp,
          network: verificationResult.network
        }
      }
    });
  } catch (error) {
    console.error('Error verifying credential:', error);
    return NextResponse.json({ error: 'Failed to verify credential' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if this is a verification request
    if (body.isVerification) {
      try {
        const validatedData = VerificationSchema.parse(body);
        
        // Mock verification response
        const verificationResult = await mockBlockchainInteraction('verify', validatedData);
        
        return NextResponse.json({
          success: true,
          verified: true,
          verificationData: {
            ...verificationResult.data,
            blockchainData: {
              transactionId: verificationResult.transactionId,
              blockNumber: verificationResult.blockNumber,
              timestamp: verificationResult.timestamp,
              network: verificationResult.network
            }
          }
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        throw error;
      }
    }
    
    // Check if this is a credential issuance request
    if (body.isCredentialIssuance) {
      try {
        const validatedData = CredentialIssueSchema.parse(body);
        
        // Mock credential issuance
        const issuanceResult = await mockBlockchainInteraction('issue', validatedData);
        
        return NextResponse.json({
          success: true,
          credential: {
            id: `cred-${Math.floor(Math.random() * 1000)}`,
            ...validatedData,
            issueDate: new Date().toISOString(),
            status: 'active',
            blockchainData: {
              transactionId: issuanceResult.transactionId,
              blockNumber: issuanceResult.blockNumber,
              timestamp: issuanceResult.timestamp,
              network: issuanceResult.network
            },
            verificationUrl: `https://verify.edpsych.io/credential/${issuanceResult.transactionId}`
          }
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        throw error;
      }
    }
    
    // Check if this is a copyright registration request
    if (body.isCopyrightRegistration) {
      try {
        const validatedData = CopyrightRegistrationSchema.parse(body);
        
        // Mock copyright registration
        const registrationResult = await mockBlockchainInteraction('register', validatedData);
        
        return NextResponse.json({
          success: true,
          copyright: {
            id: `cr-${Math.floor(Math.random() * 1000)}`,
            ...validatedData,
            creationDate: body.creationDate || new Date().toISOString(),
            registrationDate: new Date().toISOString(),
            status: 'registered',
            blockchainData: {
              transactionId: registrationResult.transactionId,
              blockNumber: registrationResult.blockNumber,
              timestamp: registrationResult.timestamp,
              network: registrationResult.network
            },
            verificationUrl: `https://verify.edpsych.io/copyright/${registrationResult.transactionId}`
          }
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        throw error;
      }
    }
    
    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    console.error('Error processing blockchain request:', error);
    return NextResponse.json({ error: 'Failed to process blockchain request' }, { status: 500 });
  }
}
