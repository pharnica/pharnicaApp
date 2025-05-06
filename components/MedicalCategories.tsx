import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { images } from "@/constants";
import tw from "twrnc";
import { ChevronRightIcon } from "react-native-heroicons/outline";

const MedicalCategories = () => {

    const categories = [
      { title: "Pain &\nFever", from: images.fever },
      { title: "Digestive\nHealth", from: images.digestive },
      { title: "Vitamins &\npain killers", from: images.drugs },
      { title: "Women's\nHealth", from: images.pregnant },
      { title: "First aid\nsupplies", from: images.aid },
      { title: "Babies\ngear", from: images.baby },
      { title: "Personal\nCare", from: images.care },
      { title: "Sexual\nhealth", from: images.adults },
    ];

  return (
    <View className="w-full bg-white drop-shadow-sm py-5 px-5 rounded-3xl flex flex-col gap-6">

      <View className="flex flex-row items-center justify-between">
        <Text className="font-PoppinsMedium ">Categories</Text>
        <TouchableOpacity className="flex flex-row items-center gap-1">
          <Text className="text-sm font-PoppinsMedium text-green-500 pt-[2px]">
            See All
          </Text>
          <ChevronRightIcon size={13} color="#22C55E" strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      <View className="flex flex-row flex-wrap justify-between gap-5 ">
        {categories &&
          categories.map((category, index) => {
            return (
              <View className="flex items-center w-16 gap-3 mb-3" key={index}>
                <View
                  className="w-16 h-16 bg-[#F2F2F2] rounded-full flex items-center justify-center"
                  key={index}
                >
                  <Image
                    source={category.from}
                    style={tw`w-9 h-9`}
                    resizeMode="contain"
                  />
                </View>

                <Text
                  className="text-xs font-PoppinsMedium text-center tracking-tight text-[#606060]"
                  numberOfLines={2}
                >
                  {category.title}
                </Text>
              </View>
            );
          })}
      </View>
    </View>
  );
};

export default MedicalCategories;
