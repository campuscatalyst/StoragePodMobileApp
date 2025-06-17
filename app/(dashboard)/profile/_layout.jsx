import { Stack } from "expo-router";

export default function DevicesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="generalSettings" />
      <Stack.Screen name="moreInfoSupport" />
    </Stack>
  );
}
