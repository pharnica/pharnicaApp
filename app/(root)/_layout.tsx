import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import useBottomSheetStore from "@/store/bottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";
import useOrderStore from "@/store/orderStore";
import { TouchableOpacity, Text, Pressable } from "react-native";
import { PhotoIcon } from "react-native-heroicons/outline";
import { icons } from "@/constants";
import { Image } from "expo-image";
import { UserProvider } from "../../context/UserContext";
import usePrescriptionStore from "@/store/prescriptionStore";

const Layout = () => {
  const { open, setOpen } = useBottomSheetStore();
  const { prescriptions, addPrescription } = usePrescriptionStore();
  const snapPoints = ["30%"];
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (open) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [open]);

  const uploadPrescription = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      const Prescription = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
      });
      if (!Prescription.canceled) {
        addPrescription(Prescription.assets[0].uri);
        setOpen(false);
        router.navigate("/(root)/(order)/prescription_confirmation");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: "none" }} />
        
        <Stack.Screen name="(order)" options={{ headerShown: false }} />

        <Stack.Screen
          name="notifications"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="chatBox"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="(deliveryLocations)"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="(profile)"
          options={{ headerShown: false, animation: "slide_from_left" }}
        />
        <Stack.Screen
          name="(products)"
          options={{ headerShown: false, animation: "none" }}
        />
      </Stack>

      {open && (
        <Pressable
          className="absolute top-0 left-0 w-full h-full bg-black/50"
          onPress={() => setOpen(false)}
        />
      )}

      {/* Bottom Sheet */}
      {open && (
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose
          onClose={() => setOpen(false)}
        >
          <BottomSheetView className="bg-white p-5 items-center">
            <TouchableOpacity className="flex-row items-center w-full px-5 py-4 gap-3 border border-gray-200 rounded-full mb-3">
              <Image
                source={icons.BlackScanner}
                style={{ width: 24, height: 24 }}
              />
              <Text
                className="text-[15px] pt-1"
                style={{ fontFamily: "Poppins" }}
              >
                Scan Prescription
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center w-full px-5 py-4 gap-3 border border-gray-200 rounded-full"
              onPress={uploadPrescription}
            >
              <PhotoIcon size={24} color="black" />
              <Text
                className="text-[15px] pt-1"
                style={{ fontFamily: "Poppins" }}
              >
                Upload Prescription
              </Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheet>
      )}
    </GestureHandlerRootView>
  );
};

export default Layout;
