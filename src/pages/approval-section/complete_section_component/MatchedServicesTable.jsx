import React, { useCallback, useMemo, useState } from "react";
import { Table, Modal, Tabs, ConfigProvider } from "antd";
import { matchedServicesColumns } from "./matchedServicesColumns";
import MatchedServicesDetailsCard from "./MatchedServicesDetailsCard";
import { PlusOutlined } from "@ant-design/icons";
import { useGetAllServiceRequestQuery } from "../../../RTK/services/dashboard/authorised-teams/admins/serviceRequest/ServiceRequestApis";
import Loading from "../../../components/common/Loading";
import { baseUrl } from "../../../utils/optimizationFunction";

function MatchedServicesTable() {
  const BASE_URL = `${baseUrl}/`;
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [cancel, setCancel] = useState(false);
  const [activeTab, setActiveTab] = useState("Approved");
  const { data: serviceRequestData, isLoading } =
    useGetAllServiceRequestQuery();
  let serviceRequests = serviceRequestData?.data?.serviceRequests;
  if (isLoading) {
    <Loading />;
  }
  console.log(serviceRequests, "match service");
  // ✅ Filter approved and rejected requests
  const approveRequest =
    serviceRequests?.filter((item) => item.status === "APPROVED") || [];

  const rejectRequest =
    serviceRequests?.filter((item) => item.status === "REJECTED") || [];

  // ✅ Merge both into single array for the tabs
  const allRequests = [...approveRequest, ...rejectRequest];

  // ✅ Dynamic mapping to UI table format
  const data = allRequests.map((item) => ({
    request_id: item.requestId || item._id || "N/A",
    key: item._id || Math.random().toString(),
    name: item.customerId?.name || "Unknown",
    category: item.serviceCategory?.name || "N/A",
    email: item.customerId?.email || "N/A",
    phone: item.customerId?.phoneNumber || item.customerPhone || "N/A",
    date: item.startDate
      ? new Date(item.startDate).toISOString().split("T")[0]
      : "N/A",
    time: item.startTime || "N/A",
    priority: item.priority || "Normal",
    status: item.status === "APPROVED" ? "Approved" : "Rejected",
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

  // ✅ Filter data for active tab
  const filteredData = useMemo(
    () => data.filter((item) => item.status === activeTab),
    [data, activeTab]
  );

  // ✅ Tab configuration
  const items = [
    { key: "Approved", label: "Approved" },
    { key: "Rejected", label: "Rejected" },
  ];

  // ✅ Handlers
  const handleView = useCallback((record) => setSelectedRequest(record), []);
  const handleCancel = useCallback((record) => {
    setCancel(true);
    setTimeout(() => {
      setCancel(false);
      alert(`${record.name} cancelled successfully`);
    }, 2000);
  }, []);

  // ✅ Render
  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#111",
            colorBgContainer: "#ffa337",
          },
        }}
      >
        <Tabs
          type="card"
          size="middle"
          defaultActiveKey="Approved"
          items={items}
          onChange={(key) => setActiveTab(key)}
        />
      </ConfigProvider>

      <Table
        columns={matchedServicesColumns(handleView)}
        dataSource={filteredData}
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
          <MatchedServicesDetailsCard
            record={selectedRequest}
            handleCancel={handleCancel}
            loading={cancel}
          />
        )}
      </Modal>
    </div>
  );
}

export default MatchedServicesTable;
