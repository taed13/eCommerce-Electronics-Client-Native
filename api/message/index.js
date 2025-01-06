import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "../../config/common";
import { useAxiosClient } from "../../providers/axiosProvider";
import { getMessage, sendMessage } from "./message.api";

export const useGetMessage = (fromId, toId) => {
    const axiosClient = useAxiosClient();

    return useQuery({
        queryKey: [QUERY_KEYS.GET_MESSAGE, fromId, toId],
        queryFn: () => getMessage(axiosClient, fromId, toId),
        staleTime: 10000,
    });
};

export const useSendMessage = () => {
    const axiosClient = useAxiosClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (messageData) => sendMessage(axiosClient, messageData),
        onSuccess: () => {
            queryClient.invalidateQueries([QUERY_KEYS.GET_MESSAGE, messageData.from, messageData.to]);
        },
    });
};