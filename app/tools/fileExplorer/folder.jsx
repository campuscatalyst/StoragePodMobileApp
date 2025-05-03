import { View, Text, TouchableOpacity } from "react-native";
import { useRef, useCallback, useState, useEffect} from "react";
import { router, Stack, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigationStore } from "~/lib/store";
import { ChevronLeft } from "~/lib/icons";
import { useGetFileListQuery } from "~/lib/services/queries/getFileListQuery";
import FilesList from "~/components/FileExplorer/filesList";
import LottieView from "lottie-react-native";
import { getPath, getFolderTitle } from "~/lib/utils";
import FileUploadProgressBottomSheet from "~/components/FileExplorer/fileUploadProgress";
import SelectSourceBottomSheetModal from "~/components/FileExplorer/bottomSheets/selectSourceBottomSheetModal";
import Fab from "~/components/FileExplorer/fab";
import CreateFolderModal from "~/components/FileExplorer/modals/createFolderModal";

export default function Folder() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const selectedFolderPathList = useNavigationStore((state) => state.selectedFolderPathList);
  const popFromSelectedFolderPath = useNavigationStore((state) => state.popFromSelectedFolderPath);
  const getFilesListQuery = useGetFileListQuery(getPath(selectedFolderPathList));
  const selectSourceRef = useRef(null);
  const fileUploadProgress = useRef(null);
  const [visible, setVisible] = useState(false);

  const openSheet = useCallback(() => {
    if (selectSourceRef.current) {
      selectSourceRef.current.present();
    }
  }, []);

  const openFileUploadProgressSheet = useCallback(() => {
    if (fileUploadProgress.current) {
      fileUploadProgress.current.present();
    }
  }, []);

  const closeSheet = useCallback(() => {
    if (selectSourceRef.current) {
      selectSourceRef.current.dismiss();
    }
  }, []);

  const closeFileUploadProgressSheet = useCallback(() => {
    if (fileUploadProgress.current) {
      fileUploadProgress.current.dismiss();
    }
  }, []);

  useEffect(() => {
    const backListener = navigation.addListener("beforeRemove", () => {
      popFromSelectedFolderPath();
    });

    return () => {
      backListener();
    };
  }, [navigation]);

  useEffect(() => {
    if (!selectedFolderPathList.length) {
      router.back();
    }
  }, []);

  if (getFilesListQuery.isPending) {
    return (
      <View className="flex-1 flex justify-center items-center gap-y-12">
        <LottieView
          style={{
            width: 200,
            height: 200,
            backgroundColor: "transparent",
          }}
          source={require("~/assets/lottie/foldersLoading.json")}
          autoPlay
          loop
        />
        <Text className="font-bold text-xl">Loading</Text>
      </View>
    );
  }

  if (getFilesListQuery.isError) {
    return (
      <View>
        <Text>Error</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingBottom: insets.bottom }} className="flex-1 relative">
      <CreateFolderModal visible={visible} setVisible={setVisible} />
      <SelectSourceBottomSheetModal
        ref={selectSourceRef}
        closeSheet={closeSheet}
        openFileUploadProgressSheet={openFileUploadProgressSheet}
        setVisible={setVisible}
      />
      <FileUploadProgressBottomSheet ref={fileUploadProgress} closeSheet={closeSheet} closeFileUploadProgressSheet={closeFileUploadProgressSheet} />

      <Stack.Screen
        options={{
          headerShown: true,
          animation: "fade",
          headerTitle: getFolderTitle(selectedFolderPathList),
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 14,
          },
          headerLeft: ({ onPress, canGoBack }) =>
            canGoBack ? (
              <TouchableOpacity onPress={() => router.back()} className="flex flex-row gap-x-2 ml-[-8] items-center">
                <ChevronLeft size={20} className={"text-primary"} />
                <Text className="text-primary text-sm">Back</Text>
              </TouchableOpacity>
            ) : null,
        }}
      />
      <View className="p-4 flex-1">
        <FilesList data={getFilesListQuery.data} />
      </View>
      <Fab openSheet={openSheet} />
    </View>
  );
}
