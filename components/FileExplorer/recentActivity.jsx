import { View, Pressable, ActivityIndicator } from "react-native";
import { Text } from "~/components/ui/text";
import dayjs from "dayjs";
import { useGetRecentActivityQuery } from "~/lib/services/queries/getRecentActivityQuery";
import { File, CloudAlert } from "~/lib/icons";
import { router } from "expo-router";
import { useTheme } from "@react-navigation/native";

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
        <Text numberOfLines={1}>{data?.path?.split("/")?.pop()}</Text>
        <Text className="font-light text-sm">
          {dayjs(data?.timestamp).format("MMM DD, hh:mm A")}
        </Text>
      </View>
    </View>
  );
};

export default function RecentActivity() {
  const recentActivityQuery = useGetRecentActivityQuery();
  const theme = useTheme();

  if (recentActivityQuery.isPending) {
    return (
      <View className="flex gap-4">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-xl font-bold">Recent</Text>
        </View>
        <View className="w-full h-64 bg-card flex justify-center items-center rounded-xl">
          <ActivityIndicator size={"small"} color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  if (recentActivityQuery.isError) {
    return (
      <View className="flex gap-4">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-xl font-bold">Recent</Text>
        </View>
        <View className="w-full h-64 bg-card flex justify-center items-center rounded-xl">
          <CloudAlert className="text-destructive" size={36} />
          <Text className="text-center font-bold">
            Error while fetching the details, retry again.
          </Text>
          <Text>If still exists, please reach out to us.</Text>
      </View>
      </View>
    );
  }

  if (!recentActivityQuery.data || !recentActivityQuery.data.length) {
    return (
      <View className="flex gap-4">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-xl font-bold">Recent</Text>
        </View>
        <View className="bg-card flex items-center justify-center w-full h-64 rounded-xl">
          <Text>No recent files found</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="rounded-3xl gap-4">
      <View className="flex flex-row items-center justify-between">
        <Text className="text-xl font-bold">Recent</Text>
        <Pressable
          onPress={() => router.push("/tools/fileExplorer/recentActivityFull")}
        >
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
