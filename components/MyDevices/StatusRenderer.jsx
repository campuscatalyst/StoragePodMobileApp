import { Wifi, WifiOff } from "lucide-react-native";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

const getTitle = (status) => {
  switch (status) {
    case "online":
      return "Online";
    case "offline":
      return "Offline";
    default:
      return status;
  }
};

const getBgColor = (status) => {
  switch (status) {
    case "online":
      return "bg-success";
    case "offline":
      return "bg-offline";
    default:
      return "bg-primary";
  }
};

const getTextColor = (status) => {
  switch (status) {
    case "online":
      return "text-success-foreground";
    case "offline":
      return "text-offline-foreground";
    default:
      return "text-primary-foreground";
  }
};

const getIcon = (status) => {
  switch (status) {
    case "online":
      return <Wifi size={12} color={"white"} className="text-success-foreground" />;
    case "offline":
      return <WifiOff size={12} color={"white"} className="text-success-foreground" />;
    default:
      return <Wifi size={12} color={"white"} className="text-success-foreground" />;
  }
};

/**
 * Version:1
 * <View className={cn("p-2 px-4 rounded-full flex flex-row gap-x-2 items-center", getBgColor(status))}>
      {getIcon(status)}
      <Text className={cn("text-xs", getTextColor(status))}>{getTitle(status)}</Text>
    </View>
 */

export default function StatusRenderer({ status }) {
  return (
    <View className={cn("h-2 w-2 rounded-full flex flex-row gap-x-2 items-center", getBgColor(status))}>
    </View>
  );
}
