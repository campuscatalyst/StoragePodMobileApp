import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useGetFileListQuery } from "~/lib/services/queries/getFileListQuery";
import FilesList from "./filesList";
import StorageInfo from "./StorageInfo";
import StorageSettingsBottomSheetModal from "./storageSettingsBottomSheet";
import { useCallback, useRef } from "react";

export default function Main() {
  const getListQuery = useGetFileListQuery("/");
  const storageSettingsRef = useRef(null);

  const openStorageSettings = useCallback(() => {
    if(storageSettingsRef.current) {
      storageSettingsRef.current.present();
    }
  }, []);

  if(getListQuery.isPending) {
    return (
        <View>
          <Text>Fetching</Text>
        </View>
      );
  }

  if(getListQuery.isError) {
    return (
        <View>
          <Text>Error</Text>
        </View>
      );
  }

  return (
    <View className="flex-1 flex gap-y-4">
      <StorageSettingsBottomSheetModal ref={storageSettingsRef} />
      <StorageInfo openStorageSettings={openStorageSettings} />  
      <FilesList data={getListQuery.data} />
    </View>
  );
}
