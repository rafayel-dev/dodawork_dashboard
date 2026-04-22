import React, { useCallback, useState, useEffect, useMemo } from "react";
import { PageContent, PageLayout } from "../../components/PageLayout";
import { Modal, Table, Select } from "antd";
import { signupRequestColumn } from "./sign_up_request_component/SignupRequestColumn";
import RequestedUser from "./sign_up_request_component/RequestedUser";
import {
  useVerifyServiceProviderMutation,
  useApproveProviderUpdateMutation,
  useGetSignupRequestsVerifyQuery,
  useGetPendingProviderUpdatesQuery,
} from "../../RTK/services/dashboard/safe-user/admins/serviceProvdiers/serviceProvdiersApi";
import Loading from "../../components/common/Loading";
import { baseUrl } from "../../utils/optimizationFunction";
import toast from "react-hot-toast";

function SignUpUserRequest({ title, pendingRequest, pagination: propPagination = true }) {
  const [filterType, setFilterType] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [verifyProvider, { isLoading: isVerifyingOrApproving }] =
    useVerifyServiceProviderMutation();
  const [approveProviderUpdate, { isLoading: isApprovingUpdate }] =
    useApproveProviderUpdateMutation();

  const {
    data: signupRequests,
    isLoading: isLoadingSignup,
    refetch: refetchSignup
  } = useGetSignupRequestsVerifyQuery(
    { page: currentPage, limit: pageSize },
    { skip: !!pendingRequest || (filterType !== 'ALL' && filterType !== 'PENDING_NEW') }
  );

  const {
    data: updateRequests,
    isLoading: isLoadingUpdate,
    refetch: refetchUpdate
  } = useGetPendingProviderUpdatesQuery(
    { page: currentPage, limit: pageSize },
    { skip: !!pendingRequest || (filterType !== 'ALL' && filterType !== 'PENDING_UPDATE') }
  );

  const refetch = useCallback(() => {
    if (filterType === 'ALL' || filterType === 'PENDING_NEW') refetchSignup();
    if (filterType === 'ALL' || filterType === 'PENDING_UPDATE') refetchUpdate();
  }, [filterType, refetchSignup, refetchUpdate]);

  const providers = useMemo(() => {
    if (pendingRequest) return pendingRequest.map(item => ({ ...item, requestType: 'PENDING_NEW' }));

    const extractProviders = (res) => {
      if (!res) return [];
      if (res.data && Array.isArray(res.data.providers)) return res.data.providers;
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.providers)) return res.providers;
      return [];
    };

    const newRequests = extractProviders(signupRequests).map(item => ({ ...item, requestType: 'PENDING_NEW' }));
    const updatedRequests = extractProviders(updateRequests).map(item => ({ ...item, requestType: 'PENDING_UPDATE' }));

    if (filterType === 'PENDING_NEW') return newRequests;
    if (filterType === 'PENDING_UPDATE') return updatedRequests;

    return [...newRequests, ...updatedRequests];
  }, [signupRequests, updateRequests, pendingRequest, filterType]);

  const metaData = useMemo(() => {
    if (filterType === 'PENDING_NEW') return signupRequests?.data?.meta;
    if (filterType === 'PENDING_UPDATE') return updateRequests?.data?.meta;
    return null;
  }, [filterType, signupRequests, updateRequests]);

  const BASE_URL = `${baseUrl}/`;

  const adminData = useMemo(() => {
    return providers?.map((item) => ({
      _id: item._id || "N/A",
      key: item._id || Math.random().toString(),
      name: item.authId?.name || "Unknown",
      email: item.authId?.email || "N/A",
      phone: item.authId?.phone || "N/A",
      createdAt: item.createdAt
        ? new Date(item.createdAt).toISOString().split("T")[0]
        : "N/A",
      status: item.isVerified ? "Verified" : "Pending",
      company_name: item.companyName || "N/A",
      company_address: item.serviceLocation || "N/A",
      category:
        Array.isArray(item.serviceCategories) &&
          item.serviceCategories.length > 0
          ? item.serviceCategories[0].name
          : "N/A",
      sub_category:
        Array.isArray(item.serviceCategories) &&
          item.serviceCategories.length > 1
          ? item.serviceCategories[1].name
          : "N/A",
      working_hours: item.workingHours || [],
      contact_person: item.contactPerson || "N/A",
      avatar: "https://placehold.net/avatar.svg?text=EJ&bg=212121",
      website_link: item.website
        ? item.website.startsWith("http")
          ? item.website
          : `https://${item.website}`
        : "N/A",
      certificate:
        Array.isArray(item.attachments) && item.attachments[0]
          ? `${BASE_URL}${item.attachments[0].replace(/\\/g, "/")}`
          : "https://placehold.net/avatar.svg?text=EJ&bg=212121",
      license:
        Array.isArray(item.attachments) && item.attachments[1]
          ? `${BASE_URL}${item.attachments[1].replace(/\\/g, "/")}`
          : "https://placehold.net/avatar.svg?text=EJ&bg=212121",
      requestType: item.requestType,
      pendingUpdates: item.pendingUpdates,
      attachments: item.attachments,
      updatedAt: item.updatedAt,
    })) || [];
  }, [providers, BASE_URL]);

  const [record, setRecord] = useState(null);
  const [open, setOpen] = useState(false);

  const handleView = (record) => {
    setRecord(record);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    let bodyData = {
      providerId: id,
      isVerified: "false",
      isRejected: "true",
    };
    try {
      await verifyProvider(bodyData).unwrap();
      toast.success("Rejected successfully");
      refetch();
    } catch (error) {
      toast.error("Rejected failed");
    }
  };

  const handleApproveUpdate = async (id) => {
    const bodyData = {
      providerId: id,
    };

    try {
      await approveProviderUpdate(bodyData).unwrap();
      toast.success("Updates approved successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to approve updates.");
    }
  };


  const handleAccept = async (id) => {
    let bodyData = {
      providerId: id,
      isVerified: "true",
      isRejected: "false",
    };
    try {
      await verifyProvider(bodyData).unwrap();
      toast.success("Verified successfully");
      refetch();
    } catch (error) {
      toast.error("Verification failed");
    }
  };

  const hide = useCallback((value) => {
    setOpen(!value);
  }, []);

  const handleFilterChange = (value) => {
    setFilterType(value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const paginationConfig = propPagination ? {
    current: metaData?.page || currentPage,
    pageSize: metaData?.limit || pageSize,
    total: metaData?.total || adminData.length,
    onChange: (page, size) => {
      setCurrentPage(page);
      setPageSize(size);
    },
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    pageSizeOptions: ['10', '20', '50', '100'],
  } : false;

  if (isLoadingSignup || isLoadingUpdate || isVerifyingOrApproving || isApprovingUpdate) {
    return <Loading />;
  }

  return (
    <PageLayout>
      <PageContent>
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        {!pendingRequest && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Providers Awaiting Approval</h2>
            <Select
              defaultValue="ALL"
              value={filterType}
              style={{ width: 150 }}
              onChange={handleFilterChange}
              options={[
                { value: 'ALL', label: 'All Requests' },
                { value: 'PENDING_NEW', label: 'Sign Up Requests' },
                { value: 'PENDING_UPDATE', label: 'Update Requests' },
              ]}
            />
          </div>
        )}
        <SignupRequestTable
          adminData={adminData}
          handleDelete={handleDelete}
          handleAccept={handleAccept}
          handleView={handleView}
          handleApproveUpdate={handleApproveUpdate}
          pagination={paginationConfig}
        />
      </PageContent>
      <Modal
        title="Requested User"
        open={open}
        centered
        onCancel={hide}
        footer={null}
        destroyOnClose
      >
        <RequestedUser record={record} />
      </Modal>
    </PageLayout>
  );
}


export default SignUpUserRequest;

const SignupRequestTable = ({
  adminData,
  handleDelete,
  handleAccept,
  handleView,
  handleApproveUpdate,
  pagination,
}) => {
  return (
    <Table
      scroll={{ x: "max-content" }}
      columns={signupRequestColumn({
        onView: handleView,
        handleDelete,
        handleAccept,
        handleApproveUpdate,
      })}
      dataSource={adminData}
      pagination={pagination}
      rowKey="_id"
    />
  );
};

