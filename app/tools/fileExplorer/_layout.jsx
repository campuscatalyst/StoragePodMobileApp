import { View } from "react-native";
import { Stack } from "expo-router";

export default function FileExplorerLayout() {
  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade"
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </View>
  );
}
