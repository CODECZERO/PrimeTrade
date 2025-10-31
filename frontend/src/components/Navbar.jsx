import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTasks, FaUser, FaSignOutAlt, FaUsers } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <FaTasks className="text-primary-600 text-2xl" />
              <span className="text-xl font-bold text-gray-900">TaskManager</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            
            {isAdmin() && (
              <Link
                to="/users"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <FaUsers />
                <span>Users</span>
              </Link>
            )}

            <div className="flex items-center space-x-2 border-l pl-4">
              <FaUser className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{user.username}</span>
              {isAdmin() && (
                <span className="badge bg-primary-100 text-primary-800">Admin</span>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
