import { View } from "react-native";
import { toolsAvailable } from "~/lib/constants";
import { Text } from "~/components/ui/text";
import ToolItem from "./ToolItem";

export default function ToolsList() {
  return (
    <View className="gap-6">
      {toolsAvailable.map((tool) => (
        <ToolItem key={tool.id} tool={tool} />
      ))}
    </View>
  );
}
