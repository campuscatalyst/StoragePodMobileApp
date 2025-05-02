import { useTheme } from "@react-navigation/native";
import { View, FlatList } from "react-native";
import { Text } from "~/components/ui/text";
import { useNavigationStore, useStorageSettingsStore, useFileExplorerStore } from "~/lib/store";
import { filterHiddenItems } from "~/lib/utils";
import { useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FileRenderer from "./renderers/fileRenderer";
import FolderRenderer from "./renderers/folderRenderer";
import DeleteItemModal from "./modals/deleteItemModal";
import { Button } from "~/components/ui/button";
import { getPath } from "~/lib/utils";
import { deleteItem } from "~/lib/services/api";
import { useQueryClient } from "@tanstack/react-query";
import LottieView from "lottie-react-native";

export default function FilesList({ data }) {
  const showHiddenItems = useStorageSettingsStore((state) => state.showHiddenItems);
  let files = useMemo(() => filterHiddenItems(showHiddenItems, data?.files), [showHiddenItems, data]);
  const theme = useTheme();
  const pushToSelectedFolderPath = useNavigationStore((state) => state.pushToSelectedFolderPath);
  const insets = useSafeAreaInsets();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const selectedFolderPathList = useNavigationStore((state) => state.selectedFolderPathList);
  const selectedItemToDelete = useFileExplorerStore((state) => state.selectedItemToDelete);
  const qc = useQueryClient();

  if (!data || !files || !files.length) {
    return (
      <View className="flex-1 flex justify-center items-center gap-y-8">
        <LottieView
          style={{
            width: 200,
            height: 200,
            backgroundColor: "transparent",
          }}
          source={require("~/assets/lottie/noFiles.json")}
          autoPlay
          loop
        />
        <View className="gap-y-2 justify-center items-center">
          <Text className="text-xl font-bold">No Files</Text>
          <Text>Start uploading files</Text>
        </View>
      </View>
    );
  }

  const deleteHandler = async () => {
    try {
      setLoading(true);

      if (!selectedItemToDelete || !Object.keys(selectedItemToDelete).length) {
        //TODO - throw an error notification.
        return;
      }

      const itemPath = `${getPath(selectedFolderPathList)}/${selectedItemToDelete?.name}`;
      const response = await deleteItem(itemPath);

      //deletion is successful, close the modal and refresh
      qc.invalidateQueries(["getFileList", getPath(selectedFolderPathList) ?? "/"]);
    } catch (error) {
      //TODO - show a notification;
      console.error(error);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <DeleteItemModal visible={showDeleteModal} setVisible={setShowDeleteModal} deleteHandler={deleteHandler} loading={loading} selectedItemToDelete={selectedItemToDelete} />
      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (item.is_directory) {
            return <FolderRenderer data={item} theme={theme} pushToSelectedFolderPath={pushToSelectedFolderPath} />;
          }
          return <FileRenderer data={item} theme={theme} insets={insets} setShowDeleteModal={setShowDeleteModal} />;
        }}
        contentContainerStyle={{
          gap: 8,
          paddingBottom: 100
        }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      />
    </>
  );
}
