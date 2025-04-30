import { useTheme } from "@react-navigation/native";
import { ChevronRight, File, Folder } from "lucide-react-native";
import { Pressable, View, FlatList } from "react-native";
import { Text } from "~/components/ui/text";
import prettyBytes from "pretty-bytes";
import dayjs from "dayjs";
import { router } from "expo-router";
import { useNavigationStore, useStorageSettingsStore } from "~/lib/store";
import { filterHiddenItems } from "~/lib/utils";
import { useMemo } from "react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuShortcut } from "~/components/ui/context-menu";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FileRenderer = ({ data, theme, insets }) => {
  
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger minDuration={300} asChild>
        <View className="p-6 h-24 bg-card rounded-xl">
          <View className="flex flex-row items-center gap-x-4">
            <File color={theme.colors.text} size={20} />
            <View className="w-2/3 flex flex-col gap-y-2">
              <Text numberOfLines={1} className="font-bold">
                {data.name}
              </Text>
              <View className="flex flex-row gap-x-2 items-center">
                <Text className="text-sm">{prettyBytes(data.size)}</Text>
                <Text>•</Text>
                <Text className="text-sm">{dayjs(data.modified_at).format("MMM DD, YYYY")}</Text>
              </View>
            </View>
          </View>
        </View>
      </ContextMenuTrigger>

      <ContextMenuContent align="start" insets={contentInsets} className="w-64">
        <ContextMenuItem inset>
          <Text>Back</Text>
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

const DirectoryRenderer = ({ data, theme, pushToSelectedFolderPath }) => {
  return (
    <Pressable
      className="p-6 h-24 bg-primary/50 rounded-xl flex flex-row items-center justify-between"
      onPress={() => {
        pushToSelectedFolderPath(data.name);
        router.push({ pathname: "/tools/fileExplorer/folder" });
      }}
    >
      <View className="w-2/3 flex flex-row items-center gap-x-4">
        <Folder color={theme.colors.text} size={20} />
        <Text numberOfLines={1} className="text-sm font-white font-bold">
          {data.name}
        </Text>
      </View>
      <ChevronRight color={theme.colors.text} size={18} />
    </Pressable>
  );
};

export default function FilesList({ data }) {
  const showHiddenItems = useStorageSettingsStore((state) => state.showHiddenItems);
  let files = useMemo(() => filterHiddenItems(showHiddenItems, data?.files), [showHiddenItems, data]);
  const theme = useTheme();
  const pushToSelectedFolderPath = useNavigationStore((state) => state.pushToSelectedFolderPath);
  const insets = useSafeAreaInsets();
  
  if (!data || !files || !files.length) {
    return (
      <View className="flex-1">
        <Text className="text-xl font-bold">No Files</Text>
        <Text>Start uploading files</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={files}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        if (item.is_directory) {
          return <DirectoryRenderer data={item} theme={theme} pushToSelectedFolderPath={pushToSelectedFolderPath} />;
        }
        return <FileRenderer data={item} theme={theme} insets={insets} />;
      }}
      contentContainerStyle={{
        gap: 8,
      }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      className="flex-1"
    />
  );
}
