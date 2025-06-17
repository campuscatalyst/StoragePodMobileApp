import { Pressable, View, ActivityIndicator } from "react-native";
import React, { useMemo } from "react";
import { Text } from "~/components/ui/text";
import { Wifi, Plus, Check } from "~/lib/icons";
import { useDeviceDiscoveryStore } from "~/lib/store";
import { useGetDeviceQuery } from "~/lib/services/queries/getDevicesQuery";

export default function DiscoveredDevice({ device, openSheet }) {
  const setSelectedDeviceToConnect = useDeviceDiscoveryStore((state) => state.setSelectedDeviceToConnect);
  const setSelecteDomain = useDeviceDiscoveryStore((state) => state.setSelecteDomain);
  const getDeviceQuery = useGetDeviceQuery(device.ip);

  const ButtonRenderer = useMemo(() => {
    if (getDeviceQuery.isPending) {
      return (
        <View className="bg-primary px-6 py-4 rounded-2xl flex flex-row items-center gap-x-2">
          <ActivityIndicator color={"white"} size={"small"} />
        </View>
      );
    }

    if (!getDeviceQuery.data) {
      return (
        <Pressable
          className="bg-primary px-6 py-4 rounded-2xl flex flex-row items-center gap-x-2"
          onPress={() => {
            setSelectedDeviceToConnect(device);
            //TODO - Need to check this
            setSelecteDomain("storagepod.local");
            openSheet();
          }}
        >
          <Plus className="text-primary-foreground" size={14} />
          <Text className="text-sm font-semibold text-primary-foreground">Add</Text>
        </Pressable>
      );
    } else {
      return (
        <Pressable className="bg-primary/50 px-6 py-4 rounded-2xl flex flex-row items-center gap-x-2" disabled>
          <Check className="text-primary-foreground" size={14} />
          <Text className="text-sm font-semibold text-primary-foreground">Added</Text>
        </Pressable>
      );
    }
  }, [getDeviceQuery, getDeviceQuery.isPending]);
  return (
    <View className="bg-card p-8 rounded-3xl flex flex-row items-center justify-between">
      <View className="flex gap-y-4">
        <Text className="font-semibold">{device.name?.split(".")[0]?.toUpperCase()}</Text>
        <View className="flex flex-row items-center gap-x-4">
          <Wifi className="text-card-foreground" size={14} />
          <Text className="text-sm">{device.ip}</Text>
        </View>
      </View>
      <View>{ButtonRenderer}</View>
    </View>
  );
}
