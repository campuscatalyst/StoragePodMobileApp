import { Pressable, View, ActivityIndicator } from "react-native";
import { Input } from "~/components/ui/input";
import { Search, X } from "~/lib/icons";
import { useState, useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import { useFileExplorerStore } from "~/lib/store";

export default function SearchBar({
  searching,
  searchItem,
  showSearchBar,
  setShowSearchBar,
  setSearchItem,
}) {
  const [inputValue, setInputValue] = useState(searchItem ?? "");
  const setSearchItemGlobalStore = useFileExplorerStore(
    (state) => state.setSearchItem
  );
  const theme = useTheme();

  useEffect(() => {
    setSearchItem(inputValue);
  }, [inputValue]);

  return (
    <View className="h-16 rounded-md border border-input bg-background flex flex-row gap-x-2 items-center p-4">
      {searching ? (
        <ActivityIndicator color={theme.colors.primary} size={"small"} />
      ) : (
        <Search className="text-foreground" />
      )}
      <Input
        className="border-0 flex-1 w-full"
        value={inputValue}
        onChangeText={(text) => setInputValue(text)}
        autoFocus
      />
      {showSearchBar && (
        <Pressable
          onPress={() => {
            setShowSearchBar(false);
            //Clear the state
            setSearchItemGlobalStore(null);
          }}
        >
          <X className="text-foreground" size={18} />
        </Pressable>
      )}
    </View>
  );
}
