import { useEffect, useState } from "react";
import { getMyOrder } from "./order.api";

export const useGetMyOrder = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await getMyOrder();
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
  }, []);

  return { data, isLoading, error };
};
