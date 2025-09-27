import { baseApi } from "../../baseApi";

const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query({
      query: () => ({
        url: "/manage/get-faq",
        method: "GET",
      }),
    }),
    addFaq: builder.mutation({
      query: (faq) => ({
        url: "/manage/add-faq",
        method: "POST",
        body: faq,
      }),
    }),
    updateFaq: builder.mutation({
      query: (faq) => ({
        url: "/manage/update-faq",
        method: "PATCH",
        body: faq,
      }),
    }),
    deleteFaq: builder.mutation({
      query: (faqId) => ({
        url: `/manage/delete-faq`,
        method: "DELETE",
        body: faqId,
      }),
    }),
  }),
});
export const {
  useGetFaqsQuery,
  useAddFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApi;
