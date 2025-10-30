import React, { useCallback, useState } from "react";
import { Table, Modal, message } from "antd";
import { userManageColumns } from "./userManageColumns";
import SearchInput from "../../../components/common/SearchInput";
import UserDeailsCard from "./UserDeailsCard";
import { useGetAdminUsersQuery } from "../../../RTK/services/dashboard/authorised-teams/admins/user/userApis";

function UserManageTable() {
  const [selectedUser, setSelectedUser] = useState(null);
  const { data: users, isLoading: userDataLoading } = useGetAdminUsersQuery();


  const handleView = useCallback((record) => {
    setSelectedUser(record);
  }, [selectedUser]);

  const handleBlock = useCallback((record) => {
    alert(`${record?.user_profile?.name} blocked successfully`);
  }, [selectedUser]);

  return (
    <div>
      <SearchInput className="mb-4" placeholder="Search by Email" />
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
