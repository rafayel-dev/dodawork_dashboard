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
  }),
});

export const { useGetAdminUsersQuery } = userApi;
