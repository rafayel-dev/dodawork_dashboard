import { baseApi } from "../../../../baseApi";

const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminUsers: builder.query({
            query: () => ({
                url: "/user/get-all-users",
                method: "GET",
            }),
            providesTags: ["Admin"],
        }),
    })
})

export const { useGetAdminUsersQuery } = userApi;
