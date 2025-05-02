import { Pressable, View } from "react-native";
import { forwardRef, useMemo } from "react";
import { Text } from "~/components/ui/text";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { Switch } from "~/components/ui/switch";
import { useStorageSettingsStore } from "~/lib/store";

const StorageSettingsBottomSheetModal = forwardRef((props, ref) => {
  const showHiddenItems = useStorageSettingsStore((state) => state.showHiddenItems);
  const setShowHiddenItems = useStorageSettingsStore((state) => state.setShowHiddenItems);
  const snapPoints = useMemo(() => ["60%"], []);
  const insets = useSafeAreaInsets();
  const theme = useTheme();

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
      <View className="p-4 flex-1">
        <BottomSheetScrollView>
          <View className="p-4 flex flex-row items-center justify-between">
            <Text>Show hidden Items</Text>
            <Switch checked={showHiddenItems} onCheckedChange={(value) => setShowHiddenItems(value)} nativeID="airplane-mode" />
          </View>
        </BottomSheetScrollView>
      </View>
    </BottomSheetModal>
  );
});

export default StorageSettingsBottomSheetModal;
