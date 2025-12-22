import React, { useState, useEffect, useCallback } from "react";
import { Table, Modal, Input, Pagination } from "antd";
import { userManageColumns } from "./userManageColumns";
import UserDeailsCard from "./UserDeailsCard";
import {
  useBlockUserMutation,
  useGetAdminUsersQuery,
} from "../../../RTK/services/dashboard/safe-user/admins/user/userApis";
import toast from "react-hot-toast";

function UserManageTable() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [blockUser, { isLoading }] = useBlockUserMutation();

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const { data: users, isLoading: userDataLoading } = useGetAdminUsersQuery({
    searchTerm: debouncedSearch,
    page: currentPage,
    limit: pageSize,
  });

  // ✅ Handlers
  const handleSearchChange = (e) => {
    const value = e.target.value.trim();
    setSearchTerm(value);
    console.log("🔍 Searching for:", value);
  };

  const handleView = useCallback((record) => {
    setSelectedUser(record);
  }, []);

  const handleBlock = useCallback(
    async (record) => {
      console.log((!record?.authId?.isBlocked).toString());
      const body = {
        authId: record?.authId._id,
        isBlocked: !record?.authId?.isBlocked ? "true" : "false", // toggle current status
      };

      try {
        const res = await blockUser(body).unwrap();
        toast.success(
          `User ${
            record?.authId?.isBlocked ? "unblocked" : "blocked"
          } successfully`
        );
        console.log(res);

        // Optionally refresh the user list if using RTK query
        // refetch();
      } catch (error) {
        console.error("❌ Block/Unblock failed:", error);
        toast.error("Failed to update user status");
      }
    },
    [blockUser]
  );

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  return (
    <div>
      {/* Search Field */}
      <Input.Search
        className="mb-4"
        placeholder="Search by name or email"
        onChange={handleSearchChange}
        value={searchTerm}
        allowClear
        style={{ maxWidth: 300 }}
      />

      {/* User Table */}
      <Table
        columns={userManageColumns(handleView, handleBlock)}
        dataSource={users?.data?.users || []}
        loading={userDataLoading}
        pagination={{
          current: users?.data?.meta?.page || 1,
          pageSize: users?.data?.meta?.limit || 10,
          total: users?.data?.meta?.total || 0,
          onChange: handlePaginationChange,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        scroll={{ x: "max-content" }}
        size="large"
        bordered
        rowKey="_id"
      />

      {/* User Details Modal */}
      <Modal
        open={!!selectedUser}
        footer={null}
        onCancel={() => setSelectedUser(null)}
        centered
        width={500}
      >
        {selectedUser && <UserDeailsCard user_profile={selectedUser} />}
      </Modal>
    </div>
  );
}

export default UserManageTable;
