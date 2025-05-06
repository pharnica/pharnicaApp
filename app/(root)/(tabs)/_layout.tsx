import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import MyTabBar from "@/components/MyTabBar";

const _layout = () => {
  
  return (
    <Tabs tabBar={(props) => <MyTabBar {...props} />}>
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: false,
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="scanCam"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "chat",
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default _layout;
