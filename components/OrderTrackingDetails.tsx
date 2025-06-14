import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useRef } from "react";
import CourierCard from "./CourierCard";
import PharmacyCard from "./PharmacyCard";
import OrderSummary from "./OrderSummary";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import LottieView from "lottie-react-native";
import { lotties } from "@/constants";
import { Order , OrderPharmacy } from "@/hooks/usePharmacyData";

interface OrderTrackingDetailsProps {
  order: Order;
  orderPharmacy?: OrderPharmacy;
}

const OrderTrackingDetails: React.FC<OrderTrackingDetailsProps> = ({
  order,
  orderPharmacy,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const renderOrderHandlerCard = () => {
    switch (order.status) {
      case "SHIPPING":
        return <CourierCard orderId={order.id} />;
      default:
        return orderPharmacy ? (
          <PharmacyCard pharmacy={orderPharmacy.pharmacy} distance={orderPharmacy.distance} />
        ) : null;
    }
  };

  if (orderPharmacy?.status === "REJECTED") {
    return (
      <View className="flex flex-col gap-4 items-center justify-center p-6">
        <LottieView
          autoPlay
          loop={false}
          style={{
            width: 150,
            height: 150,
          }}
          source={lotties.rejected}
        />

        <View className="flex flex-col gap-4 items-center justify-center w-full">
          <Text className="text-red-500 font-PoppinsMedium text-center">
            Pharmacy Failed Validating Order
          </Text>

          <View className="bg-red-500/60 rounded-xl w-full p-3">
            <Text className="text-white font-PoppinsMedium text-center">
              {orderPharmacy.failureReason || "unknow reasons"}
            </Text>
          </View>
        </View>

        <View className="w-full flex flex-col gap-3 mt-10">
          <TouchableOpacity className="py-3 w-full rounded-full bg-neutral-300">
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
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={["40%"]}
      index={0}
      enablePanDownToClose={false}
      enableContentPanningGesture={false}
      enableDynamicSizing={false}
    >
      <BottomSheetScrollView className="w-full bg-white rounded-2xl">
        <View className="pt-1 px-5 pb-6">{renderOrderHandlerCard()}</View>

        <View className="w-full h-2 bg-gray-100 "></View>

        <OrderSummary order={order} pharmacy={orderPharmacy?.pharmacy} />

        <View className="w-full px-5 pb-5">
          <TouchableOpacity className="py-3 w-full rounded-full bg-red-500 flex items-center justify-center ">
            <Text className="text-white font-PoppinsMedium">Cancel Order</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default OrderTrackingDetails;
