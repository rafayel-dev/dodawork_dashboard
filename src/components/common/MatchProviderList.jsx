import React, { useState } from "react";
import { Button, Modal, Table } from "antd";
import UserImage from "../user/UserImage";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render: (text, record) => (
      <UserImage user={{ name: text, avatar: record.avatar }} />
    ),
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];

const data = [
  {
    key: "1",
    name: "John Brown",
    avatar: "https://avatar.iran.liara.run/public/13",
    address: "Dhaka, Banani(1.2 km away)",
  },
  {
    key: "2",
    name: "Jim Green",
    avatar: "https://avatar.iran.liara.run/public/13",
    address: "Dhaka, Banani(1.2 km away)",
  },
  {
    key: "3",
    name: "Joe Black",
    avatar: "https://avatar.iran.liara.run/public/13",
    address: "Dhaka, Banani(1.2 km away)",
  },
  {
    key: "4",
    name: "Disabled User",
    avatar: "https://avatar.iran.liara.run/public/13",
    address: "Dhaka, Banani(1.2 km away)",
  },
];

function MatchProviderList({ open = false, hide }) {
  const [selectedKeys, setSelectedKeys] = useState([]);

  const rowSelection = {
    onChange: (newSelectedKeys) => {
      setSelectedKeys(newSelectedKeys);
    },
  };

  const handleMatch = () => {
    console.log("Selected keys:", selectedKeys);
    // 👇 here you’ll get an array of selected keys
    // do whatever you want with it
    alert("Match function called");
  };

  return (
    <Modal
      open={open}
      onCancel={hide}
      centered
      width={500}
      closeIcon={false}
      footer={[
        <Button key="close" onClick={() => hide(false)}>
          Close
        </Button>,
        <Button
          key="match"
          style={{ backgroundColor: "var(--primary-color)", color: "#fff" }}
          onClick={handleMatch}
        >
          Match Provider
        </Button>,
      ]}
    >
      <div>
        <h1 className="text-2xl font-bold text-black line-clamp-1">
          All Providers
        </h1>
        <Table
          rowSelection={{ type: "checkbox", ...rowSelection }}
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      </div>
    </Modal>
  );
}

export default MatchProviderList;
