import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useOffline } from '../contexts/OfflineContext';
import { calibrationAPI } from '../services/api';

interface CalibrationStep {
  id: string;
  name: string;
  description: string;
  type: 'measurement' | 'verification' | 'documentation';
  required: boolean;
  value?: string;
  completed: boolean;
}

interface CalibrationData {
  equipmentId: string;
  equipmentName: string;
  equipmentType: string;
  performedBy: string;
  performedAt: string;
  steps: CalibrationStep[];
  notes: string;
  status: 'in_progress' | 'completed' | 'failed';
  offlineId?: string;
}

export default function OfflineCalibrationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { isOnline, saveOfflineData, syncPendingData } = useOffline();
  
  const [calibrationData, setCalibrationData] = useState<CalibrationData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');

  const equipmentId = route.params?.equipmentId;

  useEffect(() => {
    if (equipmentId) {
      initializeCalibration();
    }
  }, [equipmentId]);

  const initializeCalibration = async () => {
    setLoading(true);
    try {
      // Get equipment details
      const equipment = await getEquipmentDetails(equipmentId);
      
      // Create calibration steps based on equipment type
      const steps = createCalibrationSteps(equipment.type);
      
      setCalibrationData({
        equipmentId,
        equipmentName: equipment.name,
        equipmentType: equipment.type,
        performedBy: 'Current User', // Get from auth context
        performedAt: new Date().toISOString(),
        steps,
        notes: '',
        status: 'in_progress',
        offlineId: `calibration_${Date.now()}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize calibration');
    } finally {
      setLoading(false);
    }
  };

  const getEquipmentDetails = async (id: string) => {
    // Mock equipment data - in real app, fetch from API or local storage
    return {
      id,
      name: `Equipment ${id}`,
      type: 'Analytical Balance',
      model: 'AB-2000',
    };
  };

  const createCalibrationSteps = (equipmentType: string): CalibrationStep[] => {
    const baseSteps: CalibrationStep[] = [
      {
        id: '1',
        name: 'Pre-calibration Check',
        description: 'Verify equipment is clean and properly leveled',
        type: 'verification',
        required: true,
        completed: false,
      },
      {
        id: '2',
        name: 'Zero Calibration',
        description: 'Set equipment to zero reading',
        type: 'measurement',
        required: true,
        completed: false,
      },
      {
        id: '3',
        name: 'Span Calibration',
        description: 'Calibrate with known standard weights',
        type: 'measurement',
        required: true,
        completed: false,
      },
      {
        id: '4',
        name: 'Linearity Check',
        description: 'Verify linearity across measurement range',
        type: 'measurement',
        required: true,
        completed: false,
      },
      {
        id: '5',
        name: 'Documentation',
        description: 'Record all measurements and observations',
        type: 'documentation',
        required: true,
        completed: false,
      },
    ];

    return baseSteps;
  };

  const handleStepComplete = (stepId: string, value?: string) => {
    if (!calibrationData) return;

    setCalibrationData(prev => {
      if (!prev) return prev;
      
      const updatedSteps = prev.steps.map(step => 
        step.id === stepId 
          ? { ...step, completed: true, value }
          : step
      );

      return {
        ...prev,
        steps: updatedSteps,
      };
    });
  };

  const handleStepValueChange = (stepId: string, value: string) => {
    if (!calibrationData) return;

    setCalibrationData(prev => {
      if (!prev) return prev;
      
      const updatedSteps = prev.steps.map(step => 
        step.id === stepId 
          ? { ...step, value }
          : step
      );

      return {
        ...prev,
        steps: updatedSteps,
      };
    });
  };

  const handleNextStep = () => {
    if (currentStep < (calibrationData?.steps.length || 0) - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteCalibration = async () => {
    if (!calibrationData) return;

    setSaving(true);
    try {
      // Mark as completed
      const completedData = {
        ...calibrationData,
        status: 'completed' as const,
        notes,
        completedAt: new Date().toISOString(),
      };

      if (isOnline) {
        // Submit to API
        await calibrationAPI.create(completedData);
        Alert.alert('Success', 'Calibration completed and synced');
      } else {
        // Save offline
        await saveOfflineData('calibrations', completedData);
        Alert.alert('Success', 'Calibration saved offline and will sync when connected');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to complete calibration');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProgress = async () => {
    if (!calibrationData) return;

    setSaving(true);
    try {
      await saveOfflineData('calibrations', {
        ...calibrationData,
        notes,
      });
      Alert.alert('Progress Saved', 'Your calibration progress has been saved');
    } catch (error) {
      Alert.alert('Error', 'Failed to save progress');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Initializing calibration...</Text>
      </View>
    );
  }

  if (!calibrationData) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error" size={64} color="#dc2626" />
        <Text style={styles.errorText}>Failed to load calibration data</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => initializeCalibration()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentStepData = calibrationData.steps[currentStep];
  const completedSteps = calibrationData.steps.filter(step => step.completed).length;
  const progress = (completedSteps / calibrationData.steps.length) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offline Calibration</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveProgress}
          disabled={saving}
        >
          <Icon name="save" size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* Connection Status */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Icon name="wifi-off" size={16} color="#ffffff" />
          <Text style={styles.offlineText}>Working Offline - Data will sync when connected</Text>
        </View>
      )}

      <ScrollView style={styles.content}>
        {/* Equipment Info */}
        <View style={styles.equipmentCard}>
          <Text style={styles.equipmentName}>{calibrationData.equipmentName}</Text>
          <Text style={styles.equipmentType}>{calibrationData.equipmentType}</Text>
          <Text style={styles.equipmentId}>ID: {calibrationData.equipmentId}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Progress: {completedSteps}/{calibrationData.steps.length}</Text>
            <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Current Step */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepNumber}>Step {currentStep + 1}</Text>
            <Text style={styles.stepTitle}>{currentStepData.name}</Text>
          </View>
          
          <Text style={styles.stepDescription}>{currentStepData.description}</Text>

          {/* Step Input */}
          {currentStepData.type === 'measurement' && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Measurement Value:</Text>
              <TextInput
                style={styles.textInput}
                value={currentStepData.value}
                onChangeText={(value) => handleStepValueChange(currentStepData.id, value)}
                placeholder="Enter measurement value"
                keyboardType="numeric"
              />
            </View>
          )}

          {currentStepData.type === 'verification' && (
            <View style={styles.verificationContainer}>
              <Text style={styles.verificationLabel}>Verification:</Text>
              <View style={styles.verificationOptions}>
                <TouchableOpacity
                  style={[
                    styles.verificationOption,
                    currentStepData.value === 'pass' && styles.verificationOptionSelected
                  ]}
                  onPress={() => handleStepValueChange(currentStepData.id, 'pass')}
                >
                  <Icon name="check-circle" size={20} color={currentStepData.value === 'pass' ? '#16a34a' : '#64748b'} />
                  <Text style={styles.verificationOptionText}>Pass</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.verificationOption,
                    currentStepData.value === 'fail' && styles.verificationOptionSelected
                  ]}
                  onPress={() => handleStepValueChange(currentStepData.id, 'fail')}
                >
                  <Icon name="cancel" size={20} color={currentStepData.value === 'fail' ? '#dc2626' : '#64748b'} />
                  <Text style={styles.verificationOptionText}>Fail</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Step Actions */}
          <View style={styles.stepActions}>
            <TouchableOpacity
              style={[
                styles.completeButton,
                (!currentStepData.value || currentStepData.completed) && styles.completeButtonDisabled
              ]}
              onPress={() => handleStepComplete(currentStepData.id, currentStepData.value)}
              disabled={!currentStepData.value || currentStepData.completed}
            >
              <Icon name="check" size={20} color="#ffffff" />
              <Text style={styles.completeButtonText}>
                {currentStepData.completed ? 'Completed' : 'Mark Complete'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional notes or observations..."
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Navigation */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
            onPress={handlePreviousStep}
            disabled={currentStep === 0}
          >
            <Icon name="arrow-back" size={20} color={currentStep === 0 ? '#94a3b8' : '#2563eb'} />
            <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, currentStep === calibrationData.steps.length - 1 && styles.navButtonDisabled]}
            onPress={handleNextStep}
            disabled={currentStep === calibrationData.steps.length - 1}
          >
            <Text style={[styles.navButtonText, currentStep === calibrationData.steps.length - 1 && styles.navButtonTextDisabled]}>
              Next
            </Text>
            <Icon name="arrow-forward" size={20} color={currentStep === calibrationData.steps.length - 1 ? '#94a3b8' : '#2563eb'} />
          </TouchableOpacity>
        </View>

        {/* Complete Button */}
        {completedSteps === calibrationData.steps.length && (
          <TouchableOpacity
            style={[styles.completeCalibrationButton, saving && styles.completeCalibrationButtonDisabled]}
            onPress={handleCompleteCalibration}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Icon name="check-circle" size={24} color="#ffffff" />
            )}
            <Text style={styles.completeCalibrationButtonText}>
              {saving ? 'Completing...' : 'Complete Calibration'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#64748b',
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineBanner: {
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  offlineText: {
    color: '#ffffff',
    fontSize: 12,
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  equipmentCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  equipmentType: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  equipmentId: {
    fontSize: 12,
    color: '#94a3b8',
  },
  progressContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#64748b',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
  stepCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stepHeader: {
    marginBottom: 12,
  },
  stepNumber: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  verificationContainer: {
    marginBottom: 16,
  },
  verificationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  verificationOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  verificationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    flex: 1,
  },
  verificationOptionSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  verificationOptionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  stepActions: {
    alignItems: 'center',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  completeButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  notesContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#ffffff',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2563eb',
    backgroundColor: '#ffffff',
    flex: 1,
    marginHorizontal: 4,
  },
  navButtonDisabled: {
    borderColor: '#d1d5db',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  navButtonTextDisabled: {
    color: '#94a3b8',
  },
  completeCalibrationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  completeCalibrationButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  completeCalibrationButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 