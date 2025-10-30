import React from "react";
import { Button, Popconfirm, Space } from "antd";
import { FaEye, FaRegCheckCircle } from "react-icons/fa";
import UserImage from "../../../components/user/UserImage";

export const userManageColumns = (onView, handleBlock) => [
  {
    title: "User’s",
    dataIndex: "name",
    key: "name",
    render: (_, record) => (
      <UserImage
        user={{
          name: record?.name,
        }}
      />
    ),
  },
  {
    title: "Contact Number",
    dataIndex: "phoneNumber",
    key: "phone",
    render: (_, record) => record?.phoneNumber,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (_, record) => record?.email,
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (_, record) => (
      <Space>
        <Button
          onClick={() => onView(record)}
          shape="circle"
          icon={<FaEye />}
        />
        <Popconfirm
          title={`Are you sure to block ${record?.name}?`}
          placement="topRight"
          okButtonProps={{ style: { backgroundColor: "#FFBA00", color: "white" } }}
          onConfirm={() => handleBlock(record)}>
          <Button
            shape="circle"
            icon={<FaRegCheckCircle />}
          />
        </Popconfirm>
      </Space>
    ),
  },
];
