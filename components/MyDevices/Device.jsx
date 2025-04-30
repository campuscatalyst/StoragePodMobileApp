import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { ChevronRight, Wifi, WifiOff } from "lucide-react-native";
import { useTheme } from "@react-navigation/native";
import StatusRenderer from "./StatusRenderer";
import { router } from "expo-router";
import { useNavigationStore } from "~/lib/store";

export default function Device({ data }) {
  const theme = useTheme();
  const setSelectedDevice = useNavigationStore((state) => state.setSelectedDevice);

  return (
    <View className="flex justify-between bg-card shadow-sm p-4 rounded-3xl min-h-56" style={{ elevation: 6 }}>
      <View className="flex flex-row gap-x-2">
        <View className="flex gap-y-2 py-4 px-2">
          <Text className="text-xl font-bold">{data.title}</Text>
          <StatusRenderer status={data.status} />
        </View>
      </View>
      <View className="flex flex-row justify-between items-center">
        <Text className="text-muted-foreground">Last accessed on {data.lastAccessedTimestamp}</Text>
        <Pressable
          className="bg-primary/50 rounded-full p-2"
          onPress={() => {
            setSelectedDevice(data);
            router.push("/tools");
          }}
        >
          <ChevronRight color={theme.colors.text} />
        </Pressable>
      </View>
    </View>
  );
}
