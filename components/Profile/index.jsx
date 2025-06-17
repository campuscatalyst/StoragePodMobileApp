import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import React from "react";
import { ChevronRight, Settings2, Globe, Sparkles, Bot } from "~/lib/icons";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { router } from "expo-router";

const GITHUB_AVATAR_URI = "https://github.com/mrzachnugent.png";

export default function ProfileIndex() {
  return (
    <View className="flex-1 p-4 gap-8">
      <View className="flex items-center">
        <Avatar alt="Zach Nugent's Avatar" className="w-24 h-24">
          <AvatarImage source={{ uri: GITHUB_AVATAR_URI }} />
          <AvatarFallback>
            <Text>ZN</Text>
          </AvatarFallback>
        </Avatar>
      </View>
      <View className="flex items-center">
        <Text className="font-bold text-xl">Pavan</Text>
        <Text className="font-light">Member since Jan 1st 2025</Text>
      </View>
      <View className="gap-12">
        <Pressable className="flex-row items-center justify-between" onPress={() => router.push("/(dashboard)/profile/generalSettings")}>
          <View className="flex-row items-center gap-4">
            <View className="bg-primary/10 rounded-full p-3 flex items-center justify-center">
              <Settings2 className="text-primary" size={18} />
            </View>
            <View>
              <Text>General Settings</Text>
            </View>
          </View>
          <View>
            <ChevronRight className="text-foreground" size={18}/>
          </View>
        </Pressable>
        <Pressable className="flex-row items-center justify-between" onPress={() => router.push("/(dashboard)/profile/moreInfoSupport")}>
          <View className="flex-row items-center gap-4">
            <View className="bg-primary/10 rounded-full p-3 flex items-center justify-center">
              <Bot className="text-primary" size={18} />
            </View>
            <View>
              <Text>More info & Support</Text>
            </View>
          </View>
          <View>
            <ChevronRight className="text-foreground" size={18}/>
          </View>
        </Pressable>
        <Pressable className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <View className="bg-primary/10 rounded-full p-3 flex items-center justify-center">
              <Globe className="text-primary" size={18} />
            </View>
            <View>
              <Text>Connect with us</Text>
            </View>
          </View>
          <View>
            <ChevronRight className="text-foreground" size={18}/>
          </View>
        </Pressable>
        <Pressable className="flex-row items-center justify-between" onPress={() => router.push("/(dashboard)/profile/rating")}>
          <View className="flex-row items-center gap-4">
            <View className="bg-primary/10 rounded-full p-3 flex items-center justify-center">
              <Sparkles className="text-primary" size={18} />
            </View>
            <View>
              <Text>Rate Us</Text>
            </View>
          </View>
          <View>
            <ChevronRight className="text-foreground" size={18}/>
          </View>
        </Pressable>
      </View>
      <View className="gap-2">
        <View>
          <Text className="text-muted-foreground font-semibold">v1.0.0</Text>
        </View>
        <View>
          <Text className="text-destructive font-semibold">Logout</Text>
        </View>
      </View>
    </View>
  );
}
