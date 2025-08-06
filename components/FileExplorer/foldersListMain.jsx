import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useGetFileListQuery } from "~/lib/services/queries/getFileListQuery";
import LottieView from "lottie-react-native";
import { getPath } from "~/lib/utils";
import { useFileExplorerStore, useNavigationStore } from "~/lib/store";
import FilesList from "./filesList";
import { useSearchItemQuery } from "~/lib/services/queries/getSearchItemQuery";
import { useMemo } from "react";

export default function FoldersListMain({ showSearchBar, setShowSearchBar }) {
  //GLOBAL STATE
  const selectedFolderPathList = useNavigationStore(
    (state) => state.selectedFolderPathList
  );
  const searchItem = useFileExplorerStore((state) => state.searchItem);

  //QUERY
  const getFilesListQuery = useGetFileListQuery(
    getPath(selectedFolderPathList)
  );
  const searchQuery = useSearchItemQuery(searchItem);

  const filteredData = useMemo(() => {
    if (searchQuery.isLoading) {
      return [];
    }

    if (
      !searchQuery.data ||
      (searchQuery.data && searchQuery.data.length === 0)
    ) {
      //there is no filter so return the data as it is.
      return getFilesListQuery.data;
    }

    return {
      ...getFilesListQuery.data,
      files: [
        ...getFilesListQuery.data.files.filter((file) =>
          searchQuery.data.some((searchItem) => searchItem.file_id === file.id)
        ),
      ],
    };
  }, [getFilesListQuery.isPending, searchQuery.data, searchQuery.isPending]);

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
    <View className="p-4 flex-1 gap-4">
      <FilesList
        searching={searchQuery.isFetching}
        showSearchBar={showSearchBar}
        setShowSearchBar={setShowSearchBar}
        data={filteredData}
      />
    </View>
  );
}
