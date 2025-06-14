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
  distance: number;
  latitude: number;
  longitude: number;
  name: string;
  orderStatus: string;
}

interface OrderStoreType {
  user_id: string | null;
  deliveryAddress: DeliveryAddressType | null;
  doorDropOff: boolean;
  selectedPharmacies: Pharmacy[];
  priceRequesting: boolean;
  status: string;

  // Actions
  setDeliveryAddress: (address: DeliveryAddressType) => void;
  setSelectedPharmacies: (pharmacies: Pharmacy[]) => void;
  updatePharmacyStatus: (pharmacyId: string, newStatus: string) => void;
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
  priceRequesting: true,
  selectedPharmacies: [],
  status: "PENDING",
};

const useOrderStore = create<OrderStoreType>((set) => ({
  ...initialState,

  setDeliveryAddress: (address) => set({ deliveryAddress: address }),

  setPriceRequesting: (priceRequesting) => set({ priceRequesting }),

  setSelectedPharmacies: (selectedPharmacies) => set({ selectedPharmacies }),


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