// API function to get all blogs
export const getAllBlogs = async (axiosClient) => {
    try {
        const response = await axiosClient.get("blog/");
        return { data: response.data };
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch blogs");
    }
};