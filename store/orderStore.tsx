import { create } from "zustand";

interface DeliveryAddressType {
  address: string;
  createdAt?: string;
  id: string;
  isSelected: boolean;
  locationLatitude: number;
  locationLongitude: number;
  title: string;
  updatedAt?: string;
  userId?: string;
}

declare interface Pharmacy {
  id: string;
  address: string;
  distance_km: number;
  latitude: number;
  longitude: number;
  name: string;
  orderStatus: string;
}

interface OrderStoreType {
  user_id: string | null;
  deliveryAddress: DeliveryAddressType | null;
  doorDropOff: boolean;
  autoPharmacySelection: boolean;
  selectedPharmacies: Pharmacy[];
  prescriptions: string[];
  priceRequesting: Boolean;
  currentPrescIndex: number;
  status: string;

  // Actions

  // prescriptions
  addPrescription: (prescription: string) => void;
  removePrescription: (prescription: string | number) => void;
  modifyPrescription: (index: number, newPrescription: string) => void;
  popPrescriptions: () => void;

  // addresses
  setDeliveryAddress: (address: DeliveryAddressType) => void;

  // pharmacies
  setAutoPharmacySelection: (auto: boolean) => void;
  setSelectedPharmacies: (pharmacies: Pharmacy[]) => void;
  addSelectedPharmacy: (pharmacy: Pharmacy) => void;
  removeSelectedPharmacy: (pharmacyId: string) => void;
  clearSelectedPharmacies: () => void;
  updatePharmacyStatus: (pharmacyId: string, newStatus: string) => void;

  //other
  setPriceRequesting: (priceRequesting: boolean) => void;
  setDoorDropOff: (value: boolean) => void;
  setUserId: (id: string) => void;
  setStatus: (status: string) => void;
  resetOrder: () => void;
}

const initialState = {
  user_id: null,
  deliveryAddress: null,
  doorDropOff: true,
  autoPharmacySelection: true,
  priceRequesting: true,
  selectedPharmacies: [],
  prescriptions: [],
  currentPrescIndex: 0,
  status: "PENDING",
};

const useOrderStore = create<OrderStoreType>((set) => ({
  ...initialState,

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

  setDeliveryAddress: (address) => set({ deliveryAddress: address }),

  setAutoPharmacySelection: (autoPharmacySelection) =>
    set({ autoPharmacySelection }),

  setPriceRequesting: (priceRequesting) => set({ priceRequesting }),

  setSelectedPharmacies: (selectedPharmacies) => set({ selectedPharmacies }),

  addSelectedPharmacy: (pharmacy) =>
    set((state) => ({
      selectedPharmacies: state.selectedPharmacies.some(
        (p) => p.id === pharmacy.id
      )
        ? state.selectedPharmacies // if exists, return as is
        : [...state.selectedPharmacies, pharmacy], // otherwise add
      autoPharmacySelection: false, // automatically set to false when manually adding
    })),

  removeSelectedPharmacy: (pharmacyId) =>
    set((state) => ({
      selectedPharmacies: state.selectedPharmacies.filter(
        (pharmacy) => pharmacy.id !== pharmacyId
      ),
    })),

  clearSelectedPharmacies: () => set({ selectedPharmacies: [] }),

  updatePharmacyStatus: (pharmacyId, newStatus) =>
    set((state) => ({
      selectedPharmacies: state.selectedPharmacies.map((pharmacy) =>
        pharmacy.id === pharmacyId
          ? { ...pharmacy, orderStatus: newStatus }
          : pharmacy
      ),
    })),

  setDoorDropOff: (doorDropOff) => set({ doorDropOff }),

  setUserId: (user_id) => set({ user_id }),

  setStatus: (status) => set({ status }),

  resetOrder: () => set(initialState),
}));

export default useOrderStore;
