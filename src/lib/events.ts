// Events module for the EdPsych AI Education Platform
// This is a placeholder implementation that will be expanded in future

// Event types
export enum EventType {
  USER_ACTIVITY = 'user_activity',
  SYSTEM_EVENT = 'system_event',
  PLUGIN_EVENT = 'plugin_event',
  INTEGRATION_EVENT = 'integration_event',
  ERROR_EVENT = 'error_event'
}

// Event priority levels
export enum EventPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Event interface
export interface Event {
  id: string;
  type: EventType;
  source: string;
  timestamp: Date;
  priority: EventPriority;
  payload;
  metadata?: Record<string, any>;
}

// Event emitter
class EventEmitter {
  private listeners: Record<string, Function[]> = {};

  on(eventType: string, callback: Function) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(callback);
    return this;
  }

  off(eventType: string, callback: Function) {
    if (!this.listeners[eventType]) return this;
    this.listeners[eventType] = this.listeners[eventType].filter(
      listener => listener !== callback
    );
    return this;
  }

  emit(eventType: string, event: Event) {
    if (!this.listeners[eventType]) return;
    this.listeners[eventType].forEach(callback => callback(event));
  }
}

// Singleton event bus
export const eventBus = new EventEmitter();

// Helper functions
export function createEvent(
  type: EventType,
  source: string,
  payload,
  priority: EventPriority = EventPriority.MEDIUM,
  metadata?: Record<string, any>
): Event {
  return {
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    source,
    timestamp: new Date(),
    priority,
    payload,
    metadata
  };
}

export function emitEvent(
  type: EventType,
  source: string,
  payload,
  priority: EventPriority = EventPriority.MEDIUM,
  metadata?: Record<string, any>
) {
  const event = createEvent(type, source, payload, priority, metadata);
  eventBus.emit(type, event);
  return event;
}

export function logEvent(event: Event) {
  console.log(`[${event.timestamp.toISOString()}] [${event.type}] [${event.source}] [${event.priority}]`, event.payload);
}

// Default event listeners
eventBus.on(EventType.ERROR_EVENT, (event: Event) => {
  logEvent(event);
  // In a real implementation, this would log to a monitoring service
});

export default {
  EventType,
  EventPriority,
  eventBus,
  createEvent,
  emitEvent,
  logEvent
};
