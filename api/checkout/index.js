import { useMutation } from "@tanstack/react-query";
import { MUTAION_KEYS } from "../../config/common";
import { useAxiosClient } from "../../providers/axiosProvider";
import { createOrderWithDiscount, purchase } from "./checkout.api";

export const useCreateOrder = () => {
  const axiosClient = useAxiosClient();

  return useMutation({
    mutationKey: [MUTAION_KEYS.CREATE_ORDER],
    mutationFn: (payload) => createOrderWithDiscount(axiosClient, payload),
  });
};

export const usePurchase = () => {
  const axiosClient = useAxiosClient();

  return useMutation({
    mutationKey: [MUTAION_KEYS.PURCHASE],
    mutationFn: (payload) => purchase(axiosClient, payload),
  });
};
