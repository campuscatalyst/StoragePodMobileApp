import { ActivityIndicator, Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { AlertDialog, AlertDialogContent } from "~/components/ui/alert-dialog";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "~/components/ui/label";
import { renameItemSchema } from "~/lib/schemas";
import { errorNotification, successNotification } from "~/components/notification";
import { getPath } from "~/lib/utils";
import React from "react";
import { useFileExplorerStore, useNavigationStore } from "~/lib/store";
import { createFolder, renameItem } from "~/lib/services/api";
import { useQueryClient } from "@tanstack/react-query";

export default function RenameItemModal({ visible, setVisible }) {
  const [loading, setLoading] = useState(false);
  const selectedFolderPathList = useNavigationStore((state) => state.selectedFolderPathList);
  const selectedItemForRename = useFileExplorerStore((state) => state.selectedItemForRename);
  
  const isDirectory = selectedItemForRename?.is_directory ?? false;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(renameItemSchema),
    defaultValues: {
      name: "",
    },
  });

  const qc = useQueryClient();

  const renameHandler = async (data) => {
    try {
      setLoading(true);
      const path = getPath(selectedFolderPathList);

      const result = await renameItem(`${path}/${selectedItemForRename.name}`, isDirectory, data.name);

      successNotification(`Successfully renamed the ${isDirectory? "folder": "file"}`);
      qc.invalidateQueries(["getFileList", path ?? "/"]);
    } catch (error) {
      console.error(error);
      errorNotification("Internal Err - ");
    } finally {
      setLoading(false);
      setVisible(false);
      setValue("name", ""); //reset the form
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
        <Label>{isDirectory ? "Folder": "File"} name</Label>
        <View className="flex gap-y-2">
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onBlur, onChange } }) => (
              <>
                <Input
                  value={value}
                  placeholder=""
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(text)}
                  enterKeyHint="next"
                  autoCapitalize="none"
                />
                {errors.name && <Text className="text-destructive font-bold">{errors.name.message}</Text>}
              </>
            )}
          />
        </View>
        <View className="flex flex-row gap-x-2">
          <Pressable className="flex-1 p-2 justify-center items-center rounded-xl border-2 border-border" onPress={() => loading ? null: setVisible(false)}>
            <Text>Cancel</Text>
          </Pressable>
          <Pressable className="flex-1 bg-primary p-2 justify-center items-center rounded-xl" onPress={handleSubmit(renameHandler)}>
            {loading ? <ActivityIndicator size={"small"} color={"white"} />: <Text className="text-primary-foreground">Rename</Text>}
          </Pressable>
        </View>
      </AlertDialogContent>
    </AlertDialog>
  );
}
