import { create } from "zustand";


interface BottomSheetStoreType { 
     open: boolean;
     setOpen: (open: boolean) => void;
}
 
const useBottomSheetStore = create<BottomSheetStoreType>((set) => ({
     open: false,
     setOpen: (open) => set({ open }),
}));


export default useBottomSheetStore;