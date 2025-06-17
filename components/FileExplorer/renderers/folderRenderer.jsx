import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { router } from "expo-router";
import { Folder, ChevronRight, Delete, Download, FileArchive} from "~/lib/icons";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuShortcut } from "~/components/ui/context-menu";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFileExplorerStore } from "~/lib/store";

export default function sFolderRenderer({ data, theme, pushToSelectedFolderPath, openCompressfolderBottomSheet, setShowDeleteModal }) {
  const insets = useSafeAreaInsets();
  const setSelectedItemToDelete = useFileExplorerStore((state) => state.setSelectedItemToDelete);
  const setSelectedItemToDeleteSource = useFileExplorerStore((state) => state.setSelectedItemToDeleteSource);
  const setSelectedFolderToCompress = useFileExplorerStore((state) => state.setSelectedFolderToCompress);

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Pressable
          className="p-6 h-24 bg-primary/50 rounded-xl flex flex-row items-center justify-between"
          onPress={() => {
            pushToSelectedFolderPath(data.name);
            router.push({ pathname: "/tools/fileExplorer/folder" });
          }}
        >
          <View className="w-2/3 flex flex-row items-center gap-x-4">
            <Folder className="text-foreground" size={20} />
            <Text numberOfLines={1} className="text-sm font-white font-bold">
              {data.name}
            </Text>
          </View>
          <ChevronRight className="text-foreground" size={20} />
        </Pressable>
      </ContextMenuTrigger>

      <ContextMenuContent align="start" insets={contentInsets} className="w-64">
        <ContextMenuItem
          inset
          onPress={() => {
            setSelectedFolderToCompress(data);
            openCompressfolderBottomSheet();
          }}
        >
          <Text className="text-foreground">Compress</Text>
          <ContextMenuShortcut>
            <FileArchive className="text-foreground" size={20} />
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          inset
          onPress={() => {
            setSelectedItemToDelete(data);
            setSelectedItemToDeleteSource("folder");
            setShowDeleteModal(true);
          }}
        >
          <Text className="text-destructive">Delete</Text>
          <ContextMenuShortcut>
            <Delete className="text-destructive" size={20} />
          </ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
