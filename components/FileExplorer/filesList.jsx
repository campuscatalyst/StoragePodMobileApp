import { useTheme } from "@react-navigation/native";
import { View, FlatList, Alert, Platform, NativeModules } from "react-native";
import { Text } from "~/components/ui/text";
import {
  useNavigationStore,
  useStorageSettingsStore,
  useFileExplorerStore,
} from "~/lib/store";
import { filterHiddenItems, getMimeType, isMediaMimeType } from "~/lib/utils";
import { useCallback, useMemo, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FileRenderer from "./renderers/fileRenderer";
import FolderRenderer from "./renderers/folderRenderer";
import DeleteItemModal from "./modals/deleteItemModal";
import { getPath } from "~/lib/utils";
import { deleteItem } from "~/lib/services/api";
import { useQueryClient } from "@tanstack/react-query";
import LottieView from "lottie-react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as ExpoSharing from "expo-sharing";
import DownloadItemModal from "./modals/downloadItemModal";
import { baseURL } from "~/lib/constants";
import { errorNotification, successNotification } from "../notification";
import {
  getJWT,
  getStorageFolderUri,
  saveStorageFolderUri,
} from "~/lib/storage/tokenStorage";
import FilePreviewModal from "./modals/filePreviewModal";
import CompressFolderBottomSheetModal from "./bottomSheets/compressFolderBottomSheetModal";
import DownloadItemBottomSheetModal from "./bottomSheets/downloadItemBottomSheetModal";
import RenameItemModal from "./modals/renameItemModal";
import SearchBar from "./searchBar";
import { useDebounce } from "~/lib/useDebounce";
import Animated, {
  FadeInUp,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";

const { StorageModule } = NativeModules;

export default function FilesList({
  searching,
  showSearchBar,
  setShowSearchBar,
  data,
}) {
  //GLOBAL STATE
  const showHiddenItems = useStorageSettingsStore(
    (state) => state.showHiddenItems
  );
  const selectedFolderPathList = useNavigationStore(
    (state) => state.selectedFolderPathList
  );
  const selectedItemToDelete = useFileExplorerStore(
    (state) => state.selectedItemToDelete
  );
  const selectedItemToDeleteSource = useFileExplorerStore(
    (state) => state.selectedItemToDeleteSource
  );
  const selectedItemToDownload = useFileExplorerStore(
    (state) => state.selectedItemToDownload
  );
  const setSelectedItemToDelete = useFileExplorerStore(
    (state) => state.setSelectedItemToDelete
  );
  const setSelectedItemToDownload = useFileExplorerStore(
    (state) => state.setSelectedItemToDownload
  );
  const pushToSelectedFolderPath = useNavigationStore(
    (state) => state.pushToSelectedFolderPath
  );
  const searchItem = useFileExplorerStore((state) => state.searchItem);
  const setSearchItem = useFileExplorerStore((state) => state.setSearchItem);
  const debouncedSearch = useDebounce(setSearchItem, 1000); //change here is the debounce value is too high.

  //LOCAL STATE
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  let files = useMemo(
    () => filterHiddenItems(showHiddenItems, data?.files),
    [showHiddenItems, data]
  );

  //UTILS
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const compressFolderBottomSheetRef = useRef(null);
  const downloadItemBottomSheetRef = useRef(null);

  const openCompressfolderBottomSheet = useCallback(() => {
    if (compressFolderBottomSheetRef.current) {
      compressFolderBottomSheetRef.current.present();
    }
  }, []);

  const openDownloadItemBottomSheet = useCallback(() => {
    if (downloadItemBottomSheetRef.current) {
      downloadItemBottomSheetRef.current.present();
    }
  }, []);

  const closeDownloadItemBottomSheet = useCallback(() => {
    if (downloadItemBottomSheetRef.current) {
      downloadItemBottomSheetRef.current.dismiss();
    }
  }, []);

  const [previewFile, setPreviewFile] = useState(null); // file to preview
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [renameItemModalVisible, setRenameItemModalVisible] = useState(false);

  const qc = useQueryClient();

  const deleteHandler = async () => {
    try {
      setLoading(true);

      if (!selectedItemToDelete || !Object.keys(selectedItemToDelete).length) {
        //TODO - throw an error notification.
        return;
      }

      const itemPath = `${getPath(selectedFolderPathList)}/${
        selectedItemToDelete?.name
      }`;
      const response = await deleteItem(itemPath);

      //deletion is successful, close the modal and refresh
      qc.invalidateQueries([
        "getFileList",
        getPath(selectedFolderPathList) ?? "/",
      ]);
    } catch (error) {
      //TODO - show a notification;
      console.error(error);
    } finally {
      setLoading(false);
      setSelectedItemToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const copyToPublicStorage = async (from, toContentUri) => {
    if (Platform.OS !== "android") return;

    try {
      await StorageModule.copyToSafFile(from, toContentUri);
    } catch (err) {
      console.error("Copy failed", err);
      throw err;
    }
  };

  const androidDownloadHandler = async (uri) => {
    try {
      const fileName = uri?.split("/").pop();
      if (!fileName) {
        throw new Error("Filename not found");
      }

      const mimeType = getMimeType(fileName);

      if (isMediaMimeType(mimeType)) {
        //Save media files - audio, video & images
        return await saveMediaFile(uri);
      }

      let storageFolderUri = await getStorageFolderUri();

      if (!storageFolderUri) {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) {
          throw new Error("Permission not granted");
        }

        storageFolderUri = permissions.directoryUri;
        await saveStorageFolderUri(storageFolderUri);
      }

      //We need to create a file before copying into it.
      const newFileUri =
        await FileSystem.StorageAccessFramework.createFileAsync(
          storageFolderUri,
          fileName,
          mimeType
        );

      console.error(uri);
      console.error(newFileUri);
      await copyToPublicStorage(uri, newFileUri);

      successNotification(
        "File saved to your device's 'StoragePodDownloads' folder."
      );
    } catch (error) {
      console.error(error);
      throw new Error("Couldn't save the file");
    }
  };

  const downloadHandler = async () => {
    /**
     * The flow is
     * We will first check if the app has permissions to file system, if not we will request. if permission denied then we will return.
     * After that we will download the requested file to a sandboxed env.
     * In android we will ask the user to download it to their required location.
     * In IOS we will ask the user to share/save using expo-sharing.
     */
    try {
      setDownloadLoading(true);

      if (
        !selectedItemToDownload ||
        !Object.keys(selectedItemToDownload).length
      ) {
        //TODO - throw an error notification.
        return;
      }

      const { status } = await MediaLibrary.getPermissionsAsync();

      if (status === "none") {
        const { status } = await MediaLibrary.requestPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Permission required",
            "Storage permission is required to download files"
          );
          return;
        }
      }

      const downloadDir = `${FileSystem.documentDirectory}downloads/`;
      const dirInfo = await FileSystem.getInfoAsync(downloadDir);

      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(downloadDir, {
          intermediates: true,
        });
      }

      // This is the path to send to the backend to download the required file.
      const itemPath = `${getPath(selectedFolderPathList)}/${
        selectedItemToDownload?.name
      }`.replace(/\/+/g, "/");

      // This is the path where the file will be downloaded to and the name will be assigned during this.
      const toBeDownloadedPath = `${downloadDir}${selectedItemToDownload?.name}`;

      const token = await getJWT();

      const downloadResumable = FileSystem.createDownloadResumable(
        `${baseURL()}/files/download?path=${itemPath}`,
        toBeDownloadedPath,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        (downloadProgress) => {
          const progress =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          setDownloadProgress(progress * 100);
        }
      );

      const { uri } = await downloadResumable.downloadAsync();

      //Till here the file is downloaded. now for ios we will download it using the expo sharing. and for android we have 2 logics.
      //For images/videos we download it to the media library and for other files to the directory.
      if (Platform.OS === "ios") {
        const canShare = await ExpoSharing.isAvailableAsync();
        if (canShare) {
          await ExpoSharing.shareAsync(uri);
        } else {
          Alert.alert("Error", "Sharing is not available on this device");
        }
      } else if (Platform.OS == "android") {
        await androidDownloadHandler(uri);
      }
    } catch (error) {
      if (error.code === "ENOSPC") {
        errorNotification("No space left on the device");
      }
      console.error(error);
    } finally {
      closeDownloadItemBottomSheet();
      setSelectedItemToDownload(null);
      setDownloadLoading(false);
      setShowDownloadModal(false);
    }
  };

  const saveMediaFile = async (fileUri) => {
    try {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("StroagePodDownloads", asset, true);

      successNotification(
        "Media saved to your gallery under 'StoragePodDownloads'."
      );
    } catch (error) {
      console.error(error);
      errorNotification("ERROR - Couldn't save the file");
    }
  };
  const FlatListRenderer = () => {
    return (
      <>
        {showDeleteModal && (
          <DeleteItemModal
            visible={showDeleteModal}
            setVisible={setShowDeleteModal}
            deleteHandler={deleteHandler}
            loading={loading}
            selectedItemToDelete={selectedItemToDelete}
            selectedItemToDeleteSource={selectedItemToDeleteSource}
          />
        )}
        {showDownloadModal && (
          <DownloadItemModal
            visible={showDownloadModal}
            setVisible={setShowDownloadModal}
            downloadHandler={downloadHandler}
            loading={downloadLoading}
            selectedItemToDownload={selectedItemToDownload}
            openDownloadItemBottomSheet={openDownloadItemBottomSheet}
          />
        )}
        <DownloadItemBottomSheetModal
          ref={downloadItemBottomSheetRef}
          progress={downloadProgress}
        />
        {renameItemModalVisible && (
          <RenameItemModal
            visible={renameItemModalVisible}
            setVisible={setRenameItemModalVisible}
          />
        )}
        <CompressFolderBottomSheetModal ref={compressFolderBottomSheetRef} />
        {showPreviewModal && (
          <FilePreviewModal
            showPreviewModal={showPreviewModal}
            setShowPreviewModal={setShowPreviewModal}
            previewFile={previewFile}
          />
        )}
        <Animated.FlatList
          layout={LinearTransition.springify().damping(80).stiffness(200)}
          data={files}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            if (item.is_directory) {
              return (
                <FolderRenderer
                  data={item}
                  theme={theme}
                  pushToSelectedFolderPath={pushToSelectedFolderPath}
                  openCompressfolderBottomSheet={openCompressfolderBottomSheet}
                  setShowDeleteModal={setShowDeleteModal}
                  setRenameItemModalVisible={setRenameItemModalVisible}
                />
              );
            }
            return (
              <FileRenderer
                data={item}
                theme={theme}
                insets={insets}
                setShowDeleteModal={setShowDeleteModal}
                showDownloadModal={setShowDownloadModal}
                setPreviewFile={setPreviewFile}
                setShowPreviewModal={setShowPreviewModal}
                setRenameItemModalVisible={setRenameItemModalVisible}
              />
            );
          }}
          contentContainerStyle={{
            gap: 8,
            paddingBottom: 100,
          }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        />
      </>
    );
  };

  return (
    <>
      {showSearchBar && (
        <Animated.View
          entering={FadeInUp.springify().damping(80).stiffness(200)}
          layout={LinearTransition.springify().damping(80).stiffness(200)}
          exiting={FadeOutUp.springify().damping(80).stiffness(200)}
        >
          <SearchBar
            searching={searching}
            searchItem={searchItem}
            showSearchBar={showSearchBar}
            setShowSearchBar={setShowSearchBar}
            setSearchItem={debouncedSearch}
          />
        </Animated.View>
      )}
      {!data || !files || !files.length ? (
        <View className="flex-1 flex justify-center items-center gap-y-8">
          <LottieView
            style={{
              width: 200,
              height: 200,
              backgroundColor: "transparent",
            }}
            source={require("~/assets/lottie/noFiles.json")}
            autoPlay
            loop
          />
          <View className="gap-y-2 justify-center items-center">
            <Text className="text-xl font-bold">No Files</Text>
            <Text>Start uploading files</Text>
          </View>
        </View>
      ) : (
        <FlatListRenderer />
      )}
    </>
  );
}
