import {
  View,
  Text,
  ActivityIndicator,
  StatusBar,
  Image,
  TouchableHighlight,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import useOrderStore from "@/store/orderStore";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import BackwardHeader from "@/components/BackwardHeader";
import tw from "twrnc";
import OrderProcess from "@/components/OrderProcess";
import { ScrollView } from "react-native-gesture-handler";
import { ArchiveBoxIcon, MapPinIcon } from "react-native-heroicons/outline";
import { icons } from "@/constants";
import { useSocketContext } from "@/context/SocketContext";
import PriceView from "@/components/PriceView";

type Order = {
  id: string;
  status: string;
  address?: string;
  doorDropOff: boolean;
  autoPharmacySelection: boolean;
  type: "Prescription" | "Medical Products";
};

type OrderSummaryProps = {
  order: Order;
};

const OrderDetails = () => {
  const { socket, isConnected } = useSocketContext();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [showPriceView, setShowPriceView] = useState(false);
  const [price, setPrice] = useState(0);

  const { doorDropOff, autoPharmacySelection, deliveryAddress, status } =
    useOrderStore();

  const [order, setOrder] = useState<Order | null>({
    id: orderId,
    status: status,
    address: deliveryAddress?.address,
    doorDropOff,
    autoPharmacySelection,
    type: "Prescription",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLiveTrackingPress = () => {
    router.navigate("/(root)/(order)/orderLiveTracking");
  };

  const handedPriceSubmited = async (res : any) => {

       
    setShowPriceView(true);
    setPrice(parseFloat(res.price));

  };

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("priceSubmited", handedPriceSubmited);

    return () => {
      socket.off("priceSubmited", handedPriceSubmited);
    };
  }, [socket, isConnected]);

  const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
    return (
      <View className="bg-white rounded-2xl">
        <View className="p-5 flex flex-row items-base gap-4 border-b border-b-neutral-200">
          <MapPinIcon color={"black"} size={32} strokeWidth={1.1} />
          <View className="flex flex-col items-start flex-shrink">
            <Text className="font-PoppinsSemiBold">Delivery Address</Text>
            <Text
              numberOfLines={1}
              className="text-sm font-Poppins text-gray-400 truncate"
            >
              {order.address || "No address provided"}
            </Text>
          </View>
        </View>

        <View className="p-5 flex flex-row items-base gap-4 border-b border-b-neutral-200">
          <Image
            style={[tw`h-8 w-8`, { resizeMode: "contain" }]}
            source={icons.doorBlack}
          />

          <View className="flex flex-col items-start">
            <Text className="font-PoppinsSemiBold">Delivery Instructions</Text>
            <Text
              numberOfLines={1}
              className="text-sm font-Poppins text-gray-400 truncate"
            >
              {order.doorDropOff ? "Deliver to door" : "Meet outside"}
            </Text>
          </View>
        </View>

        <View className="p-5 flex flex-row items-base gap-4 border-b border-b-neutral-200">
          <Image
            style={[tw`h-7 w-7 ml-1`, { resizeMode: "contain" }]}
            source={icons.hospital}
          />

          <View className="flex flex-col items-start">
            <Text className="font-PoppinsSemiBold">Pharmacy Selection</Text>
            <Text
              numberOfLines={1}
              className="text-sm font-Poppins text-gray-400 truncate"
            >
              {order.autoPharmacySelection
                ? "Automatic selection"
                : "Manual selection"}
            </Text>
          </View>
        </View>

        <View className="p-5 flex flex-row items-base gap-4">
          <ArchiveBoxIcon
            color={"black"}
            size={30}
            strokeWidth={1}
            style={tw`ml-1`}
          />

          <View className="flex flex-col items-start">
            <Text className="font-PoppinsSemiBold">Order Type</Text>
            <Text
              numberOfLines={1}
              className="text-sm font-Poppins text-gray-400 truncate"
            >
              {order.type}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 py-3 px-4">
      <StatusBar
        animated
        backgroundColor="rgb(243 244 246)"
        barStyle="dark-content"
      />

      <BackwardHeader
        title="Track Your Order"
        backTo={() => {
          router.back();
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={tw`mt-5`}>
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#0000ff" />
            <Text className="mt-4 font-PoppinsMedium">
              Loading order details...
            </Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center">
            <Text className="font-PoppinsMedium text-red-500">{error}</Text>
          </View>
        ) : order ? (
          <View className="flex flex-col gap-4">
            <View className="w-full rounded-xl p-5 bg-white flex flex-row flex-shrink">
              <Text className="font-PoppinsSemiBold">Order ID : </Text>
              <Text
                className="font-Poppins text-gray-400 flex-shrink truncate"
                numberOfLines={1}
              >
                {order.id}
              </Text>
            </View>

            {showPriceView && <PriceView price={price} orderId={orderId} setShowPriceView={setShowPriceView}/>}

            <OrderProcess orderId={order.id} forMap={false} />

            <OrderSummary order={order} />

            <TouchableHighlight
              onPress={handleLiveTrackingPress}
              className="py-4 rounded-full flex-row items-center justify-center bg-green-500 mb-5"
              underlayColor="#126b33"
            >
              <Text className="font-PoppinsSemiBold text-white pt-1">
                View Live Tracking
              </Text>
            </TouchableHighlight>
          </View>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="font-PoppinsMedium text-red-500">
              Unable to load order details. Please try again later.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetails;
