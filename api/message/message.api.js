export const getMessage = async (axiosClient, fromId, toId) => {
    try {
        const response = await axiosClient.post("messages/getmsg", {
            from: fromId,
            to: toId,
        });
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Không thể tải tin nhắn.");
    }
};

export const sendMessage = async (axiosClient, messageData) => {
    try {
        const response = await axiosClient.post("messages/addmsg", messageData);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Không thể gửi tin nhắn.");
    }
};
