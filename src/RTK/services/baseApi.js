import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../utils/optimizationFunction";

const baseQuery = fetchBaseQuery({
  reducerPath: "apis",
  baseUrl: baseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseApi = createApi({
  baseQuery,
  tagTypes: [
    "Categories",
    "SubCategory",
    "Terms",
    "PrivacyPolicy",
    "faqs",
    "Admin",
    "SuperAdmin"
  ],
  endpoints: () => ({}),
});
