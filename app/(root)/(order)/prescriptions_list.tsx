import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StatusBar,
  ScrollView,
  Alert,
  Pressable,
  BackHandler,
  TouchableHighlight,
  Touchable,
} from "react-native";
import useOrderStore from "@/store/orderStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PencilIcon,
  PlusCircleIcon,
} from "react-native-heroicons/outline";
import { Image } from "expo-image";
import { router } from "expo-router";
import useBottomSheetStore from "@/store/bottomSheet";
import CustomButton from "@/components/CustomButton";
import tw from "twrnc";

const PrescriptionList = () => {
  const { open, setOpen } = useBottomSheetStore();
  const navigation = useNavigation();
  const { prescriptions, popPrescriptions, currentPrescIndex } = useOrderStore();

  const backAction = useCallback(() => {
    Alert.alert(
      "Hold on!",
      "Are you sure you want to go back Home and discard the order?",
      [
        { text: "Cancel", onPress: () => null, style: "cancel" },
        {
          text: "Discard",
          onPress: () => {
            popPrescriptions();
            router.navigate("/(root)/(tabs)/(home)/home");
          },
        },
      ]
    );
    return true; // Prevent default back behavior
  }, [popPrescriptions, router]); // Include all dependencies

  // Focus-aware back handler
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => backHandler.remove();
    }, [backAction])
  );
  return (
    <SafeAreaView className="flex-1 w-full bg-gray-100 py-4 px-4">
      <StatusBar
        animated
        backgroundColor="rgb(243 244 246)"
        barStyle="dark-content"
      />

      <View className="w-full mb-6 flex flex-row items-center">
        <Pressable
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
          onPress={backAction}
        >
          <ArrowLeftIcon size={20} color="black" style={{ margin: 15 }} />
        </Pressable>

        <Text className="text-xl ml-10 font-PoppinsMedium">
          Prescriptions List
        </Text>
      </View>

      {prescriptions.length > 0 && (
        <View className="h-full">
          <ScrollView
            contentContainerStyle={tw`flex-row flex-wrap w-full px-3 pb-38 items-center justify-between gap-7`}
          >
            {prescriptions.map((presc, index) => {
              return (
                <View
                  key={index}
                  className="w-40 h-60 rounded-lg bg-gray-200 border border-neutral-300 "
                >
                  <Image
                    style={tw`w-full h-full self-center`}
                    contentFit="contain"
                    source={{ uri: presc }}
                  />
                </View>
              );
            })}

            <TouchableHighlight
              className="w-40 h-60 rounded-lg border-2 border-green-500 items-center justify-center gap-4"
              onPress={() => setOpen(true)}
              activeOpacity={0.9}
              underlayColor="rgba(0, 201, 81,0.15)"
            >
              <View className="flex flex-col items-center justify-center gap-6">
                <PlusCircleIcon size={46} color={"#22c55e"} />
                <View className="flex-col items-center">
                  <Text className="text-[14px] text-green-500 flex-col items-center font-PoppinsMedium">
                    Add Other
                  </Text>
                  <Text className="text-[14px] text-green-500 flex-col items-center font-PoppinsMedium">
                    Prescription
                  </Text>
                </View>
              </View>
            </TouchableHighlight>
          </ScrollView>
          <View className="w-full absolute bottom-16">
            <CustomButton
              IconRight={() => (
                <ArrowRightIcon
                  size={22}
                  color="white"
                  style={{
                    position: "absolute",
                    right: 20,
                  }}
                />
              )}
              title="Continue to checkout"
              onPress={() => {
                router.navigate("/(root)/(order)/checkout");
              }}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default PrescriptionList;
