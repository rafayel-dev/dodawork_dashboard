import React, { useState, useRef, useEffect } from "react";
import { FiBell, FiCheck, FiAlertCircle, FiInfo } from "react-icons/fi";
import {
  useGetAllNotificationsQuery,
  useLazyGetNotificationQuery,
} from "../../RTK/services/dashboard/authorised-teams/notification/notificationApi";
import NotificationModal from "./NotificationModal";

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { data: notificationData, isLoading } = useGetAllNotificationsQuery({
    page,
    limit: 10,
  });
  const [notifications, setNotifications] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const scrollContainerRef = useRef(null);

  const [trigger] = useLazyGetNotificationQuery();

  const dropdownRef = useRef(null);

  const handleNotificationClick = (_id) => {
    setIsModalOpen(true);
    setIsFetchingDetails(true);
    trigger(_id)
      .unwrap()
      .then((payload) => {
        setSelectedNotification(payload.data);
      })
      .catch((e) => console.error(e))
      .finally(() => {
        setIsFetchingDetails(false);
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  };

  const getNotificationType = (title) => {
    if (title.toLowerCase().includes("new provider registered")) {
      return "success";
    }
    if (title.toLowerCase().includes("provider update request")) {
      return "info";
    }
    if (title.toLowerCase().includes("new service request created")) {
      return "info";
    }
    return "info"; // Default type
  };

  useEffect(() => {
    if (notificationData?.data?.notification) {
      const formattedNotifications = notificationData.data.notification.map(
        (notif) => ({
          id: notif._id,
          title: notif.title,
          message: notif.message,
          read: notif.isRead,
          time: formatTimeAgo(notif.createdAt),
          type: getNotificationType(notif.title),
        })
      );
      if (page === 1) {
        setNotifications(formattedNotifications);
      } else {
        setNotifications((prev) => [...prev, ...formattedNotifications]);
      }
      setTotalPage(notificationData.data.meta.totalPage);
    }
  }, [notificationData, page]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (page < totalPage && !isLoading) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    }
  };

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
    <>
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

            <div
              className="max-h-96 overflow-y-auto"
              ref={scrollContainerRef}
              onScroll={handleScroll}
            >
              {isLoading && page === 1 ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : notifications.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${
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
                  {isLoading && page > 1 && (
                    <div className="p-4 text-center text-gray-500">
                      Loading more...
                    </div>
                  )}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No new notifications
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <NotificationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        notification={selectedNotification}
        isLoading={isFetchingDetails}
      />
    </>
  );
};

export default Notifications;
