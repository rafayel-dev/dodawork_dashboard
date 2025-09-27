import { baseApi } from "../../baseApi";

const termsApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTerms: builder.query({
      query: () => ({
        url: "/manage/get-terms-conditions",
        method: "GET",
      }),
      providesTags: ["Terms"],
    }),
    addTerms: builder.mutation({
      query: (data) => ({
        url: "/manage/add-terms-conditions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Terms"],
    }),
  }),
});

export const { useGetTermsQuery, useAddTermsMutation } = termsApis;
