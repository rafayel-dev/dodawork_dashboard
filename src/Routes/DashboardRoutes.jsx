import React, { Suspense } from "react";
import lazyImport from "../utils/lazyImport";

const Dashboard = lazyImport(() => import("../pages/dashboard/Dashboard"));
const Profile = lazyImport(() => import("../pages/profile/Profile"));
const UserManagement = lazyImport(() => import("../pages/user-management/UserManagement"));
const AwaitingRequests = lazyImport(() => import("../pages/awaiting-requests/AwaitingRequests"));
const ServiceProvider = lazyImport(() => import("../pages/service-provider/ServiceProvider"));
const CategoriesManagement = lazyImport(() => import("../pages/categories-management/CategoriesManagement"));
const SubcategoryManagement = lazyImport(() => import("../pages/categories-management copy/SubcategoryManagement"));
const MatchedServices = lazyImport(() => import("../pages/approval-section/MatchedServices"));
const FAQ = lazyImport(() => import("../pages/faq/FAQ"));
const PrivacyPolicy = lazyImport(() => import("../pages/privacy-policy/PrivacyPolicy"));
const TermsAndConditions = lazyImport(() => import("../pages/terms/TermsAndConditions"));
const NotFound = lazyImport(() => import("../pages/NotFound"));
const Test = lazyImport(() => import("../components/common/Test"));
const ChatLayout = lazyImport(() => import("../pages/chat/ChatLayout"));
const AdminPage = lazyImport(() => import("../pages/admin/AdminPage"));
const SignUpUserRequest = lazyImport(() => import("../pages/sign-up-user-request/SignUpUserRequest"));
const Layout = lazyImport(() => import("../components/Layout/Layout"));
const AuthChecker = lazyImport(() => import("../security/AuthChecker"));

export const DashboardRoutes = {
  path: "/",
  errorElement: (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFound />
    </Suspense>
  ),
  element: (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthChecker>
        <Layout />
      </AuthChecker>
    </Suspense>
  ),
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Dashboard />
        </Suspense>
      ),
    },
    {
      path: "profile",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Profile />
        </Suspense>
      ),
    },
    {
      path: "user-management",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <UserManagement />
        </Suspense>
      ),
    },
    {
      path: "awaiting-requests",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <AwaitingRequests />
        </Suspense>
      ),
    },
    {
      path: "service-provider",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <ServiceProvider />
        </Suspense>
      ),
    },
    {
      path: "sign-up-user-request",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <SignUpUserRequest />
        </Suspense>
      ),
    },
    {
      path: "categories-management",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <CategoriesManagement />
        </Suspense>
      ),
    },
    {
      path: "categories-management/sub-category/:id",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <SubcategoryManagement />
        </Suspense>
      ),
    },
    {
      path: "matched-services",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <MatchedServices />
        </Suspense>
      ),
    },
    {
      path: "admin",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <AdminPage />
        </Suspense>
      ),
    },
    {
      path: "faq",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <FAQ />
        </Suspense>
      ),
    },
    {
      path: "privacy-policy",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <PrivacyPolicy />
        </Suspense>
      ),
    },
    {
      path: "terms",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <TermsAndConditions />
        </Suspense>
      ),
    },
    {
      path: "test",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Test />
        </Suspense>
      ),
    },
    {
      path: "chat",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <ChatLayout />
        </Suspense>
      ),
    },
    {
      path: "*",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <NotFound />
        </Suspense>
      ),
    },
  ],
};
