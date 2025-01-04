export const createOrderWithDiscount = async (axiosClient, orderDetail) => {
  try {
    const response = await axiosClient.post(`order/create-order-with-discount`, orderDetail);
    return response.data.order;
  } catch (error) {
    throw new Error(error);
  }
};

export const purchase = async (axiosClient, data) => {
  try {
    const response = await axiosClient.post("user/order/purchase", data);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const purchaseSuccess = async (axiosClient, sessionId) => {
  try {
    const response = await axiosClient.post(`order/stripe-webhook/${sessionId}`);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
