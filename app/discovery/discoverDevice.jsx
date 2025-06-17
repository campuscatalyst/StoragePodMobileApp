import { Pressable, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { Text } from "~/components/ui/text";
import SafeView from "~/components/SafeView";
import useDiscoverDevice from "~/components/Devices/Discover/discoverDeviceHook";
import LottieView from "lottie-react-native";
import DevicesList from "~/components/Devices/Discover/discoveredDevicesList";
import { RotateCcw } from "~/lib/icons";
import AddDeviceBottomSheet from "~/components/Devices/Discover/AddDeviceBottomSheet";
import axios from "axios";
import {} from "react-native-ssl-public-key-pinning";
import Animated, { LinearTransition, FadeInRight, FadeOutRight, FadeInUp, FadeInDown, FadeOutDown, FadeOutUp } from "react-native-reanimated";
import { errorNotification } from "~/components/notification";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function DiscoverDevice() {
  const { isScanning, error, discoveredDevices, startScan, stopScan } = useDiscoverDevice({
    serviceType: "dlna", // Your service type from Avahi config
    deviceNameFilter: "storagepod", // This will filter for your device name
    autoScan: true, // Don't scan automatically on component mount
    scanTimeout: 10000, // 10 seconds timeout
  });

  const bottomSheetRef = useRef(null);

  const openSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current?.present();
    }
  };

  /*const getData = async () => {
    try {
      const result = await axios.get("http://storagepod.local:8080/api/v1/server-status");
      //console.error(result.data);
    } catch (error) {
      console.error(error);
    }
  };*/

  useEffect(() => {
    if (isScanning) {
      const timer = setTimeout(() => {
        stopScan();
      }, 10000); // 10 seconds timeout

      return () => clearTimeout(timer);
    }
  }, [isScanning]);

  if(error) {
    errorNotification("Internal Error - ERR008");
  }

  return (
    <SafeView>
      <AddDeviceBottomSheet ref={bottomSheetRef} mode={"local"} />
      <View className="flex-1 p-4 gap-y-12">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row gap-x-2 items-center">
            <LottieView
              style={{
                width: 35,
                height: 35,
                backgroundColor: "transparent",
              }}
              source={require("~/assets/lottie/searchingDevices.json")}
              autoPlay
              loop
            />

            {isScanning ? (
              <Animated.View
                entering={FadeInUp.springify().damping(80).stiffness(200)}
                exiting={FadeOutUp.springify().damping(80).stiffness(200)}
                layout={LinearTransition.springify().damping(80).stiffness(200)}
              >
                <Text className="font-semibold">Searching for nearby devices, please wait.</Text>
              </Animated.View>
            ) : (
              <Animated.View
                entering={FadeInUp.springify().damping(80).stiffness(200)}
                exiting={FadeOutUp.springify().damping(80).stiffness(200)}
                layout={LinearTransition.springify().damping(80).stiffness(200)}
                className="font-semibold"
              >
                <Text className="font-semibold">Search Completed</Text>
              </Animated.View>
            )}
          </View>

          {!isScanning && (
            <AnimatedPressable
              entering={FadeInRight.springify().damping(80).stiffness(200)}
              exiting={FadeOutRight.springify().damping(80).stiffness(200)}
              layout={LinearTransition.springify().damping(80).stiffness(200)}
              className="border-2 border-border p-2 px-6 rounded-xl"
              onPress={() => startScan()}
            >
              <RotateCcw className="text-foreground" size={16} />
            </AnimatedPressable>
          )}
        </View>

        <DevicesList devices={discoveredDevices} isScanning={isScanning} openSheet={openSheet} />
      </View>
    </SafeView>
  );
}
