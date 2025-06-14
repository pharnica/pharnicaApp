// components/CourierCard.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { PhoneIcon } from "react-native-heroicons/solid";

export interface Courier {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  vehiclePlate: string;
  status: string;
  rating: number;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
}

const CourierCard = ({ orderId }: { orderId: string }) => {
  const courier: Courier = {
    id: "cour-001",
    name: "John Doe",
    phone: "+15551234567",
    vehicleType: "motorcycle",
    vehiclePlate: "MTC-2023",
    status: "available",
    rating: 4.7,
    currentLocation: {
      latitude: 40.7128,
      longitude: -74.006,
    },
  };

  return (
    <View className="flex flex-col items-center justify-center gap-6">

      <View className="flex-row items-center justify-between gap-5 w-full">
        <View className="flex flex-row gap-4 items-center">
          <Image
            source={require("@/assets/images/defaultAvatar.jpg")}
            style={tw`w-12 h-12 rounded-full`}
          />

          <View className="flex-col">
            <Text className="font-PoppinsSemiBold">{courier.name}</Text>
            <Text className="font-Poppins text-xs text-gray-400/70">
              {courier.vehicleType} - {courier.phone}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="w-12 h-12 border-[#22C55E] border rounded-full items-center justify-center"
          onPress={() => console.log("Call courier")}
        >
          <PhoneIcon color={"#22C55E"} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity className="py-4 w-full rounded-full bg-green-500 flex items-center justify-center ">
        <Text className="text-white font-PoppinsMedium">Live Tracking</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CourierCard;
