export const getMyOrder = async (axiosClient) => {
  try {
    const response = await axiosClient.get("user/getmyorders");
    return { data: response.data.orders };
  } catch (error) {
    throw new Error(error);
  }
};
