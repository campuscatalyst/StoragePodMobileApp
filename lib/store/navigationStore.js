import { create } from "zustand";

export const useNavigationStore = create((set, get) => ({
  selectedDevice: {},
  setSelectedDevice: (value) => set({ selectedDevice: value }),

  selectedFolderPathList: [],
  pushToSelectedFolderPath: (value) => set((state) => ({ selectedFolderPathList: [...state.selectedFolderPathList, value] })),
  popFromSelectedFolderPath: () => set((state) => ({ selectedFolderPathList: state.selectedFolderPathList.slice(0, -1)})),
  clearSelectedFolderPath: () => set({ selectedFolderPathList: [] }),

  refreshTokenBottomPageRef: null, //this will be a ref.
  setRefreshTokenBottomPageRef: (value) => set({ refreshTokenBottomPageRef: value }),

  resetPasswordBottomPageRef: null, //this will be a ref.
  setResetPasswordBottomPageRef: (value) => set({ resetPasswordBottomPageRef: value }),
}));
