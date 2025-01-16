import { useEffect, useState } from "react";
import { applyDiscount, calculateShippingFee } from "./discount.api";
import { useAxiosClient } from "../../providers/axiosProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MUTAION_KEYS } from "../../config/common";
import { useMutation } from "@tanstack/react-query";

export const useApplyDiscount = () => {
  const axiosClient = useAxiosClient();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  const apply = async (discountCode) => {
    setIsLoading(true);
    try {
      const response = await applyDiscount(axiosClient, discountCode);
      setData(response.data);
      return response.data;
    }
    catch (error) {
      setError(error.message || "An unexpected error occurred");
      return null;
    }
    finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, apply };
}

export const useCalculateShippingFee = () => {
  const axiosClient = useAxiosClient();

  return useMutation({
    mutationKey: [MUTAION_KEYS.CALCULATE_SHIPPING_FEE],
    mutationFn: (data) => calculateShippingFee(axiosClient, data),
    onSuccess: (data) => {
      console.log("Shipping fee calculated successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to calculate shipping fee:", error.message);
    },
  });
}
