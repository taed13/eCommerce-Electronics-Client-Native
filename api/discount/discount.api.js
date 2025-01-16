import { useAxiosClient } from "../../providers/axiosProvider";

export const applyDiscount = async (axiosClient = useAxiosClient(), data) => {
    try {
        const response = await axiosClient.post("discount/apply-discount", data);
        return { data: response.data };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return { error: error.response.data.message };
        }
        return { error: error.message || "Failed to apply discount" };
    }
};

export const calculateShippingFee = async (axiosClient = useAxiosClient(), data) => {
    try {
        const response = await axiosClient.post("discount/shipping/calculate", data);
        return { data: response.data.data };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return { error: error.response.data.message };
        }
        return { error: error.message || "Failed to calculate shipping fee" };
    }
}