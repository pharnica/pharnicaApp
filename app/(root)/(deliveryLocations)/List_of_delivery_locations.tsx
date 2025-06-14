import {
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useUserData } from "../../../context/UserContext";
import CustomSelect from "@/components/CustomSelect";
import {
  ArrowLeftIcon,
  MapPinIcon,
  PlusIcon,
  TrashIcon,
} from "react-native-heroicons/outline";
import axios from "axios";
import Modal from 'react-native-modal';
import { images } from "@/constants";
import { Image } from "expo-image";
import tw from "twrnc";
import BackwardHeader from "@/components/BackwardHeader";
import { useFocusEffect } from "@react-navigation/native";

const DeliveryLocations = () => {

  const { From } = useLocalSearchParams();

  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const { userData, refetchUserData } = useUserData();
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );
  const [nestedSelectedLocationId, setNestedSelectedLocationId] = useState<
    string | null
  >(null);
  const [isSelectionChanged, setIsSelectionChanged] = useState(false);

  const handleSelectedAddress = useCallback(
    (locationId: string) => {
      setNestedSelectedLocationId(locationId);
      setIsSelectionChanged(locationId !== selectedLocationId);
    },
    [selectedLocationId]
  );

  const handlePressApply = async () => {
    if (!nestedSelectedLocationId) return;

    try {
      setIsLoading(true);
      const result = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_SIDE_API}/api/users/updateSelectedAddress`,
        {
          userId: userData?.user_id,
          locationId: nestedSelectedLocationId,
        }
      );

      if (result.status === 200) {
        await refetchUserData();
        setIsSuccessModalVisible(true);
        setSelectedLocationId(nestedSelectedLocationId);
        setIsSelectionChanged(false);
      }
    } catch (error) {
      console.error("Error updating address:", error);
      Alert.alert("Error", "Failed to update selected address");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.delivery_locations) {
      const selectedAddress = userData.delivery_locations.find(
        (location: any) => location.isSelected
      )?.id;

      setNestedSelectedLocationId(selectedAddress || null);
      setSelectedLocationId(selectedAddress || null);
    }
  }, [userData]);

  useEffect(() => {
    if (isSuccessModalVisible) {
      const timer = setTimeout(() => {
        setIsSuccessModalVisible(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isSuccessModalVisible]);

  const handleDeleteAddress = () => {
    if (!nestedSelectedLocationId) return;

    Alert.alert(
      "Hold on!",
      "This address will be deleted permanently, are you sure?",
      [
        { text: "Cancel", onPress: () => null, style: "cancel" },
        {
          text: "Delete",
          onPress: deleteAddress,
          style: "destructive",
        },
      ]
    );
  };

  const deleteAddress = async () => {
    if (!userData?.user_id || !nestedSelectedLocationId) return;

    try {
      setLocationsLoading(true);
      const result = await axios.delete(
        `${process.env.EXPO_PUBLIC_SERVER_SIDE_API}/api/users/deleteDeliveryLocation`,
        {
          data: {
            userId: userData.user_id,
            locationId: nestedSelectedLocationId,
          },
        }
      );

      if (result.status === 200) {
        await refetchUserData();
        // Reset selection if we deleted the currently selected address
        if (nestedSelectedLocationId === selectedLocationId) {
          setSelectedLocationId(null);
          setNestedSelectedLocationId(null);
        }
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      Alert.alert("Error", "Failed to delete address");
    } finally {
      setLocationsLoading(false);
    }
  };

  // const handleGoBack = useCallback(
  //   (from?: any) => {
  //     const hasSelectedAddress = userData?.delivery_locations?.some(
  //       (location: any) => location.isSelected
  //     );

  //     if (!hasSelectedAddress) {
  //       Alert.alert("Warning", "Please select an address location first");
  //       return true;
  //     }

  //     if (!from) {
  //       router.back();
  //       return false;
  //     }

  //     switch (from) {
  //       case "Home":
  //         router.replace("/(root)/(tabs)/(home)/home");
  //         break;
  //       case "Profile":
  //         router.replace("/(root)/(profile)/profileMain");
  //         break;
  //       case "Order":
  //         router.replace("/(root)/(order)/checkout");
  //         break;
  //       default:
  //         router.replace("/(root)/(tabs)/(home)/home");
  //     }
  //     return false;
  //   },
  //   [userData]
  // );

  // useFocusEffect(
  //   useCallback(() => {
  //     const backHandler = BackHandler.addEventListener(
  //       "hardwareBackPress",
  //       () => {
         
  //         return handleGoBack(From);
  //       }
  //     );
      
  //     return () => backHandler.remove();
  //   }, [handleGoBack, From])
  // );

  if (locationsLoading) {
    return (
      <View className="h-full w-full flex items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center bg-gray-100 pt-2 px-4">
      <StatusBar
        animated
        backgroundColor="rgb(243 244 246)"
        barStyle="dark-content"
      />

      <View className="w-full mb-6 flex flex-row items-center">

        <BackwardHeader title="Delivery Addresses" backTo={()=>{router.back()}} />

        
        {userData && userData?.delivery_locations?.length > 0 && (
          <Pressable
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center absolute right-0"
            onPress={handleDeleteAddress}
            disabled={!nestedSelectedLocationId}
          >
            <TrashIcon
              size={20}
              color={nestedSelectedLocationId ? "black" : "gray"}
            />
          </Pressable>
        )}
      </View>

      <ScrollView
        className="mb-20 pb-4"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {userData && userData?.delivery_locations?.length > 0 ? (
          <View className="w-full flex flex-col gap-8 mt-6 px-2">
            {[...userData.delivery_locations]
              .sort((a: any, b: any) => {
                return (
                  new Date(a.registration_date).getTime() -
                  new Date(b.registration_date).getTime()
                );
              })
              .map((location: any) => {
                return (
                  <CustomSelect
                    IconLeft={() => <MapPinIcon color="#22C55E" size={26} />}
                    key={location.id}
                    title={location.title}
                    iconAlignment="start"
                    color="#22C55E"
                    description={location.address}
                    isSelected={nestedSelectedLocationId === location.id}
                    onPress={() => handleSelectedAddress(location.id)}
                  />
                );
              })}
          </View>
        ) : (
          <View className="flex-1 justify-center">
            <Text className="text-center text-gray-500">
              No delivery locations added yet.
            </Text>
          </View>
        )}

        <View className="w-full mt-10 mb-4 px-4">
          <CustomButton
            IconLeft={() => (
              <PlusIcon color="#22C55E" size={16} strokeWidth={2.5} />
            )}
            title="Add new delivery address"
            className="bg-transparent border-2 border-dashed border-[#22C55E] mt-4 gap-2"
            textVariant="success"
            textStyle="text-base"
            onPress={() => {
              router.navigate("/(root)/(deliveryLocations)/Add_new_address");
            }}
          />
        </View>
      </ScrollView>

      {isSelectionChanged && (
        <View className="w-full absolute bottom-5 px-4">
          <CustomButton
            isLoading={isLoading}
            title="Apply"
            onPress={handlePressApply}
          />
        </View>
      )}

      {/* Success Modal */}
      <Modal
        isVisible={isSuccessModalVisible}
        className="p-3"
        onBackdropPress={() => setIsSuccessModalVisible(false)}
        backdropOpacity={0.7}
      >
        <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] justify-center">
          <Image
            source={images.check}
            style={tw`w-[110px] h-[110px] mx-auto`}
            contentFit="contain"
          />
          <Text className="text-base text-gray-400 font-Poppins text-center mt-6">
            Selected address updated successfully.
          </Text>
        </View>
      </Modal>
    </View>
  );
};

export default DeliveryLocations;
