import { BaseToast } from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const CustomToast = (props, borderColor) => {
  const insets = useSafeAreaInsets();

  return (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: borderColor,
        marginTop: props.position === 'top' ? insets.top + 2 : 10,
        marginBottom: props.position === 'bottom' ? insets.bottom + 2 : 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 10 }}
      text1NumberOfLines={1}
      text2NumberOfLines={3}
    />
  );
};