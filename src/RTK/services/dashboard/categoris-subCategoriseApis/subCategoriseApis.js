import { baseApi } from "../../baseApi";

const subCategoriseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubCategories: builder.query({
      query: () => ({
        url: `/category/get-all-subcategories`,
        method: "GET",
      }),
    }),
    createSubCategory: builder.mutation({
      query: (params) => ({
        url: `/category/add-subcategory`,
        method: "POST",
        body: params,
      }),
    }),
    updateSubCategory: builder.mutation({
      query: (params) => ({
        url: `/category/update-subcategory`,
        method: "PATCH",
        body: params,
      }),
    }),
    deleteSubCategory: builder.mutation({
      query: (params) => ({
        url: `/category/delete-subcategory`,
        method: "DELETE",
        body: params,
      }),
    }),
  }),
});

export const {
  useGetAllSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategoriseApi;
