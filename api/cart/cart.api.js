export const getMyCart = async (axiosClient) => {
  try {
    const response = await axiosClient.get("user/cart");
    return { data: response.data.data };
  } catch (error) {
    throw new Error(error);
  }
};

export const addToCart = async (axiosClient, cartData) => {
  try {
    const response = await axiosClient.post("user/cart/add-to-cart", cartData);
    return { data: response.data };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add to cart");
  }
};