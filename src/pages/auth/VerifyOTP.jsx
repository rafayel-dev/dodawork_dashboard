import { Button, Form, Input } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForgetPassOtpVerifyMutation } from '../../RTK/services/auth/authApi';
import toast from 'react-hot-toast';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [forgetPassOtpVerify, { isLoading }] = useForgetPassOtpVerifyMutation();
  
  const email = location.state?.email || 'your.email@example.com';

    const handleSubmit = async (values) => {

      try {
        await forgetPassOtpVerify({ email, code: values.otp }).unwrap();
        toast.success("OTP verified successfully!");
        setTimeout(() => {
        navigate("/reset-password", { state: { email } });
        }, 1500);

      } catch (err) {
        toast.error(err.data?.message || "Invalid or expired OTP. Please try again.");
        console.error("OTP Verification failed:", err);

      }

    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a 6-digit verification code to {email}
          </p>
        </div>

        <Form
          layout="vertical"
          className="mt-8"
          onFinish={handleSubmit}
        >
          <div className='flex items-center justify-center'>
            <Form.Item name="otp" rules={[{ required: true, message: 'Please enter the OTP' }]}>
              <Input.OTP length={6} size="large" placeholder="Enter OTP" />
            </Form.Item>
          </div>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={isLoading}
            style={{
              backgroundColor: "var(--secondary-color)",
              color: "white",
              outline: "none",
              border: "none",
            }}
            block
          >
            Verify
          </Button>
        </Form>

        <div className="text-center text-sm mt-2 text-gray-600">
          Didn't receive a code?{' '}
          <button
            type="button"
            className="font-medium text-[var(--secondary-color)] hover:!underline"
            onClick={() => console.log('Resend OTP')}
          >
            Resend code
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
