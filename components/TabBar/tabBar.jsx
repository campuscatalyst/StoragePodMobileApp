import { View, Platform, StyleSheet } from "react-native";
import { Text } from "~/components/ui/text";
import { Pressable } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";
import { Home, User, MonitorSpeaker } from "~/lib/icons";
import { useMemo } from "react";
import Animated, { FadeIn, FadeInLeft, FadeInRight, FadeOutRight, LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { motify } from "moti";

const AnimatedPressable = motify(Pressable)();

const TabBarItem = ({ route, index, state, descriptors, navigation }) => {
  const { options } = descriptors[route.key];
  const label = options.title;
  const isFocused = state.index === index;

  const onPress = () => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const getIcon = useMemo(() => {
    switch (route.name) {
      case "home":
        return <Home size={18} className={cn("", isFocused ? "text-primary" : "text-foreground")} />;
      case "devices":
        return <MonitorSpeaker size={18} className={cn("", isFocused ? "text-primary" : "text-foreground")} />;
      case "profile":
        return <User size={18} className={cn("", isFocused ? "text-primary" : "text-foreground")} />;
      default:
        return <Home size={18} className={cn("", isFocused ? "text-primary" : "text-foreground")} />;
    }
  }, [route.name, isFocused]);

  return (
    <AnimatedPressable
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      onPress={onPress}
      className={cn("flex-1 h-full flex flex-row gap-2 justify-center items-center mx-4 my-2 rounded-full")}
    >
      <Animated.View layout={LinearTransition.springify().damping(80).stiffness(800)}>{getIcon}</Animated.View>
      {isFocused && (
        <Animated.Text
          key={route.name}
          entering={FadeInRight.springify().damping(80).stiffness(800)}
          exiting={FadeOutRight.springify().damping(80).stiffness(800)}
          layout={LinearTransition.springify().damping(80).stiffness(800)}
          className={cn("font-semibold", isFocused ? "text-primary" : "text-foreground")}
        >
          {label}
        </Animated.Text>
      )}
    </AnimatedPressable>
  );
};

export default function TabBar({ state, descriptors, navigation }) {
  const { bottom } = useSafeAreaInsets();
  const the = useTheme();
  const { isDarkColorScheme } = useColorScheme();
  return (
    <View
      className="flex-row items-center justify-between"
      style={{
        height: Platform.OS === "ios" ? 50 + bottom : 60 + bottom,
        paddingBottom: bottom,
        paddingTop: Platform.OS === "ios" ? 10: 0,
        borderTopColor: isDarkColorScheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderTopWidth: 1,
      }}
    >
      {state.routes.map((route, index) => (
        <TabBarItem key={route.name} route={route} index={index} state={state} descriptors={descriptors} navigation={navigation} />
      ))}
    </View>
  );
}
