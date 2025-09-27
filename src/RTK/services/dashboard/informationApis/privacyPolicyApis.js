import { baseApi } from "../../baseApi";

const privacyPolicyApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrivacyPolicy: builder.query({
      query: () => ({
        url: "/manage/get-privacy-policy",
        method: "GET",
      }),
      providesTags: ["PrivacyPolicy"],
    }),
    addPrivacyPolicy: builder.mutation({
      query: (data) => ({
        url: "/manage/add-privacy-policy",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PrivacyPolicy"],
    }),
  }),
});

export const { useGetPrivacyPolicyQuery, useAddPrivacyPolicyMutation } =
  privacyPolicyApis;
