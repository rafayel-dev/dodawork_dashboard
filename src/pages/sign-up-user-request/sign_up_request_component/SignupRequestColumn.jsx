import React from "react";
import { Button, Popconfirm, Space, Tooltip } from "antd";
import UserImage from "../../../components/user/UserImage";
import { FaCheck, FaEye } from "react-icons/fa";
import { CiCircleRemove } from "react-icons/ci";

export const signupRequestColumn = ({ onView, handleDelete, handleAccept }) => [
  {
    title: "User",
    dataIndex: "name",
    key: "name",
    render: (text, record) => (
      <UserImage
        user={{ name: text, avatar: record.avatar, email: record.email }}
      />
    ),
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Company Name",
    dataIndex: "company_name",
    key: "company_name",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Sub Category",
    dataIndex: "sub_category",
    key: "sub_category",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (_, record) => (
      <Space>
        <Tooltip title="View">
          <Button
            icon={<FaEye />}
            onClick={() => onView(record)}
            shape="circle"
            style={{ backgroundColor: "#FFBA00", color: "white" }}
          />
        </Tooltip>
        <Tooltip title="Reject">
          <Popconfirm
            title="Are you sure to reject this request?"
            placement="topRight"
            okButtonProps={{
              style: { backgroundColor: "#FFBA00", color: "white" },
            }}
            onConfirm={() => handleDelete(record?._id)}
          >
            <Button
              icon={<CiCircleRemove />}
              shape="circle"
              style={{ backgroundColor: "#FFBA00", color: "white" }}
            />
          </Popconfirm>
        </Tooltip>
        <Tooltip title="Accept">
          <Popconfirm
            title="Are you sure to accept this request?"
            placement="topRight"
            okButtonProps={{
              style: { backgroundColor: "#FFBA00", color: "white" },
            }}
            onConfirm={() => handleAccept(record?._id)}
          >
            <Button
              icon={<FaCheck />}
              shape="circle"
              style={{ backgroundColor: "#FFBA00", color: "white" }}
            />
          </Popconfirm>
        </Tooltip>
      </Space>
    ),
  },
];
