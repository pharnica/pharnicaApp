import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserIcon,
  ChevronRightIcon,
} from "react-native-heroicons/outline";

import { router } from "expo-router";
import useBottomSheetStore from "@/store/bottomSheet";
import { icons } from "@/constants";
import { useUserData } from "@/context/UserContext";
import MedicalCategories from "@/components/MedicalCategories";
import { MapPinIcon } from "react-native-heroicons/solid";

const Home = () => {
  const { userData, isLoading } = useUserData();
  const { open, setOpen } = useBottomSheetStore();

  return (
    <SafeAreaView className="flex-1 bg-gray-100 py-3 px-4">
      <StatusBar
        animated
        backgroundColor="rgb(243 244 246)"
        barStyle="dark-content"
      />

      <View className="flex-row items-center justify-between w-full mb-10 gap-8">
        <View className="flex flex-row items-center gap-3 flex-shrink">
          <TouchableHighlight
            className="w-[50px] h-[50px] flex items-center justify-center bg-white rounded-full"
            onPress={() => router.navigate("/(root)/(profile)/profileMain")}
            disabled={isLoading}
            underlayColor="rgba(0, 0, 0, 0.05)"
          >
            {isLoading ? (
              <ActivityIndicator color="#22c55e" />
            ) : userData ? (
              <View className="w-full h-full rounded-full bg-green-500 flex justify-center items-center">
                <Text className="text-xl text-white font-PoppinsMedium uppercase ">
                  {userData?.first_name &&
                    `${userData?.first_name.substring(
                      0,
                      1
                    )}${userData?.last_name.substring(0, 1)}`}
                </Text>
              </View>
            ) : (
              <UserIcon size={28} color="black" />
            )}
          </TouchableHighlight>

          {userData?.delivery_locations?.length != 0 && !isLoading && (
            <TouchableOpacity
              className="flex flex-col items-start flex-shrink w-full"
              onPress={() => {
                router.navigate({
                  pathname:
                    "/(root)/(deliveryLocations)/List_of_delivery_locations",
                  params: { From: "Home" },
                });
              }}
            >
              <Text className="font-Poppins text-sm text-[#989898]">
                Delivery location
              </Text>

              <View className="flex flex-row items-center gap-1">
                <MapPinIcon color={"#22C55E"} size={18} />
                {/* Display the selected location's address or name */}
                <Text
                  className="font-PoppinsMedium text-sm truncate w-full flex-shrink tracking-tight"
                  numberOfLines={1}
                >
                  {userData?.delivery_locations.find((loc) => loc.isSelected)
                    ?.address || "Select location"}
                </Text>
                <ChevronRightIcon size={13} color="black" strokeWidth={2.2} />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* //notifications */}
        <TouchableHighlight
          className="w-[50px] h-[50px] flex items-center justify-center bg-white rounded-full"
          onPress={() => router.navigate("/(root)/notifications")}
          underlayColor="rgba(0, 0, 0, 0.05)"
        >
          <BellIcon size={28} color="black" />
        </TouchableHighlight>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="mt-5">
        {userData?.delivery_locations?.length == 0 && (
          <TouchableOpacity
            className="flex flex-row pl-7 pr-3 py-3 gap-8 items-center justify-between rounded-full border-2 border-[#22c55e2b] mb-4"
            onPress={() => {
              router.navigate(
                "/(root)/(deliveryLocations)/List_of_delivery_locations"
              );
            }}
          >
            <View className="flex flex-row items-center justify-center gap-4">
              <Image style={{ height: 28, width: 19 }} source={icons.mapPin} />

              <Text className="text-base text-[#22C55E] font-PoppinsMedium">
                Add a delivery location
              </Text>
            </View>

            <ChevronRightIcon color={"#22C55E"} size={20} strokeWidth={2.4} />
          </TouchableOpacity>
        )}

        <View className="w-full items-center gap-4 mb-4">
          {/* Search Bar */}
          <TouchableOpacity
            activeOpacity={0.6}
            className="flex flex-row justify-between items-center h-[56px] w-full pl-4 pr-[6px] bg-white rounded-[70px] focus:border border-[#22c55e3f]"
            onPress={() => {
              router.navigate("/(root)/(products)/searchPage");
            }}
          >
            <View className="flex flex-row justify-start items-center gap-3.5">
              <MagnifyingGlassIcon size={23} color="black" />
              <TextInput
                className="font-MontserratMedium flex-shrink tracking-tighter"
                placeholder="Search Medicines..."
                placeholderTextColor="#b0b0b0"
                clearButtonMode="never"
                returnKeyType="search"
                editable={false}
              />
            </View>

            <TouchableOpacity className="w-[46px] h-[46px] bg-neutral-100 flex items-center justify-center rounded-full ml-3">
              <AdjustmentsHorizontalIcon size={25} color="black" />
            </TouchableOpacity>
          </TouchableOpacity>

          <MedicalCategories />

          <TouchableHighlight
            underlayColor="#178740"
            className="w-full rounded-full"
            onPress={() => setOpen(true)}
          >
            <View className="h-[58px] w-full pr-2.5 pl-6 bg-green-500 rounded-full flex flex-row justify-between items-center">
              <View className="flex flex-row justify-start gap-3 items-center">
                <Image
                  style={{ height: 28, width: 19 }}
                  source={icons.prescription}
                />
                <Text className="text-white text-base capitalize font-PoppinsMedium pt-1">
                  Order with prescription
                </Text>
              </View>
              <ChevronRightIcon size={18} color="white" strokeWidth={2.5} />
            </View>
          </TouchableHighlight>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
