import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { Plus } from "lucide-react-native";

export default function Fab({ openSheet }) {
  const toggleFab = () => {
    openSheet(); //this is to present the sheet.
  };

  return (
    <View className="absolute bottom-12 right-4">
      <Pressable className="flex flex-row items-center gap-x-2 bg-primary p-5 rounded-2xl" onPress={toggleFab}>
        <View>
          <Plus color={"white"} size={16} />
        </View>
      </Pressable>
    </View>
  );
}
