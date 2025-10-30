import React, { useCallback, useState } from "react";
import { Table } from "antd";
import SearchInput from "../../../components/common/SearchInput";
import { serviceProviderColumns } from "./serviceProviderColumns";
import ServiceProviderDetails from "./ServiceProviderDetails";
import { useGetAllServiceProvidersQuery } from "../../../RTK/services/dashboard/authorised-teams/admins/serviceProvdiers/serviceProvdiersApi";
import Loading from "../../../components/common/Loading";
import { baseUrl } from "../../../utils/optimizationFunction";
function ServiceProviderTable() {
  const { data: serviceProvider, isLoading } = useGetAllServiceProvidersQuery();

  const [open, setOpen] = useState(false);
  const [record, setRecord] = useState(null);
  const hide = useCallback((value) => {
    setOpen(value);
  }, []);

  if (isLoading) {
    <Loading />;
  }

  const BASE_URL = `${baseUrl}/`;
  let providers = serviceProvider?.data.providers.filter((item) => {
    if (item.isVerified === true) return item;
  });

  const data = providers?.map((item) => ({
    request_id: item._id || "N/A",
    key: item._id || Math.random().toString(),
    name: item.authId?.name || "Unknown",
    email: item.authId?.email || "N/A",
    phone: item.authId?.phone || "N/A",
    status: item.isVerified ? "Verified" : "Pending",
    company_name: item.companyName || "N/A",
    company_address: item.serviceLocation || "N/A",
    category:
      Array.isArray(item.serviceCategories) && item.serviceCategories.length > 0
        ? item.serviceCategories[0].name
        : "N/A",
    sub_category:
      Array.isArray(item.serviceCategories) && item.serviceCategories.length > 1
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
    website_link: item.website || "N/A",
    certificate:
      item.attachments?.[0] && !item.attachments[0].endsWith(".mp4")
        ? `${BASE_URL}${item.attachments[0].replace(/\\/g, "/")}`
        : "https://via.placeholder.com/150",
    license:
      item.attachments?.[1] && !item.attachments[1].endsWith(".mp4")
        ? `${BASE_URL}${item.attachments[1].replace(/\\/g, "/")}`
        : "https://via.placeholder.com/150",
  }));

  // const data = [
  //   {
  //     request_id: "#121211",
  //     key: "1",
  //     name: "John Doe",
  //     email: "7o4wP@example.com",
  //     phone: "123-456-7890",
  //     status: "Pending",
  //     company_name: "John Doe",
  //     company_address: "Dhaka, Banani",
  //     category: "Plumbing",
  //     sub_category: "Pipe Repair",
  //     working_hours: "9 AM - 5 PM",
  //     weekend: "Saturday",
  //     contact_person: "John Doe",
  //     avatar: "https://avatar.iran.liara.run/public/13",
  //     website_link: "https://www.google.com",
  //     certificate: "https://m.media-amazon.com/images/I/719S52YjtmL.jpg",
  //     license:
  //       "https://d1hv7ee95zft1i.cloudfront.net/custom/blog-post-photo/gallery/philippine-drivers-license-5fc9f1eb3b9f9.jpg",
  //   },
  // ];

  const handleView = useCallback((record) => {
    console.log("details", record);
    setRecord(record);
    setOpen(true);
  }, []);

  return (
    <div>
      <SearchInput className="mb-4" placeholder="Search by Email" />
      <Table
        columns={serviceProviderColumns(handleView)}
        dataSource={data}
        pagination={false}
        scroll={{ x: "max-content" }}
        size="large"
        bordered
      />
      <ServiceProviderDetails open={open} hide={hide} record={record} />
    </div>
  );
}

export default ServiceProviderTable;
