import React, { useState } from "react";
import { FiMail, FiGlobe, FiPhone } from "react-icons/fi";
import { FaBuilding, FaUserTie, FaClock, FaCalendar } from "react-icons/fa";
import { Card, Divider, Collapse, Modal } from "antd";
import { imageUrl as getImageUrl } from "../../../utils/optimizationFunction";

const { Panel } = Collapse;

const formatKey = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const formatWorkingHours = (hours) => {
  if (!Array.isArray(hours) || hours.length === 0) {
    return "Not available";
  }
  return hours.map(h => `${h.day}: ${h.startTime} - ${h.endTime}`).join('; ');
};

function RequestedUser({ record }) {
  const [preview, setPreview] = useState(null);

  if (!record) return null;

  const data = [
    { title: "Email :", value: record.email, icon: <FiMail /> },
    { title: "Website :", value: record.website_link, icon: <FiGlobe />, isLink: true },
    { title: "Company :", value: record.company_name, icon: <FaBuilding /> },
    { title: "Contact :", value: record.contact_person, icon: <FaUserTie /> },
    { title: "Working Hours :", value: formatWorkingHours(record.working_hours), icon: <FaClock /> },
    // { title: "Phone", value: record.phone, icon: <FiPhone /> },
    { title: "Request Date :", value: new Date(record.updatedAt).toLocaleDateString(), icon: <FaCalendar /> },
    // { title: "Request Time", value: new Date(record.updatedAt).toLocaleTimeString(), icon: <FaClock /> },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Avatar + Name */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={record.avatar}
          alt={record.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-[#F57C00] shadow-sm"
        />
        <div>
          <h2 className="text-xl font-semibold text-[#111111]">{record.name}</h2>
          <p className="text-sm text-gray-500">{record.category} • {record.sub_category}</p>
        </div>
      </div>

      <Divider />

      {/* Info List */}
      <div className="space-y-3 text-sm">
        {data.map((item, index) => (
          <InfoRow
            key={index}
            icon={item.icon}
            label={item.title}
            value={item.value}
            isLink={item.isLink}
          />
        ))}
      </div>

      {/* Attachments Collapse */}
      <Card style={{ marginTop: "1.5rem" }}>
        <Collapse>
          <Panel header="Attachments" key="1">
            <div className="grid grid-cols-2 gap-4">
              {record.attachments?.length > 0 ? (
                record.attachments.map((attachment, index) => {
                  const imgUrl = getImageUrl(attachment.replace(/\\/g, "/"));
                  return (
                    <img
                      key={index}
                      src={imgUrl}
                      alt={`Attachment ${index + 1}`}
                      className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-90"
                      onClick={() => setPreview(imgUrl)}
                    />
                  );
                })
              ) : (
                <p>No attachments found.</p>
              )}
            </div>
          </Panel>
        </Collapse>
      </Card>
      <Divider />
      {/* Pending Updates Collapse */}
      {record.pendingUpdates && Object.keys(record.pendingUpdates).length > 0 && (
        <Card style={{ marginTop: "1.5rem" }}>
          <Collapse>
            <Panel header="Pending Updates" key="1">
              <div className="space-y-4 text-sm">
                {Object.entries(record.pendingUpdates).map(([key, value]) => {
                  if (value === null || value === undefined || (Array.isArray(value) && value.length === 0) || value === "") {
                    return null;
                  }

                  // --- Handle Attachment-like fields ---
                  if (['attachments', 'licenses', 'certificates'].includes(key) && Array.isArray(value)) {
                    return (
                      <div key={key}>
                        <p className="text-gray-600 font-medium mb-2">{formatKey(key)}:</p>
                        <div className="grid grid-cols-2 gap-4">
                          {value.map((attachment, index) => {
                            const imgUrl = getImageUrl(attachment.replace(/\\/g, "/"));
                            return (
                              <img
                                key={index}
                                src={imgUrl}
                                alt={`${formatKey(key)} ${index + 1}`}
                                className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-90"
                                onClick={() => setPreview(imgUrl)}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  // --- Handle other field types ---
                  let displayValue = value;
                  if (typeof value === 'string' && (key === 'profile_image' || key.toLowerCase().includes('image'))) {
                    const imgUrlForLink = getImageUrl(value.replace(/\\/g, "/"));
                    displayValue = (
                      <a href={imgUrlForLink} target="_blank" rel="noopener noreferrer" className="text-[#111111] font-semibold hover:text-[#F57C00] transition">
                        View Image
                      </a>
                    );
                  } else if (typeof value === 'boolean') {
                    displayValue = value ? 'Yes' : 'No';
                  } else if (key === 'workingHours' && Array.isArray(value)) {
                    displayValue = formatWorkingHours(value);
                  } else if (Array.isArray(value)) {
                    displayValue = value.join(', ');
                  }

                  return (
                    <div key={key} className="flex items-center justify-between">
                      <p className="text-gray-600 font-medium">{formatKey(key)}:</p>
                      <div className="text-[#111111] font-semibold text-right">{displayValue}</div>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </Collapse>
        </Card>
      )}

      {/* Image Preview Modal */}
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
    </div>
  );
}

function InfoRow({ icon, label, value, isLink }) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-2">
      {icon && <span className="text-[#F57C00] mt-0.5">{icon}</span>}

      <div className="flex gap-2 items-center">
        <p className="text-gray-600 font-medium">{label}</p>

        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#111111] font-semibold hover:text-[#F57C00] transition"
          >
            {value}
          </a>
        ) : (
          <p className="text-[#111111] font-semibold">{value}</p>
        )}
      </div>
    </div>
  );
}

export default RequestedUser;
