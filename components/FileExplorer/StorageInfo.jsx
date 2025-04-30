import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Progress } from "~/components/ui/progress";
import { Image, File, Video, Music } from "~/lib/icons";
import { Settings } from "~/lib/icons";

export default function StorageInfo({ openStorageSettings }) {
  return (
    <View className="h-56 p-4 rounded-3xl bg-card flex justify-between">
      <View className="flex flex-row justify-between items-center">
        <Text className="font-bold text-2xl">Storage</Text>
        <Pressable onPress={() => openStorageSettings()}>
          <Settings className="text-foreground" />
        </Pressable>
      </View>

      <Text>10 GB of 1 TB used</Text>
      <Progress value={10} className="bg-background" indicatorClassName="bg-primary" />
      <View className="flex flex-row justify-around items-center">
        <View className="flex gap-y-2 items-center">
          <Image size={30} className="text-yellow" />
          <Text>24</Text>
        </View>
        <View className="flex gap-y-2 items-center">
          <Video size={30} className="text-purple" />
          <Text>100</Text>
        </View>
        <View className="flex gap-y-2 items-center">
          <File size={30} className="text-primary" />
          <Text>1.2k</Text>
        </View>
        <View className="flex gap-y-2 items-center">
          <Music size={30} className="text-teal" />
          <Text>800</Text>
        </View>
      </View>
    </View>
  );
}
