// Real-time WebSocket Manager for Enhanced Biomni AI
// Handles live task updates, equipment monitoring, and collaboration features

export interface RealTimeEvent {
  type: 'task_update' | 'equipment_alert' | 'collaboration_message' | 'system_notification';
  data: any;
  timestamp: number;
  userId?: string;
  laboratoryId?: string;
}

export interface TaskUpdateEvent {
  taskId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  message?: string;
  result?: any;
}

export interface EquipmentAlertEvent {
  equipmentId: string;
  alertType: 'calibration_due' | 'maintenance_required' | 'performance_issue' | 'critical_failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  equipmentName: string;
}

export interface CollaborationMessageEvent {
  messageId: string;
  senderId: string;
  senderName: string;
  content: string;
  taskId?: string;
  timestamp: number;
}

export interface SystemNotificationEvent {
  notificationId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  actionUrl?: string;
}

class RealTimeManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventListeners: Map<string, Set<(event: RealTimeEvent) => void>> = new Map();
  private isConnected = false;
  private userId: string | null = null;
  private laboratoryId: string | null = null;

  constructor() {
    this.setupWebSocket();
  }

  private setupWebSocket() {
    try {
      // Use secure WebSocket in production, regular in development
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = process.env.NEXT_PUBLIC_WS_HOST || window.location.host;
      const wsUrl = `${protocol}//${host}/api/websocket`;

      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
    } catch (error) {
      console.error('Failed to setup WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('🔌 WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Send authentication
      this.send({
        type: 'authenticate',
        data: {
          userId: this.userId,
          laboratoryId: this.laboratoryId
        }
      });
    };

    this.ws.onmessage = (event) => {
      try {
        const realTimeEvent: RealTimeEvent = JSON.parse(event.data);
        this.handleEvent(realTimeEvent);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      this.isConnected = false;
      this.scheduleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.isConnected = false;
    };
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max WebSocket reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    setTimeout(() => {
      console.log(`🔄 Attempting WebSocket reconnection (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.setupWebSocket();
    }, delay);
  }

  private handleEvent(event: RealTimeEvent) {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  private send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  // Public API
  connect(userId: string, laboratoryId: string) {
    this.userId = userId;
    this.laboratoryId = laboratoryId;
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.send({
        type: 'authenticate',
        data: { userId, laboratoryId }
      });
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.userId = null;
    this.laboratoryId = null;
  }

  subscribe(eventType: string, listener: (event: RealTimeEvent) => void) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType)!.add(listener);
  }

  unsubscribe(eventType: string, listener: (event: RealTimeEvent) => void) {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  // Task-specific methods
  subscribeToTaskUpdates(taskId: string, listener: (update: TaskUpdateEvent) => void) {
    this.subscribe('task_update', (event) => {
      if (event.data.taskId === taskId) {
        listener(event.data);
      }
    });
  }

  subscribeToEquipmentAlerts(listener: (alert: EquipmentAlertEvent) => void) {
    this.subscribe('equipment_alert', (event) => {
      listener(event.data);
    });
  }

  subscribeToCollaborationMessages(taskId: string, listener: (message: CollaborationMessageEvent) => void) {
    this.subscribe('collaboration_message', (event) => {
      if (event.data.taskId === taskId) {
        listener(event.data);
      }
    });
  }

  // Send collaboration message
  sendCollaborationMessage(taskId: string, content: string) {
    this.send({
      type: 'collaboration_message',
      data: {
        taskId,
        content,
        timestamp: Date.now()
      }
    });
  }

  // Request task status update
  requestTaskUpdate(taskId: string) {
    this.send({
      type: 'request_task_update',
      data: { taskId }
    });
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts
    };
  }
}

// Singleton instance
export const realTimeManager = new RealTimeManager();

// React hook for real-time updates
export function useRealTimeUpdates() {
  const subscribe = (eventType: string, listener: (event: RealTimeEvent) => void) => {
    realTimeManager.subscribe(eventType, listener);
    return () => realTimeManager.unsubscribe(eventType, listener);
  };

  const subscribeToTask = (taskId: string, listener: (update: TaskUpdateEvent) => void) => {
    realTimeManager.subscribeToTaskUpdates(taskId, listener);
  };

  const subscribeToEquipment = (listener: (alert: EquipmentAlertEvent) => void) => {
    realTimeManager.subscribeToEquipmentAlerts(listener);
  };

  const subscribeToCollaboration = (taskId: string, listener: (message: CollaborationMessageEvent) => void) => {
    realTimeManager.subscribeToCollaborationMessages(taskId, listener);
  };

  const sendMessage = (taskId: string, content: string) => {
    realTimeManager.sendCollaborationMessage(taskId, content);
  };

  const requestUpdate = (taskId: string) => {
    realTimeManager.requestTaskUpdate(taskId);
  };

  const getStatus = () => realTimeManager.getConnectionStatus();

  return {
    subscribe,
    subscribeToTask,
    subscribeToEquipment,
    subscribeToCollaboration,
    sendMessage,
    requestUpdate,
    getStatus
  };
} 