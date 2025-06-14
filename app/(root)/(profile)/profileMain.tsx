import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import {
  ArchiveBoxIcon as OrdersOutline,
  ChevronRightIcon,
  MapPinIcon,
  CreditCardIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
  InformationCircleIcon,
} from "react-native-heroicons/outline";
import { useUserData } from "../../../context/UserContext";
import { ReactNode, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import Modal from 'react-native-modal';
import BackwardHeader from "@/components/BackwardHeader";
import Toggle from "react-native-toggle-input";
import React from "react";
import useModalStore from "@/store/modal";

type SettingItemProps = {
  icon: ReactNode;
  title: string;
  hasToggle?: boolean;
  isToggled?: boolean;
  titleClass?: string;
  TouchableClass?: string;
  onPress?: () => void;
  onToggleChange?: (value: boolean) => void;
};

export default function ProfileMain() {
  const { userData } = useUserData();
  const { open, setOpen } = useModalStore();
  
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isNotificationToggled, setIsNotificationToggled] = useState(false);

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("user");
      router.replace("/(auth)/signInPhoneNumber");
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setOpen(false)
  };

  function maskPhoneNumber(phoneNumber: string | null | undefined): string {
    if (!phoneNumber) {
      return "";
    }

    const firstPart = phoneNumber.substring(0, 4);
    const firstDigitAfterCode = phoneNumber.substring(4, 5);
    const lastTwoDigits = phoneNumber.substring(phoneNumber.length - 2);

    const starsCount = Math.max(0, phoneNumber.length - 4 - 1 - 2);
    const middlePart = "*".repeat(starsCount);

    return `${firstPart} ${firstDigitAfterCode}${middlePart}${lastTwoDigits}`;
  }

  return (
    <React.Fragment>
    <View className="flex-1 px-4 pt-2 gap-4 bg-white">
      <StatusBar
        animated
        backgroundColor="rgb(243 244 246)"
        barStyle="dark-content"
      />

      <BackwardHeader title="profile" backTo={()=>{router.navigate('/(root)/(tabs)/(home)/home')}} />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <TouchableOpacity
          className="bg-white flex flex-row items-center justify-between p-2 rounded-3xl border border-stone-100"
          onPress={() => {
            router.navigate("/(root)/(profile)/profileDetails");
          }}
        >
          <View className="flex flex-row items-center gap-3 p-2">
            <View className="w-16 h-16 rounded-full bg-green-500 flex justify-center items-center">
              <Text className="text-xl text-white font-PoppinsMedium uppercase ">
                {userData?.first_name &&
                  `${userData?.first_name.substring(
                    0,
                    1
                  )}${userData?.last_name.substring(0, 1)}`}
              </Text>
            </View>

            <View className="flex flex-col">
              <Text className="font-PoppinsSemiBold text-lg">
                {userData?.first_name} {userData?.last_name}
              </Text>
              <Text className="text-stone-300 font-PoppinsMedium">
                {maskPhoneNumber(userData?.phone_number)}
              </Text>
            </View>
          </View>

          <ChevronRightIcon strokeWidth={1.8} size={20} color="black" />
        </TouchableOpacity>

        <View className="bg-white rounded-3xl border border-stone-100 mt-4">
          <SettingItem
            icon={<OrdersOutline size={20} color="black" strokeWidth={1.5} />}
            title="My Orders"
            TouchableClass=" border-b border-stone-100"
          />

          <SettingItem
            icon={<MapPinIcon size={20} color="black" strokeWidth={1.5} />}
            title="Delivery Addresses"
            TouchableClass=" border-b border-stone-100"
            onPress={() =>
              router.navigate(
                {
                  pathname : "/(root)/(deliveryLocations)/List_of_delivery_locations",
                  params : {From : "Profile"}
                }
              )
            }
          />

          <SettingItem
            icon={<CreditCardIcon size={20} color="black" strokeWidth={1.5} />}
            title="Payment Methods"
            TouchableClass=" border-b border-stone-100"
          />

          <SettingItem
            icon={<GlobeAltIcon size={20} color="black" strokeWidth={1.5} />}
            title="Language"
            TouchableClass=" border-b border-stone-100"
          />

          <SettingItem
            icon={<ShieldCheckIcon size={20} color="black" strokeWidth={1.5} />}
            title="Privacy & Security"
            TouchableClass="border-b border-stone-100"
          />

          <SettingItem
            icon={<BellIcon size={20} color="black" strokeWidth={1.5} />}
            title="Push Notification"
            hasToggle={true}
            isToggled={isNotificationToggled}
            onToggleChange={setIsNotificationToggled}
          />
        </View>

        <TouchableOpacity
          className="flex flex-row items-center justify-between py-4 pl-4 bg-red-600/10 border rounded-full border-red-500 mt-4"
          onPress={() => {setIsModalVisible(true); setOpen(true)}}
        >
          <View className="flex-row items-center gap-2">
            <View className="w-6">
              <ArrowLeftOnRectangleIcon size={26} color="#ef4444" />
            </View>
            <Text className="font-PoppinsMedium text-lg ml-3 text-red-500">
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      
    </View>
    <Modal 
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        className="z-50 justify-center items-center p-3"
      >
        <View className="bg-white rounded-2xl p-6 w-full">
          <View className="items-center mb-4">
            <InformationCircleIcon size={60} color="#ef4444" />
          </View>

          <Text className="text-xl font-PoppinsSemiBold text-center mb-2">
            Logout?
          </Text>

          <Text className="text-gray-600 font-Poppins text-center mb-6">
            Are you sure you want to logout?
          </Text>

          <View className="flex flex-col gap-2">
            <TouchableOpacity
              className="py-3 bg-gray-100 rounded-lg items-center"
              onPress={closeModal}
            >
              <Text className="font-PoppinsMedium text-gray-800">
                No, Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="py-3 bg-red-500 rounded-lg items-center"
              onPress={handleLogout}
            >
              <Text className="font-PoppinsMedium text-white">Yes, Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </React.Fragment>
  );
}

interface ToggleProps {
  color?: string;
  size?: number;
  filled?: boolean;
  circleColor?: string;
  toggle: boolean;
  setToggle: (value: boolean) => void;
}

const TypedToggle = Toggle as React.FC<ToggleProps>;

function SettingItem({
  icon,
  title,
  hasToggle = false,
  isToggled = false,
  titleClass = "",
  TouchableClass = "",
  onPress,
  onToggleChange,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      className={`flex-row items-center justify-between pl-4 pr-2 py-5 ${TouchableClass}`}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={hasToggle}
    >
      <View className="flex-row items-center gap-2">
        <View className="w-6">{icon}</View>
        <Text className={`font-Poppins text-base ml-3 ${titleClass}`}>
          {title}
        </Text>
      </View>

      {hasToggle && onToggleChange ? (
        <View className="mr-2">
          <TypedToggle
          color="#22c55e"
          size={20}
          filled={true}
          circleColor="white"
          toggle={isToggled}
          setToggle={onToggleChange}
        />
        </View>
      ) : (
        <ChevronRightIcon size={17} color="#BEBEBE" strokeWidth={1.5} />
      )}
    </TouchableOpacity>
  );
}
