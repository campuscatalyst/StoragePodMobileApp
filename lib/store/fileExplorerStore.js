import { create } from "zustand";

export const useFileExplorerStore = create((set) => ({
  images: [],
  setImages: (value) => set({ images: value }),

  selectedItemToDelete: null,
  setSelectedItemToDelete: (value) => set({ selectedItemToDelete: value }),
}));
