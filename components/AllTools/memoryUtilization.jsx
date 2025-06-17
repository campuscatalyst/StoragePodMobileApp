import { View } from "react-native";
import { Text } from "~/components/ui/text";
import StorageGraph from "../FileExplorer/graphs/storageGraph";
import { useGetSystemMetrics } from "~/lib/services/queries/systemMetricsQuery";
import { Skeleton } from "~/components/ui/skeleton";
import { Info } from "~/lib/icons";

export default function MemoryUtilization() {
  const systemMetricsQuery = useGetSystemMetrics();

  if (systemMetricsQuery.isPending) {
    //TODO
    return (
      <View className="flex-1 h-56 w-48 rounded-3xl overflow-hidden">
        <Skeleton className={"w-full h-full"} />
      </View>
    );
  }

  if (systemMetricsQuery.isError) {
    return (
      <View className="flex-1 h-56 w-48 rounded-3xl overflow-hidden flex justify-center items-center bg-card gap-4">
        <Info className="text-destructive" size={24} />
        <Text className="">Error</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 h-56 w-48 bg-card p-4 rounded-3xl">
      <View>
        <Text className="font-bold">Memory Utilization</Text>
      </View>
      <View className="flex-1 flex justify-between items-center">
        <StorageGraph progress={systemMetricsQuery.data?.memory_utilization_percent} rotation="-180" />
      </View>
    </View>
  );
}
