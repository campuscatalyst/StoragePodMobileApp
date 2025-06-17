import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import React, { useCallback, useRef } from 'react'
import DomainRegistrationForm from './domainForm';
import AddDeviceBottomSheet from '../AddDeviceBottomSheet';

export default function DominaDiscoverMain() {
  const bottomSheetRef = useRef(null);

  const openSheet = useCallback(() => {
    if(bottomSheetRef.current) {
      bottomSheetRef.current.present();
    } 
  }, []);

  return (
    <View className='flex-1 p-4 flex gap-y-12'>
      <AddDeviceBottomSheet ref={bottomSheetRef} mode={"remote"} />
      <View>
        <Text className='font-bold text-2xl'>Domain Name</Text>
        <Text className='font-light text-sm'>Please provide the serial number you received at the time of purchasing the box.</Text>
      </View>
      <DomainRegistrationForm openSheet={openSheet} />
    </View>
  )
}