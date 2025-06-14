import { create } from "zustand";


interface BottomSheetStoreType { 
     open: boolean;
     setOpen: (open: boolean) => void;
}
 
const useModalStore = create<BottomSheetStoreType>((set) => ({
     open: false,
     setOpen: (open) => set({ open }),
}));


export default useModalStore;