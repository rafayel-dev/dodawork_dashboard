import React from "react";
import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/profile/Profile";
import UserManagement from "../pages/user-management/UserManagement";
import AwaitingRequests from "../pages/awaiting-requests/AwaitingRequests";
import ServiceProvider from "../pages/service-provider/ServiceProvider";
import CategoriesManagement from "../pages/categories-management/CategoriesManagement";
import MatchedServices from "../pages/approval-section/MatchedServices";
import FAQ from "../pages/faq/FAQ";
import PrivacyPolicy from "../pages/privacy-policy/PrivacyPolicy";
import TermsAndConditions from "../pages/terms/TermsAndConditions";
import NotFound from "../pages/NotFound";
import Layout from "../components/Layout/Layout";
import SubcategoryManagement from "../pages/categories-management copy/SubcategoryManagement";
import Test from "../components/common/Test";
import ChatLayout from "../pages/chat/ChatLayout";
import AdminPage from "../pages/admin/AdminPage";
import SignUpUserRequest from "../pages/sign-up-user-request/SignUpUserRequest";
import AuthChecker from "../security/AuthChecker";

export const DashboardRoutes = {
    path: "/",
    errorElement: <NotFound />,
    element:
        <AuthChecker>
            <Layout />
        </AuthChecker>,
    children: [
        {
            index: true,
            element: <Dashboard />,
        },
        {
            path: "/",
            element: <Dashboard />,
        },
        {
            path: "profile",
            element: <Profile />,
        },
        {
            path: "user-management",
            element: <UserManagement />,
        },
        {
            path: "awaiting-requests",
            element: <AwaitingRequests />,
        },
        {
            path: "service-provider",
            element: <ServiceProvider />,
        },
        {
            path: "sign-up-user-request",
            element: <SignUpUserRequest />,
        },
        {
            path: "categories-management",
            element: <CategoriesManagement />,
        },
        {
            path: "categories-management/sub-category/:id",
            element: <SubcategoryManagement />,
        },
        {
            path: "matched-services",
            element: <MatchedServices />,
        },
        {
            path: "admin",
            element: <AdminPage />,
        },
        {
            path: "faq",
            element: <FAQ />,
        },
        {
            path: "privacy-policy",
            element: <PrivacyPolicy />,
        },
        {
            path: "terms",
            element: <TermsAndConditions />,
        },
        {
            path: "test",
            element: <Test />,
        },
        {
            path: "chat",
            element: <ChatLayout />,
        },
        {
            path: "*",
            element: <NotFound />,
        },
    ],
};
