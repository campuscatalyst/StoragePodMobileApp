import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { BellRing } from "~/lib/icons";

export default function Header() {
  return (
    <View className="flex flex-row-reverse items-center justify-center">
      <Pressable className="bg-card rounded-full p-3 flex justify-center items-center">
        <BellRing className="text-foreground" size={18} />
      </Pressable>

      <View className="flex-1 flex justify-center items-center">
        <Text className="font-bn text-4xl">StoragePod</Text>
      </View>
    </View>
  );
}
