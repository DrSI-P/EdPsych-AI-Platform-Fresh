// Comprehensive Knowledge Base for Dr. Scott's Interactive Avatar
// This system provides evidence-based responses across all areas of educational psychology

export interface KnowledgeEntry {
  id: string;
  category: string;
  subcategory?: string;
  keywords: string[];
  userRoles: string[];
  content: {
    general: string;
    student?: string;
    teacher?: string;
    parent?: string;
    professional?: string;
  };
  sources: string[];
  confidence: number;
  lastUpdated: Date;
}

export interface ConversationContext {
  userRole: string;
  previousTopics: string[];
  sessionHistory: string[];
  userPreferences?: {
    responseLength?: 'brief' | 'detailed' | 'comprehensive';
    focusAreas?: string[];
    communicationStyle?: 'formal' | 'conversational' | 'supportive';
  };
}

export class DrScottKnowledgeBase {
  private knowledgeEntries: Map<string, KnowledgeEntry> = new Map();
  private categoryIndex: Map<string, string[]> = new Map();
  private keywordIndex: Map<string, string[]> = new Map();

  constructor() {
    this.initializeKnowledgeBase();
    this.buildIndices();
  }

  private initializeKnowledgeBase(): void {
    const entries: KnowledgeEntry[] = [
      // GREETINGS AND INTRODUCTIONS
      {
        id: 'greeting_general',
        category: 'greetings',
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'greetings'],
        userRoles: ['student', 'teacher', 'parent', 'professional'],
        content: {
          general: "Hello! I'm Dr. Scott I-Patrick, and I'm delighted to meet you. As an Educational Psychologist with over 12 years of experience, I'm here to provide you with evidence-based support and guidance. How can I help you today?",
          student: "Hello! I'm here to support your learning journey. Whether you're facing challenges with schoolwork, need study strategies, or want to understand your learning style better, I'm here to help. What would you like to explore today?",
          teacher: "Welcome! As an educator, you're making such an important difference. I can help with evidence-based classroom strategies, behavior management, assessment techniques, and supporting students with diverse needs. What's on your mind?",
          parent: "Hello! Supporting your child's education is one of the most important things you can do. I can help you understand assessment results, develop home support strategies, navigate school systems, and advocate for your child's needs. How can I assist you?",
          professional: "Greetings, colleague! I'm excited to collaborate with you on supporting students and families. Whether you need consultation on complex cases, want to discuss latest research, or explore intervention strategies, I'm here to help. What would you like to discuss?"
        },
        sources: ['Dr. Scott I-Patrick Professional Profile', 'Educational Psychology Best Practices'],
        confidence: 1.0,
        lastUpdated: new Date()
      },

      // RESTORATIVE JUSTICE
      {
        id: 'restorative_justice_overview',
        category: 'restorative_justice',
        subcategory: 'philosophy',
        keywords: ['restorative justice', 'restorative practices', 'behavior management', 'discipline', 'conflict resolution'],
        userRoles: ['student', 'teacher', 'parent', 'professional'],
        content: {
          general: "Restorative Justice is at the heart of my doctoral research and practice. It's about building relationships, understanding underlying causes of behavior, and creating healing rather than punishment. In schools, this means focusing on repairing harm and strengthening community bonds.",
          student: "Restorative Justice means when conflicts happen, we focus on understanding what went wrong and how to make things better. It's about taking responsibility, making amends, and learning from mistakes rather than just getting punished. This approach helps build stronger relationships and creates a more supportive school environment.",
          teacher: "For teachers, Restorative Justice transforms classroom management. Instead of traditional punishments, we use circle processes, restorative conversations, and community agreements. This approach builds stronger relationships, reduces repeat behaviors, and creates a more positive learning environment where students feel valued and heard.",
          parent: "Restorative Justice in schools means your child learns to take responsibility for their actions while being supported to make positive changes. It focuses on repairing relationships and building empathy rather than exclusionary discipline. This approach helps children develop better social skills and emotional regulation.",
          professional: "My doctoral research explores how Restorative Justice practices can transform school environments. Instead of traditional disciplinary approaches, we focus on understanding why behaviors occur and how we can support positive change through relationship-building and community healing. The evidence shows significant improvements in school climate and student outcomes."
        },
        sources: ['Dr. Scott I-Patrick Doctoral Research', 'Restorative Justice in Education Literature', 'Evidence-Based Practice Guidelines'],
        confidence: 0.98,
        lastUpdated: new Date()
      },

      {
        id: 'restorative_justice_implementation',
        category: 'restorative_justice',
        subcategory: 'implementation',
        keywords: ['circle process', 'restorative conversation', 'community agreement', 'peer mediation', 'conflict resolution'],
        userRoles: ['teacher', 'professional'],
        content: {
          general: "Implementing Restorative Justice requires a systematic approach that includes training, policy development, and cultural change. Key components include circle processes, restorative conversations, and community-building activities.",
          teacher: "Start with building relationships and establishing community agreements in your classroom. Use circle processes for both proactive community building and reactive conflict resolution. When issues arise, focus on three key questions: What happened? Who was affected? How can we make things right? This shifts the focus from punishment to learning and repair.",
          professional: "Successful implementation requires whole-school commitment, staff training, and clear protocols. Begin with pilot programs, provide ongoing professional development, and establish clear referral pathways. Data collection is crucial for demonstrating effectiveness and continuous improvement. Consider starting with proactive circles before implementing reactive processes."
        },
        sources: ['Restorative Justice Implementation Guidelines', 'School-Based Restorative Practices Research'],
        confidence: 0.95,
        lastUpdated: new Date()
      },

      // ASSESSMENTS
      {
        id: 'assessment_overview',
        category: 'assessment',
        subcategory: 'general',
        keywords: ['assessment', 'evaluation', 'testing', 'cognitive assessment', 'academic assessment'],
        userRoles: ['student', 'teacher', 'parent', 'professional'],
        content: {
          general: "Educational psychology assessments are powerful tools for understanding learning needs. I can guide you through various assessment types, from cognitive evaluations to social-emotional assessments, helping you understand what they measure and how to interpret results.",
          student: "Assessments help us understand your unique strengths and learning style. They're not about judging you, but about finding the best ways to support your learning. Different assessments look at different things - some check how you think and solve problems, others look at specific academic skills, and some explore your social and emotional needs.",
          teacher: "Assessments help us understand each student's unique profile. I can guide you through classroom-based assessments, progress monitoring tools, and how to use assessment data to inform your teaching strategies and support planning. The key is using multiple sources of information to get a complete picture.",
          parent: "Assessment results can feel overwhelming, but they're actually roadmaps to understanding your child's strengths and needs. I can help you interpret results, understand recommendations, and know what questions to ask at school meetings. Remember, assessments are just one piece of the puzzle - your observations as a parent are equally valuable.",
          professional: "Assessment is the foundation of effective intervention. I can discuss assessment selection, administration protocols, interpretation frameworks, and how to translate results into actionable intervention plans. It's crucial to consider cultural factors, test validity, and the assessment's purpose when selecting and interpreting measures."
        },
        sources: ['Educational Psychology Assessment Standards', 'Best Practices in Psychological Assessment'],
        confidence: 0.97,
        lastUpdated: new Date()
      },

      {
        id: 'cognitive_assessment',
        category: 'assessment',
        subcategory: 'cognitive',
        keywords: ['IQ test', 'WISC', 'WAIS', 'cognitive ability', 'intelligence testing', 'working memory'],
        userRoles: ['teacher', 'parent', 'professional'],
        content: {
          general: "Cognitive assessments measure various aspects of intellectual functioning, including reasoning, memory, processing speed, and problem-solving abilities. Common tools include the WISC-V for children and WAIS-IV for adults.",
          teacher: "Cognitive assessment results can inform your teaching strategies. For example, if a student has strong verbal reasoning but weak working memory, you might provide written instructions and break tasks into smaller steps. Understanding cognitive profiles helps you differentiate instruction effectively.",
          parent: "Cognitive assessments look at how your child thinks and processes information. They measure different areas like verbal reasoning, visual-spatial skills, working memory, and processing speed. The results help identify your child's cognitive strengths and areas that might need support, which can guide educational planning.",
          professional: "When conducting cognitive assessments, consider the referral question, cultural factors, and the child's background. Look for patterns across subtests, not just overall scores. Consider how cognitive strengths and weaknesses might impact academic performance and daily functioning. Always interpret results within the broader context of the child's life."
        },
        sources: ['WISC-V Technical Manual', 'Cognitive Assessment Best Practices', 'Intellectual Assessment Guidelines'],
        confidence: 0.96,
        lastUpdated: new Date()
      },

      // INTERVENTIONS
      {
        id: 'intervention_overview',
        category: 'intervention',
        subcategory: 'general',
        keywords: ['intervention', 'support', 'strategy', 'treatment', 'therapy', 'help'],
        userRoles: ['student', 'teacher', 'parent', 'professional'],
        content: {
          general: "Evidence-based interventions are the cornerstone of effective educational psychology practice. I can guide you through selecting, implementing, and monitoring interventions that are proven to work for specific learning and behavioral needs.",
          student: "Interventions are strategies that help you learn better and feel more successful at school. We can explore study techniques, organization strategies, ways to manage stress, and approaches that match your learning style. The key is finding what works best for you and practicing these strategies consistently.",
          teacher: "Classroom interventions should be practical and evidence-based. I can help you implement strategies for academic support, behavior management, social-emotional learning, and creating inclusive environments that work for all students. Remember to collect data to monitor progress and adjust strategies as needed.",
          parent: "Home interventions complement what's happening at school. I can suggest strategies for homework support, behavior management, communication skills, and creating structure that supports your child's success. Consistency between home and school approaches is key for effectiveness.",
          professional: "Intervention selection should be based on assessment results, evidence base, and individual needs. Consider the intervention's intensity, duration, and implementation requirements. Always monitor progress through data collection and be prepared to modify approaches based on response to intervention."
        },
        sources: ['Evidence-Based Intervention Guidelines', 'Response to Intervention Research', 'Educational Psychology Intervention Manual'],
        confidence: 0.95,
        lastUpdated: new Date()
      },

      {
        id: 'academic_interventions',
        category: 'intervention',
        subcategory: 'academic',
        keywords: ['reading intervention', 'math support', 'writing help', 'study skills', 'academic support'],
        userRoles: ['student', 'teacher', 'parent', 'professional'],
        content: {
          general: "Academic interventions target specific learning difficulties and should be matched to the student's needs based on assessment results. Effective interventions are systematic, intensive, and progress-monitored.",
          student: "Academic interventions help you build skills in areas where you're struggling. Whether it's reading, math, writing, or study skills, we can find strategies that work for your learning style. The key is consistent practice and celebrating small improvements along the way.",
          teacher: "Implement academic interventions using a tiered approach. Tier 1 includes high-quality classroom instruction for all students. Tier 2 provides targeted small-group interventions for students who need additional support. Tier 3 offers intensive, individualized interventions. Always use progress monitoring to guide decision-making.",
          parent: "Support academic interventions at home by creating a consistent homework routine, providing a quiet study space, and communicating regularly with teachers. Ask about specific strategies being used at school so you can reinforce them at home. Remember that progress takes time and consistency.",
          professional: "Select academic interventions based on the specific skill deficit identified through assessment. Consider the intervention's evidence base, implementation requirements, and progress monitoring procedures. Ensure interventions are delivered with fidelity and adjust intensity based on student response."
        },
        sources: ['Academic Intervention Research', 'RTI Implementation Guidelines', 'Evidence-Based Reading Interventions'],
        confidence: 0.94,
        lastUpdated: new Date()
      },

      // SPECIAL EDUCATIONAL NEEDS
      {
        id: 'sen_overview',
        category: 'special_needs',
        subcategory: 'general',
        keywords: ['special needs', 'SEN', 'disability', 'learning difficulty', 'additional needs', 'inclusion'],
        userRoles: ['student', 'teacher', 'parent', 'professional'],
        content: {
          general: "Supporting students with special educational needs requires understanding individual profiles, implementing appropriate accommodations, and creating inclusive environments where all students can succeed.",
          student: "Having special educational needs means your brain works differently, and that's okay! Everyone learns in their own way. We can work together to find strategies and supports that help you succeed. Your differences can actually be strengths when we find the right approaches.",
          teacher: "Creating inclusive classrooms benefits all students. Use Universal Design for Learning principles, provide multiple means of representation, engagement, and expression. Collaborate with specialists, implement IEP/504 accommodations, and focus on each student's strengths while addressing their needs.",
          parent: "Advocating for your child with special needs is crucial. Learn about your rights, understand your child's needs, and work collaboratively with the school team. Keep detailed records, ask questions, and remember that you know your child best. Your input is valuable in planning appropriate support.",
          professional: "Comprehensive assessment is key to understanding special educational needs. Consider multiple sources of information, cultural factors, and the impact of needs on daily functioning. Collaborate with multidisciplinary teams and ensure interventions are evidence-based and individually tailored."
        },
        sources: ['Special Educational Needs Guidelines', 'Inclusive Education Research', 'Disability Rights in Education'],
        confidence: 0.96,
        lastUpdated: new Date()
      },

      // PLATFORM NAVIGATION
      {
        id: 'platform_overview',
        category: 'platform',
        subcategory: 'navigation',
        keywords: ['EdPsych Connect', 'platform', 'features', 'navigation', 'how to use'],
        userRoles: ['student', 'teacher', 'parent', 'professional'],
        content: {
          general: "EdPsych Connect is a comprehensive educational psychology platform designed to support students, teachers, parents, and professionals. It includes assessment tools, intervention resources, professional development, and collaborative features.",
          student: "EdPsych Connect has tools to help you with your learning. You can access study resources, track your progress, and get personalized support. The platform adapts to your needs and learning style to help you succeed.",
          teacher: "The platform provides evidence-based classroom strategies, assessment tools, intervention resources, and professional development opportunities. You can collaborate with colleagues, access research-based practices, and track student progress.",
          parent: "EdPsych Connect helps you support your child's education. You can access resources for home support, understand assessment results, communicate with teachers, and learn about your child's progress and needs.",
          professional: "The platform offers comprehensive tools for educational psychology practice, including assessment resources, intervention planning, case management, professional development, and collaboration features with other professionals."
        },
        sources: ['EdPsych Connect Platform Documentation', 'User Guide and Training Materials'],
        confidence: 0.98,
        lastUpdated: new Date()
      }
    ];

