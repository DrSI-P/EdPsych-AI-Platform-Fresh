/**
 * Plugin Registry
 * 
 * This file implements the plugin registry for the EdPsych-AI-Education-Platform.
 * The registry manages plugin lifecycle, permissions, and access control.
 */

import { 
  BasePlugin, 
  PluginInstance, 
  PluginMetadata, 
  PluginStatus, 
  PluginEventType,
  PluginRegistry as IPluginRegistry
} from './types';
import { db } from '../db';
import { eventBus } from '../events';

// Import the plugins placeholder directly
import pluginsPlaceholder from '../../../plugins';

class PluginRegistry implements IPluginRegistry {
  private plugins: Map<string, BasePlugin> = new Map();
  private instances: Map<string, PluginInstance> = new Map();
  
  /**
   * Register a new plugin with the system
   * Only administrators can register plugins
   */
  async registerPlugin(plugin: BasePlugin): Promise<boolean> {
    try {
      const metadata = plugin.getMetadata();
      
      // Validate plugin metadata
      if (!metadata.id || !metadata.name || !metadata.version) {
        throw new Error('Invalid plugin metadata');
      }
      
      // Check if plugin already exists
      if (this.plugins.has(metadata.id)) {
        throw new Error(`Plugin with ID ${metadata.id} already registered`);
      }
      
      // Create plugin instance
      const instance: PluginInstance = {
        metadata,
        status: PluginStatus.PENDING_APPROVAL, // All plugins start as pending approval
        installedAt: new Date(),
        updatedAt: new Date(),
        usageMetrics: {
          totalUsageCount: 0
        }
      };
      
      // Store plugin in database
      await db.prisma.plugin.create({
        data: {
          id: metadata.id,
          name: metadata.name,
          description: metadata.description,
          version: metadata.version,
          author: metadata.author,
          website: metadata.website || '',
          icon: metadata.icon || '',
          tags: metadata.tags || [],
          supportedFeatures: metadata.supportedFeatures,
          requiredPermissions: metadata.requiredPermissions,
          settings: metadata.settings || {},
          compatibilityVersion: metadata.compatibilityVersion,
          status: instance.status,
          installedAt: instance.installedAt,
          updatedAt: instance.createdAt,
          configuredSettings: {},
        }
      });
      
      // Add to in-memory registry
      this.plugins.set(metadata.id, plugin);
      this.instances.set(metadata.id, instance);
      
      // Emit plugin installed event
      eventBus.emit({
        type: PluginEventType.INSTALLED,
        pluginId: metadata.id,
        timestamp: new Date()
      });
      
      return true;
    } catch (error) {
      console.error('Failed to register plugin:', error);
      return false;
    }
  }
  
  /**
   * Unregister a plugin from the system
   * Only administrators can unregister plugins
   */
  async unregisterPlugin(pluginId: string): Promise<boolean> {
    try {
      const plugin = this.plugins.get(pluginId);
      if (!plugin) {
        throw new Error(`Plugin with ID ${pluginId} not found`);
      }
      
      // Shutdown plugin gracefully
      await plugin.shutdown();
      
      // Remove from database
      await db.prisma.plugin.delete({
        where: { id: pluginId }
      });
      
      // Remove from in-memory registry
      this.plugins.delete(pluginId);
      this.instances.delete(pluginId);
      
      // Emit plugin uninstalled event
      eventBus.emit({
        type: PluginEventType.UNINSTALLED,
        pluginId,
        timestamp: new Date()
      });
      
      return true;
    } catch (error) {
      console.error('Failed to unregister plugin:', error);
      return false;
    }
  }
  
  /**
   * Get a plugin by ID
   */
  getPlugin(pluginId: string): BasePlugin | null {
    return this.plugins.get(pluginId) || null;
  }
  
  /**
   * List all plugins, optionally filtered by status
   */
  listPlugins(status?: PluginStatus): PluginInstance[] {
    const instances = Array.from(this.instances.values());
    
    if (status) {
      return instances.filter(instance => instance.status === status);
    }
    
    return instances;
  }
  
  /**
   * Enable a plugin
   * Only administrators can enable plugins
   */
  async enablePlugin(pluginId: string): Promise<boolean> {
    try {
      const plugin = this.plugins.get(pluginId);
      const instance = this.instances.get(pluginId);
      
      if (!plugin || !instance) {
        throw new Error(`Plugin with ID ${pluginId} not found`);
      }
      
      // Initialize plugin
      const initialized = await plugin.initialize();
      
      if (!initialized) {
        throw new Error(`Failed to initialize plugin ${pluginId}`);
      }
      
      // Update status
      instance.status = PluginStatus.ACTIVE;
      instance.createdAt = new Date();
      
      // Update database
      await db.prisma.plugin.update({
        where: { id: pluginId },
        data: {
          status: instance.status,
          updatedAt: instance.createdAt
        }
      });
      
      // Emit plugin enabled event
      eventBus.emit({
        type: PluginEventType.ENABLED,
        pluginId,
        timestamp: new Date()
      });
      
      return true;
    } catch (error) {
      console.error('Failed to enable plugin:', error);
      
      // Update status to error
      const instance = this.instances.get(pluginId);
      if (instance) {
        instance.status = PluginStatus.ERROR;
        instance.errorMessage = error.message;
        instance.createdAt = new Date();
        
        // Update database
        await db.prisma.plugin.update({
          where: { id: pluginId },
          data: {
            status: instance.status,
            errorMessage: instance.errorMessage,
            updatedAt: instance.createdAt
          }
        });
        
        // Emit plugin error event
        eventBus.emit({
          type: PluginEventType.ERROR,
          pluginId,
          timestamp: new Date(),
          data: { error: error.message }
        });
      }
      
      return false;
    }
  }
  
