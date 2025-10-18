import React, { useEffect } from "react";
import { Button, Form, Input } from "antd";
import toast from "react-hot-toast";
import { useEditSuperAdminProfileMutation } from "../../RTK/services/profileApis/superAdminProfileApis";

const ProfileEdit = ({ image, data }) => {
  const [form] = Form.useForm();

  const [setProfileUpdate, { isLoading: isProfileUpdate }] =
    useEditSuperAdminProfileMutation();

  useEffect(() => {
    form.setFieldsValue({
      name: data?.name,
      email: data?.email,
      phoneNumber: data?.phoneNumber,
      address: data?.address,
    });
  }, [data]);

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("name", values?.name);
    formData.append("email", values?.email);
    formData.append("phoneNumber", values?.phoneNumber);
    formData.append("address", values?.address);
    if (image === null) {
      formData.delete("profile_image");
    } else {
      formData.append("profile_image", image);
    }

    try {
      await setProfileUpdate(formData).unwrap().then((res) => {
        if (res?.success) {
          toast.success("Profile updated successfully");
        }
      });
    } catch (error) {
      toast.error(error?.data?.message || error?.message || "Failed to update profile");
    }
  };

  return (
    <div>
      <p className="text-black text-3xl text-center">Edit Your Profile</p>
      <Form
        className="text-black"
        requiredMark={false}
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label={<span className="text-black">Name</span>}
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input
            placeholder="Name"
            size="large"
            className="p-2 w-full outline-none border-none !text-black"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label={<span className="text-black">Email</span>}
        >
          <Input
            disabled
            type="email"
            size="large"
            placeholder="Email"
            className="cursor-not-allowed p-2 w-full outline-none border-none !bg-white text-black"
          />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label={<span className="text-black">Contact Number</span>}
        >
          <Input
            type="text"
            size="large"
            placeholder="Phone Number"
            className="cursor-not-allowed p-2 w-full outline-none border-none !bg-white text-black"
          />
        </Form.Item>
        <Form.Item
          name="address"
          label={<span className="text-black">Address</span>}
        >
          <Input
            type="text"
            size="large"
            placeholder="Address"
            className="cursor-not-allowed p-2 w-full outline-none border-none !bg-white text-black"
          />
        </Form.Item>
        <Button
          htmlType="submit"
          disabled={isProfileUpdate}
          loading={isProfileUpdate}
          style={{
            color: "#fff",
            height: 40,
          }}
          className="!bg-[var(--secondary-color)] !hover:bg-[var(--secondary-color)] !text-black w-full"
        >
          Update Profile
        </Button>
      </Form>
    </div>
  );
};

export default ProfileEdit;
