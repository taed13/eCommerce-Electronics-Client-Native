import axiosInstance from "../../api/axiosInstance";

const getProducts = async (data) => {
  const queryParams = new URLSearchParams();

  if (data?.brand?.length) {
    queryParams.append("product_brand", data.brand);
  }
  if (data?.category?.length) {
    queryParams.append("product_category", data.category);
  }
  if (data?.minPrice) {
    queryParams.append("product_price[gte]", data.minPrice);
  }
  if (data?.maxPrice) {
    queryParams.append("product_price[lte]", data.maxPrice);
  }
  if (data?.tag?.length) {
    queryParams.append("product_tags", data.tag);
  }
  if (data?.color?.length) {
    queryParams.append("product_color", data.color);
  }
  if (data?.sort) {
    queryParams.append("sort", data.sort);
  }

  const response = await axiosInstance.get(`product?${queryParams.toString()}`);

  if (response.data) {
    return response.data;
  }
};

const getSingleProduct = async (id) => {
  const response = await axiosInstance.get(`product/${id}`);
  if (response.data) {
    return response.data;
  }
};

const addToWishlist = async (prodId) => {
  const response = await axiosInstance.put(`product/wishlist`, {
    prodId,
  });

  if (response.data) {
    return response.data;
  }
};

const rateProduct = async (data) => {
  const response = await axiosInstance.put(`product/rating`, data);

  if (response.data) {
    return response.data;
  }
};

export const productService = {
  getProducts,
  addToWishlist,
  getSingleProduct,
  rateProduct,
};
