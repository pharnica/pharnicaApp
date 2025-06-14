import { create } from "zustand";

interface PrescriptionStoreType {
  prescriptions: string[];
  currentPrescIndex: number;

  // Actions
  addPrescription: (prescription: string) => void;
  removePrescription: (prescription: string | number) => void;
  modifyPrescription: (index: number, newPrescription: string) => void;
  popPrescriptions: () => void;
}

const initialPrescriptionState = {
  prescriptions: [],
  currentPrescIndex: 0,
};

const usePrescriptionStore = create<PrescriptionStoreType>((set) => ({
  ...initialPrescriptionState,

  addPrescription: (prescription) =>
    set((state) => ({
      prescriptions: [...state.prescriptions, prescription],
      currentPrescIndex: state.prescriptions.length,
    })),

  removePrescription: (prescription) =>
    set((state) => {
      const updatedPrescriptions =
        typeof prescription === "number"
          ? state.prescriptions.filter((_, index) => index !== prescription)
          : state.prescriptions.filter((p) => p !== prescription);

      return {
        prescriptions: updatedPrescriptions,
        currentPrescIndex: Math.min(
          state.currentPrescIndex,
          Math.max(0, updatedPrescriptions.length - 1)
        ),
      };
    }),

  modifyPrescription: (index, newPrescription) =>
    set((state) => {
      if (index < 0 || index >= state.prescriptions.length) return state;
      const updatedPrescriptions = [...state.prescriptions];
      updatedPrescriptions[index] = newPrescription;
      return { prescriptions: updatedPrescriptions };
    }),

  popPrescriptions: () => set({ prescriptions: [], currentPrescIndex: 0 }),
}));

export default usePrescriptionStore;