export const getMyOrder = async (axiosClient) => {
  try {
    const response = await axiosClient.get("user/getmyorders");
    return { data: response.data.orders };
  } catch (error) {
    throw new Error(error);
  }
};

export const checkProductInOrder = async (axiosClient, productId) => {
  if (!productId) {
    return { data: null };
  }

  try {
    const response = await axiosClient.get(`order/check-product-in-order/${productId}`);

    return { data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return {
        data: error.response.data,
      };
    } else {
      throw new Error(error.response?.data?.message || "An unexpected error occurred");
    }
  }
};
