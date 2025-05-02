import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useGetFileListQuery } from "~/lib/services/queries/getFileListQuery";
import StorageInfo from "./StorageInfo";
import StorageSettingsBottomSheetModal from "./bottomSheets/storageSettingsBottomSheet";
import { useCallback, useRef } from "react";
import LottieView from "lottie-react-native";
import { useNavigationStore } from "~/lib/store";
import Categories from "./Categories";
import { router } from "expo-router";

export default function Main() {
  const getListQuery = useGetFileListQuery("/");
  const storageSettingsRef = useRef(null);
  const pushToSelectedFolderPath = useNavigationStore((state) => state.pushToSelectedFolderPath);

  const openStorageSettings = useCallback(() => {
    if (storageSettingsRef.current) {
      storageSettingsRef.current.present();
    }
  }, []);

  const openFileBrowser = () => {
    pushToSelectedFolderPath("/");
    router.push("/tools/fileExplorer/folder");
  }

  if (getListQuery.isPending) {
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
        <Text className="font-bold text-xl">Fetching</Text>
      </View>
    );
  }

  if (getListQuery.isError) {
    return (
      <View>
        <Text>Error</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flexGrow: 1 }}>
      <View className="flex-1 flex gap-y-12 p-4">
        <StorageSettingsBottomSheetModal ref={storageSettingsRef} />
        <StorageInfo openStorageSettings={openStorageSettings} openFileBrowser={openFileBrowser} />
        <Categories />  
      </View>
    </ScrollView>
  );
}
