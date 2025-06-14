import { Pressable, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import BackwardHeader from "@/components/BackwardHeader";
import { router } from "expo-router";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import tw from "twrnc";
import { customMapStyle } from "@/constants";
import MapMarkers, { Pharmacy } from "@/components/MapMarkers";
import usePharmacyData from "@/hooks/usePharmacyData";
import axios from "axios";
import { XMarkIcon } from "react-native-heroicons/outline";
import { StatusBar } from "expo-status-bar";

export const LoadingScreen = () => (
  <View style={tw`flex-1 justify-center items-center`}>
    <Text style={tw`text-lg`}>Loading...</Text>
  </View>
);

const SpecificPharmacySelection = () => {
  const orderId = "5793c84f-f94e-4e05-befc-1cdd6a890c47";
  const mapRef = useRef<MapView>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(
    null
  );

  const { order, orderPharmacies, isLoading } = usePharmacyData(orderId);

  const getInitialRegion = () => {
    if (order?.deliveryLocation) {
      return {
        latitude: order.deliveryLocation.locationLatitude,
        longitude: order.deliveryLocation.locationLongitude,
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

  useEffect(() => {
    if (selectedPharmacy && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: selectedPharmacy.latitude,
        longitude: selectedPharmacy.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [selectedPharmacy]);

  const navigateToOrderTracking = () => {
    router.navigate({
      pathname: "/(root)/(order)/orderTracking",
      params: {
        orderId,
      },
    });
  };

  const handleSendOrderToPharmacy = async () => {
    if (selectedPharmacy) {
      const dist = Number(selectedPharmacy.distance);
      try {
        const res = await axios.post(
          `${process.env.EXPO_PUBLIC_SERVER_SIDE_API}/api/orders/sendOrderToPharmacy`,
          {
            orderId,
            pharmacyId: selectedPharmacy.id,
            distance: dist,
          }
        );

        if (res.status === 200) {
          navigateToOrderTracking();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const renderButtonOrderPharmacyAction = (pharmacy: Pharmacy) => {
    if (order?.status === "PENDING") {
      return (
        <TouchableOpacity
          style={tw`mt-2 bg-green-500 py-3 rounded-full items-center mt-8`}
          onPress={handleSendOrderToPharmacy}
        >
          <Text className="text-white font-PoppinsMedium">
            Send Order to Pharmacy
          </Text>
        </TouchableOpacity>
      );
    }

    if (!pharmacy.status) {
      return (
        <View className="w-full p-4 mt-4 flex items-center justify-center bg-neutral-100 rounded-full">
          <Text className="text-red-500 font-PoppinsMedium text-xs text-center">
            You cannot send order to more than one pharmacy
          </Text>
        </View>
      );
    }

    if (pharmacy.status === "PENDING" || pharmacy.status === "ACCEPTED") {
      return (
        <TouchableOpacity
          style={tw`mt-2 bg-green-500 py-3 rounded-full items-center mt-8`}
          onPress={navigateToOrderTracking}
        >
          <Text
            className="text-white font-PoppinsMedium"
          >
            Track order
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View className="w-full py-2 flex items-center justify-center bg-neutral-100 rounded-full">
        <Text className="text-red-500 font-PoppinsSemiBold">
          This order is already rejected
        </Text>
      </View>
    );
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <View style={tw`flex-1 w-full bg-gray-100`}>

      <View
        style={tw`flex-row items-center justify-between absolute top-0 z-50 p-4 w-full`}
      >
        <TouchableOpacity className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-neutral-100">
          <XMarkIcon size={20} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <MapView
        ref={mapRef}
        style={tw`w-full h-full`}
        provider={PROVIDER_GOOGLE}
        initialRegion={getInitialRegion()}
        showsUserLocation={false}
        showsCompass={false}
        showsMyLocationButton={false}
        customMapStyle={customMapStyle}
      >
        <MapMarkers
          order={order}
          pharmacies={orderPharmacies || []}
          setSelectedPharmacy={setSelectedPharmacy}
          selectedPharmacy={selectedPharmacy}
        />
      </MapView>

      {selectedPharmacy && (
        <View style={tw`p-3 absolute w-full z-50 bottom-0`}>
          <View
            style={tw`w-full bg-white rounded-xl p-4 border border-neutral-200 shadow-lg`}
          >
            <Text style={tw`font-bold text-lg`}>{selectedPharmacy.name}</Text>
            <Text style={tw`text-gray-600`}>{selectedPharmacy.address}</Text>
            {selectedPharmacy.distance && (
              <Text style={tw`text-blue-500`}>
                {selectedPharmacy.distance} km away
              </Text>
            )}
            {renderButtonOrderPharmacyAction(selectedPharmacy)}
          </View>
        </View>
      )}
    </View>
  );
};

export default SpecificPharmacySelection;
