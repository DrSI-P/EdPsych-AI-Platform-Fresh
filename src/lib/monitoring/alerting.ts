/**
 * Monitoring and Alerting Configuration
 * 
 * This module configures alerting for the EdPsych-AI-Education-Platform.
 * It provides tools for setting up alerts based on monitoring data.
 */

import { logError, logInfo } from './logger';

// Define alert levels
export type AlertLevel = 'info' | 'warning' | 'error' | 'critical';

// Define alert channels
export type AlertChannel = 'email' | 'slack' | 'webhook';

// Define alert configuration
export interface AlertConfig {
  name: string;
  description: string;
  level: AlertLevel;
  threshold: number;
  cooldown: number; // in milliseconds
  channels: any[];
  enabled: boolean;
}

// Define alert instance
export interface Alert {
  config: AlertConfig;
  triggered: boolean;
  lastTriggered: number;
  count: number;
}

// Store active alerts
const alerts: Record<string, Alert> = {};

/**
 * Register a new alert
 * 
 * @param config - Alert configuration
 * @returns Alert object
 */
export function registerAlert(config: AlertConfig): Alert {
  const alert: Alert = {
    config,
    triggered: false,
    lastTriggered: 0,
    count: 0,
  };
  
  alerts[config.name] = alert;
  
  logInfo(`Alert registered: ${config.name}`, {
    alertName: config.name,
    alertLevel: config.level,
    alertDescription: config.description,
  });
  
  return alert;
}

/**
 * Trigger an alert
 * 
 * @param name - Alert name
 * @param value - Current value
 * @param context - Additional context
 * @returns Whether the alert was triggered
 */
export function triggerAlert(
  name: string,
  value: number,
  context?: Record<string, any>
): boolean {
  const alert = alerts[name];
  
  if (!alert) {
    logError(`Attempted to trigger unknown alert: ${name}`);
    return false;
  }
  
  if (!alert.config.enabled) {
    return false;
  }
  
  const now = Date.now();
  const cooldownExpired = now - alert.lastTriggered > alert.config.cooldown;
  
  // Check if alert should be triggered
  if (value >= alert.config.threshold && (cooldownExpired || !alert.triggered)) {
    alert.triggered = true;
    alert.lastTriggered = now;
    alert.count++;
    
    // Log the alert
    logInfo(`Alert triggered: ${name}`, {
      alertName: name,
      alertLevel: alert.config.level,
      alertDescription: alert.config.description,
      value,
      threshold: alert.config.threshold,
      count: alert.count,
      context,
    });
    
    // Send alerts to configured channels
    sendAlerts(alert, value, context);
    
    return true;
  } else if (value < alert.config.threshold && alert.triggered) {
    // Reset alert if value is below threshold
    alert.triggered = false;
    
    // Log the alert resolution
    logInfo(`Alert resolved: ${name}`, {
      alertName: name,
      alertLevel: alert.config.level,
      alertDescription: alert.config.description,
      value,
      threshold: alert.config.threshold,
      context,
    });
    
    return false;
  }
  
  return alert.triggered;
}

/**
 * Send alerts to configured channels
 * 
 * @param alert - Alert object
 * @param value - Current value
 * @param context - Additional context
 */
function sendAlerts(
  alert: Alert,
  value: number,
  context?: Record<string, any>
): void {
  const { config } = alert;
  
  // Prepare alert message
  const message = `[${config.level.toUpperCase()}] ${config.name}: ${config.description} (${value} >= ${config.threshold})`;
  
  // Send to each configured channel
  config.channels.forEach(channel => {
    switch (channel) {
      case 'email':
        sendEmailAlert(config.level, message, context);
        break;
      case 'slack':
        sendSlackAlert(config.level, message, context);
        break;
      case 'webhook':
        sendWebhookAlert(config.level, message, context);
        break;
    }
  });
}

/**
 * Send an email alert
 * 
 * @param level - Alert level
 * @param message - Alert message
 * @param context - Additional context
 */
function sendEmailAlert(
  level: AlertLevel,
  message: string,
  context?: Record<string, any>
): void {
  // In a real implementation, this would send an email
  // For now, we just log it
  logInfo(`Email alert would be sent: ${message}`, {
    level,
    message,
    context,
  });
  
  // Example implementation:
  // const emailService = new EmailService();
  // emailService.sendAlert(
  //   process.env.ALERT_EMAIL_RECIPIENTS.split(','),
  //   `EdPsych Platform Alert: ${level.toUpperCase()}`,
  //   message,
  //   context
  // );
}

/**
 * Send a Slack alert
 * 
 * @param level - Alert level
 * @param message - Alert message
 * @param context - Additional context
 */
function sendSlackAlert(
  level: AlertLevel,
  message: string,
  context?: Record<string, any>
): void {
  // In a real implementation, this would send a Slack message
  // For now, we just log it
  logInfo(`Slack alert would be sent: ${message}`, {
    level,
    message,
    context,
  });
  
  // Example implementation:
  // const slackService = new SlackService();
  // slackService.sendAlert(
  //   process.env.SLACK_WEBHOOK_URL,
  //   {
  //     text: message,
  //     color: level === 'info' ? 'good' : level === 'warning' ? 'warning' : 'danger',
  //     fields: context ? Object.entries(context).map(([key, value]) => ({
  //       title: key,
  //       value: JSON.stringify(value),
  //       short: true,
  //     })) : [],
  //   }
  // );
}

/**
 * Send a webhook alert
 * 
 * @param level - Alert level
 * @param message - Alert message
 * @param context - Additional context
 */
function sendWebhookAlert(
  level: AlertLevel,
  message: string,
  context?: Record<string, any>
): void {
  // In a real implementation, this would send a webhook request
  // For now, we just log it
  logInfo(`Webhook alert would be sent: ${message}`, {
    level,
    message,
    context,
  });
  
  // Example implementation:
  // fetch(process.env.ALERT_WEBHOOK_URL, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     level,
  //     message,
  //     timestamp: new Date().toISOString(),
  //     context,
  //   }),
  // }).catch(error => {
  //   logError(`Failed to send webhook alert: ${error.message}`, error);
  // });
}

/**
 * Get all registered alerts
 * 
 * @returns Record of all alerts
 */
export function getAlerts(): Record<string, Alert> {
  return alerts;
}

/**
 * Get a specific alert
 * 
 * @param name - Alert name
 * @returns Alert object or undefined
 */
export function getAlert(name: string): Alert | undefined {
  return alerts[name];
}

/**
 * Enable an alert
 * 
 * @param name - Alert name
 * @returns Whether the alert was enabled
 */
export function enableAlert(name: string): boolean {
  const alert = alerts[name];
  
  if (!alert) {
    logError(`Attempted to enable unknown alert: ${name}`);
    return false;
  }
  
  alert.config.enabled = true;
  
  logInfo(`Alert enabled: ${name}`);
  
  return true;
}

/**
 * Disable an alert
 * 
 * @param name - Alert name
 * @returns Whether the alert was disabled
 */
export function disableAlert(name: string): boolean {
  const alert = alerts[name];
  
  if (!alert) {
    logError(`Attempted to disable unknown alert: ${name}`);
    return false;
  }
  
  alert.config.enabled = false;
  
  logInfo(`Alert disabled: ${name}`);
  
  return true;
}

export default {
  registerAlert,
  triggerAlert,
  getAlerts,
  getAlert,
  enableAlert,
  disableAlert,
};
