import { useTheme } from "@react-navigation/native";
import { Tabs } from "expo-router";
import { Home, User, Layers, MonitorSpeaker } from "lucide-react-native";

export default function DashboardLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "fade",
        tabBarActiveTintColor: theme.colors.primary,
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          elevation: -1,
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => <Home name="home" size={18} color={color} />,
        }}
      />
      <Tabs.Screen
        name="devices"
        options={{
          title: "Devices",
          tabBarIcon: ({ color }) => <MonitorSpeaker name="devices" size={18} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User name="profile" size={18} color={color} />,
        }}
      />
    </Tabs>
  );
}
