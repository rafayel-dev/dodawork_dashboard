import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Space,
  Empty,
  Typography,
  Popconfirm,
} from "antd";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import {
  useGetFaqsQuery,
  useAddFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} from "../../RTK/services/dashboard/informationApis/faqApis";
import { PageLayout, PageContent } from "../../components/PageLayout";
import toast from "react-hot-toast";
const { Paragraph } = Typography;

const FAQ = () => {
  const { data: faqs, isLoading } = useGetFaqsQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const [addFaq, { isLoading: addLoading }] = useAddFaqMutation();
  const [updateFaq, { isLoading: updateLoading }] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    form.resetFields();
  };


  const handleSubmit = async (values) => {
    try {
      if (editingItem) {
        if (!editingItem?._id) {
          throw new Error("Invalid FAQ ID");
        }
        const data = { faqId: editingItem?._id, ...values }
        await updateFaq(data).unwrap().then((res) => {
          if (res?.success) {
            toast.success(res?.message || "FAQ updated successfully");
            handleCloseModal();
          } else {
            throw new Error(res?.message || "Failed to update FAQ");
          }
        })
      } else {
        await addFaq(values).unwrap().then((res) => {
          if (res?.success) {
            toast.success(res?.message || "FAQ created successfully");
            handleCloseModal()
          }
        })
        handleCloseModal();
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.message || "Something went wrong");
    }
  };

  const handleDelete = async (item) => {
    try {
      if (!item?._id) return toast.error("Invalid FAQ ID");
      const data = {
        faqId: item?._id
      }
      const res = await deleteFaq(data).unwrap();
      if (res?.success) {
        toast.success(res?.message || "FAQ deleted successfully");
        handleCloseModal();
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.message || "Failed to delete FAQ");
    }
  };

  return (
    <PageLayout title="Frequently Asked Questions">
      <PageContent>
        <div className="flex items-center justify-between mb-6">
          <Button
            style={{ backgroundColor: "var(--primary-color)", color: "white" }}
            icon={<FaPlus />}
            onClick={() => handleOpenModal()}
          >
            Add FAQ
          </Button>
        </div>

        {faqs?.data?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs?.data?.map((item) => (
              <Card
                loading={isLoading}
                key={item?._id}
                className="transition-shadow duration-300 rounded-2xl"
                title={
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-base">
                      {item?.question}
                    </span>
                    <Space>
                      <FaEdit
                        className="cursor-pointer text-blue-500 hover:text-blue-600"
                        onClick={() => {
                          setEditingItem(item?._id)
                          handleOpenModal(item)
                        }}
                      />
                      <Popconfirm
                        title="Are you sure to delete this FAQ?"
                        onConfirm={() => handleDelete(item)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <FaTrash
                          className="cursor-pointer text-red-500 hover:text-red-600"
                        />
                      </Popconfirm>
                    </Space>
                  </div>
                }
              >
                <Paragraph
                  ellipsis={{ rows: 3, expandable: true, symbol: "more" }}
                >
                  {item?.description}
                </Paragraph>
              </Card>
            ))}
          </div>
        ) : (
          <Empty
            description="No FAQs available yet"
            className="my-12"
            imageStyle={{ height: 80 }}
          />
        )}

        {/* Modal for Create/Edit */}
        <Modal
          title={editingItem ? "Edit FAQ" : "Add FAQ"}
          open={isModalOpen}
          centered
          width={600}
          onCancel={handleCloseModal}
          footer={null}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            name="faq_form"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="question"
              label="Question"
              rules={[{ required: true, message: "Please enter a question" }]}
            >
              <Input placeholder="Enter the FAQ question" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Answer"
              rules={[{ required: true, message: "Please enter an answer" }]}
            >
              <Input.TextArea rows={4} placeholder="Enter the FAQ answer" />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-3">
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button
                  type="primary"
                  style={{ backgroundColor: "var(--primary-color)" }}
                  htmlType="submit"
                  loading={addLoading || updateLoading}
                >
                  {editingItem ? "Update FAQ" : "Create FAQ"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </PageContent>
    </PageLayout>
  );
};

export default FAQ;
