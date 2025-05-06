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
     profilePhoto?: string;
   }

interface CourierCardProps {
  courier: Courier;
}

const CourierCard= ({ courier } : CourierCardProps) => {
  return (
    <View className="flex-row items-center justify-between gap-5 px-5">
      <View className="flex flex-row gap-4 items-center">
        <Image
          source={courier.profilePhoto 
            ? { uri: courier.profilePhoto } 
            : require("@/assets/images/defaultAvatar.jpg")}
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
  );
};

export default CourierCard;