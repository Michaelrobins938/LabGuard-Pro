import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showSwitch = false,
    switchValue = false,
    onSwitchChange = () => {},
    showBadge = false,
    badgeCount = 0,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    showBadge?: boolean;
    badgeCount?: number;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={styles.settingIcon}>
        <Icon name={icon} size={24} color="#2563eb" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showBadge && badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount}</Text>
        </View>
      )}
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#e2e8f0', true: '#2563eb' }}
          thumbColor={switchValue ? '#ffffff' : '#ffffff'}
        />
      ) : (
        <Icon name="chevron-right" size={24} color="#64748b" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* User Profile */}
      <View style={styles.section}>
        <View style={styles.userProfile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0) || 'D'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Demo User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'demo@labguard.com'}</Text>
            <Text style={styles.userRole}>{user?.role || 'Admin'}</Text>
          </View>
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingsList}>
          <SettingItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Receive alerts and updates"
            showSwitch={true}
            switchValue={notificationsEnabled}
            onSwitchChange={setNotificationsEnabled}
            showBadge={true}
            badgeCount={notifications.length}
          />
          <SettingItem
            icon="schedule"
            title="Calibration Reminders"
            subtitle="Get notified about due calibrations"
            showSwitch={true}
            switchValue={true}
            onSwitchChange={() => {}}
          />
          <SettingItem
            icon="warning"
            title="Equipment Alerts"
            subtitle="Receive equipment failure alerts"
            showSwitch={true}
            switchValue={true}
            onSwitchChange={() => {}}
          />
        </View>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <View style={styles.settingsList}>
          <SettingItem
            icon="cloud-off"
            title="Offline Mode"
            subtitle="Work without internet connection"
            showSwitch={true}
            switchValue={offlineMode}
            onSwitchChange={setOfflineMode}
          />
          <SettingItem
            icon="dark-mode"
            title="Dark Mode"
            subtitle="Switch to dark theme"
            showSwitch={true}
            switchValue={darkMode}
            onSwitchChange={setDarkMode}
          />
          <SettingItem
            icon="language"
            title="Language"
            subtitle="English"
            onPress={() => Alert.alert('Language', 'Language settings coming soon')}
          />
          <SettingItem
            icon="storage"
            title="Storage"
            subtitle="Manage app data and cache"
            onPress={() => Alert.alert('Storage', 'Storage settings coming soon')}
          />
        </View>
      </View>

      {/* Data & Privacy */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        <View style={styles.settingsList}>
          <SettingItem
            icon="sync"
            title="Sync Settings"
            subtitle="Manage data synchronization"
            onPress={() => Alert.alert('Sync', 'Sync settings coming soon')}
          />
          <SettingItem
            icon="security"
            title="Privacy"
            subtitle="Manage your privacy settings"
            onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon')}
          />
          <SettingItem
            icon="backup"
            title="Backup & Restore"
            subtitle="Backup your data"
            onPress={() => Alert.alert('Backup', 'Backup settings coming soon')}
          />
        </View>
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.settingsList}>
          <SettingItem
            icon="help"
            title="Help & Support"
            subtitle="Get help and contact support"
            onPress={() => Alert.alert('Support', 'Support coming soon')}
          />
          <SettingItem
            icon="description"
            title="Documentation"
            subtitle="User guides and tutorials"
            onPress={() => Alert.alert('Documentation', 'Documentation coming soon')}
          />
          <SettingItem
            icon="feedback"
            title="Send Feedback"
            subtitle="Report bugs and suggest features"
            onPress={() => Alert.alert('Feedback', 'Feedback form coming soon')}
          />
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.settingsList}>
          <SettingItem
            icon="info"
            title="App Version"
            subtitle="1.0.0"
            onPress={() => {}}
          />
          <SettingItem
            icon="update"
            title="Check for Updates"
            subtitle="Latest version available"
            onPress={() => Alert.alert('Updates', 'Update check coming soon')}
          />
          <SettingItem
            icon="description"
            title="Terms of Service"
            subtitle="Read our terms and conditions"
            onPress={() => Alert.alert('Terms', 'Terms of service coming soon')}
          />
          <SettingItem
            icon="privacy-tip"
            title="Privacy Policy"
            subtitle="Read our privacy policy"
            onPress={() => Alert.alert('Privacy', 'Privacy policy coming soon')}
          />
        </View>
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#dc2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  section: {
    padding: 20,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#94a3b8',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  settingsList: {
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  badge: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
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
  logoutText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 