import { Pressable, View } from "react-native";
import React, { forwardRef, useMemo } from "react";
import { Text } from "~/components/ui/text";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import ImageSelector from "../imageSelector";
import { File } from "~/lib/icons";
import CreateFolder from "../createFolder";

const SelectSourceBottomSheetModal = forwardRef((props, ref) => {
  const snapPoints = useMemo(() => ["30%"], []);
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
      <View className="p-4">
        <ImageSelector closeSheet={props.closeSheet} openFileUploadProgressSheet={props.openFileUploadProgressSheet} />
        <Pressable className="p-4 flex flex-row gap-x-4 items-center">
          <File className="text-purple" />
          <Text>Upload from File browser</Text>
        </Pressable>
        <CreateFolder setVisible={props.setVisible} closeSheet={props.closeSheet} />
      </View>
    </BottomSheetModal>
  );
});

export default SelectSourceBottomSheetModal;
