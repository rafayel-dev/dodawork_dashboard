import React, { useCallback, useState, useMemo } from "react";
import { Table, message } from "antd";
import SearchInput from "../../../components/common/SearchInput";
import { serviceProviderColumns } from "./serviceProviderColumns";
import ServiceProviderDetails from "./ServiceProviderDetails";
import Loading from "../../../components/common/Loading";
import { baseUrl } from "../../../utils/optimizationFunction";
import {
  useGetAllServiceProvidersQuery,
  useVerifyServiceProviderMutation,
} from "../../../RTK/services/dashboard/authorised-teams/admins/serviceProvdiers/serviceProvdiersApi";

function ServiceProviderTable() {
  const {
    data: serviceProvider,
    isLoading,
    refetch,
  } = useGetAllServiceProvidersQuery();
  const [verifyProvider, { isLoading: isBlocking }] =
    useVerifyServiceProviderMutation();

  const [open, setOpen] = useState(false);
  const [record, setRecord] = useState(null);

  const hide = useCallback(() => setOpen(false), []);

  const BASE_URL = `${baseUrl}/`;
  console.log(serviceProvider);
  const providers = useMemo(
    () =>
      serviceProvider?.data.providers?.filter((item) => item.isVerified) || [], // only keep verified providers
    [serviceProvider]
  );

  const data = useMemo(
    () =>
      providers.map((item) => ({
        request_id: item._id || "N/A",
        key: item._id || Math.random().toString(),
        name: item.authId?.name || "Unknown",
        email: item.authId?.email || "N/A",
        phone: item.authId?.phone || "N/A",
        status: item.isRejected
          ? "Rejected"
          : item.isVerified
          ? "Verified"
          : "Pending",
        company_name: item.companyName || "N/A",
        company_address: item.serviceLocation || "N/A",
        category: item.serviceCategories?.[0]?.name || "N/A",
        sub_category: item.serviceCategories?.[1]?.name || "N/A",
        working_hours: item.workingHours?.[0]
          ? `${item.workingHours[0].startTime} - ${item.workingHours[0].endTime}`
          : "N/A",
        weekend: item.workingHours?.[0]?.day || "N/A",
        contact_person: item.contactPerson || "N/A",
        avatar: "https://avatar.iran.liara.run/public/13",
        website_link: item.website || "N/A",
        certificate:
          item.attachments?.[0] && !item.attachments[0].endsWith(".mp4")
            ? `${BASE_URL}${item.attachments[0].replace(/\\/g, "/")}`
            : "https://via.placeholder.com/150",
        license:
          item.attachments?.[1] && !item.attachments[1].endsWith(".mp4")
            ? `${BASE_URL}${item.attachments[1].replace(/\\/g, "/")}`
            : "https://via.placeholder.com/150",
      })),
    [providers, BASE_URL]
  );

  const handleView = useCallback((record) => {
    setRecord(record);
    setOpen(true);
  }, []);
  console.log(providers);
  const handleBlockToggle = useCallback(
    async (record) => {
      const isCurrentlyRejected = record.status === "Rejected";
      const bodyData = {
        providerId: record.request_id,
        isVerified: "true",
        isRejected: (!isCurrentlyRejected).toString(),
      };
      try {
        await verifyProvider(bodyData).unwrap();
        message.success(
          `${record.name} ${
            !isCurrentlyRejected ? "blocked" : "activated"
          } successfully`
        );
        refetch(); // refresh the table
      } catch (error) {
        message.error("Failed to update provider status");
        console.error("❌ Toggle failed:", error);
      }
    },
    [verifyProvider, refetch]
  );

  if (isLoading || isBlocking) return <Loading />;

  return (
    <div>
      <SearchInput className="mb-4" placeholder="Search by Email" />
      <Table
        columns={serviceProviderColumns(handleView, handleBlockToggle)}
        dataSource={data}
        pagination={false}
        scroll={{ x: "max-content" }}
        size="large"
        bordered
        rowKey="request_id"
      />
      <ServiceProviderDetails open={open} hide={hide} record={record} />
    </div>
  );
}

export default ServiceProviderTable;
