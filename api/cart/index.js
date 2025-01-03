import { useEffect, useState } from "react";
import { useAxiosClient } from "../../providers/axiosProvider";
import { getMyCart } from "./cart.api";

export const useGetMyCart = () => {
  const axiosClient = useAxiosClient();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!axiosClient) return;
    const fetchCart = async () => {
      try {
        const result = await getMyCart(axiosClient);
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

    fetchCart();
  }, [axiosClient]);

  return { data, isLoading, error };
};
