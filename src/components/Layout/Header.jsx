import React, { useState, useRef } from "react";
import Notifications from "../Notifications/Notifications";
import { FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../RTK/slices/authSlice";


function Header({ user, toggleSidebar }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const payload = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
  };

  return (
    <div>
      <header className="flex h-20 items-center bg-[var(--primary-color)] shadow-sm lg:ml-64">
        <div className="flex items-center px-4 lg:hidden">
          <button
            onClick={toggleSidebar}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
          >
            <FaBars className="h-6 w-6" />
          </button>
        </div>
        <div className="ml-auto flex items-center px-4 space-x-4">
          <Notifications />
          <div className="relative" ref={profileRef}>
            <button
              onClick={toggleProfile}
              className="flex items-center space-x-2 focus:outline-none profile-image-trigger cursor-pointer"
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                {user.name}
              </span>
              <FiChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform ${isProfileOpen ? "transform rotate-180" : ""
                  }`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <FiUser className="mr-3 h-5 w-5 text-gray-400" />
                  <span>Your Profile</span>
                </Link>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center cursor-pointer"
                >
                  <FiLogOut className="mr-3 h-5 w-5 text-red-400" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
