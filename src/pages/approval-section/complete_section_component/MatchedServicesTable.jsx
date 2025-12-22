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
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  const { data: serviceRequestData, isLoading } = useGetAllServiceRequestQuery({
    status: statusFilter,
    page: pagination.page,
    limit: pagination.limit,
  });

  const serviceRequests = serviceRequestData?.data?.serviceRequests || [];
  const total = serviceRequestData?.data?.meta?.total || 0;

  const data = serviceRequests.map((item) => ({
    request_id: item.requestId || item._id || "N/A",
    key: item._id || Math.random().toString(),
    name: item.customerId?.name || "Unknown",
    category: item.serviceCategory?.name || "N/A",
    email: item.customerId?.email || "N/A",
    phone: item.customerId?.phoneNumber || item.customerPhone || "N/A",
    date: item.startDate && item.endDate
      ? `${new Date(item.startDate).toISOString().split("T")[0]} - ${new Date(item.endDate).toISOString().split("T")[0]
      }`
      : "N/A",
    time: item.startTime && item.endTime
      ? `${item.startTime} - ${item.endTime}`
      : "N/A",
    priority: item.priority || "Normal",
    status: item.status,
    avatar: "https://placehold.net/avatar.svg?text=EJ&bg=212121",
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
        : "https://placehold.net/avatar.svg?text=EJ&bg=212121",
  }));

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

  const handleTableChange = (pagination) => {
    setPagination({
      page: pagination.current,
      limit: pagination.pageSize,
    });
  };

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
          onChange={(value) => {
            setStatusFilter(value);
            setPagination({ page: 1, limit: 10 });
          }}
          options={filterOptions}
        />
      </div>

      <Table
        columns={matchedServicesColumns(handleView)}
        dataSource={data}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: total,

        }}
        onChange={handleTableChange}
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
