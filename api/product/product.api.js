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

export const getPopularProducts = async (axiosClient = useAxiosClient()) => {
  try {
    const response = await axiosClient.get("product/popular-products");
    return { data: response.data };
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      return { error: error.response.data.message };
    }
    return { error: error.message || "Failed to get popular products" };
  }
};

/**
 * API-Aufruf: Holen der neuesten Produkte
 */
export const getLatestProducts = async (axiosClient = useAxiosClient()) => {
  try {
    const response = await axiosClient.get("product/latest-products");
    return { data: response.data };
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      return { error: error.response.data.message };
    }
    return { error: error.message || "Failed to get latest products" };
  }
};

/**
 * API-Aufruf: Holen der Sonderangebote
 */
export const getSpecialProducts = async (axiosClient = useAxiosClient()) => {
  try {
    const response = await axiosClient.get("product/special-products");
    return { data: response.data };
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      return { error: error.response.data.message };
    }
    return { error: error.message || "Failed to get special products" };
  }
};

export const updateProductRating = async (axiosClient, { productId, ratingId, data }) => {
  try {
    const response = await axiosClient.patch(
      `product/products/${productId}/ratings/${ratingId}`,
      data
    );
    return { data: response.data };
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || "Failed to update product rating");
  }
};

