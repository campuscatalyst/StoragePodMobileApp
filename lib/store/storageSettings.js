import { create } from "zustand";

export const useStorageSettingsStore = create((set) => ({
  showHiddenItems: false,
  setShowHiddenItems: (value) => set({ showHiddenItems: value }),
}));
