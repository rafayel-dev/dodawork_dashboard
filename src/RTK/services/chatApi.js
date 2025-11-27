import { baseApi } from "./baseApi";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversationList: builder.query({
      query: () => "/chat/get-conversation-list",
      providesTags: ["Conversation"],
    }),
    getConversation: builder.query({ // New endpoint for conversation history by ID
      query: (conversationId) => `/chat/get-conversation/${conversationId}`,
      providesTags: (result, error, conversationId) => [{ type: "Conversation", id: conversationId }],
    }),
  }),
});

export const { useGetConversationListQuery, useGetConversationQuery } = chatApi; // Export the new hook
