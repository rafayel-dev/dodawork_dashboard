import React from "react";
import {
  FaTimes,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

import main_logo from "../../assets/main_logo.svg";
import cn from "../../lib/cn";
import { menuItems, superAdminMenuItems } from "./sidebarRoutes";
import { useGetSuperAdminProfileQuery } from "../../RTK/services/profileApis/superAdminProfileApis";

function MainSidebar({ toggleSidebar, isSidebarOpen }) {
  const location = useLocation();
  const { data: superAdminProfile, isLoading: superAdminProfileLoading } = useGetSuperAdminProfileQuery()
  const isActive = (path) =>
    location.pathname === path ? "bg-[var(--secondary-color)]" : "";
  const menu = superAdminProfile?.data?.authId?.role === "SUPER_ADMIN" ? superAdminMenuItems : menuItems;
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 transform bg-[var(--primary-color)] text-white transition-transform duration-300 ease-in-out lg:translate-x-0",
        {
          "translate-x-0": isSidebarOpen,
          "-translate-x-full": !isSidebarOpen,
        }
      )}
    >
      <div className="flex h-20 items-center justify-between px-4">
        <div className="flex items-center w-14 h-14 gap-2">
          <img src={main_logo} alt="Doda_logo" />
          <h1 className="text-xl font-bold">Dodawork</h1>
        </div>
        <button className="rounded-md p-1 text-gray-400 hover:bg-gray-700 lg:hidden">
          <FaTimes onClick={toggleSidebar} className="h-6 w-6" />
        </button>
      </div>
      <nav className="mt-4">
        <ul>
          {menu.map((item) => (
            <li key={item.path} className="mb-1">
              <NavLink
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 rounded-md mx-2 transition-colors",
                  {
                    "bg-[var(--secondary-color)]": isActive(item.path),
                  }
                )}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default MainSidebar;