    // Add all entries to the knowledge base
    entries.forEach(entry => {
      this.knowledgeEntries.set(entry.id, entry);
    });
  }

  private buildIndices(): void {
    // Build category and keyword indices for faster searching
    this.knowledgeEntries.forEach((entry, id) => {
      // Category index
      if (!this.categoryIndex.has(entry.category)) {
        this.categoryIndex.set(entry.category, []);
      }
      this.categoryIndex.get(entry.category)!.push(id);

      // Keyword index
      entry.keywords.forEach(keyword => {
        const normalizedKeyword = keyword.toLowerCase();
        if (!this.keywordIndex.has(normalizedKeyword)) {
          this.keywordIndex.set(normalizedKeyword, []);
        }
        this.keywordIndex.get(normalizedKeyword)!.push(id);
      });
    });
  }

  public findRelevantEntries(query: string, userRole: string, limit: number = 5): KnowledgeEntry[] {
    const queryWords = query.toLowerCase().split(/\s+/);
    const scores = new Map<string, number>();

    // Score entries based on keyword matches
    queryWords.forEach(word => {
      this.keywordIndex.forEach((entryIds, keyword) => {
        if (keyword.includes(word) || word.includes(keyword)) {
          entryIds.forEach(entryId => {
            const entry = this.knowledgeEntries.get(entryId);
            if (entry && entry.userRoles.includes(userRole)) {
              const currentScore = scores.get(entryId) || 0;
              const matchStrength = keyword === word ? 2 : 1; // Exact match gets higher score
              scores.set(entryId, currentScore + matchStrength * entry.confidence);
            }
          });
        }
      });
    });

    // Sort by score and return top entries
    const sortedEntries = Array.from(scores.entries())
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .slice(0, limit)
      .map(([entryId]) => this.knowledgeEntries.get(entryId)!)
      .filter(entry => entry !== undefined);

    return sortedEntries;
  }

  public generateResponse(query: string, context: ConversationContext): string {
    const relevantEntries = this.findRelevantEntries(query, context.userRole, 3);
    
    if (relevantEntries.length === 0) {
      return this.getDefaultResponse(context.userRole);
    }

    // Use the most relevant entry
    const primaryEntry = relevantEntries[0];
    const roleSpecificContent = primaryEntry.content[context.userRole as keyof typeof primaryEntry.content] 
      || primaryEntry.content.general;

    // Add context-aware enhancements
    let response = roleSpecificContent;

    // Add follow-up suggestions based on context
    if (context.previousTopics.length === 0) {
      response += this.getFollowUpSuggestions(primaryEntry.category, context.userRole);
    }

    return response;
  }

  private getDefaultResponse(userRole: string): string {
    const defaultResponses = {
      student: "That's a great question! I'm here to help you with your learning journey. Could you tell me more about what specific area you'd like to explore? I can help with study strategies, understanding your learning style, or any challenges you're facing at school.",
      teacher: "Thank you for that question! As an educator, you're doing important work. I can help with classroom strategies, behavior management, assessment techniques, or supporting students with diverse needs. What specific area would you like to focus on?",
      parent: "I appreciate you reaching out! Supporting your child's education is so important. I can help you understand assessment results, develop home support strategies, navigate school systems, or advocate for your child's needs. What would be most helpful for you right now?",
      professional: "That's an interesting question, colleague! I'm here to collaborate with you on supporting students and families. Whether you need consultation on complex cases, want to discuss latest research, or explore intervention strategies, I'm ready to help. Could you provide more details about what you're looking for?"
    };

    return defaultResponses[userRole as keyof typeof defaultResponses] 
      || "That's a great question! As an Educational Psychologist, I can help you with assessments, interventions, learning strategies, behavioral support, and restorative justice practices. Could you tell me more about what specific area you'd like to explore?";
  }

  private getFollowUpSuggestions(category: string, userRole: string): string {
    const suggestions = {
      restorative_justice: {
        teacher: "\n\nWould you like to explore specific implementation strategies, or learn about circle processes for your classroom?",
        parent: "\n\nWould you like to know more about how restorative practices can be supported at home?",
        professional: "\n\nI can also discuss research findings or help with program implementation planning.",
        student: "\n\nWould you like to learn more about how this approach can help with conflicts or building better relationships?"
      },
      assessment: {
        teacher: "\n\nI can also help with interpreting assessment results or selecting appropriate classroom assessments.",
        parent: "\n\nWould you like help understanding specific assessment results or preparing for school meetings?",
        professional: "\n\nI can discuss assessment selection, administration protocols, or interpretation frameworks.",
        student: "\n\nWould you like to know more about what to expect during assessments or how results can help you?"
      },
      intervention: {
        teacher: "\n\nI can help you implement specific interventions or set up progress monitoring systems.",
        parent: "\n\nWould you like suggestions for supporting interventions at home?",
        professional: "\n\nI can discuss intervention fidelity, progress monitoring, or evidence-based practice selection.",
        student: "\n\nWould you like to explore specific strategies that might help with your learning goals?"
      }
    };

    const categorySuggestions = suggestions[category as keyof typeof suggestions];
    if (categorySuggestions) {
      return categorySuggestions[userRole as keyof typeof categorySuggestions] || "";
    }

    return "\n\nIs there anything specific you'd like to explore further?";
  }

  public addKnowledgeEntry(entry: KnowledgeEntry): void {
    this.knowledgeEntries.set(entry.id, entry);
    this.buildIndices(); // Rebuild indices when adding new entries
  }

  public updateKnowledgeEntry(id: string, updates: Partial<KnowledgeEntry>): boolean {
    const entry = this.knowledgeEntries.get(id);
    if (!entry) return false;

    const updatedEntry = { ...entry, ...updates, lastUpdated: new Date() };
    this.knowledgeEntries.set(id, updatedEntry);
    this.buildIndices(); // Rebuild indices after updates
    return true;
  }

  public getKnowledgeStats(): {
    totalEntries: number;
    categoriesCount: number;
    averageConfidence: number;
    lastUpdated: Date;
  } {
    const entries = Array.from(this.knowledgeEntries.values());
    const totalEntries = entries.length;
    const categoriesCount = this.categoryIndex.size;
    const averageConfidence = entries.reduce((sum, entry) => sum + entry.confidence, 0) / totalEntries;
    const lastUpdated = new Date(Math.max(...entries.map(entry => entry.lastUpdated.getTime())));

    return {
      totalEntries,
      categoriesCount,
      averageConfidence,
      lastUpdated
    };
  }
}

// Singleton instance
let knowledgeBase: DrScottKnowledgeBase | null = null;

export const getKnowledgeBase = (): DrScottKnowledgeBase => {
  if (!knowledgeBase) {
    knowledgeBase = new DrScottKnowledgeBase();
  }
  return knowledgeBase;
};

export default DrScottKnowledgeBase;

