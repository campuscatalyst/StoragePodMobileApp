import { create } from "zustand";

export const useDeviceDiscoveryStore = create((set) => ({
  selectedDeviceToConnect: null,
  setSelectedDeviceToConnect: (value) => set({ selectedDeviceToConnect: value }),

  selectedDomain: "storagepod.local",
  setSelecteDomain: (value) => set({ selectedDomain: value }),
  resetSelectedDomain: () => set({ selectedDomain: "storagepod.local" }),

  resetDeviceNameId: null,
  setResetDeviceNameId: (value) => set({ resetDeviceNameId: value }),
}));
