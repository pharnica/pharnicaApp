import { View, Text, StatusBar, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { XMarkIcon } from "react-native-heroicons/outline";
import LottieView from "lottie-react-native";
import usePharmacyData from "@/hooks/usePharmacyData";
import OrderStatusUi from "@/components/OrderStatusUi";
import { LoadingScreen } from "./specificPharmacySelection";
import OrderTrackingDetails from "@/components/OrderTrackingDetails";
import { lotties } from "@/constants";
import OrderStatusScreen from "@/components/OrderStatusScreen";
import { useSocketContext } from "@/context/SocketContext";

const OrderTracking = () => {
  const { socket, isConnected } = useSocketContext();
  const orderId = "5793c84f-f94e-4e05-befc-1cdd6a890c47";

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { order, orderPharmacy, isLoading, refetch } = usePharmacyData(orderId);

  const handlestatusUpdate = useCallback(() => {
    console.log("some changes happened");
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("statusUpdate", handlestatusUpdate);

    return () => {
      socket.off("statusUpdate", handlestatusUpdate);
      socket.disconnect();
    };
  }, [socket, isConnected, orderId]);

  useEffect(() => {
    if (!isLoading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isLoading]);

  if (isLoading && isInitialLoad) return <LoadingScreen />;

  if (!order) return null;

  if (order.status === "DELIVERED") {
    return (
      <OrderStatusScreen
        status="DELIVERED"
        animation={lotties.delivered}
        title="Order Completed successfully"
        buttonText="Go back Home"
        backgroundColor="green-500"
      />
    );
  }

  if (order.status === "CANCELLED") {
    return (
      <OrderStatusScreen
        status="CANCELLED"
        animation={lotties.cancelled}
        title="Oooopps Order failed"
        subtitle={order.failureReason || "Unknown reasons for failing"}
        buttonText="Go back Home"
        backgroundColor="red-500"
      />
    );
  }

  if (!orderPharmacy) {
    return (
      <View className="flex flex-col items-center justify-center">
        <LottieView
          autoPlay
          loop={true}
          style={{
            width: 250,
            height: 250,
          }}
          source={lotties.rejected}
        />

        <View className="flex flex-col items-center justify-center">
          <Text className="text-white font-PoppinsSemiBold text-2xl text-center">
            Pharmacy Failed Validating Order
          </Text>
          <Text className="text-white font-PoppinsSemiBold text-2xl text-center">
            No pharmacy handle this order
          </Text>
        </View>

        <View>
          <TouchableOpacity className="py-3 w-full rounded-full bg-neutral-200">
            <Text className="text-white font-PoppinsMedium text-center">
              Cancell Order
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-3 w-full rounded-full bg-green-500">
            <Text className="text-white font-PoppinsMedium text-center">
              Chose other pharmacy
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 py-4 px-4 gap-6">
      <StatusBar
        animated
        backgroundColor="rgb(243 244 246)"
        barStyle="dark-content"
      />

      <View className="flex-row items-center gap-3">
        <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
          <XMarkIcon size={20} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <OrderStatusUi
        order={order}
        orderPharmacy={orderPharmacy}
        stop={orderPharmacy.status === "REJECTED"}
      />

      <OrderTrackingDetails order={order} orderPharmacy={orderPharmacy} />
    </View>
  );
};

export default OrderTracking;
