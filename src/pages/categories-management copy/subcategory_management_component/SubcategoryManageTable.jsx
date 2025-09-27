import React, { useCallback, useState } from "react";
import { Form, Table } from "antd";
import { subCategoryManageColumns } from "./subCategoryManageColumns";
import CustomButton from "../../../components/common/CustomButton";
import BackButton from "../../../components/common/BackButton";
import {
  useCreateSubCategoryMutation,
  useGetAllSubCategoriesQuery,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} from "../../../RTK/services/dashboard/categoris-subCategoriseApis/subCategoriseApis";
import { useLocation } from "react-router-dom";
import SubCategoryForm from "./SubCategoryForm";
import toast from "react-hot-toast";

function SubcategoryManageTable() {
  const [form] = Form.useForm();
  const location = useLocation().state;
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState("create"); // "create" | "update"
  const [record, setRecord] = useState(null);

  const { data: subCategories, isLoading, isFetching } = useGetAllSubCategoriesQuery(
    { categoryId: location?.id },
    { skip: !location?.id }
  );

  const [createSubCategory, { isLoading: isCreating }] = useCreateSubCategoryMutation();
  const [updateSubCategory, { isLoading: isUpdating }] = useUpdateSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation()

  const openCreateModal = useCallback(() => {
    setMode("create");
    setRecord(null);
    form.resetFields();
    setModalVisible(true);
  }, [form]);

  const openUpdateModal = useCallback((rec) => {
    setMode("update");
    setRecord(rec);
    form.setFieldsValue(rec);
    setModalVisible(true);
  }, [form]);

  const handleDeleteCategory = useCallback(async (rec) => {
    try {
      const data = {
        id: location?.id,
        subcategoryId: rec?._id
      }
      await deleteSubCategory(data).unwrap().then((res) => {
        if (res?.success) {
          toast.success(res?.message || "Sub Category deleted successfully")
          setModalVisible(false);
          form.resetFields();
        }
      })
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong")
    }
  }, [deleteSubCategory, location?.id, form]);

  const handleSubmit = useCallback(
    async (values) => {
      try {
        if (!location?.id) throw new Error("Category ID is required");

        const payload = {
          categoryId: location.id,
          name: values.name,
          ...(mode === "update" && { subcategoryId: record?._id }),
        };

        const action = mode === "create" ? createSubCategory : updateSubCategory;

        const res = await action(payload).unwrap();
        if (res?.success) {
          toast.success(res?.message || `Sub Category ${mode}d successfully`);
          setModalVisible(false);
          form.resetFields();
        }
      } catch (error) {
        toast.error(error?.data?.message || "Something went wrong");
      }
    },
    [mode, record, location?.id, form, createSubCategory, updateSubCategory]
  );

  return (
    <div>
      <BackButton message="Back to Categories" className="mb-5 hover:text-[#F57C00]" />
      <CustomButton onClick={openCreateModal} title="Add Sub Category" icon="plus" />
      <Table
        loading={isLoading || isFetching}
        columns={subCategoryManageColumns(openUpdateModal, handleDeleteCategory)}
        dataSource={subCategories?.data?.subcategories || []}
        pagination={false}
        scroll={{ x: "max-content" }}
        size="large"
        bordered
        rowKey="_id"
      />

      <SubCategoryForm
        form={form}
        open={modalVisible}
        hide={() => setModalVisible(false)}
        onFinish={handleSubmit}
        title={mode === "create" ? "Add Sub Category" : "Update Sub Category"}
        loading={isCreating || isUpdating}
        isUpdate={mode === "update"}
        record={record}
      />
    </div>
  );
}

export default SubcategoryManageTable;
