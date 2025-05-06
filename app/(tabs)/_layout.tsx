import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import registerForPushNotificationsAsync from '@/permissions/pushNotificationPermission';

export default function Layout() {

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
  
  return (
    <Tabs screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === 'index') iconName = 'car';
        else if (route.name === 'settings') iconName = 'settings';
        else if (route.name === 'login') iconName = 'log-in';
        else iconName = 'home';

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#1e88e5',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { paddingBottom: 5 },
      headerShown: false,
    })}>
            <Tabs.Screen name="login" options={{ title: '' }} />
      <Tabs.Screen name="index" options={{ title: '' }} />
      <Tabs.Screen name="settings" options={{ title: '' }} />
    </Tabs>
  );
}
