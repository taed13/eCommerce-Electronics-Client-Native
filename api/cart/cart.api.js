export const getMyCart = async (axiosClient) => {
  try {
    const response = await axiosClient.get("user/cart");
    console.log("cart", response);
    return { data: response.data.data };
  } catch (error) {
    return { error: error.message || "Failed to fetch orders" };
  }
};
