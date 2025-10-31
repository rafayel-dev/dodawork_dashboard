import React, { useState, useEffect, useCallback } from "react";
import { Table, Modal, Input } from "antd";
import { userManageColumns } from "./userManageColumns";
import UserDeailsCard from "./UserDeailsCard";
import {
  useBlockUserMutation,
  useGetAdminUsersQuery,
} from "../../../RTK/services/dashboard/authorised-teams/admins/user/userApis";
import toast from "react-hot-toast";

function UserManageTable() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [blockUser, { isLoading }] = useBlockUserMutation();

  // ✅ Debounce search term (wait 500ms after typing)
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // ✅ Fetch users based on debounced search term
  const { data: users, isLoading: userDataLoading } =
    useGetAdminUsersQuery(debouncedSearch);

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
      const body = {
        authId: record?.authId._id,
        isBlocked: (!record.isBlocked).toString(), // toggle current status
      };

      try {
        const res = await blockUser(body).unwrap();
        toast.success(
          `User ${record.isBlocked ? "unblocked" : "blocked"} successfully`
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
        pagination={false}
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
