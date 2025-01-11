import { useAxiosClient } from "../../providers/axiosProvider";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../config/common";
import { getAllBlogs } from "./blog.api";

// Custom React Query Hook for fetching blogs
export const useGetAllBlogs = () => {
    const axiosClient = useAxiosClient();

    return useQuery({
        queryKey: [QUERY_KEYS.GET_BLOGS],
        queryFn: () => getAllBlogs(axiosClient),
        onError: (error) => {
            console.error("Failed to fetch blogs:", error.message);
        },
    });
};
