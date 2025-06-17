//Global CSS
import "~/global.css";

import { Stack } from "expo-router";
import { Theme, ThemeProvider, DefaultTheme, DarkTheme, useTheme } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PortalHost } from "@rn-primitives/portal";
import Toast from "react-native-toast-message";
import { errorNotification, toastConfig } from "~/components/notification";
import { initDB } from "~/lib/db";
import { useEffect, useState } from "react";
import LottieView from "lottie-react-native";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

//import { addSslPinningErrorListener } from "react-native-ssl-public-key-pinning";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

const LIGHT_THEME = {
  ...DefaultTheme,
  dark: false,
  colors: NAV_THEME.light,
};

const DARK_THEME = {
  ...DefaultTheme,
  dark: true,
  colors: NAV_THEME.dark,
};

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const theme = isDarkColorScheme ? DARK_THEME : LIGHT_THEME;
  const [error, setError] = useState(null);
  const [appReady, setAppReady] = useState(false);

  const prerequsites = async () => {
  try {
    await Font.loadAsync({
      BN: require("../assets/fonts/BebasNeue-Regular.ttf"),
      // Add other fonts here
    });

    await initDB();

    setAppReady(true);
  } catch (error) {
    console.error(error);
    setError(error);
  } finally {
    await SplashScreen.hideAsync();
  }
};

  useEffect(() => {
    //this is to initialise the db connection to the sqlite.
    //TODO - show a loader by disbaling everything underneath it till the db is initialsed.
    prerequsites();
  }, []);

  /*useEffect(() => {
    const subscription = addSslPinningErrorListener((error) => {
      // Triggered when an SSL pinning error occurs due to pin mismatch
      console.log(error);
    });
    return () => {
      subscription.remove();
    };
  }, []);*/

  if (error) {
    return (
      <View className="flex-1 flex justify-center items-center gap-y-12 p-4">
        <LottieView
          style={{
            width: 300,
            height: 300,
            padding: 20,
            backgroundColor: "transparent",
          }}
          source={require("~/assets/lottie/error.json")}
          autoPlay
          loop
        />
        <View className="flex gap-y-4 items-center">
          <Text className="font-bold text-xl">Error loading the Application. Reach out to the support.</Text>
          <Text className="font-bold text-xl">ERR - ERR001</Text>
        </View>
      </View>
    );
  }

  if (!appReady) {
    return null; // let SplashScreen show while initializing
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <StatusBar style={isDarkColorScheme ? "light" : "dark"} animated={true} backgroundColor={theme.colors.background} />
            <SafeAreaProvider>
              <KeyboardProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: "fade",
                  }}
                >
                  <Stack.Screen name="index" />
                  <Stack.Screen name="tools" />
                </Stack>
                <PortalHost />
                <Toast config={toastConfig} />
              </KeyboardProvider>
            </SafeAreaProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
