import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import ImageUploader from "../../../components/common/ImageUploader";
import { useEffect } from "react";
import { useCreateAdminMutation, useUpdateAdminMutation } from "../../../RTK/services/dashboard/authorised-teams/admins/adminApis";
import toast from "react-hot-toast";
import { imageUrl } from "../../../utils/optimizationFunction";

function AdminForm({ openEdit, data, hide }) {
    const [createAdmin, { isLoading: createAdminLoading }] = useCreateAdminMutation()
    const [updateAdmin, { isLoading: updateAdminLoading }] = useUpdateAdminMutation()
    const [image, setImage] = useState(data?.avatar || null)
    const [form] = Form.useForm();

    useEffect(() => {
        if (data) {
            form.setFieldsValue(data);
        }
        if (data?.profile_image) setImage(imageUrl(data?.profile_image))
    }, [data, form]);

    const onFinish = async (values) => {
        try {
            const finalData = {
                ...values,
                profile_image: image,
            }
            Object.entries(finalData).forEach(([key, value]) => {
                if (!key || !value) {
                    throw new Error("All fields are required!")
                }
            });
            const formData = new FormData();

            Object.entries(finalData).forEach(([key, value]) => {
                if (key !== "profile_image") {
                    formData.append(key, value)
                } else {
                    if (value instanceof File && key === "profile_image") {
                        formData.append("profile_image", value)
                    } else if (value === null && key === "profile_image") {
                        formData.delete("profile_image")
                    } else {
                        formData.append(key, value)
                    }
                }
            });

            if (openEdit) {
                formData.append("adminId", data?._id)
            }


            if (openEdit) {
                await updateAdmin(formData).unwrap().then((res) => {
                    if (res?.success) {
                        toast.success(res?.message || "Admin updated successfully")
                        hide()
                        form.resetFields()
                        setImage(null)
                    } else {
                        throw new Error(res?.message || "Something went wrong")
                    }
                })
            } else {
                await createAdmin(formData).unwrap().then((res) => {
                    if (res?.success) {
                        toast.success(res?.message || "Admin created successfully")
                        hide()
                        form.resetFields()
                        setImage(null)
                    } else {
                        throw new Error(res?.message || "Something went wrong")
                    }
                })
            }
        } catch (error) {
            toast.error(error?.data?.message || error?.message || "Something went wrong")
        }
    };


    return (
        <>
            <ImageUploader
                initialImage={image}
                fallback="/default-avatar.png"
                onChange={(file) => setImage(file)}
                image={image}
                setImage={setImage}
            />
            <Form
                layout="vertical"
                requiredMark={false}
                form={form}
                onFinish={onFinish}
            >
                {/* Name */}
                <Form.Item
                    label="Name"
                    name="name"
                    size="large"
                    rules={[{ required: true, message: "Please input name!" }]}
                >
                    <Input size="large" placeholder="Enter full name" />
                </Form.Item>

                {/* Password - only in Create mode */}
                {data ? null :
                    <>
                        <Form.Item
                            label="Email"
                            name="email"
                            size="large"
                            rules={[{ required: true, message: "Please input email!" }]}
                        >
                            <Input placeholder="Enter email" />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            size="large"
                            rules={[{ required: true, message: "Please input password!" }]}
                        >
                            <Input.Password size="large" placeholder="Enter password" />
                        </Form.Item>
                        <Form.Item
                            label="Confirm Password"
                            name="confirmPassword"
                            size="large"
                            rules={[{ required: true, message: "Please input password!" }, ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            })]}
                        >
                            <Input.Password size="large" placeholder="Enter password" />
                        </Form.Item>
                    </>
                }

                <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                    size="large"
                    rules={[{ required: true, message: "Please input phone number!" }]}
                >
                    <Input size="large" placeholder="Enter phone number" />
                </Form.Item>

                {/* Submit */}
                <div className="flex gap-2 items-center">
                    <Button size="large" style={{ backgroundColor: "var(--primary-color)", color: "white", width: "100%" }} onClick={() => {
                        form.resetFields()
                        hide()
                    }}>Cancel</Button>
                    <Button loading={createAdminLoading || updateAdminLoading} size="large" style={{ backgroundColor: "var(--primary-color)", color: "white", width: "100%" }} htmlType="submit">
                        {data ? "Update Admin" : "Create Admin"}
                    </Button>
                </div>
            </Form>
        </>
    );
}

export default AdminForm;
