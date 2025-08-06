import { View, ScrollView, RefreshControl } from "react-native";
import FileSystemInfo from "~/components/AllTools/fileSystemInfo";
import CpuUtilization from "~/components/AllTools/cpuUtilization";
import MemoryUtilization from "~/components/AllTools/memoryUtilization";
import SystemInfo from "~/components/AllTools/systemInfo";
import DisksInfo from "~/components/AllTools/disksInfo";
import SafeView from "~/components/SafeView";
import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { throttle } from "~/lib/utils";

export default function Statistics() {
  const [refreshing, setRefreshing] = useState(false);
  const qc = useQueryClient();

  const throttledOnRefresh = throttle(() => {
    setRefreshing(true);
    qc.invalidateQueries["getFileSystemInfo", "getSystemMetrics", "getDisksInfo", "getSmartInfo"];
    console.error("Refreshing!");
    setRefreshing(false);
  });

  const onRefresh = useCallback(throttledOnRefresh, []);

  return (
    <SafeView>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          flexGrow: 1,
        }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="p-4 flex gap-y-6">
          <FileSystemInfo />
          <SystemInfo />
          <DisksInfo />
          <View className="flex flex-row items-center justify-between gap-x-4">
            <CpuUtilization />
            <MemoryUtilization />
          </View>
        </View>
      </ScrollView>
    </SafeView>
  );
}
