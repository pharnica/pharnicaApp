import {
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Platform,
  TouchableHighlight,
  TouchableNativeFeedback,
} from "react-native";
import React, { ReactNode, useCallback, useRef, useState } from "react";
import BackwardHeader from "@/components/BackwardHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserData } from "../../../context/UserContext";
import {
  UserIcon,
  CalendarIcon,
  PhoneIcon,
  ChevronRightIcon,
} from "react-native-heroicons/outline";
import { Image } from "expo-image";
import { icons } from "@/constants";
import tw from "twrnc";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import InputField from "@/components/InputField";
import axios from "axios";
import CustomSelect from "@/components/CustomSelect";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { router } from "expo-router";

type InputDataProps = {
  label: string;
  icon?: ReactNode;
  data?: string | null;
  nonexist?: string;
  onPress?: () => void;
  leftIcon?: ReactNode;
};

function InputData({ label, data, icon, nonexist, onPress, leftIcon }: InputDataProps) {
  return (
    <TouchableOpacity className={`pl-4 pr-2 py-4 border rounded-xl ${
        !data && nonexist ? "border-red-500/30" : "border-gray-200"
      }`}
      onPress={onPress}
      activeOpacity={0.15}
      disabled={!onPress}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-row gap-6 items-center">
          {icon && <View className="w-6 items-center">{icon}</View>}
          <View className="flex-col ">
            <Text className="font-PoppinsSemiBold text-gray-500">{label}</Text>
            {data ? (
              <Text className="font-PoppinsMedium text-base mt-1">{data}</Text>
            ) : (
              <Text className="font-PoppinsMedium text-xs text-red-500 mt-1">
                {nonexist}
              </Text>
            )}
          </View>
        </View>
        {leftIcon}
      </View>
    </TouchableOpacity>
  );
}

