import {
  View,
  Text,
  StatusBar,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackwardHeader from "@/components/BackwardHeader";
import { router } from "expo-router";
import CustomSelect from "@/components/CustomSelect";
import tw from "twrnc";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { ChevronDoubleRightIcon } from "react-native-heroicons/outline";
import { useUserData } from "@/context/UserContext";
import useOrderStore from "@/store/orderStore";
import axios, { AxiosError } from "axios";

const paymentMethod = () => {
  const { userData } = useUserData();

  const {
    prescriptions,
    deliveryAddress,
    doorDropOff,
    autoPharmacySelection,
    selectedPharmacies,
    priceRequesting,
    clearSelectedPharmacies,
  } = useOrderStore();

  const [paymentMethod, setPaymentMethod] = useState("CC");
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const END_POSITION = Dimensions.get("screen").width - 84;
  const onLeft = useSharedValue(true);
  const position = useSharedValue(0);

  const onSlideCompleted = async () => {
    try {
      setIsLoading(true);

      const order = {
        userId: userData?.user_id,
        prescriptionUrls: prescriptions,
        deliveryLocation: deliveryAddress,
        doorDropOff,
        autoPharmacySelection,
        selectedPharmacies,
        priceRequesting: priceRequesting,
      };

      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_SIDE_API}/api/orders/pushOrder`,
        {
          order,
          radiusKm: 5,
          limit: 5,
        }
      );

      if (res.status === 201) {

        clearSelectedPharmacies()
        setIsPaymentConfirmed(true);

        router.navigate({
          pathname: "/(root)/(order)/orderDetails",
          params: { orderId: res.data.newOrder.id },
        });
      }
    } catch (err) {
      const error = err as AxiosError;
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onUpdate((e) => {
      if (onLeft.value) {
        position.value = e.translationX;
      } else {
        position.value = END_POSITION + e.translationX;
      }
    })
    .onEnd((e) => {
      if (position.value > END_POSITION / 1.5) {
        position.value = withTiming(END_POSITION, { duration: 100 });
        onLeft.value = false;
        onSlideCompleted();
      } else {
        position.value = withTiming(0, { duration: 100 });
        onLeft.value = true;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  return (
    <SafeAreaView className="flex-1 bg-gray-100 py-3 px-4 items-center ">
      <StatusBar
        animated
        backgroundColor="rgb(243 244 246)"
        barStyle="dark-content"
      />

      <BackwardHeader
        title="Payment"
        backTo={() => {
          router.back();
        }}
      />

      <View className="flex flex-col justify-between gap-10 px-2">
        <View className="flex flex-col gap-3 mt-14">
          <Text className="font-PoppinsMedium">online Methods</Text>

          <CustomSelect
            title="Credit card"
            iconAlignment="center"
            isSelected={paymentMethod == "CC"}
            color="#22C55E"
            className={`bg-white pl-[6px] rounded-2xl h-16 ${
              paymentMethod == "CC" && "border border-green-500"
            }`}
            IconLeft={() => (
              <Image
                style={tw`h-12 w-12`}
                source={require("@/assets/icons/money (2).png")}
                accessibilityIgnoresInvertColors
              />
            )}
            TitleClass={
              paymentMethod == "CC" ? "text-green-500" : "text-neutral-400"
            }
            onPress={() => setPaymentMethod("CC")}
          />

          <CustomSelect
            title="Paypal"
            iconAlignment="center"
            isSelected={paymentMethod == "Paypal"}
            color="#22C55E"
            className={`bg-white rounded-2xl h-16 pl-5 ${
              paymentMethod == "Paypal" && "border border-green-500"
            }`}
            IconLeft={() => (
              <Image
                style={tw`h-6 w-6`}
                source={require("@/assets/icons/paypal.png")}
                accessibilityIgnoresInvertColors
              />
            )}
            TitleClass={
              paymentMethod == "Paypal" ? "text-green-500" : "text-neutral-400"
            }
            onPress={() => setPaymentMethod("Paypal")}
          />

          <CustomSelect
            title="Apple Pay"
            iconAlignment="center"
            isSelected={paymentMethod == "AP"}
            color="#22C55E"
            className={`bg-white rounded-2xl h-16 pl-5 ${
              paymentMethod == "AP" && "border border-green-500"
            }`}
            IconLeft={() => (
              <Image
                style={{
                  height: 28,
                  width: 28,
                  resizeMode: "contain",
                }}
                source={require("@/assets/icons/apple.png")}
              />
            )}
            TitleClass={
              paymentMethod == "AP" ? "text-green-500" : "text-neutral-400"
            }
            onPress={() => setPaymentMethod("AP")}
          />
        </View>

        <View className="flex flex-row items-center">
          <View className="border border-neutral-200 flex-1" />
          <Text className="text-lg text-neutral-400 mx-2">or</Text>
          <View className="border border-neutral-200 flex-1" />
        </View>

        <View className="flex flex-col gap-3">
          <Text className="font-PoppinsMedium">offline Methods</Text>

          <CustomSelect
            title="Cash on delivery"
            iconAlignment="center"
            isSelected={paymentMethod == "COD"}
            color="#22C55E"
            className={`bg-white pl-4 rounded-2xl h-16 ${
              paymentMethod == "COD" && "border border-green-500"
            }`}
            IconLeft={() => (
              <Image
                style={tw`h-7 w-7`}
                source={require("@/assets/icons/dollar.png")}
                accessibilityIgnoresInvertColors
              />
            )}
            TitleClass={
              paymentMethod == "COD" ? "text-green-500" : "text-neutral-400"
            }
            onPress={() => setPaymentMethod("COD")}
          />
        </View>
      </View>

      {/* Swipe to Confirm Payment */}
      <View className="h-16 w-full flex justify-center absolute bottom-5">
        <View
          style={tw`absolute w-full h-full bg-gray-200 rounded-full justify-center items-center bg-[#22C55E]`}
        >
          {isPaymentConfirmed ? (
            <Text className="font-PoppinsMedium text-sm text-white/40">
              Payment Confirmed!
            </Text>
          ) : (
            <Text className="font-PoppinsMedium text-sm text-white/40">
              Swipe right to confirm payment
            </Text>
          )}
        </View>

        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              tw`w-12 h-12 bg-white rounded-full flex items-center justify-center absolute left-1`,
              animatedStyle,
            ]}
          >
            {!isLoading ? (
              <ChevronDoubleRightIcon
                size={20}
                strokeWidth={2}
                color={"#22C55E"}
              />
            ) : (
              <ActivityIndicator color={"#22C55E"} />
            )}
          </Animated.View>
        </GestureDetector>
      </View>
    </SafeAreaView>
  );
};

export default paymentMethod;
