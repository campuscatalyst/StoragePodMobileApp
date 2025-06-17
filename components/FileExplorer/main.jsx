import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useGetFileListQuery } from "~/lib/services/queries/getFileListQuery";
import StorageInfo from "./StorageInfo";
import FileExplorerSettingsBottomSheetModal from "./bottomSheets/fileExplorerSettingsBottomSheetModal";
import { useCallback, useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";
import { useNavigationStore } from "~/lib/store";
import Categories from "./Categories";
import { router } from "expo-router";
import { getStorageFolderUri } from "~/lib/storage/tokenStorage";
import RecentActivity from "./recentActivity";

export default function Main() {
  const getListQuery = useGetFileListQuery("/");
  const fileExplorerSettingsRef = useRef(null);
  const pushToSelectedFolderPath = useNavigationStore((state) => state.pushToSelectedFolderPath);
  const [storageUri, setStorageUri] = useState(null); //TODO - later check if this is required or not.

  const openStorageSettings = useCallback(async () => {
    if (fileExplorerSettingsRef.current) {
      const uri = await getStorageFolderUri();
      setStorageUri(uri);
      fileExplorerSettingsRef.current.present();
    }
  }, []);

  const openFileBrowser = () => {
    pushToSelectedFolderPath("/");
    router.push("/tools/fileExplorer/folder");
  };

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
      <View className="flex-1 flex justify-center items-center gap-y-12">
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
        <View className="flex gap-y-4 items-center">
          <Text className="font-bold text-xl">Error loading the file explorer </Text>
          <Text className="font-bold text-xl">ERR -</Text>
        </View>
      </View>
    );
  }

  if (getListQuery.data === "auth_needed") {
    //user need to login again.
    //TODO
  }

  return (
    <ScrollView style={{ flexGrow: 1 }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={{
      paddingBottom: 100
    }}>
      <View className="flex-1 flex gap-y-12 p-4">
        <FileExplorerSettingsBottomSheetModal ref={fileExplorerSettingsRef} storageUri={storageUri} />
        <StorageInfo openStorageSettings={openStorageSettings} openFileBrowser={openFileBrowser} />
        <Categories />
        <RecentActivity />
      </View>
    </ScrollView>
  );
}
