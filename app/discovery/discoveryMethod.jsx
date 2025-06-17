import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import SafeView from "~/components/SafeView";
import { Image } from "expo-image";
import { router } from "expo-router";

export default function DiscoveryMethod() {
  return (
    <SafeView>
      <View className="flex-1 p-4 flex gap-y-8">
        <View>
          <Text className="font-bold text-2xl">Choose a Connection Method</Text>
          <Text className="font-light text-sm">
            You can either scan for devices on your local network or manually enter a domain name to connect.
          </Text>
        </View>
        <View className="flex gap-y-4">
          <Pressable className="bg-card rounded-3xl p-4 min-h-64 relative overflow-hidden" style={{elevation: 5}} onPress={() => router.push("/discovery/discoverDevice")}>
            <Text className="font-bold text-xl">Local Scan</Text>
            <Text>Automatically find devices on your local network</Text>
            <View style={{position: "absolute", height: 300, width: 300, bottom: -80, right: -80, zIndex: -20}}>
                <Image source={require("~/assets/images/globe.png")} style={{width: "100%", height: "100%"}} contentFit="contain"/>
            </View>
          </Pressable>
          <Pressable className="bg-card rounded-3xl p-4 min-h-64 relative overflow-hidden" style={{elevation: 5}} onPress={() => router.push("/discovery/domainDiscovery")}>
            <Text className="font-bold text-xl">Domain Name</Text>
            <Text>Manually enter the domain name of your storage pod.</Text>
            <View style={{position: "absolute", height: 300, width: 300, bottom: -80, right: -80, zIndex: -20}}>
                <Image source={require("~/assets/images/globe.png")} style={{width: "100%", height: "100%"}} contentFit="contain"/>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeView>
  );
}
