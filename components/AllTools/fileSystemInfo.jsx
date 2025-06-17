import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useGetFileSystemInfo } from "~/lib/services/queries/getFileSystemInfoQuery";
import { Skeleton } from "~/components/ui/skeleton";
import prettyBytes from "pretty-bytes";
import StorageGraph from "../FileExplorer/graphs/storageGraph";
import { Progress } from "~/components/ui/progress";
import { Info } from "~/lib/icons";

const FileSystem = ({ data }) => {
  return (
    <View className="bg-card p-4 rounded-3xl justify-between h-48">
      <View className="flex flex-row justify-between items-center gap-4">
        <View>
          <Text className="font-bold text-xl">{data?.devicename.toUpperCase()}</Text>
          <Text>{data?.canonicaldevicefile}</Text>
        </View>
        <View>
          <Text className="font-bold">{data?.percentage}%</Text>
        </View>
      </View>
      <View className="gap-y-4">
        <Progress value={data?.percentage} className="bg-background" indicatorClassName="bg-primary" />
        <View>
          <Text className="font-light">
            <Text className="font-bold">{data?.used}</Text> used of {(parseInt(data?.size) / 1024 ** 4).toFixed(2)} TiB
          </Text>
        </View>
      </View>
    </View>
  );
};

export default function FileSystemInfo() {
  const getFilesystemInfoQuery = useGetFileSystemInfo();

  if (getFilesystemInfoQuery.isPending) {
    //TODO
    return (
      <View className="w-full h-48 rounded-3xl overflow-hidden">
        <Skeleton className={"w-full h-full"} />
      </View>
    );
  }

  if (getFilesystemInfoQuery.isError) {
    return (
      <View className="w-full h-48 rounded-3xl overflow-hidden flex justify-center items-center bg-card gap-4">
        <Info className="text-destructive" size={36} />
        <Text>Error in loading File system info</Text>
      </View>
    );
  }

  return (
    <View className="gap-y-6">
      <View className="gap-4">
        {getFilesystemInfoQuery.data
          ?.filter((fs) => fs.mountpoint !== "/")
          .map((fs) => (
            <FileSystem key={fs.uuid} data={fs} />
          ))}
      </View>
    </View>
  );
}
