import { View, ActivityIndicator } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import React, { forwardRef, useMemo, useState } from "react";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { renameDeviceSchema } from "~/lib/schemas";
import { successNotification } from "../notification";
import { renameDevice, getDevicebyId } from "~/lib/db/api";
import { useNavigationStore, useDeviceDiscoveryStore } from "~/lib/store";
import { useQueryClient } from "@tanstack/react-query";

const RenameDeviceBottomSheet = forwardRef((props, ref) => {
  const snapPoints = useMemo(() => ["90%"], []);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const selectedDevice = useNavigationStore((state) => state.selectedDevice);
  const setSelectedDevice = useNavigationStore(
    (state) => state.setSelectedDevice
  );
  const setSelecteDomain = useDeviceDiscoveryStore(
    (state) => state.setSelecteDomain
  );
  const qc = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(renameDeviceSchema),
    defaultValues: {
      name: "",
    },
  });

  const renameDeviceHandler = async (data) => {
    try {
      setLoading(true);
      const name = data.name;
      await renameDevice(name, selectedDevice.id);

      ref.current?.dismiss();

      successNotification("Succesfully renamed the device");
      qc.invalidateQueries(["getDevices"]);

      //This is to update the latest selected device state.
      const device = await getDevicebyId(selectedDevice.id);
      setSelectedDevice(device);
      setSelecteDomain(device.domainName);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      )}
    >
      <BottomSheetScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 p-8 pt-0 flex gap-y-12">
          <View className="flex gap-y-2">
            <Text className="font-bold text-xl">Rename Device</Text>
            <Text className="font-light">
              Enter a new name for your StoragePod
            </Text>
          </View>
          <View className="flex-1 gap-y-6 justify-between">
            <View className="gap-y-6">
              <View className="flex gap-y-2">
                <Label>Name</Label>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { value, onBlur, onChange } }) => (
                    <>
                      <BottomSheetTextInput
                        className="h-12 rounded-md border border-input bg-background px-3 text-lg leading-[1.25] text-foreground placeholder:text-muted-foreground"
                        value={value}
                        placeholder=""
                        onBlur={onBlur}
                        onChangeText={(text) => onChange(text)}
                        enterKeyHint="next"
                      />
                      {errors.name && (
                        <Text className="text-destructive font-bold">
                          {errors.name.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>
            </View>

            <Button onPress={handleSubmit(renameDeviceHandler)}>
              {loading ? (
                <ActivityIndicator size={"small"} color={"white"} />
              ) : (
                <Text>Rename</Text>
              )}
            </Button>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default RenameDeviceBottomSheet;
