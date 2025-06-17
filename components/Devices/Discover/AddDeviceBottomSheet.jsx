import React, { forwardRef, useMemo, useState } from "react";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import ResetPassword from "./resetPassword";
import ConnectToDevice from "./connectToDevice";

const AddDeviceBottomSheet = forwardRef((props, ref) => {
  const snapPoints = useMemo(() => ["90%"], []);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [index, setIndex] = useState(0);

  const closeSheet = () => {
    if (ref.current) {
      ref.current.dismiss();
    }
  };

  const SheetContentRenderer = useMemo(() => {
    if (index === 0) {
      return <ConnectToDevice setIndex={setIndex} closeSheet={closeSheet} mode={props.mode} />;
    }

    if (index === 1) {
      return <ResetPassword setIndex={setIndex} closeSheet={closeSheet} />;
    }
  }, [index]);

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
      <BottomSheetScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        {SheetContentRenderer}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default AddDeviceBottomSheet;
