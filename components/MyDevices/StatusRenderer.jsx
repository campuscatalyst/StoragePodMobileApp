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
      return <Wifi size={14} color={"white"} className="text-success-foreground" />;
    case "offline":
      return <WifiOff size={14} color={"white"} className="text-success-foreground" />;
    default:
      return <Wifi size={14} color={"white"} className="text-success-foreground" />;
  }
};

export default function StatusRenderer({ status }) {
  return (
    <View className={cn("p-2 px-4 rounded-full flex flex-row gap-x-4 items-center", getBgColor(status))}>
      {getIcon(status)}
      <Text className={cn("text-sm", getTextColor(status))}>{getTitle(status)}</Text>
    </View>
  );
}
