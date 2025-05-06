import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HomeLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <Stack>
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="productsResults" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
