import React, { useCallback, useState, useMemo, useEffect } from "react";
import { Table, message } from "antd";
import SearchInput from "../../../components/common/SearchInput";
import { serviceProviderColumns } from "./serviceProviderColumns";
import ServiceProviderDetails from "./ServiceProviderDetails";
import Loading from "../../../components/common/Loading";
import { imageUrl } from "../../../utils/optimizationFunction";
import {
  useGetAllServiceProvidersQuery,
  useVerifyServiceProviderMutation,
} from "../../../RTK/services/dashboard/safe-user/admins/serviceProvdiers/serviceProvdiersApi";

function ServiceProviderTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: serviceProvider,
    isLoading,
    refetch,
  } = useGetAllServiceProvidersQuery({ page: currentPage, limit: pageSize, search: debouncedSearch, });
  const [verifyProvider, { isLoading: isBlocking }] =
    useVerifyServiceProviderMutation();

  const [open, setOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState(null);

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const hide = useCallback(() => {
    setOpen(false);
    setSelectedProviderId(null);
  }, []);

  const providers = useMemo(
    () =>
      serviceProvider?.data.providers?.filter((item) => item.isVerified === true && item.isRejected === false) || [],
    [serviceProvider]
  );

  const data = useMemo(
    () =>
      providers.map((item) => ({
        request_id: item._id || "N/A",
        key: item._id || Math.random().toString(),
        name: item.authId?.name || "Unknown",
        email: item.authId?.email || "N/A",
        phone: item.authId?.phoneNumber || "N/A",
        status: item.isRejected
          ? "Rejected"
          : item.isVerified
            ? "Verified"
            : "Pending",
        company_name: item.companyName || "N/A",
        company_address: item.serviceLocation || "N/A",
        category: item.serviceCategories?.length
          ? item.serviceCategories.map((cat) => cat.name).join(" , ")
          : "N/A",
        working_hours:
          item.workingHours
            ?.map((d) => `${d.day}: ${d.startTime}-${d.endTime}`)
            .join("; ") || "N/A",
        contact_person: item.contactPerson || "N/A",
        avatar: item.profile_image
          ? imageUrl(item.profile_image.replace(/\\/g, "/"))
          : "https://placehold.net/avatar.svg?text=EJ&bg=212121",
        website_link: item.website || "N/A",
      })),
    [providers]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value.trim();
    setSearchTerm(value);
    console.log("🔍 Searching for:", value);
  };

  const handleView = useCallback((record) => {
    setSelectedProviderId(record.request_id);
    setOpen(true);
  }, []);
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
          `${record.name} ${!isCurrentlyRejected ? "blocked" : "activated"
          } successfully`
        );
        refetch();
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
      <SearchInput className="mb-4" placeholder="Search by Email" onChange={handleSearchChange} value={searchTerm} />
      <Table
        columns={serviceProviderColumns(handleView, handleBlockToggle)}
        dataSource={data}
        pagination={{
          current: serviceProvider?.data?.meta?.page || currentPage,
          pageSize: serviceProvider?.data?.meta?.limit || pageSize,
          total: serviceProvider?.data?.meta?.total || 0,
          onChange: (page, newPageSize) => {
            setCurrentPage(page);
            setPageSize(newPageSize);
          },
          showSizeChanger: true,
          showLessItems: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        scroll={{ x: "max-content" }}
        size="large"
        bordered
        rowKey="request_id"
      />
      <ServiceProviderDetails open={open} hide={hide} providerId={selectedProviderId} />
    </div>
  );
}

export default ServiceProviderTable;
