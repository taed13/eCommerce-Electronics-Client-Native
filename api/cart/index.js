import { useAxiosClient } from "../../providers/axiosProvider";
import { getMyCart } from "./cart.api";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../config/common";

export const useGetMyCart = () => {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: [QUERY_KEYS.GET_CART],
    queryFn: () => getMyCart(axiosClient),
  });
};
