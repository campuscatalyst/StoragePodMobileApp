import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { FolderPlus } from "~/lib/icons";

export default function CreateFolder({ setVisible, closeSheet }) {
  return (
    <Pressable className="p-4 flex flex-row gap-x-4 items-center" onPress={() => {closeSheet(); setVisible(true);}}>
      <FolderPlus className="text-teal" />
      <Text>Create Folder</Text>
    </Pressable>
  );
}
