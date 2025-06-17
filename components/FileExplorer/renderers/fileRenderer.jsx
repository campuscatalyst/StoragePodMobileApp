import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuShortcut } from "~/components/ui/context-menu";
import React from "react";
import { Delete, File, Download, Eye } from "~/lib/icons";
import prettyBytes from "pretty-bytes";
import dayjs from "dayjs";
import { useFileExplorerStore } from "~/lib/store/fileExplorerStore";

export default function FileRenderer({ data, theme, insets, setShowDeleteModal, showDownloadModal, setPreviewFile, setShowPreviewModal }) {
  const setSelectedItemToDelete = useFileExplorerStore((state) => state.setSelectedItemToDelete);
  const setSelectedItemToDeleteSource = useFileExplorerStore((state) => state.setSelectedItemToDeleteSource);
  const setSelectedItemToDownload = useFileExplorerStore((state) => state.setSelectedItemToDownload);
  
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Pressable className="p-6 h-24 bg-card rounded-xl">
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
        </Pressable>
      </ContextMenuTrigger>

      <ContextMenuContent align="start" insets={contentInsets} className="w-64">
        <ContextMenuItem
          inset
          onPress={() => {
            //setPreviewFile(data);
            //setShowPreviewModal(true);
          }}
        >
          <Text className="text-foreground">Preview</Text>
          <ContextMenuShortcut>
            <Eye className="text-foreground" size={20} />
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          inset
          onPress={() => {
            setSelectedItemToDownload(data);
            showDownloadModal(true);
          }}
        >
          <Text className="text-foreground">Download</Text>
          <ContextMenuShortcut>
            <Download className="text-foreground" size={20} />
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          inset
          onPress={() => {
            setSelectedItemToDelete(data);
            setSelectedItemToDeleteSource("file");
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
