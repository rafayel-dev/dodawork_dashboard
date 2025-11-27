import React, { useCallback, useState } from "react";
import { PageContent, PageLayout } from "../../components/PageLayout";
import { Modal, Table } from "antd";
import { signupRequestColumn } from "./sign_up_request_component/SignupRequestColumn";
import RequestedUser from "./sign_up_request_component/RequestedUser";
import {
  useGetAllServiceProvidersQuery,
  useVerifyServiceProviderMutation,
} from "../../RTK/services/dashboard/authorised-teams/admins/serviceProvdiers/serviceProvdiersApi";
import Loading from "../../components/common/Loading";
import { baseUrl } from "../../utils/optimizationFunction";
import toast from "react-hot-toast";

function SignUpUserRequest() {
  const [verifyProvider, { isLoading: isLoading2 }] =
    useVerifyServiceProviderMutation();
  const { data: serviceProvider, isLoading, refetch } = useGetAllServiceProvidersQuery({ page: 1, limit: 10000 });
  if (isLoading || isLoading2) {
    return <Loading />;
  }

  const providers =
    serviceProvider?.data.providers?.filter(
      (item) => {
        const isPendingNewRequest =
          item.isVerified === false &&
          item.isRejected === false;

        const hasPendingUpdates =
          item.pendingUpdates &&
          typeof item.pendingUpdates === "object" &&
          Object.keys(item.pendingUpdates).length > 0;

        const isVerifiedWithUpdates =
          item.isVerified === true &&
          item.isRejected === false &&
          hasPendingUpdates;

        item._isPendingNewRequest = isPendingNewRequest;
        item._isVerifiedWithUpdates = isVerifiedWithUpdates;

        return isPendingNewRequest || isVerifiedWithUpdates;
      }
    ) || [];

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
      working_hours:
        Array.isArray(item.workingHours) && item.workingHours.length > 0
          ? `${item.workingHours[0].startTime} - ${item.workingHours[0].endTime}`
          : "N/A",
      weekend:
        Array.isArray(item.workingHours) && item.workingHours.length > 0
          ? item.workingHours[0].day
          : "N/A",
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
      requestType: item._isPendingNewRequest ? 'PENDING_NEW' : (item._isVerifiedWithUpdates ? 'PENDING_UPDATE' : 'UNKNOWN'),
      pendingUpdates: item.pendingUpdates, // Pass pending updates data
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

  // New handler for approving updates
  const handleApproveUpdate = async (id) => {
    // This will likely need a new mutation or an extended body for verifyProvider
    // For now, assuming verifyProvider can handle pendingUpdates.
    // The body should probably include the updates to apply.
    let bodyData = {
      providerId: id,
      isVerified: "true", // Keep verified
      isRejected: "false", // Keep not rejected
      // Additional field to signal applying pending updates
      applyPendingUpdates: true, // This is an assumption about the API
    };
    try {
      // Need to adjust the API call to approve updates if it's different
      // For now, using verifyProvider as a placeholder
      await verifyProvider(bodyData).unwrap();
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
  const hide = useCallback((value) => {
    setOpen(!value);
  }, []);

  return (
    <PageLayout title="Providers Awaiting Approval">
      <PageContent>
        <SignupRequestTable
          adminData={adminData}
          handleDelete={handleDelete}
          handleAccept={handleAccept}
          handleView={handleView}
          handleApproveUpdate={handleApproveUpdate} // Pass new handler
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
  handleApproveUpdate, // Accept new handler
}) => {
  return (
    <Table
      scroll={{ x: "max-content" }}
      columns={signupRequestColumn({
        onView: handleView,
        handleDelete,
        handleAccept,
        handleApproveUpdate, // Pass new handler
      })}
      dataSource={adminData}
      pagination={false}
    />
  );
};
