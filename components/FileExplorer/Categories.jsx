import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useGetFileExplorerMetrics } from "~/lib/services/queries/getFileExplorerMetricsQuery";
import { Image as ExpoImage } from "expo-image";
import humanFormat from "human-format";

export default function Categories() {
  const getMetrics = useGetFileExplorerMetrics();

  if (getMetrics.isPending) {
    //TODO
    return <Text>Loading</Text>;
  }

  return (
    <View className="flex-1 flex gap-y-4">
      <Text className="text-xl font-bold">Categories</Text>
      <View className="flex flex-row items-center justify-between gap-x-4">
         <View className="flex-1 p-4 rounded-3xl h-64 w-48 overflow-hidden relative" style={{ backgroundColor: "#DAD5C3" }}>
          <View className="flex flex-col gap-y-2">
            <Text className="font-bold text-black">Documents</Text>
            <Text className="font-bold text-3xl text-black">{humanFormat(getMetrics.data?.documents, { maxDecimals: 1 })}</Text>
          </View>

          <ExpoImage
            source={require("~/assets/images/folder.png")}
            contentFit="cover"
            style={{ height: 200, width: 200, position: "absolute", bottom: -50, right: -50 }}
          />
        </View>
        <View className="flex-1 p-4 rounded-3xl h-64 w-48 overflow-hidden relative" style={{ backgroundColor: "#FFF8F1" }}>
          <View className="flex flex-col gap-y-2">
            <Text className="font-bold text-black">Images</Text>
            <Text className="font-bold text-3xl text-black">{humanFormat(getMetrics.data?.images, { maxDecimals: 1 })}</Text>
          </View>

          <ExpoImage
            source={require("~/assets/images/image.png")}
            contentFit="cover"
            style={{ height: 180, width: 150, position: "absolute", bottom: -40, right: -20 }}
          />
        </View>
      </View>
      <View className="flex flex-row items-center justify-between gap-x-4">
        <View className="flex-1 p-4 rounded-3xl h-64 w-48 overflow-hidden relative" style={{ backgroundColor: "#3B2C35" }}>
          <View className="flex flex-col gap-y-2">
            <Text className="font-bold text-white">Videos</Text>
            <Text className="font-bold text-3xl text-white">{humanFormat(getMetrics.data?.videos, { maxDecimals: 1 })}</Text>
          </View>

          <ExpoImage
            source={require("~/assets/images/video.png")}
            contentFit="cover"
            style={{ height: 200, width: 200, position: "absolute", bottom: -50, right: -50 }}
          />
        </View>
        <View className="flex-1 p-4 rounded-3xl h-64 w-48 overflow-hidden relative" style={{ backgroundColor: "#2A2F45" }}>
          <View className="flex flex-col gap-y-2">
            <Text className="font-bold text-white">Audio</Text>
            <Text className="font-bold text-3xl text-white">{humanFormat(getMetrics.data?.audio, { maxDecimals: 1 })}</Text>
          </View>

          <ExpoImage
            source={require("~/assets/images/audio.png")}
            contentFit="cover"
            style={{ height: 180, width: 180, position: "absolute", bottom: -20, right: -40 }}
          />
        </View>
      </View>
    </View>
  );
}
