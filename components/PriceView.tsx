import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { useUserData } from "@/context/UserContext";

const PriceView = ({ price , orderPharmacyId }: { price: number , orderPharmacyId : string }) => {

  const { userData } = useUserData();
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingDeny, setLoadingDeny] = useState(false);


  const handlePriceAccepting = async (Accept: boolean) => {
    if (Accept) {
      setLoadingAccept(true);
    } else {
      setLoadingDeny(true);
    }

    try {

      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_SIDE_API}/api/orders/priceAccepting`,
        {
          userId: userData?.user_id,
          orderPharmacyId,
          Accepted: true,
        }
      );

    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAccept(false);
      setLoadingDeny(false);
    }
  };

  return (
    <View className="bg-white rounded-2xl flex-col gap-6 p-5 w-full border border-neutral-200">
      <View className="flex-col items-start flex-1">
        <Text className="font-PoppinsSemiBold">Total Price</Text>
        <Text className="font-Poppins text-xs text-gray-400 mt-1">
          the pharmacy have been counted the total price estimated of the
          medicals and is :
        </Text>
      </View>

      <View className="flex-row items-center justify-between flex-shrink">
        <Text className="text-3xl font-Poppins">{price} MAD</Text>
        <Text className="text-lg font-PoppinsMedium">+</Text>
        <View className="flex flex-col items-center">
          <Text className="font-PoppinsMedium text-xs">Fees of</Text>
          <Text className="font-PoppinsMedium text-xs">Delivery</Text>
        </View>
        <Text className="text-lg font-PoppinsMedium">=</Text>
        <Text className="text-2xl font-Poppins">{price + 6} MAD</Text>
      </View>

      <View className="flex flex-row items-center gap-4 mt-2">
        <TouchableOpacity
          className="flex-1 flex items-center justify-center h-12 rounded-full border-[1.5px] border-[#22C55E]"
          onPress={() => handlePriceAccepting(false)}
          disabled={loadingDeny || loadingAccept}
        >
          {loadingDeny ? (
            <ActivityIndicator size="small" color="#22C55E" />
          ) : (
            <Text className="font-PoppinsSemiBold text-[#22C55E] pt-[2px]">
              Denied
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 flex items-center justify-center h-12 rounded-full bg-[#22C55E] border-[1.5px] border-[#22C55E]"
          onPress={() => handlePriceAccepting(true)}
          disabled={loadingAccept || loadingDeny}
        >
          {loadingAccept ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="font-PoppinsMedium text-white pt-[2px]">
              Accept
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PriceView;
