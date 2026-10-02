import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import DashboardScreen from '../screens/DashboardScreen';
import BillsScreen from '../screens/BillsScreen';
import BudgetScreen from '../screens/BudgetScreen';
import AddBillScreen from '../screens/AddBillScreen';
import ScanBillScreen from '../screens/ScanBillScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: { height: 60, paddingBottom: 8 },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Özet',
          tabBarIcon: () => <Text>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Bills"
        component={BillsScreen}
        options={{
          tabBarLabel: 'Faturalar',
          tabBarIcon: () => <Text>📑</Text>,
        }}
      />
      <Tab.Screen
        name="Budgets"
        component={BudgetScreen}
        options={{
          tabBarLabel: 'Bütçe',
          tabBarIcon: () => <Text>🎯</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="AddBill"
          component={AddBillScreen}
          options={{ title: 'Yeni Fatura', presentation: 'modal' }}
        />
        <Stack.Screen
          name="ScanBill"
          component={ScanBillScreen}
          options={{ title: 'Fatura Tara (OCR)', presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
