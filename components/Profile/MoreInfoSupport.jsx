import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import React from "react";
import { Info, ChevronRight, MessageCircleMore, ShieldCheck, Archive } from "~/lib/icons";

export default function MoreInfoSupport() {
 return (
    <View className="flex-1 gap-12">
      <View>
        <Text className="text-muted-foreground">Find comprehensive app support, including contact option for issues, privacy policy, FAQs, and detailed information about the app and its processes</Text>
      </View>
      <View className="flex-1 gap-12">
        <Pressable className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-x-4">
            <MessageCircleMore className="text-foreground" size={20} />
            <Text>Need support? Contact here</Text>
          </View>
          <ChevronRight className="text-foreground" size={20} />
        </Pressable>
        <Pressable className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-x-4">
            <ShieldCheck className="text-foreground" size={20} />
            <Text>Privacy policy</Text>
          </View>
          <ChevronRight className="text-foreground" size={20} />
        </Pressable>
        <Pressable className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-x-4">
            <Archive className="text-foreground" size={20} />
            <Text>FAQ</Text>
          </View>
          <ChevronRight className="text-foreground" size={20} />
        </Pressable>
        <Pressable className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-x-4">
            <Info className="text-foreground" size={20} />
            <Text>About</Text>
          </View>
          <ChevronRight className="text-foreground" size={20} />
        </Pressable>
      </View>
    </View>
  );
}