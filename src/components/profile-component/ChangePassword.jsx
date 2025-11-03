import React from "react";
import { Button, Form, Input, Spin } from "antd";
import { useChangePassMutation } from "../../RTK/services/profileApis/superAdminProfileApis";
import toast from "react-hot-toast";
// import { useChangePasswordMutation } from "../../src/Redux/Apis/auth/changePasswordApis";
// import toast from "react-hot-toast";

const ChangePassword = () => {
  const [changePass, { isLoading }] = useChangePassMutation();
  const [form] = Form.useForm();
  // const [changePassword, { isLoading: isNewPassChange }] =
  //   useChangePasswordMutation();

  const onFinish = async (values) => {
    console.log(values);
    try {
      // await changePassword({ data: values }).unwrap();
      //   toast.success("Password changed successfully (dummy)");

      await changePass(values).unwrap();
      // console.log("✅ Password changed successfully:", response);
      toast.success("Password changed successfully");
      form.resetFields();
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error("Failed to change password");

      //   toast.error("Failed to change Password.");
    }
  };
  if (isLoading) {
    return <div>....</div>;
  }

  return (
    <Form
      requiredMark={false}
      form={form}
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        name="oldPassword"
        label={<span className="text-black">Old Password</span>}
        rules={[{ required: true, message: "Old Password is required" }]}
      >
        <Input.Password
          size="large"
          placeholder="*****************"
          className="p-2 w-full outline-none"
        />
      </Form.Item>

      <Form.Item
        name="newPassword"
        label={<span className="text-black">New Password</span>}
        rules={[{ required: true, message: "New Password is required" }]}
      >
        <Input.Password
          size="large"
          placeholder="*****************"
          className="p-2 w-full outline-none"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label={<span className="text-black">Confirm Password</span>}
        rules={[{ required: true, message: "Confirm Password is required" }]}
      >
        <Input.Password
          size="large"
          placeholder="*****************"
          className="p-2 w-full outline-none"
        />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        // disabled={isNewPassChange}
        style={{
          backgroundColor: "var(--secondary-color)",
          color: "#fff",
          height: 40,
        }}
        className=" w-full"
      >
        {/* {isNewPassChange ? <Spin /> : "Update password"} */}
        Update password
      </Button>
    </Form>
  );
};

export default ChangePassword;
