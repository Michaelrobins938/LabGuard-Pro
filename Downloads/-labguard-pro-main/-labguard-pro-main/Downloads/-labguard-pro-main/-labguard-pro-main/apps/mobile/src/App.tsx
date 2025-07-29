import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Provider } from 'react-query'
import { QueryClient, QueryClientProvider } from 'react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider as PaperProvider } from 'react-native-paper'
import Toast from 'react-native-toast-message'

// Screens
import LoginScreen from './screens/LoginScreen'
import DashboardScreen from './screens/DashboardScreen'
import EquipmentScreen from './screens/EquipmentScreen'
import CalibrationScreen from './screens/CalibrationScreen'
import ReportsScreen from './screens/ReportsScreen'
import ProfileScreen from './screens/ProfileScreen'
import OfflineScreen from './screens/OfflineScreen'

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { OfflineProvider } from './contexts/OfflineContext'
import { NotificationProvider } from './contexts/NotificationContext'

// Components
import { LoadingSpinner } from './components/LoadingSpinner'
import { NetworkStatus } from './components/NetworkStatus'

// Icons
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === 'Dashboard') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline'
          } else if (route.name === 'Equipment') {
            iconName = focused ? 'test-tube' : 'test-tube'
          } else if (route.name === 'Calibration') {
            iconName = focused ? 'cog' : 'cog-outline'
          } else if (route.name === 'Reports') {
            iconName = focused ? 'chart-line' : 'chart-line'
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline'
          }

          return <Icon name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Equipment" component={EquipmentScreen} />
      <Tab.Screen name="Calibration" component={CalibrationScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

function Navigation() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="Offline" component={OfflineScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <OfflineProvider>
                <NotificationProvider>
                  <NetworkStatus />
                  <Navigation />
                  <Toast />
                </NotificationProvider>
              </OfflineProvider>
            </AuthProvider>
          </QueryClientProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
} 