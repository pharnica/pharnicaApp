import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Dimensions,
  ActivityIndicator,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import { icons, images } from "@/constants";
import { customMapStyle } from "@/constants";
import tw from "twrnc";
import axios from "axios";
import {
  ArrowLeftIcon,
  MapPinIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import Modal from "react-native-modal";
import InputField from "@/components/InputField";
import { useUserData } from "../../../context/UserContext";
import BackwardHeader from "@/components/BackwardHeader";

interface LocationType {
  coords: {
    latitude: number;
    longitude: number;
  };
}

// Define Casablanca boundaries
const CASABLANCA_BOUNDS = {
  north: 33.65,
  south: 33.45,
  west: -7.7,
  east: -7.45,
};

const AddNewAddress = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState<LocationType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [locationAddress, setlocationAddress] = useState("");
  const [locationTitle, setlocationTitle] = useState("");
  const [succeded, setSucceded] = useState(false);
  const [locationLatitude, setLocationLatitude] = useState<string | number>("");
  const [locationLongitude, setLocationLongitude] = useState<string | number>(
    ""
  );
  const [isGettingAddress, setIsGettingAddress] = useState(false);
  const [isInCasablancaArea, setIsInCasablancaArea] = useState(true);

  const { userData, refetchUserData } = useUserData();

  const mapRef = useRef<MapView>(null);

  const OPENCAGE_API_KEY = process.env.EXPO_PUBLIC_OPENCAGE_API_KEY;

  // Function to check if coordinates are within Casablanca
  const isInCasablanca = (latitude: number, longitude: number) => {
    return (
      latitude <= CASABLANCA_BOUNDS.north &&
      latitude >= CASABLANCA_BOUNDS.south &&
      longitude <= CASABLANCA_BOUNDS.east &&
      longitude >= CASABLANCA_BOUNDS.west
    );
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      try {
        setIsLoading(true);
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setLocation(currentLocation);
        getAddressFromCoordinates(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );

        // Check if initial location is in Casablanca
        setIsInCasablancaArea(
          isInCasablanca(
            currentLocation.coords.latitude,
            currentLocation.coords.longitude
          )
        );

        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      } catch (error) {
        setErrorMsg("Could not fetch location");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();

    if (succeded) {
      const timer = setTimeout(() => {
        setSucceded(false);
        setIsModalVisible(false);
        router.navigate(
          "/(root)/(deliveryLocations)/List_of_delivery_locations"
        );
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [succeded]);

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      setIsGettingAddress(true);

      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?key=${OPENCAGE_API_KEY}&q=${lat}+${lng}&pretty=1&no_annotations=1`
      );

      if (response?.data?.results?.length > 0) {
        const result = response.data.results[0];
        const { components, formatted } = result;

        const newFormatted = formatted.split(", ");

        if (newFormatted[0] == "unnamed road") {
          newFormatted[0] = components.suburb;
        }

        const address = {
          road: components.road || "Unknown road",
          city:
            components.city || components._normalized_city || "Unknown city",
          country: components.country || "Unknown country",
          postcode: components.postcode || "No postcode",
          formatted: newFormatted.join(", ") || "No address available",
        };

        setlocationAddress(address.formatted);
      } else {
        setlocationAddress("Could not determine location");
      }
    } catch (error) {
      console.error("Error getting address:", error);
      setlocationAddress("Could not determine location");
    } finally {
      setIsGettingAddress(false);
    }
  };

  const handleRegionChange = (region: Region) => {
    getAddressFromCoordinates(region.latitude, region.longitude);
    setLocationLatitude(region.latitude);
    setLocationLongitude(region.longitude);

    // Check if the location is within Casablanca bounds
    const withinCasablanca = isInCasablanca(region.latitude, region.longitude);
    setIsInCasablancaArea(withinCasablanca);
  };

  const getInitialRegion = () => {
    if (location) {
      const { latitude, longitude } = location.coords;
      return {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }

    return {
      latitude: 33.5731,
      longitude: -7.5898,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  };

  if (errorMsg) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-red-500 text-lg text-center">{errorMsg}</Text>
      </View>
    );
  }

  const onPressSave = async () => {
    // Double check the location is within Casablanca
    if (!isInCasablancaArea) {
      alert("This location is outside our delivery zone (Casablanca only)");
      return;
    }

    try {
      setIsLoadingModal(true);
      const result = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_SIDE_API}/api/users/addDeliveryLocation`,
        {
          userId: userData?.user_id,
          address: locationAddress,
          locationLatitude: locationLatitude,
          locationLongitude: locationLongitude,
          title: locationTitle,
        }
      );

      if (result.status == 201) {
        setSucceded(true);
        await refetchUserData();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocateMe = async () => {
    try {
      setIsLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);
      getAddressFromCoordinates(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );

      // Check if the location is within Casablanca bounds
      const withinCasablanca = isInCasablanca(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
      setIsInCasablancaArea(withinCasablanca);

      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
    } catch (error) {
      console.error("Error getting location:", error);
      setErrorMsg("Could not fetch location");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <View className="flex-1 w-full bg-gray-100">
        <View className="flex flex-row items-center justify-between absolute top-0 z-50 p-4 w-full">
          <BackwardHeader
            title="Add Delivery Location"
            backTo={() => {
              router.back();
            }}
          />
          <TouchableOpacity
            onPress={handleLocateMe}
            style={tw`bg-white w-10 h-10 rounded-full items-center justify-center absolute right-2`}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#22c55e" />
            ) : (
              <Image source={icons.GPS} style={tw`w-5 h-5`} />
            )}
          </TouchableOpacity>
        </View>

        <MapView
          ref={mapRef}
          style={tw`w-full h-full`}
          provider={PROVIDER_GOOGLE}
          initialRegion={getInitialRegion()}
          showsUserLocation={true}
          showsMyLocationButton={false}
          onRegionChangeComplete={handleRegionChange}
          customMapStyle={customMapStyle}
        ></MapView>

        <View className="absolute top-1/2 left-1/2 -ml-6 -mt-12 z-10">
          <Image source={icons.activepin} style={tw`w-12 h-12`} />
        </View>

        <View className="absolute bottom-4 left-4 right-4 bg-white p-5 rounded-3xl shadow-md z-10 gap-5">
          <View className="flex flex-row items-center gap-3">
            <View className="w-12 h-12 bg-green-500/30 flex items-center justify-center rounded-full">
              <MapPinIcon color={"#22C55E"} size={26} />
            </View>

            {isGettingAddress || !locationAddress ? (
              <View className="flex-row items-center justify-center">
                <ActivityIndicator
                  size="small"
                  color="#0000ff"
                  className="mr-2"
                />
                <Text className="text-gray-600">Getting location name...</Text>
              </View>
            ) : (
              <View className="flex-1">
                <Text className="text-gray-800 font-PoppinsSemiBold flex-shrink">
                  {locationAddress}
                </Text>
                {!isInCasablancaArea && (
                  <Text className="text-red-500 font-PoppinsRegular text-sm mt-1">
                    This area is not within our delivery zone (Casablanca only)
                  </Text>
                )}
              </View>
            )}
          </View>

          <CustomButton
            title={"Save this New address"}
            onPress={() => {
              setIsModalVisible(true);
            }}
            disabled={!isInCasablancaArea}
            style={!isInCasablancaArea ? { opacity: 0.5 } : {}}
          />
        </View>
      </View>

      {isModalVisible && (
        <Pressable className="z-50 bg-black/60 w-full h-full absolute top-0 left-0 flex items-center justify-center p-10" onPress={() => setIsModalVisible(false)}>
          {isLoadingModal && !succeded ? (
            <Pressable onPress={(e) => e.stopPropagation()}>
              <ActivityIndicator />
            </Pressable>
          ) : succeded ? (
            <Pressable onPress={(e) => e.stopPropagation()} className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Image
                source={images.check}
                style={tw`w-[110px] h-[110px] mx-auto my-5`}
              />
              <Text className="text-base text-gray-400 font-Poppins text-center mt-2">
                You have successfully added new address
              </Text>
            </Pressable>
          ) : (
            <Pressable onPress={(e) => e.stopPropagation()} className="bg-white px-7 py-9 rounded-2xl min-h-[300px] w-full">
              <Text className="font-PoppinsExtraBold text-2xl mb-2">
                Enter a title for this Address
              </Text>

              <InputField
                label="Address Title"
                placeholder="Home , Office etc..."
                onChangeText={(value) => {
                  setlocationTitle(value);
                }}
              />

              <CustomButton
                isLoading={isLoading}
                title="Save Address"
                className="mt-5 w-full"
                onPress={onPressSave}
              />

              <TouchableOpacity
                className="absolute top-3 right-3"
                onPress={() => setIsModalVisible(false)}
              >
                <XMarkIcon size={20} color={"black"} />
              </TouchableOpacity>
            </Pressable>
          )}
        </Pressable>
      )}
    </React.Fragment>
  );
};

export default AddNewAddress;
