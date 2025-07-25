import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import DashboardScreen from '../screens/DashboardScreen';
import EquipmentScreen from '../screens/EquipmentScreen';
import CalibrationScreen from '../screens/CalibrationScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OfflineScreen from '../screens/OfflineScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import OfflineCalibrationScreen from '../screens/OfflineCalibrationScreen';

// Import contexts
import { AuthProvider } from '../contexts/AuthContext';
import { OfflineProvider } from '../contexts/OfflineContext';
import { NotificationProvider } from '../contexts/NotificationContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Equipment':
              iconName = 'build';
              break;
            case 'Calibration':
              iconName = 'schedule';
              break;
            case 'Reports':
              iconName = 'assessment';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen 
        name="Equipment" 
        component={EquipmentScreen}
        options={{
          tabBarLabel: 'Equipment',
        }}
      />
      <Tab.Screen 
        name="Calibration" 
        component={CalibrationScreen}
        options={{
          tabBarLabel: 'Calibration',
        }}
      />
      <Tab.Screen 
        name="Reports" 
        component={ReportsScreen}
        options={{
          tabBarLabel: 'Reports',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}

// Equipment Stack Navigator
function EquipmentStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#1e293b',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="EquipmentList" 
        component={EquipmentScreen}
        options={{ title: 'Equipment' }}
      />
      <Stack.Screen 
        name="QRScanner" 
        component={QRScannerScreen}
        options={{ title: 'Scan QR Code' }}
      />
      <Stack.Screen 
        name="EquipmentDetails" 
        component={EquipmentScreen}
        options={{ title: 'Equipment Details' }}
      />
    </Stack.Navigator>
  );
}

// Calibration Stack Navigator
function CalibrationStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#1e293b',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="CalibrationList" 
        component={CalibrationScreen}
        options={{ title: 'Calibrations' }}
      />
      <Stack.Screen 
        name="OfflineCalibration" 
        component={OfflineCalibrationScreen}
        options={{ title: 'Offline Calibration' }}
      />
      <Stack.Screen 
        name="CalibrationDetails" 
        component={CalibrationScreen}
        options={{ title: 'Calibration Details' }}
      />
    </Stack.Navigator>
  );
}

// Reports Stack Navigator
function ReportsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#1e293b',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="ReportsList" 
        component={ReportsScreen}
        options={{ title: 'Reports' }}
      />
      <Stack.Screen 
        name="ReportDetails" 
        component={ReportsScreen}
        options={{ title: 'Report Details' }}
      />
    </Stack.Navigator>
  );
}

// Settings Stack Navigator
function SettingsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#1e293b',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="SettingsList" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen 
        name="Offline" 
        component={OfflineScreen}
        options={{ title: 'Offline Mode' }}
      />
    </Stack.Navigator>
  );
}

// Main App Navigator
function AppNavigator() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <OfflineProvider>
          <NotificationProvider>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen 
                name="Login" 
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Main" 
                component={MainTabNavigator}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NotificationProvider>
        </OfflineProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}

export default AppNavigator; 