export const createOrderWithDiscount = async (axiosClient, orderDetail) => {
  try {
    const response = await axiosClient.post(`order/create-order-with-discount`, orderDetail);
    console.log("createOrderWithDiscount", response);
    return response.data.order;
  } catch (error) {
    return { error: error.message || "Failed to create orders" };
  }
};

export const purchase = async (axiosClient, data) => {
  try {
    const response = await axiosClient.post("user/order/purchase", data);
    console.log("purchase", response);
    return response.data;
  } catch (error) {
    return { error: error.message || "Failed to purchase" };
  }
};
