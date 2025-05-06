import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackwardHeader from "@/components/BackwardHeader";
import { router } from "expo-router";
import { ArrowLeftIcon, ShareIcon } from "react-native-heroicons/solid";
import tw from "twrnc";
import { MinusIcon, PlusIcon } from "react-native-heroicons/outline";

const productDetails = () => {
  const backTo = () => {
    router.back();
  };
  return (
    <SafeAreaView className="flex-1 w-full bg-gray-100 ">
      <StatusBar
        animated
        backgroundColor="rgb(243 244 246)"
        barStyle="dark-content"
      />

      <View className="flex flex-row justify-between  items-center w-full mb-4 mt-2 p-4">
        <TouchableOpacity
          className="w-10 h-10 bg-white rounded-full  items-center justify-center"
          onPress={backTo}
        >
          <ArrowLeftIcon
            size={20}
            color="black"
            strokeWidth={2}
          />
          
        </TouchableOpacity>

        <Text className="text-xl ml-6 font-PoppinsMedium ">Product details</Text>

        <TouchableOpacity className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <ShareIcon color={"black"} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={tw`bg-white rounded-t-3xl py-5 px-3 h-full`}
      ></ScrollView>

      <View className="bg-white absolute bottom-0 w-full border-t border-t-neutral-100 p-5 flex flex-row justify-between items-center">

        <View className="flex flex-row justify-between items-center gap-4">
          <TouchableOpacity className="rounded-full w-8 h-8 bg-[#F2F2F2] flex items-center justify-center">
            <MinusIcon
              size={15}
              color={"black"}
              strokeWidth={2}
              opacity={0.7}
            />
          </TouchableOpacity>

          <Text className="font-MontserratMedium text-lg ">{1}</Text>

          <TouchableOpacity className="rounded-full w-8 h-8 bg-[#F2F2F2] flex items-center justify-center">
            <PlusIcon size={15} color={"black"} strokeWidth={2} opacity={0.7} />
          </TouchableOpacity>
        </View>

        <TouchableHighlight
          className=" bg-green-500 rounded-full "
          activeOpacity={0.9}
          underlayColor="rgb(6, 123, 48)"
        >
          <View className="flex flex-row items-center justify-center gap-4 p-3 px-5">
            <Text className="text-white text-lg font-PoppinsSemiBold pt-1">
              {"16.00 MAD"}
            </Text>
            <Text className="text-white font-PoppinsMedium  text-sm">
              {"Add to card"}
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
};

export default productDetails;
