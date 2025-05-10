import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice'; // adjust the path as needed

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', to: '/dashboard/admin' },
    { label: 'Logout', isLogout: true },
  ];

  return (
    <div className=" bg-[#f5f7fa] text-gray-800 font-sans">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <Link to='/dashboard/admin'>
          <h1 className="text-2xl font-bold tracking-wide text-[#1b263b]">
            Admin Dashboard
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="space-x-3 hidden md:flex">
          {navItems.map(({ label, to, isLogout }, idx) =>
            isLogout ? (
              <button
                key={idx}
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                {label}
              </button>
            ) : (
              <Link
                key={idx}
                to={to}
                className="px-4 py-2 rounded border border-[#1b263b] text-[#1b263b] hover:bg-[#1b263b] hover:text-white transition"
              >
                {label}
              </Link>
            )
          )}
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
          {navItems.map(({ label, to, isLogout }, idx) =>
            isLogout ? (
              <button
                key={idx}
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                {label}
              </button>
            ) : (
              <Link
                key={idx}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="block w-full px-4 py-2 rounded border border-[#1b263b] text-[#1b263b] hover:bg-[#1b263b] hover:text-white transition"
              >
                {label}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Header;
