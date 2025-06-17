import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useGetDisksInfoQuery } from "~/lib/services/queries/getDisksInfo";
import { useGetSmartInfoQuery } from "~/lib/services/queries/getSmartInfoQuery";
import { Skeleton } from "~/components/ui/skeleton";
import { Info, Thermometer } from "~/lib/icons";

const Disk = ({ data, smartData }) => {
  return (
    <View className="bg-background rounded-3xl p-4 flex flex-row items-center justify-between">
      <View className="gap-y-2">
        <Text className="font-bold">{data.devicename}</Text>
        <Text className="text-sm">{data.model}</Text>
        <Text className="text-sm">{data.serialnumber}</Text>
        <Text className="text-sm">{smartData?.overallstatus}</Text>
      </View>
      <View className="flex flex-row items-center gap-x-2">
        <Text className="font-bold text-2xl">{data.temperature}&deg;c</Text>
        <Thermometer className="text-foreground" />
      </View>
    </View>
  );
};

export default function DisksInfo() {
  const getDisksInfoQuery = useGetDisksInfoQuery();
  const getSmartInfoQuery = useGetSmartInfoQuery();

  if (getDisksInfoQuery.isPending) {
    //TODO
    return (
      <View className="w-full h-48 rounded-3xl overflow-hidden">
        <Skeleton className={"w-full h-full"} />
      </View>
    );
  }

  if (getDisksInfoQuery.isError) {
    return (
      <View className="w-full h-48 rounded-3xl overflow-hidden flex justify-center items-center bg-card gap-4">
        <Info className="text-destructive" size={36} />
        <Text>Error in loading disks info</Text>
      </View>
    );
  }

  return (
    <View className="bg-card rounded-3xl p-4 gap-6">
      <View>
        <Text className="font-bold">Disks Info</Text>
      </View>
      <View className="gap-4">
        {getDisksInfoQuery.data?.data
          .filter((disk) => disk.devicename[0] === "s")
          .map((disk) => (
            <Disk
              key={`${disk.serialnumber}-${disk.devicename}`}
              data={disk}
              smartData={
                getSmartInfoQuery.data?.find((smartInfo) => smartInfo.devicename === disk.devicename && smartInfo.serialnumber === disk.serialnumber) ?? {}
              }
            />
          ))}
      </View>
    </View>
  );
}
