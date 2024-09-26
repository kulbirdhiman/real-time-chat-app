import apiSlice from "./apiSlice";
import { userUrl } from "../constant";
const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (data) => ({
        url :`${userUrl}`,
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url :`${userUrl}/login`,
        method: "POST",
        body: data,
      }),
    }),
    getAllUser: builder.query({
      query: () => ({
        url:`${userUrl}`,
        method: "GET",
      }),
    }),
  }),
});

export const{useGetAllUserQuery,useLoginMutation,useSignUpMutation} = userSlice