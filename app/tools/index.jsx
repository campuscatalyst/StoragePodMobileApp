import { View, ScrollView, Pressable } from "react-native";
import React, { useEffect } from "react";
import { Text } from "~/components/ui/text";
import SafeView from "~/components/SafeView";
import ToolsList from "~/components/AllTools/ToolsList";
import { Settings } from "~/lib/icons";
import { useTheme } from "@react-navigation/native";
import { useNavigationStore } from "~/lib/store";
import { router } from "expo-router";
import StatusRenderer from "~/components/MyDevices/StatusRenderer";
export default function Index() {
  const theme = useTheme();
  const selectedDevice = useNavigationStore((state) => state.selectedDevice);

  useEffect(() => {
    if (!selectedDevice || !Object.keys(selectedDevice).length) {
      router.back();
    }
  }, []);

  return (
    <SafeView>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
          flexGrow: 1,
        }}
      >
        <View className="flex-1 p-4 flex gap-y-6">
          <View className="flex flex-row justify-between items-center">
            <View className="flex gap-y-2">
              <Text className="text-2xl font-bold text-foreground">{selectedDevice?.title}</Text>

              <StatusRenderer status={selectedDevice?.status} />
            </View>
            <Pressable onPress={() => router.push("tools/deviceSettings")}>
              <Settings color={theme.colors.text} />
            </Pressable>
          </View>
          <ToolsList />
        </View>
      </ScrollView>
    </SafeView>
  );
}
