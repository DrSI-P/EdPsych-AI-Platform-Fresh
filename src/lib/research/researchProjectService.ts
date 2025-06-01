/**
 * Research Project Service
 * 
 * This service implements research project management features for the
 * EdPsych-AI-Education-Platform, supporting evidence-based evaluation
 * of educational interventions and outcomes.
 */

import {
  ResearchProjectService,
  ResearchProject,
  ResearchDomain,
  ResearchProjectStatus,
  UKKeyStage
} from './types';

/**
 * Implementation of the Research Project Service
 * 
 * This class provides methods for creating, managing, and analysing
 * research projects within the platform.
 */
export class ResearchProjectServiceImpl implements ResearchProjectService {
  // Research projects storage
  private researchProjects: Map<string, ResearchProject> = new Map();
  
  /**
   * Create a new research project
   * 
   * @param project The research project to create
   * @returns The ID of the created project
   */
  async createProject(project: Omit<ResearchProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    console.log(`Creating research project: ${project.title}`);
    
    // Generate a unique ID for the project
    const id = `project-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create the project with timestamps
    const newProject: ResearchProject = {
      ...project,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Store the project
    this.researchProjects.set(id, newProject);
    
    return id;
  }
  
  /**
   * Get a research project by ID
   * 
   * @param projectId The ID of the project to get
   * @returns The research project or null if not found
   */
  async getProject(projectId: string): Promise<ResearchProject | null> {
    console.log(`Getting research project: ${projectId}`);
    
    // Get the project
    const project = this.researchProjects.get(projectId);
    
    return project || null;
  }
  
  /**
   * Update a research project
   * 
   * @param projectId The ID of the project to update
   * @param updates The updates to apply
   * @returns Whether the update was successful
   */
  async updateProject(projectId: string, updates: Partial<ResearchProject>): Promise<boolean> {
    console.log(`Updating research project: ${projectId}`);
    
    // Get the project
    const project = this.researchProjects.get(projectId);
    
    if (!project) {
      console.error(`Project not found: ${projectId}`);
      return false;
    }
    
    // Apply updates
    const updatedProject: ResearchProject = {
      ...project,
      ...updates,
      id: project.id, // Ensure ID doesn't change
      createdAt: project.createdAt, // Ensure creation date doesn't change
      updatedAt: new Date() // Update the updated timestamp
    };
    
    // Store the updated project
    this.researchProjects.set(projectId, updatedProject);
    
    return true;
  }
  
  /**
   * List research projects based on optional filters
   * 
   * @param filters Optional filters for the projects
   * @returns Array of matching research projects
   */
  async listProjects(filters?: {
    domains?: ResearchDomain[];
    status?: ResearchProjectStatus[];
    keyStages?: UKKeyStage[];
  }): Promise<ResearchProject[]> {
    console.log('Listing research projects');
    
    // Convert the map to an array
    const allProjects = Array.from(this.researchProjects.values());
    
    // If no filters, return all projects
    if (!filters) {
      return allProjects;
    }
    
    // Filter the projects
    return allProjects.filter(project => {
      // Filter by domains
      if (filters.domains && filters.domains.length > 0) {
        const hasMatchingDomain = filters.domains.some(domain => 
          project.domains.includes(domain)
        );
        if (!hasMatchingDomain) return false;
      }
      
      // Filter by status
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(project.status)) return false;
      }
      
      // Filter by key stages
      if (filters.keyStages && filters.keyStages.length > 0) {
        const hasMatchingKeyStage = filters.keyStages.some(keyStage => 
          project.targetPopulation.keyStages.includes(keyStage)
        );
        if (!hasMatchingKeyStage) return false;
      }
      
      return true;
    });
  }
  
  /**
   * Add a collaborator to a research project
   * 
   * @param projectId The ID of the project
   * @param collaborator The collaborator to add
   * @returns Whether the addition was successful
   */
  async addCollaborator(projectId: string, collaborator: {
    id: string;
    role: string;
    organisation?: string;
  }): Promise<boolean> {
    console.log(`Adding collaborator to project ${projectId}: ${collaborator.id}`);
    
    // Get the project
    const project = this.researchProjects.get(projectId);
    
    if (!project) {
      console.error(`Project not found: ${projectId}`);
      return false;
    }
    
    // Check if collaborator already exists
    const existingCollaborator = project.collaborators.find(c => c.id === collaborator.id);
    
    if (existingCollaborator) {
      // Update existing collaborator
      const updatedCollaborators = project.collaborators.map(c => 
        c.id === collaborator.id ? { ...c, ...collaborator } : c
      );
      
      // Update the project
      return this.updateProject(projectId, { collaborators: updatedCollaborators });
    } else {
      // Add new collaborator
      const updatedCollaborators = [...project.collaborators, collaborator];
      
      // Update the project
      return this.updateProject(projectId, { collaborators: updatedCollaborators });
    }
  }
  
  /**
   * Update the status of a research project
   * 
   * @param projectId The ID of the project
   * @param status The new status
   * @returns Whether the update was successful
   */
  async updateProjectStatus(projectId: string, status: ResearchProjectStatus): Promise<boolean> {
    console.log(`Updating project ${projectId} status to: ${status}`);
    
    // Update the project
    return this.updateProject(projectId, { status });
  }
  
  /**
   * Generate a research brief for a project
   * 
   * @param projectId The ID of the project
   * @returns The research brief
   */
  async generateResearchBrief(projectId: string): Promise<{
    projectSummary: string;
    methodology: string;
    timeline: string;
    ethicalConsiderations: string;
    dataManagementSummary: string;
  }> {
    console.log(`Generating research brief for project: ${projectId}`);
    
    // Get the project
    const project = this.researchProjects.get(projectId);
    
    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }
    
    // Generate project summary
    const projectSummary = `
      # ${project.title}
      
      ## Overview
      ${project.description}
      
      ## Research Domains
      ${project.domains.join(', ')}
      
      ## Research Questions
      ${project.researchQuestions.map(q => `- ${q}`).join('\n')}
      
      ## Target Population
      This research targets students in ${project.targetPopulation.keyStages.join(', ')} 
      ${project.targetPopulation.subjects ? `focusing on ${project.targetPopulation.subjects.join(', ')}` : ''}.
      ${project.targetPopulation.specialEducationalNeeds ? 
        `Special educational needs considerations: ${project.targetPopulation.specialEducationalNeeds.join(', ')}.` : ''}
      ${project.targetPopulation.demographicFactors ? 
        `Demographic factors: ${project.targetPopulation.demographicFactors.join(', ')}.` : ''}
      
      ## Sample Size
      Planned: ${project.sampleSize.planned}
      ${project.sampleSize.actual ? `Actual: ${project.sampleSize.actual}` : ''}
    `;
    
    // Generate methodology
    const methodology = `
      # Research Methodology
      
      ## Approach
      This research employs a ${project.methodology} approach.
      
      ## Data Collection Methods
      ${project.dataCollectionMethods.join(', ')}
      
      ${project.hypotheses ? `
      ## Hypotheses
      ${project.hypotheses.map(h => `- ${h}`).join('\n')}
      ` : ''}
    `;
    
    // Generate timeline
    const timeline = `
      # Research Timeline
      
      ## Duration
      Start Date: ${project.timeline.startDate.toDateString()}
      End Date: ${project.timeline.endDate.toDateString()}
      
      ## Key Milestones
      ${project.timeline.milestones.map(m => 
        `- ${m.title}: ${m.date.toDateString()} (${m.completed ? 'Completed' : 'Pending'})`
      ).join('\n')}
    `;
    
    // Generate ethical considerations
    const ethicalConsiderations = `
      # Ethical Considerations
      
      ${project.ethicalConsiderations.map(ec => `- ${ec}`).join('\n')}
      
      ## Ethical Approval
      ${project.ethicalApproval.required ? 
        `Required: Yes\n${project.ethicalApproval.approved ? 
          `Approved: Yes\nApproval Date: ${project.ethicalApproval.approvalDate?.toDateString()}\nReference: ${project.ethicalApproval.approvalReference}` : 
          'Approval Status: Pending'}` : 
        'Required: No'}
    `;
    
    // Generate data management summary
    const dataManagementSummary = `
      # Data Management Plan
      
      ## Storage Location
      ${project.dataManagementPlan.dataStorageLocation}
      
      ## Retention Period
      ${project.dataManagementPlan.retentionPeriod}
      
      ## Anonymization Process
      ${project.dataManagementPlan.anonymizationProcess}
      
      ## Data Access Controls
      ${project.dataManagementPlan.dataAccessControls.map(ac => `- ${ac}`).join('\n')}
    `;
    
    return {
      projectSummary,
      methodology,
      timeline,
      ethicalConsiderations,
      dataManagementSummary
    };
  }
}
