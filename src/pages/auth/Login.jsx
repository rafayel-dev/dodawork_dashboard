import React, { useEffect } from 'react';
import { Button, Form, Input, Flex, Card, Typography, Divider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import brandIcon from "../../../src/assets/brandIcon.svg"
import { useLoginMutation } from '../../RTK/services/auth/authApi';
import toast from 'react-hot-toast';
const { Title, Paragraph } = Typography;
const Login = () => {
  const [login, { isLoading }] = useLoginMutation()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  // only for development
  useEffect(() => {
    form.setFieldsValue({
      email: "kazimdairfishtiaque@gmail.com",
      password: "123456",
    })
  }, [])
  const onFinish = async (values) => {
    try {
      if (!values?.email || !values?.password) {
        throw new Error("Please fill all the fields")
      }
      await login(values).unwrap().then(async (res) => {
        if (res?.success) {
          const token = localStorage.getItem("accessToken")
          if (token) {
            localStorage.removeItem("accessToken")
          }
          localStorage.setItem("accessToken", res?.data?.accessToken)
          if (token) {
            toast.success(res?.message || "Login successful")
            await navigate("/")
          }
        } else {
          throw new Error(res?.message || "Something went wrong")
        }
      })
    } catch (error) {
      toast.error(error?.data?.message || error?.message || "Something went wrong")
    }
  };
  return (
    <div className='w-full h-dvh flex max-w-screen-md mx-auto items-center justify-center'>
      <Card className='flex-1' style={{ width: 500 }}>
        <div className='flex items-center justify-center flex-col mb-3'>
          <Title level={3}>Login to Account</Title>
          <Paragraph>Please enter your email and password to continue</Paragraph>
        </div>
        <Divider />
        <Form
          layout="vertical"
          requiredMark={false}
          name="login"
          form={form}
          style={{ width: 450 }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input size='large' placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input size='large' type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between" align="center">
              {/* <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item> */}
              <Link to="/forgot-password" type='Link' className='hover:!underline'>Forgot password</Link>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button loading={isLoading} disabled={isLoading} size='large' style={{ backgroundColor: "var(--secondary-color)", color: "white" }} block type="primary" htmlType="submit">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <div className='flex-1 w-full flex items-center justify-center h-fit p-3 rounded-tr-[50px] rounded-br-[50px] bg-gradient-to-b from-[var(--primary-color)] to-[var(--secondary-color)]'>
        <img className='w-48 h-48' src={brandIcon} alt="" />
      </div>
    </div>
  );
};
export default Login;