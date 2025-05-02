import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Image } from "expo-image";
import image1 from "~/assets/images/tools_image1.png";
import image2 from "~/assets/images/tools_image2.png";
import image3 from "~/assets/images/tools_image3.png";
import { router } from "expo-router";

const getImage = (id) => {
  switch (id) {
    case 1:
      return image2;
    case 2:
      return image1;
    case 3:
      return image3;
    default:
      return image1;
  }
};

export default function ToolItem({ tool }) {
  return (
    <Pressable className="bg-card shadow-sm p-4 rounded-3xl h-48 w-full flex flex-row justify-between relative" onPress={() => router.push("/tools/fileExplorer")}>
      <View className="w-2/3 flex gap-y-4">
        <Text className="font-bold text-xl">{tool.title}</Text>
        <Text className="text-sm">{tool.subtitle}</Text>
      </View>
      <Image source={getImage(tool.id)} transition={1000} style={{ width: "100", height: "100%", borderRadius: 20 }} />
    </Pressable>
  );
}
