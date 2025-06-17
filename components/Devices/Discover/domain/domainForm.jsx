import { ActivityIndicator, View } from "react-native";
import React, { useState } from "react";
import { domainRegistrationSchema } from "~/lib/schemas";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Button } from "~/components/ui/button";
import { isServerOnline } from "~/lib/services/api";
import { useDeviceDiscoveryStore } from "~/lib/store";
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from "react-native-reanimated";
import { TriangleAlert } from "~/lib/icons";

export default function DomainRegistrationForm({ openSheet }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const setSelectedDeviceToConnect = useDeviceDiscoveryStore((state) => state.setSelectedDeviceToConnect);
  const setSelecteDomain = useDeviceDiscoveryStore((state) => state.setSelecteDomain);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(domainRegistrationSchema),
    defaultValues: {
      domain: "",
    },
  });

  const domainRegisterHandler = async (data) => {
    try {
      setLoading(true);

      const domain = `${data.domain}.campuscatalyst.info`;
      const status = await isServerOnline(true, domain);

      if (status) {
        //server is reachable so now route to the credentials screen.
        setSelectedDeviceToConnect({
          ip: domain,
        });

        //this is for the baseURL to pickup the selected domain changes.
        setSelecteDomain(domain);
        openSheet();
        return;
      }

      //This is the error where there is another response other status than online
      setError("Internal Error - ERR003");
      setTimeout(() => {
        //remove the error message after 5 seconds.
        setError(null);
      }, 5000);
    } catch (error) {
      console.error(error);
      setError("Server isn't reachable, please check if the domain is correct.");
      setTimeout(() => {
        //remove the error message after 5 seconds.
        setError(null);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      bottomOffset={30}
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      <View className="flex-1 flex gap-y-8 justify-between">
        <View className="flex gap-y-8">
          <Controller
            control={control}
            name="domain"
            render={({ field: { value, onBlur, onChange } }) => (
              <>
                <View className="flex gap-y-2">
                  <Label>Serial number</Label>
                  <Input
                    value={value}
                    placeholder="e.g., c841483680280415"
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(text)}
                    enterKeyHint="next"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {errors.domain && <Text className="text-destructive font-bold">{errors.domain.message}</Text>}
              </>
            )}
          />

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
        <View>
          <Button className="rounded-xl" onPress={handleSubmit(domainRegisterHandler)}>
            {loading ? <ActivityIndicator size={"small"} color={"white"} /> : <Text>Register</Text>}
          </Button>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
