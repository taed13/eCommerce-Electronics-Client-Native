import { useEffect, useState } from "react";
import { getAllProduct, getLatestProducts, getPopularProducts, getProduct, getProducts, getSpecialProducts, updateProductRating } from "./product.api";
import { useAxiosClient } from "../../providers/axiosProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MUTAION_KEYS, QUERY_KEYS } from "../../config/common";

export const useFetchProduct = () => {
  const axiosClient = useAxiosClient();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  const fetchProduct = async (productId) => {
    setIsLoading(true);
    try {
      const response = await getProduct(axiosClient, productId);
      setData(response.data);
      return response.data;
    } catch (error) {
      setError(error.message || "An unexpected error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchProduct };
};

export const useFetchProducts = () => {
  const axiosClient = useAxiosClient();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getProducts(axiosClient);
      setData(response.data);
      return response.data;
    } catch (error) {
      setError(error.message || "An unexpected error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchProducts };
};

export const useGetAllProduct = () => {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_PRODUCT],
    queryFn: () => getAllProduct(axiosClient),
  });
};

export const useFetchPopularProducts = () => {
  const axiosClient = useAxiosClient();
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POPULAR_PRODUCTS],
    queryFn: () => getPopularProducts(axiosClient),
    staleTime: 1000 * 60 * 5,
  });
};

export const useFetchLatestProducts = () => {
  const axiosClient = useAxiosClient();
  return useQuery({
    queryKey: [QUERY_KEYS.GET_LATEST_PRODUCTS],
    queryFn: () => getLatestProducts(axiosClient),
    staleTime: 1000 * 60 * 5,
  });
};

export const useFetchSpecialProducts = () => {
  const axiosClient = useAxiosClient();
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SPECIAL_PRODUCTS],
    queryFn: () => getSpecialProducts(axiosClient),
    staleTime: 1000 * 60 * 5,
  });
};

export const useEditProductRating = () => {
  const axiosClient = useAxiosClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTAION_KEYS.UPDATE_PRODUCT_RATING],
    mutationFn: ({ productId, ratingId, data }) =>
      updateProductRating(axiosClient, { productId, ratingId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.GET_POPULAR_PRODUCTS]);
      queryClient.invalidateQueries([QUERY_KEYS.GET_LATEST_PRODUCTS]);
    },
    onError: (error) => {
      console.error("Error updating product rating:", error.message);
    },
  });
};
