import { Redirect } from "expo-router";
import { ActivityIndicator, View, Text } from "react-native";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useUserData } from "../context/UserContext";

const Page = () => {
  const [authState, setAuthState] = useState<
    "checking" | "authenticated" | "unauthenticated"
  >("checking");
  const { userData } = useUserData();

  useEffect(() => {
    let isMounted = true;

    const checkAuthStatus = async () => {
      try {
        const secureStoreUser = await SecureStore.getItemAsync("user");

        const isAuthenticated = !!secureStoreUser && (userData !== null || userData !== undefined);

        if(!isAuthenticated && secureStoreUser){
          await SecureStore.deleteItemAsync("user");
        }


        if (isMounted) {
          setAuthState(isAuthenticated ? "authenticated" : "unauthenticated");
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        if (isMounted) {
          setAuthState("unauthenticated");
        }
      }
    };

    checkAuthStatus();

    const interval = setInterval(checkAuthStatus, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
    
  }, [userData]);

  if (authState === "checking") {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="mt-4 font-poppinsMedium text-black">Loading...</Text>
      </View>
    );
  }

  if (authState === "authenticated") {
    return <Redirect href="/(root)/(tabs)/(home)/home" />;
  }

  return <Redirect href="/(auth)/welcome" />;
};

export default Page;
