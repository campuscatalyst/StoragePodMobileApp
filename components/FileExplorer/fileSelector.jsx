import { Pressable } from "react-native";
import { File } from "~/lib/icons";
import { Text } from "~/components/ui/text";
import * as DocumentPicker from "expo-document-picker";
import { useFileExplorerStore } from "~/lib/store";

export default function FileSelector({ openFileUploadProgressSheet }) {
  const setFiles = useFileExplorerStore((state) => state.setFiles);

  const pressHandler = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false, //check if this needs to be selected for large files
      multiple: true,
    });

    if (!result.canceled) {
      setFiles(result.assets);
      openFileUploadProgressSheet();
    }
  };

  return (
    <Pressable
      className="p-4 flex flex-row gap-x-4 items-center"
      onPress={() => {
        pressHandler();
      }}
    >
      <File className="text-purple" />
      <Text>Upload from File browser</Text>
    </Pressable>
  );
}
