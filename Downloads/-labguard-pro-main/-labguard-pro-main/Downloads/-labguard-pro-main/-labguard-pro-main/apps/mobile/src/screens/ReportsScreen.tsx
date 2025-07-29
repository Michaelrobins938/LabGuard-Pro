import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  RefreshControl
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card, Title, Button, ProgressBar, Chip } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useQuery, useMutation } from 'react-query'
import { reportsAPI } from '../services/api'

interface Report {
  id: string
  title: string
  type: 'COMPLIANCE' | 'CALIBRATION' | 'EQUIPMENT' | 'AUDIT'
  status: 'DRAFT' | 'COMPLETED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
  equipmentCount: number
  complianceRate: number
  totalIssues: number
  resolvedIssues: number
  generatedBy: string
  laboratoryId: string
}

interface ReportFilter {
  type: string
  status: string
  dateRange: string
}

export default function ReportsScreen({ navigation }: any) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [filter, setFilter] = useState<ReportFilter>({
    type: 'ALL',
    status: 'ALL',
    dateRange: 'ALL'
  })

  // Fetch reports
  const { data: reports, isLoading, refetch } = useQuery(
    'reports',
    () => reportsAPI.getAll(),
    {
      onError: (error) => {
        Alert.alert('Error', 'Failed to load reports')
      }
    }
  )

  // Generate report mutation
  const generateReportMutation = useMutation(
    (reportData: any) => reportsAPI.generate(reportData),
    {
      onSuccess: (data) => {
        Alert.alert('Success', 'Report generated successfully')
        refetch()
      },
      onError: (error: any) => {
        Alert.alert('Error', error.response?.data?.message || 'Failed to generate report')
      }
    }
  )

  // Export report mutation
  const exportReportMutation = useMutation(
    (reportId: string) => reportsAPI.export(reportId),
    {
      onSuccess: (data) => {
        Alert.alert('Success', 'Report exported successfully')
      },
      onError: (error: any) => {
        Alert.alert('Error', 'Failed to export report')
      }
    }
  )

  const filteredReports = reports?.filter((report: Report) => {
    const matchesType = filter.type === 'ALL' || report.type === filter.type
    const matchesStatus = filter.status === 'ALL' || report.status === filter.status
    return matchesType && matchesStatus
  }) || []

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'COMPLIANCE':
        return 'check-circle'
      case 'CALIBRATION':
        return 'wrench'
      case 'EQUIPMENT':
        return 'test-tube'
      case 'AUDIT':
        return 'clipboard-check'
      default:
        return 'file-document'
    }
  }

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'COMPLIANCE':
        return '#10B981'
      case 'CALIBRATION':
        return '#3B82F6'
      case 'EQUIPMENT':
        return '#8B5CF6'
      case 'AUDIT':
        return '#F59E0B'
      default:
        return '#6B7280'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return '#10B981'
      case 'DRAFT':
        return '#F59E0B'
      case 'ARCHIVED':
        return '#6B7280'
      default:
        return '#6B7280'
    }
  }

  const handleGenerateReport = (type: string) => {
    Alert.alert(
      'Generate Report',
      `Generate ${type.toLowerCase()} report?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Generate', onPress: () => generateReportMutation.mutate({ type }) }
      ]
    )
  }

  const handleExportReport = (report: Report) => {
    exportReportMutation.mutate(report.id)
  }

  const handleShareReport = async (report: Report) => {
    try {
      await Share.share({
        message: `LabGuard Pro Report: ${report.title}`,
        title: report.title
      })
    } catch (error) {
      Alert.alert('Error', 'Failed to share report')
    }
  }

  const handleReportPress = (report: Report) => {
    setSelectedReport(report)
  }

  const renderReportItem = ({ item }: { item: Report }) => (
    <TouchableOpacity
      style={styles.reportItem}
      onPress={() => handleReportPress(item)}
    >
      <Card style={styles.reportCard}>
        <Card.Content>
          <View style={styles.reportHeader}>
            <View style={styles.reportInfo}>
              <View style={styles.reportTitleRow}>
                <Icon
                  name={getReportTypeIcon(item.type)}
                  size={20}
                  color={getReportTypeColor(item.type)}
                  style={styles.reportTypeIcon}
                />
                <Title style={styles.reportTitle}>{item.title}</Title>
              </View>
              <Text style={styles.reportDate}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.reportStatus}>
              <Chip
                mode="outlined"
                textStyle={{ color: getStatusColor(item.status) }}
                style={[styles.statusChip, { borderColor: getStatusColor(item.status) }]}
              >
                {item.status}
              </Chip>
            </View>
          </View>
          
          <View style={styles.reportMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Equipment</Text>
              <Text style={styles.metricValue}>{item.equipmentCount}</Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Compliance</Text>
              <Text style={styles.metricValue}>{item.complianceRate}%</Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Issues</Text>
              <Text style={styles.metricValue}>
                {item.resolvedIssues}/{item.totalIssues}
              </Text>
            </View>
          </View>
          
          <View style={styles.reportActions}>
            <Button
              mode="outlined"
              onPress={() => handleExportReport(item)}
              style={styles.actionButton}
              icon="download"
            >
              Export
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => handleShareReport(item)}
              style={styles.actionButton}
              icon="share"
            >
              Share
            </Button>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.filterButton, filter.type === 'ALL' && styles.filterButtonActive]}
          onPress={() => setFilter(prev => ({ ...prev, type: 'ALL' }))}
        >
          <Text style={[styles.filterText, filter.type === 'ALL' && styles.filterTextActive]}>
            All Types
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filter.type === 'COMPLIANCE' && styles.filterButtonActive]}
          onPress={() => setFilter(prev => ({ ...prev, type: 'COMPLIANCE' }))}
        >
          <Text style={[styles.filterText, filter.type === 'COMPLIANCE' && styles.filterTextActive]}>
            Compliance
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filter.type === 'CALIBRATION' && styles.filterButtonActive]}
          onPress={() => setFilter(prev => ({ ...prev, type: 'CALIBRATION' }))}
        >
          <Text style={[styles.filterText, filter.type === 'CALIBRATION' && styles.filterTextActive]}>
            Calibration
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filter.type === 'AUDIT' && styles.filterButtonActive]}
          onPress={() => setFilter(prev => ({ ...prev, type: 'AUDIT' }))}
        >
          <Text style={[styles.filterText, filter.type === 'AUDIT' && styles.filterTextActive]}>
            Audit
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => handleGenerateReport('COMPLIANCE')}
        >
          <Icon name="check-circle" size={32} color="#10B981" />
          <Text style={styles.quickActionText}>Compliance Report</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => handleGenerateReport('CALIBRATION')}
        >
          <Icon name="wrench" size={32} color="#3B82F6" />
          <Text style={styles.quickActionText}>Calibration Report</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => handleGenerateReport('EQUIPMENT')}
        >
          <Icon name="test-tube" size={32} color="#8B5CF6" />
          <Text style={styles.quickActionText}>Equipment Report</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => handleGenerateReport('AUDIT')}
        >
          <Icon name="clipboard-check" size={32} color="#F59E0B" />
          <Text style={styles.quickActionText}>Audit Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('Reports', { mode: 'settings' })}
        >
          <Icon name="cog" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      {renderQuickActions()}

      {/* Filters */}
      {renderFilters()}

      {/* Reports List */}
      <ScrollView
        style={styles.reportsList}
        contentContainerStyle={styles.reportsListContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {filteredReports.length > 0 ? (
          filteredReports.map((report: Report) => (
            <View key={report.id}>
              {renderReportItem({ item: report })}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="file-document" size={64} color="#CBD5E1" />
            <Text style={styles.emptyStateText}>No reports found</Text>
            <Text style={styles.emptyStateSubtext}>
              Generate your first report to get started
            </Text>
            <Button
              mode="contained"
              onPress={() => handleGenerateReport('COMPLIANCE')}
              style={styles.emptyStateButton}
            >
              Generate Report
            </Button>
          </View>
        )}
      </ScrollView>

      {/* Report Details Modal */}
      {selectedReport && (
        <Card style={styles.modalCard}>
          <Card.Content>
            <View style={styles.modalHeader}>
              <Title>{selectedReport.title}</Title>
              <TouchableOpacity
                onPress={() => setSelectedReport(null)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalDetails}>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalLabel}>Type:</Text>
                <View style={styles.modalValueContainer}>
                  <Icon
                    name={getReportTypeIcon(selectedReport.type)}
                    size={16}
                    color={getReportTypeColor(selectedReport.type)}
                  />
                  <Text style={styles.modalValue}>{selectedReport.type}</Text>
                </View>
              </View>
              
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalLabel}>Status:</Text>
                <Chip
                  mode="outlined"
                  textStyle={{ color: getStatusColor(selectedReport.status) }}
                  style={[styles.statusChip, { borderColor: getStatusColor(selectedReport.status) }]}
                >
                  {selectedReport.status}
                </Chip>
              </View>
              
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalLabel}>Created:</Text>
                <Text style={styles.modalValue}>
                  {new Date(selectedReport.createdAt).toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalLabel}>Equipment Count:</Text>
                <Text style={styles.modalValue}>{selectedReport.equipmentCount}</Text>
              </View>
              
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalLabel}>Compliance Rate:</Text>
                <Text style={styles.modalValue}>{selectedReport.complianceRate}%</Text>
              </View>
              
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalLabel}>Issues Resolved:</Text>
                <Text style={styles.modalValue}>
                  {selectedReport.resolvedIssues}/{selectedReport.totalIssues}
                </Text>
              </View>
            </View>
            
            <View style={styles.modalActions}>
              <Button
                mode="contained"
                onPress={() => {
                  setSelectedReport(null)
                  navigation.navigate('ReportDetails', { reportId: selectedReport.id })
                }}
                style={styles.modalActionButton}
              >
                View Details
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => handleExportReport(selectedReport)}
                style={styles.modalActionButton}
              >
                Export PDF
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => handleShareReport(selectedReport)}
                style={styles.modalActionButton}
              >
                Share Report
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}
    </SafeAreaView>
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
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center'
  },
  quickActionsContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center'
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
  reportsList: {
    flex: 1
  },
  reportsListContent: {
    padding: 20
  },
  reportItem: {
    marginBottom: 12
  },
  reportCard: {
    elevation: 2
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  reportInfo: {
    flex: 1
  },
  reportTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  reportTypeIcon: {
    marginRight: 8
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  reportDate: {
    fontSize: 12,
    color: '#9CA3AF'
  },
  reportStatus: {
    alignItems: 'flex-end'
  },
  statusChip: {
    height: 24
  },
  reportMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  metricItem: {
    alignItems: 'center'
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4
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
  modalValueContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalValue: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalActionButton: {
    flex: 1,
    marginHorizontal: 4
  }
}) 