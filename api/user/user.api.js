import { useAxiosClient } from "../../providers/axiosProvider";

export const getCurrentUser = async (axiosClient = useAxiosClient()) => {
    try {
        const response = await axiosClient.get("user/current-user");
        return { data: response.data };
    } catch (error) {
        return { error: error.message || "Failed to fetch orders" };
    }
};

export const editUser = async (axiosClient, userData) => {
    try {
        const response = await axiosClient.put("user/edit-user", userData);
        return { data: response.data };
    } catch (error) {
        return { error: error.message || "Failed to update user" };
    }
}

export const loginUserService = async (axiosClient, userData) => {
    try {
        const response = await axiosClient.post("user/login", userData);
        return { data: response.data };
    } catch (error) {
        return { error: error.message || "Failed to login" };
    }
}
