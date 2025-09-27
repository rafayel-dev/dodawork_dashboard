import { baseApi } from "../baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (credentials) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: credentials,
      }),
    }),
    forgetPassOtpVerify: builder.mutation({
      query: (credentials) => ({
        url: "/auth/forget-pass-otp-verify",
        method: "POST",
        body: credentials,
      }),
    }),
    resetPassword: builder.mutation({
      query: (credentials) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: credentials,
      }),
    }),
    activationCodeResend: builder.mutation({
      query: (credentials) => ({
        url: "/auth/activation-code-resend",
        method: "POST",
        body: credentials,
      }),
    }),
    activationCodeVerify: builder.mutation({
      query: (credentials) => ({
        url: "/auth/activation-code-verify",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useForgetPassOtpVerifyMutation,
  useActivationCodeResendMutation,
  useActivationCodeVerifyMutation,
} = authApi;
