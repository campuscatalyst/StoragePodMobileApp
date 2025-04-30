import { View } from "react-native";
import Main from "~/components/FileExplorer/main";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigationStore } from "~/lib/store";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const insets = useSafeAreaInsets();
  const clearSelectedFolderPath = useNavigationStore((state) => state.clearSelectedFolderPath);

  useEffect(() => {
    clearSelectedFolderPath();
  }, []); //TODO - check if this required.

  return (
    <View
      className="flex-1"
      style={{
        paddingTop: insets.top,
      }}
    >
      <View className="p-4 flex-1 relative">
        <Main />
      </View>
    </View>
  );
}
