import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GlobalStore {
  selectedFirm: number;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  setSelectedFirm: (firmId: number) => void;
}

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      selectedFirm: 0,
      hydrated: false,

      setHydrated: (value) => set({ hydrated: value }),

      setSelectedFirm: (firmId) => set({ selectedFirm: firmId }),
    }),
    {
      name: "selectedfirm",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
