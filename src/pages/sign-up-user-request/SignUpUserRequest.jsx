import React, { useCallback, useState, useEffect, useMemo } from "react";
import { PageContent, PageLayout } from "../../components/PageLayout";
import { Modal, Table, Select } from "antd";
import { signupRequestColumn } from "./sign_up_request_component/SignupRequestColumn";
import RequestedUser from "./sign_up_request_component/RequestedUser";
import {
  useGetAllServiceProvidersQuery,
  useVerifyServiceProviderMutation,
  useApproveProviderUpdateMutation,
} from "../../RTK/services/dashboard/authorised-teams/admins/serviceProvdiers/serviceProvdiersApi";
import Loading from "../../components/common/Loading";
import { baseUrl } from "../../utils/optimizationFunction";
import toast from "react-hot-toast";

function SignUpUserRequest({ title, pendingRequest, pagination = false }) {
  const [verifyProvider, { isLoading: isVerifyingOrApproving }] =
    useVerifyServiceProviderMutation();
  const [approveProviderUpdate, { isLoading: isApprovingUpdate }] =
    useApproveProviderUpdateMutation();
  const { data: serviceProvider, isLoading, refetch } = useGetAllServiceProvidersQuery({ page: 1, limit: 10000 }, {
    skip: !!pendingRequest
  });

  const providers = useMemo(() => {
    const allProviders = pendingRequest || serviceProvider?.data?.providers || [];
    return allProviders
      .map(item => {
        const isPendingNewRequest = item.isVerified === false && item.isRejected === false;
        const hasPendingUpdates = item.pendingUpdates && typeof item.pendingUpdates === 'object' && Object.keys(item.pendingUpdates).length > 0;
        const isVerifiedWithUpdates = item.isVerified === true && item.isRejected === false && hasPendingUpdates;

        let requestType = 'NONE';
        if (isPendingNewRequest) {
          requestType = 'PENDING_NEW';
        } else if (isVerifiedWithUpdates) {
          requestType = 'PENDING_UPDATE';
        }
        
        return { ...item, requestType };
      })
      .filter(item => item.requestType === 'PENDING_NEW' || item.requestType === 'PENDING_UPDATE');
  }, [serviceProvider, pendingRequest]);

  const BASE_URL = `${baseUrl}/`;

  const adminData =
    providers?.map((item) => ({
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
      avatar: "https://avatar.iran.liara.run/public/13",
      website_link: item.website
        ? item.website.startsWith("http")
          ? item.website
          : `https://${item.website}`
        : "N/A",
      certificate:
        Array.isArray(item.attachments) && item.attachments[0]
          ? `${BASE_URL}${item.attachments[0].replace(/\\/g, "/")}`
          : "https://via.placeholder.com/150",
      license:
        Array.isArray(item.attachments) && item.attachments[1]
          ? `${BASE_URL}${item.attachments[1].replace(/\\/g, "/")}`
          : "https://via.placeholder.com/150",
      requestType: item.requestType,
      pendingUpdates: item.pendingUpdates,
    })) || [];
  const [record, setRecord] = useState(null);
  const handleView = (record) => {
    console.log(record);
    setRecord(record);
    setOpen(true);
  };
  const handleDelete = async (id) => {
    let bodyData = {
      providerId: id,
      isVerified: "false",
      isRejected: "true",
    };
    console.log(bodyData, "reg");
    try {
      const response = await verifyProvider(bodyData).unwrap();
      toast.success("Rejected successfully");
      console.log("✅ Rejected successfully:", response);
      refetch();
    } catch (error) {
      toast.error("Rejected failed");

      console.error("❌ Rejected failed:", error);
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
      console.error("❌ Approve updates failed:", error);
    }
  };


  const handleAccept = async (id) => {
    let bodyData = {
      providerId: id,
      isVerified: "true",
      isRejected: "false",
    };
    try {
      const response = await verifyProvider(bodyData).unwrap();

      console.log("✅ Verified successfully:", response);
      toast.success("Verified successfully");
      refetch();
    } catch (error) {
      console.error("❌ Verification failed:", error);
      toast.error("Verification failed");
    }
  };
  const [open, setOpen] = useState(false);
  const [filterType, setFilterType] = useState('ALL');
  const hide = useCallback((value) => {
    setOpen(!value);
  }, []);

  const handleFilterChange = (value) => {
    setFilterType(value);
  };

  const filteredAdminData = useMemo(() => {
    if (filterType === 'ALL' || pendingRequest) {
      return adminData;
    }
    return adminData.filter(item => item.requestType === filterType);
  }, [adminData, filterType, pendingRequest]);


  if (isLoading || isVerifyingOrApproving || isApprovingUpdate) {
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
          adminData={filteredAdminData}
          handleDelete={handleDelete}
          handleAccept={handleAccept}
          handleView={handleView}
          handleApproveUpdate={handleApproveUpdate}
          pagination={pagination}
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
    />
  );
};
