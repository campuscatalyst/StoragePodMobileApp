import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { AlertDialog, AlertDialogContent } from "~/components/ui/alert-dialog";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export default function CreateFolderModal({ visible, setVisible }) {
  const [value, setValue] = useState("");

  const onChangeText = (text) => {
    setValue(text);
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
        <Text className="font-bold">Folder Name</Text>
        <Input value={value} onChangeText={onChangeText} className="w-full max-w-full" />
        <View className="flex flex-row gap-x-2">
          <Pressable className="flex-1 p-2 justify-center items-center rounded-xl border-2 border-border" onPress={() => setVisible(false)}>
            <Text>Cancel</Text>
          </Pressable>
          <Pressable className="flex-1 bg-primary p-2 justify-center items-center rounded-xl">
            <Text className="text-primary-foreground">Create</Text>
          </Pressable>
        </View>
      </AlertDialogContent>
    </AlertDialog>
  );
}
