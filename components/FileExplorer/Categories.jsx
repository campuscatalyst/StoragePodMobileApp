import { View } from 'react-native'
import { Text } from "~/components/ui/text";
import { Image, File, Video, Music } from "~/lib/icons";

export default function Categories() {
  return (
    <View className="flex-1 flex gap-y-4">
        <Text className='text-xl font-bold'>Categories</Text>
      <View className="flex flex-row items-center justify-between gap-x-4">
          <View className="bg-yellow/30 flex-1 p-4 rounded-3xl h-64 w-48">
            <Image size={30} className="text-yellow" />
          </View>
          <View className="bg-purple/30 flex-1 p-4 rounded-3xl h-64 w-48">
            <Video size={30} className="text-purple" />
          </View>
        </View>
        <View className="flex flex-row items-center justify-between gap-x-4">
          <View className="bg-primary/30 flex-1 p-4 rounded-3xl h-64 w-48">
            <File size={30} className="text-primary" />
          </View>
          <View className="bg-teal/30 flex-1 p-4 rounded-3xl h-64 w-48">
            <Music size={30} className="text-teal" />
          </View>
        </View>
    </View>
  )
}