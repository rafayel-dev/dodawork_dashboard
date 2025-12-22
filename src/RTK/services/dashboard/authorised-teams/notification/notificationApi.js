import { baseApi } from "../../../baseApi";

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/notification/get-all-notifications?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),
    getNotification: builder.query({
      query: (notificationId) =>
        `/notification/get-notification?notificationId=${notificationId}`,
    }),
  }),
});

export const { useGetAllNotificationsQuery, useLazyGetNotificationQuery } =
  notificationApi;
