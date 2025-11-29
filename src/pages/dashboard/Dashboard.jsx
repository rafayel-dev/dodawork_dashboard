import React, { memo, useEffect } from "react";
import { PageLayout, PageContent } from "../../components/PageLayout";
import StatusCard from "./components/StatusCard";
import user from "../../assets/user.svg";
import total_requests from "../../assets/total_request.svg";
import total_income from "../../assets/income.svg";
import service_providers from "../../assets/service_provider.svg";
import RequestsTrend from "../../components/charts/RequestsTrend";
import CompletionRate from "../../components/charts/CompletionRate";
import { useGetAdminUsersQuery } from "../../RTK/services/dashboard/authorised-teams/admins/user/userApis";
import Loading from "../../components/common/Loading";
import { useGetAllServiceProvidersQuery } from "../../RTK/services/dashboard/authorised-teams/admins/serviceProvdiers/serviceProvdiersApi";
import { useGetAllServiceRequestQuery } from "../../RTK/services/dashboard/authorised-teams/admins/serviceRequest/ServiceRequestApis";
import SignUpUserRequest from "../sign-up-user-request/SignUpUserRequest";

const Dashboard = () => {
  const { data: userData, isLoading, isError, error } = useGetAdminUsersQuery({});
  const { data: serviceRequestData, isLoading: isLoading2 } =
    useGetAllServiceRequestQuery({});
  const { data: serviceProvider, isLoading: isLoading3 } =
    useGetAllServiceProvidersQuery();

  useEffect(() => {
    if(isError){
      console.error("Error fetching admin users:", error);
    }
  }, [isError, error]);

  if (isLoading || isLoading2 || isLoading3) {
    return <Loading />;
  }

  let pendingRequest = serviceProvider?.data.providers
    ?.filter((item) => item.isVerified === false && item.isRejected === false)
    .slice(-3);
  
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
      title: "Service Provider",
      number: serviceProvider?.data?.meta.total | 0,
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

        <SignUpUserRequest
          title="Recent Service Provider Requests"
          pagination={false}
          pendingRequest={pendingRequest}
        />
      </PageContent>
    </PageLayout>
  );
};

export default memo(Dashboard);
