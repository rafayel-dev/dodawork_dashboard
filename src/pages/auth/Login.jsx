import React, { useEffect } from 'react';
import { Button, Form, Input, Card, Typography, Divider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import brandIcon from '../../../src/assets/brandIcon.svg';
import { useLoginMutation } from '../../RTK/services/auth/authApi';
import toast from 'react-hot-toast';

const { Title, Paragraph } = Typography;

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      email: 'kazimdairfishtiaque@gmail.com',
      password: '123456',
    });
  }, [form]);

  const onFinish = async (values) => {
    const { email, password } = values;

    if (!email || !password) {
      toast.error('Please fill all the fields');
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();

      if (!res?.success) {
        throw new Error(res?.message || 'Something went wrong');
      }

      if (localStorage.getItem('accessToken')) {
        localStorage.removeItem('accessToken');
      }

      localStorage.setItem('accessToken', res?.data?.accessToken);
      toast.success(res?.message || 'Login successful');

      navigate('/');
    } catch (error) {
      toast.error(error?.data?.message || error?.message || 'Something went wrong');
    }
  };

  return (
    <div className="w-full h-dvh flex max-w-screen-md mx-auto items-center justify-center">
      <Card className="flex-1" style={{ width: 500 }}>
        <div className="flex flex-col items-center justify-center mb-3">
          <Title level={3}>Login to Account</Title>
          <Paragraph>Please enter your email and password to continue</Paragraph>
        </div>
        <Divider />
        <Form
          form={form}
          name="login"
          layout="vertical"
          requiredMark={false}
          style={{ width: 450 }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input size="large" placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input size="large" type="password" placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-between">
              <Link to="/forgot-password" className="hover:underline">
                Forgot password
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              loading={isLoading}
              disabled={isLoading}
              size='large' style={{ backgroundColor: "var(--secondary-color)", color: "white" }}
              htmlType="submit"
              block
              type="primary"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <div className="flex-1 w-full flex items-center justify-center h-fit p-3 rounded-tr-[50px] rounded-br-[50px] bg-gradient-to-b from-[var(--primary-color)] to-[var(--secondary-color)]">
        <img src={brandIcon} alt="Brand Icon" className="w-48 h-48" />
      </div>
    </div>
  );
};

export default Login;
