import { baseApi } from "../../../baseApi";

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: () => ({
        url: "/notification/get-all-notifications",
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),
  }),
});

export const { useGetAllNotificationsQuery } = notificationApi;
