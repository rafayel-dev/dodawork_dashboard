import React from "react";
import { Button, Popconfirm, Space, Tooltip } from "antd";
import UserImage from "../../../components/user/UserImage";
import { FaCheck, FaEye } from "react-icons/fa";
import { CiCircleRemove } from "react-icons/ci";

export const signupRequestColumn = ({ onView, handleDelete, handleAccept, handleApproveUpdate }) => [
  {
    title: "User",
    dataIndex: "name",
    key: "name",
    render: (text, record) => (
      <UserImage
        user={{ name: text, avatar: record.avatar }}
      />
    ),
  },
    {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Company Name",
    dataIndex: "company_name",
    key: "company_name",
  },
    {
    title: "Website Link",
    dataIndex: "website_link",
    key: "website_link",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
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

        {record.requestType === 'PENDING_NEW' && (
          <>
            <Tooltip title="Reject">
              <Popconfirm
                title="Are you sure to reject this request?"
                placement="topRight"
                okButtonProps={{
                  style: { backgroundColor: "#ea9999", color: "white" },
                }}
                onConfirm={() => handleDelete(record?._id)}
              >
                <Button
                  icon={<CiCircleRemove />}
                  shape="circle"
                  style={{ backgroundColor: "#ea9999", color: "white" }}
                />
              </Popconfirm>
            </Tooltip>
            <Tooltip title="Accept">
              <Popconfirm
                title="Are you sure to accept this request?"
                placement="topRight"
                okButtonProps={{
                  style: { backgroundColor: "#93c47d", color: "white" },
                }}
                onConfirm={() => handleAccept(record?._id)}
              >
                <Button
                  icon={<FaCheck />}
                  shape="circle"
                  style={{ backgroundColor: "#93c47d", color: "white" }}
                />
              </Popconfirm>
            </Tooltip>
          </>
        )}

        {record.requestType === 'PENDING_UPDATE' && (
          <Tooltip title="Approve Update">
            <Popconfirm
              title="Are you sure to approve these updates?"
              placement="topRight"
              okButtonProps={{
                style: { backgroundColor: "#93c47d", color: "white" },
              }}
              onConfirm={() => handleApproveUpdate(record?._id)}
            >
              <Button
                icon={<FaCheck />} // Can use a different icon for clarity if needed
                shape="circle"
                style={{ backgroundColor: "#4CAF50", color: "white" }} // Green for approval
              />
            </Popconfirm>
          </Tooltip>
        )}
      </Space>
    ),
  },
];
