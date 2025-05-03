import { Pressable, View } from "react-native";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { Text } from "~/components/ui/text";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { useFileExplorerStore } from "~/lib/store/fileExplorerStore";
import axios from "axios";
import { baseURl } from "~/lib/constants";
import { X } from "~/lib/icons";
import LottieView from "lottie-react-native";
import { useNavigationStore } from "~/lib/store";
import { useQueryClient } from "@tanstack/react-query";

const getPath = (data) => {
  return data?.length ? data.join("/") : null;
};

const FileUploadProgressBottomSheet = forwardRef((props, ref) => {
  const snapPoints = useMemo(() => ["50%"], []);
  const images = useFileExplorerStore((state) => state.images);
  const selectedFolderPathList = useNavigationStore((state) => state.selectedFolderPathList);
  const qc = useQueryClient();

  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const upload = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("files", {
          uri: image.uri,
          name: image.fileName,
          type: image.type,
        });
      });

      const path = getPath(selectedFolderPathList);

      formData.append("path", path ? `${path}` : "/");

      await axios.post(`${baseURl}/files/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 10000,
      });

      //Closing the sheets.
      setTimeout(() => setLoading(false), 2000);
    } catch (error) {
      setTimeout(() => setLoading(false), 2000);
      setError(error.message ?? "Error");
    }
  };

  useEffect(() => {
    if (images && images.length) {
      props.closeSheet();
      upload();
    }
  }, [images]);

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
          <Text className="font-bold text-xl">Uploading</Text>
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
          <Text className="font-bold text-xl">Upload Failed</Text>
        </View>
      );
    }

    return (
      <View className="flex justify-center items-center gap-y-2">
        <LottieView
          style={{
            width: 200,
            height: 200,
            backgroundColor: "transparent",
          }}
          source={require("~/assets/lottie/successfulFolderUpload.json")}
          autoPlay
          loop
        />
        <Text className="font-bold text-xl">Upload Successful</Text>
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
            props.closeFileUploadProgressSheet();
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

export default FileUploadProgressBottomSheet;
