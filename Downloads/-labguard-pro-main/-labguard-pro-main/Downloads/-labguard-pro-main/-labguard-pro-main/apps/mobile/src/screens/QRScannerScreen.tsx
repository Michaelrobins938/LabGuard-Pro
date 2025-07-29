import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useOffline } from '../contexts/OfflineContext';
import { equipmentAPI } from '../services/api';

const { width, height } = Dimensions.get('window');

interface EquipmentData {
  id: string;
  name: string;
  type: string;
  model: string;
  status: string;
  lastCalibration?: string;
  nextCalibration?: string;
}

export default function QRScannerScreen() {
  const navigation = useNavigation();
  const { isOnline } = useOffline();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [equipmentData, setEquipmentData] = useState<EquipmentData | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await RNCamera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const fetchEquipmentDetails = async (equipmentId: string) => {
    setLoading(true);
    try {
      if (isOnline) {
        // Fetch from API
        const response = await equipmentAPI.getById(equipmentId);
        setEquipmentData(response.data);
      } else {
        // Get from local storage
        const localEquipment = await getLocalEquipment(equipmentId);
        setEquipmentData(localEquipment);
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
      // Try to get basic info from QR code data
      setEquipmentData({
        id: equipmentId,
        name: `Equipment ${equipmentId}`,
        type: 'Unknown',
        model: 'Unknown',
        status: 'Unknown'
      });
    } finally {
      setLoading(false);
    }
  };

  const getLocalEquipment = async (equipmentId: string) => {
    // This would typically use AsyncStorage or local database
    // For now, return mock data
    return {
      id: equipmentId,
      name: `Equipment ${equipmentId}`,
      type: 'Analytical Balance',
      model: 'AB-2000',
      status: 'Active',
      lastCalibration: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      nextCalibration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    
    try {
      // Parse QR code data
      let equipmentId = data;
      
      // Handle different QR code formats
      if (data.includes('labguard://')) {
        equipmentId = data.split('labguard://')[1];
      } else if (data.includes('equipment=')) {
        equipmentId = data.split('equipment=')[1];
      }

      // Validate equipment ID format
      if (!equipmentId || equipmentId.length < 3) {
        throw new Error('Invalid equipment ID format');
      }

      fetchEquipmentDetails(equipmentId);
      
    } catch (error) {
      Alert.alert('Invalid QR Code', 'The scanned QR code is not a valid LabGuard equipment code.');
      setScanned(false);
    }
  };

  const handleEquipmentAction = (action: 'view' | 'calibrate' | 'maintenance') => {
    if (!equipmentData) return;

    switch (action) {
      case 'view':
        navigation.navigate('Equipment', { equipmentId: equipmentData.id });
        break;
      case 'calibrate':
        navigation.navigate('Calibration', { equipmentId: equipmentData.id });
        break;
      case 'maintenance':
        navigation.navigate('Maintenance', { equipmentId: equipmentData.id });
        break;
    }
    setScanned(false);
    setEquipmentData(null);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Icon name="camera-alt" size={64} color="#64748b" />
        <Text style={styles.text}>No access to camera</Text>
        <Text style={styles.subText}>
          Please enable camera permissions to scan QR codes
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.permissionButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        onBarCodeRead={scanned ? undefined : handleBarCodeScanned}
        captureAudio={false}
      >
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scan QR Code</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Scanner Frame */}
          <View style={styles.scannerFrame}>
            <View style={styles.corner} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              Position the QR code within the frame
            </Text>
            <Text style={styles.instructionSubText}>
              The code will be scanned automatically
            </Text>
          </View>

          {/* Manual Input Button */}
          <TouchableOpacity
            style={styles.manualButton}
            onPress={() => {
              Alert.prompt(
                'Manual Entry',
                'Enter equipment ID:',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Enter',
                    onPress: (equipmentId) => {
                      if (equipmentId) {
                        fetchEquipmentDetails(equipmentId);
                      }
                    },
                  },
                ]
              );
            }}
          >
            <Icon name="keyboard" size={20} color="#2563eb" />
            <Text style={styles.manualButtonText}>Manual Entry</Text>
          </TouchableOpacity>
        </View>
      </RNCamera>

      {/* Equipment Found Modal */}
      {equipmentData && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Icon name="check-circle" size={24} color="#16a34a" />
              <Text style={styles.modalTitle}>Equipment Found</Text>
            </View>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.loadingText}>Loading equipment details...</Text>
              </View>
            ) : (
              <View style={styles.equipmentInfo}>
                <Text style={styles.equipmentName}>{equipmentData.name}</Text>
                <Text style={styles.equipmentType}>{equipmentData.type} - {equipmentData.model}</Text>
                <Text style={styles.equipmentStatus}>Status: {equipmentData.status}</Text>
                
                {equipmentData.lastCalibration && (
                  <Text style={styles.calibrationInfo}>
                    Last Calibration: {new Date(equipmentData.lastCalibration).toLocaleDateString()}
                  </Text>
                )}
                
                {equipmentData.nextCalibration && (
                  <Text style={styles.calibrationInfo}>
                    Next Calibration: {new Date(equipmentData.nextCalibration).toLocaleDateString()}
                  </Text>
                )}
              </View>
            )}

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.viewButton]}
                onPress={() => handleEquipmentAction('view')}
              >
                <Icon name="visibility" size={20} color="#2563eb" />
                <Text style={styles.actionButtonText}>View Details</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.calibrateButton]}
                onPress={() => handleEquipmentAction('calibrate')}
              >
                <Icon name="schedule" size={20} color="#ffffff" />
                <Text style={[styles.actionButtonText, { color: '#ffffff' }]}>Calibrate</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setScanned(false);
                setEquipmentData(null);
              }}
            >
              <Text style={styles.cancelButtonText}>Scan Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Connection Status */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Icon name="wifi-off" size={16} color="#ffffff" />
          <Text style={styles.offlineText}>Offline Mode - Limited Data</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  scannerFrame: {
    position: 'absolute',
    top: height * 0.3,
    left: width * 0.1,
    width: width * 0.8,
    height: width * 0.8,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#2563eb',
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderLeftWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  instructions: {
    position: 'absolute',
    bottom: height * 0.25,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instructionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionSubText: {
    color: '#cbd5e1',
    fontSize: 14,
    textAlign: 'center',
  },
  manualButton: {
    position: 'absolute',
    bottom: height * 0.15,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
  },
  manualButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxWidth: width * 0.9,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  equipmentInfo: {
    marginBottom: 20,
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
  equipmentStatus: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  calibrationInfo: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  viewButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  calibrateButton: {
    backgroundColor: '#2563eb',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  cancelButton: {
    alignItems: 'center',
    padding: 12,
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  offlineBanner: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
  },
  offlineText: {
    color: '#ffffff',
    fontSize: 12,
    marginLeft: 4,
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  subText: {
    color: '#cbd5e1',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  permissionButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 