'use client';

import React, { useEffect, useState } from 'react';
import { pushNotifications } from '@/lib/mobile/mobileService';
import { NotificationType, NotificationPreferences } from '@/lib/mobile/mobileTypes';

interface PushNotificationManagerProps {
  userId: string;
  deviceId: string;
  apiUrl: string;
  children: React.ReactNode;
  onPermissionChange?: (permission: NotificationPermission) => void;
}

/**
 * PushNotificationManager Component
 * 
 * A component that manages push notifications for the application.
 * It handles permission requests, registration, and notification display.
 */
export const PushNotificationManager: React.FC<PushNotificationManagerProps> = ({
  userId,
  deviceId,
  apiUrl,
  children,
  onPermissionChange
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  // Initialize push notifications
  useEffect(() => {
    const initializeNotifications = async () => {
      // Check if push notifications are supported
      if (!pushNotifications.isSupported()) {
        console.warn('Push notifications are not supported in this browser');
        return;
      }
      
      try {
        // Initialize push notification service
        const success = await pushNotifications.initialize(apiUrl, userId, deviceId);
        setIsInitialized(success);
        
        // Get current permission status
        const permission = pushNotifications.getPermissionStatus();
        setPermissionStatus(permission);
        
        // Notify parent component
        if (onPermissionChange) {
          onPermissionChange(permission);
        }
        
        // Show permission prompt if not granted or denied
        if (permission === 'default') {
          // Wait a bit before showing the prompt to avoid overwhelming the user
          setTimeout(() => {
            setShowPermissionPrompt(true);
          }, 3000);
        }
      } catch (error) {
        console.error('Failed to initialize push notifications:', error);
      }
    };
    
    initializeNotifications();
  }, [apiUrl, userId, deviceId, onPermissionChange]);

  // Request notification permission
  const requestPermission = async () => {
    if (!isInitialized) return;
    
    try {
      const granted = await pushNotifications.requestPermission();
      
      // Update permission status
      const newPermissionStatus = granted ? 'granted' : 'denied';
      setPermissionStatus(newPermissionStatus);
      
      // Notify parent component
      if (onPermissionChange) {
        onPermissionChange(newPermissionStatus);
      }
      
      // Hide permission prompt
      setShowPermissionPrompt(false);
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    }
  };

  // Dismiss permission prompt
  const dismissPermissionPrompt = () => {
    setShowPermissionPrompt(false);
  };

  return (
    <div className="push-notification-manager">
      {showPermissionPrompt && (
        <div className="notification-permission-prompt">
          <div className="prompt-content">
            <div className="prompt-icon">🔔</div>
            <div className="prompt-text">
              <h3>Enable Notifications</h3>
              <p>Stay updated with important information about your learning journey, assignments, and achievements.</p>
            </div>
            <div className="prompt-actions">
              <button 
                className="prompt-allow-button"
                onClick={requestPermission}
              >
                Enable
              </button>
              <button 
                className="prompt-dismiss-button"
                onClick={dismissPermissionPrompt}
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
};

interface NotificationPreferencesManagerProps {
  userId: string;
  deviceId: string;
  initialPreferences?: NotificationPreferences;
  onPreferencesChange?: (preferences: NotificationPreferences) => void;
}

/**
 * NotificationPreferencesManager Component
 * 
 * A component that allows users to manage their notification preferences.
 */
export const NotificationPreferencesManager: React.FC<NotificationPreferencesManagerProps> = ({
  userId,
  deviceId,
  initialPreferences,
  onPreferencesChange
}) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
    if (initialPreferences) {
      return initialPreferences;
    }
    
    // Default preferences
    return {
      userId,
      channels: {
        assessment: {
          enabled: true,
          pushEnabled: true,
          emailEnabled: true,
          inAppEnabled: true,
          quietHoursEnabled: false
        },
        collaboration: {
          enabled: true,
          pushEnabled: true,
          emailEnabled: true,
          inAppEnabled: true,
          quietHoursEnabled: false
        },
        learning_path: {
          enabled: true,
          pushEnabled: true,
          emailEnabled: true,
          inAppEnabled: true,
          quietHoursEnabled: false
        },
        achievement: {
          enabled: true,
          pushEnabled: true,
          emailEnabled: true,
          inAppEnabled: true,
          quietHoursEnabled: false
        },
        reminder: {
          enabled: true,
          pushEnabled: true,
          emailEnabled: true,
          inAppEnabled: true,
          quietHoursEnabled: true,
          quietHoursStart: '22:00',
          quietHoursEnd: '08:00'
        },
        system: {
          enabled: true,
          pushEnabled: true,
          emailEnabled: true,
          inAppEnabled: true,
          quietHoursEnabled: false
        }
      },
      devices: {
        [deviceId]: {
          enabled: true,
          lastRegistered: new Date()
        }
      }
    };
  });

  // Update preferences when initialPreferences change
  useEffect(() => {
    if (initialPreferences) {
      setPreferences(initialPreferences);
    }
  }, [initialPreferences]);

  // Update channel preferences
  const updateChannelPreference = (
    channel: string,
    field: keyof typeof preferences.channels[string],
    value: boolean | string
  ) => {
    setPreferences(prev => {
      const updatedPreferences = {
        ...prev,
        channels: {
          ...prev.channels,
          [channel]: {
            ...prev.channels[channel],
            [field]: value
          }
        }
      };
      
      // Notify parent component
      if (onPreferencesChange) {
        onPreferencesChange(updatedPreferences);
      }
      
      return updatedPreferences;
    });
  };

  // Update device preferences
  const updateDevicePreference = (
    deviceId: string,
    enabled: boolean
  ) => {
    setPreferences(prev => {
      const updatedPreferences = {
        ...prev,
        devices: {
          ...prev.devices,
          [deviceId]: {
            ...prev.devices[deviceId],
            enabled
          }
        }
      };
      
      // Notify parent component
      if (onPreferencesChange) {
        onPreferencesChange(updatedPreferences);
      }
      
      return updatedPreferences;
    });
  };

  // Save preferences
  const savePreferences = async () => {
    try {
      await pushNotifications.updateNotificationPreferences(preferences);
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
    }
  };

  return (
    <div className="notification-preferences">
      <h2>Notification Preferences</h2>
      
      <div className="preferences-section">
        <h3>Notification Channels</h3>
        
        {Object.entries(preferences.channels).map(([channel, settings]) => (
          <div key={channel} className="channel-preference">
            <div className="channel-header">
              <h4>{channel.replace('_', ' ')}</h4>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => updateChannelPreference(channel, 'enabled', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            {settings.enabled && (
              <div className="channel-settings">
                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.pushEnabled}
                      onChange={(e) => updateChannelPreference(channel, 'pushEnabled', e.target.checked)}
                    />
                    Push Notifications
                  </label>
                </div>
                
                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.emailEnabled}
                      onChange={(e) => updateChannelPreference(channel, 'emailEnabled', e.target.checked)}
                    />
                    Email Notifications
                  </label>
                </div>
                
                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.inAppEnabled}
                      onChange={(e) => updateChannelPreference(channel, 'inAppEnabled', e.target.checked)}
                    />
                    In-App Notifications
                  </label>
                </div>
                
                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.quietHoursEnabled}
                      onChange={(e) => updateChannelPreference(channel, 'quietHoursEnabled', e.target.checked)}
                    />
                    Quiet Hours
                  </label>
                </div>
                
                {settings.quietHoursEnabled && (
                  <div className="quiet-hours-settings">
                    <div className="time-setting">
                      <label>From:</label>
                      <input
                        type="time"
                        value={settings.quietHoursStart || '22:00'}
                        onChange={(e) => updateChannelPreference(channel, 'quietHoursStart', e.target.value)}
                      />
                    </div>
                    
                    <div className="time-setting">
                      <label>To:</label>
                      <input
                        type="time"
                        value={settings.quietHoursEnd || '08:00'}
                        onChange={(e) => updateChannelPreference(channel, 'quietHoursEnd', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="preferences-section">
        <h3>Devices</h3>
        
        {Object.entries(preferences.devices).map(([deviceId, settings]) => (
          <div key={deviceId} className="device-preference">
            <div className="device-header">
              <h4>{deviceId === deviceId ? 'This Device' : `Device ${deviceId.substring(0, 8)}...`}</h4>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => updateDevicePreference(deviceId, e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="device-info">
              <p>Last active: {new Date(settings.lastRegistered).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="preferences-actions">
        <button className="save-button" onClick={savePreferences}>
          Save Preferences
        </button>
      </div>
    </div>
  );
};

interface NotificationDisplayProps {
  title: string;
  body: string;
  icon?: string;
  actions?: {
    label: string;
    action: () => void;
  }[];
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

/**
 * NotificationDisplay Component
 * 
 * A component that displays a notification in the UI.
 */
export const NotificationDisplay: React.FC<NotificationDisplayProps> = ({
  title,
  body,
  icon,
  actions = [],
  onClose,
  autoClose = true,
  autoCloseDelay = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-close notification after delay
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay]);

  // Handle close
  const handleClose = () => {
    setIsVisible(false);
    
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="notification-display">
      <div className="notification-content">
        {icon && (
          <div className="notification-icon">
            <img src={icon} alt="" />
          </div>
        )}
        
        <div className="notification-text">
          <h4 className="notification-title">{title}</h4>
          <p className="notification-body">{body}</p>
        </div>
        
        <button className="notification-close" onClick={handleClose}>
          ×
        </button>
      </div>
      
      {actions.length > 0 && (
        <div className="notification-actions">
          {actions.map((action, index) => (
            <button
              key={index}
              className="notification-action"
              onClick={() => {
                action.action();
                handleClose();
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface NotificationCenterProps {
  userId: string;
  onNotificationClick?: (notification) => void;
}

/**
 * NotificationCenter Component
 * 
 * A component that displays a list of notifications and allows users to manage them.
 */
export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  userId,
  onNotificationClick
}) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        const mockNotifications = [
          {
            id: '1',
            type: NotificationType.ASSESSMENT,
            title: 'Assessment Due Soon',
            body: 'Your "Cognitive Development" assessment is due in 2 days.',
            sentAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            read: false
          },
          {
            id: '2',
            type: NotificationType.COLLABORATION,
            title: 'New Comment on Your Project',
            body: 'Sarah left a comment on your "Learning Styles" project.',
            sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            read: true
          },
          {
            id: '3',
            type: NotificationType.ACHIEVEMENT,
            title: 'Achievement Unlocked',
            body: 'You\'ve completed 5 assessments in a row. Great consistency!',
            sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
            read: false
          }
        ];
        
        setNotifications(mockNotifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, [userId]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      // In a real implementation, this would call an API
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      // In a real implementation, this would call an API
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    // Mark as read
    markAsRead(notification.id);
    
    // Notify parent component
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'all'
    ? notifications
    : notifications.filter(notification => !notification.read);

  // Get unread count
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="notification-centre">
      <div className="notification-header">
        <h2>Notifications</h2>
        
        <div className="notification-tabs">
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            Unread ({unreadCount})
          </button>
        </div>
        
        {unreadCount > 0 && (
          <button className="mark-all-read" onClick={markAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="notification-list">
        {isLoading ? (
          <div className="loading-indicator">Loading notifications...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <p>No {activeTab === 'unread' ? 'unread ' : ''}notifications</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className={`notification-type ${notification.type}`}></div>
              <div className="notification-content">
                <h4 className="notification-title">{notification.title}</h4>
                <p className="notification-body">{notification.body}</p>
                <div className="notification-meta">
                  <span className="notification-time">
                    {formatRelativeTime(notification.sentAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Helper function to format relative time
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  
  return date.toLocaleDateString();
};

export default PushNotificationManager;
