import { baseApi } from "../../../../baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query({
      query: ({ searchTerm = "", page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        if (searchTerm) params.append("searchTerm", searchTerm);
        params.append("page", page);
        params.append("limit", limit);
        return {
          url: `/user/get-all-users?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Admin", "user"],
    }),
    blockUser: builder.mutation({
      query: (body) => ({
        url: "/user/update-block-unblock-user",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Admin", "User"],
    }),
  }),
});

export const { useGetAdminUsersQuery, useBlockUserMutation } = userApi;
