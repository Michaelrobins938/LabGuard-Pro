import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useOffline } from '../contexts/OfflineContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface OfflineAction {
  id: string;
  type: 'calibration' | 'equipment' | 'sync';
  title: string;
  description: string;
  timestamp: Date;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
}

export default function OfflineScreen() {
  const { isOnline, syncPendingData, getOfflineData } = useOffline();
  const [offlineActions, setOfflineActions] = useState<OfflineAction[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadOfflineActions();
  }, []);

  const loadOfflineActions = async () => {
    try {
      // Simulate loading offline actions
      const mockActions: OfflineAction[] = [
        {
          id: '1',
          type: 'calibration',
          title: 'Centrifuge C-2400 Calibration',
          description: 'Calibration data recorded offline',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          status: 'pending',
        },
        {
          id: '2',
          type: 'equipment',
          title: 'New Equipment Added',
          description: 'pH Meter PH-300 added to inventory',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          status: 'pending',
        },
        {
          id: '3',
          type: 'sync',
          title: 'Data Sync',
          description: 'Equipment status updates',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          status: 'completed',
        },
      ];
      
      setOfflineActions(mockActions);
    } catch (error) {
      console.error('Error loading offline actions:', error);
    }
  };

  const handleSync = async () => {
    if (!isOnline) {
      Alert.alert('No Internet Connection', 'Please connect to the internet to sync data.');
      return;
    }

    setIsSyncing(true);
    try {
      await syncPendingData();
      Alert.alert('Sync Complete', 'All offline data has been synced successfully.');
      loadOfflineActions(); // Reload to update status
    } catch (error) {
      Alert.alert('Sync Failed', 'There was an error syncing your data. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ea580c';
      case 'syncing': return '#2563eb';
      case 'completed': return '#16a34a';
      case 'failed': return '#dc2626';
      default: return '#64748b';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'syncing': return 'Syncing';
      case 'completed': return 'Completed';
      case 'failed': return 'Failed';
      default: return 'Unknown';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'calibration': return 'schedule';
      case 'equipment': return 'build';
      case 'sync': return 'sync';
      default: return 'info';
    }
  };

  const renderOfflineAction = ({ item }: { item: OfflineAction }) => (
    <View style={styles.actionItem}>
      <View style={styles.actionHeader}>
        <View style={styles.actionInfo}>
          <View style={styles.actionIconContainer}>
            <Icon name={getActionIcon(item.type)} size={20} color="#2563eb" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>{item.title}</Text>
            <Text style={styles.actionDescription}>{item.description}</Text>
            <Text style={styles.actionTime}>
              {item.timestamp.toLocaleString()}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Offline Mode</Text>
        <View style={styles.connectionStatus}>
          <View style={[styles.statusDot, { backgroundColor: isOnline ? '#16a34a' : '#dc2626' }]} />
          <Text style={styles.statusText}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      {/* Connection Status */}
      <View style={[styles.connectionBanner, { backgroundColor: isOnline ? '#dcfce7' : '#fef2f2' }]}>
        <Icon 
          name={isOnline ? 'wifi' : 'wifi-off'} 
          size={20} 
          color={isOnline ? '#16a34a' : '#dc2626'} 
        />
        <Text style={[styles.connectionText, { color: isOnline ? '#16a34a' : '#dc2626' }]}>
          {isOnline 
            ? 'Connected to internet - Data will sync automatically' 
            : 'No internet connection - Working in offline mode'
          }
        </Text>
      </View>

      {/* Sync Button */}
      {isOnline && (
        <TouchableOpacity
          style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
          onPress={handleSync}
          disabled={isSyncing}
        >
          <Icon name="sync" size={20} color="#ffffff" />
          <Text style={styles.syncButtonText}>
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Offline Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Offline Actions</Text>
        <FlatList
          data={offlineActions}
          renderItem={renderOfflineAction}
          keyExtractor={(item) => item.id}
          style={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="cloud-off" size={64} color="#cbd5e1" />
              <Text style={styles.emptyStateText}>No offline actions</Text>
              <Text style={styles.emptyStateSubText}>
                Actions performed offline will appear here
              </Text>
            </View>
          }
        />
      </View>

      {/* Offline Capabilities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Offline Capabilities</Text>
        <View style={styles.capabilitiesList}>
          <View style={styles.capabilityItem}>
            <Icon name="qr-code-scanner" size={20} color="#16a34a" />
            <Text style={styles.capabilityText}>Scan QR codes</Text>
          </View>
          <View style={styles.capabilityItem}>
            <Icon name="schedule" size={20} color="#16a34a" />
            <Text style={styles.capabilityText}>Perform calibrations</Text>
          </View>
          <View style={styles.capabilityItem}>
            <Icon name="build" size={20} color="#16a34a" />
            <Text style={styles.capabilityText}>View equipment</Text>
          </View>
          <View style={styles.capabilityItem}>
            <Icon name="notifications" size={20} color="#16a34a" />
            <Text style={styles.capabilityText}>Receive notifications</Text>
          </View>
          <View style={styles.capabilityItem}>
            <Icon name="save" size={20} color="#16a34a" />
            <Text style={styles.capabilityText}>Save data locally</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#64748b',
  },
  connectionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  connectionText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  syncButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  syncButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  list: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  actionInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  actionTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748b',
    marginTop: 16,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
  capabilitiesList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  capabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  capabilityText: {
    fontSize: 14,
    color: '#1e293b',
    marginLeft: 12,
  },
}); 