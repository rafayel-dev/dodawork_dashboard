import React from "react";
import { Modal, Spin } from "antd";

const NotificationModal = ({
  isOpen,
  onClose,
  notification,
  isLoading,
}) => {
  return (
    <Modal
      title={
        isLoading ? "Loading..." : notification?.title || "Notification Details"
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Spin size="large" />
        </div>
      ) : notification ? (
        <div>
          <p className="text-gray-800">{notification.message}</p>
          <p className="mt-4 text-xs text-gray-400">
            Received: {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
      ) : (
        <div className="text-center p-8">No details available.</div>
      )}
    </Modal>
  );
};

export default NotificationModal;
