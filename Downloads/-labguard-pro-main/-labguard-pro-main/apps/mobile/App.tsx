import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import { AuthProvider, useAuth } from './src/contexts/AuthContext'
import { OfflineProvider } from './src/contexts/OfflineContext'
import { NotificationProvider } from './src/contexts/NotificationContext'

// Auth Screens
import LoginScreen from './src/screens/LoginScreen'
import RegisterScreen from './src/screens/RegisterScreen'

// Main Screens
import DashboardScreen from './src/screens/DashboardScreen'
import EquipmentScreen from './src/screens/EquipmentScreen'
import CalibrationScreen from './src/screens/CalibrationScreen'
import ScanScreen from './src/screens/ScanScreen'
import ReportsScreen from './src/screens/ReportsScreen'
import ProfileScreen from './src/screens/ProfileScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline'
          } else if (route.name === 'Equipment') {
            iconName = focused ? 'hardware-chip' : 'hardware-chip-outline'
          } else if (route.name === 'Calibration') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline'
          } else if (route.name === 'Scan') {
            iconName = focused ? 'scan' : 'scan-outline'
          } else if (route.name === 'Reports') {
            iconName = focused ? 'document-text' : 'document-text-outline'
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline'
          } else {
            iconName = 'help-outline'
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Equipment" component={EquipmentScreen} />
      <Tab.Screen name="Calibration" component={CalibrationScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

function AppNavigator() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null // Or a loading screen
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <OfflineProvider>
        <NotificationProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </NotificationProvider>
      </OfflineProvider>
    </AuthProvider>
  )
} 