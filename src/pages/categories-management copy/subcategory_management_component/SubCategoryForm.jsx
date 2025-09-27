import React, { useEffect } from "react";
import { Form, Input, Modal, Button } from "antd";

function SubCategoryForm({ open, hide, title, onFinish, form, loading, isUpdate, record }) {
    useEffect(() => {
        if (record) {
            form.setFieldsValue(record);
        } else {
            form.resetFields();
        }
    }, [record, form, open]);

    return (
        <Modal
            title={title}
            open={open}
            onCancel={hide}
            footer={null}
            centered
            destroyOnClose
        >
            <Form layout="vertical" form={form} onFinish={onFinish} requiredMark={false}>
                <Form.Item
                    name="name"
                    label="Sub Category Name"
                    rules={[{ required: true, message: "Please input sub category name!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{ backgroundColor: "var(--primary-color)" }}
                    >
                        {isUpdate ? "Update" : "Submit"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default SubCategoryForm;
