import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { registerForPushNotificationsAsync } from '@/permissions/pushNotificationPermission';

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Layout() {

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
  
  return (
    <Provider store={store}>
    <Tabs
    initialRouteName='login' 
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === 'login') iconName = 'car';
        else if (route.name === 'settings') iconName = 'settings';
        else if (route.name === 'index') iconName = 'log-in';
        else iconName = 'home';

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#1e88e5',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { paddingBottom: 5 },
      headerShown: false,
    })}>
      <Tabs.Screen name="index" options={{ title: '' }} />
      <Tabs.Screen name="login" options={{ title: '' }} />
      <Tabs.Screen name="settings" options={{ title: '' }} />
    </Tabs>
    </Provider>
  );
}
