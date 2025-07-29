import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  RefreshControl
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card, Title, Button, List, Divider, Avatar } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useAuth } from '../contexts/AuthContext'
import { useQuery, useMutation } from 'react-query'
import { authAPI } from '../services/api'

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  laboratoryName: string
  phone?: string
  avatar?: string
  preferences: {
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
    theme: 'light' | 'dark' | 'auto'
    language: string
    timezone: string
  }
  lastLoginAt: string
  createdAt: string
}

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth()
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  })

  // Fetch user profile
  const { data: profile, isLoading, refetch } = useQuery(
    'profile',
    () => authAPI.getProfile(),
    {
      onError: (error) => {
        Alert.alert('Error', 'Failed to load profile')
      }
    }
  )

  // Update profile mutation
  const updateProfileMutation = useMutation(
    (profileData: any) => authAPI.updateProfile(profileData),
    {
      onSuccess: () => {
        Alert.alert('Success', 'Profile updated successfully')
        refetch()
      },
      onError: (error: any) => {
        Alert.alert('Error', error.response?.data?.message || 'Failed to update profile')
      }
    }
  )

  // Update preferences mutation
  const updatePreferencesMutation = useMutation(
    (preferences: any) => authAPI.updatePreferences(preferences),
    {
      onSuccess: () => {
        Alert.alert('Success', 'Preferences updated successfully')
      },
      onError: (error: any) => {
        Alert.alert('Error', 'Failed to update preferences')
      }
    }
  )

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout }
      ]
    )
  }

  const handleUpdateNotifications = (type: string, value: boolean) => {
    const newNotifications = { ...notifications, [type]: value }
    setNotifications(newNotifications)
    updatePreferencesMutation.mutate({ notifications: newNotifications })
  }

  const renderProfileHeader = () => (
    <Card style={styles.profileCard}>
      <Card.Content>
        <View style={styles.profileHeader}>
          <Avatar.Text
            size={80}
            label={`${profile?.firstName?.[0] || 'U'}${profile?.lastName?.[0] || ''}`}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Title style={styles.profileName}>
              {profile?.firstName} {profile?.lastName}
            </Title>
            <Text style={styles.profileEmail}>{profile?.email}</Text>
            <Text style={styles.profileRole}>{profile?.role}</Text>
            <Text style={styles.profileLab}>{profile?.laboratoryName}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  )

  const renderAccountSection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Account</Title>
        
        <List.Item
          title="Edit Profile"
          description="Update your personal information"
          left={(props) => <List.Icon {...props} icon="account-edit" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('EditProfile')}
        />
        
        <Divider />
        
        <List.Item
          title="Change Password"
          description="Update your password"
          left={(props) => <List.Icon {...props} icon="lock" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('ChangePassword')}
        />
        
        <Divider />
        
        <List.Item
          title="Two-Factor Authentication"
          description="Add an extra layer of security"
          left={(props) => <List.Icon {...props} icon="shield-check" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('TwoFactorAuth')}
        />
      </Card.Content>
    </Card>
  )

  const renderPreferencesSection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Preferences</Title>
        
        <List.Item
          title="Email Notifications"
          description="Receive notifications via email"
          left={(props) => <List.Icon {...props} icon="email" />}
          right={() => (
            <Switch
              value={notifications.email}
              onValueChange={(value) => handleUpdateNotifications('email', value)}
            />
          )}
        />
        
        <Divider />
        
        <List.Item
          title="Push Notifications"
          description="Receive push notifications"
          left={(props) => <List.Icon {...props} icon="bell" />}
          right={() => (
            <Switch
              value={notifications.push}
              onValueChange={(value) => handleUpdateNotifications('push', value)}
            />
          )}
        />
        
        <Divider />
        
        <List.Item
          title="SMS Notifications"
          description="Receive notifications via SMS"
          left={(props) => <List.Icon {...props} icon="message-text" />}
          right={() => (
            <Switch
              value={notifications.sms}
              onValueChange={(value) => handleUpdateNotifications('sms', value)}
            />
          )}
        />
        
        <Divider />
        
        <List.Item
          title="Theme"
          description="Light, Dark, or Auto"
          left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('ThemeSettings')}
        />
        
        <Divider />
        
        <List.Item
          title="Language"
          description="English"
          left={(props) => <List.Icon {...props} icon="translate" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('LanguageSettings')}
        />
      </Card.Content>
    </Card>
  )

  const renderSecuritySection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Security</Title>
        
        <List.Item
          title="Login History"
          description="View your recent login activity"
          left={(props) => <List.Icon {...props} icon="history" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('LoginHistory')}
        />
        
        <Divider />
        
        <List.Item
          title="Active Sessions"
          description="Manage your active sessions"
          left={(props) => <List.Icon {...props} icon="devices" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('ActiveSessions')}
        />
        
        <Divider />
        
        <List.Item
          title="Privacy Settings"
          description="Manage your privacy preferences"
          left={(props) => <List.Icon {...props} icon="eye" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('PrivacySettings')}
        />
      </Card.Content>
    </Card>
  )

  const renderSupportSection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Support</Title>
        
        <List.Item
          title="Help Center"
          description="Get help and find answers"
          left={(props) => <List.Icon {...props} icon="help-circle" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('HelpCenter')}
        />
        
        <Divider />
        
        <List.Item
          title="Contact Support"
          description="Get in touch with our team"
          left={(props) => <List.Icon {...props} icon="message" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('ContactSupport')}
        />
        
        <Divider />
        
        <List.Item
          title="Feedback"
          description="Share your feedback with us"
          left={(props) => <List.Icon {...props} icon="star" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('Feedback')}
        />
        
        <Divider />
        
        <List.Item
          title="About"
          description="App version and information"
          left={(props) => <List.Icon {...props} icon="information" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('About')}
        />
      </Card.Content>
    </Card>
  )

  const renderAccountInfo = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Account Information</Title>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Member Since:</Text>
          <Text style={styles.infoValue}>
            {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Last Login:</Text>
          <Text style={styles.infoValue}>
            {profile?.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Role:</Text>
          <Text style={styles.infoValue}>{profile?.role || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Laboratory:</Text>
          <Text style={styles.infoValue}>{profile?.laboratoryName || 'N/A'}</Text>
        </View>
      </Card.Content>
    </Card>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="cog" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Profile Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {renderProfileHeader()}
        {renderAccountSection()}
        {renderPreferencesSection()}
        {renderSecuritySection()}
        {renderSupportSection()}
        {renderAccountInfo()}

        {/* Sign Out Button */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor="#EF4444"
          icon="logout"
        >
          Sign Out
        </Button>
      </ScrollView>
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    flex: 1
  },
  contentContainer: {
    padding: 20
  },
  profileCard: {
    marginBottom: 20,
    elevation: 2
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    marginRight: 16,
    backgroundColor: '#2563EB'
  },
  profileInfo: {
    flex: 1
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2
  },
  profileRole: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2
  },
  profileLab: {
    fontSize: 12,
    color: '#9CA3AF'
  },
  sectionCard: {
    marginBottom: 16,
    elevation: 1
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280'
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500'
  },
  logoutButton: {
    marginTop: 20,
    borderColor: '#EF4444'
  }
}) 