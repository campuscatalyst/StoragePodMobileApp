import { Platform, Pressable, View, ActivityIndicator } from "react-native";
import { Text } from "~/components/ui/text";
import StorageGraph from "./graphs/storageGraph";
import { useGetFileSystemInfo } from "~/lib/services/queries/getFileSystemInfoQuery";
import { Settings, CloudAlert } from "~/lib/icons";
import { useTheme } from "@react-navigation/native";

export default function StorageInfo({ openStorageSettings, openFileBrowser }) {
  const getFilesystemInfoQuery = useGetFileSystemInfo();
  const data = getFilesystemInfoQuery.data?.filter(
    (fs) => fs.mountpoint !== "/"
  )[0];
  const theme = useTheme();

  if (getFilesystemInfoQuery.isPending) {
    return (
      <View className="w-full h-48 bg-card flex justify-center items-center rounded-xl">
        <ActivityIndicator size={"small"} color={theme.colors.primary} />
      </View>
    );
  }

  if (getFilesystemInfoQuery.isError) {
    return (
      <View className="w-full h-48 bg-card flex justify-center items-center rounded-xl">
          <CloudAlert className="text-destructive" size={36} />
          <Text className="text-center font-bold">
            Error while fetching the details, retry again.
          </Text>
          <Text>If still exists, please reach out to us.</Text>
      </View>
    );
  }

  return (
    <View
      className="h-48 p-4 rounded-3xl bg-card flex flex-row justify-between"
      style={{ elevation: Platform.select({ ios: 0, android: 5 }) }}
    >
      <View className="flex justify-between">
        <Text className="font-bold">Storage</Text>
        <View>
          <Text className="text-md md:text-xl font-semibold">
            {data?.used} / {(parseInt(data?.size) / 1024 ** 4).toFixed(2)} TiB
            used
          </Text>
          <Text>Available storage</Text>
        </View>
        <View className="flex flex-row items-center gap-x-4">
          <Pressable
            className="p-3 rounded-xl bg-primary w-36 flex justify-center items-center"
            onPress={() => openFileBrowser()}
          >
            <Text className="text-primary-foreground">View details</Text>
          </Pressable>
          <Pressable onPress={() => openStorageSettings()}>
            <Settings className="text-foreground/60" size={26} />
          </Pressable>
        </View>
      </View>
      <StorageGraph progress={data?.percentage} />
    </View>
  );
}
