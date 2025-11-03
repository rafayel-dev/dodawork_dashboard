import { baseApi } from "../../../../baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query({
      // ✅ Accept optional searchTerm
      query: (searchTerm = "") => ({
        url: `/user/get-all-users${
          searchTerm ? `?searchTerm=${searchTerm}` : ""
        }`,
        method: "GET",
      }),
      providesTags: ["Admin", "user"],
    }),
    blockUser: builder.mutation({
      query: (body) => ({
        url: "/user/update-block-unblock-user",
        method: "PATCH",
        body, // expects { authId, isBlocked }
      }),
      invalidatesTags: ["Admin", "User"],
    }),
  }),
});

export const { useGetAdminUsersQuery, useBlockUserMutation } = userApi;
