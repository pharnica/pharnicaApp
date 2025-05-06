import { Pressable, Text, TouchableOpacity, View } from "react-native";
import React, { Component } from "react";
import { router } from "expo-router";
import { ArrowLeftIcon } from "react-native-heroicons/outline";

const BackwardHeader = ({title , backTo  } : {title : string , backTo : any }) => {
  return (
    <View className="w-full mb-1 mt-2 flex-shrink flex-row items-center">
      <TouchableOpacity
        className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
        onPress={backTo}
      >
        <ArrowLeftIcon
          size={20}
          color="black"
          className="m-4"
          strokeWidth={2}
        />
      </TouchableOpacity>

      <Text className="text-xl ml-6 font-PoppinsMedium"> {title} </Text>
    </View>
  );
};

export default BackwardHeader;
