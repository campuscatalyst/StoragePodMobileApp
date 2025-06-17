import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import { StyleSheet, View } from "react-native";
import { useState } from "react";
import { Text } from "~/components/ui/text";
import SafeView from "~/components/SafeView";

export default function FEUtil() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <SafeView>
        <View style={styles.container} className="flex-1 flex justify-center items-center">
          <Text>Error loading the file explorer.</Text>
        </View>
      </SafeView>
    );
  }
  return (
    <SafeView>
      <View className="flex-1 overflow-hidden p-4">
        <View className="flex-1 rounded-xl overflow-hidden">
          <WebView
            className="flex-1 bg-background"
            source={{ uri: "http://192.168.0.200:9090/" }}
            forceDarkOn={true}
            onError={(syntheticEvent) => {
              console.warn("WebView error: ", syntheticEvent.nativeEvent);
              setHasError(true);
            }}
            onHttpError={(syntheticEvent) => {
              console.warn("HTTP error: ", syntheticEvent.nativeEvent);
              setHasError(true);
            }}
          />
        </View>
      </View>
    </SafeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
