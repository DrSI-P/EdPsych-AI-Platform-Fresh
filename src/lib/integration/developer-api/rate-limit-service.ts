/**
 * API Rate Limiting Service
 * 
 * This service handles rate limiting for the external developer API.
 */

import { ApiUsageLimit, ApiUsage } from './types';

export class ApiRateLimitService {
  private static instance: ApiRateLimitService;
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  /**
   * Get the singleton instance of the API Rate Limit service
   */
  public static getInstance(): ApiRateLimitService {
    if (!ApiRateLimitService.instance) {
      ApiRateLimitService.instance = new ApiRateLimitService();
    }
    return ApiRateLimitService.instance;
  }
  
  /**
   * Check if request is within rate limits
   * 
   * @param apiKeyId The API key ID
   * @param tenantId The tenant ID
   * @param endpoint The API endpoint
   */
  public async checkRateLimit(apiKeyId: string, tenantId: string, endpoint: string): Promise<boolean> {
    try {
      // Get usage limits for this API key
      const limits = await this.getApiKeyLimits(apiKeyId, tenantId);
      
      // Check minute limit
      const minuteUsage = await this.getApiKeyUsage(apiKeyId, tenantId, 'minute');
      if (minuteUsage >= limits.requestsPerMinute) {
        return false;
      }
      
      // Check hour limit
      const hourUsage = await this.getApiKeyUsage(apiKeyId, tenantId, 'hour');
      if (hourUsage >= limits.requestsPerHour) {
        return false;
      }
      
      // Check day limit
      const dayUsage = await this.getApiKeyUsage(apiKeyId, tenantId, 'day');
      if (dayUsage >= limits.requestsPerDay) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking rate limit:', error);
      // Default to allowing the request if there's an error checking limits
      return true;
    }
  }
  
  /**
   * Record API usage
   * 
   * @param apiKeyId The API key ID
   * @param tenantId The tenant ID
   * @param endpoint The API endpoint
   * @param method The HTTP method
   * @param statusCode The HTTP status code
   * @param responseTime The response time in milliseconds
   */
  public async recordUsage(
    apiKeyId: string,
    tenantId: string,
    endpoint: string,
    method: string,
    statusCode: number,
    responseTime: number
  ): Promise<void> {
    try {
      const usage: ApiUsage = {
        apiKeyId,
        tenantId,
        endpoint,
        method,
        statusCode,
        responseTime,
        timestamp: new Date()
      };
      
      await this.storeApiUsage(usage);
    } catch (error) {
      console.error('Error recording API usage:', error);
      // Don't throw error, just log it
    }
  }
  
  /**
   * Get API usage statistics for a tenant
   * 
   * @param tenantId The tenant ID
   * @param period The time period ('day', 'week', 'month')
   */
  public async getUsageStatistics(tenantId: string, period: string): Promise<any> {
    try {
      // Calculate date range based on period
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case 'day':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        default:
          startDate.setDate(startDate.getDate() - 1); // Default to day
      }
      
      // Get usage data from database
      const usageData = await this.getApiUsageData(tenantId, startDate, endDate);
      
      // Process and aggregate data
      const statistics = this.processUsageData(usageData);
      
      return statistics;
    } catch (error) {
      console.error('Error getting API usage statistics:', error);
      throw new Error('Failed to get API usage statistics');
    }
  }
  
  /**
   * Update API usage limits for a key
   * 
   * @param apiKeyId The API key ID
   * @param tenantId The tenant ID
   * @param limits The new usage limits
   */
  public async updateApiKeyLimits(
    apiKeyId: string,
    tenantId: string,
    limits: ApiUsageLimit
  ): Promise<boolean> {
    try {
      // Validate limits
      if (limits.requestsPerMinute <= 0 || limits.requestsPerHour <= 0 || limits.requestsPerDay <= 0) {
        throw new Error('Invalid rate limits');
      }
      
      // Update limits in database
      await this.storeApiKeyLimits(apiKeyId, tenantId, limits);
      
      return true;
    } catch (error) {
      console.error('Error updating API key limits:', error);
      throw new Error('Failed to update API key limits');
    }
  }
  
  // Private helper methods
  
  private async getApiKeyLimits(apiKeyId: string, tenantId: string): Promise<ApiUsageLimit> {
    // Implementation would query database
    // Return default limits if not found
    return {
      requestsPerMinute: 60,
      requestsPerHour: 1000,
      requestsPerDay: 10000
    };
  }
  
  private async getApiKeyUsage(apiKeyId: string, tenantId: string, period: string): Promise<number> {
    // Implementation would query database
    // Calculate start time based on period
    const startTime = new Date();
    
    switch (period) {
      case 'minute':
        startTime.setMinutes(startTime.getMinutes() - 1);
        break;
      case 'hour':
        startTime.setHours(startTime.getHours() - 1);
        break;
      case 'day':
        startTime.setDate(startTime.getDate() - 1);
        break;
    }
    
    // Mock implementation
    return period === 'minute' ? 10 : period === 'hour' ? 100 : 500;
  }
  
  private async storeApiUsage(usage: ApiUsage): Promise<void> {
    // Implementation would store in database
  }
  
  private async getApiUsageData(tenantId: string, startDate: Date, endDate: Date): Promise<ApiUsage[]> {
    // Implementation would query database
    return [
      {
        apiKeyId: 'mock-api-key-id-1',
        tenantId,
        endpoint: '/api/content',
        method: 'GET',
        statusCode: 200,
        responseTime: 150,
        timestamp: new Date(Date.now() - 3600000) // 1 hour ago
      },
      {
        apiKeyId: 'mock-api-key-id-1',
        tenantId,
        endpoint: '/api/assessment',
        method: 'GET',
        statusCode: 200,
        responseTime: 200,
        timestamp: new Date(Date.now() - 7200000) // 2 hours ago
      }
    ];
  }
  
  private processUsageData(usageData: ApiUsage[]): any {
    // Group by endpoint
    const endpointStats: Record<string, any> = {};
    
    usageData.forEach(usage => {
      if (!endpointStats[usage.endpoint]) {
        endpointStats[usage.endpoint] = {
          count: 0,
          avgResponseTime: 0,
          successCount: 0,
          errorCount: 0
        };
      }
      
      const stats = endpointStats[usage.endpoint];
      stats.count++;
      stats.avgResponseTime = ((stats.avgResponseTime * (stats.count - 1)) + usage.responseTime) / stats.count;
      
      if (usage.statusCode >= 200 && usage.statusCode < 400) {
        stats.successCount++;
      } else {
        stats.errorCount++;
      }
    });
    
    // Group by API key
    const keyStats: Record<string, any> = {};
    
    usageData.forEach(usage => {
      if (!keyStats[usage.apiKeyId]) {
        keyStats[usage.apiKeyId] = {
          count: 0,
          avgResponseTime: 0,
          successCount: 0,
          errorCount: 0
        };
      }
      
      const stats = keyStats[usage.apiKeyId];
      stats.count++;
      stats.avgResponseTime = ((stats.avgResponseTime * (stats.count - 1)) + usage.responseTime) / stats.count;
      
      if (usage.statusCode >= 200 && usage.statusCode < 400) {
        stats.successCount++;
      } else {
        stats.errorCount++;
      }
    });
    
    return {
      totalRequests: usageData.length,
      byEndpoint: endpointStats,
      byApiKey: keyStats
    };
  }
  
  private async storeApiKeyLimits(apiKeyId: string, tenantId: string, limits: ApiUsageLimit): Promise<void> {
    // Implementation would store in database
  }
}
