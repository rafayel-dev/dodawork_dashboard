import { Card } from "antd";
import React from "react";

const UserDeailsCard = ({ user_profile }) => {

    return (
        <Card>
            <div className="flex items-center gap-4 mb-4">
                <div className="w-24 h-20">
                    <img src={user_profile?.avatar} alt={user_profile?.name} className="w-full h-full object-cover" />
                </div>
                <div className="w-full">
                    <h2 className="font-semibold text-lg">{user_profile?.name}</h2>
                    <p className="text-gray-600">{user_profile?.email}</p>
                    <p className="text-gray-600">{user_profile?.phoneNumber}</p>
                    <p className="text-gray-500 text-sm">{user_profile?.location}</p>
                </div>
            </div>

            {/* <Divider /> */}

            {/* Request Details */}
            {/* <div className="mb-4">
                <h3 className="font-semibold text-base mb-2">Request Details</h3>
                <p><span className="font-medium text-base text-[var(--primary-color)]">Request ID:</span> {request_details.request_id}</p>
                <p><span className="font-medium text-base text-[var(--primary-color)]">Service Type:</span> {request_details.service_type}</p>
                <p><span className="font-medium text-base text-[var(--primary-color)]">Date & Time:</span> {request_details.date_time}</p>
                <p><span className="font-medium text-base text-[var(--primary-color)]">Priority:</span> {request_details.priority}</p>
            </div> */}

            {/* Service Image */}
            {/* <div className="mb-4">
                <h3 className="font-semibold text-base mb-2">Service Image</h3>
                {request_details.video ?
                    <video controls src={request_details.service_image_or_video} alt="Service Image" className="w-72 h-40 object-cover" />
                    :
                    <img src={request_details.service_image_or_video} alt="Service Image" className="w-72 h-40 object-cover" />}
            </div> */}

            {/* <Divider /> */}

            {/* Actions */}
            {/* <div className="flex gap-3">
                <Button
                    style={{ backgroundColor: "var(--primary-color)", color: "#fff" }}
                >
                    Match Provider
                </Button>
                <Button
                    style={{ backgroundColor: "red", color: "#fff" }}
                >
                    Cancel Request
                </Button>
            </div> */}
        </Card>
    );
};

export default UserDeailsCard;
