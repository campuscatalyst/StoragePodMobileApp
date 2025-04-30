import { View } from "react-native";
import { useRef, useCallback, useState } from "react";
import { Stack } from "expo-router";
import FileUploadProgressBottomSheet from "~/components/FileExplorer/fileUploadProgress";
import SelectSourceBottomSheetModal from "~/components/FileExplorer/selectSourceBottomSheetModal";
import Fab from "~/components/FileExplorer/fab";
import CreateFolderModal from "~/components/FileExplorer/createFolderModal";


export default function FileExplorerLayout() {
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

  return (
    <View className="flex-1 relative">
      <CreateFolderModal visible={visible} setVisible={setVisible} />
      <SelectSourceBottomSheetModal
        ref={selectSourceRef}
        closeSheet={closeSheet}
        openFileUploadProgressSheet={openFileUploadProgressSheet}
        setVisible={setVisible}
      />
      <FileUploadProgressBottomSheet ref={fileUploadProgress} closeSheet={closeSheet} closeFileUploadProgressSheet={closeFileUploadProgressSheet} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
      <Fab openSheet={openSheet} />
    </View>
  );
}
