import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

interface OfflineData {
  id: string;
  type: 'calibration' | 'equipment' | 'maintenance' | 'sync';
  data: any;
  timestamp: number;
  synced: boolean;
  retryCount: number;
}

interface OfflineContextType {
  isOnline: boolean;
  pendingSyncCount: number;
  saveOfflineData: (type: string, data: any) => Promise<void>;
  syncPendingData: () => Promise<void>;
  getOfflineData: (type?: string) => Promise<OfflineData[]>;
  clearOfflineData: (type?: string) => Promise<void>;
  getConnectionStatus: () => Promise<boolean>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  useEffect(() => {
    // Initialize connection monitoring
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(online || false);
      
      if (online) {
        // Auto-sync when connection is restored
        syncPendingData();
      }
    });

    // Check initial connection status
    checkConnectionStatus();

    // Load pending sync count
    loadPendingSyncCount();

    return () => {
      unsubscribe();
    };
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const state = await NetInfo.fetch();
      setIsOnline(state.isConnected && state.isInternetReachable || false);
    } catch (error) {
      console.error('Error checking connection status:', error);
      setIsOnline(false);
    }
  };

  const loadPendingSyncCount = async () => {
    try {
      const offlineData = await getOfflineData();
      const pendingCount = offlineData.filter(item => !item.synced).length;
      setPendingSyncCount(pendingCount);
    } catch (error) {
      console.error('Error loading pending sync count:', error);
    }
  };

  const saveOfflineData = async (type: string, data: any): Promise<void> => {
    try {
      const offlineItem: OfflineData = {
        id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: type as any,
        data,
        timestamp: Date.now(),
        synced: false,
        retryCount: 0,
      };

      const existingData = await getOfflineData();
      existingData.push(offlineItem);

      await AsyncStorage.setItem('offline_data', JSON.stringify(existingData));
      
      // Update pending count
      setPendingSyncCount(prev => prev + 1);

      console.log(`Offline data saved: ${type}`, offlineItem.id);
    } catch (error) {
      console.error('Error saving offline data:', error);
      throw new Error('Failed to save offline data');
    }
  };

  const syncPendingData = async (): Promise<void> => {
    if (!isOnline) {
      throw new Error('No internet connection available');
    }

    try {
      const offlineData = await getOfflineData();
      const pendingData = offlineData.filter(item => !item.synced);

      if (pendingData.length === 0) {
        console.log('No pending data to sync');
        return;
      }

      console.log(`Syncing ${pendingData.length} offline items...`);

      for (const item of pendingData) {
        try {
          await syncOfflineItem(item);
          
          // Mark as synced
          const updatedData = await getOfflineData();
          const updatedItem = updatedData.find(d => d.id === item.id);
          if (updatedItem) {
            updatedItem.synced = true;
            await AsyncStorage.setItem('offline_data', JSON.stringify(updatedData));
          }
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          
          // Increment retry count
          const updatedData = await getOfflineData();
          const updatedItem = updatedData.find(d => d.id === item.id);
          if (updatedItem) {
            updatedItem.retryCount += 1;
            
            // Remove if too many retries
            if (updatedItem.retryCount >= 5) {
              const filteredData = updatedData.filter(d => d.id !== item.id);
              await AsyncStorage.setItem('offline_data', JSON.stringify(filteredData));
              console.log(`Removed failed sync item after 5 retries: ${item.id}`);
            } else {
              await AsyncStorage.setItem('offline_data', JSON.stringify(updatedData));
            }
          }
        }
      }

      // Update pending count
      await loadPendingSyncCount();

      console.log('Sync completed');
    } catch (error) {
      console.error('Error syncing pending data:', error);
      throw error;
    }
  };

  const syncOfflineItem = async (item: OfflineData): Promise<void> => {
    const { type, data } = item;

    switch (type) {
      case 'calibration':
        await syncCalibrationData(data);
        break;
      case 'equipment':
        await syncEquipmentData(data);
        break;
      case 'maintenance':
        await syncMaintenanceData(data);
        break;
      default:
        console.warn(`Unknown offline data type: ${type}`);
    }
  };

  const syncCalibrationData = async (data: any): Promise<void> => {
    try {
      const response = await fetch('https://api.labguardpro.com/calibrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('Calibration data synced successfully');
    } catch (error) {
      console.error('Error syncing calibration data:', error);
      throw error;
    }
  };

  const syncEquipmentData = async (data: any): Promise<void> => {
    try {
      const response = await fetch('https://api.labguardpro.com/equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('Equipment data synced successfully');
    } catch (error) {
      console.error('Error syncing equipment data:', error);
      throw error;
    }
  };

  const syncMaintenanceData = async (data: any): Promise<void> => {
    try {
      const response = await fetch('https://api.labguardpro.com/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('Maintenance data synced successfully');
    } catch (error) {
      console.error('Error syncing maintenance data:', error);
      throw error;
    }
  };

  const getOfflineData = async (type?: string): Promise<OfflineData[]> => {
    try {
      const stored = await AsyncStorage.getItem('offline_data');
      const data: OfflineData[] = stored ? JSON.parse(stored) : [];
      
      if (type) {
        return data.filter(item => item.type === type);
      }
      
      return data;
    } catch (error) {
      console.error('Error getting offline data:', error);
      return [];
    }
  };

  const clearOfflineData = async (type?: string): Promise<void> => {
    try {
      if (type) {
        const data = await getOfflineData();
        const filteredData = data.filter(item => item.type !== type);
        await AsyncStorage.setItem('offline_data', JSON.stringify(filteredData));
      } else {
        await AsyncStorage.removeItem('offline_data');
      }
      
      await loadPendingSyncCount();
    } catch (error) {
      console.error('Error clearing offline data:', error);
      throw error;
    }
  };

  const getConnectionStatus = async (): Promise<boolean> => {
    try {
      const state = await NetInfo.fetch();
      return state.isConnected && state.isInternetReachable || false;
    } catch (error) {
      console.error('Error getting connection status:', error);
      return false;
    }
  };

  const getAuthToken = async (): Promise<string> => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      return token || '';
    } catch (error) {
      console.error('Error getting auth token:', error);
      return '';
    }
  };

  const value: OfflineContextType = {
    isOnline,
    pendingSyncCount,
    saveOfflineData,
    syncPendingData,
    getOfflineData,
    clearOfflineData,
    getConnectionStatus,
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
}; 