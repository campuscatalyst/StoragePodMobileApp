import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { router } from "expo-router";
import { Image } from "expo-image";
import support from "~/assets/images/support.png";
import feedback from "~/assets/images/feedback.png";
import Animated, { FadeInDown } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SupportFeedback() {
  return (
    <View className="flex flex-row gap-6">
      <AnimatedPressable
        entering={FadeInDown.springify().damping(80).stiffness(200).delay(200)}
        className="p-4 flex-1 bg-card rounded-3xl justify-between"
        onPress={() => router.push("/profile/moreInfoSupport")}
      >
        <View className="self-center">
          <Image source={support} style={{ width: 100, height: 150 }} />
        </View>
        <View className="flex gap-4">
          <Text className="font-bold text-card-foreground text-xl">
            Support
          </Text>
          <View className="flex gap-2">
            <Text className="font-light">Having issues?</Text>
            <Text className="font-light">Reach out.</Text>
          </View>
        </View>
      </AnimatedPressable>
      <AnimatedPressable
        entering={FadeInDown.springify().damping(80).stiffness(200).delay(250)}
        className="p-4 flex-1 bg-card rounded-3xl justify-between"
        onPress={() => router.push("/profile/rating")}
      >
        <View className="self-center">
          <Image source={feedback} style={{ width: 100, height: 150 }} />
        </View>
        <View className="flex gap-4">
          <Text className="font-bold text-card-foreground text-xl">
            Feedback
          </Text>
          <View className="flex gap-2">
            <Text className="font-light">Help us grow!</Text>
            <Text className="font-light">Share Thoughts</Text>
          </View>
        </View>
      </AnimatedPressable>
    </View>
  );
}
