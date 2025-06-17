import { Pressable, View, ActivityIndicator } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import React, { forwardRef, useMemo, useState } from "react";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { passwordResetSchema } from "~/lib/schemas";
import axios from "axios";
import { baseURL } from "~/lib/constants";
import { infoNotification, errorNotification } from "../notification";

const ResetPasswordBottomSheet = forwardRef((props, ref) => {
  const snapPoints = useMemo(() => ["90%"], []);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: "",
    },
  });

  const resetHandler = async (data) => {
    try {
      setLoading(true);

      const postData = {
        username: "admin",
        password: data.password,
      };

      const result = await axios.post(`${baseURL()}/auth/reset-password`, postData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (result.data?.status_code && result.data.status_code === 201) {
        //Password successfully reset - user need to login.
        //TODO - show a notification
        infoNotification("Password reset successful.");
        ref.current?.dismiss();
      } else {
        errorNotification("Internal Error - ");
        console.error(result.data);
        //TODO - show a error notification
      }
    } catch (error) {
      errorNotification("Internal Error - ");
      console.error(error);
      //TODO - show a error notification
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      topInset={insets.top}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backgroundStyle={{
        backgroundColor: theme.colors.background,
      }}
      enableDynamicSizing={false}
      backdropComponent={(props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />}
    >
      <BottomSheetScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-8 pt-0 flex gap-y-12">
          <View className="flex gap-y-2">
            <Text className="font-bold text-xl">Reset Password</Text>
            <Text className="font-light">Reset your password to secure your account.</Text>
          </View>
          <View className="flex-1 gap-y-6 justify-between">
            <View className="gap-y-6">
              <View className="flex gap-y-2">
                <Label>Password</Label>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { value, onBlur, onChange } }) => (
                    <>
                      <BottomSheetTextInput
                        className="h-12 rounded-md border border-input bg-background px-3 text-lg leading-[1.25] text-foreground placeholder:text-muted-foreground"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={(text) => onChange(text)}
                        enterKeyHint="next"
                        secureTextEntry
                      />
                      {errors.password && <Text className="text-destructive font-bold">{errors.password.message}</Text>}
                    </>
                  )}
                />
              </View>
            </View>

            <Button onPress={handleSubmit(resetHandler)}>{loading ? <ActivityIndicator size={"small"} color={"white"} /> : <Text>Reset Password</Text>}</Button>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default ResetPasswordBottomSheet;
