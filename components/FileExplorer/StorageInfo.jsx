import { Platform, Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import StorageGraph from "./graphs/storageGraph";

export default function StorageInfo({ openStorageSettings, openFileBrowser }) {
  const used = 120 //GB
  const total = 1200 //GB
  const percentageUsed = (used / total ) * 100;
  return (
    <View className="h-48 p-4 rounded-3xl bg-card shadow-sm flex flex-row justify-between" style={{ elevation: Platform.select({ ios: 0, android: 5 }) }}>
      <View className="flex justify-between">
        <Text className="font-bold">Storage</Text>
        <View>
          <Text className="text-xl font-semibold">{used} GB / {total} GB used</Text>
          <Text>Available storage</Text>
        </View>
        <Pressable className="p-3 rounded-xl bg-primary w-36 flex justify-center items-center" onPress={() => openFileBrowser()}>
          <Text className="text-primary-foreground">View details</Text>
        </Pressable>
      </View>
      <StorageGraph progress={percentageUsed} />
    </View>
  );
}
