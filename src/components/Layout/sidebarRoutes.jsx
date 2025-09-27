import React from "react";
import {
    FiHome,
    FiUsers,
    FiList,
    FiLock,
    FiFileText,
    FiUser,
} from "react-icons/fi";
import {
    FaStopwatch,
    FaUserCog,
    FaQuestionCircle,
    FaUser as FaUserSolid,
} from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { MdHomeRepairService } from "react-icons/md";

export const menuItems = [
    { path: "/", name: "Dashboard", icon: <FiHome className="h-5 w-5" /> },
    {
        path: "/awaiting-requests",
        name: "Awaiting Requests",
        icon: <FaStopwatch className="h-5 w-5" />,
    },
    {
        path: "/matched-services",
        name: "All Services",
        icon: <MdHomeRepairService className="h-5 w-5" />,
    },
    {
        path: "/service-provider",
        name: "Service Provider",
        icon: <FaUserCog className="h-5 w-5" />,
    },
    {
        path: "/sign-up-user-request",
        name: "Sign Up Request",
        icon: <FaUserSolid className="h-5 w-5" />,
    },
    {
        path: "/user-management",
        name: "User Management",
        icon: <FiUsers className="h-5 w-5" />,
    },
    {
        path: "/categories-management",
        name: "Category Management",
        icon: <FiList className="h-5 w-5" />,
    },
    {
        path: "/admin",
        name: "Admin Management",
        icon: <RiAdminFill className="h-5 w-5" />,
    },
    {
        path: "/faq",
        name: "FAQ",
        icon: <FaQuestionCircle className="h-5 w-5" />,
    },
    {
        path: "/privacy-policy",
        name: "Privacy Policy",
        icon: <FiLock className="h-5 w-5" />,
    },
    {
        path: "/terms",
        name: "Terms & Conditions",
        icon: <FiFileText className="h-5 w-5" />,
    },
    {
        path: "/profile",
        name: "Profile",
        icon: <FiUser className="h-5 w-5" />,
    },
];

export const superAdminMenuItems = [
    { path: "/", name: "Dashboard", icon: <FiHome className="h-5 w-5" /> },
    {
        path: "/awaiting-requests",
        name: "Awaiting Requests",
        icon: <FaStopwatch className="h-5 w-5" />,
    },
    {
        path: "/matched-services",
        name: "All Services",
        icon: <MdHomeRepairService className="h-5 w-5" />,
    },
    {
        path: "/service-provider",
        name: "Service Provider",
        icon: <FaUserCog className="h-5 w-5" />,
    },
    {
        path: "/sign-up-user-request",
        name: "Sign Up Request",
        icon: <FaUserSolid className="h-5 w-5" />,
    },
    {
        path: "/user-management",
        name: "User Management",
        icon: <FiUsers className="h-5 w-5" />,
    },
    {
        path: "/categories-management",
        name: "Category Management",
        icon: <FiList className="h-5 w-5" />,
    },
    {
        path: "/admin",
        name: "Admin Management",
        icon: <RiAdminFill className="h-5 w-5" />,
    },
    {
        path: "/faq",
        name: "FAQ",
        icon: <FaQuestionCircle className="h-5 w-5" />,
    },
    {
        path: "/privacy-policy",
        name: "Privacy Policy",
        icon: <FiLock className="h-5 w-5" />,
    },
    {
        path: "/terms",
        name: "Terms & Conditions",
        icon: <FiFileText className="h-5 w-5" />,
    },
    {
        path: "/profile",
        name: "Profile",
        icon: <FiUser className="h-5 w-5" />,
    },
];
