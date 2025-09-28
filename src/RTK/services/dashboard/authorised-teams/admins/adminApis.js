import { baseApi } from "../../../baseApi";

const adminApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdmin: builder.query({
      query: (params) => ({
        url: "/admin/get-all-admins",
        method: "GET",
        params,
      }),
      providesTags: ["Admin"],
    }),
    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/post-admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),
    updateAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/update-admin",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),
    deleteAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/delete-admin",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),
    blockUnblockAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/block-unblock-admin",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const {
  useGetAllAdminQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useBlockUnblockAdminMutation,
} = adminApis;
