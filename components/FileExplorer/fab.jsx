import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { Plus } from "lucide-react-native";

export default function Fab({ openSheet }) {
  const toggleFab = () => {
    openSheet(); //this is to present the sheet.
  };

  return (
    <View style={{
      position: "absolute",
      right: 20,
      bottom: 70
    }}>
      <Pressable className="flex flex-row items-center gap-x-2 bg-primary p-6 rounded-2xl" onPress={toggleFab}>
        <View>
          <Plus color={"white"} size={16} />
        </View>
      </Pressable>
    </View>
  );
}
