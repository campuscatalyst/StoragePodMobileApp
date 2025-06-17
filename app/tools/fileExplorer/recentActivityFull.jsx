import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import dayjs from "dayjs";
import React from "react";
import { router } from "expo-router";
import { File, ChevronLeft } from "~/lib/icons";
import { LegendList } from "@legendapp/list";
import { useGetRecentActivityQuery } from "~/lib/services/queries/getRecentActivityQuery";
import { Stack } from "expo-router";

export default function RecentActivityFull() {
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

  const renderItem = ({ item }) => {
    return (
      <View className="bg-card p-4 rounded-xl flex flex-row items-center w-full gap-4">
        <File className="text-foreground" size={20} />
        <View className="flex gap-2">
          <Text>{item?.path?.split("/")?.pop()}</Text>
          <Text className="font-light text-sm">{dayjs(item?.timestamp).format("MMM DD, hh:mm A")}</Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1">
      <Stack.Screen 
        options={{
            headerShown: true,
            headerTitle: "Recent",
            headerTitleAlign: "center",
            headerLeft: ({ onPress, canGoBack }) =>
            canGoBack ? (
              <TouchableOpacity onPress={() => router.back()} className="flex flex-row gap-x-2 ml-[-8] items-center">
                <ChevronLeft size={20} className={"text-primary"} />
                <Text className="text-primary">Back</Text>
              </TouchableOpacity>
            ) : null,
        }}
      />
      <View className="flex-1 p-4">
        <LegendList
          data={recentActivityQuery.data}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${index}-${item.timestamp}`}
          recycleItems={true}
          contentContainerStyle={{
            gap: 10,
            paddingBottom: 100
          }}
          maintainVisibleContentPosition
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
