import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
const storedToken = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : null;

const initialState = {
    user: storedUser,
    token: storedToken,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const payload = action.payload || {};
            const user = payload?.user ?? payload?.data?.user ?? null;
            const token = payload?.token ?? payload?.data?.accessToken ?? null;
            state.user = user;
            state.token = token;
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
