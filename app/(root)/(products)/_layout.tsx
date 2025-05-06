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
          name="searchPage"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="productDetails"
          options={{ headerShown: false }}
        />

      </Stack>

    </GestureHandlerRootView>
  );
}
