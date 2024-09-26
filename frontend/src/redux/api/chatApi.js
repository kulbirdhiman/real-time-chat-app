import apiSlice from "./apiSlice";
import { ChatURl } from "../constant";
const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: ({message, id}) => ({
        // res : console.log(id),
        url : `${ChatURl}/${id}`,
        method: "POST",
        body: {message},
      }),
    }),
    getAllchat: builder.query({
      query: () => ({
        url : `${ChatURl}`,
        method: "GET",
      }),
    }),
    
  }),
});

export const {
  useSendMessageMutation,
  useGetAllchatQuery,
  useGetUSerChatQuery,
} = chatApi;
