import { View } from "react-native";
import { Stack } from "expo-router";

export default function FileExplorerLayout() {
  //Don't add folder as the path in this stack. let it be dynamic. this is introducing few issues where back button isn't working as expected. 
  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="feUtil" />
        <Stack.Screen name="recentActivityFull" />
      </Stack>
    </View>
  );
}
