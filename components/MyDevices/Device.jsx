import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { ChevronRight, Wifi, WifiOff } from "lucide-react-native";
import { useTheme } from "@react-navigation/native";
import StatusRenderer from "./StatusRenderer";
import { router } from "expo-router";
import { useDeviceDiscoveryStore, useNavigationStore } from "~/lib/store";
import dayjs from "dayjs";
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOutDown } from "react-native-reanimated";

export default function Device({ data, index }) {
  const theme = useTheme();
  const setSelectedDevice = useNavigationStore((state) => state.setSelectedDevice);
  const setSelecteDomain = useDeviceDiscoveryStore((state) => state.setSelecteDomain);

  const lat = dayjs(data.lastAccessedAt).format(`MMM DD, HH:MM A`);

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(80).stiffness(200).delay(index * 50)}
      exiting={FadeOutDown.springify().damping(80).stiffness(200).delay(index * 50)}
      className="flex justify-between bg-card p-4 rounded-3xl min-h-56">
      <View className="flex flex-row gap-x-2">
        <View className="flex gap-y-4 py-4 px-2">
          <Text className="text-xl font-bold">{data.givenname?.toUpperCase()}</Text>
          <View className="flex flex-row items-center gap-x-2">
            <StatusRenderer status={data.status} />
            <Text className="text-muted-foreground">{data?.ip}</Text>
          </View>
          
        </View>
      </View>
      <View className="flex flex-row justify-between items-center">
        <Text className="text-muted-foreground">Last accessed on {lat}</Text>
        <Pressable
          className="bg-primary/50 rounded-full p-2"
          onPress={() => {
            setSelectedDevice(data);
            setSelecteDomain(data.domainName);
            router.push("/tools");
          }}
        >
          <ChevronRight color={theme.colors.text} />
        </Pressable>
      </View>
    </Animated.View>
  );
}
