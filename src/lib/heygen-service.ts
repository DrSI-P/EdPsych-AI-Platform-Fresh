// HeyGen Interactive Avatar API Service
// This service handles all interactions with HeyGen's Interactive Avatar API

export interface HeyGenConfig {
  apiKey: string;
  baseUrl?: string;
  avatarId?: string;
  voiceId?: string;
}

export interface HeyGenSession {
  sessionId: string;
  avatarId: string;
  status: 'initializing' | 'ready' | 'speaking' | 'listening' | 'error' | 'closed';
  createdAt: Date;
  lastActivity: Date;
}

export interface HeyGenMessage {
  text: string;
  sessionId: string;
  timestamp: Date;
  metadata?: {
    userRole?: string;
    context?: string;
    priority?: 'low' | 'medium' | 'high';
  };
}

export interface HeyGenResponse {
  sessionId: string;
  audioUrl?: string;
  videoUrl?: string;
  text: string;
  duration?: number;
  timestamp: Date;
  confidence?: number;
}

class HeyGenInteractiveAvatarService {
  private config: HeyGenConfig;
  private sessions: Map<string, HeyGenSession> = new Map();
  private isInitialized: boolean = false;

  constructor(config: HeyGenConfig) {
    this.config = {
      baseUrl: 'https://api.heygen.com/v1',
      ...config
    };
  }

