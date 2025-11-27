import React, { useCallback, useState } from "react";
import { Form, Table, Pagination } from "antd";
import { categoryManageColumns } from "./categoryManageColumns";
import CustomButton from "../../../components/common/CustomButton";
import CategoryForm from "./CategoryForm";
import { useNavigate } from "react-router-dom";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../../RTK/services/dashboard/categoris-subCategoriseApis/categorisApis";
import toast from "react-hot-toast";

function CategoryManageTable() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [record, setRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: categories, isLoading, isFetching } = useGetAllCategoriesQuery({
    page: currentPage,
    limit: pageSize,
  });
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const handleAddCategory = useCallback(() => {
    setIsUpdate(false);
    setRecord(null);
    setModalVisible(true);
  }, []);

  const handleEditCategory = useCallback((record) => {
    setIsUpdate(true);
    setRecord(record);
    setModalVisible(true);
  }, []);

  const handleDeleteCategory = useCallback(async (record) => {
    try {
      const res = await deleteCategory(record._id).unwrap();
      if (res?.success) toast.success(res.message || "Category deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  }, [deleteCategory]);

  const handleNavigate = useCallback((id) => {
    navigate(`/categories-management/sub-category/${id}`, { state: { id } });
  }, [navigate]);

  const handleSubmit = useCallback(
    async (values) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        if (values?.avatar?.fileList?.[0]?.originFileObj) {
          formData.append("icon", values.avatar.fileList[0].originFileObj);
        }

        let res;
        if (isUpdate && record?._id) {
          formData.append("categoryId", record._id);
          res = await updateCategory(formData).unwrap();
        } else {
          res = await createCategory(formData).unwrap();
        }

        if (res?.success) {
          toast.success(res.message || `Category ${isUpdate ? "updated" : "created"} successfully`);
          setModalVisible(false);
          form.resetFields();
        }
      } catch (error) {
        toast.error(error?.data?.message || "Something went wrong");
      }
    },
    [createCategory, updateCategory, isUpdate, record, form]
  );

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  return (
    <div>
      <CustomButton onClick={handleAddCategory} title="Add Category" icon="plus" />

      <Table
        loading={isLoading || isFetching}
        columns={categoryManageColumns(handleEditCategory, handleDeleteCategory, handleNavigate)}
        dataSource={categories?.data?.categories || []}
        pagination={{
          current: categories?.data?.meta?.page || 1,
          pageSize: categories?.data?.meta?.limit || 10,
          total: categories?.data?.meta?.total || 0,
          onChange: handlePaginationChange,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        scroll={{ x: "max-content" }}
        size="large"
        bordered
        rowKey="_id"
      />

      <CategoryForm
        form={form}
        open={modalVisible}
        hide={setModalVisible}
        onFinish={handleSubmit}
        title={isUpdate ? "Update Category" : "Add Category"}
        record={record}
        loading={isUpdate ? isUpdating : isCreating}
      />
    </div>
  );
}

export default CategoryManageTable
