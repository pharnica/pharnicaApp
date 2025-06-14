import { View, Image } from "react-native";
import React from "react";
import { Marker } from "react-native-maps";
import tw from "twrnc";
import { icons } from "@/constants";

export interface DeliveryLocation {
  address: string;
  locationLatitude: number;
  locationLongitude: number;
  title: string;
}

export interface Pharmacy {
  id: string;
  orderPharmacyId: string;
  address: string;
  distance?: string | null;
  status?: string | null;
  orderStatus?: string | null;
  isHoldingOrder?: Boolean;
  failureReason?: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface Order {
  id: string;
  deliveryLocation: DeliveryLocation;
  status: string;
  doorDropOff: boolean;
  priceRequesting: boolean;
  failureReason?: string;
}

const getPharmacyIcon = (status: string | null | undefined) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return icons.SelectedPharmacy;
    case "REJECTED":
      return icons.rejectedPharmacy;
    default:
      return icons.activePharmacy;
  }
};

interface MapMarkersProps {
  order: Order | null;
  pharmacies: Pharmacy[];
  setSelectedPharmacy: (pharmacy: Pharmacy | null) => void;
  selectedPharmacy: Pharmacy | null;
}

const MapMarkers = ({
  order,
  pharmacies,
  setSelectedPharmacy,
  selectedPharmacy,
}: MapMarkersProps) => (
  <>
    {order?.deliveryLocation && (
      <Marker
        coordinate={{
          latitude: order.deliveryLocation.locationLatitude,
          longitude: order.deliveryLocation.locationLongitude,
        }}
        style={tw`w-[34px] h-[34px] p-[1px]`}
        title="Your Delivery Destination"
        onPress={() => setSelectedPharmacy(null)}
      >
        <View style={tw`w-full h-full flex items-center justify-center`}>
          <Image source={icons.pinmap} style={tw`w-11 h-8`} />
        </View>
      </Marker>
    )}

    {pharmacies.map((pharmacy) => (
      <Marker
        key={`pharmacy-${pharmacy.id}`}
        coordinate={{
          latitude: pharmacy.latitude,
          longitude: pharmacy.longitude,
        }}
        title={pharmacy.name}
        onPress={() =>
          setSelectedPharmacy(
            selectedPharmacy?.id === pharmacy.id ? null : pharmacy
          )
        }
      >
        <View style={tw`w-full h-full flex items-center justify-center`}>
          <Image
            source={getPharmacyIcon(pharmacy.status)}
            style={tw`w-8 h-8`}
          />
        </View>
      </Marker>
    ))}
  </>
);

export default MapMarkers;
