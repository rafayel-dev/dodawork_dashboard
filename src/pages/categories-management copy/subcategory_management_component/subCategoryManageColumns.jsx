import React from "react";
import { Button, Popconfirm, Space } from "antd";
import { FaEdit, FaTrash } from "react-icons/fa";

export const subCategoryManageColumns = (onEdit, onDelete) => [
  {
    title: "Sub Category",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (_, record) => (
      <Space>
        <Button onClick={() => onEdit(record)} shape="circle" icon={<FaEdit />} />
        <Popconfirm
          title={`Are you sure to delete ${record.name}?`}
          placement="topRight"
          okButtonProps={{ style: { backgroundColor: "#FFBA00", color: "white" } }}
          onConfirm={() => onDelete(record)}>
          <Button shape="circle" icon={<FaTrash />} />
        </Popconfirm>
      </Space>
    ),
  },
];
