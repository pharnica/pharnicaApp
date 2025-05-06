import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Text,
  View,
  StatusBar,
  Alert,
  Pressable,
  BackHandler,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import useOrderStore from "@/store/orderStore";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  PlusIcon,
  TrashIcon,
} from "react-native-heroicons/outline";
import { router } from "expo-router";
import { useUserData } from "../../../context/UserContext";
import axios from "axios";
import tw from "twrnc";
import { icons, images } from "@/constants";
import CustomSelect from "@/components/CustomSelect";
import { ScrollView } from "react-native-gesture-handler";
import CustomButton from "@/components/CustomButton";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import useBottomSheetStore from "@/store/bottomSheet";
import BackwardHeader from "@/components/BackwardHeader";
import ReactNativeModal from "react-native-modal";

type PharmacySelection = "auto" | "specific";
type DropoffOption = "door" | "outside";

interface UserPersonalInfo {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  birthdate?: string | null;
  gender?: string | null;
}

const Checkout = () => {
  const { open, setOpen } = useBottomSheetStore();
  const [loading, setLoading] = useState(false);
  const {
    prescriptions,
    doorDropOff,
    autoPharmacySelection,
    selectedPharmacies,
    priceRequesting,
    setDeliveryAddress,
    setAutoPharmacySelection,
    removeSelectedPharmacy,
    setDoorDropOff,
    resetOrder,
    popPrescriptions,
    setPriceRequesting,
  } = useOrderStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mapImage, setMapImage] = useState<string>("");
  const [
    isPresonalDetailsBottomSheetOpen,
    setIsPresonalDetailsBottomSheetOpen,
  ] = useState(false);
  const [staticMapImageLoading, setStaticMapImageLoading] = useState(false);

  const snapPoints = useMemo(() => ["31%"], []);
  const { userData } = useUserData();

  const selectedAddress = userData?.delivery_locations?.find(
    (location) => location.isSelected === true
  );


  const geoapify_api = "950652c4eafa4bd9b45f3dfe9c5e3f2e";

  const backAction = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate("/(root)/(order)/prescriptions_list");
    }
    return true;
  }, []);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => backHandler.remove();
    }, [backAction])
  );

  useEffect(() => {
    const fetchStaticMapImage = async () => {
      try {
        if (
          !selectedAddress?.locationLatitude ||
          !selectedAddress?.locationLongitude
        ) {
          return;
        }

        setStaticMapImageLoading(true);
        const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-grey&width=600&height=400&center=lonlat:${selectedAddress.locationLongitude},${selectedAddress.locationLatitude}&zoom=16&marker=lonlat:${selectedAddress.locationLongitude},${selectedAddress.locationLatitude};type:material;color:%2322c55e;size:xx-large&apiKey=${geoapify_api}`;
        setMapImage(mapUrl);
      } catch (error) {
        console.error("Failed to load map image:", error);
        Alert.alert("Error", "Failed to load map image. Please try again.");
      } finally {
        setStaticMapImageLoading(false);
      }
    };

    fetchStaticMapImage();
  }, [selectedAddress]);

  const renderBottomSheetPersonalInfoTouchable = useCallback(() => {
    const userPersonalInfo: UserPersonalInfo = {
      firstName: userData?.first_name,
      lastName: userData?.last_name,
      phone: userData?.phone_number,
      birthdate: userData?.birth_date,
      gender: userData?.gender,
    };

    const missingCount = Object.values(userPersonalInfo).filter(
      (value) => value === null || value === undefined || value === ""
    ).length;

    return (
      <TouchableOpacity
        className="flex flex-row items-center justify-between py-3 px-4 border border-stone-100 rounded-xl"
        onPress={() => router.navigate("/(root)/(profile)/profileDetails")}
        accessibilityLabel="Personal details"
        accessibilityHint="Navigate to profile details screen"
      >
        <View className="flex flex-row items-center justify-center gap-5">
          <Image
            source={icons.idCard}
            style={tw`w-8 h-8`}
            accessibilityIgnoresInvertColors
          />

          <View className="flex flex-col items-start justify-center">
            <View className="flex flex-row items-center gap-3">
              <Text className="font-PoppinsMedium">Personal Details</Text>
              {missingCount > 0 && (
                <View className="flex flex-row items-center gap-1">
                  <InformationCircleIcon size={16} color={"red"} />
                  <Text className="font-Poppins text-red-500">
                    {missingCount} {missingCount === 1 ? "piece" : "pieces"} of
                    personal data missing
                  </Text>
                </View>
              )}
            </View>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="flex-shrink truncate font-Poppins text-neutral-300"
            >
              {`${userPersonalInfo.firstName || ""} ${
                userPersonalInfo.lastName || ""
              }${
                userPersonalInfo.phone ? ` ,  ${userPersonalInfo.phone}` : ""
              }`}
            </Text>
          </View>
        </View>
        <ChevronRightIcon size={17} color="#BEBEBE" strokeWidth={2} />
      </TouchableOpacity>
    );
  }, [userData]);

  const renderBottomSheetDeliveryAddressTouchable = useCallback(() => {
    return (
      <TouchableOpacity
        className="flex flex-row items-center justify-between py-3 px-4 border border-stone-100 rounded-2xl"
        onPress={() =>
          router.navigate({
            pathname: "/(root)/(deliveryLocations)/List_of_delivery_locations",
            params: { From: "Order" },
          })
        }
        accessibilityLabel="Delivery addresses"
        accessibilityHint="Navigate to delivery locations screen"
      >
        <View className="flex flex-row items-center justify-center gap-5 flex-shrink">
          <Image
            source={icons.locationMap}
            style={tw`w-8 h-8`}
            accessibilityIgnoresInvertColors
          />

          <View className="flex flex-col items-start justify-center flex-shrink">
            <Text className="font-PoppinsMedium">Delivery Addresses</Text>

            {selectedAddress?.address ? (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="font-Poppins text-neutral-300"
              >
                {selectedAddress.address}
              </Text>
            ) : (
              <Text className="font-Poppins text-red-500">
                Delivery address location is missing
              </Text>
            )}
          </View>
        </View>
        <ChevronRightIcon size={17} color="#BEBEBE" strokeWidth={2} />
      </TouchableOpacity>
    );
  }, [selectedAddress]);

  const handleContinuePress = async () => {
    if (!selectedAddress) {
      return alert("Please select a delivery address");
    }
    setIsModalVisible(true);
  };

  const handlePriceConfirmation = async () => {
    if (!selectedAddress) {
      return alert("Please select a delivery address");
    } else {
      const selectedAddress : any = userData?.delivery_locations?.find(
        (location) => location.isSelected === true
      );
      setDeliveryAddress(selectedAddress);
    }

    setIsModalVisible(false);

    setTimeout(() => {
      router.navigate("/(root)/(order)/paymentMethod");
    }, 100);

  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Your Order?",
      "This will remove all items and prescriptions. Are you sure you want to cancel?",
      [
        { text: "Cancel", onPress: () => null, style: "cancel" },
        {
          text: "Discard",
          onPress: () => {
            resetOrder();
            popPrescriptions();
            router.navigate("/(root)/(tabs)/(home)/home");
          },
        },
      ]
    );
  };

  const handlePharmacyDeletion = (pharmacyId: any) => {
    Alert.alert(
      "Remove This Pharmacy?",
      "This pharmacy will no longer receive your order.",
      [
        { text: "No", onPress: () => null, style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            removeSelectedPharmacy(pharmacyId);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 py-4 px-4 relative">
      <StatusBar
        animated
        backgroundColor="rgb(243 244 246)"
        barStyle="dark-content"
      />

      <View className="w-full mb-3 flex flex-row items-center">
        <BackwardHeader
          title="Checkout"
          backTo={() => {
            router.back();
          }}
        />
        <TouchableOpacity
          className="h-10 flex items-center justify-center bg-white rounded-full px-4"
          onPress={handleCancel}
        >
          <Text className="font-PoppinsMedium">cancel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={tw`rounded-lg`}>
        <View className="flex flex-col gap-4 rounded-xl ">
          {/* ##userDetails */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center gap-2 bg-white p-2 rounded-xl border border-neutral-100"
            onPress={() => setIsPresonalDetailsBottomSheetOpen(true)}
            accessibilityLabel="Delivery information"
            accessibilityHint="Open delivery details"
          >
            <View className="w-24 h-24 rounded-lg border border-neutral-200 overflow-hidden mr-3">
              {staticMapImageLoading ? (
                <View className="w-full h-full justify-center items-center bg-gray-200">
                  <ActivityIndicator size="large" color="#000" />
                </View>
              ) : mapImage ? (
                <Image
                  source={{ uri: mapImage }}
                  style={tw`w-full h-full`}
                  resizeMode="cover"
                  accessibilityIgnoresInvertColors
                />
              ) : (
                <View className="w-full h-full justify-center items-center bg-gray-200">
                  <Text className="font-Poppins text-sm text-gray-500">
                    No map available
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-1 flex-col items-start gap-1">
              <Text
                className="font-PoppinsMedium text-lg"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {`${userData?.first_name || ""} ${userData?.last_name || ""}`}
              </Text>

              {selectedAddress?.address ? (
                <Text
                  className="font-Poppins text-neutral-300 text-base"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {selectedAddress.address}
                </Text>
              ) : (
                <Text
                  className="font-Poppins text-red-500 text-base"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Please select a delivery address
                </Text>
              )}

              {userData?.phone_number ? (
                <Text
                  className="font-Poppins text-neutral-300 text-base"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {userData.phone_number}
                </Text>
              ) : (
                <Text
                  className="font-Poppins text-red-500 text-base"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Please enter a phone number
                </Text>
              )}
            </View>

            <ChevronRightIcon
              size={17}
              strokeWidth={1.8}
              color={"black"}
              opacity={0.2}
            />
          </TouchableOpacity>

          {/* Pharmacy Selection */}
          <View className="flex-col items-start gap-6 bg-white p-4 rounded-xl border border-neutral-100">
            <View className="flex-col items-start gap-1">
              <Text className="font-PoppinsMedium text-sm">
                Pharmacy Selection
              </Text>
              <Text className="font-Poppins text-xs text-gray-400/70">
                Choose whether the app should select the closest pharmacies or
                you choose which pharmacy you want
              </Text>
            </View>

            <View className="flex-col items-start gap-3">
              <CustomSelect
                title="auto Selection (Recommended)"
                iconAlignment="center"
                color="#22C55E"
                isSelected={autoPharmacySelection}
                TitleClass={`text-sm ${
                  autoPharmacySelection ? "text-green-500" : "text-neutral-300"
                }`}
                className={`p-[13px] rounded-lg border ${
                  autoPharmacySelection
                    ? "bg-green-500/20 border-green-500"
                    : "border-neutral-200"
                }`}
                IconLeft={() => (
                  <Image
                    style={tw`h-5 w-5`}
                    source={
                      autoPharmacySelection
                        ? icons.magicStickActive
                        : icons.magicStick
                    }
                    accessibilityIgnoresInvertColors
                  />
                )}
                onPress={() => setAutoPharmacySelection(true)}
                accessibilityLabel="Auto select pharmacy"
              />

              <CustomSelect
                title="Choose Specific"
                iconAlignment="center"
                color="#22C55E"
                isSelected={!autoPharmacySelection}
                TitleClass={`text-sm ${
                  !autoPharmacySelection ? "text-green-500" : "text-neutral-300"
                }`}
                className={`p-[13px] rounded-lg border ${
                  !autoPharmacySelection
                    ? "bg-green-500/20 border-green-500"
                    : "border-neutral-200"
                }`}
                IconLeft={() => (
                  <Image
                    style={tw`h-5 w-5`}
                    source={
                      !autoPharmacySelection
                        ? icons.crossHairActive
                        : icons.crossHair
                    }
                    accessibilityIgnoresInvertColors
                  />
                )}
                onPress={() => setAutoPharmacySelection(false)}
                accessibilityLabel="Select specific pharmacy"
              />
            </View>
          </View>

          {!autoPharmacySelection && (
            <View className="flex-col items-start gap-6 bg-white p-4 rounded-xl border border-neutral-100">
              <View className="flex-col items-start gap-1">
                <Text className="font-PoppinsMedium text-sm">Pharmacy</Text>
                <Text className="font-Poppins text-xs text-gray-400/70">
                  Select up to 5 pharmacies from you choose that we will send
                  order to
                </Text>
              </View>

              <View className="flex-col items-start gap-4 w-full px-3 py-2">
                {selectedPharmacies.length > 0 ? (
                  <View className="flex-col items-start gap-7 w-full">
                    {selectedPharmacies.map((pharmacy, index) => (
                      <View
                        className="w-full flex-row justify-between items-center"
                        key={index}
                      >
                        <View
                          key={pharmacy.id}
                          className="flex-row items-center justify-start gap-4"
                        >
                          <Image
                            source={icons.SelectedPharmacy}
                            style={tw`w-6 h-6`}
                          />
                          <View className="flex-col ">
                            <Text className="font-PoppinsMedium text-sm">
                              {pharmacy.name}
                            </Text>
                            <Text className="font-Poppins text-xs text-gray-400/70">
                              {pharmacy.address}
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          onPress={() => {
                            handlePharmacyDeletion(pharmacy.id);
                          }}
                        >
                          <TrashIcon
                            size={20}
                            color="black"
                            opacity={0.2}
                            className=""
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : null}

                <TouchableOpacity
                  className="mt-2 py-4 px-2 rounded-full w-full flex-row gap-4 items-center justify-start"
                  onPress={() =>
                    router.navigate("/(root)/(order)/specificPharmacySelection")
                  }
                  accessibilityLabel="Add pharmacy"
                  accessibilityRole="button"
                >
                  <PlusIcon color="#22C55E" size={14} strokeWidth={2.5} />

                  <Text className="font-PoppinsMedium text-sm text-green-500">
                    Select specific pharmacy
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Dropoff Options */}
          <View className="flex-col items-start gap-6 bg-white p-4 rounded-xl border border-neutral-100">
            <View className="flex-col items-start gap-1">
              <Text className="font-PoppinsMedium text-sm">
                Dropoff Options
              </Text>
              <Text className="font-Poppins text-xs text-gray-400/70">
                Choose whether the courier meets you at your home door or
                outside
              </Text>
            </View>

            <View className="flex-col items-start gap-3">
              <CustomSelect
                title="Meet at my door"
                iconAlignment="center"
                color="#22C55E"
                isSelected={doorDropOff}
                TitleClass={`text-sm ${
                  doorDropOff ? "text-green-500" : "text-neutral-300"
                }`}
                className={`p-[13px] rounded-lg border ${
                  doorDropOff
                    ? "bg-green-500/20 border-green-500"
                    : "border-neutral-200"
                }`}
                IconLeft={() => (
                  <Image
                    style={tw`h-5 w-5`}
                    source={doorDropOff ? icons.doorActive : icons.door}
                    accessibilityIgnoresInvertColors
                  />
                )}
                onPress={() => setDoorDropOff(true)}
                accessibilityLabel="Meet at door delivery option"
              />

              <CustomSelect
                title="Meet Outside (Faster)"
                iconAlignment="center"
                color="#22C55E"
                isSelected={!doorDropOff}
                TitleClass={`text-sm ${
                  !doorDropOff ? "text-green-500" : "text-neutral-300"
                }`}
                className={`p-[13px] rounded-lg border ${
                  !doorDropOff
                    ? "bg-green-500/20 border-green-500"
                    : "border-neutral-200"
                }`}
                IconLeft={() => (
                  <Image
                    style={tw`h-5 w-5`}
                    source={
                      !doorDropOff ? icons.buildingActive : icons.building
                    }
                    accessibilityIgnoresInvertColors
                  />
                )}
                onPress={() => setDoorDropOff(false)}
                accessibilityLabel="Meet outside delivery option"
              />
            </View>
          </View>

          {/* Prescriptions */}
          <View className="flex-col items-start gap-6 bg-white p-4 rounded-xl border border-neutral-100">
            <View className="flex-col items-start gap-1">
              <Text className="font-PoppinsMedium text-sm">Prescription</Text>
              <Text className="font-Poppins text-xs text-gray-400/70">
                This is the list of the prescriptions you have selected
              </Text>
            </View>

            <View className="flex-col items-start gap-6 w-full px-2">
              {prescriptions.length > 0 ? (
                prescriptions.map((presc, index) => (
                  <View
                    key={`prescription-${index}`}
                    className="w-full h-60 rounded-lg bg-gray-200 border border-neutral-300 overflow-hidden"
                  >
                    <Image
                      source={{ uri: presc }}
                      style={tw`w-full h-full self-center`}
                      resizeMode="contain"
                      accessibilityLabel={`Prescription ${index + 1}`}
                      accessibilityIgnoresInvertColors
                    />
                  </View>
                ))
              ) : (
                <Text className="font-Poppins text-red-500">
                  No prescriptions added
                </Text>
              )}

              <TouchableOpacity
                className="mt-2 p-4 rounded-full border border-dashed border-green-500 w-full flex flex-row gap-2 items-center justify-center"
                onPress={() => setOpen(true)}
                accessibilityLabel="Add prescription"
                accessibilityRole="button"
              >
                <PlusIcon color={"#22C55E"} size={14} strokeWidth={2.5} />
                <Text className="font-PoppinsMedium text-sm text-green-500">
                  Add Prescription
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Continue Button */}
          <CustomButton
            IconRight={() => (
              <ArrowRightIcon
                size={22}
                color="white"
                style={tw`absolute right-5`}
              />
            )}
            title="Continue to payment"
            disabled={
              !selectedAddress?.address ||
              !userData?.phone_number ||
              prescriptions.length === 0
            }
            accessibilityLabel="Continue to payment"
            onPress={handleContinuePress}
          />
        </View>
      </ScrollView>

      {/* Bottom Sheet Backdrop */}
      {isPresonalDetailsBottomSheetOpen && (
        <Pressable
          className="absolute top-0 left-0 w-[120%] h-full bg-black/50"
          onPress={() => setIsPresonalDetailsBottomSheetOpen(false)}
          accessibilityLabel="Close bottom sheet"
          accessibilityRole="button"
        />
      )}

      {isPresonalDetailsBottomSheetOpen && (
        <BottomSheet
          snapPoints={snapPoints}
          index={isPresonalDetailsBottomSheetOpen ? 0 : -1}
          onClose={() => setIsPresonalDetailsBottomSheetOpen(false)}
          enablePanDownToClose
        >
          <BottomSheetView className="bg-white p-5">
            <View className="flex flex-col gap-4">
              {renderBottomSheetPersonalInfoTouchable()}
              {renderBottomSheetDeliveryAddressTouchable()}
            </View>
          </BottomSheetView>
        </BottomSheet>
      )}

      <ReactNativeModal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        className="p-3"
      >
        <View className="bg-white px-7 pb-6 rounded-2xl min-h-[300px]">
          <Image
            source={images.priceConfirmation}
            style={tw`w-[180px] h-[180px] mx-auto my-5`}
          />
          <View className="flex flex-col justify-center items-center gap-2">
            <Text className="font-PoppinsSemiBold text-lg">
              Price Confirmation
            </Text>
            <Text className="font-Poppins text-sm text-center text-neutral-300">
              We'll have the pharmacy check your prescription and provide the
              total cost.
            </Text>
          </View>

          <View className="flex flex-col justify-center items-center gap-3 mt-6">
            <TouchableOpacity
              className="w-full py-3 rounded-full bg-neutral-300 flex justify-center items-center"
              onPress={() => {
                setPriceRequesting(false);
                handlePriceConfirmation();
              }}
            >
              {loading && !priceRequesting ? (
                <View>
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              ) : (
                <Text className="font-PoppinsMedium text-base text-white">
                  Maybe later
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full py-3 rounded-full bg-[#22C55E] flex justify-center items-center"
              onPress={() => {
                setPriceRequesting(true);
                handlePriceConfirmation();
              }}
            >
              {loading && priceRequesting ? (
                <View>
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              ) : (
                <Text className="font-PoppinsMedium text-base text-white">
                  yes, request price
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ReactNativeModal>
    </SafeAreaView>
  );
};

export default Checkout;
