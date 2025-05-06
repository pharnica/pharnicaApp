import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import LoadingText from "./LoadingText";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  EyeIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { Pharmacy } from "@/types/type";

const PharmaciesNearByList = ({
  pharmacies,
  displayOneItem,
}: {
  pharmacies: Pharmacy[];
  displayOneItem?: boolean;
}) => {
  const [showPharmacies, setShowPharmacies] = useState(true);

  const togglePharmacies = () => {
    setShowPharmacies(!showPharmacies);
  };

  const currentPharmacy = pharmacies.find(
    (pharmacy) => pharmacy.orderStatus == "PROCESSING" || pharmacy.orderStatus == "ACCEPTED"
  );

  return (
    <View className="flex-col gap-4">
      <TouchableOpacity
        className="flex-row flex-shrink justify-between items-center w-full px-5"
        onPress={togglePharmacies}
      >
        <Text className="font-PoppinsSemiBold">
          {displayOneItem ? "Current Pharmacy" : "Nearby Pharmacies Results"}
        </Text>
        {!displayOneItem &&
          (showPharmacies ? (
            <ChevronUpIcon color="black" size={18} strokeWidth={2} />
          ) : (
            <ChevronDownIcon color="black" size={18} strokeWidth={2} />
          ))}
      </TouchableOpacity>

      {showPharmacies && (
        <View className="flex-col">
          {displayOneItem ? (
            currentPharmacy ? (
              <View className="flex-row items-center gap-5 px-5 py-4 bg-green-500/5">
                {currentPharmacy.orderStatus === "PROCESSING" && (
                  <EyeIcon size={24} color="#22c55e" />
                )}
                {currentPharmacy.orderStatus === "ACCEPTED" && (
                  <CheckIcon color="#22C55E" size={22} strokeWidth={2.5} />
                )}

                <View className="flex-shrink">
                  <LoadingText
                    content={currentPharmacy.name}
                    isLoading={currentPharmacy.orderStatus === "PROCESSING"}
                    TextclassName="font-PoppinsSemiBold text-sm"
                  />
                  <LoadingText
                    content={currentPharmacy.address}
                    numberOfLines={1}
                    isLoading={currentPharmacy.orderStatus === "PROCESSING"}
                    TextclassName="font-PoppinsMedium text-xs text-gray-400 truncate"
                  />
                </View>
              </View>
            ) : (
              <View className="px-5 py-4">
                <Text className="font-PoppinsMedium text-sm text-gray-500">
                  No active pharmacy found
                </Text>
              </View>
            )
          ) : (
            pharmacies.map((pharmacy, index) => (
              <View
                key={pharmacy.id}
                className={`flex-row items-center gap-5 px-5 py-4 ${
                  pharmacy.orderStatus === "ACCEPTED" ||
                  pharmacy.orderStatus === "PROCESSING"
                    ? "bg-green-500/5"
                    : ""
                } ${
                  index < pharmacies.length - 1
                    ? "border-b border-neutral-200"
                    : ""
                }`}
              >
                {pharmacy.orderStatus === "PROCESSING" && (
                  <EyeIcon size={24} color="#22c55e" />
                )}
                {pharmacy.orderStatus === "PENDING" && (
                  <ClockIcon color="black" size={22} />
                )}
                {pharmacy.orderStatus === "ACCEPTED" && (
                  <CheckIcon color="#22C55E" size={22} strokeWidth={2.5} />
                )}
                {pharmacy.orderStatus === "REJECTED" && (
                  <XMarkIcon color="red" size={22} strokeWidth={2} />
                )}

                <View className="flex-shrink">
                  <LoadingText
                    content={pharmacy.name}
                    isLoading={pharmacy.orderStatus === "PROCESSING"}
                    TextclassName="font-PoppinsSemiBold text-sm"
                  />
                  <LoadingText
                    content={pharmacy.address}
                    numberOfLines={1}
                    isLoading={pharmacy.orderStatus === "PROCESSING"}
                    TextclassName="font-PoppinsMedium text-xs text-gray-400 truncate"
                  />
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
};

export default PharmaciesNearByList;