import { create } from "zustand";

export const useFileUploadStore = create((set) => ({
  images: [],
  setImages: (value) => set({ images: value }),
}));
