import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text } from "~/components/ui/text";
import LottieView from "lottie-react-native";
import DiscoveredDevice from "./discoveredDevice";

export default function DiscoveredDevicesList({ devices, isScanning, openSheet }) {
  if (!isScanning && (!devices || !devices.length)) {
    return (
      <View className="flex-1 gap-y-2 justify-center items-center">
        <LottieView
          style={{
            width: 300,
            height: 250,
            backgroundColor: "transparent",
          }}
          source={require("~/assets/lottie/devicesNotFound.json")}
          autoPlay
          loop
        />

        <Text className="font-semibold">No devices found</Text>
        <Text className="text-sm font-light text-center">Make sure that the storage pod is powered-on and connected to network.</Text>
      </View>
    );
  }

  if (!devices || !devices.length) return null;

  return (
    <View className="flex-1 gap-y-6">
      <View>
        <Text className="font-bold text-xl">Found Devices</Text>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <View className="flex-1 gap-y-4">
          {devices.map((device) => (
            <DiscoveredDevice key={device.id} device={device} openSheet={openSheet} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
