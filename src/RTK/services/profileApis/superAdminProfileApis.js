import { baseApi } from "../baseApi";

const superAdminProfileApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminProfile: builder.query({
      query: () => ({
        url: "/super-admin/profile",
        method: "GET",
      }),
      providesTags: ["SuperAdmin"],
    }),
    editSuperAdminProfile: builder.mutation({
      query: (data) => ({
        url: "/super-admin/edit-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SuperAdmin"],
    }),
    changePass: builder.mutation({
      query: (data) => ({
        url: "auth/change-password",
        method: "PATCH", // or "POST" depending on your backend
        body: data,
      }),
    }),
  }),
});

export const {
  useGetSuperAdminProfileQuery,
  useEditSuperAdminProfileMutation,
  useChangePassMutation,
} = superAdminProfileApis;
