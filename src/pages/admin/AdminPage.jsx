import React, { useCallback, useState } from 'react'
import { PageLayout, PageContent } from '../../components/PageLayout'
import { Button, Input, Modal, Table } from 'antd'
import { adminTableColumn } from './admin-component/AdminTableColumn'
import { FaPlus } from 'react-icons/fa'
import AdminForm from './admin-component/AdminForm'
import { useBlockUnblockAdminMutation, useDeleteAdminMutation, useGetAllAdminQuery } from '../../RTK/services/dashboard/authorised-teams/admins/adminApis'
import toast from 'react-hot-toast'
function AdminPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const { data: adminInformationData, isLoading: adminDataLoading, isFetching } = useGetAllAdminQuery({
        searchTerm: searchTerm
    })
    const [open, setOpen] = useState(false)
    const hide = useCallback(() => {
        setOpen(false)
    }, [open])
    const handleAddAdmin = useCallback(() => {
        setOpen(true);
    }, []);
    return (
        <PageLayout title="Admin">
            <PageContent>
                <div className='flex justify-between items-center'>
                    <Input.Search loading={isFetching} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: "260px" }} placeholder="Search" />
                    <Button
                        icon={<FaPlus />}
                        onClick={handleAddAdmin}
                        style={{ backgroundColor: "var(--primary-color)", color: "white", border: "none", borderRadius: "5px", padding: "5px 10px", fontSize: "14px", fontWeight: "bold", cursor: "pointer", transition: "all 0.3s ease-in-out", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)", marginBottom: "10px", }}
                    >Add Admin</Button>
                </div>
                <AdminTable data={adminInformationData?.data?.admins} loading={adminDataLoading} />
                <Modal
                    title="Add Admin"
                    open={open}
                    centered
                    onCancel={hide}
                    footer={null}
                    destroyOnClose
                >
                    <AdminForm open={open} hide={hide} />
                </Modal>
            </PageContent>
        </PageLayout>
    )
}

export default AdminPage


const AdminTable = ({ data, loading }) => {
    const [openEdit, setOpenEdit] = useState(false)
    const [editId, setEditId] = useState(null)
    const [blockUnblockAdmin] = useBlockUnblockAdminMutation()
    const [deleteAdmin] = useDeleteAdminMutation()
    const hideEdit = useCallback(() => {
        setOpenEdit(false)
    }, [])
    const handleBlock = useCallback(async (id, isBlocked) => {
        try {
            const data = {
                authId: id,
                isBlocked: isBlocked ? 'false' : 'true'
            }
            await blockUnblockAdmin(data).unwrap().then((res) => {
                if (res?.success) {
                    toast.success(res?.message || "Admin blocked successfully")
                } else {
                    throw new Error(res?.message || "Something went wrong")
                }
            })
        } catch (error) {
            toast.error(error?.data?.message || error?.message || "Something went wrong")
        }
    }, [blockUnblockAdmin])

    const handleDelete = useCallback(async (id) => {
        try {
            if (!id) {
                throw new Error("Admin ID is required")
            }
            const data = {
                adminId: id
            }
            await deleteAdmin(data).unwrap().then((res) => {
                if (res?.success) {
                    toast.success(res?.message || "Admin deleted successfully")
                } else {
                    throw new Error(res?.message || "Something went wrong")
                }
            })
        } catch (error) {
            toast.error(error?.data?.message || error?.message || "Something went wrong")
        }
    }, [deleteAdmin])

    const handleEdit = useCallback((record) => {
        setEditId(record)
        setOpenEdit(true)
    }, [])

    return (
        <>
            <Table
                rowKey="_id"
                bordered
                columns={adminTableColumn({ handleBlock, handleDelete, handleEdit })}
                dataSource={data}
                scroll={{ x: "max-content" }}
                loading={loading}
                pagination={false}
            />
            <Modal
                title="Edit Admin"
                open={openEdit}
                centered
                onCancel={hideEdit}
                footer={null}
                closeIcon={false}
            >
                <AdminForm openEdit={openEdit} hide={hideEdit} data={editId} />
            </Modal>
        </>
    )
}

