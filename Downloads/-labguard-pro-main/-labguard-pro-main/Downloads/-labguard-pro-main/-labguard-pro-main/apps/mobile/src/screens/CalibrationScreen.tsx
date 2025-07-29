import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useOffline } from '../contexts/OfflineContext';
import { apiService } from '../services/api';

interface Calibration {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  dueDate: string;
  lastCalibration: string;
  technician: string;
  complianceScore?: number;
  aiValidation?: 'pending' | 'approved' | 'rejected';
  measurements?: Measurement[];
}

interface Measurement {
  id: string;
  parameter: string;
  expectedValue: number;
  actualValue: number;
  tolerance: number;
  unit: string;
  isWithinTolerance: boolean;
}

export default function CalibrationScreen({ navigation }: any) {
  const { user } = useAuth();
  const { isOnline } = useOffline();
  const [calibrations, setCalibrations] = useState<Calibration[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue' | 'completed'>('all');

  useEffect(() => {
    loadCalibrations();
  }, []);

  const loadCalibrations = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/api/calibrations');
      setCalibrations(response.data);
    } catch (error) {
      console.error('Failed to load calibrations:', error);
      Alert.alert('Error', 'Failed to load calibrations');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCalibrations();
    setRefreshing(false);
  };

  const startCalibration = async (calibration: Calibration) => {
    if (!isOnline) {
      Alert.alert(
        'Offline Mode',
        'You are currently offline. Calibrations will be saved locally and synced when you reconnect.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => navigation.navigate('CalibrationDetail', { calibration }) }
        ]
      );
      return;
    }

    navigation.navigate('CalibrationDetail', { calibration });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'in_progress':
        return '#3b82f6';
      case 'completed':
        return '#10b981';
      case 'overdue':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return 'time-outline';
      case 'in_progress':
        return 'play-outline';
      case 'completed':
        return 'checkmark-circle-outline';
      case 'overdue':
        return 'warning-outline';
      default:
        return 'help-outline';
    }
  };

  const filteredCalibrations = calibrations.filter(calibration => {
    if (filter === 'all') return true;
    return calibration.status === filter;
  });

  const getFilterButtonStyle = (filterType: string) => ({
    ...styles.filterButton,
    backgroundColor: filter === filterType ? '#1e40af' : '#f3f4f6',
  });

  const getFilterTextStyle = (filterType: string) => ({
    ...styles.filterButtonText,
    color: filter === filterType ? '#ffffff' : '#374151',
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
        <Text style={styles.loadingText}>Loading calibrations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Calibrations</Text>
        <TouchableOpacity
          style={styles.syncButton}
          onPress={onRefresh}
          disabled={refreshing}
        >
          <Ionicons
            name={refreshing ? 'refresh' : 'sync-outline'}
            size={24}
            color="#1e40af"
            style={refreshing ? styles.rotating : {}}
          />
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={getFilterButtonStyle('all')}
          onPress={() => setFilter('all')}
        >
          <Text style={getFilterTextStyle('all')}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getFilterButtonStyle('pending')}
          onPress={() => setFilter('pending')}
        >
          <Text style={getFilterTextStyle('pending')}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getFilterButtonStyle('overdue')}
          onPress={() => setFilter('overdue')}
        >
          <Text style={getFilterTextStyle('overdue')}>Overdue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getFilterButtonStyle('completed')}
          onPress={() => setFilter('completed')}
        >
          <Text style={getFilterTextStyle('completed')}>Completed</Text>
        </TouchableOpacity>
      </View>

      {/* Offline Indicator */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={16} color="#ffffff" />
          <Text style={styles.offlineText}>Offline Mode - Changes will sync when reconnected</Text>
        </View>
      )}

      {/* Calibrations List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredCalibrations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyTitle}>No calibrations found</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'all'
                ? 'All calibrations are up to date!'
                : `No ${filter} calibrations found`}
            </Text>
          </View>
        ) : (
          filteredCalibrations.map((calibration) => (
            <TouchableOpacity
              key={calibration.id}
              style={styles.calibrationCard}
              onPress={() => startCalibration(calibration)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.equipmentInfo}>
                  <Text style={styles.equipmentName}>{calibration.equipmentName}</Text>
                  <Text style={styles.calibrationType}>{calibration.type}</Text>
                </View>
                <View style={styles.statusContainer}>
                  <Ionicons
                    name={getStatusIcon(calibration.status)}
                    size={20}
                    color={getStatusColor(calibration.status)}
                  />
                  <Text style={[styles.statusText, { color: getStatusColor(calibration.status) }]}>
                    {calibration.status.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>
                    Due: {new Date(calibration.dueDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="person-outline" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>
                    Technician: {calibration.technician}
                  </Text>
                </View>
                {calibration.lastCalibration && (
                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      Last: {new Date(calibration.lastCalibration).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>

              {calibration.complianceScore && (
                <View style={styles.complianceContainer}>
                  <Text style={styles.complianceLabel}>Compliance Score:</Text>
                  <Text style={[
                    styles.complianceScore,
                    { color: calibration.complianceScore >= 95 ? '#10b981' : '#f59e0b' }
                  ]}>
                    {calibration.complianceScore}%
                  </Text>
                </View>
              )}

              {calibration.aiValidation && (
                <View style={styles.aiValidationContainer}>
                  <Ionicons
                    name={
                      calibration.aiValidation === 'approved'
                        ? 'checkmark-circle-outline'
                        : calibration.aiValidation === 'rejected'
                        ? 'close-circle-outline'
                        : 'time-outline'
                    }
                    size={16}
                    color={
                      calibration.aiValidation === 'approved'
                        ? '#10b981'
                        : calibration.aiValidation === 'rejected'
                        ? '#ef4444'
                        : '#f59e0b'
                    }
                  />
                  <Text style={styles.aiValidationText}>
                    AI Validation: {calibration.aiValidation.toUpperCase()}
                  </Text>
                </View>
              )}

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => startCalibration(calibration)}
                >
                  <Ionicons name="play-outline" size={16} color="#1e40af" />
                  <Text style={styles.actionButtonText}>Start</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.secondaryButton]}
                  onPress={() => navigation.navigate('EquipmentDetail', { 
                    equipmentId: calibration.equipmentId 
                  })}
                >
                  <Ionicons name="information-circle-outline" size={16} color="#6b7280" />
                  <Text style={[styles.actionButtonText, { color: '#6b7280' }]}>Details</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('Equipment')}
        >
          <Ionicons name="list-outline" size={24} color="#ffffff" />
          <Text style={styles.quickActionText}>Equipment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('Reports')}
        >
          <Ionicons name="bar-chart-outline" size={24} color="#ffffff" />
          <Text style={styles.quickActionText}>Reports</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  syncButton: {
    padding: 8,
  },
  rotating: {
    transform: [{ rotate: '360deg' }],
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f59e0b',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  offlineText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  calibrationCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    marginBottom: 8,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  equipmentInfo: {
    flex: 1,
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  calibrationType: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  cardDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  complianceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  complianceLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
  },
  complianceScore: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiValidationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiValidationText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e40af',
    marginLeft: 4,
  },
  quickActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e40af',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  quickActionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
}); 