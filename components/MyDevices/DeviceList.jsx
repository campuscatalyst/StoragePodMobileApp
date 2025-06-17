import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import Device from "./Device";
import LottieView from "lottie-react-native";
import { router } from "expo-router";

export default DeviceList = ({ data }) => {
  if (!data || !data.length) {
    return (
      <View className="flex-1 flex items-center justify-center">
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
        <View className="flex gap-y-4 items-center">
          <Text className="text-xl font-bold">No Devices Connected</Text>
          <Button onPress={() => router.push("/discovery/discoveryMethod")}>
            <Text>Connect New Device</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 flex gap-y-4">
      {data.map((device, index) => (
        <Device key={device.id} data={device} index={index} />
      ))}
    </View>
  );
};
