import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { BellRing } from "~/lib/icons";

/**
 * Add this code in V2 - commented for now. 
 <Pressable className="bg-card rounded-full p-3 flex justify-center items-center">
    <BellRing className="text-foreground" size={18} />
  </Pressable>
 */

export default function Header() {
  return (
    <View className="flex flex-row-reverse items-center justify-center">
      <View className="flex-1 flex justify-center items-center">
        <Text className="font-bn text-4xl">StoragePod</Text>
      </View>
    </View>
  );
}
