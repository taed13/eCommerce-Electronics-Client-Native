import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "./productService";
// import { toast } from "react-toastify";

export const getAllProducts = createAsyncThunk("product/get", async (data, thunkAPI) => {
  try {
    return await productService.getProducts(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const getAProduct = createAsyncThunk("product/getAProduct", async (id, thunkAPI) => {
  try {
    return await productService.getSingleProduct(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const addToWishlist = createAsyncThunk("product/wishlist", async (prodId, thunkAPI) => {
  try {
    return await productService.addToWishlist(prodId);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const addRating = createAsyncThunk("product/rating", async (data, thunkAPI) => {
  try {
    return await productService.rateProduct(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

const productState = {
  product: "",
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const productSlice = createSlice({
  name: "product",
  initialState: productState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.product = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToWishlist.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        // toast.success(action.payload.message);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(getAProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.singleproduct = action.payload;
        // toast.success(action.payload.message);
      })
      .addCase(getAProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(addRating.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addRating.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.rating = action.payload;
        state.message = action.payload.message;
        // if (state.isSuccess) {
        //     toast.success("Rating added successfully");
        // }
      })
      .addCase(addRating.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      });
  },
});

export default productSlice.reducer;
