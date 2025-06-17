import { ActivityIndicator, Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { AlertDialog, AlertDialogContent } from "~/components/ui/alert-dialog";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "~/components/ui/label";
import { createFolderSchema } from "~/lib/schemas/createFolder";
import { errorNotification, successNotification } from "~/components/notification";
import { getPath } from "~/lib/utils";
import React from "react";
import { useNavigationStore } from "~/lib/store";
import { createFolder } from "~/lib/services/api";
import { useQueryClient } from "@tanstack/react-query";

export default function CreateFolderModal({ visible, setVisible }) {
  const [loading, setLoading] = useState(false);
  const selectedFolderPathList = useNavigationStore((state) => state.selectedFolderPathList);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      folderName: "",
    },
  });

  const qc = useQueryClient();

  const createHandler = async (data) => {
    try {
      setLoading(true);
      const path = getPath(selectedFolderPathList);

      const result = await createFolder(path, data.folderName);

      successNotification("Successfully created folder");
      qc.invalidateQueries(["getFileList", path ?? "/"]);
    } catch (error) {
      errorNotification("Internal Err - ");
    } finally {
      setLoading(false);
      setVisible(false);
      setValue("folderName", ""); //reset the form
    }
  };

  return (
    <AlertDialog open={visible} onOpenChange={setVisible}>
      <AlertDialogContent
        bordered
        elevate
        key="content"
        animation={[
          "quick",
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
        exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
        x={0}
        scale={1}
        opacity={1}
        width={"90%"}
        y={0}
        className="flex justify-center gap-y-4"
      >
        <Label>Folder name</Label>
        <View className="flex gap-y-2">
          <Controller
            control={control}
            name="folderName"
            render={({ field: { value, onBlur, onChange } }) => (
              <>
                <Input
                  value={value}
                  placeholder="e.g., NewFolder"
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(text)}
                  enterKeyHint="next"
                  autoCapitalize="none"
                />
                {errors.folderName && <Text className="text-destructive font-bold">{errors.folderName.message}</Text>}
              </>
            )}
          />
        </View>
        <View className="flex flex-row gap-x-2">
          <Pressable className="flex-1 p-2 justify-center items-center rounded-xl border-2 border-border" onPress={() => loading ? null: setVisible(false)}>
            <Text>Cancel</Text>
          </Pressable>
          <Pressable className="flex-1 bg-primary p-2 justify-center items-center rounded-xl" onPress={handleSubmit(createHandler)}>
            {loading ? <ActivityIndicator size={"small"} color={"white"} />: <Text className="text-primary-foreground">Create</Text>}
          </Pressable>
        </View>
      </AlertDialogContent>
    </AlertDialog>
  );
}
