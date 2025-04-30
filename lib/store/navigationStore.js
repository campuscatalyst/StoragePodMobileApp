import { create } from "zustand";

export const useNavigationStore = create((set, get) => ({
  selectedDevice: {},
  setSelectedDevice: (value) => set({ selectedDevice: value }),

  selectedFolderPathList: [],
  pushToSelectedFolderPath: (value) => set((state) => ({ selectedFolderPathList: [...state.selectedFolderPathList, value] })),
  popFromSelectedFolderPath: () => set((state) => ({ selectedFolderPathList: state.selectedFolderPathList.slice(0, -1)})),
  clearSelectedFolderPath: () => set({ selectedFolderPathList: [] }),
}));
