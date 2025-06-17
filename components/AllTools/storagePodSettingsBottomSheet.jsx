import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import React, { forwardRef, useMemo } from "react";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { ChevronRight, Trash, RefreshCcw, KeyRound } from "~/lib/icons";
import { useNavigationStore } from "~/lib/store";
import { Separator } from "~/components/ui/separator";
import { localAuthenticateUser } from "~/lib/utils";

const StoragePodSettingsBottomSheet = forwardRef((props, ref) => {
  const snapPoints = useMemo(() => ["90%"], []);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const refreshTokenBottomPageRef = useNavigationStore((state) => state.refreshTokenBottomPageRef);
  const resetPasswordBottomPageRef = useNavigationStore((state) => state.resetPasswordBottomPageRef);
  

  const refreshHandler = async () => {
    ref.current?.dismiss();
    refreshTokenBottomPageRef?.current?.present();
  };

  const deleteHandler = () => {
    ref.current?.dismiss();
    props.setDeleteStoragePodModalVisible(true);
  }

  const resetPasswordHandler = async () => {
    const result = await localAuthenticateUser();
    if (result) {
      resetPasswordBottomPageRef?.current?.present();
      return;
    }
    //TODO - if result is false, get the serial number and verify with the backend
    console.error(result);
  };

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
        <View className="flex justify-center items-center">
          <Text className="font-bold">Settings</Text>
        </View>
        <View className="flex-1 p-4">
          <View className="bg-card p-2 rounded-xl flex-col gap-x-2">
            <Pressable className="p-4 flex flex-row items-center justify-between" onPress={() => resetPasswordHandler()}>
              <View className="flex flex-row items-center gap-x-4">
                <KeyRound className="text-foreground" size={18} />
                <Text className="text-foreground">Reset Password</Text>
              </View>
              <ChevronRight className="text-foreground" size={20} />
            </Pressable>
            <Separator />
            <Pressable className="p-4 flex flex-row items-center justify-between" onPress={() => refreshHandler()}>
              <View className="flex flex-row items-center gap-x-4">
                <RefreshCcw className="text-foreground" size={18} />
                <Text className="text-foreground">Refresh Token</Text>
              </View>
              <ChevronRight className="text-foreground" size={20} />
            </Pressable>
            <Separator />
            <Pressable className="p-4 flex flex-row items-center justify-between rounded-xl" onPress={() => deleteHandler()}>
              <View className="flex flex-row items-center gap-x-4">
                <Trash className="text-destructive" size={18} />
                <Text className="text-destructive">Delete</Text>
              </View>
              <ChevronRight className="text-destructive" size={20} />
            </Pressable>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default StoragePodSettingsBottomSheet;
