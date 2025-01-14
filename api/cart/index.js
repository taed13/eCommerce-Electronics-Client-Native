import { useAxiosClient } from "../../providers/axiosProvider";
import { addToCart, deleteProductFromCart, getMyCart } from "./cart.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    },
    onError: (error) => {
      console.error("Failed to add to cart:", error.message);
    },
  });
};

export const useDeleteProductFromCart = () => {
  const axiosClient = useAxiosClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTAION_KEYS.DELETE_PRODUCT_FROM_CART],
    mutationFn: (cartItemId) => deleteProductFromCart(axiosClient, cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.GET_CART]);
    },
    onError: (error) => {
      console.error("Error removing product from cart:", error.message);
    },
  });
}
