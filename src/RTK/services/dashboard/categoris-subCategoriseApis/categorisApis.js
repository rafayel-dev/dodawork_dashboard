import { baseApi } from "../../baseApi";

const categorisApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => ({
        url: "/category/get-all",
        method: "GET",
      }),
    }),
    createCategory: builder.mutation({
      query: (category) => ({
        url: `/category/create`,
        method: "POST",
        body: category,
      }),
    }),
    updateCategory: builder.mutation({
      query: (category) => ({
        url: `/category/update/${category.id}`,
        method: "PATCH",
        body: category,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/category/delete/${categoryId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categorisApi;
