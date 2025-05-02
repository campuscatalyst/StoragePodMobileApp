import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { router } from "expo-router";
import { Folder, ChevronRight } from "~/lib/icons";

export default function FolderRenderer({ data, theme, pushToSelectedFolderPath }) {
  return (
    <Pressable
      className="p-6 h-24 bg-primary/50 rounded-xl flex flex-row items-center justify-between"
      onPress={() => {
        pushToSelectedFolderPath(data.name);
        router.push({ pathname: "/tools/fileExplorer/folder" });
      }}
    >
      <View className="w-2/3 flex flex-row items-center gap-x-4">
        <Folder className="text-foreground" size={20} />
        <Text numberOfLines={1} className="text-sm font-white font-bold">
          {data.name}
        </Text>
      </View>
      <ChevronRight className="text-foreground" size={20} />
    </Pressable>
  );
}
