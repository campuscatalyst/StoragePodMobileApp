import { useState, useCallback } from "react";
import { View, RefreshControl, ScrollView, ActivityIndicator } from "react-native";
import SafeView from "~/components/SafeView";
import DeviceList from "~/components/MyDevices/DeviceList";

//UI
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { useGetDevicesQuery } from "~/lib/services/queries/getDevicesQuery";
import { useQueryClient } from "@tanstack/react-query";
import LottieView from "lottie-react-native";

/**
    Get the connected devices from the local sqlite db and if there is none show a connect to device button in the center.
    if there is a list render the items along with a button at top or at the end. 
 */

export default function myDevices() {
  const theme = useTheme();
  const devicesQuery = useGetDevicesQuery();
  const [refreshing, setRefreshing] = useState(false);
  const qc = useQueryClient();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    qc.invalidateQueries(["getDevices"]);
    setRefreshing(false);
  }, []);

  if (devicesQuery.isLoading) {
    return (
      <SafeView>
        <View className="flex-1 flex justify-center items-center">
          <ActivityIndicator size={"large"} className="text-primary" />
          <Text>Loading the connected devices</Text>
        </View>
      </SafeView>
    );
  }

  if (devicesQuery.isError) {
    console.error(devicesQuery.error);
    return (
      <SafeView>
        <View className="flex-1 flex justify-center items-center gap-y-12">
          <LottieView
            style={{
              width: 300,
              height: 300,
              padding: 20,
              backgroundColor: "transparent",
            }}
            source={require("~/assets/lottie/error.json")}
            autoPlay
            loop
          />
          <View className="flex gap-y-4 items-center">
            <Text className="font-bold text-xl">Error loading the Devices. Reach out to the support.</Text>
            <Text className="font-bold text-xl">ERR - ERR002</Text>
          </View>
        </View>
      </SafeView>
    );
  }

  return (
    <SafeView className="relative">
      <ScrollView
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          flexGrow: 1,
        }}
        horizontal={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="flex-1 p-4 flex gap-y-6">
          <View className="flex">
            <Text className="text-3xl font-bold text-foreground">My Devices</Text>
          </View>
          <DeviceList data={devicesQuery.data ?? []} />
        </View>
      </ScrollView>

      {devicesQuery.data && devicesQuery.data?.length !== 0 && (
        <View
          className="absolute bottom-0 left-0 w-full p-4 h-18"
          style={{
            zIndex: 10, // Ensure this View is on top of the ScrollView
            backgroundColor: theme.colors.background,
          }}
        >
          <Button className="p-8" onPress={() => router.push("/discovery/discoveryMethod")}>
            <Text>Connect new device</Text>
          </Button>
        </View>
      )}
    </SafeView>
  );
}
