import { baseApi } from "./baseApi";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversationList: builder.query({
      query: () => "/chat/get-conversation-list",
      providesTags: ["Conversation"],
    }),
    getConversation: builder.query({
      query: (conversationId) => `/chat/get-conversation/${conversationId}`,
      providesTags: (result, error, conversationId) => [
        { type: "Conversation", id: conversationId },
      ],
    }),

    // sendChatMedia: builder.mutation({
    //   query: (formData) => ({
    //     url: "/chat/chat-images-video",
    //     method: "POST",
    //     body: formData,
    //   }),
    //   invalidatesTags: ["Conversation"],
    // }),
  }),
});

export const { useGetConversationListQuery, useGetConversationQuery  } = chatApi;
