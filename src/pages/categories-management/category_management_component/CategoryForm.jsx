import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { imageUrl } from "../../../utils/optimizationFunction";

function CategoryForm({ open, hide, title, onFinish, record, loading, form }) {
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (record) {
            form.setFieldsValue({ name: record.name, price: record.price });
            if (record?.icon) {
                setFileList([
                    {
                        uid: "-1",
                        name: record.name,
                        price: record.price,
                        status: "done",
                        url: imageUrl(record.icon),
                    },
                ]);
            }
        } else {
            form.resetFields();
            setFileList([]);
        }
    }, [record, form]);

    const handleUploadChange = ({ fileList }) => setFileList(fileList);

    return (
        <Modal
            title={title}
            open={open}
            onCancel={() => hide(false)}
            footer={null}
            centered
            destroyOnClose
        >
            <Form layout="vertical" onFinish={onFinish} requiredMark={false} form={form}>
                <Form.Item name="avatar" label="Category Icon">
                    <Upload
                        name="avatar"
                        listType="picture"
                        maxCount={1}
                        accept="image/*"
                        fileList={fileList}
                        onChange={handleUploadChange}
                        beforeUpload={() => false}
                    >
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    name="name"
                    label="Category Name"
                    rules={[{ required: true, message: "Please input category name!" }]}
                >
                    <Input placeholder="Category Name" />
                </Form.Item>
                <Form.Item
                    name="price"
                    label="Category Price"
                    rules={[{ required: true, message: "Please input category Price!" }]}
                >
                    <Input placeholder="Category Price" />
                </Form.Item>

                <Form.Item>
                    <Button
                        style={{ backgroundColor: "var(--primary-color)", color: "white" }}
                        htmlType="submit"
                        loading={loading}
                        block
                    >
                        {title}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default CategoryForm;
