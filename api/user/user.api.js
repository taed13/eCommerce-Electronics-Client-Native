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
            return { error: error.response.data.message };
        }
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

export const setDefaultAddressService = async (axiosClient, addressId) => {
    try {
        const response = await axiosClient.put("user/set-default-address", { addressId });
        return { data: response.data };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return { error: error.response.data.message };
        }
        return { error: error.message || "Failed to set default address" };
    }
};

export const updateAddressService = async (axiosClient, addressId, addressData) => {
    try {
        const response = await axiosClient.patch(`user/update-address/${addressId}`, addressData);
        return { data: response.data };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return { error: error.response.data.message };
        }
        return { error: error.message || "Failed to update address" };
    }
};

export const deleteAddressService = async (axiosClient, addressId) => {
    try {
        const response = await axiosClient.delete(`user/address/${addressId}`);
        return { data: response.data };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return { error: error.response.data.message };
        }
        return { error: error.message || "Failed to delete address" };
    }
};

export const saveAddressService = async (axiosClient, address) => {
    try {
        const response = await axiosClient.put("user/save-address", { address });
        return { data: response.data };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return { error: error.response.data.message };
        }
        return { error: error.message || "Failed to save address" };
    }
};