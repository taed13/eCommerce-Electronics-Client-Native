import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser } from "../../api/user/user.api";

export const fetchCurrentUser = createAsyncThunk(
    "user/fetchCurrentUser",
    async (_, thunkAPI) => {
        try {
            const axiosClient = thunkAPI.extra?.axiosClient;
            if (!axiosClient) throw new Error("AxiosClient is not initialized");
            const response = await getCurrentUser(axiosClient);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        updateUserSuccess(state, action) {
            state.currentUser = { ...state.currentUser, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentUser = action.payload;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { updateUserSuccess } = userSlice.actions;
export default userSlice.reducer;
