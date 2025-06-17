import { Platform, Pressable, View } from "react-native";
import { forwardRef, useMemo } from "react";
import { Text } from "~/components/ui/text";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { Switch } from "~/components/ui/switch";
import { useStorageSettingsStore } from "~/lib/store";
import { Separator } from "~/components/ui/separator";
import { ListCollapse, FolderPen } from "~/lib/icons";

const FileExplorerSettingsBottomSheetModal = forwardRef((props, ref) => {
  const showHiddenItems = useStorageSettingsStore((state) => state.showHiddenItems);
  const setShowHiddenItems = useStorageSettingsStore((state) => state.setShowHiddenItems);
  const snapPoints = useMemo(() => ["90%"], []);
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const getSelectedStorageFolder = useMemo(() => {
    //"content://com.android.externalstorage.documents/tree/primary:Downloads/SubFolder"

    const decodedUri = decodeURIComponent(props.storageUri);
    if (decodedUri.includes("tree")) {
      const folder = decodedUri.split("tree")[1]?.split(":")[1];
      if (folder.includes("/")) {
        //multiple folders are there so we need to parse them and show.
        const parts = folder.split("/");
        return parts.join(" / ");
      }
      return folder;
    }

    return null;
  }, [props.storageUri]);

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      topInset={insets.top}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backgroundStyle={{
        backgroundColor: theme.colors.background,
      }}
      enableDynamicSizing={false}
      backdropComponent={(props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />}
    >
      <View className="p-4 flex-1 gap-6">
        <View className="flex flex-row justify-center">
          <Text className="font-bold text-xl">File explorer settings</Text>
        </View>
        <BottomSheetScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            gap: 20,
          }}
        >
          <View className="bg-card p-2 rounded-xl flex-col gap-x-2">
            <View className="flex flex-row items-center justify-between p-4">
              <View className="flex flex-row items-center gap-4">
                <ListCollapse className="text-foreground" size={18} />
                <Text>Show hidden Items</Text>
              </View>
              <Switch checked={showHiddenItems} onCheckedChange={(value) => setShowHiddenItems(value)} nativeID="airplane-mode" />
            </View>

            {Platform.OS === "android" && (
              <>
                <Separator />
                <View className="flex gap-4 p-4">
                  <View className="flex flex-row items-center gap-4">
                    <FolderPen className="text-foreground" size={18} />
                    <Text>Download location</Text>
                  </View>

                  <Text>{getSelectedStorageFolder ?? "Not Configured"}</Text>
                </View>
              </>
            )}
          </View>
        </BottomSheetScrollView>
      </View>
    </BottomSheetModal>
  );
});

export default FileExplorerSettingsBottomSheetModal;
