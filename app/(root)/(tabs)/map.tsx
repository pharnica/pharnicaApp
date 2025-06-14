import React, { useState, useEffect, useMemo, useRef } from "react";
import * as Location from "expo-location";
import { Text, View, StatusBar, Pressable, Linking, Image, TouchableOpacity, ActivityIndicator, TouchableHighlight } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, } from "react-native-maps";
import tw from "twrnc";
import Supercluster from "supercluster";
import { ArrowTopRightOnSquareIcon } from "react-native-heroicons/solid";
import axios from "axios";
import { customMapStyle, icons } from "@/constants";

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  // Add other properties as needed
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const MapScreen = () => {
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<Coordinates | null>(null);
    const [locating, setLocating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(
    null
  );
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pharmacies data
  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        setLoading(true);
        // Replace this URL with your actual API endpoint
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_SERVER_SIDE_API}/api/pharmacies/fetchPharmacies`
        );

        const transformedData = response.data.map((pharmacy: any) => ({
          id: pharmacy.id,
          name: pharmacy.name,
          address: pharmacy.address,
          latitude: pharmacy.latitude,
          longitude: pharmacy.longitude,
          isActive: pharmacy.isActive,
        }));

        setPharmacies(transformedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch pharmacies data");
        setLoading(false);
        console.error("Error fetching pharmacies:", err);
      }
    };

    fetchPharmacies();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  // Convert pharmacies data to GeoJSON format
  const points: any = useMemo(() => {
    return pharmacies.map((pharmacy: Pharmacy) => ({
      type: "Feature",
      properties: {
        cluster: false,
        pharmacyId: pharmacy.id,
        pharmacy: pharmacy, // Include all pharmacy data in properties
      },
      geometry: {
        type: "Point",
        coordinates: [pharmacy.longitude, pharmacy.latitude],
      },
    }));
  }, [pharmacies]);

  const supercluster = useMemo(() => {
    const cluster = new Supercluster({
      radius: 40,
      maxZoom: 16,
    });
    cluster.load(points);
    return cluster;
  }, [points]);

  // Get clusters for the current map region
  const clusters = useMemo(() => {
    if (!region.latitude && !region.longitude) return [];

    return supercluster.getClusters(
      [
        region.longitude - region.longitudeDelta / 2,
        region.latitude - region.latitudeDelta / 2,
        region.longitude + region.longitudeDelta / 2,
        region.latitude + region.latitudeDelta / 2,
      ],
      Math.floor(Math.log2(360 / region.longitudeDelta))
    );
  }, [region, supercluster]);

  const handleClusterPress = (cluster: any) => {
    if (!mapRef.current) return;

    const [longitude, latitude] = cluster.geometry.coordinates;

    // Get cluster expansion zoom level
    const expansionZoom = Math.min(
      supercluster.getClusterExpansionZoom(cluster.id),
      20 // Maximum zoom level
    );

    // Convert zoom level to region delta (smaller delta = higher zoom)
    const latDelta = (360 / Math.pow(2, expansionZoom)) * 0.5;
    const lngDelta = latDelta * 1.5; // Adjust for aspect ratio

    // Animate to the new region
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      },
      500
    ); // Animation duration in ms
  };

  // Handle marker press to show pharmacy details
  const handleMarkerPress = (properties: any) => {
    // Close detail card if already open for this pharmacy
    if (selectedPharmacy && selectedPharmacy.id === properties.pharmacy.id) {
      setSelectedPharmacy(null);
    } else {
      setSelectedPharmacy(properties.pharmacy);
    }
  };

  // Open directions in maps app
  const openDirections = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  // Function to get the appropriate image based on status and selection
  const getPharmacyImage = (pharmacy: Pharmacy) => {
    if (selectedPharmacy && selectedPharmacy.id === pharmacy.id) {
      return icons.SelectedPharmacy;
    } else if (pharmacy.isActive) {
      return icons.activePharmacy;
    } else {
      return icons.inactivePharmacy;
    }
  };

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-lg text-red-500`}>{error}</Text>
      </View>
    );
  }


    const handleLocateMe = async () => {
      try {
        setLocating(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          setLocating(false);
          return;
        }
  
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
  
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            },
            500
          );
        }
      } catch (error) {
        console.error("Error getting location:", error);
        setErrorMsg("Could not fetch location");
      } finally {
        setLocating(false);
      }
    };

  return (
    <View style={tw`flex-1`}>
      <StatusBar
        animated
        backgroundColor="rgb(243 244 246)"
        barStyle="dark-content"
      />

      <TouchableOpacity
        onPress={handleLocateMe}
        style={tw`bg-white w-10 h-10 rounded-full items-center justify-center absolute right-3 top-4 z-10`}
        disabled={locating}
      >
        {locating ? (
          <ActivityIndicator size="small" color="#22c55e" />
        ) : (
          <Image source={icons.GPS} style={tw`w-5 h-5`} />
        )}
      </TouchableOpacity>


        <MapView
          ref={mapRef}
          style={tw`w-full h-full`}
          initialRegion={{
            latitude: 33.5731, 
            longitude: -7.5898, 
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={!!location}
          showsMyLocationButton={false}
          provider={PROVIDER_GOOGLE}
          onRegionChangeComplete={setRegion}
          onPress={() => setSelectedPharmacy(null)}
          customMapStyle={customMapStyle}
        >
          {clusters.map((cluster: any) => {
            const { geometry, properties } = cluster;
            const [longitude, latitude] = geometry.coordinates;
            const isCluster = properties.cluster;

            if (isCluster) {
              return (
                <Marker
                  key={`cluster-${properties.cluster_id}`}
                  coordinate={{ latitude, longitude }}
                  style={tw`w-[34px] h-[34px] p-[1px]`}
                  onPress={() => handleClusterPress(cluster)}
                >
                  <View
                    style={tw`bg-green-500/85 rounded-full w-full h-full justify-center items-center border-2 border-green-500`}
                  >
                    <Text style={tw`text-white font-bold`}>
                      {properties.point_count}
                    </Text>
                  </View>
                </Marker>
              );
            } else {
              // Render an individual marker
              return (
                <Marker
                  key={`pharmacy-${properties.pharmacyId}`}
                  coordinate={{ latitude, longitude }}
                  style={tw`w-[34px] h-[34px] p-[1px]`}
                  onPress={() => handleMarkerPress(properties)}
                >
                  <View
                    style={tw`w-full h-full flex items-center justify-center`}
                  >
                    <Image
                      source={getPharmacyImage(properties.pharmacy)}
                      style={tw`w-8 h-8`}
                    />
                  </View>
                </Marker>
              );
            }
          })}
        </MapView>

        {(!location || locating || loading) && (
  <View style={tw`absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg flex-row items-center`}>
    <ActivityIndicator color="#22c55e" />
    <Text style={tw`ml-2 text-sm text-gray-600`}>
      {locating ? "Locating..." : 
       loading ? "Loading pharmacies..." : 
       "Getting your location..."}
    </Text>
  </View>
)}
      
      {/* Pharmacy Details Card */}
      {selectedPharmacy && (
        <View
          style={tw`absolute bottom-24 left-4 right-4 bg-white rounded-xl shadow-xl overflow-hidden`}
        >
          <View style={tw`p-4`}>
            <Text style={tw`text-lg font-bold text-gray-800`}>
              {selectedPharmacy.name || "Pharmacy"}
            </Text>
            <Text style={tw`text-sm text-gray-600 mt-1`}>
              {selectedPharmacy.address}
            </Text>

            <View style={tw`flex-row items-center mt-1`}>
              <View
                style={tw`${
                  selectedPharmacy.isActive ? "bg-green-100" : "bg-red-100"
                } px-2 py-1 rounded-full`}
              >
                <Text
                  style={tw`${
                    selectedPharmacy.isActive
                      ? "text-green-600"
                      : "text-red-600"
                  } font-medium text-sm`}
                >
                  {selectedPharmacy.isActive ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>


            <TouchableHighlight
            style={tw`mt-4 py-3 px-4 rounded-lg flex-row items-center justify-center bg-green-500`}
            onPress={() =>
              openDirections(
                selectedPharmacy.latitude,
                selectedPharmacy.longitude
              )
            }
            underlayColor="#126b33"
          >
            <Text
              style={tw`font-bold mr-2 text-white`}
            >
              Get Directions
            </Text>
          </TouchableHighlight>

          </View>
        </View>
      )}
    </View>
  );
};

export default MapScreen;
