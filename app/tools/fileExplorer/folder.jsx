import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { router, Stack, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigationStore } from "~/lib/store";
import { ChevronLeft } from "~/lib/icons";
import { useGetFileListQuery } from "~/lib/services/queries/getFileListQuery";
import FilesList from "~/components/FileExplorer/filesList";
import LottieView from "lottie-react-native";
import { getPath, getFolderTitle } from "~/lib/utils";

export default function Folder() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const selectedFolderPathList = useNavigationStore((state) => state.selectedFolderPathList);
  const popFromSelectedFolderPath = useNavigationStore((state) => state.popFromSelectedFolderPath);
  const getFilesListQuery = useGetFileListQuery(getPath(selectedFolderPathList));

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
    <View style={{ paddingBottom: insets.bottom }} className="flex-1">
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
    </View>
  );
}
