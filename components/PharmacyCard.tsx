// components/PharmacyCard.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { ChatBubbleBottomCenterIcon, PhoneIcon } from "react-native-heroicons/solid";
import { icons } from "@/constants";
import { Pharmacy } from "@/hooks/usePharmacyData";



const PharmacyCard= ({ pharmacy , distance } : {pharmacy : Pharmacy , distance : string}) => {


  return (
    <View className="flex-row items-start justify-between gap-5">

      <View className="flex flex-row gap-3 items-center flex-shrink">
        <Image
          source={icons.SelectedPharmacy}
          style={tw`w-10 h-10 rounded-full`}
        />
        <View className="flex-col flex-shrink gap-1">
          <Text className="font-PoppinsSemiBold text-sm">{pharmacy.name} - {distance} km away</Text>
          <Text className="font-Poppins text-xs text-neutral-400 truncate" numberOfLines={1}>
            {pharmacy.address}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        className="w-12 h-12 bg-neutral-100 rounded-full items-center justify-center"
      >
        <ChatBubbleBottomCenterIcon size={20} color={"#22C55E"} />
      </TouchableOpacity>
    </View>
  );
};

export default PharmacyCard;