import { View, ScrollView } from "react-native";
import FileSystemInfo from "~/components/AllTools/fileSystemInfo";
import CpuUtilization from "~/components/AllTools/cpuUtilization";
import MemoryUtilization from "~/components/AllTools/memoryUtilization";
import SystemInfo from "~/components/AllTools/systemInfo";
import DisksInfo from "~/components/AllTools/disksInfo";
import SafeView from "~/components/SafeView";

export default function Statistics() {
  return (
    <SafeView>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          flexGrow: 1,
        }}
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
