import React, { forwardRef, useMemo } from "react";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { Text } from "~/components/ui/text";
import { View } from "react-native";
import { Progress } from "~/components/ui/progress";

const DownloadItemBottomSheetModal = forwardRef((props, ref) => {
  //UTILS
  const snapPoints = useMemo(() => ["50%"], []);
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
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      backdropComponent={(props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />}
    >
      <View className="flex-1 p-4 pt-0 justify-center items-center gap-4">
        <Text className="font-bold">Download in progress</Text>
        <Progress className="w-full" value={props.progress}/>
      </View>
    </BottomSheetModal>
  );
});

export default DownloadItemBottomSheetModal;
