import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { XMarkIcon } from "react-native-heroicons/outline";

type OrderStatusScreenProps = {
  status: "DELIVERED" | "CANCELLED";
  animation: any;
  title: string;
  subtitle?: string;
  buttonText: string;
  backgroundColor: string;
  onPress?: () => void;
};

const OrderStatusScreen = ({
  status,
  animation,
  title,
  subtitle,
  buttonText,
  backgroundColor,
}: OrderStatusScreenProps) => {
  return (
    <View className={`flex-1 py-4 px-4 gap-6 bg-${backgroundColor}`}>


      <View className="w-full flex-1 items-center justify-center gap-10 px-5">

        <View className="flex flex-col items-center justify-center gap-1">
          <Text className="text-white font-PoppinsSemiBold text-2xl text-center">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-white font-Poppins text-center">
              {subtitle}
            </Text>
          )}
        </View>

        <View className="w-full gap-2">
          {status === "DELIVERED" && (
            <TouchableOpacity className="py-3 w-full rounded-full border-2 border-white">
              <Text className="text-white font-PoppinsMedium text-center">
                Check Order details
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity className="py-3 w-full rounded-full border-2 border-white bg-white">
            <Text
              className={`font-PoppinsMedium text-center ${
                status === "DELIVERED" ? "text-green-500" : "text-red-500"
              }`}
            >
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OrderStatusScreen;
