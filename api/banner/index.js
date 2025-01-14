import { useState } from "react";
import { createBannerService, getAllBannersService, getBannerByIdService, updateBannerService, deleteBannerService } from "./banner.api";
import { useAxiosClient } from "../../providers/axiosProvider";
import { QUERY_KEYS, MUTAION_KEYS } from "../../config/common";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateBanner = () => {
    const axiosClient = useAxiosClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [MUTAION_KEYS.CREATE_BANNER],
        mutationFn: (bannerData) => createBannerService(axiosClient, bannerData),
        onSuccess: () => {
            queryClient.invalidateQueries([QUERY_KEYS.GET_ALL_BANNERS]);
        },
        onError: (error) => {
            console.error("Failed to create banner:", error.message);
        },
    });
};

export const useGetAllBanners = () => {
    const axiosClient = useAxiosClient();

    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_BANNERS],
        queryFn: () => getAllBannersService(axiosClient),
    });
};

export const useGetBannerById = (bannerId) => {
    const axiosClient = useAxiosClient();

    return useQuery({
        queryKey: [QUERY_KEYS.GET_BANNER_BY_ID, bannerId],
        queryFn: () => getBannerByIdService(axiosClient, bannerId),
        enabled: !!bannerId,
    });
};

export const useUpdateBanner = () => {
    const axiosClient = useAxiosClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [MUTAION_KEYS.UPDATE_BANNER],
        mutationFn: ({ bannerId, bannerData }) => updateBannerService(axiosClient, bannerId, bannerData),
        onSuccess: () => {
            queryClient.invalidateQueries([QUERY_KEYS.GET_ALL_BANNERS]);
        },
        onError: (error) => {
            console.error("Failed to update banner:", error.message);
        },
    });
};

export const useDeleteBanner = () => {
    const axiosClient = useAxiosClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [MUTAION_KEYS.DELETE_BANNER],
        mutationFn: (bannerId) => deleteBannerService(axiosClient, bannerId),
        onSuccess: () => {
            queryClient.invalidateQueries([QUERY_KEYS.GET_ALL_BANNERS]);
        },
        onError: (error) => {
            console.error("Failed to delete banner:", error.message);
        },
    });
};