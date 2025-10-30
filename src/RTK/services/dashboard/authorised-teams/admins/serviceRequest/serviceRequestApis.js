import { baseApi } from "../../../../baseApi";

const serviceRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllServiceRequest: builder.query({
      query: () => ({
        url: "/service-requests/get-all",
        method: "GET",
      }),
      providesTags: ["serviceRequest"],
    }),
    updateServiceRequest: builder.mutation({}),
  }),
});
export const { useGetAllServiceRequestQuery } = serviceRequestApi;
