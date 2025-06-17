import { View } from "react-native";
import React, { useState } from "react";
import { Text } from "~/components/ui/text";
import { Label } from "~/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { passwordResetSchema } from "~/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActivityIndicator } from "react-native";
import { Button } from "~/components/ui/button";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { baseURL } from "~/lib/constants";
import axios from "axios";
import { errorNotification, infoNotification } from "~/components/notification";

export default function ResetPassword({ setIndex }) {
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
        infoNotification("Password reset successful. Please log in to add your device.");
        setIndex(0);
      } else {
        errorNotification("Internal Error - ERR006");
        console.error(result.data);
        //TODO - show a error notification
      }
    } catch (error) {
      errorNotification("Internal Error - ERR007");
      console.error(error);
      //TODO - show a error notification
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-8 pt-0 flex gap-y-12">
      <View className="flex gap-y-2">
        <Text className="font-bold text-xl">Reset Password</Text>
        <Text className="font-light">First time here? Reset your password to secure your account and log in!</Text>
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
  );
}
