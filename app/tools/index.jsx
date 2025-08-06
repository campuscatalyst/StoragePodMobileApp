import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Text } from "~/components/ui/text";
import SafeView from "~/components/SafeView";
import ToolsList from "~/components/AllTools/ToolsList";
import { Settings } from "~/lib/icons";
import { useTheme } from "@react-navigation/native";
import { useNavigationStore } from "~/lib/store";
import { router } from "expo-router";
import StoragePodSettingsBottomSheet from "~/components/AllTools/storagePodSettingsBottomSheet";
import RefreshTokenBottomSheet from "~/components/Devices/refreshTokenBottomSheet";
import ResetPasswordBottomSheet from "~/components/Devices/resetPasswordBottomSheet";
import StatusRenderer from "~/components/MyDevices/StatusRenderer";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import image1 from "~/assets/images/graph1.png";
import { isServerOnline } from "~/lib/services/api";
import {
  errorNotification,
  successNotification,
} from "~/components/notification";
import LottieView from "lottie-react-native";
import DeleteStoragePodModal from "~/components/AllTools/deleteStoragePodModal";
import { useQueryClient } from "@tanstack/react-query";
import { deleteDevice } from "~/lib/db/api";
import RenameDeviceBottomSheet from "~/components/Devices/renameDeviceBottomSheet";
import { Button } from "~/components/ui/button";

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    borderRadius: 5,
    flex: 1,
  },
});

export default function Index() {
  const theme = useTheme();
  const selectedDevice = useNavigationStore((state) => state.selectedDevice);

  //REFS
  const storageSettingsRef = useRef(null);
  const refreshTokenBottomSheetRef = useRef(null);
  const resetPasswordBottomSheetRef = useRef(null);
  const renameDeviceBottomSheetRef = useRef(null);

  const setRefreshTokenBottomPageRef = useNavigationStore(
    (state) => state.setRefreshTokenBottomPageRef
  );
  const setResetPasswordBottomPageRef = useNavigationStore(
    (state) => state.setResetPasswordBottomPageRef
  );
  const setRenameDeviceBottomPageRef = useNavigationStore(
    (state) => state.setRenameDeviceBottomPageRef
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [deleteStoragePodModalVisible, setDeleteStoragePodModalVisible] =
    useState(false);
  const [deleteStoragePodLoading, setDeleteStoragePodLoading] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    //this is to set the ref of the bottom page in the global store once this page is loaded.
    setRefreshTokenBottomPageRef(refreshTokenBottomSheetRef);
    setResetPasswordBottomPageRef(resetPasswordBottomSheetRef);
    setRenameDeviceBottomPageRef(renameDeviceBottomSheetRef);
  }, []);

  const checkPodConnectionStatus = async () => {
    try {
      setLoading(true);
      const result = await isServerOnline();

      if (!result) {
        errorNotification(
          "Error, couldn't reach out to the server. try again later"
        );
        router.back();
      }
    } catch (error) {
      //errorNotification("Internal Error - ERR009");
      if (error.code === "ECONNABORTED") {
        setError("ECONNABORTED");
        return;
      }
      errorNotification("Internal Error - ERR009");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedDevice || !Object.keys(selectedDevice).length) {
      errorNotification("Internal Error - ERR011");
      router.back();
    }
    checkPodConnectionStatus();
  }, []);

  const openSheet = () => {
    if (storageSettingsRef.current) {
      storageSettingsRef.current.present();
    }
  };

  const deleteHandler = async () => {
    try {
      setDeleteStoragePodLoading(true);
      const result = await deleteDevice(selectedDevice.id);
      //TODO - show notification
      successNotification("Successfully deleted the storage pod");
      router.back();
      qc.invalidateQueries(["getDevices"]);
    } catch (error) {
      errorNotification("Internal Error - ERR010");
      console.error(error);
    } finally {
      setDeleteStoragePodLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 flex justify-center items-center gap-y-12">
        <LottieView
          style={{
            width: 300,
            height: 300,
            padding: 20,
            backgroundColor: "transparent",
          }}
          source={require("~/assets/lottie/fetchingData.json")}
          autoPlay
          loop
        />
        <Text className="font-bold text-xl">Connecting to the storage pod</Text>
      </View>
    );
  }

  if (error) {
    //TODO - Need to handle errors other than connection aborted.
    return (
      <View className="flex-1 p-4 flex justify-center items-center gap-y-12">
        <LottieView
          style={{
            width: 300,
            height: 300,
            padding: 20,
            backgroundColor: "transparent",
          }}
          source={require("~/assets/lottie/error.json")}
          autoPlay
          loop
        />
        <View className="flex gap-4 items-center ">
          <Text className="font-bold text-xl">Connection Timeout</Text>
          <Text className="text-center">
            Please ensure your Storage Pod is powered on and connected to the
            same network.
          </Text>
          <Button className="mt-4" onPress={() => router.back()}>
            <Text>Back</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <SafeView>
      <StoragePodSettingsBottomSheet
        ref={storageSettingsRef}
        setDeleteStoragePodModalVisible={setDeleteStoragePodModalVisible}
      />
      <RefreshTokenBottomSheet ref={refreshTokenBottomSheetRef} />
      <ResetPasswordBottomSheet ref={resetPasswordBottomSheetRef} />
      <RenameDeviceBottomSheet ref={renameDeviceBottomSheetRef} />
      <DeleteStoragePodModal
        visible={deleteStoragePodModalVisible}
        setVisible={setDeleteStoragePodModalVisible}
        deleteHandler={deleteHandler}
        loading={deleteStoragePodLoading}
      />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          flexGrow: 1,
        }}
      >
        <View className="flex-1 p-4 flex gap-y-6">
          <View className="flex flex-row justify-between items-center">
            <View className="flex gap-y-2">
              <Text className="text-2xl font-bold text-foreground">
                {selectedDevice?.givenname?.toUpperCase()}
              </Text>
              <View className="flex flex-row items-center gap-x-2">
                <StatusRenderer status={selectedDevice?.status} />
                <Text className="text-muted-foreground">
                  {selectedDevice?.ip}
                </Text>
              </View>
            </View>
            <Pressable onPress={() => openSheet()}>
              <Settings color={theme.colors.text} />
            </Pressable>
          </View>
          <Pressable
            className="h-36 w-full bg-primary rounded-3xl p-4 relative overflow-hidden"
            onPress={() => router.push("/tools/statistics")}
          >
            <LinearGradient
              // Background Linear Gradient
              colors={["rgba(0,0,0,0.8)", "transparent"]}
              style={styles.background}
            />

            <Text className="font-bold text-2xl text-white">
              Server Statistics
            </Text>
            <View
              className="absolute w-full h-full top-0 opacity-70"
              style={{ right: -120 }}
            >
              <Image
                source={image1}
                transition={1000}
                style={{ width: 220, height: 220, borderRadius: 20 }}
                tintColor={"white"}
              />
            </View>
          </Pressable>
          <ToolsList />
        </View>
      </ScrollView>
    </SafeView>
  );
}
