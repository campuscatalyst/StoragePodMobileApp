import { useEffect, useState } from "react";
import { Pressable, Alert } from "react-native";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Image } from "~/lib/icons";
import { baseURl } from "~/lib/constants";
import { Text } from "~/components/ui/text";
import { useFileUploadStore } from "~/lib/store/fileUploadStore";
//const remoteFolder = "/srv/dev-disk-by-uuid-09698ee9-3b6f-4504-b43d-d7b527129ac9/Folder1";

export default function ImageSelector({ closeSheet, openFileUploadProgressSheet }) {
  const setImages = useFileUploadStore((state) => state.setImages);

  const pressHandler = async () => {
    const permissionResult = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      const result = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!result.status) {
        Alert.alert("Permission Required", "You need to grant camera roll permissions to use this feature.");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
      selectionLimit: 30,
      allowsEditing: false,
      quality: 1, // 0 - compress for small size, 1 - compress for better quality
    });

    if (!result.canceled) {
      // Get all selected image URIs from the result
      const selectedImages = result.assets;
      setImages(selectedImages);
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
      <Image className="text-yellow" />
      <Text>Upload from Gallery</Text>
    </Pressable>
  );
}
