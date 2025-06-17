import { View, Text, ScrollView } from "react-native";
import React from "react";
import Header from "./header";
import { getGreetingBasedOnTime } from "~/lib/utils";
import Animated, { FadeInDown } from "react-native-reanimated";
import Cta from "./cta";

export default function HomeIndex() {
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      contentInset={{ bottom: 50 }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 p-4 gap-8">
        <Header />
        <View>
          <Animated.Text entering={FadeInDown.springify().damping(80).stiffness(200)} className="text-3xl text-foreground">Welcome Back,</Animated.Text>
          <Animated.Text entering={FadeInDown.springify().damping(80).stiffness(200).delay(100)} className="text-3xl text-primary font-bold">Pavan</Animated.Text>
        </View>
        <Cta />
      </View>
    </ScrollView>
  );
}
