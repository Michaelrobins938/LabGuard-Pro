import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card, Title, Paragraph, Button } from 'react-native-paper'
import { LineChart, BarChart } from 'react-native-chart-kit'
import { Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useQuery } from 'react-query'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'

const screenWidth = Dimensions.get('window').width

interface DashboardStats {
  totalEquipment: number
  overdueCalibrations: number
  completedCalibrations: number
  complianceScore: number
  upcomingCalibrations: number
}

interface Equipment {
  id: string
  name: string
  status: string
  lastCalibratedAt: string
  nextCalibrationAt: string
  complianceStatus: string
}

export default function DashboardScreen({ navigation }: any) {
  const { user } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalEquipment: 0,
    overdueCalibrations: 0,
    completedCalibrations: 0,
    complianceScore: 0,
    upcomingCalibrations: 0
  })

  // Fetch dashboard data
  const { data: dashboardData, refetch, isLoading } = useQuery(
    'dashboard',
    async () => {
      const response = await api.get('/dashboard/stats')
      return response.data
    },
    {
      onSuccess: (data) => {
        setStats(data.stats)
      },
      onError: (error) => {
        Alert.alert('Error', 'Failed to load dashboard data')
      }
    }
  )

  // Fetch equipment list
  const { data: equipment } = useQuery(
    'equipment',
    async () => {
      const response = await api.get('/equipment')
      return response.data.equipment
    }
  )

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return '#10B981'
      case 'OVERDUE':
        return '#EF4444'
      case 'DUE_SOON':
        return '#F59E0B'
      default:
        return '#6B7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return 'check-circle'
      case 'OVERDUE':
        return 'alert-circle'
      case 'DUE_SOON':
        return 'clock'
      default:
        return 'help-circle'
    }
  }

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [85, 88, 92, 89, 94, 91],
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
        strokeWidth: 2
      }
    ]
  }

  const complianceData = {
    labels: ['Compliant', 'Due Soon', 'Overdue'],
    data: [stats.completedCalibrations, stats.upcomingCalibrations, stats.overdueCalibrations]
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            Welcome back, {user?.firstName}!
          </Text>
          <Text style={styles.subtitle}>
            Here's your lab compliance overview
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statRow}>
                <Icon name="test-tube" size={24} color="#2563EB" />
                <View style={styles.statText}>
                  <Text style={styles.statNumber}>{stats.totalEquipment}</Text>
                  <Text style={styles.statLabel}>Equipment</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statRow}>
                <Icon name="check-circle" size={24} color="#10B981" />
                <View style={styles.statText}>
                  <Text style={styles.statNumber}>{stats.completedCalibrations}</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statRow}>
                <Icon name="alert-circle" size={24} color="#EF4444" />
                <View style={styles.statText}>
                  <Text style={styles.statNumber}>{stats.overdueCalibrations}</Text>
                  <Text style={styles.statLabel}>Overdue</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Compliance Score */}
        <Card style={styles.complianceCard}>
          <Card.Content>
            <Title>Compliance Score</Title>
            <View style={styles.complianceRow}>
              <Text style={styles.complianceScore}>{stats.complianceScore}%</Text>
              <View style={styles.complianceBar}>
                <View 
                  style={[
                    styles.complianceFill, 
                    { width: `${stats.complianceScore}%` }
                  ]} 
                />
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Compliance Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>Compliance Trend</Title>
            <LineChart
              data={chartData}
              width={screenWidth - 40}
              height={180}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16
                }
              }}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* Equipment Status */}
        <Card style={styles.equipmentCard}>
          <Card.Content>
            <Title>Equipment Status</Title>
            {equipment?.slice(0, 5).map((item: Equipment) => (
              <TouchableOpacity
                key={item.id}
                style={styles.equipmentItem}
                onPress={() => navigation.navigate('Equipment', { equipmentId: item.id })}
              >
                <View style={styles.equipmentInfo}>
                  <Text style={styles.equipmentName}>{item.name}</Text>
                  <Text style={styles.equipmentDate}>
                    Due: {new Date(item.nextCalibrationAt).toLocaleDateString()}
                  </Text>
                </View>
                <Icon
                  name={getStatusIcon(item.complianceStatus)}
                  size={20}
                  color={getStatusColor(item.complianceStatus)}
                />
              </TouchableOpacity>
            ))}
            {equipment?.length > 5 && (
              <Button
                mode="text"
                onPress={() => navigation.navigate('Equipment')}
                style={styles.viewAllButton}
              >
                View All Equipment
              </Button>
            )}
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Title>Quick Actions</Title>
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('Calibration', { mode: 'new' })}
              >
                <Icon name="cog" size={24} color="#2563EB" />
                <Text style={styles.actionText}>New Calibration</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('Equipment', { mode: 'add' })}
              >
                <Icon name="plus" size={24} color="#10B981" />
                <Text style={styles.actionText}>Add Equipment</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('Reports')}
              >
                <Icon name="chart-line" size={24} color="#F59E0B" />
                <Text style={styles.actionText}>View Reports</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('QRScanner')}
              >
                <Icon name="qrcode-scan" size={24} color="#8B5CF6" />
                <Text style={styles.actionText}>Scan QR Code</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6'
  },
  scrollView: {
    flex: 1
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF'
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10
  },
  statCard: {
    flex: 1,
    elevation: 2
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statText: {
    marginLeft: 12
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280'
  },
  complianceCard: {
    margin: 20,
    elevation: 2
  },
  complianceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  complianceScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563EB',
    marginRight: 15
  },
  complianceBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4
  },
  complianceFill: {
    height: 8,
    backgroundColor: '#2563EB',
    borderRadius: 4
  },
  chartCard: {
    margin: 20,
    elevation: 2
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16
  },
  equipmentCard: {
    margin: 20,
    elevation: 2
  },
  equipmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  equipmentInfo: {
    flex: 1
  },
  equipmentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937'
  },
  equipmentDate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2
  },
  viewAllButton: {
    marginTop: 10
  },
  actionsCard: {
    margin: 20,
    elevation: 2
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10
  },
  actionButton: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: '1%'
  },
  actionText: {
    fontSize: 12,
    color: '#374151',
    marginTop: 8,
    textAlign: 'center'
  }
}) 