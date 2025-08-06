import { Dimensions, View } from "react-native";
import { Text } from "~/components/ui/text";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import Animated, { FadeInDown }  from "react-native-reanimated";

const window = Dimensions.get("window");

const data = [
  {
    id: 1,
    title: "Your Files. Your Control",
    description:
      "StoragePod is your personal cloud. No subscriptions, no snooping, just your data — fully private, always accessible.",
    image:  require("~/assets/images/fileSync.png")
  },
  {
    id: 2,
    title: "Access from Anywhere, Securely",
    description:
      "Connect securely to your StoragePod at home — stream, browse, or share files with a tap.",
    image:  require("~/assets/images/secureAccess.png")
  },
  {
    id: 3,
    title: "Built for Big Files",
    description:
      "Upload movies, backups, or entire folders — StoragePod handles up to 500GB per file, no sweat.",
    image:  require("~/assets/images/fileHandling.png")
  },
  {
    id: 4,
    title: "Your Own Private Media Hub",
    description:
      "A beautiful media player is on the way — watch videos, browse photos, and stream directly from your StoragePod.",
    image:  require("~/assets/images/mediaPlayer.png")
  },
];

export default function HomeCarousel() {
  const renderItem = (props) => {
    const index = props.index;

    return (
      <View
        className="rounded-2xl flex justify-between items-center relative overflow-hidden bg-card p-4"
        style={{
          height: 350,
          width: window.width - 20,
        }}
      >
        <Image source={data[index].image} style={{height: "60%", width: "60%"}} />
        <View className="w-full flex items-center">
          <Text className="font-bold text-2xl">{data[index].title}</Text>
          <Text className="text-center">{data[index].description}</Text>
        </View>
      </View>
    );
  };
  return (
    <Animated.View 
       entering={FadeInDown.springify().damping(80).stiffness(200).delay(200)}
    >
      <Carousel
        autoPlay
        autoPlayInterval={5000}
        scrollAnimationDuration={2000}
        data={data}
        height={350}
        loop={true}
        pagingEnabled={true}
        snapEnabled={true}
        width={window.width}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 60,
        }}
        renderItem={renderItem}
      />
    </Animated.View>
  );
}
