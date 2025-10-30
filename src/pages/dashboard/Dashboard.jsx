import React, { memo } from "react";
import { PageLayout, PageContent } from "../../components/PageLayout";
import StatusCard from "./components/StatusCard";
import user from "../../assets/user.svg";
import total_requests from "../../assets/total_request.svg";
import total_income from "../../assets/income.svg";
import service_providers from "../../assets/service_provider.svg";
import RequestsTrend from "../../components/charts/RequestsTrend";
import CompletionRate from "../../components/charts/CompletionRate";
import AwaitingRequeststable from "../awaiting-requests/request_component/AwaitingRequeststable";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { useGetAdminUsersQuery } from "../../RTK/services/dashboard/authorised-teams/admins/user/userApis";
import Loading from "../../components/common/Loading";
import { useGetAllServiceRequestQuery } from "../../RTK/services/dashboard/authorised-teams/admins/serviceRequest/useServiceRequest";

const Dashboard = () => {
  const { data: userData, isLoading } = useGetAdminUsersQuery();
  const { data: serviceRequestData, isLoading: isLoading2 } =
    useGetAllServiceRequestQuery();

  if (isLoading || isLoading2) {
    <Loading />;
  }
  console.log(serviceRequestData?.data?.meta.total);

  const data = [
    {
      title: "Total Users",

      number: userData?.data.meta.total | 0,
      icon: user,
    },
    {
      title: "Total Requests",
      number: serviceRequestData?.data?.meta.total | 0,
      icon: total_requests,
    },
    {
      title: "Total Income",
      number: 120,
      icon: total_income,
    },
    {
      title: "Service Provdiers",
      number: 213,
      icon: service_providers,
    },
  ];
  return (
    <PageLayout>
      <PageContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item, index) => (
            <StatusCard item={item} key={index} />
          ))}
        </div>
        <div className="bg-white border border-gray-200/40 rounded-lg shadow mt-6">
          <div className="w-full h-[420px] p-4 grid grid-cols-2 gap-4">
            <RequestsTrend />
            <CompletionRate />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black line-clamp-1">
            Awaiting Requests
          </h1>
          <Link to="/awaiting-requests">
            <Button type="link" className="text-[var(--primary-color)]">
              Show All
            </Button>
          </Link>
        </div>
        <AwaitingRequeststable pagination={false} />
      </PageContent>
    </PageLayout>
  );
};

export default memo(Dashboard);
