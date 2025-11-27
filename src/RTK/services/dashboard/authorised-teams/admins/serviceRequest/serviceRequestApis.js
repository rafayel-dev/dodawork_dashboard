import { baseApi } from "../../../../baseApi";

const serviceRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllServiceRequest: builder.query({
      query: (status) => {
        const params = new URLSearchParams();
        if (status && status !== 'ALL') {
          params.append('status', status);
        }
        return {
          url: `/service-requests/get-all?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["serviceRequest"],
    }),
    updateServiceRequest: builder.mutation({}),
  }),
});
export const { useGetAllServiceRequestQuery } = serviceRequestApi;
