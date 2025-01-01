import axiosInstance from "../axiosInstance";

export const getMyOrder = async () => {
  try {
    const response = await axiosInstance.get("user/getmyorders");
    console.log({ response });
    return { data: response.data.orders };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { error: error.message || "Failed to fetch orders" };
  }
};
