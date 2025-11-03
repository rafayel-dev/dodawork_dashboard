import { baseApi } from "../../../../baseApi";

const serviceProvidersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllServiceProviders: builder.query({
      query: () => ({
        url: "/provider/get-all",
        method: "GET",
      }),
      providesTags: ["serviceProvider"],
    }),
    verifyServiceProvider: builder.mutation({
      query: (body) => ({
        url: "/provider/verify",
        method: "PATCH", // or PATCH — depends on your backend
        body,
      }),

      invalidatesTags: ["serviceProvider"],
    }),
  }),
});

export const {
  useGetAllServiceProvidersQuery,
  useVerifyServiceProviderMutation,
} = serviceProvidersApi;
