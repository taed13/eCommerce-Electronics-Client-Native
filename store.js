import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./redux/CartReducer";
import productReducer from "./feature/products/productSlice";
// import counterReducer from "../features/counter/counterSlice";
// import authReducer from "../features/user/userSlice";
// import blogReducer from "../features/blogs/blogSlice";
// import contactReducer from "../features/contact/contactSlice";
// import bCategoryReducer from "../features/bCategory/bCategorySlice";
// import pCategoryReducer from "../features/pCategory/pCategorySlice";
// import discountReducer from "../features/discount/discountSlice";

export default configureStore({
    reducer: {
        cart: CartReducer,
        product: productReducer,
        // auth: authReducer,
        // blog: blogReducer,
        // contact: contactReducer,
        // counter: counterReducer,
        // bCategory: bCategoryReducer,
        // pCategory: pCategoryReducer,
        // discount: discountReducer,
    },
});
