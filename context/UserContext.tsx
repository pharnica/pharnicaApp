import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { router } from "expo-router";

interface DeliveryLocation {
  address: string;
  id: string;
  isSelected: boolean;
  locationLatitude: number;
  locationLongitude: number;
  updatedAt: string;
  title: string;
  userId: string;
}

interface UserData {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone_number: string | null;
  registration_date: string;
  delivery_locations: DeliveryLocation[];
  birth_date?: string | null;
  gender?: string | null;
}

const UserContext = createContext<{
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  refetchUserData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}>({
  userData: null,
  setUserData: () => {},
  refetchUserData: async () => {},
  isLoading: false,
  error: null,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetchUserData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userId1 = await SecureStore.getItemAsync("user");
      
      if (!userId1) {
        return ;
      }
      
      const userId = JSON.parse(userId1);
      
      if (!userId) {
        throw new Error("Invalid user ID format");
      }
      
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER_SIDE_API}/api/users/fetchUser/${userId}`
      );
      
      if (!response.data?.user) {
        throw new Error("Invalid user data response");
      }
      
      setUserData(response.data.user);
    } catch (error : any) {
      console.error("Error refetching user data:", error);
      setError(error.message || "Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, refetchUserData, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserData = () => React.useContext(UserContext);