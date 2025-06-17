import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import { useGetDevicesQuery } from "~/lib/services/queries/getDevicesQuery";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Image } from "expo-image";
import { router } from "expo-router";

export default function Cta() {
  const devicesQuery = useGetDevicesQuery();

  const [title, description, cta] = useMemo(() => {
    if (devicesQuery.data || devicesQuery.data?.length !== 0) {
      if (devicesQuery.data?.length === 1) return ["Welcome to Storagepod", "Explore your files and stats.", "Open"];
      if (devicesQuery.data?.length >= 1) return ["Your NAS Devices Are Ready", "Manage all your connected StoragePods.", "View Devices"];
    }

    return ["Your Private Cloud Starts Here", "Connect your StoragePod to get started.", "Connect Now"];
  }, [devicesQuery.isPending, devicesQuery.data]);

  if (devicesQuery.isPending) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(80).stiffness(200).delay(150)}
      className="relative w-full h-64 rounded-3xl bg-card p-4 justify-between overflow-hidden"
    >
      <View className="gap-y-2">
        <Text className="font-bold text-card-foreground text-xl">{title}</Text>
        <Text className="font-light text-card-foreground w-2/3">{description}</Text>
      </View>

      <View className="absolute w-1/2 h-64 right-[-20] bottom-[-33]">
        <Image source={require("~/assets/images/storagepod.png")} style={{ width: "100%", height: "100%" }} contentFit="contain" />
      </View>

      <Pressable className="w-1/2 rounded-xl bg-primary/30 border-2 border-border h-12 flex justify-center items-center" onPress={() => router.push("/(dashboard)/devices/myDevices")}>
        <Text className="text-foreground font-bold">{cta}</Text>
      </Pressable>
    </Animated.View>
  );
}
