import React from "react";
import { View, TouchableHighlight, Image,Text } from "react-native";
import { PlatformPressable } from "@react-navigation/elements";

import {
  MapIcon as MapOutline,
  ShoppingCartIcon as CartOutline,
  ArchiveBoxIcon as OrdersOutline,
  ChatBubbleBottomCenterIcon as ChatBubbleBottomCenterOutline,
} from "react-native-heroicons/outline";


import {
  MapIcon as MapSolid,
  ShoppingCartIcon as CartSolid,
  ArchiveBoxIcon as OrdersSolid,
  ChatBubbleBottomCenterIcon as ChatBubbleBottomCenterSolid,
} from "react-native-heroicons/solid";

import { icons, images } from "@/constants";

export default function MyTabBar({ state, descriptors, navigation }) {
  const colors = {
    primary: "#22C55E",
    secondary: "#dadada",
  };

  const Allicons = {
    '(home)': (props) =>
      props.isFocused ? (
        <Image source={icons.Activehome} className={`w-[22px] h-[22px]`} />
      ) : (
        <Image source={icons.home} className={`w-[22px] h-[22px] `} />
      ),
    map: (props) =>
      props.isFocused ? (
        <MapSolid size={22} color={props.color} {...props} />
      ) : (
        <MapOutline size={22} color={props.color} {...props} />
      ),
    cart: (props) =>
      props.isFocused ? (
        <CartSolid size={22} color={props.color} {...props} />
      ) : (
        <CartOutline size={22} color={props.color} {...props} />
      ),
    chat: (props) =>
      props.isFocused ? (
        <ChatBubbleBottomCenterSolid size={22} color={props.color} {...props} />
      ) : (
        <ChatBubbleBottomCenterOutline size={22} color={props.color} {...props} />
      ),
  };

  return (
    <View className="absolute bottom-0 w-full flex-row items-center gap-3 bg-white justify-between px-4 border-t border-gray-200">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: "tabLongPress", target: route.key });
        };

        if (route.name !== "scanCam") {
          return (
            <PlatformPressable
              key={route.key}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              className="flex-1 items-center justify-center py-4 gap-1 w-[55px]"
              pressColor="rgba(34, 197, 94, 0.07)"
            >
              {Allicons[route.name]?.({
                color: isFocused ? colors.primary : colors.secondary,
                isFocused,
              })}
              <Text
                className={
                  isFocused
                    ? "text-green-500 text-sm font-PoppinsMedium"
                    : "font-Poppins opacity-20 text-sm"
                }
              >
                {label}
              </Text>

            </PlatformPressable>
          );
        } else {
          return (
            <TouchableHighlight
              key={route.key}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              className="items-center justify-center bg-green-500 rounded-full w-[55px] h-[55px]"
              underlayColor="#178740"
            >
              <Image source={icons.WhiteScanner} className={`w-7 h-7 `} />
            </TouchableHighlight>
          );
        }
      })}
    </View>
  );
}
