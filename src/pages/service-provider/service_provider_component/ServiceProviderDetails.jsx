import { Card, Modal } from 'antd'
import React, { useState } from 'react'
import { BsPersonBoundingBox } from 'react-icons/bs'
import { CgTime } from 'react-icons/cg'
import { FaAddressBook, FaBuilding, FaGlobe } from 'react-icons/fa'
import { MdRoomService } from 'react-icons/md'
import { useGetServiceProviderByIdQuery } from '../../../RTK/services/dashboard/safe-user/admins/serviceProvdiers/serviceProvdiersApi'
import Loading from '../../../components/common/Loading'
import { baseUrl } from '../../../utils/optimizationFunction'
import { PiIdentificationBadge } from 'react-icons/pi'


const Info = ({ title, value, icon }) => {
  return (
    <div className='text-gray-600 font-medium flex items-start gap-2 mb-2'>
      <div className='flex items-center gap-2'>{icon}{title}:</div>
      <div className='text-[var(--primary-color)]'>{value}</div>
    </div>
  )
}

function ServiceProviderDetails({ open = false, hide, providerId }) {
  const [preview, setPreview] = useState(null);
  const { data: providerDetails, isLoading, isError } = useGetServiceProviderByIdQuery(providerId, {
    skip: !providerId,
  });

  const record = providerDetails?.data;
  const BASE_URL = `${baseUrl}/`;

  const workingHoursDisplay = (
    <div>
      {(record?.workingHours && record.workingHours.length > 0) ? (
        record.workingHours.map((wh, index) => (
          <div key={index}>{wh.day}: {wh.startTime} - {wh.endTime}</div>
        ))
      ) : (
        "N/A"
      )}
    </div>
  );

  const InfoData = [
    { title: "Provider ID", value: record?._id || "N/A", icon: <PiIdentificationBadge /> },
    { title: "Company name", value: record?.companyName || "N/A", icon: <FaBuilding /> },
    { title: "Company address", value: record?.serviceLocation || "N/A", icon: <FaAddressBook /> },
    { title: "Web site", value: record?.website || "N/A", icon: <FaGlobe /> },
    { title: "Service Category", value: record?.serviceCategories?.map(c => c.name).join(' • ') || "N/A", icon: <MdRoomService /> },
    { title: "Working hours", value: workingHoursDisplay, icon: <CgTime /> },
    { title: "Contact person", value: record?.contactPerson || "N/A", icon: <BsPersonBoundingBox /> },
  ]

  return (
    <Modal width={600} centered open={open} footer={null} onCancel={hide}>
      {isLoading && <Loading />}
      {isError && <p>Error loading provider details.</p>}
      {record && !isLoading && !isError && (
        <>
          <Card>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-24 h-20">
                <img src={record?.profile_image ? `${BASE_URL}${record.profile_image.replace(/\\/g, "/")}` : "https://placehold.net/avatar.svg?text=EJ&bg=212121"} alt={record?.authId?.name} className="w-full h-full object-cover" />
              </div>
              <div className="w-full">
                <h2 className="font-semibold text-lg">{record?.authId?.name}</h2>
                <p className="text-gray-600">{record?.authId?.email}</p>
                <p className="text-gray-600">{record?.authId?.phoneNumber || "N/A"}</p>
                {/* <p className="text-gray-500 text-sm">{record?.serviceLocation}</p> */}
              </div>
            </div>
          </Card>
          <Card style={{ marginTop: "1rem" }}>
            {InfoData.map((item, index) => (
              <Info key={index} title={item.title} value={item.value} icon={item.icon} />
            ))}
          </Card>
          <Card style={{ marginTop: "1rem" }}>
            <h1 className='text-lg font-semibold mb-2'>Attachments</h1>
            <div className='grid grid-cols-2 gap-4'>
              {record?.attachments?.length > 0 ? (
                record.attachments.map((attachment, index) => (
                  <div key={index}>
                    <img
                      src={`${BASE_URL}${attachment.replace(/\\/g, "/")}`}
                      alt={`${record?.authId?.name} attachment ${index + 1}`}
                      className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-90"
                      onClick={() => setPreview(`${BASE_URL}${attachment.replace(/\\/g, "/")}`)}
                    />
                  </div>
                ))
              ) : (
                <p>No attachments found.</p>
              )}
            </div>
          </Card>
        </>
      )}

      <Modal
        open={!!preview}
        footer={null}
        onCancel={() => setPreview(null)}
      >
        <img
          src={preview}
          alt="Preview"
          className="w-full h-auto rounded"
        />
      </Modal>

    </Modal>
  )
}

export default ServiceProviderDetails