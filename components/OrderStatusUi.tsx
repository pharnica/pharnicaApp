import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import StatusBar from "./StatusBar";
import LottieView from "lottie-react-native";
import { lotties } from "@/constants";
import PriceView from "./PriceView";
import { Order, OrderPharmacy } from "@/hooks/usePharmacyData";

const OrderStatusUi = ({
  order,
  orderPharmacy,
  stop,
}: {
  order: Order;
  orderPharmacy: OrderPharmacy;
  stop: boolean;
}) => {

  const [animatedText, setAnimatedText] = useState("...");
  const status = order.status

  const statusList = [
    {
      title: "Validating Order",
      description:
        "Your order is being verified for availability and payment confirmation",
      status: "VALIDATING",
      lottie: lotties.validating,
    },
    {
      title: "Calculating Price",
      description:
        "Final pricing including taxes and discounts is being calculated",
      status: "PRICE_CALCULATING",
      lottie: lotties.calculating,
    },
    {
      title: "Packaging Items",
      description: "Your items are being carefully packed for shipment",
      status: "PACKAGING",
      lottie: lotties.packaging,
    },
    {
      title: "Shipping Process",
      description: "Your package has been handed over to the delivery partner",
      status: "SHIPPING",
      lottie: lotties.shipping,
    },
    {
      title: "Delivered",
      description: "Your order has been successfully delivered",
      status: "DELIVERED",
      lottie: null,
    },
    {
      title: "Order Cancelled",
      description: "This order has been cancelled as per your request",
      status: "CANCELLED",
      lottie: null,
    },
  ];

  const filteredStatusList = order.priceRequesting
    ? statusList
    : statusList.filter((item) => item.status !== "PRICE_CALACULATING");

  const currentStatusIndex = filteredStatusList.findIndex(
    (item) => item.status === status
  );
  const currentStatus =
    filteredStatusList[currentStatusIndex] || filteredStatusList[0];

  useEffect(() => {
    if (status === "CANCELLED" || status === "DELIVERED") {
      return;
    }

    const interval = setInterval(() => {
      setAnimatedText((prev) => {
        if (prev.length >= 3) return ".";
        return prev + ".";
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  return (
    <View className="flex flex-col gap-6">
      <View className="flex flex-col items-start gap-1">
        <Text className="text-2xl font-PoppinsSemiBold">
          {currentStatus.title}{" "}
          {currentStatus.status !== "DELIVERED" &&
          currentStatus.status !== "CANCELLED"
            ? animatedText
            : ""}
        </Text>
        <Text className="text-xs font-Poppins text-neutral-400">
          {currentStatus.description}
        </Text>
      </View>

      <View className="flex flex-col items-center justify-center gap-8">
        <StatusBar
          statusList={filteredStatusList.filter(
            (item) => item.status !== "CANCELLED"
          )}
          currentStatusIndex={currentStatusIndex}
          status={status}
          stop={stop}
        />

        {orderPharmacy.price && orderPharmacy.priceStatus === "PENDING" ? (
          <PriceView  price={orderPharmacy.price} orderPharmacyId={orderPharmacy.id} />
        ) : (
          currentStatus.lottie &&
          !stop && (
            <LottieView
              autoPlay
              loop={true}
              style={{
                width: 250,
                height: 250,
              }}
              source={currentStatus.lottie}
            />
          )
        )}
      </View>
    </View>
  );
};

export default OrderStatusUi;
