import { View } from "react-native";
import { Text } from "~/components/ui/text";
import React from "react";
import { useGetSystemMetrics } from "~/lib/services/queries/systemMetricsQuery";
import { Skeleton } from "~/components/ui/skeleton";
import humanFormat from "human-format";
import { Activity, Info } from "~/lib/icons";

export default function SystemInfo() {
  var timeScale = new humanFormat.Scale({
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 86400,
    months: 2592000,
  });

  const systemMetricsQuery = useGetSystemMetrics();

  if (systemMetricsQuery.isPending) {
    //TODO
    return (
      <View className="w-full h-48 rounded-3xl overflow-hidden">
        <Skeleton className={"w-full h-full"} />
      </View>
    );
  }

  if (systemMetricsQuery.isError) {
    return (
      <View className="w-full h-48 rounded-3xl overflow-hidden flex justify-center items-center bg-card gap-4">
        <Info className="text-destructive" size={36} />
        <Text>Error in loading System info</Text>
      </View>
    );
  }

  //<Text>{dayjs(systemMetricsQuery.data?.timestamp * 1000).format("MMM DD, YYYY - hh:mm A")}</Text>
  return (
    <View className="bg-card rounded-3xl p-4 gap-6 items-center">
      <View>
        <Text className="font-bold">System Info</Text>
      </View>
      <View className="flex gap-4 items-center">
        <View className="flex gap-2 items-center">
          <Text>{systemMetricsQuery.data?.cpu_model}</Text>
          <Text className="text-sm">v{systemMetricsQuery.data?.version}</Text>
        </View>
        <View className="flex-row items-center gap-x-4">
          <Activity className="text-foreground" size={14} />

          <Text>
            {humanFormat(systemMetricsQuery.data?.uptime_seconds, { scale: timeScale })} <Text className="font-light text-sm">uptime</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
