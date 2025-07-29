import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'CALIBRATION_DUE' | 'COMPLIANCE_FAILURE' | 'EQUIPMENT_MAINTENANCE' | 'SYSTEM_ALERT' | 'BILLING';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  equipmentId?: string;
  calibrationId?: string;
  action?: 'view_equipment' | 'start_calibration' | 'view_report';
  scheduled?: boolean;
  scheduledAt?: Date;
  createdAt: Date;
}

class PushNotificationService {
  private static instance: PushNotificationService;
  private isInitialized = false;

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async initialize() {
    if (this.isInitialized) return;

    // Configure push notifications
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
        // Send token to server
        this.sendTokenToServer(token);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        this.handleNotification(notification);
      },

      // (optional) Called when Registered Action is pressed, invokeToken: true will fire onRegister when there is a silent push (iOS 8+) (optional: default false)
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - false: required to manually call `notifications.getInitialNotification()`
       */
      requestPermissions: Platform.OS === 'ios',
    });

    // Create notification channel for Android
    if (Platform.OS === 'android') {
      this.createNotificationChannels();
    }

    this.isInitialized = true;
  }

  private createNotificationChannels() {
    // Calibration notifications
    PushNotification.createChannel(
      {
        channelId: 'calibrations',
        channelName: 'Calibration Notifications',
        channelDescription: 'Notifications for equipment calibrations',
        playSound: true,
        soundName: 'default',
        importance: 4, // IMPORTANCE_HIGH
        vibrate: true,
      },
      (created) => console.log(`Calibration channel created: ${created}`)
    );

    // Compliance notifications
    PushNotification.createChannel(
      {
        channelId: 'compliance',
        channelName: 'Compliance Notifications',
        channelDescription: 'Notifications for compliance alerts',
        playSound: true,
        soundName: 'default',
        importance: 5, // IMPORTANCE_MAX
        vibrate: true,
      },
      (created) => console.log(`Compliance channel created: ${created}`)
    );

    // Maintenance notifications
    PushNotification.createChannel(
      {
        channelId: 'maintenance',
        channelName: 'Maintenance Notifications',
        channelDescription: 'Notifications for equipment maintenance',
        playSound: true,
        soundName: 'default',
        importance: 3, // IMPORTANCE_DEFAULT
        vibrate: true,
      },
      (created) => console.log(`Maintenance channel created: ${created}`)
    );

    // System notifications
    PushNotification.createChannel(
      {
        channelId: 'system',
        channelName: 'System Notifications',
        channelDescription: 'General system notifications',
        playSound: false,
        soundName: 'default',
        importance: 2, // IMPORTANCE_LOW
        vibrate: false,
      },
      (created) => console.log(`System channel created: ${created}`)
    );
  }

  // Send local notification immediately
  async sendLocalNotification(notification: Omit<NotificationData, 'id' | 'createdAt'>) {
    const notificationData: NotificationData = {
      ...notification,
      id: `local_${Date.now()}`,
      createdAt: new Date(),
    };

    const channelId = this.getChannelId(notification.type);
    const priority = this.getPriority(notification.priority);

    PushNotification.localNotification({
      channelId,
      title: notification.title,
      message: notification.message,
      playSound: true,
      soundName: 'default',
      importance: priority,
      vibrate: true,
      vibration: 300,
      priority: priority,
      autoCancel: true,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      bigText: notification.message,
      subText: notification.type.replace('_', ' '),
      color: this.getNotificationColor(notification.type),
      number: 1,
      actions: this.getNotificationActions(notification),
      userInfo: {
        ...notificationData,
        type: notification.type,
        equipmentId: notification.equipmentId,
        calibrationId: notification.calibrationId,
        action: notification.action,
      },
    });

    // Store notification locally
    await this.storeNotification(notificationData);
  }

  // Schedule local notification
  async scheduleLocalNotification(
    notification: Omit<NotificationData, 'id' | 'createdAt'>,
    date: Date
  ) {
    const notificationData: NotificationData = {
      ...notification,
      id: `scheduled_${Date.now()}`,
      createdAt: new Date(),
      scheduled: true,
      scheduledAt: date,
    };

    const channelId = this.getChannelId(notification.type);
    const priority = this.getPriority(notification.priority);

    PushNotification.localNotificationSchedule({
      channelId,
      title: notification.title,
      message: notification.message,
      date,
      playSound: true,
      soundName: 'default',
      importance: priority,
      vibrate: true,
      vibration: 300,
      priority: priority,
      autoCancel: true,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      bigText: notification.message,
      subText: notification.type.replace('_', ' '),
      color: this.getNotificationColor(notification.type),
      number: 1,
      actions: this.getNotificationActions(notification),
      userInfo: {
        ...notificationData,
        type: notification.type,
        equipmentId: notification.equipmentId,
        calibrationId: notification.calibrationId,
        action: notification.action,
      },
    });

    // Store scheduled notification
    await this.storeNotification(notificationData);
  }

  // Cancel specific notification
  cancelNotification(notificationId: string) {
    PushNotification.cancelLocalNotification(notificationId);
  }

  // Cancel all notifications
  cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  // Get all stored notifications
  async getStoredNotifications(): Promise<NotificationData[]> {
    try {
      const stored = await AsyncStorage.getItem('notifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting stored notifications:', error);
      return [];
    }
  }

  // Store notification locally
  private async storeNotification(notification: NotificationData) {
    try {
      const stored = await this.getStoredNotifications();
      stored.unshift(notification);
      
      // Keep only last 100 notifications
      const limited = stored.slice(0, 100);
      
      await AsyncStorage.setItem('notifications', JSON.stringify(limited));
    } catch (error) {
      console.error('Error storing notification:', error);
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string) {
    try {
      const stored = await this.getStoredNotifications();
      const updated = stored.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      await AsyncStorage.setItem('notifications', JSON.stringify(updated));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Schedule calibration reminders
  async scheduleCalibrationReminder(equipmentId: string, equipmentName: string, dueDate: Date) {
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(reminderDate.getDate() - 1); // 1 day before

    await this.scheduleLocalNotification(
      {
        title: 'Calibration Due Tomorrow',
        message: `${equipmentName} calibration is due tomorrow`,
        type: 'CALIBRATION_DUE',
        priority: 'HIGH',
        equipmentId,
        action: 'start_calibration',
      },
      reminderDate
    );

    // Schedule urgent reminder on due date
    await this.scheduleLocalNotification(
      {
        title: 'Calibration Due Today',
        message: `${equipmentName} calibration is due today`,
        type: 'CALIBRATION_DUE',
        priority: 'URGENT',
        equipmentId,
        action: 'start_calibration',
      },
      dueDate
    );
  }

  // Schedule compliance failure notification
  async scheduleComplianceFailure(equipmentId: string, equipmentName: string, failureReason: string) {
    await this.sendLocalNotification({
      title: 'Compliance Failure',
      message: `${equipmentName} failed compliance check: ${failureReason}`,
      type: 'COMPLIANCE_FAILURE',
      priority: 'URGENT',
      equipmentId,
      action: 'view_equipment',
    });
  }

  // Schedule maintenance reminder
  async scheduleMaintenanceReminder(equipmentId: string, equipmentName: string, maintenanceType: string, dueDate: Date) {
    await this.scheduleLocalNotification(
      {
        title: 'Maintenance Due',
        message: `${equipmentName} ${maintenanceType} maintenance is due`,
        type: 'EQUIPMENT_MAINTENANCE',
        priority: 'MEDIUM',
        equipmentId,
        action: 'view_equipment',
      },
      dueDate
    );
  }

  // Send system alert
  async sendSystemAlert(title: string, message: string, priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM') {
    await this.sendLocalNotification({
      title,
      message,
      type: 'SYSTEM_ALERT',
      priority,
    });
  }

  // Handle notification tap
  handleNotificationTap(notification: any) {
    const userInfo = notification.userInfo;
    
    if (userInfo.action) {
      switch (userInfo.action) {
        case 'view_equipment':
          // Navigate to equipment details
          this.navigateToEquipment(userInfo.equipmentId);
          break;
        case 'start_calibration':
          // Navigate to calibration screen
          this.navigateToCalibration(userInfo.equipmentId);
          break;
        case 'view_report':
          // Navigate to report
          this.navigateToReport(userInfo.calibrationId);
          break;
      }
    }
  }

  // Navigation helpers (these would integrate with your navigation system)
  private navigateToEquipment(equipmentId: string) {
    // Implementation depends on your navigation setup
    console.log('Navigate to equipment:', equipmentId);
  }

  private navigateToCalibration(equipmentId: string) {
    // Implementation depends on your navigation setup
    console.log('Navigate to calibration:', equipmentId);
  }

  private navigateToReport(calibrationId: string) {
    // Implementation depends on your navigation setup
    console.log('Navigate to report:', calibrationId);
  }

  // Helper methods
  private getChannelId(type: string): string {
    switch (type) {
      case 'CALIBRATION_DUE':
        return 'calibrations';
      case 'COMPLIANCE_FAILURE':
        return 'compliance';
      case 'EQUIPMENT_MAINTENANCE':
        return 'maintenance';
      default:
        return 'system';
    }
  }

  private getPriority(priority: string): number {
    switch (priority) {
      case 'URGENT':
        return 5;
      case 'HIGH':
        return 4;
      case 'MEDIUM':
        return 3;
      case 'LOW':
        return 2;
      default:
        return 3;
    }
  }

  private getNotificationColor(type: string): string {
    switch (type) {
      case 'CALIBRATION_DUE':
        return '#2563eb';
      case 'COMPLIANCE_FAILURE':
        return '#dc2626';
      case 'EQUIPMENT_MAINTENANCE':
        return '#ea580c';
      case 'SYSTEM_ALERT':
        return '#64748b';
      default:
        return '#2563eb';
    }
  }

  private getNotificationActions(notification: any): string[] {
    const actions = [];
    
    if (notification.action === 'start_calibration') {
      actions.push('Start Calibration');
    }
    
    if (notification.action === 'view_equipment') {
      actions.push('View Equipment');
    }
    
    actions.push('Dismiss');
    return actions;
  }

  private async sendTokenToServer(token: string) {
    try {
      // Send token to your server for remote notifications
      const response = await fetch('https://api.labguardpro.com/notifications/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          platform: Platform.OS,
          userId: 'current-user-id', // Get from auth context
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send token to server');
      }
    } catch (error) {
      console.error('Error sending token to server:', error);
    }
  }
}

export default PushNotificationService.getInstance(); 