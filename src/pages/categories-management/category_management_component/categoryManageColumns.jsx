import React from "react";
import { Button, Popconfirm, Space, Tooltip } from "antd";
import { FaEdit, FaTrash } from "react-icons/fa";
import UserImage from "../../../components/user/UserImage";
import { GrLinkNext } from "react-icons/gr";

export const categoryManageColumns = (onEdit, onDelete, onNavigate) => [
  {
    title: "Category",
    dataIndex: "name",
    key: "name",
    render: (text, record) => (
      <UserImage user={{ name: text, avatar: record.icon }} />
    ),
  },
  {
    title: "Sub Category",
    dataIndex: "subcategoryCount",
    key: "subcategoryCount",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (_, record) => (
      <Space>
        <Tooltip title="Edit">
          <Button onClick={() => onEdit(record)} shape="circle" icon={<FaEdit />} />
        </Tooltip>
        <Tooltip title={record.subcategoryCount > 0 ? "Cannot delete" : "Delete"}>
          <Popconfirm
            title={`Are you sure to delete ${record.name}?`}
            placement="topRight"
            okButtonProps={{ style: { backgroundColor: "#FFBA00", color: "white" } }}
            onConfirm={() => onDelete(record)}>
            <Button disabled={record.subcategoryCount > 0} shape="circle" icon={<FaTrash />} />
          </Popconfirm>
        </Tooltip>
        <Tooltip title="View Sub Categories">
          <Button onClick={() => onNavigate(record._id)} shape="circle" icon={<GrLinkNext />} />
        </Tooltip>
      </Space>
    ),
  },
];
