import { baseApi } from "../../baseApi";

const subCategoriseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubCategories: builder.query({
      query: ({ categoryId }) => ({
        url: `/category/get-by-id`,
        method: "GET",
        params: { categoryId },
      }),
      providesTags: ["SubCategory"],
    }),
    createSubCategory: builder.mutation({
      query: (params) => ({
        url: `/category/add-subcategory`,
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["SubCategory"],
    }),
    updateSubCategory: builder.mutation({
      query: (params) => ({
        url: `/category/update-subcategory`,
        method: "PATCH",
        body: params,
      }),
      invalidatesTags: ["SubCategory"],
    }),
    deleteSubCategory: builder.mutation({
      query: (params) => ({
        url: `/category/delete-subcategory`,
        method: "DELETE",
        params,
      }),
      invalidatesTags: ["SubCategory"],
    }),
  }),
});

export const {
  useGetAllSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategoriseApi;
