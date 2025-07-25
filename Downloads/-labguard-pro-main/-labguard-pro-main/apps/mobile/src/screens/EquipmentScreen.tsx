import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  FlatList
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card, Title, Button, FAB, Searchbar } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { equipmentAPI } from '../services/api'

interface Equipment {
  id: string
  name: string
  model: string
  serialNumber: string
  type: string
  status: string
  location: string
  lastCalibratedAt: string
  nextCalibrationAt: string
  complianceStatus: string
  notes?: string
}

interface EquipmentFilter {
  status: string
  type: string
  location: string
}

export default function EquipmentScreen({ navigation, route }: any) {
  const { equipmentId } = route.params || {}
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<EquipmentFilter>({
    status: 'ALL',
    type: 'ALL',
    location: 'ALL'
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)

  const queryClient = useQueryClient()

  // Fetch equipment list
  const { data: equipment, isLoading, refetch } = useQuery(
    'equipment',
    () => equipmentAPI.getAll(),
    {
      onError: (error) => {
        Alert.alert('Error', 'Failed to load equipment')
      }
    }
  )

  // Fetch specific equipment
  const { data: equipmentDetails } = useQuery(
    ['equipment', equipmentId],
    () => equipmentAPI.getById(equipmentId),
    {
      enabled: !!equipmentId
    }
  )

  // Add equipment mutation
  const addEquipmentMutation = useMutation(
    (equipmentData: any) => equipmentAPI.create(equipmentData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('equipment')
        setShowAddModal(false)
        Alert.alert('Success', 'Equipment added successfully')
      },
      onError: (error: any) => {
        Alert.alert('Error', error.response?.data?.message || 'Failed to add equipment')
      }
    }
  )

  // Delete equipment mutation
  const deleteEquipmentMutation = useMutation(
    (id: string) => equipmentAPI.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('equipment')
        Alert.alert('Success', 'Equipment deleted successfully')
      },
      onError: (error: any) => {
        Alert.alert('Error', 'Failed to delete equipment')
      }
    }
  )

  const filteredEquipment = equipment?.filter((item: Equipment) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filter.status === 'ALL' || item.status === filter.status
    const matchesType = filter.type === 'ALL' || item.type === filter.type
    const matchesLocation = filter.location === 'ALL' || item.location === filter.location
    
    return matchesSearch && matchesStatus && matchesType && matchesLocation
  }) || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '#10B981'
      case 'MAINTENANCE':
        return '#F59E0B'
      case 'INACTIVE':
        return '#6B7280'
      case 'RETIRED':
        return '#EF4444'
      default:
        return '#6B7280'
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return '#10B981'
      case 'DUE_SOON':
        return '#F59E0B'
      case 'OVERDUE':
        return '#EF4444'
      default:
        return '#6B7280'
    }
  }

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return 'check-circle'
      case 'DUE_SOON':
        return 'clock'
      case 'OVERDUE':
        return 'alert-circle'
      default:
        return 'help-circle'
    }
  }

  const handleAddEquipment = (equipmentData: any) => {
    addEquipmentMutation.mutate(equipmentData)
  }

  const handleDeleteEquipment = (equipment: Equipment) => {
    Alert.alert(
      'Delete Equipment',
      `Are you sure you want to delete ${equipment.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteEquipmentMutation.mutate(equipment.id) }
      ]
    )
  }

  const handleEquipmentPress = (equipment: Equipment) => {
    setSelectedEquipment(equipment)
  }

  const renderEquipmentItem = ({ item }: { item: Equipment }) => (
    <TouchableOpacity
      style={styles.equipmentItem}
      onPress={() => handleEquipmentPress(item)}
    >
      <Card style={styles.equipmentCard}>
        <Card.Content>
          <View style={styles.equipmentHeader}>
            <View style={styles.equipmentInfo}>
              <Title style={styles.equipmentName}>{item.name}</Title>
              <Text style={styles.equipmentModel}>{item.model}</Text>
              <Text style={styles.equipmentSerial}>SN: {item.serialNumber}</Text>
            </View>
            <View style={styles.equipmentStatus}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
              <Icon
                name={getComplianceIcon(item.complianceStatus)}
                size={20}
                color={getComplianceColor(item.complianceStatus)}
                style={styles.complianceIcon}
              />
            </View>
          </View>
          
          <View style={styles.equipmentDetails}>
            <View style={styles.detailRow}>
              <Icon name="map-marker" size={16} color="#6B7280" />
              <Text style={styles.detailText}>{item.location}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Icon name="calendar" size={16} color="#6B7280" />
              <Text style={styles.detailText}>
                Next Calibration: {new Date(item.nextCalibrationAt).toLocaleDateString()}
              </Text>
            </View>
            
            {item.notes && (
              <View style={styles.detailRow}>
                <Icon name="note-text" size={16} color="#6B7280" />
                <Text style={styles.detailText} numberOfLines={2}>{item.notes}</Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.filterButton, filter.status === 'ALL' && styles.filterButtonActive]}
          onPress={() => setFilter(prev => ({ ...prev, status: 'ALL' }))}
        >
          <Text style={[styles.filterText, filter.status === 'ALL' && styles.filterTextActive]}>
            All Status
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filter.status === 'ACTIVE' && styles.filterButtonActive]}
          onPress={() => setFilter(prev => ({ ...prev, status: 'ACTIVE' }))}
        >
          <Text style={[styles.filterText, filter.status === 'ACTIVE' && styles.filterTextActive]}>
            Active
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filter.status === 'MAINTENANCE' && styles.filterButtonActive]}
          onPress={() => setFilter(prev => ({ ...prev, status: 'MAINTENANCE' }))}
        >
          <Text style={[styles.filterText, filter.status === 'MAINTENANCE' && styles.filterTextActive]}>
            Maintenance
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filter.status === 'OVERDUE' && styles.filterButtonActive]}
          onPress={() => setFilter(prev => ({ ...prev, status: 'OVERDUE' }))}
        >
          <Text style={[styles.filterText, filter.status === 'OVERDUE' && styles.filterTextActive]}>
            Overdue
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Equipment</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Icon name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search equipment..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Filters */}
      {renderFilters()}

      {/* Equipment List */}
      <FlatList
        data={filteredEquipment}
        renderItem={renderEquipmentItem}
        keyExtractor={(item) => item.id}
        style={styles.equipmentList}
        contentContainerStyle={styles.equipmentListContent}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="test-tube" size={64} color="#CBD5E1" />
            <Text style={styles.emptyStateText}>No equipment found</Text>
            <Text style={styles.emptyStateSubtext}>
              Add your first piece of equipment to get started
            </Text>
            <Button
              mode="contained"
              onPress={() => setShowAddModal(true)}
              style={styles.emptyStateButton}
            >
              Add Equipment
            </Button>
          </View>
        }
      />

      {/* Equipment Details Modal */}
      {selectedEquipment && (
        <Card style={styles.modalCard}>
          <Card.Content>
            <View style={styles.modalHeader}>
              <Title>{selectedEquipment.name}</Title>
              <TouchableOpacity
                onPress={() => setSelectedEquipment(null)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalDetails}>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalLabel}>Model:</Text>
                <Text style={styles.modalValue}>{selectedEquipment.model}</Text>
              </View>
              
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalLabel}>Serial Number:</Text>
                <Text style={styles.modalValue}>{selectedEquipment.serialNumber}</Text>
              </View>
              
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalLabel}>Location:</Text>
                <Text style={styles.modalValue}>{selectedEquipment.location}</Text>
              </View>
              
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalLabel}>Status:</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedEquipment.status) }]}>
                  <Text style={styles.statusText}>{selectedEquipment.status}</Text>
                </View>
              </View>
              
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalLabel}>Compliance:</Text>
                <View style={[styles.statusBadge, { backgroundColor: getComplianceColor(selectedEquipment.complianceStatus) }]}>
                  <Text style={styles.statusText}>{selectedEquipment.complianceStatus}</Text>
                </View>
              </View>
              
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalLabel}>Next Calibration:</Text>
                <Text style={styles.modalValue}>
                  {new Date(selectedEquipment.nextCalibrationAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            
            <View style={styles.modalActions}>
              <Button
                mode="contained"
                onPress={() => {
                  setSelectedEquipment(null)
                  navigation.navigate('Calibration', { equipmentId: selectedEquipment.id })
                }}
                style={styles.modalActionButton}
              >
                Start Calibration
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => {
                  setSelectedEquipment(null)
                  navigation.navigate('Equipment', { 
                    equipmentId: selectedEquipment.id,
                    mode: 'edit'
                  })
                }}
                style={styles.modalActionButton}
              >
                Edit Equipment
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => handleDeleteEquipment(selectedEquipment)}
                style={[styles.modalActionButton, styles.deleteButton]}
                textColor="#EF4444"
              >
                Delete Equipment
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Add Equipment Modal */}
      {showAddModal && (
        <AddEquipmentModal
          visible={showAddModal}
          onDismiss={() => setShowAddModal(false)}
          onAdd={handleAddEquipment}
        />
      )}
    </SafeAreaView>
  )
}

// Add Equipment Modal Component
function AddEquipmentModal({ visible, onDismiss, onAdd }: any) {
  const [equipmentData, setEquipmentData] = useState({
    name: '',
    model: '',
    serialNumber: '',
    type: 'ANALYTICAL_BALANCE',
    location: '',
    notes: ''
  })

  const handleSubmit = () => {
    if (!equipmentData.name || !equipmentData.model || !equipmentData.serialNumber) {
      Alert.alert('Error', 'Please fill in all required fields')
      return
    }
    
    onAdd(equipmentData)
    setEquipmentData({
      name: '',
      model: '',
      serialNumber: '',
      type: 'ANALYTICAL_BALANCE',
      location: '',
      notes: ''
    })
  }

  return (
    <Card style={styles.modalCard}>
      <Card.Content>
        <View style={styles.modalHeader}>
          <Title>Add Equipment</Title>
          <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
            <Icon name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Equipment Name *</Text>
            <TextInput
              style={styles.input}
              value={equipmentData.name}
              onChangeText={(text) => setEquipmentData(prev => ({ ...prev, name: text }))}
              placeholder="Analytical Balance"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Model *</Text>
            <TextInput
              style={styles.input}
              value={equipmentData.model}
              onChangeText={(text) => setEquipmentData(prev => ({ ...prev, model: text }))}
              placeholder="AB-2000"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Serial Number *</Text>
            <TextInput
              style={styles.input}
              value={equipmentData.serialNumber}
              onChangeText={(text) => setEquipmentData(prev => ({ ...prev, serialNumber: text }))}
              placeholder="SN123456"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Type</Text>
            <View style={styles.selectContainer}>
              <TextInput
                style={styles.input}
                value={equipmentData.type}
                onChangeText={(text) => setEquipmentData(prev => ({ ...prev, type: text }))}
                placeholder="Equipment type"
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput
              style={styles.input}
              value={equipmentData.location}
              onChangeText={(text) => setEquipmentData(prev => ({ ...prev, location: text }))}
              placeholder="Lab Room 101"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={equipmentData.notes}
              onChangeText={(text) => setEquipmentData(prev => ({ ...prev, notes: text }))}
              placeholder="Additional notes..."
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
        
        <View style={styles.modalActions}>
          <Button mode="outlined" onPress={onDismiss} style={styles.modalActionButton}>
            Cancel
          </Button>
          <Button mode="contained" onPress={handleSubmit} style={styles.modalActionButton}>
            Add Equipment
          </Button>
        </View>
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF'
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#F9FAFB'
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF'
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8
  },
  filterButtonActive: {
    backgroundColor: '#2563EB'
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280'
  },
  filterTextActive: {
    color: '#FFFFFF'
  },
  equipmentList: {
    flex: 1
  },
  equipmentListContent: {
    padding: 20
  },
  equipmentItem: {
    marginBottom: 12
  },
  equipmentCard: {
    elevation: 2
  },
  equipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  equipmentInfo: {
    flex: 1
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4
  },
  equipmentModel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2
  },
  equipmentSerial: {
    fontSize: 12,
    color: '#9CA3AF'
  },
  equipmentStatus: {
    alignItems: 'flex-end'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500'
  },
  complianceIcon: {
    marginTop: 4
  },
  equipmentDetails: {
    marginTop: 8
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8
  },
  emptyState: {
    alignItems: 'center',
    padding: 40
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 16
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20
  },
  emptyStateButton: {
    marginTop: 10
  },
  modalCard: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    elevation: 10,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  closeButton: {
    padding: 4
  },
  modalDetails: {
    marginBottom: 20
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151'
  },
  modalValue: {
    fontSize: 14,
    color: '#6B7280'
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalActionButton: {
    flex: 1,
    marginHorizontal: 4
  },
  deleteButton: {
    borderColor: '#EF4444'
  },
  formContainer: {
    marginBottom: 20
  },
  inputGroup: {
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF'
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top'
  },
  selectContainer: {
    position: 'relative'
  }
}) 