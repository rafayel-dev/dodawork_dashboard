import React, { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import ProfileSidebar from "../ProfileSidebar/ProfileSidebar";
import MainSidebar from "./MainSidebar";
import Header from "./Header";
import { useGetSuperAdminProfileQuery } from "../../RTK/services/profileApis/superAdminProfileApis";
import { imageUrl } from "../../utils/optimizationFunction";

const Layout = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { data: superAdminProfile, isLoading: superAdminProfileLoading } = useGetSuperAdminProfileQuery()
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
    role: "",
  });
  useEffect(() => {
    if (superAdminProfile && !superAdminProfileLoading) {
      setUser({
        name: superAdminProfile?.data?.name || "",
        email: superAdminProfile?.data?.email || "",
        avatar: imageUrl(superAdminProfile?.data?.profile_image) || "",
        role: superAdminProfile?.data?.authId?.role || "",
      });
    }
  }, [superAdminProfile, superAdminProfileLoading]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        if (!event.target.closest(".profile-image-trigger")) {
          setIsProfileOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {isSidebarOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 lg:hidden z-20"
          onClick={toggleSidebar}
        ></div>
      )}


      <MainSidebar
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarOpen={isSidebarOpen}
        role={user?.role}
        toggleSidebar={toggleSidebar}
      />


      <div className="flex flex-1 flex-col overflow-hidden">

        <Header user={user} toggleSidebar={toggleSidebar} />


        <main className="flex-1 bg-gray-100 overflow-y-auto p-4 lg:ml-64">
          <div className="mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      <ProfileSidebar
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
      />
    </div>
  );
};

export default Layout;
