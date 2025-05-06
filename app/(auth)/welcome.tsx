import { Redirect, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

import { onboarding } from "@/constants/index";
import CustomButton from "@/components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === onboarding.length - 1;

  const handleSkip = async () => {
    await AsyncStorage.setItem("SkipedOnBoarding", "true");
    router.replace("/(auth)/signInPhoneNumber");
  };

  const [hasSkippedOnboarding, setHasSkippedOnboarding] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const checkSkippedOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem("SkipedOnBoarding");        
        setHasSkippedOnboarding(value === "true");
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setHasSkippedOnboarding(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkSkippedOnboarding();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="mt-4 text-black font-PoppinsMedium">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (hasSkippedOnboarding === null) {
    return null;
  }

  if (hasSkippedOnboarding) {
    return <Redirect href="/(auth)/signInPhoneNumber" />;
  }

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white px-4">
      <TouchableOpacity
        onPress={handleSkip}
        className="w-full flex justify-end items-end p-5"
      >
        <Text className="text-black text-md font-PoppinsSemiBold">Skip</Text>
      </TouchableOpacity>

      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View className="w-[10px] h-[10px] mx-1 bg-[#E2E8F0] rounded-full" />
        }
        activeDot={
          <View className="w-[10px] h-[10px] mx-1 bg-green-500 rounded-full" />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item: any) => (
          <View key={item.id} className="flex items-center justify-center">
            <Image
              source={item.image}
              className="w-full h-[300px]"
              resizeMode="contain"
            />
            <View className="flex flex-row items-center justify-center w-full mt-10">
              <Text className="text-black text-3xl font-bold mx-10 text-center">
                {item.title}
              </Text>
            </View>
            <Text className="text-md font-PoppinsSemiBold text-center text-[#858585] mx-10 mt-3">
              {item.description}
            </Text>
          </View>
        ))}
      </Swiper>

      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={() =>
          isLastSlide ? handleSkip() : swiperRef.current?.scrollBy(1)
        }
        className="w-11/12 mt-10 mb-5"
      />
    </SafeAreaView>
  );
};

export default Home;