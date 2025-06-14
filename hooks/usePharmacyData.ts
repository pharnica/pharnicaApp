import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export interface DeliveryLocation {
  address: string;
  locationLatitude: number;
  locationLongitude: number;
  title: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
}

export interface Order {
  id: string;
  deliveryLocation: DeliveryLocation;
  status: string;
  doorDropOff: boolean;
  priceRequesting: boolean;
  failureReason?: string;
}

export interface OrderPharmacy {
  id: string;
  pharmacy : Pharmacy;
  distance: string;
  status: string;
  price: number;
  priceStatus: string;
  failureReason?: string;
  isHoldingOrder: string;
}

const usePharmacyData = (orderId: string) => {

  const [order, setOrder] = useState<Order | null>(null);
  const [orderPharmacy, setOrderPharmacy] = useState<OrderPharmacy | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(
    async (silent = false) => {
      try {
        if (!silent) setIsLoading(true);

        console.log("is fetching...");

        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_SERVER_SIDE_API}/api/orders/fetchOrderAndOrderPhamracy`,
          { params: { orderId } }
        );
        
        if (res.status === 200) {
          setOrder(res.data.order);
          setOrderPharmacy(res.data.orderPharmacy);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [orderId]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    order,
    orderPharmacy,
    isLoading,
    refetch: () => fetchData(true),
  };
};

export default usePharmacyData;
