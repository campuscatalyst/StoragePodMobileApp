import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { router, Stack, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigationStore } from "~/lib/store";
import { ChevronLeft } from "~/lib/icons";
import { useGetFileListQuery } from "~/lib/services/queries/getFileListQuery";
import FilesList from "~/components/FileExplorer/filesList";

const geTitle = (data) => {
  return data?.length ? data[data.length - 1] : null;
}

const getPath = (data) => {
  return data?.length ? data.join("/") : null;
}

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

  return (
    <View style={{ paddingBottom: insets.bottom }} className="flex-1">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: geTitle(selectedFolderPathList),
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
