import { Stack } from "expo-router";
import React from "react";
import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";


export default function RootLayout() {
 

  return (
    <GestureHandlerRootView className="flex-1 bg-white">
      <Stack>
        <Stack.Screen
          name="profileMain"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="profileDetails"
          options={{ headerShown: false }}
        />
      </Stack>

    </GestureHandlerRootView>
  );
}
