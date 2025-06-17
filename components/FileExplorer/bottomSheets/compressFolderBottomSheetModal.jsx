import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { getPath, sleep } from "~/lib/utils";
import { errorNotification } from "~/components/notification";
import { useNavigationStore, useFileExplorerStore } from "~/lib/store";
import { Text } from "~/components/ui/text";
import { View, Pressable } from "react-native";
import { compressFolder as compressFolderApi, getCompressStatus } from "~/lib/services/api";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "~/lib/icons";
import LottieView from "lottie-react-native";

const CompressFolderBottomSheetModal = forwardRef((props, ref) => {
  //UTILS
  const snapPoints = useMemo(() => ["50%"], []);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const qc = useQueryClient();

  //Local state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //Global State
  const selectedFolderPathList = useNavigationStore((state) => state.selectedFolderPathList);
  const selectedFolderPath = getPath(selectedFolderPathList);
  const selectedFolderToCompress = useFileExplorerStore((state) => state.selectedFolderToCompress);
  const setSelectedFolderToCompress = useFileExplorerStore((state) => state.setSelectedFolderToCompress);

  useEffect(() => {
    if (selectedFolderToCompress) {
      compressFolder();
    }
  }, [selectedFolderToCompress]);

  const compressFolder = async () => {
    try {
      setLoading(true);
      if (!selectedFolderToCompress) {
        errorNotification("Internal Error - ");
        ref.current?.dismiss();
        return;
      }

      const folderPathToCompress = `${selectedFolderPath}/${selectedFolderToCompress.name}`.replace(/\/+/g, "/");
      const { task_id } = await compressFolderApi(folderPathToCompress);

      let taskProgress = await getCompressStatus(task_id);

      if (taskProgress?.progress <= -1) {
        //error occured
        throw new Error("Compression Failed, Internal Error -");
      }

      while (taskProgress?.progress < 100) {
        await sleep(3); //it will sleep for 3 seconds.

        taskProgress = await getCompressStatus(task_id);

        if (taskProgress.progress === -1) {
          //error occured
          throw new Error("Compression Failed, Internal Error -");
        }
      }
    } catch (error) {
      console.error(error);
      setError("Error");
    } finally {
      setLoading(false);
    }
  };

  const renderMainView = () => {
    if (loading) {
      return (
        <View className="flex justify-center items-center gap-y-2">
          <LottieView
            style={{
              width: 200,
              height: 200,
              backgroundColor: "transparent",
            }}
            source={require("~/assets/lottie/loadingFolderUpload.json")}
            autoPlay
            loop
          />
          <Text className="font-bold text-xl">Compressing</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex justify-center items-center gap-y-2">
          <LottieView
            style={{
              width: 200,
              height: 200,
              backgroundColor: "transparent",
            }}
            source={require("~/assets/lottie/errorFolderUpload.json")}
            autoPlay
            loop
          />
          <Text className="font-bold text-xl text-destructive">Compression Failed</Text>
          <Text>{error}</Text>
        </View>
      );
    }

    return (
      <View className="flex justify-center items-center gap-y-2">
        <LottieView
          style={{
            width: 150,
            height: 150,
            backgroundColor: "transparent",
          }}
          source={require("~/assets/lottie/successfulFolderUpload.json")}
          autoPlay
          loop
        />
        <Text className="font-bold text-xl">Compression Successful</Text>
      </View>
    );
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
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      backdropComponent={(props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />}
    >
      {loading ? null : (
        <Pressable
          className="flex flex-row justify-end pr-4"
          onPress={() => {
            ref.current?.dismiss();
            setSelectedFolderToCompress(null);
            setError("");
            qc.invalidateQueries(["getFileList", getPath(selectedFolderPathList) ?? "/"]);
          }}
        >
          <X className="text-primary" />
        </Pressable>
      )}
      <View className="p-4">{renderMainView()}</View>
    </BottomSheetModal>
  );
});

export default CompressFolderBottomSheetModal;
