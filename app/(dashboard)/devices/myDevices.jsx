import { useEffect } from "react";
import { View } from "react-native";
import SafeView from "~/components/SafeView";
import DeviceList from "~/components/MyDevices/DeviceList";
import dayjs from "dayjs";
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, withTiming } from "react-native-reanimated";

//UI
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useTheme } from "@react-navigation/native";

/**
    Get the connected devices from the local sqlite db and if there is none show a connect to device button in the center.
    if there is a list render the items along with a button at top or at the end. 
 */

export default function myDevices() {
  const theme = useTheme();
  const data = [
    {
      id: 1,
      title: "Storage Pod",
      model: "X1 PRO",
      status: "online",
      lastAccessedTimestamp: dayjs().format(`MMM, HH:MM A`),
    },
    {
      id: 2,
      title: "Storage Pod 2",
      model: "X1 PRO",
      status: "offline",
      lastAccessedTimestamp: dayjs().format(`MMM, HH:MM A`),
    },
  ];

  const buttonOffset = useSharedValue(100); // Start hidden (below screen)
  const buttonOpacity = useSharedValue(0); // Start fully transparent

  useEffect(() => {
    // Show the button by default when component mounts
    buttonOffset.value = withTiming(0, { duration: 300 });
    buttonOpacity.value = withTiming(1, { duration: 300 });
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const yOffset = event.contentOffset.y;

      if (yOffset > 50) {
        buttonOffset.value = withTiming(0, { duration: 300 }); // Slide up
        buttonOpacity.value = withTiming(1, { duration: 300 }); // Fade in
      }

      // If scrolling back to the top, hide the button
      if (yOffset <= 50) {
        buttonOffset.value = withTiming(100, { duration: 300 }); // Slide down
        buttonOpacity.value = withTiming(0, { duration: 300 }); // Fade out
      }
    },
  });

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonOffset.value }],
    opacity: buttonOpacity.value,
  }));

  return (
    <SafeView className="relative">
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          flexGrow: 1,
        }}
      >
        <View className="flex-1 p-4 flex gap-y-6">
          <View className="flex justify-center items-center">
            <Text className="text-4xl font-bold text-foreground">My Devices</Text>
          </View>
          <DeviceList data={data} />
        </View>
      </Animated.ScrollView>
      <Animated.View
        className="absolute bottom-0 left-0 w-full p-4 h-18"
        style={[
          animatedButtonStyle,
          {
            zIndex: 10, // Ensure this View is on top of the ScrollView
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <Button className="p-8">
          <Text>Connect new device</Text>
        </Button>
      </Animated.View>
    </SafeView>
  );
}
