import { useAxiosClient } from "../../providers/axiosProvider";

/**
 * API call to create a new banner.
 * @param {object} bannerData - The data for the new banner.
 * @returns {Promise<{data: any} | {error: string}>}
 */
export const createBannerService = async (axiosClient = useAxiosClient(), bannerData) => {
    try {
        const response = await axiosClient.post("banner", bannerData);
        return { data: response.data };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return { error: error.response.data.message };
        }
        return { error: error.message || "Failed to create banner." };
    }
};

/**
 * API call to get all banners.
 * @returns {Promise<{data: any} | {error: string}>}
 */
export const getAllBannersService = async (axiosClient = useAxiosClient()) => {
    try {
        const response = await axiosClient.get("banner");
        return { data: response.data };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return { error: error.response.data.message };
        }
        return { error: error.message || "Failed to retrieve banners." };
    }
};

/**
 * API call to get a banner by ID.
 * @param {string} bannerId - The ID of the banner to retrieve.
 * @returns {Promise<{data: any} | {error: string}>}
 */
export const getBannerByIdService = async (axiosClient = useAxiosClient(), bannerId) => {
    try {
        const response = await axiosClient.get(`banner/${bannerId}`);
        return { data: response.data };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return { error: error.response.data.message };
        }
        return { error: error.message || "Failed to retrieve the banner." };
    }
};

/**
 * API call to update a banner by ID.
 * @param {string} bannerId - The ID of the banner to update.
 * @param {object} bannerData - The updated data for the banner.
 * @returns {Promise<{data: any} | {error: string}>}
 */
export const updateBannerService = async (axiosClient = useAxiosClient(), bannerId, bannerData) => {
    try {
        const response = await axiosClient.put(`banner/${bannerId}`, bannerData);
        return { data: response.data };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return { error: error.response.data.message };
        }
        return { error: error.message || "Failed to update the banner." };
    }
};

/**
 * API call to delete a banner by ID.
 * @param {string} bannerId - The ID of the banner to delete.
 * @returns {Promise<{data: any} | {error: string}>}
 */
export const deleteBannerService = async (axiosClient = useAxiosClient(), bannerId) => {
    try {
        const response = await axiosClient.delete(`banner/${bannerId}`);
        return { data: response.data };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return { error: error.response.data.message };
        }
        return { error: error.message || "Failed to delete the banner." };
    }
};