import { baseApi } from "../../baseApi";

const categorisApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => ({
        url: "/category/get-all",
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),
    createCategory: builder.mutation({
      query: (category) => ({
        url: `/category/create`,
        method: "POST",
        body: category,
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation({
      query: (category) => ({
        url: `/category/update`,
        method: "PATCH",
        body: category,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/delete`,
        method: "DELETE",
        params: { id },
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categorisApi;
