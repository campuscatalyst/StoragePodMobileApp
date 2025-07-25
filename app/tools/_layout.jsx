import { Stack } from "expo-router";

export default function ToolsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade"
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="statistics" />
    </Stack>
  );
}
