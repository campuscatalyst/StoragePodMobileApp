import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import React from "react";
import { Sun, Moon } from "~/lib/icons";
import { Switch } from "~/components/ui/switch";
import { useColorScheme } from "~/lib/useColorScheme";
import { setTheme } from "~/lib/storage/tokenStorage";

export default function GeneralSettings() {
  const { toggleColorScheme, colorScheme } = useColorScheme();

  const themeChangeHandler = async () => {
    toggleColorScheme(); //this will toggle the theme.
    setTheme("theme", colorScheme === "dark" ? "light" : "dark");
  };

  return (
    <View className="flex-1 gap-12">
      <View>
        <Text className="text-muted-foreground">Manage account preferences, change theme, and customise notification settings all in one place</Text>
      </View>
      <View className="flex-1 gap-12">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-x-4">
            { colorScheme === "dark" ? <Moon className="text-foreground" size={20} /> : <Sun className="text-foreground" size={20} />}
            <Text>Dark Mode</Text>
          </View>
          <Switch checked={colorScheme === "dark"} onCheckedChange={themeChangeHandler} />
        </View>
      </View>
    </View>
  );
}
