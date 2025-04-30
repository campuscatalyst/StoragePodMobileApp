import { router } from "expo-router";
import { View } from "react-native";

//UI IMPORTS
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function Index() {

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button onPress={() => router.push("home")}>
        <Text>Dashboard</Text>
      </Button>
    </View>
  );
}
