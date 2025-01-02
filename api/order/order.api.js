export const getMyOrder = async (axiosClient) => {
  try {
    const response = await axiosClient.get("user/getmyorders");
    return { data: response.data.orders };
  } catch (error) {
    return { error: error.message || "Failed to fetch orders" };
  }
};
