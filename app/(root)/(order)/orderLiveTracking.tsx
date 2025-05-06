import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import { icons } from "@/constants";
import { customMapStyle } from "@/constants";
import tw from "twrnc";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import OrderProcess from "@/components/OrderProcess";

// Type Definitions
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationType {
  coords: Coordinates;
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  OrderStatus: "PROCESSING" | "PENDING" | "REJECTED";
  latitude: number;
  longitude: number;
}

interface Order {
  id: string;
  status: string;
  address: string;
  doorDropOff: boolean;
  autoPharmacySelection: boolean;
  type: string;
}

const OrderLiveTracking = () => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["49%"];

  // Static data
  const [order] = useState<Order>({
    id: "#3jd3r3fk",
    status: "Shipping",
    address: "Hay Mohamadi, La Villette, Khalil 2, Rue 3",
    doorDropOff: true,
    autoPharmacySelection: true,
    type: "Prescription",
  });

  const pharmacies: Pharmacy[] = [
    {
      id: "2",
      name: "Pharmacie du Siber",
      address: "123 Boulevard Mohammed VI, Casablanca",
      OrderStatus: "PROCESSING",
      latitude: 33.5731,
      longitude: -7.5898,
    },
    {
      id: "1",
      name: "Pharmacie du Soleil",
      address: "123 Boulevard Mohammed V, Casablanca",
      OrderStatus: "PENDING",
      latitude: 33.5955,
      longitude: -7.6180,
    },
    {
      id: "c3d4e5f6-g7h8-9012-i3j4-k5l6m7n8o9p0",
      name: "Pharmacie des Nations",
      address: "Avenue des FAR, Quartier Californie, Casablanca",
      OrderStatus: "REJECTED",
      latitude: 33.5675,
      longitude: -7.6617,
    },
  ];

  // Memoized pharmacy status to icon mapping
  const getPharmacyIcon = useCallback((status: Pharmacy["OrderStatus"]) => {
    const iconMap: Record<Pharmacy["OrderStatus"], any> = {
      PROCESSING: icons.SelectedPharmacy,
      REJECTED: icons.rejectedPharmacy,
      PENDING: icons.pendingPharmacy,
    };
    return iconMap[status];
  }, []);

  // Memoized initial region calculation
  const getInitialRegion = useCallback((): Region => {
    const defaultRegion: Region = {
      latitude: 33.5731,
      longitude: -7.5898,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    if (!location) return defaultRegion;

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  }, [location]);

  // Memoized location fetching
  const fetchLocation = useCallback(async () => {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);
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
      console.error("Location fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle locate me button press
  const handleLocateMe = useCallback(async () => {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
    } catch (error) {
      setErrorMsg("Could not fetch location");
      console.error("Locate me error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial location fetch
  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  // Error state rendering
  if (errorMsg) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white p-4`}>
        <Text style={tw`text-red-500 text-lg text-center`}>{errorMsg}</Text>
        <TouchableOpacity
          style={tw`mt-4 bg-green-500 px-4 py-2 rounded-lg`}
          onPress={fetchLocation}
        >
          <Text style={tw`text-white font-semibold`}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 w-full bg-gray-100`}>
      <StatusBar
        animated
        backgroundColor="rgb(243 244 246)"
        barStyle="dark-content"
      />

      <View style={tw`flex-row justify-between absolute z-10 w-full p-5`}>
        <TouchableOpacity
          style={tw`w-10 h-10 bg-white rounded-full items-center justify-center`}
          onPress={() => router.navigate("/(root)/(order)/orderDetails")}
        >
          <ArrowLeftIcon size={20} color="black" strokeWidth={2} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLocateMe}
          style={tw`bg-white w-10 h-10 rounded-full items-center justify-center`}
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
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        initialRegion={getInitialRegion()}
        showsUserLocation
        showsMyLocationButton={false}
        customMapStyle={customMapStyle}
      >
        {pharmacies.map((pharmacy) => (
          <Marker
            key={pharmacy.id}
            coordinate={{
              latitude: pharmacy.latitude,
              longitude: pharmacy.longitude,
            }}
            title={pharmacy.name}
            description={pharmacy.address}
          >
            <View style={tw`w-8 h-8 items-center justify-center`}>
              <Image
                source={getPharmacyIcon(pharmacy.OrderStatus)}
                style={tw`w-8 h-8`}
                contentFit="contain"
              />
            </View>
          </Marker>
        ))}
      </MapView>

      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} enablePanDownToClose={false}>
        <BottomSheetView style={tw`bg-white items-center`}>
          <OrderProcess orderId={order.id} forMap={true} />
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default OrderLiveTracking;