import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlices";
import { cardSlice } from "./reducers/cartSlices";

const rootReducer = combineReducers({
    user: userReducer,
    cart: cardSlice
})

export default rootReducer;