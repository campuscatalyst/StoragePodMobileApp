import { ActivityIndicator, Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { AlertDialog, AlertDialogContent } from "~/components/ui/alert-dialog";

export default function DownloadItemModal({ visible, setVisible, downloadHandler, loading, selectedItemToDownload, openDownloadItemBottomSheet }) {
  return (
    <AlertDialog open={visible} onOpenChange={setVisible}>
      <AlertDialogContent
        bordered
        elevate
        key="content"
        animation={[
          "quick",
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
        exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
        x={0}
        scale={1}
        opacity={1}
        width={"90%"}
        y={0}
        className="flex justify-center gap-y-4 items-center"
      >
        <Text className="font-bold text-xl">Download Item</Text>
        <Text numberOfLines={6} className="text-center">
          Are you sure you want to download {selectedItemToDownload?.name ?? null}?
        </Text>
        <View className="flex flex-row gap-x-4 justify-between">
          <Pressable
            className="flex-1 border-2 border-border rounded-xl p-4 flex justify-center items-center"
            onPress={() => setVisible(false)}
            disabled={loading}
          >
            <Text className="text-foreground">Cancel</Text>
          </Pressable>
          <Pressable
            className="flex-1 border-1 rounded-xl p-4 bg-primary flex justify-center items-center"
            onPress={() => {
              downloadHandler();
              setVisible(false);
              openDownloadItemBottomSheet();
            }}
            disabled={loading}
          >
            {loading ? <ActivityIndicator className="text-primary-foreground" size={"small"} /> : <Text className="text-primary-foreground">Download</Text>}
          </Pressable>
        </View>
      </AlertDialogContent>
    </AlertDialog>
  );
}
