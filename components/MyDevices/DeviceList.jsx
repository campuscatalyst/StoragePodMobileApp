import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import Device from "./Device";

export default DeviceList = ({ data }) => {
  if (!data || !data.length) {
    return (
      <View className="flex-1 flex items-center justify-center">
        <View className="flex gap-y-4 items-center">
          <Text className="text-2xl font-bold">No Devices Connected</Text>
          <Button className="roundex-full">
            <Text>Connect New Device</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 flex gap-y-4">
      {data.map((device) => (
        <Device key={device.id} data={device} />
      ))}
    </View>
  );
};