  /**
   * Initialize the HeyGen service
   */
  async initialize(): Promise<boolean> {
    try {
      // Validate API key and connection
      const response = await fetch(`${this.config.baseUrl}/avatar/list`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HeyGen API authentication failed: ${response.status}`);
      }

      this.isInitialized = true;
      console.log('HeyGen Interactive Avatar service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize HeyGen service:', error);
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * Create a new Interactive Avatar session
   */
  async createSession(avatarId?: string): Promise<HeyGenSession | null> {
    if (!this.isInitialized) {
      console.error('HeyGen service not initialized');
      return null;
    }

    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const useAvatarId = avatarId || this.config.avatarId;

      if (!useAvatarId) {
        throw new Error('Avatar ID is required to create a session');
      }

      // Create session with HeyGen API
      const response = await fetch(`${this.config.baseUrl}/streaming.new`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          avatar_id: useAvatarId,
          voice_id: this.config.voiceId,
          quality: 'high',
          session_id: sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create HeyGen session: ${response.status}`);
      }

      const sessionData = await response.json();
      
      const session: HeyGenSession = {
        sessionId: sessionData.session_id || sessionId,
        avatarId: useAvatarId,
        status: 'initializing',
        createdAt: new Date(),
        lastActivity: new Date()
      };

      this.sessions.set(session.sessionId, session);
      
      // Start session
      await this.startSession(session.sessionId);
      
      return session;
    } catch (error) {
      console.error('Failed to create HeyGen session:', error);
      return null;
    }
  }

  /**
   * Start an Interactive Avatar session
   */
  async startSession(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.error('Session not found:', sessionId);
      return false;
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/streaming.start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to start HeyGen session: ${response.status}`);
      }

      session.status = 'ready';
      session.lastActivity = new Date();
      
      console.log('HeyGen session started successfully:', sessionId);
      return true;
    } catch (error) {
      console.error('Failed to start HeyGen session:', error);
      session.status = 'error';
      return false;
    }
  }

  /**
   * Send a message to the Interactive Avatar
   */
  async sendMessage(message: HeyGenMessage): Promise<HeyGenResponse | null> {
    const session = this.sessions.get(message.sessionId);
    if (!session || session.status !== 'ready') {
      console.error('Session not ready for messages:', message.sessionId);
      return null;
    }

    try {
      session.status = 'speaking';
      session.lastActivity = new Date();

      const response = await fetch(`${this.config.baseUrl}/streaming.task`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: message.sessionId,
          text: message.text,
          task_type: 'talk',
          task_mode: 'sync'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send message to HeyGen: ${response.status}`);
      }

      const responseData = await response.json();
      
      session.status = 'ready';
      
      const heygenResponse: HeyGenResponse = {
        sessionId: message.sessionId,
        text: responseData.text || message.text,
        audioUrl: responseData.audio_url,
        videoUrl: responseData.video_url,
        duration: responseData.duration,
        timestamp: new Date(),
        confidence: responseData.confidence || 1.0
      };

      return heygenResponse;
    } catch (error) {
      console.error('Failed to send message to HeyGen:', error);
      session.status = 'error';
      return null;
    }
  }

  /**
   * Close an Interactive Avatar session
   */
  async closeSession(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.error('Session not found:', sessionId);
      return false;
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/streaming.stop`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: sessionId
        })
      });

      if (!response.ok) {
        console.warn(`Failed to properly close HeyGen session: ${response.status}`);
      }

      session.status = 'closed';
      this.sessions.delete(sessionId);
      
      console.log('HeyGen session closed:', sessionId);
      return true;
    } catch (error) {
      console.error('Failed to close HeyGen session:', error);
      return false;
    }
  }

  /**
   * Get session status
   */
  getSessionStatus(sessionId: string): HeyGenSession | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * List all active sessions
   */
  getActiveSessions(): HeyGenSession[] {
    return Array.from(this.sessions.values()).filter(
      session => session.status !== 'closed' && session.status !== 'error'
    );
  }

  /**
   * Cleanup inactive sessions
   */
  async cleanupInactiveSessions(maxInactiveMinutes: number = 30): Promise<void> {
    const now = new Date();
    const inactiveSessions = Array.from(this.sessions.values()).filter(session => {
      const inactiveTime = now.getTime() - session.lastActivity.getTime();
      return inactiveTime > maxInactiveMinutes * 60 * 1000;
    });

    for (const session of inactiveSessions) {
      await this.closeSession(session.sessionId);
    }
  }

  /**
   * Get service health status
   */
  getHealthStatus(): {
    isInitialized: boolean;
    activeSessions: number;
    totalSessions: number;
  } {
    return {
      isInitialized: this.isInitialized,
      activeSessions: this.getActiveSessions().length,
      totalSessions: this.sessions.size
    };
  }
}

// Singleton instance for the service
let heygenService: HeyGenInteractiveAvatarService | null = null;

/**
 * Initialize the HeyGen service with configuration
 */
export const initializeHeyGenService = async (config: HeyGenConfig): Promise<boolean> => {
  try {
    heygenService = new HeyGenInteractiveAvatarService(config);
    return await heygenService.initialize();
  } catch (error) {
    console.error('Failed to initialize HeyGen service:', error);
    return false;
  }
};

/**
 * Get the HeyGen service instance
 */
export const getHeyGenService = (): HeyGenInteractiveAvatarService | null => {
  return heygenService;
};

/**
 * Demo/fallback service for when HeyGen is not available
 */
export class DemoAvatarService {
  private sessions: Map<string, HeyGenSession> = new Map();

  async createSession(): Promise<HeyGenSession> {
    const sessionId = `demo_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: HeyGenSession = {
      sessionId,
      avatarId: 'demo_avatar',
      status: 'ready',
      createdAt: new Date(),
      lastActivity: new Date()
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  async sendMessage(message: HeyGenMessage): Promise<HeyGenResponse> {
    const session = this.sessions.get(message.sessionId);
    if (session) {
      session.lastActivity = new Date();
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    return {
      sessionId: message.sessionId,
      text: this.generateDemoResponse(message.text, message.metadata?.userRole),
      timestamp: new Date(),
      confidence: 0.95
    };
  }

  private generateDemoResponse(input: string, userRole?: string): string {
    // This would be replaced with the actual knowledge base responses
    const responses = {
      default: "Thank you for your question. As an Educational Psychologist, I'm here to provide evidence-based guidance and support. Could you tell me more about what specific area you'd like to explore?",
      greeting: "Hello! I'm Dr. Scott I-Patrick, and I'm delighted to meet you. How can I help you today?",
      restorative: "Restorative Justice is at the heart of my practice. It focuses on building relationships and understanding underlying causes of behavior.",
      assessment: "Educational assessments help us understand learning needs and develop appropriate support strategies.",
      intervention: "Evidence-based interventions are tailored to individual needs and implemented with careful monitoring."
    };

    const input_lower = input.toLowerCase();
    
    if (input_lower.includes('hello') || input_lower.includes('hi')) {
      return responses.greeting;
    } else if (input_lower.includes('restorative') || input_lower.includes('justice')) {
      return responses.restorative;
    } else if (input_lower.includes('assessment') || input_lower.includes('test')) {
      return responses.assessment;
    } else if (input_lower.includes('intervention') || input_lower.includes('strategy')) {
      return responses.intervention;
    }
    
    return responses.default;
  }

  async closeSession(sessionId: string): Promise<boolean> {
    this.sessions.delete(sessionId);
    return true;
  }

  getSessionStatus(sessionId: string): HeyGenSession | null {
    return this.sessions.get(sessionId) || null;
  }
}

export default HeyGenInteractiveAvatarService;

