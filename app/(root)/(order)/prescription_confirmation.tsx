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
} from "react-native";
import useOrderStore from "@/store/orderStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PencilIcon,
} from "react-native-heroicons/outline";
import { Image } from "expo-image";
import { router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import tw from "twrnc";
import usePrescriptionStore from "@/store/prescriptionStore";

const PrescriptionConfirmation = () => {
  
  const navigation = useNavigation();
  const { prescriptions, popPrescriptions, currentPrescIndex } = usePrescriptionStore();

  const backAction = useCallback(() => {
    Alert.alert(
      "Hold on!",
      "Are you sure you want to go back and discard the order?",
      [
        { text: "Cancel", onPress: () => null, style: "cancel" },
        {
          text: "Discard",
          onPress: () => {
            popPrescriptions();
            router.back()
          },
        },
      ]
    );
    return true; // Prevent default back behavior
  }, [popPrescriptions, navigation]);

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
    <View className="flex-1 w-full bg-gray-100 p-4">
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
          <ArrowLeftIcon size={20} color="black" className="m-4"  strokeWidth={2}/>
        </Pressable>

        <Text className="text-xl ml-10 font-PoppinsMedium">Prescription</Text>
      </View>

      {prescriptions.length > 0 ? (
        <ScrollView
          contentContainerStyle={tw`flex-grow w-full items-center justify-between gap-10`}
        >
          <View className="w-full">
            <Image
              style={{
                width: "100%",
                height: 400,
                alignSelf: "center",
                backgroundColor: "#E5E7EB", // Tailwind's bg-gray-300
                borderRadius: 8, // Rounded-lg
              }}
              contentFit="contain"
              source={{ uri: prescriptions[currentPrescIndex] }}
            />

            <TouchableHighlight
              className="w-14 h-14 bg-black/30 rounded-full absolute bottom-5 right-4 items-center justify-center"
              // onPress={() => {
              //   router.navigate("/(root)/(order)/prescription_editing");
              // }}
            >
              <PencilIcon size={24} color="white" />
            </TouchableHighlight>
          </View>

          <View className="w-full absolute bottom-0">
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
              title="Continue"
              onPress={() => {
                router.navigate("/(root)/(order)/prescriptions_list");
              }}
            />
          </View>
        </ScrollView>
      ) : (
        <Text className="text-gray-500 text-lg">No prescriptions</Text>
      )}
    </View>
  );
};

export default PrescriptionConfirmation;
