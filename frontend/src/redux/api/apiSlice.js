import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const apiSlice = createApi({
    baseQuery : fetchBaseQuery({baseUrl : ""}),
    endpoints : ()=>({})
});

export default apiSlice