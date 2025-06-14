import { Redirect, router } from "expo-router";
import { ActivityIndicator, View, Text } from "react-native";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useUserData } from "../context/UserContext";
import { BackHandler } from 'react-native';

const Page = () => {

  const { userData } = useUserData();

  return <Redirect href="/(root)/(order)/orderTracking" />;
};

export default Page;
