import { Modal, Image, View, ActivityIndicator } from "react-native";
import { Text } from "~/components/ui/text";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
import React, { useState, useEffect } from "react";
import { getPath } from "~/lib/utils";
import { useNavigationStore } from "~/lib/store";
import { baseURL } from "~/lib/constants";
import { getJWT } from "~/lib/storage/tokenStorage";

export default function FilePreviewModal({ showPreviewModal, setShowPreviewModal, previewFile }) {
  const [isLoading, setIsLoading] = useState(true);
  const selectedFolderPathList = useNavigationStore((state) => state.selectedFolderPathList);
  const itemPath = `${getPath(selectedFolderPathList)}/${previewFile?.name}`.replace(/\/+/g, "/");
  const uri = `${baseURL()}/files/download/?path=${itemPath}`;
  const token = getJWT();

  const LoadingIndicator = () => (
    <View className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50">
      <ActivityIndicator color="#FFFFFF" size="large" />
      <Text className="text-white mt-2">Loading...</Text>
    </View>
  );


  const mainRenderer = () => {
    return (
        <View className="flex-1 w-full h-full relative">
        <WebView
          source={{
          uri: "https://nas.campuscatalyst.info/api/v1/files/download?path=/1000000021.jpg&inline=true",
          headers: {
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlzX3ZlcmlmaWVkIjp0cnVlLCJleHAiOjE3NDgxNjA4OTZ9.CYsKLdMizuJ5QVTYIW8sLCKmzg2dRfglphiUgOdts90`,
          },
        }}
          style={{ flex: 1 }}
          startInLoadingState={true}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          renderLoading={() => <LoadingIndicator />}
        />
        {isLoading && <LoadingIndicator />}
      </View>
    );
  };

  return (
    <Modal visible={showPreviewModal} transparent={true} animationType="slide" onRequestClose={() => setShowPreviewModal(false)}>
      <View className="flex-1 m-4 rounded-xl bg-black opacity-90 flex justify-center items-center">{mainRenderer()}</View>
    </Modal>
  );
}
