import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut, FiX, FiSettings } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { logout } from '../../RTK/slices/authSlice';

const ProfileSidebar = ({ isOpen, onClose, user }) => {
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        // Check if the click is not on the profile image that opens the sidebar
        if (!event.target.closest('.profile-image-trigger')) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose}></div>
      
      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Account</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        
        {/* Profile Info */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl font-semibold text-gray-600">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{user?.name || 'User Name'}</h3>
              <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="p-2">
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiUser className="h-5 w-5 mr-3" />
            <span>My Profile</span>
          </Link>
          
          <Link
            to="/settings"
            onClick={onClose}
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiSettings className="h-5 w-5 mr-3" />
            <span>Settings</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiLogOut className="h-5 w-5 mr-3" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;
