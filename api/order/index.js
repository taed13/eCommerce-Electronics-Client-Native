import { useEffect, useState } from "react";
import { getMyOrder } from "./order.api";
import { useAxiosClient } from "../../providers/axiosProvider";

export const useGetMyOrder = () => {
  const axiosClient = useAxiosClient();
  console.log({ axiosClient });
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
