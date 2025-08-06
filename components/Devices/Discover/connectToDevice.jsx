import { Pressable, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "~/components/ui/text";
import { Label } from "~/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { connectToDeviceSchema } from "~/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActivityIndicator } from "react-native";
import { Button } from "~/components/ui/button";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { baseURL } from "~/lib/constants";
import axios from "axios";
import { saveJWT } from "~/lib/storage/tokenStorage";
import { addDevice } from "~/lib/db/api";
import { errorNotification } from "~/components/notification";
import dayjs from "dayjs";
import { useDeviceDiscoveryStore } from "~/lib/store";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { TriangleAlert, Eye, EyeOff } from "~/lib/icons";
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from "react-native-reanimated";

export default function ConnectToDevice({ setIndex, closeSheet, mode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const selectedDeviceToConnect = useDeviceDiscoveryStore((state) => state.selectedDeviceToConnect);
  const setSelectedDeviceToConnect = useDeviceDiscoveryStore((state) => state.setSelectedDeviceToConnect);

  const qc = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(connectToDeviceSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const connectHandler = async (data) => {
    try {
      setLoading(true);

      if (!selectedDeviceToConnect) {
        errorNotification("Internal Error - ERR004");
        return;
      }

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
        setError("Invalid Username/Password");
        setTimeout(() => {
          //remove the error message after 5 seconds.
          setError(null);
        }, 5000);
      } else if (result && result.data?.status_code && result.data?.status_code === 403) {
        //initial login we need to reset the password.
        setIndex(1);
      } else if (result.data?.status_code && result.data?.status_code === 200) {
        //JWT token is available, save the token
        //go to the next page and ask the user to provide name for the device to store the device details in the db.
        await saveJWT(result.data?.token);
        const serialNumber = result.data?.serial_number

        const data = {
          ip: selectedDeviceToConnect?.ip, //this can be ip or hostname
          port: selectedDeviceToConnect?.port?.toString() || "8200",
          givenName: serialNumber?.toUpperCase() ?? "MAIN",
          domainName: mode === "local" ? "storagepod.local" : selectedDeviceToConnect?.ip,
          status: "online",
          discoveredAt: dayjs().format(),
          lastAccessedAt: dayjs().format(),
        };

        await addDevice(data);
        setSelectedDeviceToConnect(null);

        closeSheet();

        //Here we need to go two pages back
        router.back();
        router.back();
        qc.invalidateQueries(["getDevices"]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.detail || error.response.data || "";

          console.error(error, message);
          errorNotification(`Internal error (${status}) - ERR005`);
        } else if (error.request) {
          errorNotification("Unable to reach the server - ERR005");
        } else {
          errorNotification("Unexpected Error - ERR013");
          console.error("Unexpected Axios error:", error.message);
        }
      } else {
        if (error.message.includes("UNIQUE")) {
          errorNotification("Device is already added");
        } else {
          errorNotification("Unknown error - ERR012");
          console.error("Non-Axios error:", error);
        }
      }

      closeSheet();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-8 pt-0 flex gap-y-12">
      <View className="flex gap-y-2">
        <Text className="font-bold text-xl">Connect To Your Device</Text>
        <Text className="font-light">Enter the required details to establish a connection.</Text>
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
                    autoCapitalize="none"
                    autoCorrect={false}
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
                  <View className="h-12 rounded-md border border-input bg-background flex flex-row gap-x-2 items-center pr-2">
                    <BottomSheetTextInput
                      className="flex-1 h-full leading-[1.25] text-lg px-3 text-foreground placeholder:text-muted-foreground"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(text) => onChange(text)}
                      enterKeyHint="next"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={!showPassword}
                    />
                    <Pressable onPress={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <EyeOff className="text-muted-foreground" size={18} /> : <Eye className="text-muted-foreground" size={18} />}
                    </Pressable>
                  </View>

                  {errors.password && <Text className="text-destructive font-bold">{errors.password.message}</Text>}
                </>
              )}
            />
          </View>
          {error && (
            <Animated.View
              entering={FadeInUp.springify().damping(80).stiffness(200)}
              exiting={FadeOutUp.springify().damping(80).stiffness(200)}
              layout={LinearTransition.springify().damping(80).stiffness(200)}
              className="flex-row items-center gap-x-4 bg-destructive/30 p-4 rounded-xl"
            >
              <TriangleAlert size={18} className="text-foreground" />
              <Text>{error}</Text>
            </Animated.View>
          )}
        </View>
        <Button onPress={handleSubmit(connectHandler)}>{loading ? <ActivityIndicator size={"small"} color={"white"} /> : <Text>Connect</Text>}</Button>
      </View>
    </View>
  );
}
