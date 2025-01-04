import { useAxiosClient } from "../../providers/axiosProvider";

export const getCurrentUser = async (axiosClient = useAxiosClient()) => {
    try {
        const response = await axiosClient.get("user/current-user");
        return { data: response.data };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return { error: error.response.data.message };
        }
        return { error: error.message || "Failed to get user" };
    }
};

export const editUser = async (axiosClient, userData) => {
    try {
        const response = await axiosClient.put("user/edit-user", userData);
        return { data: response.data };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return { error: error.response.data.message };
        }
        return { error: error.message || "Failed to update user" };
    }
}

export const loginUserService = async (axiosClient, userData) => {
    try {
        const response = await axiosClient.post("user/login", userData);
        return { data: response.data };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return { error: error.response.data.message };
        }
        return { error: error.message || "Failed to login" };
    }
}

export const registerUserService = async (axiosClient, userData) => {
    try {
        const response = await axiosClient.post("user/register", userData);
        return { data: response.data };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("error message:::", error.response.data.message);
            return { error: error.response.data.message };
        }
        console.log("error:::", error);
        return { error: error.message || "Failed to register" };
    }
};

export const forgotPasswordService = async (axiosClient, userData) => {
    try {
        const response = await axiosClient.post("user/forgot-password-token", userData);
        return { data: response.data };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return { error: error.response.data.message };
        }
        return { error: error.message || "Failed to send forgot password email" };
    }
}