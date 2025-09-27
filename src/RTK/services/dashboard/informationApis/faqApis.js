import { baseApi } from "../../baseApi";

const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query({
      query: () => ({
        url: "/manage/get-faq",
        method: "GET",
      }),
      providesTags: ["faqs"],
    }),
    addFaq: builder.mutation({
      query: (faq) => ({
        url: "/manage/add-faq",
        method: "POST",
        body: faq,
      }),
      invalidatesTags: ["faqs"],
    }),
    updateFaq: builder.mutation({
      query: (data) => ({
        url: "/manage/update-faq",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["faqs"],
    }),
    deleteFaq: builder.mutation({
      query: (data) => ({
        url: `/manage/delete-faq`,
        method: "DELETE",
        params: data,
      }),
      invalidatesTags: ["faqs"],
    }),
  }),
});
export const {
  useGetFaqsQuery,
  useAddFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApi;
