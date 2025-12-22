import React, { useCallback, useState, useMemo } from "react";
import { Table, Modal } from "antd";
import { awaitingRequestsColumns } from "./awaitingRequestsColumns";
import AwaitingRequestsDetailsCard from "./AwaitingRequestsDetailsCard";
import { baseUrl } from "../../../utils/optimizationFunction";
import { useGetAllServiceRequestQuery } from "../../../RTK/services/dashboard/safe-user/admins/serviceRequest/serviceRequestApis";
import Loading from "../../../components/common/Loading";

function AwaitingRequeststable({ pagination: paginationProp }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [cancel, setCancel] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  const { data: serviceRequestData, isLoading } = useGetAllServiceRequestQuery({
    status: 'PENDING',
    page: pagination.page,
    limit: pagination.limit,
  });

  const serviceRequests = serviceRequestData?.data?.serviceRequests || [];
  const total = serviceRequestData?.data?.meta?.total || 0;

  const BASE_URL = `${baseUrl}/`;

  const data = useMemo(() => serviceRequests.map((item) => ({
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
  })), [serviceRequests, BASE_URL]);

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
  
  const handleTableChange = (pagination) => {
    setPagination({
      page: pagination.current,
      limit: pagination.pageSize,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div></div>
      <Table
        columns={awaitingRequestsColumns(handleView)}
        dataSource={data}
        pagination={paginationProp && {
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
