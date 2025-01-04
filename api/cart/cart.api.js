export const getMyCart = async (axiosClient) => {
  try {
    const response = await axiosClient.get("user/cart");
    return { data: response.data.data };
  } catch (error) {
    throw new Error(error);
  }
};
