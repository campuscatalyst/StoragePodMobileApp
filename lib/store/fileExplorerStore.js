import { create } from "zustand";

export const useFileExplorerStore = create((set) => ({
  images: [],
  setImages: (value) => set({ images: value }),

  files: [],
  setFiles: (value) => set({ files: value }),

  selectedItemToDelete: null,
  setSelectedItemToDelete: (value) => set({ selectedItemToDelete: value }),

  selectedItemToDeleteSource: null,
  setSelectedItemToDeleteSource: (value) => set({ selectedItemToDeleteSource: value }),

  selectedItemToDownload: null,
  setSelectedItemToDownload: (value) => set({ selectedItemToDownload: value }),

  selectedFolderToCompress: null,
  setSelectedFolderToCompress: (value) => set({ selectedFolderToCompress: value }),
}));
