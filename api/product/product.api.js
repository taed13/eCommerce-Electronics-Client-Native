import { useAxiosClient } from "../../providers/axiosProvider";

export const getProduct = async (axiosClient = useAxiosClient(), productId) => {
  try {
    const response = await axiosClient.get(`product/${productId}`);
    return { data: response.data };
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      return { error: error.response.data.message };
    }
    return { error: error.message || "Failed to get product" };
  }
};

export const getProducts = async (axiosClient = useAxiosClient()) => {
  try {
    const response = await axiosClient.get(`product`);
    return { data: response.data };
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      return { error: error.response.data.message };
    }
    return { error: error.message || "Failed to get products" };
  }
};

export const getAllProduct = async (axiosClient) => {
  try {
    const response = await axiosClient.get(`product`);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
