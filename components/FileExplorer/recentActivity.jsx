import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import dayjs from "dayjs";
import { useGetRecentActivityQuery } from "~/lib/services/queries/getRecentActivityQuery";
import { File } from "~/lib/icons";
import { router } from "expo-router";

const Activity = ({ data }) => {
  /**
     * {
        "path": "/srv/dev-disk-by-uuid-6983a67c-c9e2-4361-98af-c066d6d93113/Folder1/two.txt",
        "event": "modified",
        "timestamp": "2025-06-15T19:04:55.931098"
        },
    */
  return (
    <View className="bg-card p-4 rounded-xl flex flex-row items-center w-full gap-4">
      <File className="text-foreground" size={20} />
      <View className="flex gap-2">
        <Text>{data?.path?.split("/")?.pop()}</Text>
        <Text className="font-light text-sm">{dayjs(data?.timestamp).format("MMM DD, hh:mm A")}</Text>
      </View>
    </View>
  );
};

export default function RecentActivity() {
  const recentActivityQuery = useGetRecentActivityQuery();

  if (recentActivityQuery.isPending) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

  if (recentActivityQuery.isError) {
    return (
      <View>
        <Text>Error</Text>
      </View>
    );
  }

  if (!recentActivityQuery.data || !recentActivityQuery.data.length) {
    return (
      <View>
        <Text>No data</Text>
      </View>
    );
  }

  return (
    <View className="rounded-3xl gap-4">
      <View className="flex flex-row items-center justify-between">
        <Text className="text-xl font-bold">Recent</Text>
        <Pressable onPress={() => router.push("/tools/fileExplorer/recentActivityFull")}>
          <Text className="text-primary font-bold">View all</Text>
        </Pressable>
      </View>
      <View className="flex gap-4">
        {recentActivityQuery.data.slice(0, 5).map((activity, index) => (
          <Activity key={`${index}-${activity.timestamp}`} data={activity} />
        ))}
      </View>
    </View>
  );
}
