import { View, Pressable } from "react-native";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import additionalCommentsSchema from "~/lib/schemas/additionalComments";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

export default function AdditionalComments() {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(additionalCommentsSchema),
    defaultValues: {
      comments: "",
    },
  });

  const inputClassName = cn("", errors.comments ? "border-destructive" : "");
  const calculateButtonClassName = cn("p-4 flex justify-center items-center rounded-xl", !isDirty ? "bg-primary/50" : "bg-primary");

  const submitHandler = (data) => {
    console.error(data);
  };

  return (
    <View className="flex-1 gap-y-8 justify-between">
      <Controller
        control={control}
        name="comments"
        render={({ field }) => (
          <View className="gap-y-2">
            <Label>Additional Comments</Label>
            <Input
              value={field.value}
              onChangeText={(text) => field.onChange(text)}
              enterKeyHint="done"
              className={inputClassName}
              multiline
              style={{
                height: 200,
                maxHeight: 200,
              }}
              {...field}
            />
            {errors.comments && <Text className="text-destructive font-bold">{errors.comments.message}</Text>}
          </View>
        )}
      />

      <Pressable disabled={!isDirty} onPress={handleSubmit(submitHandler)} className={calculateButtonClassName}>
        <Text className="text-primary-foreground font-bold">Submit</Text>
      </Pressable>
    </View>
  );
}