  /**
   * Disable a plugin
   * Only administrators can disable plugins
   */
  async disablePlugin(pluginId: string): Promise<boolean> {
    try {
      const plugin = this.plugins.get(pluginId);
      const instance = this.instances.get(pluginId);
      
      if (!plugin || !instance) {
        throw new Error(`Plugin with ID ${pluginId} not found`);
      }
      
      // Shutdown plugin
      await plugin.shutdown();
      
      // Update status
      instance.status = PluginStatus.DISABLED;
      instance.createdAt = new Date();
      
      // Update database
      await db.prisma.plugin.update({
        where: { id: pluginId },
        data: {
          status: instance.status,
          updatedAt: instance.createdAt
        }
      });
      
      // Emit plugin disabled event
      eventBus.emit({
        type: PluginEventType.DISABLED,
        pluginId,
        timestamp: new Date()
      });
      
      return true;
    } catch (error) {
      console.error('Failed to disable plugin:', error);
      return false;
    }
  }
  
  /**
   * Update plugin settings
   * Only administrators can update plugin settings
   */
  async updatePluginSettings(pluginId: string, settings: Record<string, any>): Promise<boolean> {
    try {
      const plugin = this.plugins.get(pluginId);
      const instance = this.instances.get(pluginId);
      
      if (!plugin || !instance) {
        throw new Error(`Plugin with ID ${pluginId} not found`);
      }
      
      // Configure plugin with new settings
      const configured = await plugin.configure(settings);
      
      if (!configured) {
        throw new Error(`Failed to configure plugin ${pluginId}`);
      }
      
      // Update instance
      instance.configuredSettings = settings;
      instance.createdAt = new Date();
      
      // Update database
      await db.prisma.plugin.update({
        where: { id: pluginId },
        data: {
          configuredSettings: settings,
          updatedAt: instance.createdAt
        }
      });
      
      // Emit settings updated event
      eventBus.emit({
        type: PluginEventType.SETTINGS_UPDATED,
        pluginId,
        timestamp: new Date(),
        data: { settings }
      });
      
      return true;
    } catch (error) {
      console.error('Failed to update plugin settings:', error);
      return false;
    }
  }
  
  /**
   * Load all plugins from the database on system startup
   */
  async loadPlugins(): Promise<void> {
    try {
      const dbPlugins = await db.prisma.plugin.findMany();
      
      for (const dbPlugin of dbPlugins) {
        try {
          // Create a stub plugin instance
          const plugin: BasePlugin = {
            getMetadata: () => ({
              id: dbPlugin.id,
              name: dbPlugin.name,
              description: dbPlugin.description,
              version: dbPlugin.version,
              author: dbPlugin.author,
              website: dbPlugin.website || '',
              icon: dbPlugin.icon || '',
              tags: dbPlugin.tags as string[] || [],
              supportedFeatures: dbPlugin.supportedFeatures as string[],
              requiredPermissions: dbPlugin.requiredPermissions as string[],
              settings: dbPlugin.settings as Record<string, any> || {},
              compatibilityVersion: dbPlugin.compatibilityVersion,
            }),
            initialize: async () => true,
            shutdown: async () => true,
            configure: async () => true,
            execute: async () => ({ success: false, message: 'Stub implementation' }),
          };
          
          // Create instance
          const instance: PluginInstance = {
            metadata: {
              id: dbPlugin.id,
              name: dbPlugin.name,
              description: dbPlugin.description,
              version: dbPlugin.version,
              author: dbPlugin.author,
              website: dbPlugin.website,
              icon: dbPlugin.icon,
              tags: dbPlugin.tags as string[],
              supportedFeatures: dbPlugin.supportedFeatures as string[],
              requiredPermissions: dbPlugin.requiredPermissions as string[],
              settings: dbPlugin.settings as Record<string, any>,
              compatibilityVersion: dbPlugin.compatibilityVersion,
            },
            status: dbPlugin.status as PluginStatus,
            installedAt: dbPlugin.installedAt,
            updatedAt: dbPlugin.createdAt,
            errorMessage: dbPlugin.errorMessage || undefined,
            configuredSettings: dbPlugin.configuredSettings as Record<string, any>,
            usageMetrics: {
              totalUsageCount: 0, // Would be loaded from a separate metrics table in production
            }
          };
          
          // Add to registry
          this.plugins.set(dbPlugin.id, plugin);
          this.instances.set(dbPlugin.id, instance);
          
          // Initialize if active
          if (instance.status === PluginStatus.ACTIVE) {
            await plugin.initialize();
          }
        } catch (error) {
          console.error(`Failed to load plugin ${dbPlugin.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Failed to load plugins from database:', error);
    }
  }
}

// Export singleton instance
export const pluginRegistry = new PluginRegistry();

// Initialize on server start
export const initializePluginRegistry = async (): Promise<void> => {
  await pluginRegistry.loadPlugins();
};
