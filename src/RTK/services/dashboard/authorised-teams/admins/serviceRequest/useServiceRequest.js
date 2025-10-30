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
  }),
});
export const { useGetAllServiceRequestQuery } = serviceRequestApi;
