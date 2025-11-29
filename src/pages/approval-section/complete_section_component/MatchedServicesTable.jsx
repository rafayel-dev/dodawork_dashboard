import React, { useCallback, useMemo, useState } from "react";
import { Table, Modal, Select } from "antd"; // Import Select
import { matchedServicesColumns } from "./matchedServicesColumns";
import MatchedServicesDetailsCard from "./MatchedServicesDetailsCard";
import { useGetAllServiceRequestQuery } from "../../../RTK/services/dashboard/authorised-teams/admins/serviceRequest/ServiceRequestApis";
import Loading from "../../../components/common/Loading";
import { baseUrl } from "../../../utils/optimizationFunction";

function MatchedServicesTable() {
  const BASE_URL = `${baseUrl}/`;
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [cancel, setCancel] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { data: serviceRequestData, isLoading } = useGetAllServiceRequestQuery(statusFilter);

  const serviceRequests = serviceRequestData?.data?.serviceRequests || [];

  const data = useMemo(() => serviceRequests.map((item) => ({
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
    status: item.status, // Use raw status
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
  })), [serviceRequests, BASE_URL]);

  const filteredData = useMemo(
    () => {
      if (statusFilter === "ALL") {
        return data;
      }
      return data.filter((item) => item.status === statusFilter);
    },
    [data, statusFilter]
  );

  const filterOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'ONGOING', label: 'Ongoing' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  // Handlers
  const handleView = useCallback((record) => setSelectedRequest(record), []);
  const handleCancel = useCallback((record) => {
    setCancel(true);
    setTimeout(() => {
      setCancel(false);
      alert(`${record.name} cancelled successfully`);
    }, 2000);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  // Render
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Select
          defaultValue="ALL"
          style={{ width: 150 }}
          onChange={(value) => setStatusFilter(value)}
          options={filterOptions}
        />
      </div>

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
