import { Platform, Pressable, View } from "react-native";
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { Text } from "~/components/ui/text";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { useFileExplorerStore } from "~/lib/store/fileExplorerStore";
import axios from "axios";
import { baseURL } from "~/lib/constants";
import { X } from "~/lib/icons";
import LottieView from "lottie-react-native";
import { useNavigationStore } from "~/lib/store";
import { useQueryClient } from "@tanstack/react-query";
import { getMimeType } from "~/lib/utils";
import { getJWT } from "~/lib/storage/tokenStorage";

const getPath = (data) => {
  return data?.length ? data.join("/") : null;
};

const FileUploadProgressBottomSheet = forwardRef((props, ref) => {
  //UTILS
  const snapPoints = useMemo(() => ["50%"], []);
  const qc = useQueryClient();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  //GLOBAL STATE
  const images = useFileExplorerStore((state) => state.images);
  const setImages = useFileExplorerStore((state) => state.setImages);
  const files = useFileExplorerStore((state) => state.files);
  const setFiles = useFileExplorerStore((state) => state.setFiles);
  const selectedFolderPathList = useNavigationStore((state) => state.selectedFolderPathList);

  //LOCAL STATE
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalItems, setTotalItems] = useState(0); //this is to track total images/files that are selected for upload.
  const [uploadingItems, setUploadingItems] = useState(0); //this is to track uploaded images/files that are selected for upload.

  const imagesUploadHandler = async (image) => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: image.uri,
        name: image.fileName,
        type: Platform.select({ ios: image.type, android: getMimeType(image.type) }),
      });

      const path = getPath(selectedFolderPathList) ?? "/";
      const token = await getJWT();

      await axios.post(`${baseURL()}/files/`, formData, {
        params: { "path": path, "filename": image.fileName},
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 1800000, //30 mins need to change this if there are any issues.
      });
      
    } catch (error) {
      console.error(error);
      throw new Error(`${image.fileName} upload failed`, {
        cause: error
      });
    }
  };

  const filesUploadHandler = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: Platform.select({ ios: file.mimeType, android: getMimeType(file.mimeType) }),
      });

      const path = getPath(selectedFolderPathList) ?? "/";
      const token = await getJWT();

      await axios.post(`${baseURL()}/files/`, formData, {
        params: { "path": path, "filename": file.name},
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 1800000, //30 mins need to change this if there are any issues.
      });
    } catch (error) {
      console.error(error);
      throw new Error(`${file.name} upload failed`, {
        cause: error
      });
    }
  };

  const uploadImages = useCallback(async () => {
    try {
      setLoading(true);

      images.forEach(async (image) => {
        try {
          setUploadingItems((prev) => prev + 1); //to update the count of the uploading files
          await imagesUploadHandler(image);
        } catch (error) {
          console.error(error);
        }
      });

      //Closing the sheets.
      setTimeout(() => setLoading(false), 2000);
      setImages([]);
    } catch (error) {
      console.error(error.code);
      setTimeout(() => setLoading(false), 2000);
      if (error.code === ERR_BAD_RESPONSE) {
        setError("Internal server error");
      } else {
        setError("error");
      }
    }
  }, [images]);

  const uploadFiles = useCallback(async () => {
    try {
      setLoading(true);
      
      files.forEach(async (file) => {
        try {
          setUploadingItems((prev) => prev + 1); //to update the count of the uploading files
          await filesUploadHandler(file);
        } catch (error) {
          console.error(error);
        }
      });

      //Closing the sheets.
      setTimeout(() => setLoading(false), 2000);
      setFiles([]);
    } catch (error) {
      console.error(error.code);
      setTimeout(() => setLoading(false), 2000);
      if (error.code === ERR_BAD_RESPONSE) {
        setError("Internal server error");
      } else {
        setError("error");
      }
    }
  }, [files]);

  useEffect(() => {
    if (images && images.length) {
      props.closeSheet();
      setTotalItems(images.length);
      setUploadingItems(0);
      uploadImages();
    }
  }, [images]);

  useEffect(() => {
    if (files && files.length) {
      props.closeSheet();
      setTotalItems(files.length);
      setUploadingItems(0);
      uploadFiles();
    }
  }, [files]);

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
          <Text className="font-bold">{uploadingItems} / {totalItems} Items</Text>
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
          <Text className="font-bold text-xl text-destructive">Upload Failed</Text>
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
        <View className="flex flex-row justify-end px-4">
          <Pressable
            className="bg-primary/20 h-12 w-12 rounded-full flex justify-center items-center"
            onPress={() => {
              props.closeFileUploadProgressSheet();
              setError("");
              qc.invalidateQueries(["getFileList", getPath(selectedFolderPathList) ?? "/"]);
            }}
          >
            <X className="text-primary" />
          </Pressable>
        </View>
      )}
      <View className="p-4">{renderMainView()}</View>
    </BottomSheetModal>
  );
});

export default FileUploadProgressBottomSheet;
