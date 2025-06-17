import { Stack } from "expo-router";

export default function DiscoveryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade"
      }}
    >
      <Stack.Screen name="discoverDevice" />
      <Stack.Screen name="discoveryMethod" />
      <Stack.Screen name="domainDiscovery" />
    </Stack>
  );
}
