import { View, Text, Image } from "react-native";
import React from "react";
import { ArchiveBoxIcon, MapPinIcon } from "react-native-heroicons/outline";
import { icons } from "@/constants";
import tw from "twrnc";
import { Order , Pharmacy } from "@/hooks/usePharmacyData";

const OrderSummary = ({
  order,
  pharmacy,
}: {
  order: Order;
  pharmacy?: Pharmacy;
}) => {
  return (
    <View className="flex flex-col items-start justify-center w-full p-5 gap-3">

      <View className="w-full flex flex-row items-base gap-3 bg-neutral-50 rounded-xl px-2 py-4 border border-neutral-200">
        <MapPinIcon color={"black"} size={28} strokeWidth={1.2} />
        <View className="flex flex-col items-start flex-shrink">
          <Text className="font-PoppinsSemiBold">Delivery Address</Text>
          <Text
            className="flex-shrink font-Poppins text-sm text-gray-400 truncate"
            numberOfLines={1}
          >
            {order.deliveryLocation.address || "No address provided"}
          </Text>
        </View>
      </View>

      <View className="w-full flex flex-row items-base gap-3 bg-neutral-50 rounded-xl px-2 py-4 border border-neutral-200">
        <Image
          style={[tw`h-7 w-7`, { resizeMode: "contain" }]}
          source={icons.doorBlack}
        />

        <View className="flex flex-col items-start">
          <Text className="font-PoppinsSemiBold">Delivery Instructions</Text>
          <Text
            numberOfLines={1}
            className="text-sm font-Poppins text-gray-400 truncate"
          >
            {order.doorDropOff ? "Deliver to door" : "Meet outside"}
          </Text>
        </View>
      </View>

      <View className="w-full flex flex-row items-base gap-3 bg-neutral-50 rounded-xl px-2 py-4 border border-neutral-200">
        <Image
          style={[tw`h-6 w-6 ml-1`, { resizeMode: "contain" }]}
          source={icons.hospital}
        />

        <View className="flex flex-col items-start">
          <Text className="font-PoppinsSemiBold">Pharmacy Selected</Text>
          <Text
            numberOfLines={1}
            className="text-sm font-Poppins text-gray-400 truncate"
          >
            {pharmacy?.name}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OrderSummary;
