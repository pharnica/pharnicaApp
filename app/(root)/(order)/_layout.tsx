import { Stack } from "expo-router";
import React from "react";
import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";


export default function RootLayout() {
 

  return (
    <GestureHandlerRootView className="flex-1">
      <Stack>
        <Stack.Screen
          name="prescription_confirmation"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="prescriptions_list"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="checkout"
          options={{ headerShown: false, animation: "slide_from_right"}}
        />
        <Stack.Screen
          name="specificPharmacySelection"
          options={{ headerShown: false, animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="paymentMethod"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="orderTracking"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
      </Stack>

    </GestureHandlerRootView>
  );
}
