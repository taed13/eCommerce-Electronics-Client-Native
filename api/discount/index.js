import { useEffect, useState } from "react";
import { applyDiscount, calculateShippingFee } from "./discount.api";
import { useAxiosClient } from "../../providers/axiosProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

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

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  const calculate = async (data) => {
    setIsLoading(true);
    try {
      const response = await calculateShippingFee(axiosClient, data);
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

  return { isLoading, data, error, calculate };
}
