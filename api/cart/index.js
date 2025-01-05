import { useAxiosClient } from "../../providers/axiosProvider";
import { addToCart, getMyCart } from "./cart.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, MUTAION_KEYS } from "../../config/common";

export const useGetMyCart = () => {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: [QUERY_KEYS.GET_CART],
    queryFn: () => getMyCart(axiosClient),
  });
};

export const useAddToCart = () => {
  const axiosClient = useAxiosClient();

  return useMutation({
    mutationKey: [MUTAION_KEYS.ADD_TO_CART],
    mutationFn: (cartData) => addToCart(axiosClient, cartData),
    onSuccess: (data) => {
      console.log("Product added to cart successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to add to cart:", error.message);
    },
  });
};
