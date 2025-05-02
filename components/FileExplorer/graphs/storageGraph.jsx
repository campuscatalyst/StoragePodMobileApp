import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useEffect, useState } from "react";
import Svg, { Circle } from "react-native-svg";
import Animated, { useAnimatedProps, useSharedValue, withTiming, useDerivedValue, useAnimatedReaction, runOnJS } from "react-native-reanimated";
import { useTheme } from "@react-navigation/native";

const SIZE = 180; // This will be adjusted with the parent container
const STROKE_WIDTH = 25;
const R = (SIZE - STROKE_WIDTH) / 2;
const CIRCLE_LENGTH = 2 * Math.PI * R;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function StorageGraph({ progress }) {
  const theme = useTheme();
  const progressValue = useSharedValue(0);
  const [displayText, setDisplayText] = useState('0');

  useEffect(() => {
    progressValue.value = withTiming(progress / 100, { duration: 2000 });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: CIRCLE_LENGTH * (1 - progressValue.value),
    };
  });

  useAnimatedReaction(
    () => progressValue.value,
    (value) => {
      runOnJS(setDisplayText)(`${Math.round(value * 100)}`);
    }
  );

  return (
    <View className="w-36 h-full flex justify-center items-center">
      <Svg width="100%" height="100%" viewBox={`0 0 ${SIZE + STROKE_WIDTH} ${SIZE + STROKE_WIDTH}`}>
        <Circle
          cx={SIZE / 2 + STROKE_WIDTH / 2}
          cy={SIZE / 2 + STROKE_WIDTH / 2}
          r={R}
          stroke={theme.colors.background}
          strokeWidth={STROKE_WIDTH / 1.2}
          fill={"transparent"}
        />
        <AnimatedCircle
          cx={SIZE / 2 + STROKE_WIDTH / 2}
          cy={SIZE / 2 + STROKE_WIDTH / 2}
          r={R}
          strokeLinecap="round"
          stroke={theme.colors.primary}
          strokeDasharray={CIRCLE_LENGTH}
          strokeWidth={STROKE_WIDTH / 2}
          animatedProps={animatedProps}
          rotation="-90"
          origin={`${SIZE / 2 + STROKE_WIDTH / 2}, ${SIZE / 2 + STROKE_WIDTH / 2}`}
          fill={"transparent"}
        />
      </Svg>

      <View className="absolute items-center justify-center">
        <Text className="text-xl font-bold">
          {displayText}
          <Text className="text-base font-normal">%</Text>
        </Text>
      </View>
    </View>
  );
}
