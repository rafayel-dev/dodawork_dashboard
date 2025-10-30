import React, { useCallback, useState } from "react";
import { Table, Modal } from "antd";
import { awaitingRequestsColumns } from "./awaitingRequestsColumns";
import AwaitingRequestsDetailsCard from "./AwaitingRequestsDetailsCard";
import { baseUrl } from "../../../utils/optimizationFunction";
function AwaitingRequeststable({ pagination, pendingRequest }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [cancel, setCancel] = useState(false);
  console.log(pendingRequest);
  const BASE_URL = `${baseUrl}/`;

  const data = pendingRequest?.map((item) => ({
    request_id: item.requestId || item._id || "N/A",
    key: item._id || item.requestId || Math.random().toString(),
    name: item.customerId?.name || "Unknown",
    category: item.serviceCategory?.name || "N/A",
    email: item.customerId?.email || "N/A",
    phone: item.customerId?.phoneNumber || item.customerPhone || "N/A",
    date: item.startDate
      ? new Date(item.startDate).toISOString().split("T")[0]
      : "N/A",
    time: item.startTime || "N/A",
    priority: item.priority || "Normal",
    status: item.status || "Pending",
    avatar: "https://avatar.iran.liara.run/public/13",
    action: "View",
    video: Array.isArray(item.attachments)
      ? item.attachments.some(
          (a) =>
            a.toLowerCase().endsWith(".mp4") || a.toLowerCase().endsWith(".mov")
        )
      : false,
    service_image_or_video:
      Array.isArray(item.attachments) && item.attachments.length > 0
        ? `${BASE_URL}${item.attachments[0].replace(/\\/g, "/")}`
        : "https://via.placeholder.com/150",
  }));

  console.log(data);

  console.log(data, "my");

  const handleView = useCallback((record) => {
    setSelectedRequest(record);
  }, []);

  const handleCancel = useCallback((record) => {
    setCancel(true);
    setTimeout(() => {
      setCancel(false);
      alert(`${record.name} cancelled successfully`);
    }, 2000);
  }, []);

  return (
    <div>
      <div></div>
      <Table
        columns={awaitingRequestsColumns(handleView)}
        dataSource={data}
        pagination={false}
        scroll={{ x: "max-content" }}
        size="large"
        bordered
      />
      <Modal
        open={!!selectedRequest}
        footer={null}
        onCancel={() => setSelectedRequest(null)}
        centered
        width={500}
      >
        {selectedRequest && (
          <AwaitingRequestsDetailsCard
            record={selectedRequest}
            handleCancel={handleCancel}
            loading={cancel}
          />
        )}
      </Modal>
    </div>
  );
}

export default AwaitingRequeststable;
