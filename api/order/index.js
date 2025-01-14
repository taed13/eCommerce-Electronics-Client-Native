import { useState } from "react";
import { getMyOrder, checkProductInOrder, getOrderById, cancelOrder } from "./order.api";
import { useAxiosClient } from "../../providers/axiosProvider";
import { MUTAION_KEYS, QUERY_KEYS } from "../../config/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetMyOrder = () => {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: [QUERY_KEYS.GET_MY_ORDER],
    queryFn: () => getMyOrder(axiosClient),
    enabled: !!axiosClient,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
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

export const useCancelOrder = () => {
  const axiosClient = useAxiosClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.CANCEL_ORDER],
    mutationFn: (orderId) => cancelOrder(axiosClient, orderId),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.GET_MY_ORDER]);
      queryClient.invalidateQueries([QUERY_KEYS.GET_ORDER_BY_ID]);
    },
    onError: (error) => {
      console.error("Error cancelling order:", error.message);
    },
  });
};