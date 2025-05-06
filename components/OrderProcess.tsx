import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { processStages } from "@/constants";
import useOrderStore from "@/store/orderStore";
import axios from "axios";
import { useSocketContext } from "@/context/SocketContext";
import ProcessTimeline from "./ProcessTimeline";
import CourierCard from "./CourierCard";
import PharmaciesNearByList from "./PharmaciesNearByList";
import SearchNearbyLoader from "./SearchNearbyLoader";
import { Pharmacy } from "@/types/type";

const OrderProcess = ({
  orderId,
  forMap = false,
}: {
  orderId: string;
  forMap?: boolean;
}) => {

  const { socket, isConnected } = useSocketContext();
  const {
    selectedPharmacies,
    deliveryAddress,
    status,
    setSelectedPharmacies,
    setStatus,
    updatePharmacyStatus,
  } = useOrderStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Sample courier data
  const courier = {
    id: "dm789",
    name: "Karim Belhadi",
    phone: "+212612345678",
    vehicleType: "MOTORCYCLE",
    vehiclePlate: "CAS-7890",
    status: "AVAILABLE",
    rating: 4.7,
    currentLocation: {
      latitude: 33.5731,
      longitude: -7.5898,
    },
    currentOrder: null,
    totalDeliveries: 142,
    todayDeliveries: 8,
    isOnline: true,
    lastActive: "2023-11-15T14:30:00Z",
    deliveryRadius: 15,
    preferredAreas: ["Casablanca", "Ain Diab", "Maarif"],
    profilePhoto: "https://example.com/profiles/dm789.jpg",
  };


  const fetchOrderPharmacies = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER_SIDE_API}/api/orders/fetchOrderPharmacies`,
        {
          params: { orderId },
        }
      );

      const orderPharmacies = response.data.orderPharmacies;
      

      // Transform data
      const pharmacies = orderPharmacies.map((orderPharmacy : any) => ({
        id: orderPharmacy.pharmacy.id,
        address: orderPharmacy.pharmacy.address,
        distance_km: orderPharmacy.distance,
        latitude: orderPharmacy.pharmacy.latitude,
        longitude: orderPharmacy.pharmacy.longitude,
        name: orderPharmacy.pharmacy.name,
        orderStatus: orderPharmacy.status,
      }));

      setSelectedPharmacies(pharmacies);

      if (orderPharmacies[0]?.order?.status && orderPharmacies[0].order.status !== "PENDING") {
        setStatus(orderPharmacies[0].order.status);
      } else if (pharmacies.length > 0) {
        setStatus("PENDING");
      }
      
      return pharmacies;
    } catch (error) {
      console.error("Error fetching order pharmacies:", error);
      setError("Failed to load nearby pharmacies. Please try again.");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const sendOrderToPharmacies = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_SIDE_API}/api/orders/sendOrderToPharmacies`,
        {
          orderId,
          selectedPharmacies,
        }
      );
      
      if (res.status === 200) {
        setStatus("VALIDATING");
        updatePharmacyStatus(res.data.pharmacy.id, "PROCESSING");
      }
    } catch (error) {
      console.error("Error sending order to pharmacies:", error);
      setError("Failed to send order to pharmacies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };




  useEffect(() => {
    const initializeOrder = async () => {
      if (!deliveryAddress) return;
      
      // If we don't have pharmacies yet, find them
      if (selectedPharmacies.length === 0) {
        setStatus("FINDINGNEARBY");
        const pharmacies = await fetchOrderPharmacies();
        
        // After fetching pharmacies, send order if we have them
        if (pharmacies.length > 0) {
          await sendOrderToPharmacies();
        }
      } 
      // If we already have pharmacies but haven't sent the order
      else if (status === "PENDING") {
        await sendOrderToPharmacies();
      }
    };

    initializeOrder();
  }, [deliveryAddress, orderId]);

  useEffect(() => {
    if (!socket || !isConnected) return;
    
    socket.on("statusUpdate", fetchOrderPharmacies);

    return () => {
      socket.off("statusUpdate", fetchOrderPharmacies);

    };

  }, [socket, isConnected]);

  // Show loading state when finding nearby pharmacies
  if (status === "FINDINGNEARBY") {
    return <SearchNearbyLoader />;
  }

  // Show error message if present
  if (error) {
    return (
      <View className="bg-white rounded-2xl p-4 items-center justify-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-2xl flex-col gap-5 py-5 w-full">
      <View className="gap-7">

        <ProcessTimeline stages={processStages} currentStageId={status} />

        <View className="border-[0.5px] border-neutral-100 mx-4" />

        {status !== "SHIPPING" ? (
          <PharmaciesNearByList
            pharmacies={selectedPharmacies}
            displayOneItem={forMap}
          />
        ) : (
          <CourierCard courier={courier} />
        )}
      </View>
    </View>
  );
};

export default OrderProcess;
