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

function SignUpUserRequest() {
  const [verifyProvider, { isLoading: isLoading2 }] =
    useVerifyServiceProviderMutation();
  const { data: serviceProvider, isLoading } = useGetAllServiceProvidersQuery();
  if (isLoading || isLoading2) {
    <Loading />;
  }

  let providers = serviceProvider?.data.providers.filter((item) => {
    if (item.isVerified === false && item.isRejected === false) return item;
  });
  console.log(providers);
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
    })) || [];
  // console.log(adminData);
  // const adminData = [
  //   {
  //     _id: "1",
  //     name: "Hosain",
  //     email: "hosain@gmail.com",
  //     website_link: "https://hosain.com",
  //     company_name: "Hosain",
  //     category: "Plumbing",
  //     sub_category: "Pipe Repair",
  //     working_hours: "9 AM - 5 PM",
  //     weekend: "Saturday",
  //     contact_person: "Hosain",
  //     avatar: "https://avatar.iran.liara.run/public/13",
  //     phone: "123-456-7890",
  //     createdAt: "2023-01-01",
  //   },
  // ];
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

      console.log("✅ Rejected successfully:", response);
    } catch (error) {
      console.error("❌ Rejected failed:", error);
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
    } catch (error) {
      console.error("❌ Verification failed:", error);
    }
  };
  const [open, setOpen] = useState(false);
  const hide = useCallback((value) => {
    setOpen(!value);
  }, []);

  return (
    <PageLayout title="New Providers Awaiting Approval">
      <PageContent>
        <SignupRequestTable
          adminData={adminData}
          handleDelete={handleDelete}
          handleAccept={handleAccept}
          handleView={handleView}
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
}) => {
  return (
    <Table
      scroll={{ x: "max-content" }}
      columns={signupRequestColumn({
        onView: handleView,
        handleDelete,
        handleAccept,
      })}
      dataSource={adminData}
      pagination={false}
    />
  );
};
