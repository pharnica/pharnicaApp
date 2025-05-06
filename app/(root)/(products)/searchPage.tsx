import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeftIcon,
  ArrowUpLeftIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";

const searchPage = () => {
  const params = useLocalSearchParams<{ returnedQuery?: string }>();
  const [searchQuery, setSearchQuery] = useState(params.returnedQuery || "");

  const inputRef = useRef<TextInput>(null);
  useEffect(() => {
    if (params.returnedQuery) inputRef.current?.focus();
  }, [params.returnedQuery]);

  const [recentSearches, setRecentSearches] = useState([
    "Dyliprane 100mg  adults",
    "renomicune",
  ]);
  const [searchResults, setSearchResults] = useState([
    "Dyliprane 100mg  adults",
    "renomicune",
  ]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleProductsResults = (searchValue: string) => {
    if (searchValue == "") {
      return;
    }
    router.push({
      pathname: "/(root)/(tabs)/(home)/productsResults",
      params: { searchValue },
    });
  };

  const handleBackNavigation = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      router.push("/(root)/(tabs)/(home)/home");
    }, 50);
  };

  return (
    <SafeAreaView className="flex-1 w-full bg-gray-100 p-4">
      <StatusBar
        animated
        backgroundColor="rgb(243 244 246)"
        barStyle="dark-content"
      />
      <View className="flex flex-row items-center gap-3">

        <TouchableOpacity
          onPress={handleBackNavigation} 
          className="p-2 pr-3 pl-1 -mr-3"
        >
          <ArrowLeftIcon
            size={22}
            color="black"
            className="m-4"
            strokeWidth={2}
          />
        </TouchableOpacity>

        <View className="flex flex-row justify-between items-center h-[48px] w-full flex-shrink pl-4 pr-2 bg-white rounded-[70px] shadow-sm  ">
          <TextInput
            ref={inputRef}
            className="font-MontserratMedium  flex-1 tracking-tighter"
            placeholder="Search Medicines..."
            placeholderTextColor="#b0b0b0"
            value={searchQuery}
            onChangeText={handleSearch}
            onSubmitEditing={() => handleProductsResults(searchQuery)}
            clearButtonMode="never"
            returnKeyType="search"
            autoFocus={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} className="pr-2">
              <XMarkIcon color={"#b0b0b0"} size={20} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView className="mt-6">
        <View className="flex flex-col gap-1 px-1">
          {recentSearches.length != 0 &&
            recentSearches.map((recentSearch, index) => {
              return (
                <TouchableOpacity
                  onPress={() => handleProductsResults(recentSearch)}
                  className="flex flex-row items-center justify-between w-full py-4"
                  key={index}
                >
                  <View className="flex flex-row items-center gap-3 flex-shrink">
                    <ClockIcon color={"#929292"} size={22} strokeWidth={1.1} />
                    <Text className=" font-Poppins text-[#929292]">
                      {recentSearch}
                    </Text>
                  </View>
                  <ArrowUpLeftIcon color={"#929292"} size={17} />
                </TouchableOpacity>
              );
            })}
          {searchResults.length != 0 &&
            searchResults.map((searchResult, index) => {
              return (
                <TouchableOpacity
                  onPress={() => handleProductsResults(searchResult)}
                  className="flex flex-row items-center justify-between w-full py-4"
                  key={index}
                >
                  <View className="flex flex-row items-center gap-3 flex-shrink">
                    <MagnifyingGlassIcon
                      color={"black"}
                      size={22}
                      strokeWidth={1.5}
                    />
                    <Text className=" font-PoppinsMedium text-[black]">
                      {searchResult}
                    </Text>
                  </View>
                  <ArrowUpLeftIcon
                    color={"black"}
                    size={17}
                    strokeWidth={1.8}
                  />
                </TouchableOpacity>
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default searchPage;
