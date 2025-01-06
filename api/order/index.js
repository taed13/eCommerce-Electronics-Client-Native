import { useEffect, useState } from "react";
import { getMyOrder, checkProductInOrder, getOrderById } from "./order.api";
import { useAxiosClient } from "../../providers/axiosProvider";
import { QUERY_KEYS } from "../../config/common";
import { useQuery } from "@tanstack/react-query";

export const useGetMyOrder = () => {
  const axiosClient = useAxiosClient();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!axiosClient) return;
    const fetchOrders = async () => {
      try {
        const result = await getMyOrder(axiosClient);
        if (result.data) {
          setData(result.data);
        } else {
          setError(result.error || "Something went wrong");
        }
      } catch (error) {
        setError(error.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [axiosClient]);

  return { data, isLoading, error };
};

export const useCheckProductInOrder = () => {
  const axiosClient = useAxiosClient();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchCheckProductInOrder = async (productId) => {
    setIsLoading(true);
    try {
      const response = await checkProductInOrder(axiosClient, productId);
      setData(response.data);
      return response.data;
    } catch (error) {
      setError(error.message || "An unexpected error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchCheckProductInOrder };
};

export const useGetOrderById = (orderId) => {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: [QUERY_KEYS.GET_ORDER_BY_ID, orderId],
    queryFn: () => getOrderById(axiosClient, orderId),
    enabled: !!orderId,
  });
};