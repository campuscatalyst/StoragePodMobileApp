import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import GeneralSettings from '~/components/Profile/GeneralSettings'
import { Stack, router } from 'expo-router';
import { ChevronLeft } from "~/lib/icons";
import { Text } from '~/components/ui/text';

export default function GeneralSettingsRoute() {
  return (
    <View className='flex-1 p-4'>
      <Stack.Screen 
        options={{
            headerShown: true,
            headerTitle: "General Settings",
            headerTitleAlign: "center",
            headerLeft: ({ onPress, canGoBack }) =>
            canGoBack ? (
              <TouchableOpacity onPress={() => router.back()} className="flex flex-row gap-x-2 ml-[-8] items-center">
                <ChevronLeft size={20} className={"text-primary"} />
                <Text className="text-primary">Back</Text>
              </TouchableOpacity>
            ) : null,
        }}
      />
      <GeneralSettings />
    </View>
  )
}