import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { PlusIcon } from "react-native-heroicons/outline";
import { router } from "expo-router";

const ProductCard = ({
  PR,
  description,
  price,
}: {
  PR: Boolean;
  description: string;
  price: string;
}) => {
  return (
    <TouchableOpacity className="bg-white shadow-sm shadow-slate-100 flex flex-col items-center gap-3 rounded-2xl overflow-hidden p-3 pt-5 flex-shrink w-[48%] mt-4" onPress={()=>{router.navigate('/(root)/(products)/productDetails')}}
    >
      <Image
        source={require("@/assets/images/Doliprane.jpg")}
        style={{
          width: 100,
          height: 100,
        }}
      />

      <Text className="w-full  font-PoppinsMedium text-xs text-neutral-300">
        {description}
      </Text>

      <View className="flex flex-row justify-between items-center w-full">
        <Text className="text-lg font-PoppinsSemiBold">{price} MAD</Text>

        <TouchableOpacity className="w-10 h-10 rounded-full bg-[#22C55E] flex items-center justify-center">
          <PlusIcon color={"white"} size={20} />
        </TouchableOpacity>
      </View>

      {PR && (
        <View className="absolute top-2 left-2 rounded-full w-7 h-7 bg-[#FFA500] flex items-center justify-center ">
          <Text className="text-xs text-white font-MontserratSemiBold">PX</Text>
        </View>
        
      )}
    </TouchableOpacity>
  );
};

export default ProductCard;
