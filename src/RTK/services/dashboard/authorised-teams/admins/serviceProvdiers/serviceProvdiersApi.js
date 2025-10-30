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
  }),
});

export const { useGetAllServiceProvidersQuery } = serviceProvidersApi;
