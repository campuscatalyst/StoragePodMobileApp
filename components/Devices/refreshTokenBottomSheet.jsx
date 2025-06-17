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
import { connectToDeviceSchema } from "~/lib/schemas";
import axios from "axios";
import { saveJWT } from "~/lib/storage/tokenStorage";
import { baseURL } from "~/lib/constants";
import { errorNotification } from "../notification";

const RefreshTokenBottomSheet = forwardRef((props, ref) => {
  const snapPoints = useMemo(() => ["90%"], []);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(connectToDeviceSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const refreshTokenHandler = async (data) => {
    try {
      setLoading(true);

      const postData = {
        username: data.username,
        password: data.password,
      };

      const result = await axios.post(`${baseURL()}/auth/`, postData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (result && result.data?.status_code && result.data?.status_code === 401) {
        errorNotification("Invalid username/password");
      } else if (result && result.data?.status_code && result.data?.status_code === 403) {
        //this scenario shouldn't come at all.
      } else if (result.data?.status_code && result.data?.status_code === 200) {
        //JWT token is available, save the token
        await saveJWT(result.data?.token);
        //TODO - notification of successful token refresh
        ref.current?.dismiss();
      }
    } catch (error) {
      console.error(error);
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
            <Text className="font-bold text-xl">Refresh Token</Text>
            <Text className="font-light">This token will be valid for 7 days, if expired you need to login again.</Text>
          </View>
          <View className="flex-1 gap-y-6 justify-between">
            <View className="gap-y-6">
              <View className="flex gap-y-2">
                <Label>Username</Label>
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { value, onBlur, onChange } }) => (
                    <>
                      <BottomSheetTextInput
                        className="h-12 rounded-md border border-input bg-background px-3 text-lg leading-[1.25] text-foreground placeholder:text-muted-foreground"
                        value={value}
                        placeholder="e.g., johndoe123"
                        onBlur={onBlur}
                        onChangeText={(text) => onChange(text)}
                        enterKeyHint="next"
                      />
                      {errors.username && <Text className="text-destructive font-bold">{errors.username.message}</Text>}
                    </>
                  )}
                />
              </View>
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

            <Button onPress={handleSubmit(refreshTokenHandler)}>
              {loading ? <ActivityIndicator size={"small"} color={"white"} /> : <Text>Refresh Token</Text>}
            </Button>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default RefreshTokenBottomSheet;
