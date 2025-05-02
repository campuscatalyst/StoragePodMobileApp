import { Stack } from "expo-router";

export default function DevicesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade"
      }}
    >
      <Stack.Screen name="myDevices" />
    </Stack>
  );
}
