import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AdjustmentsHorizontalIcon,
  ArrowLeftIcon,
} from "react-native-heroicons/outline";
import { router } from "expo-router";
import tw from "twrnc";
import { useLocalSearchParams } from "expo-router";
import ProductCard from "@/components/ProductCard";

// Moved FilteringByCategories component to the top to fix hoisting issue
interface FilteringByCategoriesProps {
  selectedCategory: string;
  onCategoryPress: (category: string) => void;
}

const FilteringByCategories: React.FC<FilteringByCategoriesProps> = ({
  selectedCategory,
  onCategoryPress,
}) => {
  const categories = [
    { title: "All" },
    { title: "Pain & Fever" },
    { title: "Digestive Health" },
    { title: "Vitamins & pain killers" },
    { title: "Women's Health" },
    { title: "First aid supplies" },
    { title: "Babies gear" },
    { title: "Personal Care" },
    { title: "Sexual health" },
  ];

  return (
    <FlatList
      horizontal
      data={categories}
      keyExtractor={(item) => item.title}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onCategoryPress(item.title)}
          style={tw`items-center py-2 px-4 rounded-lg mr-2 ${
            selectedCategory === item.title ? "bg-[#22C55E]" : "bg-[#ECECEC]"
          }`}
        >
          <Text
            numberOfLines={1}
            className={`font-PoppinsMedium text-sm ${
              selectedCategory === item.title ? "text-white" : "text-black"
            }`}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      )}
      showsHorizontalScrollIndicator={false}
      // Removed invalid 'sticky' class and adjusted padding
      style={tw`px-4`}
    />
  );
};

const ProductsResults = () => {
  const { searchValue } = useLocalSearchParams<{ searchValue: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const handleGoBack = () => {
    router.push({
      pathname: "/(root)/(products)/searchPage",
      params: { returnedQuery: searchValue },
    });
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
  };

  if (!searchValue) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 w-full bg-gray-100">
      <StatusBar
        animated
        backgroundColor="rgb(243 244 246)"
        barStyle="dark-content"
      />

      <View className="flex flex-col gap-4 pt-4 ">

        <View className="flex flex-row items-center gap-3 px-4">
          <TouchableOpacity
            onPress={handleGoBack}
            className="p-2 pr-3 pl-1 -mr-3"
          >
            <ArrowLeftIcon
              size={22}
              color="black"
              className="m-4"
              strokeWidth={2}
            />
          </TouchableOpacity>

          <Pressable
            className="flex flex-row justify-between items-center h-[48px] w-full flex-shrink pl-4 pr-2 bg-white rounded-[70px] shadow-sm"
            onPress={handleGoBack}
          >
            <TextInput
              className="font-MontserratMedium flex-1 tracking-tighter"
              placeholder="Search pharmacies..."
              placeholderTextColor="#b0b0b0"
              value={searchValue}
              clearButtonMode="never"
              returnKeyType="search"
              editable={false}
            />
          </Pressable>

          <TouchableOpacity className="w-[46px] h-[46px] bg-[#ecececce] flex items-center justify-center rounded-full -ml-1 border border-neutral-200">
            <AdjustmentsHorizontalIcon size={25} color="black" />
          </TouchableOpacity>
        </View>

        <FilteringByCategories
          selectedCategory={selectedCategory}
          onCategoryPress={handleCategoryPress}
        />

        <View className="flex-1 border-neutral-200 w-full border-[0.7px]" />
      </View>

      <ScrollView
        contentContainerStyle={tw`px-4 w-full flex flex-row flex-wrap justify-between pb-20`}
      >
        <ProductCard
          PR={true}
          description={"DOLIPRANE Tabs 1000 mg boîte de 8 comprimés"}
          price="15.00"
        />
        <ProductCard
          PR={false}
          description={"DOLIPRANE Tabs 1000 mg boîte de 8 comprimés"}
          price="15.00"
        />
        <ProductCard
          PR={false}
          description={"DOLIPRANE Tabs 1000 mg boîte de 8 comprimés"}
          price="15.00"
        />
        <ProductCard
          PR={false}
          description={"DOLIPRANE Tabs 1000 mg boîte de 8 comprimés"}
          price="15.00"
        />
        <ProductCard
          PR={true}
          description={"DOLIPRANE Tabs 1000 mg boîte de 8 comprimés"}
          price="15.00"
        />
        <ProductCard
          PR={false}
          description={"DOLIPRANE Tabs 1000 mg boîte de 8 comprimés"}
          price="15.00"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductsResults;
