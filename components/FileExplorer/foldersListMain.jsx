import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useGetFileListQuery } from "~/lib/services/queries/getFileListQuery";
import LottieView from "lottie-react-native";
import { getPath } from "~/lib/utils";
import { useNavigationStore } from "~/lib/store";
import FilesList from "./filesList";

export default function FoldersListMain() {
  //GLOBAL STATE
  const selectedFolderPathList = useNavigationStore((state) => state.selectedFolderPathList);

  //QUERY
  const getFilesListQuery = useGetFileListQuery(getPath(selectedFolderPathList));

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
    <View className="p-4 flex-1">
      <FilesList data={getFilesListQuery.data} />
    </View>
  );
}
