import React, { useState } from "react";
import { Button } from "antd";
import { FaCameraRetro } from "react-icons/fa6";
import ProfileEdit from "../../components/profile-component/ProfileEdit.jsx";
import ChangePassword from "../../components/profile-component/ChangePassword.jsx";
import { useSelector } from "react-redux";
import { useGetSuperAdminProfileQuery } from "../../RTK/services/profileApis/superAdminProfileApis.js";
import { useGetProfileAdminQuery } from "../../RTK/services/dashboard/authorised-teams/admins/adminApis.js";
import { imageUrl } from "../../utils/optimizationFunction.js";

const Tabs = ["Edit Profile", "Change Password"];

const Profile = () => {
  const [tab, setTab] = useState(Tabs[0]);
  const { user } = useSelector((state) => state.auth);
  const { data: superAdminProfile } = useGetSuperAdminProfileQuery(undefined, { skip: user?.authId?.role !== "SUPER_ADMIN" })
  const { data: adminProfile } = useGetProfileAdminQuery(undefined, { skip: user?.authId?.role !== "ADMIN" })


  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
      localStorage.setItem("image", e.target.files[0].name);
    }
  };


  const profileImage = image
    ? URL.createObjectURL(image)
    : user?.authId?.role === "SUPER_ADMIN" ? superAdminProfile?.data?.profile_image
      ? imageUrl(superAdminProfile?.data?.profile_image)
      : "https://placehold.co/400"
      : adminProfile?.data?.profile_image
        ? imageUrl(adminProfile?.data?.profile_image)
        : "https://placehold.co/400";

  return (
    <div className="rounded p-4">
      <div className="max-w-[700px] mx-auto  p-4 rounded-md">
        <div className="w-full flex items-center justify-center">
          <div
            onClick={() => {
              if (tab === "Edit Profile") {
                document.getElementById("fileInput").click();
              }
            }}
            className="w-24 h-24 border-2 border-black p-1 cursor-pointer rounded-full relative"
          >
            <img
              className="w-full h-full object-cover rounded-full"
              src={profileImage}
              alt="Profile"
            />
            {tab === "Edit Profile" && (
              <button
                aria-label="Edit Profile Picture"
                className="absolute right-0 bottom-2 rounded-full bg-[var(--primary-color)]  p-2"
              >
                <FaCameraRetro
                  size={12}
                  className="text-black cursor-pointer"
                />
              </button>
            )}

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <p className="text-2xl text-center text-black mt-2">
          {user?.authId?.role === "SUPER_ADMIN" ? superAdminProfile?.data?.name : adminProfile?.data?.name || "User Name"}
        </p>
      </div>

      {/* Tabs Section */}
      <div className="mx-auto p-1 border border-gray-300 rounded-sm !w-fit flex items-center justify-center my-3">
        {Tabs.map((item) => (
          <Button
            key={item}
            style={{ width: "200px", justifyContent: "center" }}
            className={`${item === tab
              ? "!bg-[var(--secondary-color)] !text-black !border-0 !rounded-sm"
              : "!border-0 !rounded-none !text-black !border-white !bg-transparent"
              }`}
            onClick={() => setTab(item)}
          >
            {item}
          </Button>
        ))}
      </div>

      <div className="max-w-lg mx-auto bg-[var(--black-200)] p-4 rounded-md">
        {tab === "Edit Profile" ? (
          <ProfileEdit
            image={image}
            defaultImage={"https://placehold.co/400"}
            data={user?.authId?.role === "SUPER_ADMIN" ? superAdminProfile?.data : adminProfile?.data}
          />
        ) : (
          <ChangePassword />
        )}
      </div>
    </div>
  );
};

export default Profile;
