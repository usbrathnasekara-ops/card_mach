import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#007AFF' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Memory Game',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={"blue"} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Scores',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={"gold"} />
          ),
        }}
      />
    </Tabs>
  );
}