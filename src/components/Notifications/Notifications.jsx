import React, { useState, useRef, useEffect } from "react";
import { FiBell, FiCheck, FiAlertCircle, FiInfo } from "react-icons/fi";
import { useGetAllNotificationsQuery } from "../../RTK/services/dashboard/authorised-teams/notification/notificationApi";

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications2, isLoading } = useGetAllNotificationsQuery();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New update available",
      message: "A new version of the dashboard is available.",
      type: "info",
      read: false,
      time: "2 minutes ago",
    },
    {
      id: 2,
      title: "New user registered",
      message: "John Doe has created a new account.",
      type: "success",
      read: false,
      time: "1 hour ago",
    },
    {
      id: 3,
      title: "Server maintenance",
      message: "Scheduled maintenance this weekend.",
      type: "warning",
      read: true,
      time: "1 day ago",
    },
  ]);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (!event.target.closest(".notification-trigger")) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    // Mark all as read when opening
    if (!isOpen) {
      markAllAsRead();
    }
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({
        ...notif,
        read: true,
      }))
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <FiCheck className="h-5 w-5 text-green-500" />;
      case "warning":
        return <FiAlertCircle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <FiAlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FiInfo className="h-5 w-5 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleNotifications}
        className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary-color)] relative notification-trigger cursor-pointer"
      >
        <FiBell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-900">Notifications</h3>
            {notifications.some((n) => !n.read) && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-[var(--secondary-color)] hover:text-yellow-600"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No new notifications
              </div>
            )}
          </div>

          {/* <div className="p-3 border-t border-gray-200 text-center">
            <a
              href="#"
              className="text-sm font-medium text-[var(--secondary-color)] hover:text-yellow-600"
            >
              View all notifications
            </a>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default Notifications;
