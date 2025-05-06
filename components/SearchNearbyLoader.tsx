import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import LoadingText from "./LoadingText";

const SearchNearbyLoader = () => {
  return (
    <View className="bg-white rounded-2xl flex-col gap-5 py-5 w-full">
      <View className="flex-col gap-2 items-baseline flex-shrink px-6">
        <View className="flex flex-row gap-4 flex-shrink justify-between">
          <ActivityIndicator color="#22c55e" />

          <LoadingText
            content="Searching for Nearby Pharmacies"
            numberOfLines={2}
            isLoading={true}
            TextclassName="font-PoppinsSemiBold text-xl tracking-tighter flex-shrink leading-6"
          />
        </View>

        <Text className="font-PoppinsMedium text-sm text-gray-400">
          The app is searching for pharmacies to send your order to
        </Text>
      </View>
    </View>
  );
};

export default SearchNearbyLoader;