type BottomSheetType = "name" | "gender" | null;

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ProfileDetails = () => {
  const { userData, refetchUserData } = useUserData();
  const [activeBottomSheet, setActiveBottomSheet] = useState<BottomSheetType>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const snapPoints = ["100%"];
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [formData, setFormData] = useState({
    firstName: userData?.first_name || "",
    lastName: userData?.last_name || "",
    gender: userData?.gender || "",
    birthDate: userData?.birth_date || "",
  });

  const [tempDate, setTempDate] = useState(
    userData?.birth_date ? new Date(userData.birth_date) : new Date()
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDateUpdating, setIsDateUpdating] = useState(false);

  const handleUpdateField = async (field: string, value: string) => {
    if (!value.trim() && field !== "birthDate") {
      Alert.alert("Error", `${field} cannot be empty`);
      return;
    }

    const updateState = field === "birthDate" ? setIsDateUpdating : setIsUpdating;
    updateState(true);
    
    try {
      let payload = {};
      
      if (field === "birthDate") {
        payload = { birth_date: value };
      } else {
        payload = {
          [field === "firstName" ? "first_name" : 
           field === "lastName" ? "last_name" : 
           "gender"]: value
        };
      }

      const response = await axios.patch(
        `${process.env.EXPO_PUBLIC_SERVER_SIDE_API}/api/users/updateUser/${userData?.user_id}`,
        payload
      );

      if (response.status === 200) {
        await refetchUserData();
        setActiveBottomSheet(null);
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", `Failed to update ${field}. Please try again.`);
    } finally {
      updateState(false);
    }
  };

  const handleCloseBottomSheet = () => {
    setActiveBottomSheet(null);
    setFormData({
      firstName: userData?.first_name || "",
      lastName: userData?.last_name || "",
      gender: userData?.gender || "",
      birthDate: userData?.birth_date || "",
    });
  };

  const handleDateConfirm = (selectedDate: Date) => {
    setShowDatePicker(false);
    const formattedDate = selectedDate.toISOString().split("T")[0];
    if (formattedDate === formData.birthDate) {
      return;
    }
    setTempDate(selectedDate);
    setFormData({ ...formData, birthDate: formattedDate });
    handleUpdateField("birthDate", formattedDate);
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
  };

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];

    
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar
        animated
        backgroundColor="rgb(243 244 246)"
        barStyle="dark-content"
      />

      <View className="px-4">
        <BackwardHeader
          title="Profile Information"
          backTo={()=>{router.back()}}
        />

        <View className="mt-5 gap-3">
          <InputData
            label="Name"
            data={`${userData?.first_name} ${userData?.last_name}`}
            icon={<UserIcon size={22} color="black" strokeWidth={1.5} />}
            nonexist="Full name required - Please complete your profile"
            onPress={() => setActiveBottomSheet("name")}
           
          />
          <InputData
            label="Birthday"
            data={formatDate(userData?.birth_date)}
            icon={<CalendarIcon size={22} color="black" strokeWidth={1.5} />}
            nonexist="Birthdate required - Please add yours"
            onPress={() => !isDateUpdating && setShowDatePicker(true)}
            leftIcon={
              isDateUpdating && (
                <ActivityIndicator size="small" color="#22C55E" />
              )
            }
          />
          <InputData
            label="Gender"
            icon={<Image source={icons.gender} style={tw`w-6 h-6`} />}
            data={userData?.gender}
            nonexist="Gender not specified - Please select yours"
            onPress={() => setActiveBottomSheet("gender")}
           
          />
          <InputData
            label="Phone"
            data={userData?.phone_number}
            icon={<PhoneIcon size={22} color="black" strokeWidth={1.5} />}
            nonexist="Phone number missing - Please add your contact number"
            leftIcon={<ChevronRightIcon size={17} color="#BEBEBE" strokeWidth={2} />}
          />
        </View>
      </View>

      {activeBottomSheet && (
        <Pressable
          className="absolute top-0 left-0 w-full h-full bg-black/50"
          onPress={handleCloseBottomSheet}
        />
      )}

      {activeBottomSheet && (
        <BottomSheet
          ref={bottomSheetRef}
          index={activeBottomSheet ? 0 : -1}
          snapPoints={snapPoints}
          enablePanDownToClose
          onClose={handleCloseBottomSheet}
        >
          <BottomSheetView className="bg-white p-5">
            {activeBottomSheet === "name" && (
              <View className="gap-3">
                <InputField
                  label="First Name"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChangeText={(text) => setFormData({...formData, firstName: text})}
                />
                <InputField
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChangeText={(text) => setFormData({...formData, lastName: text})}
                />

                <View className="flex-row justify-end gap-10 mt-4 mr-3">
                  <TouchableOpacity
                    onPress={handleCloseBottomSheet}
                    disabled={isUpdating}
                  >
                    <Text className="text-lg font-PoppinsMedium text-neutral-400">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleUpdateField("firstName", formData.firstName)}
                    disabled={isUpdating || !formData.firstName.trim() || !formData.lastName.trim()}
                  >
                    {isUpdating ? (
                      <ActivityIndicator color="#22C55E" />
                    ) : (
                      <Text className={`text-lg font-PoppinsMedium ${
                        !formData.firstName.trim() || !formData.lastName.trim() 
                          ? "text-gray-400" 
                          : "text-green-500"
                      }`}>
                        Save
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {activeBottomSheet === "gender" && (
              <View className="gap-3">
                <Text className="font-PoppinsSemiBold text-lg mb-2">Select Gender</Text>
                
                {genderOptions.map((option) => (
                  <CustomSelect
                    className={`py-4 pl-3 rounded-lg border ${
                      formData.gender === option.value ? " border-green-500" : "border-stone-100"
                    } `}
                    key={option.value}
                    title={option.label}
                    color="#22C55E"
                    isSelected={formData.gender === option.value}
                    onPress={() => setFormData({...formData, gender: option.value})}
                  />
                ))}

                <View className="flex-row justify-end gap-10 mt-4 mr-3">
                  <TouchableOpacity
                    onPress={handleCloseBottomSheet}
                    disabled={isUpdating}
                  >
                    <Text className="text-lg font-PoppinsMedium text-neutral-400">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleUpdateField("gender", formData.gender)}
                    disabled={isUpdating || !formData.gender}
                  >
                    {isUpdating ? (
                      <ActivityIndicator color="#22C55E" />
                    ) : (
                      <Text className={`text-lg font-PoppinsMedium ${
                        !formData.gender ? "text-gray-400" : "text-green-500"
                      }`}>
                        Save
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </BottomSheetView>
        </BottomSheet>
      )}

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        date={tempDate}
        onConfirm={handleDateConfirm}
        onCancel={handleDateCancel}
        maximumDate={new Date()}
        display="spinner"
      />
    </SafeAreaView>
  );
};

export default ProfileDetails;