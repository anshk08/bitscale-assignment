import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GlobalStore {
  selectedFirm: number;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  setSelectedFirm: (firmId: number) => void;

  findPeopleSheetOpen: boolean;
  setFindPeopleSheetOpen: (open: boolean) => void;
}

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      selectedFirm: 0,
      hydrated: false,
      findPeopleSheetOpen: false,

      setHydrated: (value) => set({ hydrated: value }),

      setSelectedFirm: (firmId) => set({ selectedFirm: firmId }),
      setFindPeopleSheetOpen: (open) => set({ findPeopleSheetOpen: open }),
    }),
    {
      name: "selectedfirm",

      partialize: (state) => ({
        selectedFirm: state.selectedFirm,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
