import { baseApi } from "../../../../baseApi";

const serviceRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllServiceRequest: builder.query({
      query: ({ status, page, limit }) => {
        const params = new URLSearchParams();
        if (status && status !== 'ALL') {
          params.append('status', status);
        }
        if (page) {
          params.append('page', page);
        }
        if (limit) {
          params.append('limit', limit);
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
