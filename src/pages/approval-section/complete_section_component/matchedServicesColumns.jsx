import React from "react";
import { Button, Space } from "antd";
import { FaEye } from "react-icons/fa";
import cn from "../../../lib/cn";
import UserImage from "../../../components/user/UserImage";

export const matchedServicesColumns = (onView) => [
  {
    title: "Request ID",
    dataIndex: "request_id",
    key: "request_id",
  },
  {
    title: "Customer Name",
    dataIndex: "name",
    key: "name",
    render: (text, record) => (
      <UserImage user={{ name: text, avatar: record.avatar }} />
    ),
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Service Media",
    dataIndex: "service_image_or_video",
    key: "service_image_or_video",
    render: (text, record) => {
      if (record.video) {
        return <video className="w-28 h-20" src={text} controls />;
      } else {
        return (
          <img
            className="w-20 h-20 object-contain"
            src={text}
            alt="Service"
          />
        );
      }
    },
  },
  {
    title: "Start-End Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Start-End Time",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "Priority",
    dataIndex: "priority",
    key: "priority",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => (
      <div
        className={cn("w-fit px-3 rounded", {
          "!bg-yellow-500 !text-yellow-800": text === "Pending",
          "!bg-green-400 !text-white": text === "Approved",
          "!bg-red-100 !text-red-800": text === "Rejected",
        })}
      >
        {text}
      </div>
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (_, record) => (
      <Space>
        <Button onClick={() => onView(record)} shape="circle" icon={<FaEye />} />
      </Space>
    ),
  },
];
