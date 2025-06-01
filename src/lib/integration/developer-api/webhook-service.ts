/**
 * API Webhook Service
 * 
 * This service handles webhook management for the external developer API.
 */

import crypto from 'crypto';
import { ApiWebhook, ApiWebhookEvent } from './types';

export class ApiWebhookService {
  private static instance: ApiWebhookService;
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  /**
   * Get the singleton instance of the API Webhook service
   */
  public static getInstance(): ApiWebhookService {
    if (!ApiWebhookService.instance) {
      ApiWebhookService.instance = new ApiWebhookService();
    }
    return ApiWebhookService.instance;
  }
  
  /**
   * Register a new webhook
   * 
   * @param tenantId The tenant ID
   * @param apiKeyId The API key ID
   * @param url The webhook URL
   * @param events The events to subscribe to
   */
  public async registerWebhook(
    tenantId: string,
    apiKeyId: string,
    url: string,
    events: string[]
  ): Promise<ApiWebhook> {
    try {
      // Validate URL
      if (!this.isValidUrl(url)) {
        throw new Error('Invalid webhook URL');
      }
      
      // Validate events
      if (!events || events.length === 0) {
        throw new Error('At least one event must be specified');
      }
      
      // Generate webhook secret
      const secret = this.generateSecret();
      
      // Create webhook
      const webhook: ApiWebhook = {
        id: crypto.randomUUID(),
        tenantId,
        apiKeyId,
        url,
        secret,
        events,
        active: true,
        failureCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Store webhook in database
      await this.storeWebhook(webhook);
      
      return webhook;
    } catch (error) {
      console.error('Error registering webhook:', error);
      throw new Error('Failed to register webhook');
    }
  }
  
  /**
   * Update an existing webhook
   * 
   * @param webhookId The webhook ID
   * @param tenantId The tenant ID
   * @param updates The webhook updates
   */
  public async updateWebhook(
    webhookId: string,
    tenantId: string,
    updates: Partial<ApiWebhook>
  ): Promise<ApiWebhook> {
    try {
      // Find webhook in database
      const webhook = await this.findWebhook(webhookId, tenantId);
      
      if (!webhook) {
        throw new Error('Webhook not found');
      }
      
      // Validate URL if provided
      if (updates.url && !this.isValidUrl(updates.url)) {
        throw new Error('Invalid webhook URL');
      }
      
      // Validate events if provided
      if (updates.events && updates.events.length === 0) {
        throw new Error('At least one event must be specified');
      }
      
      // Update webhook
      const updatedWebhook: ApiWebhook = {
        ...webhook,
        url: updates.url || webhook.url,
        events: updates.events || webhook.events,
        active: updates.active !== undefined ? updates.active : webhook.active,
        updatedAt: new Date()
      };
      
      // Store updated webhook in database
      await this.updateWebhookInDb(updatedWebhook);
      
      return updatedWebhook;
    } catch (error) {
      console.error('Error updating webhook:', error);
      throw new Error('Failed to update webhook');
    }
  }
  
  /**
   * Delete a webhook
   * 
   * @param webhookId The webhook ID
   * @param tenantId The tenant ID
   */
  public async deleteWebhook(webhookId: string, tenantId: string): Promise<boolean> {
    try {
      // Find webhook in database
      const webhook = await this.findWebhook(webhookId, tenantId);
      
      if (!webhook) {
        throw new Error('Webhook not found');
      }
      
      // Delete webhook from database
      await this.deleteWebhookFromDb(webhookId);
      
      return true;
    } catch (error) {
      console.error('Error deleting webhook:', error);
      throw new Error('Failed to delete webhook');
    }
  }
  
  /**
   * List webhooks for an API key
   * 
   * @param apiKeyId The API key ID
   * @param tenantId The tenant ID
   */
  public async listWebhooks(apiKeyId: string, tenantId: string): Promise<ApiWebhook[]> {
    try {
      // Find webhooks in database
      const webhooks = await this.findWebhooksByApiKey(apiKeyId, tenantId);
      
      // Remove secret from response
      return webhooks.map(webhook => {
        const { secret, ...webhookWithoutSecret } = webhook;
        return webhookWithoutSecret as ApiWebhook;
      });
    } catch (error) {
      console.error('Error listing webhooks:', error);
      throw new Error('Failed to list webhooks');
    }
  }
  
  /**
   * Trigger webhook events
   * 
   * @param tenantId The tenant ID
   * @param event The event type
   * @param payload The event payload
   */
  public async triggerEvent(tenantId: string, event: string, payload: any): Promise<void> {
    try {
      // Find webhooks subscribed to this event
      const webhooks = await this.findWebhooksByEvent(tenantId, event);
      
      // Create webhook events
      const webhookEvents = webhooks.map(webhook => ({
        id: crypto.randomUUID(),
        webhookId: webhook.id,
        tenantId,
        event,
        payload,
        status: 'pending',
        attempts: 0,
        createdAt: new Date()
      }));
      
      // Store webhook events in database
      await Promise.all(webhookEvents.map(this.storeWebhookEvent.bind(this)));
      
      // Process webhook events asynchronously
      this.processWebhookEvents(webhookEvents, webhooks);
    } catch (error) {
      console.error('Error triggering webhook event:', error);
      // Don't throw error, just log it
    }
  }
  
  /**
   * Generate signature for webhook payload
   * 
   * @param payload The payload to sign
   * @param secret The webhook secret
   */
  public generateSignature(payload: any, secret: string): string {
    const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
    return crypto.createHmac('sha256', secret).update(payloadString).digest('hex');
  }
  
  // Private helper methods
  
  private isValidUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'https:';
    } catch (error) {
      return false;
    }
  }
  
  private generateSecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }
  
  private async storeWebhook(webhook: ApiWebhook): Promise<void> {
    // Implementation would store in database
  }
  
  private async findWebhook(webhookId: string, tenantId: string): Promise<ApiWebhook | null> {
    // Implementation would query database
    return {
      id: webhookId,
      tenantId,
      apiKeyId: 'mock-api-key-id',
      url: 'https://example.com/webhook',
      secret: 'mock-secret',
      events: ['content.created', 'content.updated'],
      active: true,
      failureCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  private async updateWebhookInDb(webhook: ApiWebhook): Promise<void> {
    // Implementation would update database
  }
  
  private async deleteWebhookFromDb(webhookId: string): Promise<void> {
    // Implementation would delete from database
  }
  
  private async findWebhooksByApiKey(apiKeyId: string, tenantId: string): Promise<ApiWebhook[]> {
    // Implementation would query database
    return [
      {
        id: 'mock-webhook-id-1',
        tenantId,
        apiKeyId,
        url: 'https://example.com/webhook1',
        secret: 'mock-secret-1',
        events: ['content.created', 'content.updated'],
        active: true,
        failureCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'mock-webhook-id-2',
        tenantId,
        apiKeyId,
        url: 'https://example.com/webhook2',
        secret: 'mock-secret-2',
        events: ['assessment.completed'],
        active: true,
        failureCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
  
  private async findWebhooksByEvent(tenantId: string, event: string): Promise<ApiWebhook[]> {
    // Implementation would query database
    return [
      {
        id: 'mock-webhook-id-1',
        tenantId,
        apiKeyId: 'mock-api-key-id-1',
        url: 'https://example.com/webhook1',
        secret: 'mock-secret-1',
        events: [event, 'content.updated'],
        active: true,
        failureCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
  
  private async storeWebhookEvent(event: ApiWebhookEvent): Promise<void> {
    // Implementation would store in database
  }
  
  private async processWebhookEvents(events: ApiWebhookEvent[], webhooks: ApiWebhook[]): Promise<void> {
    // Process each event
    for (const event of events) {
      const webhook = webhooks.find(w => w.id === event.webhookId);
      
      if (!webhook || !webhook.active) {
        continue;
      }
      
      try {
        // Generate signature
        const signature = this.generateSignature(event.payload, webhook.secret);
        
        // Send webhook request
        const response = await this.sendWebhookRequest(webhook.url, {
          id: event.id,
          event: event.event,
          payload: event.payload,
          timestamp: event.createdAt.toISOString()
        }, signature);
        
        // Update event status
        await this.updateWebhookEvent(event.id, {
          status: 'delivered',
          attempts: event.attempts + 1,
          lastAttemptAt: new Date()
        });
        
        // Reset failure count if successful
        if (webhook.failureCount > 0) {
          await this.updateWebhookInDb({
            ...webhook,
            failureCount: 0,
            updatedAt: new Date()
          });
        }
      } catch (error) {
        console.error(`Error sending webhook ${event.id} to ${webhook.url}:`, error);
        
        // Update event status
        await this.updateWebhookEvent(event.id, {
          status: 'failed',
          attempts: event.attempts + 1,
          lastAttemptAt: new Date()
        });
        
        // Increment failure count
        await this.updateWebhookInDb({
          ...webhook,
          failureCount: webhook.failureCount + 1,
          updatedAt: new Date()
        });
        
        // Disable webhook if too many failures
        if (webhook.failureCount >= 5) {
          await this.updateWebhookInDb({
            ...webhook,
            active: false,
            updatedAt: new Date()
          });
        }
      }
    }
  }
  
  private async sendWebhookRequest(url: string, data: any, signature: string): Promise<any> {
    // Implementation would send HTTP request
    // This is a mock implementation
    return { success: true };
  }
  
  private async updateWebhookEvent(eventId: string, updates: Partial<ApiWebhookEvent>): Promise<void> {
    // Implementation would update database
  }
}
