import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Modal } from "react-native-modal";
import { XMarkIcon } from "react-native-heroicons/outline";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { images } from "@/constants";
import axios from "axios";
import PhoneNumberInputField from "@/components/PhoneNumberInputField";
import VerificationCodeInput from "@/components/VerificationCodeInput";
import * as SecureStore from "expo-secure-store";


const SignIn = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState(null);

  const {refetchUserData} = useUserData()

  const [form, setForm] = useState({
    phoneNumber: "",
  });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  // Validate Moroccan phone number
  const validatePhoneNumber = (number: string) => {
    const regex = /^(06|07|05)\d{8}$/;
    return regex.test(number);
  };

  // Format Moroccan phone number to international format
  const formatPhoneNumber = (number: string) => {
    return `+212${number.slice(1)}`;
  };

  // Send verification code
  const sendVerificationCode = async (phoneNumber: string) => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_SIDE_API}/api/users/send-verification-code`,
        { phoneNumber, action: "signin" }
      );

      
      if (response.data.success) {

        setUserData(response.data.userId);
        return true;
      } 

      if(response.data.error == 'phone not exist'){
        Alert.alert("Error", "this phone number not exists. please sign up first");
      }

    } catch (error) {
      console.log("Error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      return false;
    }
  };

  // Verify code
  const verifyCode = async (phoneNumber: string, code: string) => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_SIDE_API}/api/users/verify-code`,
        { phoneNumber, code }
      );

      if (response.data.success) {
        return true;
      } else {
        console.error("Error:", response.data.error);
        Alert.alert("Error", "Invalid verification code. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      return false;
    }
  };

  const onSignInPress = async () => {
    setIsLoading(true);

    // Validate the phone number
    if (!validatePhoneNumber(form.phoneNumber)) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid Moroccan phone number (e.g., 06XX XXX XXX)."
      );
      setIsLoading(false);
      return;
    }

    // Format the phone number
    const formattedPhoneNumber = formatPhoneNumber(form.phoneNumber);

    // Send verification code
    const isCodeSent = await sendVerificationCode(formattedPhoneNumber);

    if (isCodeSent) {
      setVerification({
        ...verification,
        state: "pending",
      });
    }

    setIsLoading(false);
  };

  const onPressVerify = async () => {
    
    setIsLoading(true);
    const formattedPhoneNumber = formatPhoneNumber(form.phoneNumber);

    const isVerified = await verifyCode(
      formattedPhoneNumber,
      verification.code
    );

    if (isVerified && userData != null) {
      
      await SecureStore.setItemAsync("user", JSON.stringify(userData));
      refetchUserData()

      setVerification({ ...verification, state: "default" });
      router.navigate("/(root)/(tabs)/(home)/home");

    } else {
      setVerification({
        ...verification,
        error: "Verification failed. Please try again.",
        state: "failed",
      });
    }

    setIsLoading(false);
  };

  return (
    <View className="p-5 flex-1 bg-white">
      <ScrollView>
        <View className="flex-1 bg-white">
          <View className="relative w-full mb-10">
            <Text className="text-3xl text-black font-PoppinsSemiBold">
              Sign In to Your Account
            </Text>
          </View>

          <View className="flex flex-col gap-6">
            <PhoneNumberInputField
              label="Phone Number"
              placeholder="e.g. 06XX XXX XXX"
              textContentType="telephoneNumber"
              keyboardType="phone-pad"
              value={form.phoneNumber}
              onChangeText={(value) => setForm({ ...form, phoneNumber: value })}
            />

            <View className="flex flex-col items-center gap-4">
              <CustomButton
                isLoading={isLoading}
                title="Sign In"
                className="mt-6"
                onPress={onSignInPress}
              />


              <Link
                href="/(auth)/signUpPhoneNumber"
                className="text-base text-center text-general-200 font-Poppins mt-2"
              >
                Don't have an account?{" "}
                <Text className="text-primary-500 font-PoppinsMedium">
                  Sign Up
                </Text>
              </Link>
            </View>
          </View>

          <Modal
            isVisible={verification.state === "pending"}
            onModalHide={() => {
              if (verification.state === "success") {
                setShowSuccessModal(true);
              }
            }}
          >
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Text className="font-PoppinsExtraBold text-2xl mb-2">
                Verification
              </Text>
              <Text className="font-Poppins mb-5">
                We've sent a verification code to {form.phoneNumber}.
              </Text>

              <VerificationCodeInput
                onCodeChange={(code) =>
                  setVerification({ ...verification, code })
                }
              />

              <CustomButton
                isLoading={isLoading}
                title="Verify Phone Number"
                className="mt-5"
                onPress={onPressVerify}
              />

              <TouchableOpacity
                className="absolute top-3 right-3"
                onPress={() =>
                  setVerification({ ...verification, state: "default" })
                }
              >
                <XMarkIcon size={22} color={"black"} />
              </TouchableOpacity>
            </View>
          </Modal>

          <Modal isVisible={showSuccessModal}>
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Image
                source={images.check}
                className="w-[110px] h-[110px] mx-auto my-5"
              />
              <Text className="text-3xl font-PoppinsBold text-center">
                Verified
              </Text>
              <Text className="text-base text-gray-400 font-Poppins text-center mt-2">
                You have successfully signed in.
              </Text>
              <CustomButton
                title="Browse Home"
                onPress={() => router.push(`/(root)/(tabs)/(home)/home`)}
                className="mt-5"
              />
            </View>
          </Modal>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignIn;
