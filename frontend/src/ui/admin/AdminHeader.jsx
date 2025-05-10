import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { logout } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { handleSuccess } from '../../utils/Message';

const AdminDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch=useDispatch()

  const navItems = [
    { label: 'Manage Students', path: '/dashboard/admin/students' },
    { label: 'Library History', path: '/dashboard/admin/libraryHistory' },
    { label: 'Fees History', path: '/dashboard/admin/fees' },
    { label: 'Staff & Librarians', path: '/dashboard/admin/staffs' },
    { label: 'Logout', isLogout: true },
  ];

  const dashboardBoxes = [
    {
      title: 'Manage Students',
      desc: 'Add, edit, and manage student records.',
      iconColor: 'bg-indigo-600',
      path: '/dashboard/admin/students',
    },
    {
      title: 'Manage Library History',
      desc: 'Review and update library records.',
      iconColor: 'bg-blue-600',
      path: '/dashboard/admin/libraryHistory',
    },
    {
      title: 'Manage Fees History',
      desc: 'Track and update student fees history.',
      iconColor: 'bg-emerald-600',
      path: '/dashboard/admin/fees',
    },
    {
      title: 'Manage Office Staff & Librarians',
      desc: 'Control user access and manage staff.',
      iconColor: 'bg-purple-600',
      path: '/dashboard/admin/staffs',
    },
  ];

  const handleLogout = () => {

    dispatch(logout())
    handleSuccess("logout Sucessfully")
    navigate("/")

    
    
   
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-gray-800 font-sans">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold tracking-wide text-[#1b263b]">Admin Dashboard</h1>

        {/* Desktop Menu */}
        <div className="space-x-3 hidden md:flex">
          {navItems.map(({ label, isLogout, path }, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (isLogout) {
                  handleLogout();
                } else {
                  navigate(path);
                }
              }}
              className={`px-4 py-2 rounded transition ${
                isLogout
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'border border-[#1b263b] text-[#1b263b] hover:bg-[#1b263b] hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#1b263b] text-2xl focus:outline-none"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow px-6 py-4 space-y-2">
          {navItems.map(({ label, isLogout, path }, idx) => (
            <button
              key={idx}
              onClick={() => {
                setMenuOpen(false);
                if (isLogout) {
                  handleLogout();
                } else {
                  navigate(path);
                }
              }}
              className={`w-full text-left px-4 py-2 rounded transition ${
                isLogout
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'border border-[#1b263b] text-[#1b263b] hover:bg-[#1b263b] hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Main Section - Dashboard Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-16 py-14">
        {dashboardBoxes.map(({ title, desc, iconColor, path }, i) => (
          <div
            key={i}
            onClick={() => navigate(path)}
            className="cursor-pointer bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            <div
              className={`w-12 h-12 ${iconColor} rounded-full flex items-center justify-center text-white text-lg font-bold mb-4`}
            >
              {title.split(' ')[0][0]}
            </div>
            <h2 className="text-lg font-semibold mb-1">{title}</h2>
            <p className="text-sm text-gray-600">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
