import React from "react";
import { Button, Popconfirm, Space } from "antd";
import { FaEye, FaBan, FaCheckCircle } from "react-icons/fa";
import { MdChat } from "react-icons/md";
import UserImage from "../../../components/user/UserImage";

export const serviceProviderColumns = (onView, onBlockToggle) => [
  {
    title: "Service Provider",
    dataIndex: "name",
    key: "name",
    render: (text, record) => (
      <UserImage user={{ name: text, avatar: record.avatar }} />
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
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space>
        {/* View Button */}
        <Button
          onClick={() => onView(record)}
          shape="circle"
          icon={<FaEye />}
        />

        {/* Block / Activate Button */}
        <Popconfirm
          title={`Are you sure you want to ${
            record.status === "Rejected" ? "activate" : "block"
          } this provider?`}
          okText="Yes"
          cancelText="No"
          onConfirm={() => onBlockToggle(record)}
        >
          <Button
            shape="circle"
            danger={record.status !== "Rejected"} // red if blocking
            icon={record.status === "Rejected" ? <FaCheckCircle /> : <FaBan />} // toggle icon
          />
        </Popconfirm>

        {/* Chat / Email */}
        <Popconfirm
          icon={null}
          okText="Email"
          cancelText="Chat"
          onConfirm={() => {
            if (window) {
              window.open(
                `https://mail.google.com/mail/?view=cm&fs=1&to=${record.email}`,
                "_blank"
              );
            }
          }}
          onCancel={() => {
            if (window) window.open(`/chat?providerId=${record.request_id}`, "_parent");
          }}
        >
          <Button shape="circle" icon={<MdChat />} />
        </Popconfirm>
      </Space>
    ),
  },
];
