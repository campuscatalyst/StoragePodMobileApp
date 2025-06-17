import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { useRef, useCallback, useState, useEffect } from "react";
import { router, Stack, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigationStore } from "~/lib/store";
import { ChevronLeft } from "~/lib/icons";
import { getFolderTitle } from "~/lib/utils";
import FileUploadProgressBottomSheet from "~/components/FileExplorer/fileUploadProgress";
import SelectSourceBottomSheetModal from "~/components/FileExplorer/bottomSheets/selectSourceBottomSheetModal";
import Fab from "~/components/FileExplorer/fab";
import CreateFolderModal from "~/components/FileExplorer/modals/createFolderModal";
import FoldersListMain from "~/components/FileExplorer/foldersListMain";
import { useTheme } from "@react-navigation/native";

export default function Folder() {
  //UTILS
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  //GLOBAL STATE
  const selectedFolderPathList = useNavigationStore((state) => state.selectedFolderPathList);
  const popFromSelectedFolderPath = useNavigationStore((state) => state.popFromSelectedFolderPath);

  //LOCAL STATE
  const [visible, setVisible] = useState(false);

  //REFS
  const selectSourceRef = useRef(null);
  const fileUploadProgress = useRef(null);

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

  return (
    <View
      style={{
        paddingBottom: insets.bottom,
      }}
      className="flex-1 relative"
    >
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
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerLeft: ({ onPress, canGoBack }) =>
            canGoBack ? (
              <TouchableOpacity onPress={() => router.back()} className="flex flex-row gap-x-2 ml-[-8] items-center">
                <ChevronLeft size={20} className={"text-primary"} />
                <Text className="text-primary">Back</Text>
              </TouchableOpacity>
            ) : null,
        }}
      />
      <FoldersListMain />
      <Fab openSheet={openSheet} />
    </View>
  );
}
