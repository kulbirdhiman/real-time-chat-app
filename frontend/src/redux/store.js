import { configureStore } from '@reduxjs/toolkit';
import apiSlice from './api/apiSlice';
import authslice from './features/auth/authSlice'

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer, // Correct way to register the API slice reducer
        auth : authslice
    },
    // Optional: Adding middleware for the API slice
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
