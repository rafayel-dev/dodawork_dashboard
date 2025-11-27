import { Button, Form, Input, message } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForgotPasswordMutation } from '../../RTK/services/auth/authApi';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      await forgotPassword({ email: values.email }).unwrap();
      toast.success("OTP sent successfully to your email!");
      setTimeout(() => {
      navigate("/verify-otp", { state: { email: values.email } });
      }, 1500);
    } catch (err) {
      toast.error(err.data?.message || "Failed to send OTP. Please check the email and try again.");
      console.error("Forgot Password failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a otp to reset your password.
          </p>
        </div>

        <Form layout="vertical" className="mt-8 space-y-6" onFinish={handleSubmit}>
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input
              size="large"
              name="email"
              type="email"
              placeholder="Email address"
            />
          </Form.Item>

          <div>
            <Button
              loading={isLoading}
              size="large"
              style={{ backgroundColor: "var(--secondary-color)", color: "white", outline: "none", border: "none" }}
              htmlType="submit"
              block
            >
              Send Otp
            </Button>
          </div>
        </Form>

        <div className="text-center mt-4">
          <Link to="/login" className="font-medium text-[var(--secondary-color)] hover:!underline text-sm">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
