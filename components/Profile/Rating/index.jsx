import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import React from 'react'
import { useAppSettingsStore } from "~/lib/store";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import RatingC from './ratingC';
import Specifics from './specifics';
import AdditionalComments from './additionalComments';

export default function Rating() {
  const rating = useAppSettingsStore((state) => state.rating);
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      contentInset={{ bottom: 50 }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 gap-y-16">
        <View>
          <Text className="font-bold text-xl">We Value Your Feedback</Text>
          <Text className="text-muted-foreground">Please rate your experience and share any additional comments or suggestions.</Text>
        </View>

        <View className="flex items-center">
          <RatingC />
        </View>

        {rating !== 0 && (
          <>
            <Specifics />
            <View className="flex-1">
              <AdditionalComments />
            </View>
          </>
        )}
      </View>
    </KeyboardAwareScrollView>
  )
}