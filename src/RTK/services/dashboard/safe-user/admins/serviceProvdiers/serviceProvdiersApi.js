import { baseApi } from "../../../../baseApi";

const serviceProvidersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllServiceProviders: builder.query({
      query: (arg) => {
        const { page, limit, search } = arg || {};
        const params = new URLSearchParams();

        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (search) params.append("search", search);

        return {
          url: `/provider/get-all?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["serviceProvider"],
    }),
    getServiceProviderById: builder.query({
      query: (id) => `/provider/get?id=${id}`,
      providesTags: (result, error, id) => [{ type: "serviceProvider", id }],
    }),
    verifyServiceProvider: builder.mutation({
      query: (body) => ({
        url: "/provider/verify",
        method: "PATCH",
        body,
      }),

      invalidatesTags: ["serviceProvider"],
    }),
    approveProviderUpdate: builder.mutation({
      query: (body) => ({
        url: "/provider/approve-update",
        method: "POST",
        body,
      }),
      invalidatesTags: ["serviceProvider"],
    }),
    getSignupRequestsVerify: builder.query({
      query: (arg) => {
        const { page, limit, search } = arg || {};
        const params = new URLSearchParams();

        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (search) params.append("search", search);

        return {
          url: `/provider/pending-review?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["serviceProvider"],
    }),
    getPendingProviderUpdates: builder.query({
      query: (arg) => {
        const { page, limit, search } = arg || {};
        const params = new URLSearchParams();

        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (search) params.append("search", search);

        return {
          url: `/provider/pending-updates?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["serviceProvider"],
    }),
  }),
});

export const {
  useGetAllServiceProvidersQuery,
  useGetServiceProviderByIdQuery,
  useVerifyServiceProviderMutation,
  useApproveProviderUpdateMutation,
  useGetSignupRequestsVerifyQuery,
  useGetPendingProviderUpdatesQuery,
} = serviceProvidersApi;


